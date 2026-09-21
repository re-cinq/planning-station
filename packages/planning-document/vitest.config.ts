import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "planning-document",
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
