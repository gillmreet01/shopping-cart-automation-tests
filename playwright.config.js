// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1, // re-run a failed test once, in case the public demo site was slow
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry', // records a step-by-step trace for failed tests
    launchOptions: { slowMo: Number(process.env.SLOWMO) || 0 }, // e.g. SLOWMO=800 to watch tests slowly
  },
  // Cross-browser: every test runs once per project below
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // Uses the real Google Chrome installed on the machine (handy for watching tests with --headed)
    ...(process.env.CI ? [] : [{ name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }]),
  ],
});
