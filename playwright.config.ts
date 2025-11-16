import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Ben Balter's website
 * Tests both Jekyll and Next.js builds
 */
export default defineConfig({
  testDir: './e2e',
  
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Run tests in parallel on CI for faster execution */
  workers: process.env.CI ? 4 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI 
    ? [['html', { open: 'never' }], ['list'], ['github']]
    : [['html', { open: 'never' }], ['list']],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:4000',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
    
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
  /* For Jekyll tests: bundle exec jekyll serve */
  /* For Next.js tests: use BASE_URL=http://localhost:3000 with next dev */
  webServer: process.env.CI ? undefined : {
    command: process.env.TEST_NEXTJS ? 'npm run dev' : 'bundle exec jekyll serve',
    url: process.env.TEST_NEXTJS ? 'http://localhost:3000' : 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
