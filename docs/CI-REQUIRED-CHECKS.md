# CI Required Checks for Branch Protection

This document outlines the suggested required checks for GitHub branch protection rules.

## Recommended Required Status Checks

The following checks should be required to pass before merging pull requests:

### Core CI Checks (ci.yml)

| Check Name | Description | Workflow |
|------------|-------------|----------|
| `Content Linting` | Validates markdown, text linting (textlint), and prose (Vale) | ci.yml |
| `Code Tests` | Lints JavaScript, JSON, YAML files and runs TypeScript type checking | ci.yml |
| `Unit Tests` | Runs Vitest unit tests with coverage | ci.yml |

### E2E Tests (astro-e2e.yml)

| Check Name | Description | Workflow |
|------------|-------------|----------|
| `Build Astro Site` | Builds the Astro site (required by downstream jobs) | astro-e2e.yml |
| `Lighthouse CI` | Performance, accessibility, SEO, and best practices audits | astro-e2e.yml |
| `Playwright Tests` | End-to-end browser tests for functionality validation | astro-e2e.yml |

## Suggested Branch Protection Configuration

For the `main` branch, configure the following settings:

### Required Status Checks

```
✓ Require status checks to pass before merging
  ✓ Require branches to be up to date before merging

  Required checks:
  - Content Linting
  - Code Tests
  - Unit Tests
  - Build Astro Site
  - Lighthouse CI
  - Playwright Tests
```

### Additional Recommended Settings

```
✓ Require a pull request before merging
  ✓ Require approvals (1 or more)
  ✓ Dismiss stale pull request approvals when new commits are pushed

✓ Do not allow bypassing the above settings
```

## Workflow Triggers

### ci.yml Triggers

Content and code changes that trigger CI:

- `src/**` - Source files
- `*.md` - Root markdown files
- `dictionary.txt` - Spell check dictionary
- `.remarkrc.js`, `.remarkignore` - Remark configuration
- `.textlintrc` - Textlint configuration
- `.vale.ini` - Vale configuration
- `.markdown-lint.yml`, `.markdownlint-cli2.cjs` - Markdown lint configuration
- `script/**` - Build and lint scripts
- `**/*.js`, `**/*.ts` - JavaScript/TypeScript files
- `**/*.json` - JSON files
- `**/*.yml`, `**/*.yaml` - YAML files
- `package*.json` - Package configuration
- `astro.config.mjs` - Astro configuration
- `tsconfig*.json` - TypeScript configuration
- `vitest.config.ts` - Vitest configuration
- `eslint.config.js` - ESLint configuration
- `.yamllint.yml` - YAML lint configuration
- `assets/**` - Asset files
- `.github/workflows/ci.yml` - CI workflow itself

### astro-e2e.yml Triggers

Files that trigger E2E tests:

- `src/**` - Source files
- `astro.config.mjs` - Astro configuration
- `tsconfig.astro.json` - TypeScript configuration
- `public/**` - Public/static files
- `*.md` - Root markdown files
- `e2e/**` - E2E test files
- `playwright.config.ts` - Playwright configuration
- `.lighthouserc.json` - Lighthouse configuration
- `package*.json` - Package configuration
- `.github/workflows/astro-e2e.yml` - E2E workflow itself

## Notes

- **Super Linter (`lint.yml`)** is disabled as it duplicates checks from `ci.yml`
- **Dependabot auto-merge** (`approve-and-merge-dependabot-prs.yml`) runs on all PRs but only acts on Dependabot PRs
- **Build and Deploy** (`build-and-deploy.yml`) only runs on the `main` branch for production deployments
- **Copilot Setup Steps** (`copilot-setup-steps.yml`) is for GitHub Copilot agent environment setup

## Updating Required Checks

When adding new jobs to workflows, update this document and consider whether the new check should be required for branch protection.

To configure branch protection:

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Click **Add rule** or edit the existing rule for `main`
3. Enable **Require status checks to pass before merging**
4. Search for and add each required check by name
5. Save changes
