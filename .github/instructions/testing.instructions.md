---
applyTo: ["**/*.test.{js,ts,jsx,tsx}", "e2e/**/*", "playwright*.config.ts"]
excludeAgent: "code-review"
---

# Testing Instructions

When working with tests, follow these guidelines to ensure quality and reliability.

## Test Types

### End-to-End Tests (`e2e/`)

* Playwright tests for the Astro build
* Test user flows and interactions
* Verify pages render correctly
* Check responsive design

```bash
npm run test:e2e                  # E2E tests
```

### Vitest Unit Tests

* Unit tests for TypeScript utilities and functions
* Place test files alongside source: `src/**/*.{test,spec}.ts`
* Run with `npm run test:vitest`

```bash
npm run test:vitest               # Run all unit tests
npm run test:vitest:watch         # Watch mode
npm run test:vitest:coverage      # With coverage
```

## Writing Tests

### Vitest Test Structure

```typescript
import { describe, it, expect } from 'vitest';

describe('Feature', () => {
  it('does something expected', () => {
    expect(actual).toBe(expected);
  });
});
```

### Playwright Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature', () => {
  test('does something expected', async ({ page }) => {
    await page.goto('/path');
    await expect(page.locator('.selector')).toBeVisible();
  });
});
```

## Test Best Practices

### General Guidelines

1. **Clear Names**: Use descriptive test names that explain what is being tested
2. **One Assertion**: Each test should ideally test one thing
3. **Independence**: Tests should not depend on each other
4. **Repeatability**: Tests should produce the same results every time
5. **Fast**: Keep tests fast by minimizing external dependencies

### E2E Guidelines

* Test critical user journeys first
* Use page object pattern for complex pages
* Make tests resilient to minor UI changes
* Test accessibility where applicable
* Keep tests focused on user behavior, not implementation

## Test Data

* Use fixtures for consistent test data
* Keep test data minimal but realistic
* Don't rely on production data
* Clean up test data after tests run

## Running Tests Locally

### Before Committing

```bash
# Run all tests
npm test                           # Type check + linting
npm run test:e2e                   # E2E tests (if applicable)

# Run specific test suites
npm run lint                       # Only linting
npm run test:vitest                # Only unit tests
```

### CI/CD

* All tests run automatically on push
* Tests must pass before merging
* Check CI logs for failures
* Fix test failures promptly

## Debugging Tests

### Vitest

```bash
npm run test:vitest -- --reporter=verbose  # Verbose output
npm run test:vitest -- path/to/file.test.ts # Run specific file
```

### Playwright

```bash
npm run test:e2e -- --debug        # Debug mode
npm run test:e2e -- --headed       # Run with browser visible
npx playwright codegen             # Generate test code
```

## Test Coverage

* Aim for meaningful coverage, not 100%
* Focus on critical paths and edge cases
* Test error handling and validation
* Don't test framework code

## Common Testing Patterns

### Testing Utilities

```typescript
import { describe, it, expect } from 'vitest';
import { myUtility } from './myUtility';

describe('myUtility', () => {
  it('handles normal input', () => {
    expect(myUtility('input')).toBe('expected');
  });
  
  it('handles edge cases', () => {
    expect(myUtility('')).toBe('');
  });
});
```

### Testing Page Content

```typescript
import { test, expect } from '@playwright/test';

test('page renders correctly', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('h1')).toContainText('About');
});
```

## When Tests Fail

1. **Read the error message** - it usually tells you exactly what's wrong
2. **Check recent changes** - did you break something?
3. **Run locally** - reproduce the failure on your machine
4. **Isolate the problem** - run just the failing test
5. **Fix the root cause** - don't just make the test pass
6. **Verify the fix** - ensure related tests still pass

## Test Maintenance

* Update tests when functionality changes
* Remove tests for removed features
* Keep test code as clean as production code
* Refactor duplicated test code
* Document complex test setups

Remember: **Good tests give confidence**. Write tests that catch real problems without being fragile.
