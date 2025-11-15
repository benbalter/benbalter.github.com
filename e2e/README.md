# End-to-End Testing with Playwright

This directory contains comprehensive end-to-end tests for Ben Balter's website using [Playwright](https://playwright.dev/).

## Test Structure

* **`helpers.ts`**: Common test utilities and helper functions
* **`homepage.spec.ts`**: Tests for the homepage
* **`blog-posts.spec.ts`**: Tests for blog post pages
* **`resume.spec.ts`**: Tests for the resume page
* **`pages.spec.ts`**: Tests for static pages (About, Contact, Talks, Press)
* **`accessibility.spec.ts`**: Accessibility tests (WCAG compliance)
* **`performance.spec.ts`**: Performance and optimization tests
* **`seo.spec.ts`**: SEO and metadata tests

## Running Tests

### Prerequisites

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

> **Note:** The `libvips-dev` package (used for image processing in Jekyll via plugins like `jekyll-og-image`) is only required for CI/production builds that generate Open Graph images. For basic local e2e testing, you do **not** need to install `libvips-dev` unless you specifically want to test image generation features.

### Local Development

```bash
# Run all tests (starts Jekyll server automatically)
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Debug tests
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### Running Specific Tests

```bash
# Run a specific test file
npx playwright test homepage.spec.ts

# Run tests matching a pattern
npx playwright test --grep "accessibility"

# Run tests in a specific browser
npx playwright test --project=chromium
```

## Test Coverage

### Homepage Tests

* Page loads successfully
* Navigation and footer present
* Responsive design
* Semantic HTML structure
* Meta tags and SEO

### Blog Post Tests

* Post listing accessible
* Individual posts render correctly
* Metadata present
* Images have alt text
* Links are valid

### Resume Tests

* Page loads and displays content
* Work experience section present
* Contact information available
* Print-friendly layout

### Static Pages Tests

* About, Contact, Talks, and Press pages load
* Content is meaningful
* Navigation works
* Proper titles

### Accessibility Tests

* Basic WCAG compliance
* Heading hierarchy
* Lang attribute
* Skip links/main landmarks
* Form labels
* Button accessible names
* Link accessible text
* Keyboard navigation

### Performance Tests

* Load time within acceptable limits
* Reasonable number of requests
* JavaScript optimization
* Image optimization
* Asset caching
* Font loading

### SEO Tests

* Meta descriptions
* Open Graph tags
* Twitter Card tags
* Canonical URLs
* Proper title tags
* Robots meta tags
* Structured data (JSON-LD)
* Sitemap accessibility
* robots.txt
* RSS feed

## Configuration

The Playwright configuration is in [`playwright.config.ts`](../playwright.config.ts) at the root of the repository.

Key settings:

* **Base URL**: `http://localhost:4000` (can be overridden with `BASE_URL` env var)
* **Browser**: Chromium (Desktop Chrome)
* **Retries**: 2 retries on CI, 0 locally
* **Reporters**: HTML and list reporters, GitHub Actions reporter on CI

## CI Integration

Tests run automatically on every push via the GitHub Actions workflow at [`.github/workflows/playwright.yml`](../.github/workflows/playwright.yml).

The workflow:

1. Checks out the code
2. Sets up Ruby and Node.js
3. Builds the Jekyll site
4. Starts a Jekyll server
5. Runs Playwright tests
6. Uploads test reports as artifacts

## Writing New Tests

When adding new tests, follow these guidelines:

1. **Use helpers**: Import and use helper functions from `helpers.ts` for common checks
2. **Be specific**: Test specific functionality, not everything at once
3. **Be independent**: Tests should not depend on each other
4. **Use descriptive names**: Test names should clearly describe what they test
5. **Handle edge cases**: Consider missing content, error states, etc.
6. **Follow patterns**: Look at existing tests for patterns to follow

### Example Test

```typescript
import { test, expect } from '@playwright/test';
import { checkCommonElements, waitForFullLoad } from './helpers';

test.describe('New Feature', () => {
  test('should do something specific', async ({ page }) => {
    await page.goto('/some-page');
    await waitForFullLoad(page);
    
    // Your test assertions
    await expect(page.locator('.some-element')).toBeVisible();
  });
});
```

## Debugging

### Failed Tests

When tests fail, Playwright captures:

* Screenshots (on failure)
* Videos (on failure)
* Traces (on retry)

These are saved to:

* `test-results/` - Test output
* `playwright-report/` - HTML report

### Debug Mode

```bash
# Run in debug mode with Playwright Inspector
npm run test:e2e:debug

# Run specific test in debug mode
npx playwright test homepage.spec.ts --debug
```

### UI Mode

```bash
# Run in UI mode for interactive debugging
npm run test:e2e:ui
```

## Best Practices

1. **Keep tests fast**: Avoid unnecessary waits, use efficient selectors
2. **Keep tests reliable**: Use proper wait conditions, not fixed timeouts
3. **Keep tests maintainable**: Use helpers, avoid duplication
4. **Keep tests readable**: Clear names, good structure, comments when needed
5. **Run tests frequently**: Run locally before committing

## Resources

* [Playwright Documentation](https://playwright.dev/docs/intro)
* [Best Practices](https://playwright.dev/docs/best-practices)
* [Writing Tests](https://playwright.dev/docs/writing-tests)
* [Debugging Guide](https://playwright.dev/docs/debug)
