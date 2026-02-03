import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Ben Balter's website
 * Tests the Astro build
 * 
 * Performance optimizations:
 * - Increased workers for parallel test execution
 * - Disabled video recording (screenshots provide sufficient debugging info)
 * - Reduced retries (static sites have fewer flaky tests)
 * - Optimized timeouts for static site performance
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only - reduced from 2 to 1 since static sites have fewer flaky tests */
  retries: process.env.CI ? 1 : 0,
  
  /* Increased workers for faster parallel execution on CI */
  workers: process.env.CI ? '50%' : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI 
    ? [['html', { open: 'never' }], ['list'], ['github']]
    : [['html', { open: 'never' }], ['list']],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:4321',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshot on failure - provides sufficient debugging info */
    screenshot: 'only-on-failure',
    
    /* Video disabled for performance - screenshots are sufficient for debugging */
    video: 'off',
    
    /* Reduced timeout for actions - most actions complete quickly */
    actionTimeout: 5000,
    
    /* Reduced timeout for navigation - static site loads fast */
    navigationTimeout: 15000,
  },

  /* Configure project for Chromium browser */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.CI ? undefined : {
    command: 'npm run astro:dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
