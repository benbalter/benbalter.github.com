---
applyTo: ["**/*.test.{js,ts,jsx,tsx}", "spec/**/*", "e2e/**/*", "playwright*.config.ts"]
excludeAgent: "code-review"
---

# Testing Instructions

When working with tests, follow these guidelines to ensure quality and reliability.

## Test Types

### RSpec Tests (`spec/`)

- Ruby unit tests for Jekyll plugins and build process
- Test front matter requirements
- Verify Jekyll builds successfully
- Check HTML output structure

```bash
bundle exec rspec                  # Run all RSpec tests
bundle exec rspec spec/file_spec.rb # Run specific test
rake test                          # Run RSpec + HTML Proofer
```

### End-to-End Tests (`e2e/`)

- Playwright tests for Jekyll and Next.js builds
- Test user flows and interactions
- Verify pages render correctly
- Check responsive design

```bash
npm run test:e2e:jekyll           # E2E tests for Jekyll
npm run test:e2e:nextjs           # E2E tests for Next.js
npm run test:e2e                  # All E2E tests
```

### HTML Validation

- html-proofer checks generated HTML
- Validates links, images, and structure
- Ensures accessibility baseline

```bash
rake test                          # Includes html-proofer
```

## Writing Tests

### RSpec Test Structure

```ruby
# frozen_string_literal: true

require 'spec_helper'

RSpec.describe 'Feature' do
  context 'when condition is met' do
    it 'produces expected result' do
      expect(actual).to eq(expected)
    end
  end

  context 'when condition is not met' do
    it 'handles gracefully' do
      expect { action }.not_to raise_error
    end
  end
end
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

### RSpec Guidelines

- Use `context` to group related tests
- Use `describe` for the feature/class being tested
- Use `it` for individual test cases
- Use `let` for test data setup
- Use `before` hooks sparingly

### E2E Guidelines

- Test critical user journeys first
- Use page object pattern for complex pages
- Make tests resilient to minor UI changes
- Test accessibility where applicable
- Keep tests focused on user behavior, not implementation

## Test Data

- Use fixtures for consistent test data
- Keep test data minimal but realistic
- Don't rely on production data
- Clean up test data after tests run

## Running Tests Locally

### Before Committing

```bash
# Run all tests
rake test                          # RSpec + HTML validation
npm test                           # Linting
npm run test:e2e                   # E2E tests (if applicable)

# Run specific test suites
bundle exec rspec                  # Only RSpec
npm run lint                       # Only linting
```

### CI/CD

- All tests run automatically on push
- Tests must pass before merging
- Check CI logs for failures
- Fix test failures promptly

## Debugging Tests

### RSpec

```bash
bundle exec rspec --format documentation  # Verbose output
bundle exec rspec --fail-fast             # Stop on first failure
bundle exec rspec spec/file:42            # Run test at line 42
```

### Playwright

```bash
npm run test:e2e:jekyll -- --debug        # Debug mode
npm run test:e2e:jekyll -- --headed       # Run with browser visible
npx playwright codegen                    # Generate test code
```

## Test Coverage

- Aim for meaningful coverage, not 100%
- Focus on critical paths and edge cases
- Test error handling and validation
- Don't test framework code

## Common Testing Patterns

### Testing Front Matter

```ruby
it 'has required front matter fields' do
  expect(page.data['title']).not_to be_nil
  expect(page.data['description']).not_to be_nil
end
```

### Testing Jekyll Build

```ruby
it 'builds successfully' do
  expect { Jekyll::Commands::Build.process({}) }.not_to raise_error
end
```

### Testing Page Content

```ruby
it 'renders content correctly' do
  content = File.read('_site/page.html')
  expect(content).to include('expected text')
end
```

## When Tests Fail

1. **Read the error message** - it usually tells you exactly what's wrong
2. **Check recent changes** - did you break something?
3. **Run locally** - reproduce the failure on your machine
4. **Isolate the problem** - run just the failing test
5. **Fix the root cause** - don't just make the test pass
6. **Verify the fix** - ensure related tests still pass

## Test Maintenance

- Update tests when functionality changes
- Remove tests for removed features
- Keep test code as clean as production code
- Refactor duplicated test code
- Document complex test setups

Remember: **Good tests give confidence**. Write tests that catch real problems without being fragile.
