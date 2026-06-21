const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'https://wario567.github.io/cradle-of-embers/?seed=cradle-of-embers',
    screenshot: 'on',
    video: 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
});
