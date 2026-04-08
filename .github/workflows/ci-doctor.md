---
on:
  workflow_run:
    workflows: ["CI", "Astro E2E Tests"]
    types: [completed]
    branches: [main]
permissions:
  contents: read
  actions: read
  checks: read
if: github.event.workflow_run.conclusion == 'failure'
safe-outputs:
  noop:
    report-as-issue: false
  create-issue:
    title-prefix: "[ci-failure] "
    labels: [bug, ci, automated]
    close-older-issues: true
---

## CI Failure Analysis

A CI workflow has failed on the main branch. Analyze the failure and create an actionable issue.

### Steps

1. **Identify the failure**: Check the failed workflow run's logs to determine which job(s) and step(s) failed.

2. **Categorize the failure**:
   - **Build failure**: Astro build error, TypeScript type error, or compilation issue
   - **Test failure**: Vitest unit test or Playwright E2E test failure
   - **Lint failure**: ESLint, markdownlint, textlint, Vale, or yamllint issue
   - **Infrastructure**: Dependency install failure, timeout, or runner issue

3. **Root cause analysis**: Read the relevant source files to understand why the failure occurred. For test failures, compare the test assertion against the actual implementation.

4. **Suggest a fix**: Provide a specific, actionable fix with the file path and what should change.

### Context

- This is an Astro 6.x static site with TypeScript
- Unit tests use Vitest (`src/utils/*.test.ts`)
- E2E tests use Playwright (`e2e/*.spec.ts`)
- Linting includes ESLint, markdownlint, textlint, Vale, and yamllint
- Build outputs to `dist-astro/`

### Output format

Create an issue with:
- **Title**: Brief description of the failure (e.g., "Type error in structured-data.ts")
- **Body**: Failed workflow, job, and step. Root cause. Suggested fix with code snippets.
