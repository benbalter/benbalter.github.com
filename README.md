# `Ben.Balter.com` <!-- markdownlint-disable-line MD002 -->

[![CI](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml/badge.svg)](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml)

The personal site of Ben Balter. Built with Jekyll and hosted on GitHub Pages, with Astro experimental evaluation.

## Current Setup

This site is built using Jekyll, GitHub Pages, and Bootstrap. See [humans.txt](https://ben.balter.com/humans.txt) for more info.

### Astro (Experimental)

An Astro implementation has been bootstrapped for evaluation. The Astro setup is configured to:

* Use **Static Site Generation (SSG)** - All pages pre-rendered as static HTML
* **Zero JavaScript by default** - Ships only necessary JavaScript
* Support **TypeScript** for type-safe components
* Export to `dist-astro/` directory (separate from Jekyll `_site/`)
* Run development server on port 4321 (separate from Jekyll 4000)
* Full GitHub Pages compatibility with trailing slashes and directory-based URLs

#### Astro Commands

```bash
npm run astro:dev      # Start Astro development server (http://localhost:4321)
npm run astro:build    # Build Astro for production (outputs to /dist-astro)
npm run astro:preview  # Preview production build
npm run astro:check    # Type-check Astro components
```

#### Astro Documentation

See [docs/ASTRO.md](docs/ASTRO.md) for comprehensive documentation including:

* Project structure and configuration
* Coexistence strategy with Jekyll
* Development workflow and best practices
* Feature comparison with Jekyll
* Future migration roadmap

### Astro (Experimental)

An Astro implementation has been bootstrapped for evaluation. The Astro setup is configured to:

* Use **Static Site Generation (SSG)** - All pages pre-rendered as static HTML
* **Zero JavaScript by default** - Ships only necessary JavaScript
* Support **TypeScript** for type-safe components
* Export to `dist-astro/` directory (separate from Jekyll `_site/` and Next.js `out/`)
* Run development server on port 4321 (separate from Jekyll 4000 and Next.js 3000)
* Full GitHub Pages compatibility with trailing slashes and directory-based URLs

#### Astro Commands

```bash
npm run astro:dev      # Start Astro development server (http://localhost:4321)
npm run astro:build    # Build Astro for production (outputs to /dist-astro)
npm run astro:preview  # Preview production build
npm run astro:check    # Type-check Astro components
```

#### Astro Documentation

See [docs/ASTRO.md](docs/ASTRO.md) for comprehensive documentation including:

* Project structure and configuration
* Coexistence strategy with Jekyll and Next.js
* Development workflow and best practices
* Feature comparison with Jekyll and Next.js
* Future migration roadmap

## Development

### Dev Container

This repository includes a VS Code Dev Container configuration for a consistent development environment. The devcontainer includes:

* **Ruby 3.4.7** (matching `.ruby-version`)
* **Node.js 20** (for build tools)
* **System dependencies** (libvips for image processing)
* **Playwright** with Chromium for E2E testing
* **VS Code extensions** for Ruby, JavaScript, Markdown, Liquid, YAML, and more

**To use the devcontainer:**

1. Install [Docker](https://www.docker.com/products/docker-desktop) and [VS Code](https://code.visualstudio.com/)
2. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Open the repository in VS Code
4. Click "Reopen in Container" when prompted (or use Command Palette: "Dev Containers: Reopen in Container")

The container will automatically install all dependencies via `script/bootstrap` and display a welcome message with commands to start development servers.

### Running Tests Locally

```bash
script/cibuild       # Run full CI build (tests + linters)
rake test            # Run RSpec tests and HTML Proofer
npm test             # Run linting (alias for script/cibuild)
```

### Linting

This repository uses multiple linters to maintain code quality:

```bash
npm run lint         # Run JavaScript, JSON, and Markdown linters
npm run lint-js      # Lint JavaScript files
npm run lint-json    # Lint JSON files
npm run lint-md      # Lint Markdown files
npm run lint-text    # Lint text content (grammar, spelling)
npm run lint-yaml    # Lint YAML files
rubocop              # Lint Ruby code
```

**Prose Testing:** The repository includes comprehensive prose quality testing with textlint, remark/retext, and optional Vale. See [docs/PROSE-TESTING.md](docs/PROSE-TESTING.md) for details.

### Super Linter

Run the same comprehensive linting used in CI locally using Docker:

```bash
npm run super-linter  # Run Super Linter (requires Docker)
# or
script/super-linter   # Direct script invocation
```

**Prerequisites:** Docker must be installed and running. Super Linter will check all file types in the repository using the same configuration as the CI pipeline.

## GitHub Copilot Custom Agents

This repository includes specialized GitHub Copilot custom agents to assist with development:

* **Code Agent**: For Ruby, JavaScript, HTML/Liquid, and CSS development
* **Writing Agent**: For blog posts and documentation

See `.github/agents/` for their configurations.

### Copilot Development Environment

The repository includes a `.github/workflows/copilot-setup-steps.yml` workflow that automatically configures the development environment for GitHub Copilot coding agent. This workflow:

* Sets up Ruby (with version from `.ruby-version`)
* Sets up Node.js (version 20)
* Installs system dependencies (libvips for image processing)
* Installs all Ruby gems and npm packages via `script/bootstrap`

This ensures Copilot can build, test, and work with the codebase in a properly configured environment.

## Testing

### RSpec Tests (Ruby)

The repository includes RSpec tests for Jekyll site structure and front matter validation:

```bash
bundle exec rspec
```

### Vitest Unit Tests (Astro)

Unit tests for Astro components and utilities using Vitest:

```bash
# Run all tests
npm run test:vitest

# Run tests in watch mode
npm run test:vitest:watch

# Run tests with coverage
npm run test:vitest:coverage
```

Tests cover:

* Site configuration (contact links, social links, footer links)
* Component TypeScript logic and interfaces
* Utility functions

### Playwright E2E Tests

Comprehensive end-to-end tests using Playwright test the site on Chromium:

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode for debugging
npm run test:e2e:ui

# Run tests in headed mode
npm run test:e2e:headed
```

Tests cover:

* Homepage, blog posts, resume, and static pages
* Accessibility (WCAG compliance, keyboard navigation)
* Performance (load times, asset optimization)
* SEO (meta tags, Open Graph, structured data)
* Responsive design

See [TESTING.md](TESTING.md) for comprehensive testing documentation.

## License

* Content: [Creative Commons, BY](http://creativecommons.org/licenses/by/3.0/)
* Code: [MIT](http://opensource.org/licenses/mit-license.php)
