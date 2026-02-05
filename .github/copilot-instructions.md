# GitHub Copilot Instructions for benbalter.github.com

## Project Overview

This is the personal website of Ben Balter. The site serves as a personal blog, portfolio, and professional profile showcasing posts about technology leadership, collaboration, and open source.

**Key Features:**

* Static site generated with Astro
* Blog posts with related posts suggestions
* Resume and professional information
* GitHub integration for metadata
* RSS feeds and social media integration
* Optimized for performance and accessibility

## Tech Stack

### Core Technologies

* **Astro**: 5.x (Static site generator)
* **Node.js**: For JavaScript tooling and build processes
* **TypeScript**: For Astro components and utilities
* **GitHub Pages**: Hosting platform

### Astro Architecture

Astro provides static site generation with:

* **Static Site Generation (SSG)**: All pages pre-rendered at build time
* **Zero JavaScript by default**: Ships minimal JavaScript for optimal performance
* **Content Collections**: Type-safe content management with Zod schemas
* **TypeScript Support**: Type-safe component development
* **Component Islands**: Partial hydration for interactive components
* **View Transitions**: Smooth page navigation using modern browser APIs
* **Output**: Builds to `dist-astro/` directory
* **Development Server**: Runs on port 4321

### Styling

* **Tailwind CSS v4**: Utility-first CSS framework with `@tailwindcss/vite` plugin
* **@tailwindcss/typography**: Prose styling for content areas

### Key Dependencies

#### Development Tools

* **Vitest**: Unit testing for Astro utilities and components
* **Playwright**: E2E testing
* **ESLint**: JavaScript and JSON linting
* **markdownlint**: Markdown linting
* **textlint**: Natural language linting
* **remark**: Markdown processing
* **Vale**: Prose linting
* **yamllint**: YAML file linting

## Development Commands

### Astro Commands

```bash
npm run dev            # Start Astro development server (port 4321)
npm run build          # Build Astro site (outputs to dist-astro/)
npm run preview        # Preview production build
npm run check          # Type-check Astro components and TypeScript
```

### Setup

```bash
npm install            # Install Node.js dependencies
```

### Testing

```bash
npm test               # Run type check and linting
npm run test:e2e       # Run Playwright E2E tests
npm run test:vitest    # Run Vitest unit tests
```

### Linting

```bash
npm run lint           # Run all linters (JS, JSON, Markdown)
npm run lint-js        # Lint JavaScript files
npm run lint-json      # Lint JSON files
npm run lint-md        # Lint Markdown files
npm run lint-text      # Lint text content
npm run lint-yaml      # Lint YAML files
script/fix-lint        # Auto-fix linting issues (ALWAYS run after markdown linting)
```

**Important**: After running markdown linting (`npm run lint-md` or `remark`), **ALWAYS** run `script/fix-lint` to remove excessive escaping that remark adds, which can break the build.

## Project Structure

```text
.
├── .github/           # GitHub configuration and workflows
├── src/               # Astro source files
│   ├── pages/         # Astro page routes
│   ├── layouts/       # Astro layouts
│   ├── components/    # Astro components
│   ├── content/       # Content collections (posts, pages, resume positions)
│   ├── data/          # YAML data files
│   ├── lib/           # Shared libraries (remark/rehype plugins)
│   ├── utils/         # Utility functions
│   ├── styles/        # Tailwind CSS styles
│   └── scripts/       # Client-side scripts
├── public/            # Static assets
├── script/            # Build and utility scripts
├── e2e/               # Playwright E2E tests
├── package.json       # Node.js dependencies
├── astro.config.mjs   # Astro configuration
├── tsconfig.astro.json # TypeScript config for Astro
└── vitest.config.ts   # Vitest configuration
```

### Important Files

* `package.json`: Node.js dependencies and scripts
* `astro.config.mjs`: Astro configuration
* `tsconfig.astro.json`: TypeScript configuration for Astro
* `llms.txt`: LLM/AI assistant context about the site
* `humans.txt`: Credits and site information
* `robots.txt`: Search engine crawler rules

## Coding Standards and Best Practices

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

Blog posts must include:

* `title`: Post title
* `description`: Post description
* Date in filename format: `YYYY-MM-DD-title.md`

### File Naming Conventions

**Content:**

* Blog posts: `src/content/posts/YYYY-MM-DD-title-with-hyphens.md`
* Resume positions: `src/content/resume-positions/position-name.md`
* Data files: `src/data/filename.yml`

## Testing Guidelines

### E2E Tests (Playwright)

* Place test files in `e2e/` directory
* Test critical user journeys and page rendering
* Run `npm run test:e2e` for E2E tests
* Ensure accessibility compliance with axe-core
* Test performance with Lighthouse

### Vitest Tests (Astro Utilities)

* Place test files alongside source: `src/**/*.{test,spec}.ts`
* Use Vitest for testing TypeScript utilities and functions
* Run `npm run test:vitest` for unit tests
* Run `npm run test:vitest:coverage` for coverage reports
* Follow existing test patterns in `src/utils/` and `src/lib/`
* Use happy-dom for DOM simulation when needed

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

## Astro Components

* Use `.astro` files for component structure
* Write TypeScript in frontmatter section (between `---` markers)
* Keep components focused and reusable
* Leverage content collections from `src/content/`
* Use proper TypeScript types for props and data
* Follow component patterns in `src/components/`
* Avoid `client:*` directives unless interactivity is required
* Use semantic HTML and proper accessibility attributes
* Style with Tailwind CSS utilities and `src/styles/global.css`
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
* Sets up Node.js with npm caching
* Installs all dependencies via `npm install`

This ensures Copilot can build, test, and validate code changes in a properly configured environment.

## Resources

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
* **Astro components** (.astro files)
* **SCSS/CSS styling**
* **Configuration files** (YAML, JSON, TypeScript config)

Use this agent for development tasks that involve modifying or creating code files.

### Writing Agent (`writing.md`)

Specialized for content creation and editing that authentically matches Ben Balter's distinctive writing voice:

* **Blog posts**: Technology leadership, open source, remote work, collaboration
* **Writing voice**: Analytical yet accessible, engineering analogies, empathetic
* **Distinctive patterns**: Internal linking, footnotes, memorable concepts
* **Technical documentation**: README files, guides, and docs
* **SEO optimization**: Titles, descriptions, and structured content
* **Style compliance**: Vale, textlint, remark, and markdownlint

Use this agent for creating or editing blog posts and documentation. The agent understands Ben's voice, frequently referenced prior posts, and key concepts like "showing your work", "communications debt", and "caremad".

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
