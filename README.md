# `Ben.Balter.com` <!-- markdownlint-disable-line MD002 -->

[![CI](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml/badge.svg)](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml)

The personal site of Ben Balter. Currently in transition from Jekyll to Next.js.

## Current Setup

This site currently supports both Jekyll (legacy) and Next.js (in development):

### Jekyll (Legacy - Active)

The site is currently built using Jekyll, GitHub Pages, and Bootstrap. See [humans.txt](https://ben.balter.com/humans.txt) for more infos.

### Next.js (In Development)

A Next.js structure has been set up for the future migration. The Next.js app is configured to:

* Use the App Router (`app/` directory)
* Export static HTML for GitHub Pages compatibility
* Support TypeScript with React
* Automatic legacy URL redirect generation from YAML frontmatter
* **Maximize Static Site Generation (SSG)** - All pages are pre-rendered as static HTML
* **Minimize client-side JavaScript** - Use server components by default

#### Next.js Development Guidelines

**IMPORTANT: This site prioritizes Static Site Generation (SSG) and server components.**

* ✅ **DO**: Use server components by default (no 'use client' directive)
* ✅ **DO**: Pre-render all pages as static HTML using `generateStaticParams`
* ✅ **DO**: Use HTML and CSS for interactive features when possible
* ❌ **DON'T**: Use 'use client' unless ABSOLUTELY necessary
* ❌ **DON'T**: Use client-side state management when server components work
* ❌ **DON'T**: Add unnecessary JavaScript for features that can be HTML/CSS only

**When 'use client' IS necessary:**

* Browser APIs (localStorage, window, document)
* React hooks (useState, useEffect, usePathname, etc.)
* Event handlers that require client-side state
* Third-party libraries that require client-side initialization

**Always ask: "Can this be done with SSG and server components?"**

#### Next.js Commands

```bash
npm run dev          # Start Next.js development server (http://localhost:3000)
npm run next:build   # Build Next.js for production (outputs to /out)
npm run next:start   # Start Next.js production server
```

#### Legacy URL Redirects

The build process automatically generates static HTML redirect pages for all `redirect_from` and `redirect_to` directives in YAML frontmatter. See [docs/REDIRECTS.md](docs/REDIRECTS.md) for details.

## Development

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

* **Code Agent**: For Ruby, JavaScript/TypeScript, HTML/Liquid, and CSS development
* **Writing Agent**: For blog posts and documentation

See `.github/agents/` for their configurations.

## Next.js Development Guidelines

This site uses **Static Site Generation (SSG) with minimal client-side JavaScript.**

See [docs/SSG-BEST-PRACTICES.md](docs/SSG-BEST-PRACTICES.md) for complete guidelines on:

* Server components vs client components
* When to use 'use client' (rarely!)
* Maximizing static HTML generation
* Preferring HTML/CSS over JavaScript

**Key principle**: NEVER use 'use client' unless absolutely necessary. The site currently has only 2 client components and should stay that way.

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

**Test Coverage:** 115 unique tests

Tests cover:

* Homepage, blog posts, resume, and static pages
* Accessibility (WCAG compliance, keyboard navigation)
* Performance (load times, asset optimization)
* SEO (meta tags, Open Graph, structured data)
* Responsive design
* Static HTML generation and SSG compliance

See [e2e/README.md](e2e/README.md) for detailed testing documentation.

## License

* Content: [Creative Commons, BY](http://creativecommons.org/licenses/by/3.0/)
* Code: [MIT](http://opensource.org/licenses/mit-license.php)
