# benbalter.github.com

Personal website and blog for Ben Balter. Astro 6 static site hosted on Cloudflare Workers.

## Commands

```bash
npm run dev            # Dev server (port 4321)
npm run build          # Build → dist-astro/
npm run check          # Type-check Astro TypeScript
npm test               # Type check + linting
npm run test:e2e       # Playwright E2E tests
npm run test:vitest    # Vitest unit tests
npm run lint           # All linters
script/fix-lint        # Fix lint — ALWAYS run after any markdown linting
```

## Project Structure

- `src/pages/` — File-based routes
- `src/layouts/` — Page layouts (BaseLayout.astro, PostLayout.astro)
- `src/components/` — Reusable Astro components
- `src/content/` — Content collections (posts, pages, resume-positions)
- `src/content.config.ts` — Collection schemas (NOT `src/content/config.ts`)
- `src/data/` — YAML data files
- `src/utils/` — TypeScript utilities (unit tests in `*.test.ts` alongside source)
- `src/lib/` — Remark/rehype plugins
- `src/styles/global.css` — Tailwind v4 config + custom styles
- `e2e/` — Playwright E2E tests
- `script/` — Build and utility scripts

## Tech Stack

- **Astro 6**, Vite 7, TypeScript, Node 22+
- **Tailwind CSS v4** via `@tailwindcss/vite` — config lives in `src/styles/global.css` via `@theme` (no `tailwind.config.js`)
- **Zod 4** — import `z` from `astro/zod` (not `astro:content`)
- **Cloudflare Workers** static hosting

## Critical Conventions

### Markdown Linting

After running `npm run lint-md`, `remark`, or any markdown linting, **always** run `script/fix-lint` immediately after. Remark adds excessive backslash escaping that breaks the build.

```bash
# If you must lint markdown, target a specific file:
remark src/content/posts/my-post.md -o && script/fix-lint

# Never run broad markdown lint — it reformats every .md file:
# npm run lint-md  ← avoid
```

### Linting Scope

Target specific files only. Never run broad linters on unrelated files.

```bash
# Good
npx eslint src/utils/my-util.ts
remark src/content/posts/my-post.md -o

# Bad — reformats everything
npm run lint-md
npm run lint
```

### Astro Content Collections (v6 API)

```typescript
// Config: src/content.config.ts (NOT src/content/config.ts)
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';          // NOT from 'astro:content'

// Fetch
const posts = await getCollection('posts');
const post = await getEntry('posts', 'my-post-id');

// Use entry.id (NOT entry.slug)
// Use render(entry) (NOT entry.render())
import { render } from 'astro:content';
const { Content } = await render(post);
```

### Component Patterns

- Zero JavaScript by default — avoid `client:*` directives unless interactivity is required
- TypeScript interfaces for all component props
- Tailwind utilities first; `@layer components` in `global.css` for reusable patterns; `<style>` scoped blocks only when Tailwind can't cover it
- Run `npm run check` before committing any `.astro` or `.ts` changes

## Content Guidelines

This is a production website. Be conservative:

- **Minimal changes**: only modify files directly related to the task
- Write like a smart colleague over coffee—direct, opinionated, conversational
- Avoid AI-like patterns: excessive hedging, formulaic transitions ("Furthermore…"), hollow summarization
- Em dashes with no spaces (—), Oxford comma always, contractions naturally
- Blog posts: `src/content/posts/YYYY-MM-DD-title.md`

See `src/content/posts/CLAUDE.md` for detailed writing voice and SEO guidance.

## Testing

- Unit tests (Vitest): `src/utils/*.test.ts`
- E2E tests (Playwright): `e2e/`
- Run `npm run check` before committing Astro/TypeScript changes
- HTML must pass validation; images need alt text; links must be valid

## Front Matter

Blog posts require:

```yaml
---
title: Clear title (no Markdown)
description: Brief description for SEO (first 150 chars after stripping Markdown)
---
```

Optional: `comments`, `redirect_from`, `image`, `redirect_to`
