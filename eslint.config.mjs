import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import importX from "eslint-plugin-import-x";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import reLint from "@re-cinq/eslint-plugin-re-lint";

const TS_FILES = ["**/*.{ts,tsx}"];
const TEST_FILES = ["**/*.test.{ts,tsx}"];
const FIRST_PARTY_SCOPES = ["@re-cinq"];
const ENFORCE_MODULE = {
  specifier: "@re-cinq/planning-document/lib/enforce.js",
  sourceDir: "packages/planning-document/src",
};
const SPEC_ROOTS = ["specs", "adrs"];

const forbid = (specifiers, message) =>
  specifiers.map((specifier) => ({ specifier, message }));

const CONTRACT_ONLY =
  "The contract stays free of React, Yjs and editors (ADR-001).";
const NODE_ONLY = "The Yjs bridge runs in Node and the station pod (ADR-001).";
const BROWSER_ONLY = "The editor never reaches the server side (ADR-001).";
const SERVER_ONLY = "The sync library never renders UI (ADR-001).";

const FORBIDDEN_IMPORTS = {
  "packages/planning-document/src/**/*.ts": forbid(
    ["react", "react-dom", "yjs", "@blocknote", "@hocuspocus", "@hapi"],
    CONTRACT_ONLY,
  ),
  "packages/planning-yjs/src/**/*.ts": forbid(
    ["react", "react-dom", "@blocknote/react", "@hocuspocus", "@hapi"],
    NODE_ONLY,
  ),
  "packages/planning-editor/src/**/*.{ts,tsx}": forbid(
    ["@hocuspocus/server", "@hocuspocus/extension-database", "@hapi"],
    BROWSER_ONLY,
  ),
  "packages/planning-sync/src/**/*.ts": forbid(
    ["react", "react-dom", "@blocknote/react", "@hocuspocus/provider"],
    SERVER_ONLY,
  ),
};

const PRESET = reLint.configs.recommended({ tseslint, stylistic });

const ID_EXCEPTIONS = PRESET[0].rules["id-length"][1].exceptions;

// React requires PascalCase components and context providers; the preset's naming list has no React case.
const REACT_NAMING = [
  ...PRESET[0].rules["@typescript-eslint/naming-convention"],
  { selector: "function", format: ["camelCase", "PascalCase"] },
  {
    selector: "variable",
    filter: { regex: "Context$", match: true },
    format: ["PascalCase"],
  },
];

const WIRE_NAMING = [
  ...PRESET[0].rules["@typescript-eslint/naming-convention"],
  { selector: "objectLiteralMethod", format: null },
];

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/.vite/**",
      "docs/discussion-*.md",
    ],
  },

  {
    files: TS_FILES,
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node },
    },
  },

  ...PRESET.map((config) => ({
    ...config,
    files: config.name === "re-lint/recommended-tests" ? TEST_FILES : TS_FILES,
  })),

  {
    files: [
      "packages/planning-editor/src/**/*.{ts,tsx}",
      "apps/poc/src/**/*.{ts,tsx}",
    ],
    rules: { "@typescript-eslint/naming-convention": REACT_NAMING },
  },

  {
    // An agent op is keyed by its wire name, which is kebab-case.
    files: ["packages/planning-document/src/ops/*.ts"],
    rules: { "@typescript-eslint/naming-convention": WIRE_NAMING },
  },

  {
    files: TS_FILES,
    plugins: { "re-lint": reLint, "import-x": importX },
    settings: {
      "import-x/resolver": { typescript: { alwaysTryTypes: true } },
      "import-x/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx", ".mts", ".cts"],
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "import-x/no-cycle": ["error", { maxDepth: Infinity }],
      "no-nested-ternary": "error",
      "max-nested-callbacks": ["error", { max: 3 }],
      "max-lines-per-function": [
        "error",
        { max: 20, skipBlankLines: true, skipComments: true },
      ],

      "re-lint/prefer-enforce-true": [
        "error",
        { enforceModule: ENFORCE_MODULE },
      ],
      "re-lint/prefer-api-error": [
        "error",
        {
          enforceModule: { specifier: ENFORCE_MODULE.specifier },
          errorModules: [
            { root: "packages/planning-sync/src", path: "hapi/api-error.js" },
          ],
        },
      ],
      "re-lint/test-imports-its-subject": [
        "error",
        { firstPartyScopes: FIRST_PARTY_SCOPES },
      ],
      "re-lint/no-cross-layer-import": [
        "error",
        { firstPartyScopes: FIRST_PARTY_SCOPES },
      ],
      "re-lint/no-duplicate-code": [
        "error",
        {
          roots: ["packages", "apps"],
          minTokens: 50,
          ignore: ["**/dist/**", "**/*.d.ts", "**/node_modules/**"],
        },
      ],
      "re-lint/no-row-types-outside-models": [
        "error",
        { modelsDir: "packages/planning-sync/src/store" },
      ],
      "re-lint/no-io-in-view": [
        "error",
        { dataModules: ["@hocuspocus/provider", "yjs"] },
      ],
      "re-lint/no-inline-styles": "error",
      "re-lint/no-prop-mutation": "error",
      "re-lint/no-sql-in-web-ui": "error",
      "re-lint/default-export-matches-filename": "error",
      // "op" is the wire name of an agent op; "at" is a position in a diff.
      "id-length": [
        "error",
        { min: 3, exceptions: [...ID_EXCEPTIONS, "op", "at"] },
      ],
    },
  },

  ...Object.entries(FORBIDDEN_IMPORTS).map(([glob, forbidden]) => ({
    files: [glob],
    plugins: { "re-lint": reLint },
    rules: { "re-lint/no-forbidden-imports": ["error", { forbidden }] },
  })),

  {
    // A sync test drives the library with a real client, which is a provider.
    files: ["packages/planning-sync/src/**/*.test.ts"],
    plugins: { "re-lint": reLint },
    rules: {
      "re-lint/no-forbidden-imports": [
        "error",
        { forbidden: forbid(["react", "react-dom"], SERVER_ONLY) },
      ],
    },
  },

  {
    files: TEST_FILES,
    plugins: { "re-lint": reLint },
    rules: {
      "max-lines-per-function": "off",
      "re-lint/require-spec-link": ["error", { roots: SPEC_ROOTS }],
      "id-length": [
        "error",
        { min: 3, exceptions: [...ID_EXCEPTIONS, "op", "at", "on"] },
      ],
    },
  },

  {
    files: ["**/vitest.config.ts", "**/vite.config.ts"],
    rules: { "re-lint/default-export-matches-filename": "off" },
  },

  {
    files: ["specs/**/*.md", "adrs/**/*.md"],
    plugins: { markdown, "re-lint": reLint },
    language: "markdown/gfm",
    rules: {
      "re-lint/require-intro-paragraph": "error",
      "re-lint/require-statement-links": "error",
      "re-lint/require-status-matches-coverage": "error",
      "re-lint/no-dead-md-links": "error",
    },
  },

  {
    files: ["README.md", "packages/*/README.md"],
    plugins: { markdown, "re-lint": reLint },
    language: "markdown/gfm",
    rules: { "re-lint/no-dead-md-links": "error" },
  },

  {
    files: ["**/*.{css,scss}"],
    plugins: { css, "re-lint": reLint },
    language: "css/css",
    languageOptions: { tolerant: true },
    rules: { "re-lint/prefer-design-tokens": "error" },
  },
);
