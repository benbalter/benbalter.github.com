---
on:
  workflow_run:
    workflows: ["CI", "Astro E2E Tests"]
    types: [completed]
    branches: [main]
permissions:
  contents: read
  actions: read
  issues: read
  pull-requests: read
safe-outputs:
  add-comment:
    max: 1
---

## CI Failure Analyzer

When a CI workflow run **fails**, analyze the failure and post a helpful diagnostic comment on the associated pull request.

If the workflow run **succeeded**, do nothing.

## Instructions

- Examine the workflow run logs for the failed jobs
- Identify the root cause of the failure
- Post a single, clear comment on the pull request

## Failure categories to look for

### Content linting (CI workflow)
- **Vale** style violations — explain which rule was triggered and quote the offending text
- **Harper** grammar issues — note this is a newer linter and may have false positives
- **textlint** rule violations (contractions, doubled spaces, terminology, etc.)
- **remark / markdownlint** formatting issues — note that `script/fix-lint` can auto-fix many of these

### Code quality (CI workflow)
- **ESLint** violations — identify the rule and suggest the fix
- **TypeScript (`astro check`)** type errors — quote the error and explain the type mismatch
- **YAML lint** issues — identify the file and line

### E2E tests (Astro E2E Tests workflow)
- **Playwright** test failures — identify which test failed and whether it looks like a real regression vs. a flaky test
- **Lighthouse** performance regressions — identify which metric regressed (DOM size, LCP, CLS, etc.) and by how much
- **Axe accessibility** violations — identify the WCAG rule and affected element

## Comment format

Structure the comment as:

**🔴 CI Failure: `{job name}`**

**What failed:** One-sentence summary

**Root cause:** Brief explanation of why it failed, quoting the relevant log output

**How to fix:**
- Specific, actionable steps to resolve the issue
- Include relevant commands to run locally (e.g., `npx vale src/content/posts/my-post.md`)
- If it is a content lint issue, remind the author to run `script/fix-lint` after any remark changes

**Flaky?** Yes/No assessment with reasoning — some E2E tests have known threshold sensitivity
