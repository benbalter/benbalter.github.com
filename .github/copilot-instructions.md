# GitHub Copilot Instructions for benbalter.github.com

## Project Overview

This is the personal website of Ben Balter. The site serves as a personal blog, portfolio, and professional profile showcasing posts about technology leadership, collaboration, and open source.

**Key Features:**

* Static site generated with Jekyll
* Blog posts with related posts suggestions
* Resume and professional information
* GitHub integration for metadata
* RSS feeds and social media integration
* Optimized for performance and accessibility

## Tech Stack

### Core Technologies

* **Jekyll**: ~> 4.0 (Static site generator)
* **Ruby**: 3.3.5
* **Node.js**: For JavaScript tooling and build processes
* **GitHub Pages**: Hosting platform

### Jekyll Architecture

Jekyll is used to generate the static site from Markdown content and Liquid templates.

### Key Dependencies

#### Ruby Gems (Jekyll Plugins)

* `jekyll-avatar`: GitHub avatar integration
* `jekyll-feed`: RSS feed generation
* `jekyll-github-metadata`: GitHub repository metadata
* `jekyll-mentions`: GitHub-style @mentions
* `jekyll-og-image`: Open Graph image generation
* `jekyll-redirect-from`: URL redirection support
* `jekyll-relative-links`: Relative link conversion
* `jekyll-seo-tag`: SEO metadata
* `jekyll-sitemap`: XML sitemap generation
* `jemoji`: GitHub emoji support
* `retlab`: Related posts generation

#### Development Tools

* **RSpec**: Ruby testing framework
* **Rubocop**: Ruby linter with performance and rspec extensions
* **html-proofer**: HTML validation and link checking
* **ESLint**: JavaScript and JSON linting
* **markdownlint**: Markdown linting
* **textlint**: Natural language linting
* **remark**: Markdown processing
* **Vale**: Prose linting
* **yamllint**: YAML file linting

## Development Commands

### Jekyll Commands

```bash
rake build             # Build the Jekyll site
rake serve             # Start Jekyll development server with watch mode
script/build           # Alternative build command
script/server          # Alternative server command
```

### Setup

```bash
npm install            # Install Node.js dependencies
bundle install         # Install Ruby dependencies
```

### Testing

```bash
npm test               # Run linting (alias for npm run lint)
npm run test:e2e       # Run Playwright E2E tests
rake test              # Run Jekyll tests (RSpec + HTML Proofer)
script/cibuild         # CI build script
```

### Linting

```bash
npm run lint           # Run all linters (JS, JSON, Markdown)
npm run lint-js        # Lint JavaScript files
npm run lint-json      # Lint JSON files
npm run lint-md        # Lint Markdown files
npm run lint-text      # Lint text content
npm run lint-yaml      # Lint YAML files
rubocop                # Ruby linting
script/fix-lint        # Auto-fix linting issues (ALWAYS run after markdown linting)
```

**Important**: After running markdown linting (`npm run lint-md` or `remark`), **ALWAYS** run `script/fix-lint` to remove excessive escaping that remark adds, which can break the build.

## Project Structure

```text
.
├── .github/           # GitHub configuration and workflows
├── _posts/            # Blog posts (Markdown files with YYYY-MM-DD-title.md format)
├── _config.yml        # Jekyll configuration
├── _data/             # YAML data files
├── _includes/         # Reusable HTML/Liquid snippets
├── _layouts/          # Page templates
├── _resume_positions/ # Resume position entries
├── assets/            # Static assets (CSS, JS, images)
├── script/            # Build and utility scripts
├── spec/              # RSpec tests
├── e2e/               # Playwright E2E tests
├── Gemfile            # Ruby dependencies
├── package.json       # Node.js dependencies
└── Rakefile           # Rake tasks
```

### Important Files

* `package.json`: Node.js dependencies and scripts
* `_config.yml`: Jekyll site configuration
* `llms.txt`: LLM/AI assistant context about the site
* `humans.txt`: Credits and site information
* `robots.txt`: Search engine crawler rules

## Coding Standards and Best Practices

### Ruby (Jekyll)

* Follow Rubocop rules defined in `.rubocop.yml`
* Use frozen string literals: `# frozen_string_literal: true`
* Write RSpec tests for new functionality in `spec/`
* Documentation comments are optional (disabled in Rubocop)
* Keep methods focused and readable

### JavaScript (Webpack, Build Tools)

* Follow ESLint rules in `.eslintrc.yml`
* Use ES module syntax (`type: "module"` in package.json)
* Use xo style guide settings (space indentation, esnext: false)
* Lint JSON files with ESLint

### Markdown and Content

* Follow markdownlint rules in `.markdown-lint.yml`
* Use remark for Markdown processing with consistent style
* Blog posts must have front matter with title and description
* Use proper YAML front matter format
* Include relevant metadata (date, tags, etc.)
* Write clear, grammatically correct prose

### Front Matter Requirements

Pages must include:

* `title`: Page title
* `description`: Brief description (for SEO)
* `permalink`: URL path (for pages)

Blog posts must include:

* `title`: Post title
* `description`: Post description
* Date in filename format: `YYYY-MM-DD-title.md`

### File Naming Conventions

**Content:**

* Blog posts: `_posts/YYYY-MM-DD-title-with-hyphens.md`

**Jekyll:**

* Data files: `_data/filename.yml`
* Layouts: `_layouts/layout-name.html`
* Includes: `_includes/component-name.html`

## Testing Guidelines

### E2E Tests (Playwright)

* Place test files in `e2e/` directory
* Use Playwright for testing Jekyll pages
* Test critical user journeys and page rendering
* Run `npm run test:e2e` for E2E tests
* Ensure accessibility compliance

### RSpec Tests (Jekyll)

* Place test files in `spec/` directory
* Use descriptive test names with `context` and `it` blocks
* Test front matter requirements for pages and collections
* Verify Jekyll builds successfully

### HTML Validation

* All generated HTML must pass validation checks
* Links must be valid (internal and external)
* Images must have alt text
* Proper HTML structure and accessibility

## Security and Privacy

* Never commit secrets or tokens to the repository
* Use environment variables for sensitive data
* Keep dependencies up to date via Dependabot
* Follow security best practices for Next.js and static sites
* Validate and sanitize user input in forms
* Use Content Security Policy (CSP) headers

## Content Guidelines

* Write in clear, professional tone
* Use inclusive language (checked via retext-equality)
* Maintain readability (checked via retext-readability)
* Check spelling and grammar (retext-spell, textlint)
* Use proper typographic conventions (em dashes, en dashes, etc.)

## Liquid Templates (Jekyll)

* Use `{% include_cached %}` for frequently included partials
* Use descriptive variable names
* Follow Jekyll's Liquid best practices
* Leverage site variables from `_config.yml`
* Use filters appropriately (markdownify, strip\_html, truncate, etc.)

## Git Workflow

* Work on feature branches
* Write descriptive commit messages
* Keep commits focused and atomic
* Test locally before committing
* CI/CD runs on all pushes (see `.github/workflows/`)

## Copilot Setup Workflow

This repository includes a `.github/workflows/copilot-setup-steps.yml` workflow file that helps GitHub Copilot coding agent set up the development environment automatically. The workflow:

* Checks out the repository
* Sets up Ruby with bundler caching
* Sets up Node.js with npm caching
* Installs libvips (required for image processing)
* Runs `script/bootstrap` to install all dependencies

This ensures Copilot can build, test, and validate code changes in a properly configured environment.

## Resources

* [Jekyll Documentation](https://jekyllrb.com/docs/)
* [GitHub Pages Documentation](https://docs.github.com/en/pages)
* [Site Source Code](https://github.com/benbalter/benbalter.github.com)
* [Ben Balter's Blog](https://ben.balter.com)

## Custom Agents

This repository includes specialized GitHub Copilot custom agents in `.github/agents/`:

### Code Agent (`code.md`)

Specialized for code-related tasks including:

* **JavaScript** (webpack, build tools, linting)
* **Ruby** (Jekyll plugins, RSpec tests, Rake tasks)
* **HTML/Liquid templates**
* **SCSS/CSS styling**
* **Configuration files** (YAML, JSON, TypeScript config)

Use this agent for development tasks that involve modifying or creating code files.

### Writing Agent (`writing.md`)

Specialized for content creation and editing including:

* Blog posts (Markdown with front matter)
* Technical documentation
* README and guide files
* SEO optimization
* Style and grammar compliance

Use this agent for creating or editing blog posts and documentation.

## Notes for Copilot

* This is a **production website**—be conservative with changes
* Preserve existing functionality unless explicitly asked to modify
* Follow the established patterns in the codebase
* Test changes thoroughly with the existing test suite
* Maintain the site's clean, minimal aesthetic
* Prioritize performance and accessibility
* **CRITICAL: Make MINIMAL changes**:
  * **ONLY modify files directly related to the feature or bug fix**
  * **DO NOT run linters (npm run lint-md, remark, etc.) on all files**
  * **DO NOT auto-fix formatting on unrelated files**
  * If you must lint, target specific files: `npx eslint path/to/file.js`
  * Running `npm run lint-md` reformats ALL markdown files—avoid this
  * Only run broad linters if explicitly asked by the user
