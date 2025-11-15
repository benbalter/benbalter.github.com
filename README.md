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

#### Next.js Commands

```bash
npm run dev          # Start Next.js development server (http://localhost:3000)
npm run next:build   # Build Next.js for production (outputs to /out)
npm run next:start   # Start Next.js production server
```

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

## License

* Content: [Creative Commons, BY](http://creativecommons.org/licenses/by/3.0/)
* Code: [MIT](http://opensource.org/licenses/mit-license.php)
