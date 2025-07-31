import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
        "**/*{.,-}test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
        "**/*{.,-}spec.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
        "**/coverage/**",
        "**/dist/**",
        "**/build/**",
      ],
    },
  },
});
