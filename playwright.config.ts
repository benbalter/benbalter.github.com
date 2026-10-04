import { defineConfig, devices } from '@playwright/test';

/* Where `npm run preview:worker` (wrangler dev) listens. Keep in sync with
   that script's --port in package.json. Not 4321 (Astro's default, used by
   other local projects) or 8787 (wrangler's default), so Playwright never
   reuses some other project's server by accident. */
const WORKER_URL = 'http://127.0.0.1:8792';

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
  
  /* One worker per core on CI: tests hit a local static-asset Worker, so
     they're cheap to run side by side (385 tests took 1.7m at '50%', i.e. 2 workers) */
  workers: process.env.CI ? '100%' : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI 
    ? [['html', { open: 'never' }], ['list'], ['github']]
    : [['html', { open: 'never' }], ['list']],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || WORKER_URL,
    
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

  /* Configure projects for cross-browser testing.
   *
   * Chromium runs on every PR. WebKit + Firefox are opt-in via CROSS_BROWSER=1
   * so the default run stays fast and needs no extra browser binaries installed.
   * The site is zero-JS by default, but the handful of client scripts
   * (search modal, link previews, quote-share, view transitions) are exactly
   * where Safari/WebKit and Gecko quirks surface — run the full matrix on a
   * nightly job or locally: `CROSS_BROWSER=1 npm run test:e2e`
   * (first time: `npx playwright install webkit firefox`). */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    ...(process.env.CROSS_BROWSER
      ? [
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
          },
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
          },
        ]
      : []),
  ],

  /* Serve the built site through the production Worker before the tests.
   * `wrangler dev --local` runs worker/index.js on workerd with dist-astro/ as
   * its assets, so tests exercise what production serves: the Worker's
   * routing (Markdown content negotiation, POST /api/event), public/_headers,
   * the built _redirects, trailing-slash redirects, and the 404 page.
   * `astro preview` applies none of those. Local mode needs no Cloudflare
   * login; the ENGAGEMENT Analytics Engine binding is simulated locally.
   * CI starts the same server itself (see astro-e2e.yml) and sets BASE_URL,
   * and so can you, e.g. to test against an already-running server:
   * `BASE_URL=http://127.0.0.1:8792 npx playwright test`. Either way,
   * Playwright doesn't start one. `reuseExistingServer` skips the rebuild
   * when the Worker is already running on WORKER_URL. */
  webServer: process.env.CI || process.env.BASE_URL ? undefined : {
    command: 'npm run build && npm run preview:worker',
    url: WORKER_URL,
    reuseExistingServer: true,
    timeout: 180 * 1000,
  },
});
