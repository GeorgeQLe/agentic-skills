import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "layer1",
          include: ["layer1/**/*.test.ts"],
        },
      },
      {
        test: {
          name: "layer2",
          include: ["layer2/**/*.test.ts"],
          testTimeout: 300_000,
        },
      },
    ],
  },
});
