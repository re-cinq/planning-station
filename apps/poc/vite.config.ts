import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const WORKSPACE_SOURCES: Readonly<Record<string, string>> = {
  "@re-cinq/planning-document": "planning-document/src/index.ts",
  "@re-cinq/planning-document/testing":
    "planning-document/src/testing/index.ts",
  "@re-cinq/planning-yjs": "planning-yjs/src/index.ts",
  "@re-cinq/planning-editor": "planning-editor/src/index.ts",
  "@re-cinq/planning-editor/transports/hocuspocus":
    "planning-editor/src/transports/hocuspocus.ts",
};

// Exact-match aliases: a prefix alias would rewrite "/testing" onto index.ts.
const alias = Object.entries(WORKSPACE_SOURCES).map(([specifier, path]) => ({
  find: new RegExp(`^${specifier}$`),
  replacement: fileURLToPath(
    new URL(`../../packages/${path}`, import.meta.url),
  ),
}));

// Resolves the workspace packages to their sources so edits to them reload the page.
export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  server: { port: 5173 },
});
