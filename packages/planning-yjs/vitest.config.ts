import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "planning-yjs",
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
