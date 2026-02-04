# `Ben.Balter.com` <!-- markdownlint-disable-line MD002 -->

[![CI](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml/badge.svg)](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml)

The personal site of Ben Balter. Built with Astro and hosted on GitHub Pages.

## Setup

This site is built using Astro and Bootstrap. See [humans.txt](https://ben.balter.com/humans.txt) for more info.

The Astro setup is configured to:

- Use **Static Site Generation (SSG)** — All pages pre-rendered as static HTML
- **Zero JavaScript by default** — Ships only necessary JavaScript
- Support **TypeScript** for type-safe components
- Export to `dist-astro/` directory
- Run development server on port 4321
- Full GitHub Pages compatibility with trailing slashes and directory-based URLs

### Commands

```bash
npm run dev        # Start development server (http://localhost:4321)
npm run build      # Build for production (outputs to /dist-astro)
npm run preview    # Preview production build
npm run check      # Type-check Astro components
```

### Documentation

See [docs/ASTRO.md](docs/ASTRO.md) for comprehensive documentation including:

- Project structure and configuration
- Development workflow and best practices
- Feature comparison

## Development

### Dev Container

This repository includes a VS Code Dev Container configuration for a consistent development environment. The devcontainer includes:

- **Node.js 24** (for build tools)
- **Playwright** with Chromium for E2E testing
- **VS Code extensions** for JavaScript, Markdown, YAML, and more

**To use the devcontainer:**

1. Install [Docker](https://www.docker.com/products/docker-desktop) and [VS Code](https://code.visualstudio.com/)
2. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Open the repository in VS Code
4. Click "Reopen in Container" when prompted (or use Command Palette: "Dev Containers: Reopen in Container")

The container will automatically install all dependencies via `npm install` and display a welcome message with commands to start development servers.

### Running Tests Locally

```bash
npm test             # Run type check and linters
npm run test:vitest  # Run unit tests
npm run test:e2e     # Run E2E tests
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

- **Code Agent**: For JavaScript/TypeScript, HTML, and CSS development
- **Writing Agent**: For blog posts and documentation

See `.github/agents/` for their configurations.

### Copilot Development Environment

The repository includes a `.github/workflows/copilot-setup-steps.yml` workflow that automatically configures the development environment for GitHub Copilot coding agent. This workflow:

- Sets up Node.js (version 24)
- Installs all npm packages

This ensures Copilot can build, test, and work with the codebase in a properly configured environment.

## Testing

### Vitest Unit Tests

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

- Site configuration (contact links, social links, footer links)
- Component TypeScript logic and interfaces
- Utility functions

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

- Homepage, blog posts, resume, and static pages
- Accessibility (WCAG compliance, keyboard navigation)
- Performance (load times, asset optimization)
- SEO (meta tags, Open Graph, structured data)
- Responsive design

## License

- Content: [Creative Commons, BY](http://creativecommons.org/licenses/by/3.0/)
- Code: [MIT](http://opensource.org/licenses/mit-license.php)
