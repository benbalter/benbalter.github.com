# GitHub Copilot Instructions for benbalter.github.com

## Project Overview

This is the personal website of Ben Balter. The site serves as a personal blog, portfolio, and professional profile showcasing posts about technology leadership, collaboration, and open source.

**Key Features:**

* Static site generated with Jekyll (primary) and Astro (experimental)
* Blog posts with related posts suggestions
* Resume and professional information
* GitHub integration for metadata
* RSS feeds and social media integration
* Optimized for performance and accessibility

## Tech Stack

### Core Technologies

* **Jekyll**: ~> 4.0 (Primary static site generator)
* **Astro**: 5.x (Experimental static site generator)
* **Ruby**: 3.3.5
* **Node.js**: For JavaScript tooling and build processes
* **TypeScript**: For Astro components and utilities
* **GitHub Pages**: Hosting platform

### Jekyll Architecture

Jekyll is used to generate the primary production site from Markdown content and Liquid templates. The site outputs to `_site/` directory.

### Astro Architecture (Experimental)

Astro provides an alternative static site generation approach with:

* **Static Site Generation (SSG)**: All pages pre-rendered at build time
* **Zero JavaScript by default**: Ships minimal JavaScript for optimal performance
* **Content Collections**: Type-safe content management with Zod schemas
* **TypeScript Support**: Type-safe component development
* **Component Islands**: Partial hydration for interactive components
* **View Transitions**: Smooth page navigation using modern browser APIs
* **Output**: Builds to `dist-astro/` directory (separate from Jekyll)
* **Development Server**: Runs on port 4321 (separate from Jekyll's 4000)

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
* **Vitest**: Unit testing for Astro utilities and components
* **Playwright**: E2E testing for both Jekyll and Astro
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

### Astro Commands

```bash
npm run astro:dev      # Start Astro development server (port 4321)
npm run astro:build    # Build Astro site (outputs to dist-astro/)
npm run astro:preview  # Preview production build
npm run astro:check    # Type-check Astro components and TypeScript
```

### Setup

```bash
npm install            # Install Node.js dependencies
bundle install         # Install Ruby dependencies
```

### Testing

```bash
npm test               # Run linting (alias for npm run lint)
npm run test:e2e       # Run Playwright E2E tests (Jekyll)
npm run test:e2e:astro # Run Playwright E2E tests (Astro)
npm run test:vitest    # Run Vitest unit tests (Astro utilities)
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
├── src/               # Astro source files (experimental)
│   ├── pages/         # Astro page routes
│   ├── layouts/       # Astro layouts
│   ├── components/    # Astro components
│   ├── content/       # Content collections (posts, pages, resume positions)
│   ├── lib/           # Shared libraries (remark/rehype plugins)
│   ├── utils/         # Utility functions
│   ├── styles/        # SCSS styles
│   └── scripts/       # Client-side scripts
├── script/            # Build and utility scripts
├── spec/              # RSpec tests
├── e2e/               # Playwright E2E tests
├── Gemfile            # Ruby dependencies
├── package.json       # Node.js dependencies
├── astro.config.mjs   # Astro configuration
├── tsconfig.astro.json # TypeScript config for Astro
└── Rakefile           # Rake tasks
```

### Important Files

* `package.json`: Node.js dependencies and scripts
* `_config.yml`: Jekyll site configuration
* `astro.config.mjs`: Astro configuration
* `tsconfig.astro.json`: TypeScript configuration for Astro
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

### TypeScript/Astro

* Use TypeScript for Astro components and utilities
* Follow TypeScript config in `tsconfig.astro.json`
* Leverage Astro's content collections with Zod schemas
* Use `.astro` files for components (HTML-like syntax with TypeScript in frontmatter)
* **Zero JavaScript by default**: Only add interactivity when necessary
* Use `client:*` directives sparingly for interactive components
* Follow Astro best practices in `docs/ASTRO-BEST-PRACTICES.md`
* Prefer static site generation (SSG) over server-side rendering (SSR)
* Write Vitest unit tests for utility functions in `src/utils/`

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
* Separate configs for Jekyll (`playwright.config.ts`) and Astro (`playwright-astro.config.ts`)
* Test critical user journeys and page rendering
* Run `npm run test:e2e` for Jekyll E2E tests
* Run `npm run test:e2e:astro` for Astro E2E tests
* Ensure accessibility compliance with axe-core
* Test performance with Lighthouse

### Vitest Tests (Astro Utilities)

* Place test files alongside source: `src/**/*.{test,spec}.ts`
* Use Vitest for testing TypeScript utilities and functions
* Run `npm run test:vitest` for unit tests
* Run `npm run test:vitest:coverage` for coverage reports
* Follow existing test patterns in `src/utils/` and `src/lib/`
* Use happy-dom for DOM simulation when needed

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
* Follow security best practices for static sites
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

## Astro Components

* Use `.astro` files for component structure
* Write TypeScript in frontmatter section (between `---` markers)
* Keep components focused and reusable
* Leverage content collections from `src/content/`
* Use proper TypeScript types for props and data
* Follow component patterns in `src/components/`
* Avoid `client:*` directives unless interactivity is required
* Use semantic HTML and proper accessibility attributes
* Style with SCSS imported from `src/styles/`
* Document complex components with TypeScript JSDoc comments

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
* [Astro Documentation](https://docs.astro.build/)
* [GitHub Pages Documentation](https://docs.github.com/en/pages)
* [Site Source Code](https://github.com/benbalter/benbalter.github.com)
* [Ben Balter's Blog](https://ben.balter.com)
* [Astro Implementation Guide](docs/ASTRO.md)
* [Astro Best Practices](docs/ASTRO-BEST-PRACTICES.md)
* [Astro Architecture](docs/ASTRO-ARCHITECTURE.md)

## Custom Agents

This repository includes specialized GitHub Copilot custom agents in `.github/agents/`:

### Code Agent (`code.md`)

Specialized for code-related tasks including:

* **JavaScript/TypeScript** (webpack, build tools, Astro components, linting)
* **Ruby** (Jekyll plugins, RSpec tests, Rake tasks)
* **HTML/Liquid templates**
* **Astro components** (.astro files)
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
