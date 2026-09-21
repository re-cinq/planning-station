import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "planning-sync",
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
