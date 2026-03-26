// @ts-check
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
  webServer: {
    command: "python serve.py 3000",
    port: 3000,
    reuseExistingServer: true,
  },
  reporter: [["list"], ["json", { outputFile: "test-results.json" }]],
});
