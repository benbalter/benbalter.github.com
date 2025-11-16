import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Ben Balter's website
 * Tests both Jekyll and Next.js builds
 */

// Detect if testing Next.js (port 3000 or TEST_NEXTJS env var)
const isNextJsTest = process.env.BASE_URL?.includes(':3000') || process.env.TEST_NEXTJS;

export default defineConfig({
  testDir: './e2e',
  
  /* Only run Next.js-specific tests when testing Next.js build */
  testMatch: isNextJsTest 
    ? '**/nextjs-*.spec.ts'
    : '**/*.spec.ts',
  
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
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
    
    /* Increase timeout for actions */
    actionTimeout: 10000,
    
    /* Increase timeout for navigation */
    navigationTimeout: 30000,
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
