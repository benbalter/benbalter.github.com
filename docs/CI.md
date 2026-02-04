# Continuous Integration (CI) Configuration

This document describes the CI workflows and provides recommendations for branch protection settings.

## Workflows Overview

### `ci.yml` - Core CI Checks

The main CI workflow runs on changes to code, content, and configuration files.

**Jobs:**

1. **Content Linting** (`content`)
   - Validates Markdown files with remark and markdownlint
   - Checks prose quality with textlint
   - Validates spelling and style with Vale (if available)

2. **Code Tests** (`code`)
   - Lints JavaScript files with xo/ESLint
   - Lints JSON files with ESLint
   - Lints YAML files with yamllint
   - Type checks TypeScript with Astro check

3. **Unit Tests** (`vitest`)
   - Runs Vitest unit tests
   - Generates and uploads coverage reports

### `astro-e2e.yml` - End-to-End Testing

Runs on changes to site content, Astro configuration, and test files.

**Jobs:**

1. **Build Astro Site** (`build`)
   - Builds the production Astro site
   - Uploads build artifacts for downstream jobs

2. **Lighthouse CI** (`lighthouse`)
   - Runs Lighthouse performance audits
   - Reports accessibility, performance, SEO, and best practices scores

3. **Playwright Tests** (`playwright`)
   - Runs end-to-end tests with Playwright
   - Tests accessibility, navigation, SEO, and page functionality

### `build-and-deploy.yml` - Deployment

Deploys to GitHub Pages on pushes to the main branch.

**Jobs:**

1. **Build** - Builds the Astro site for production
2. **Deploy** - Deploys to GitHub Pages and purges Cloudflare cache

## Recommended Required Checks

For branch protection on the `main` branch, we recommend requiring the following status checks to pass:

### Essential (Required)

These checks should always pass before merging:

| Check Name | Workflow | Description |
|------------|----------|-------------|
| `Content Linting` | ci.yml | Validates Markdown and prose quality |
| `Code Tests` | ci.yml | Lints JS, JSON, YAML and type checks |
| `Unit Tests` | ci.yml | Runs Vitest unit tests |
| `Build Astro Site` | astro-e2e.yml | Ensures the site builds successfully |

### Recommended (Optional but Valuable)

These checks provide additional quality assurance:

| Check Name | Workflow | Description |
|------------|----------|-------------|
| `Playwright Tests` | astro-e2e.yml | E2E testing for site functionality |
| `Lighthouse CI` | astro-e2e.yml | Performance and accessibility audits |

### Branch Protection Configuration

To configure these in GitHub:

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Click **Add rule** or edit the rule for `main`
3. Enable **Require status checks to pass before merging**
4. Search and add the following required status checks:
   - `Content Linting`
   - `Code Tests`
   - `Unit Tests`
   - `Build Astro Site`
5. Optionally add:
   - `Playwright Tests`
   - `Lighthouse CI`

### Notes on Path Filtering

- **ci.yml** runs on code, content, and configuration file changes
- **astro-e2e.yml** runs on content and site-related changes

If a workflow doesn't run due to path filtering, its checks won't appear. Use **Require branches to be up to date before merging** carefully, or consider making some checks run unconditionally if they're critical.

## Local Testing

Run these commands locally before pushing:

```bash
# Full lint and type check
npm test

# Content linting
script/cibuild-content

# Unit tests
npm run test:vitest

# E2E tests (requires building first)
npm run build
npm run test:e2e
```

## Troubleshooting

### Workflow Not Running

If a workflow isn't triggered:

1. Check the path filters in the workflow file
2. Ensure your changes touch files that match the path patterns
3. Verify the workflow is enabled in the repository settings

### Dependabot Auto-Merge

Dependabot PRs are automatically approved and merged for patch and minor version updates when all required checks pass. Major version updates require manual review.
