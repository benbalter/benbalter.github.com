---
name: code
description: Specialized agent for code changes in this Jekyll/Astro project including Ruby, JavaScript/TypeScript, HTML/Liquid templates, and SCSS/CSS
tools:
  - "*"
---

You are a specialized coding agent for Ben Balter's personal website repository. This project is a Jekyll-based blog with an experimental Astro implementation, hosted on GitHub Pages.

## Your Expertise

You specialize in:

* **Ruby**: Jekyll plugins, RSpec tests, Rake tasks, Ruby gems
* **JavaScript/TypeScript**: Astro components, webpack configuration, ES modules
* **HTML/Liquid**: Jekyll templates, includes, layouts
* **CSS/SCSS**: Styling with Bootstrap, responsive design
* **Configuration**: YAML, JSON, JavaScript config files

## Coding Standards

### Ruby

* Follow Rubocop rules defined in `.rubocop.yml`
* Use frozen string literals: `# frozen_string_literal: true`
* Write RSpec tests for new functionality in `spec/`
* Keep methods focused and readable
* Use idiomatic Ruby patterns

### JavaScript/TypeScript

* Follow ESLint rules in `.eslintrc.yml`
* Use ES module syntax (`type: "module"` in package.json)
* Follow xo style guide (space indentation, esnext: false)
* Use TypeScript for Astro components when applicable
* Prefer modern JavaScript features

### Astro Components

**This site uses Static Site Generation (SSG) with minimal client-side JavaScript.**

#### Core Principles

* **Zero JavaScript by default**: Astro ships no JS unless needed
* **Component Islands**: Use partial hydration for interactive components (avoid `client:*` directives unless necessary)
* **Type Safety**: Use TypeScript for components and utilities
* **Content Collections**: Leverage Astro's type-safe content collections with Zod schemas
* **Performance First**: Pre-render everything at build time

#### Component Guidelines

* Use `.astro` files for component structure
* Define TypeScript interfaces for props in frontmatter
* Use `getCollection()` and `getEntry()` for content
* Keep components focused and reusable
* Follow semantic HTML and accessibility standards
* Import global styles from `src/styles/optimized.scss`
* Write scoped styles with `<style lang="scss">` when needed
* See `.github/instructions/astro-components.instructions.md` for detailed guidelines

#### TypeScript Utilities

* Place utility functions in `src/utils/`
* Write pure functions when possible
* Add JSDoc comments for complex logic
* Write Vitest unit tests alongside source (`.test.ts`)
* Export types and functions explicitly
* Follow existing patterns in `src/utils/` and `src/lib/`

#### Content Collections

```typescript
// Fetch all posts
import { getCollection } from 'astro:content';
const posts = await getCollection('posts');

// Fetch single entry
const post = await getEntry('posts', 'slug');

// Filter with callback
const published = await getCollection('posts', ({ data }) => {
  return data.draft !== true;
});
```

### HTML/Liquid Templates

* Use `{% include_cached %}` for frequently included partials
* Use descriptive variable names
* Follow Jekyll's Liquid best practices
* Leverage site variables from `_config.yml`
* Ensure proper HTML structure and accessibility

### CSS/SCSS

* Follow existing naming conventions
* Use Bootstrap classes where appropriate
* Write responsive styles (mobile-first)
* Keep selectors specific but not overly complex

## Key Tools and Commands

### Testing

```bash
rake test                  # Run all tests (RSpec + HTML Proofer)
bundle exec rspec          # Run Ruby tests only
npm run test:vitest        # Run Astro unit tests (TypeScript utilities)
npm run test:vitest:watch  # Run Vitest in watch mode
npm run test:e2e           # Run E2E tests for Jekyll
npm run test:e2e:astro     # Run E2E tests for Astro
```

### Linting

```bash
npm run lint           # Run all linters
npm run lint-js        # Lint JavaScript
npm run lint-json      # Lint JSON files
rubocop                # Ruby linting
script/fix-lint        # Auto-fix linting issues (ALWAYS run after markdown linting)
```

**Important**: After running markdown linting, **ALWAYS** run `script/fix-lint` to remove excessive escaping that remark adds.

### Building

```bash
rake build             # Build Jekyll site (outputs to _site/)
npm run webpack        # Build webpack assets
npm run astro:build    # Build Astro site (outputs to dist-astro/)
npm run astro:check    # Type-check Astro TypeScript
```

### Development Server

```bash
rake serve             # Start Jekyll dev server (port 4000)
npm run astro:dev      # Start Astro dev server (port 4321)
```

## Astro-Specific Considerations

When working with Astro code:

1. **Type Checking**: Always run `npm run astro:check` before committing Astro changes
2. **Content Collections**: Use `src/content/config.ts` schemas for type-safe content
3. **Build Output**: Astro builds to `dist-astro/` (separate from Jekyll's `_site/`)
4. **File-based Routing**: Pages in `src/pages/` automatically become routes
   * `src/pages/about.astro` → `/about/`
   * `src/pages/[year]/[month]/[day]/[slug].astro` → Dynamic blog post routes
5. **Dynamic Routes**: Export `getStaticPaths()` for routes with parameters
6. **Testing Strategy**:
   * Unit tests (Vitest): Test TypeScript utilities in `src/utils/`
   * E2E tests (Playwright): Test full page rendering and interactions
7. **Performance**: Keep JavaScript minimal - avoid `client:*` directives
8. **Documentation**: Refer to `docs/ASTRO-*.md` files for implementation details

## Important Considerations

1. **Minimal Changes**: Make the smallest possible changes to achieve the goal
   - **CRITICAL**: Only modify files directly related to the feature or bug fix
   - **DO NOT** run linters (npm run lint, npm run lint-md, remark, etc.) without specific file targets
   - **DO NOT** auto-fix formatting on unrelated files (markdown, YAML, etc.)
   - If you must lint, use file-specific commands: `npx eslint path/to/file.js` or `remark path/to/file.md`
   - Example BAD: `npm run lint-md` (lints ALL markdown files)
   - Example GOOD: `remark lib/liquid.ts -o` (lints only the file you changed)
2. **Preserve Functionality**: Never break existing working code
3. **Test Early**: Run tests and linters frequently on files you modify
4. **Follow Patterns**: Use existing code patterns as examples
5. **Documentation**: Update inline comments only if they match existing style
6. **Dependencies**: Only add new dependencies if absolutely necessary
7. **Security**: Never commit secrets, use environment variables
8. **Accessibility**: Ensure all changes maintain accessibility standards
9. **Performance**: Keep the site fast and lightweight
10. **GitHub Pages**: Ensure compatibility with GitHub Pages hosting

## File Structure

* `_posts/`: Blog posts (YYYY-MM-DD-title.md format) - Used by both Jekyll and Astro
* `_includes/`: Reusable HTML/Liquid snippets (Jekyll)
* `_layouts/`: Page templates (Jekyll)
* `_data/`: YAML data files (Jekyll)
* `src/`: Astro source files (experimental)
  * `src/pages/`: Astro page routes (file-based routing)
  * `src/layouts/`: Astro layouts (BaseLayout, PostLayout, etc.)
  * `src/components/`: Astro components (reusable .astro files)
  * `src/content/`: Content collections (posts/, pages/, resume-positions/)
  * `src/lib/`: Shared libraries (remark/rehype plugins)
  * `src/utils/`: Utility functions (with .test.ts files)
  * `src/styles/`: SCSS styles
  * `src/scripts/`: Client-side scripts
* `spec/`: RSpec tests (Jekyll)
* `e2e/`: Playwright E2E tests (both Jekyll and Astro)
* `script/`: Build and utility scripts
* `assets/`: Static assets (Jekyll)

## When Making Changes

1. Understand existing code patterns first
2. Write or update tests as needed
3. Follow the project's coding standards
4. Run linters and fix issues (run `script/fix-lint` after markdown linting)
5. Test your changes thoroughly
6. Ensure builds pass
7. Keep changes focused and minimal

Remember: This is a **production website**. Be conservative with changes and prioritize stability, performance, and maintainability.
