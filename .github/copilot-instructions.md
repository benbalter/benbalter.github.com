# GitHub Copilot Instructions for benbalter.github.com

## Project Overview

This is the personal website of Ben Balter, currently in active migration from Jekyll to Next.js. The site serves as a personal blog, portfolio, and professional profile showcasing posts about technology leadership, collaboration, and open source.

**IMPORTANT: When implementing new features, assume Next.js unless specifically asked to modify Jekyll.**

**Key Features:**

* Static site with server-side generation (SSG)
* Blog posts with related posts suggestions
* Resume and professional information
* GitHub integration for metadata
* RSS feeds and social media integration
* Optimized for performance and accessibility

## Tech Stack

### Core Technologies (Prioritized)

* **Next.js**: 16.x (PRIMARY - App Router with SSG) - **Use this for new features**
* **React**: 19.x with Server Components
* **TypeScript**: For type safety in Next.js components
* **Node.js**: For JavaScript tooling and build processes
* **Jekyll**: \~> 4.0 (LEGACY - Maintained but not for new development)
* **Ruby**: 3.3.5 (For Jekyll legacy support only)
* **GitHub Pages**: Hosting platform

### Next.js Architecture (PRIMARY)

**This site uses Next.js with a Static Site Generation (SSG) first approach:**

* **Static HTML Generation**: All pages pre-rendered at build time
* **Server Components**: Default for all React components
* **Minimal Client JavaScript**: Only when absolutely necessary
* **GitHub Pages Compatible**: Exported as static files (`output: 'export'`)
* **TypeScript**: Strict type checking for components and utilities

**CRITICAL: Maximize use of SSG and server components**:

* Never use 'use client' unless absolutely necessary
* Prefer HTML and CSS over JavaScript
* Pre-render all pages as static HTML
* Minimize JavaScript bundle size
* Use server components for all data fetching and rendering
* Only use client components when browser APIs or React hooks are required

### Jekyll Architecture (LEGACY)

**Jekyll is being phased out. Only modify Jekyll code when:**

* Explicitly asked to fix Jekyll-specific bugs
* Maintaining existing Jekyll plugins until migration is complete
* Working on Jekyll-to-Next.js migration tasks

Jekyll plugins and Ruby code in `lib/` directory are legacy and should not be extended with new features.

### Key Dependencies

#### Next.js Dependencies (Primary)

* `next`: Next.js framework (16.x)
* `react` & `react-dom`: React framework (19.x)
* `@mdx-js/loader` & `@mdx-js/react`: MDX support for blog posts
* `gray-matter`: Front matter parsing
* `remark` & `rehype`: Markdown processing
* `next-sitemap`: XML sitemap generation
* `reading-time`: Reading time estimation
* `bootstrap`: UI framework
* `@fortawesome/react-fontawesome`: Icon library

#### Ruby Gems (Jekyll Plugins - LEGACY)

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

### Next.js Commands (Primary)

```bash
npm run dev            # Start Next.js development server (http://localhost:3000)
npm run next:build     # Build Next.js for production (outputs to /out)
npm run next:start     # Start Next.js production server
```

### Jekyll Commands (Legacy - Maintenance Only)

```bash
rake build             # Build the Jekyll site
rake serve             # Start Jekyll development server with watch mode
script/build           # Alternative build command
script/server          # Alternative server command
```

### Setup

```bash
npm install            # Install Node.js dependencies
bundle install         # Install Ruby dependencies (for Jekyll legacy support)
```

### Testing

```bash
npm test               # Run linting (alias for npm run lint)
npm run test:e2e       # Run Playwright E2E tests (both Jekyll and Next.js)
npm run test:e2e:nextjs # Run Next.js E2E tests specifically
npm run test:e2e:jekyll # Run Jekyll E2E tests (legacy)
rake test              # Run Jekyll tests (RSpec + HTML Proofer) - legacy
script/cibuild         # CI build script
```

### Linting

```bash
npm run lint           # Run all linters (JS, JSON, Markdown)
npm run lint-js        # Lint JavaScript/TypeScript files
npm run lint-json      # Lint JSON files
npm run lint-md        # Lint Markdown files
npm run lint-text      # Lint text content
npm run lint-yaml      # Lint YAML files
rubocop                # Ruby linting (Jekyll legacy only)
script/fix-lint        # Auto-fix linting issues (ALWAYS run after markdown linting)
```

**Important**: After running markdown linting (`npm run lint-md` or `remark`), **ALWAYS** run `script/fix-lint` to remove excessive escaping that remark adds, which can break the build.

## Project Structure

```text
.
├── .github/           # GitHub configuration and workflows
├── app/               # Next.js App Router (PRIMARY - new features go here)
│   ├── components/    # React components (prefer server components)
│   ├── [slug]/        # Dynamic routes for pages
│   ├── [year]/        # Dynamic routes for blog posts by year
│   ├── layout.tsx     # Root layout with metadata
│   └── page.tsx       # Home page
├── content/           # Content source files (shared between Jekyll and Next.js)
├── _posts/            # Blog posts (Markdown files with YYYY-MM-DD-title.md format)
├── _config.yml        # Jekyll configuration (LEGACY)
├── _data/             # YAML data files (LEGACY - Jekyll only)
├── _includes/         # Reusable HTML/Liquid snippets (LEGACY)
├── _layouts/          # Page templates (LEGACY - Jekyll only)
├── _resume_positions/ # Resume position entries
├── assets/            # Static assets (CSS, JS, images) (LEGACY - Jekyll)
├── public/            # Next.js static assets (PRIMARY)
├── script/            # Build and utility scripts
├── spec/              # RSpec tests (Jekyll legacy)
├── e2e/               # Playwright E2E tests
├── Gemfile            # Ruby dependencies (Jekyll legacy)
├── package.json       # Node.js dependencies
├── next.config.mjs    # Next.js configuration (PRIMARY)
├── tsconfig.json      # TypeScript configuration
└── Rakefile           # Rake tasks (Jekyll legacy)
```

### Important Files

* `next.config.mjs`: Next.js configuration (PRIMARY)
* `app/layout.tsx`: Root layout and metadata
* `package.json`: Node.js dependencies and scripts
* `tsconfig.json`: TypeScript configuration
* `_config.yml`: Jekyll site configuration (LEGACY)
* `llms.txt`: LLM/AI assistant context about the site
* `humans.txt`: Credits and site information
* `robots.txt`: Search engine crawler rules

## Coding Standards and Best Practices

### TypeScript/React (Primary)

* Follow ESLint rules in `.eslintrc.yml`
* Use TypeScript for type safety
* Use ES module syntax (`type: "module"` in package.json)
* Use xo style guide settings (space indentation)
* Prefer server components over client components
* Only use 'use client' when absolutely necessary (React hooks, browser APIs)
* Use proper TypeScript types for props and return values
* Avoid `any` types

**Server Components vs Client Components:**

* ✅ **DO**: Use server components by default (no 'use client' directive)
* ✅ **DO**: Pre-render all pages as static HTML using `generateStaticParams`
* ✅ **DO**: Use HTML and CSS for interactive features when possible
* ❌ **DON'T**: Use 'use client' unless ABSOLUTELY necessary
* ❌ **DON'T**: Use client-side state management when server components work
* ❌ **DON'T**: Add unnecessary JavaScript for features that can be HTML/CSS only

### Ruby (Legacy - Jekyll Only)

**Only modify Ruby code when explicitly maintaining Jekyll functionality.**

* Follow Rubocop rules defined in `.rubocop.yml`
* Use frozen string literals: `# frozen_string_literal: true`
* Write RSpec tests for new functionality in `spec/` (if adding Jekyll features)
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

**Next.js:**

* React components: `ComponentName.tsx` (PascalCase)
* Pages: `page.tsx`, `layout.tsx`, `not-found.tsx`
* Dynamic routes: `[slug]/page.tsx`, `[year]/[month]/[day]/[slug]/page.tsx`
* Test files: `ComponentName.test.tsx`

**Content (Shared):**

* Blog posts: `_posts/YYYY-MM-DD-title-with-hyphens.md`

**Jekyll (Legacy):**

* Data files: `_data/filename.yml`
* Layouts: `_layouts/layout-name.html`
* Includes: `_includes/component-name.html`

## Testing Guidelines

### E2E Tests (Playwright)

* Place test files in `e2e/` directory
* Use Playwright for testing Next.js pages
* Test critical user journeys and page rendering
* Run `npm run test:e2e:nextjs` for Next.js tests
* Ensure accessibility compliance

### Jest Tests (Unit/Component)

* Place test files alongside components: `ComponentName.test.tsx`
* Test component behavior and props
* Run `npm run test:jest` for unit tests
* Use React Testing Library for component tests

### RSpec Tests (Legacy - Jekyll Only)

* Place test files in `spec/` directory
* Use descriptive test names with `context` and `it` blocks
* Test front matter requirements for pages and collections
* Verify Jekyll builds successfully
* Only modify when maintaining Jekyll functionality

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

## React Components (Primary)

* Use TypeScript for all new components
* Prefer server components over client components
* Use proper prop types with TypeScript interfaces
* Keep components focused and reusable
* Follow React 19 best practices
* Test components with Jest and React Testing Library

## Liquid Templates (Legacy - Jekyll Only)

**Only modify Liquid templates when maintaining Jekyll functionality.**

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

* [Next.js Documentation](https://nextjs.org/docs)
* [React Documentation](https://react.dev/)
* [TypeScript Documentation](https://www.typescriptlang.org/docs/)
* [Jekyll Documentation](https://jekyllrb.com/docs/) (Legacy reference)
* [GitHub Pages Documentation](https://docs.github.com/en/pages)
* [Site Source Code](https://github.com/benbalter/benbalter.github.com)
* [Ben Balter's Blog](https://ben.balter.com)

## Custom Agents

This repository includes specialized GitHub Copilot custom agents in `.github/agents/`:

### Code Agent (`code.md`)

Specialized for code-related tasks including:

* **TypeScript/React** (Next.js components, hooks, utilities) - **PRIMARY**
* **JavaScript** (webpack, build tools, linting)
* **Ruby** (Jekyll plugins, RSpec tests, Rake tasks) - **LEGACY**
* **HTML/Liquid templates** - **LEGACY**
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
* **Default to Next.js** for new features unless explicitly asked to modify Jekyll
* **Jekyll is legacy**—only maintain existing functionality, don't add new features
* Preserve existing functionality unless explicitly asked to modify
* Follow the established patterns in the codebase
* Test changes thoroughly with the existing test suite
* When adding new features, ensure they align with Next.js best practices
* Maintain the site's clean, minimal aesthetic
* Prioritize performance and accessibility
* **CRITICAL: Make MINIMAL changes**:
  * **ONLY modify files directly related to the feature or bug fix**
  * **DO NOT run linters (npm run lint-md, remark, etc.) on all files**
  * **DO NOT auto-fix formatting on unrelated files**
  * If you must lint, target specific files: `npx eslint path/to/file.js`
  * Running `npm run lint-md` reformats ALL markdown files—avoid this
  * Only run broad linters if explicitly asked by the user
* **CRITICAL: Maximize use of SSG and server components**:
  * Never use 'use client' unless absolutely necessary
  * Prefer HTML and CSS over JavaScript
  * Pre-render all pages as static HTML
  * Minimize JavaScript bundle size
  * Use server components for all data fetching and rendering
  * Only use client components when browser APIs or React hooks are required
