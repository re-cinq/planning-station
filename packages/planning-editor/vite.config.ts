import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

import packageJson from "./package.json" with { type: "json" };

const EXTERNAL = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
  "react/jsx-runtime",
];

const isStylesheet = (id: string) => id.endsWith(".css");

const isExternal = (id: string) =>
  !isStylesheet(id) &&
  EXTERNAL.some((name) => id === name || id.startsWith(`${name}/`));

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.json",
      exclude: [
        "src/**/*.test.tsx",
        "src/**/*.test.ts",
        "src/testing/fixtures.tsx",
        "*.config.ts",
      ],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        testing: "src/testing/index.ts",
        "transports/hocuspocus": "src/transports/hocuspocus.ts",
      },
      formats: ["es"],
      cssFileName: "style",
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: { external: isExternal },
  },
});
