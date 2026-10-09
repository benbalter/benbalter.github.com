# benbalter.github.com

Read by GitHub Copilot and, through [`CLAUDE.md`](CLAUDE.md), by Claude Code.

Personal website and blog for Ben Balter. [Astro](https://astro.build) 7 static site hosted on [Cloudflare Workers](https://developers.cloudflare.com/workers/). It serves the blog (with related-post suggestions and RSS feeds), the résumé, and Ben's professional profile, and pulls some metadata from GitHub.

## Commands

```bash
npm run dev            # Dev server (port 4321)
npm run build          # Build → dist-astro/
npm run preview        # Preview the production build
npm run preview:worker # Serve the build through the production Worker (wrangler dev --local, port 8792); E2E runs against this
npm run check          # Type-check Astro TypeScript
npm test               # Type checks + lint checks + Vitest unit tests
npm run test:e2e       # Playwright E2E tests
npm run test:vitest    # Vitest unit tests
npm run test:vitest:coverage  # Vitest with coverage
npm run lint           # All linters (JS, JSON, Markdown), with --fix
npm run lint-js        # ESLint, JavaScript/TypeScript (--fix)
npm run lint-json      # ESLint, JSON (--fix)
npm run lint-md        # remark (report-only), then markdownlint-cli2 --fix on every Markdown file
npm run lint-text      # textlint, dry run
npm run lint-yaml      # yamllint
```

## Project Structure

- [`src/pages/`](src/pages/: File-based routes
- [`src/layouts/`](src/layouts/: Page layouts (BaseLayout.astro, PostLayout.astro)
- [`src/components/`](src/components/: Reusable Astro components
- [`src/content/`](src/content/: Content collections (posts, pages, resume-positions)
- [`src/content.config.ts`](src/content.config.ts: Collection schemas (NOT `src/content/config.ts`)
- [`src/data/`](src/data/: YAML data files (plus a few typed `.ts` data modules)
- [`src/utils/`](src/utils/: TypeScript utilities (unit tests in `*.test.ts` alongside source)
- [`src/lib/`](src/lib/: Remark/rehype plugins
- [`src/styles/global.css`](src/styles/global.css: Tailwind v4 config + custom styles
- [`e2e/`](e2e/: Playwright E2E tests
- [`src/scripts/`](src/scripts/: Client-side scripts
- [`public/`](public/: Static assets
- [`script/`](script/: Build and utility scripts
- [`docs/`](docs/: Implementation notes, including [`ASTRO.md`](docs/ASTRO.md), [`ASTRO-ARCHITECTURE.md`](docs/ASTRO-ARCHITECTURE.md), and [`ASTRO-BEST-PRACTICES.md`](docs/ASTRO-BEST-PRACTICES.md)
- [`astro.config.mjs`](astro.config.mjs: Astro config, including fonts; [`tsconfig.astro.json`](tsconfig.astro.json) is the TypeScript config `npm run check` uses
- [`src/pages/llms.txt.ts`](src/pages/llms.txt.ts), [`humans.txt.ts`](src/pages/humans.txt.ts), [`robots.txt.ts`](src/pages/robots.txt.ts: Generated `llms.txt` (site context for LLMs), `humans.txt`, and `robots.txt`

## Tech Stack

- **Astro 7**, Vite 8, TypeScript, Node 22+
- **[Tailwind CSS v4](https://tailwindcss.com/docs)** via `@tailwindcss/vite`: config lives in `src/styles/global.css` via `@theme` (no `tailwind.config.js`)
- **[Zod 4](https://zod.dev)**: import `z` from `astro/zod` (not `astro:content`)
- **[Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/)** static hosting
- `@tailwindcss/typography` for prose styling in content areas
- Astro's Fonts API self-hosts Inter via Fontsource (no third-party font requests), and view transitions handle page navigation
- Linters: [ESLint](eslint.config.js) for JS/TS and JSON (2-space indent), markdownlint ([`.markdownlint-cli2.cjs`](.markdownlint-cli2.cjs)), remark, textlint, retext-spell, [Vale](https://vale.sh) (`script/vale`, including the `AIPatterns` style from [benbalter/vale-styles](https://github.com/benbalter/vale-styles)), and yamllint

## Critical Conventions

### Markdown Linting

[`remark`](https://github.com/remarkjs/remark-lint) runs report-only: `npm run lint-md` runs `remark .` (no `-o`), which checks Markdown without rewriting it, and then runs `markdownlint-cli2 --fix` over every Markdown file outside `.github/`, which does rewrite them. **Never run `remark <file> -o`**: the `-o` write-back is the one thing that adds excessive backslash escaping (`\[`, `\_`, `\&`) and breaks the build. Typography (smart quotes, em/en dashes) is applied at render via `sharedRemarkPlugins`, so `-o` buys nothing. [`script/fix-lint`](script/fix-lint) only exists to undo `-o` damage; with report-only remark it's a no-op you shouldn't need.

```bash
# Check a specific file (report-only, does NOT modify it):
remark src/content/posts/my-post.md

# markdownlint --fix is safe (no escaping) but rewrites every file with a
# violation; target a specific file to keep the diff small:
markdownlint-cli2 --fix src/content/posts/my-post.md
```

### Linting Scope

`npm run lint` and `npm run lint-md` run `eslint --fix` and `markdownlint-cli2 --fix` across the whole repo, rewriting every file with a violation, so lint the specific files you changed instead.

```bash
# Good
npx eslint src/utils/my-util.ts
remark src/content/posts/my-post.md

# Bad: reformats everything
npm run lint-md
npm run lint
```

### Astro Content Collections (v6+ API)

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

### Bookmarklets

[`/bookmarklets/`](src/pages/bookmarklets.astro) is the install page for [benbalter/bookmarklets](https://github.com/benbalter/bookmarklets). Their built code is vendored in [`src/data/bookmarklets.json`](src/data/bookmarklets.json) with the bookmarklets commit it came from; metadata is in [`src/data/bookmarklets.ts`](src/data/bookmarklets.ts).

- Renovate (custom manager in [`renovate.json`](renovate.json)) opens a PR bumping `commit` whenever the bookmarklets repo's `main` moves.
- CI's `script/update-bookmarklets --check` fails if the vendored code doesn't match that commit. When it does, run [`script/update-bookmarklets`](script/update-bookmarklets) on the PR branch and push; `--latest` moves to the tip of `main` by hand.
- Adding a bookmarklet: add its id to `IDS` in the script, run it with `--latest`, and add an entry to [`bookmarklets.ts`](src/data/bookmarklets.ts).

### Component Patterns

- Zero JavaScript by default; avoid `client:*` directives unless interactivity is required
- TypeScript interfaces for all component props
- Tailwind utilities first; `@layer components` in `global.css` for reusable patterns; `<style>` scoped blocks only when Tailwind can't cover it
- Prefer static generation over server-side rendering; see [`docs/ASTRO-BEST-PRACTICES.md`](docs/ASTRO-BEST-PRACTICES.md)
- Document complex components with JSDoc comments

## Content Guidelines

This is a production website, so be conservative with changes.

- Preserve existing functionality and the site's clean, minimal look; performance and accessibility come first
- Write like a smart colleague over coffee: direct, opinionated, conversational
- Avoid AI-like patterns: excessive hedging, formulaic transitions ("Furthermore…"), hollow summarization
- **No em dashes (`—`).** They read as the top AI tell; use a comma, colon, parentheses, or split into two sentences. En dashes (`–`) for ranges are fine. Oxford comma always, contractions naturally
- Blog posts: `src/content/posts/YYYY-MM-DD-title.md`; resume positions: `src/content/resume-positions/position-name.md`; data: `src/data/filename.yml`
- Write for a global audience: avoid cultural idioms, use unambiguous date formats, consider neurodiversity
- Use inclusive language (Vale checks it)
- Three litmus tests: the coffee test, the "anyone test", and the "explain to a new hire" test

### What the most-read posts tend to have in common

Not a formula or a requirement; plenty of good posts skip some of these. These are just observations: posts that resonate tend to share most of these traits, so they're a useful lens when weighing a new idea:

1. **Personal, data-backed sourcing**: a number, a spreadsheet, a lived count, not just an opinion.
2. **A named professional pain**: speaks to a specific anxiety a reader can name (reorgs, getting promoted remotely, interviewing).
3. **A copy-pasteable playbook**: an actionable checklist, template, or steps people can bookmark and reuse.
4. **One punchy, contrarian-but-true thesis**: a single clear claim, not a survey of everything.

Distribution leans on sharing (social, direct) more than search, so shareability tends to matter more than SEO. The AI angle tends to land best when tied to firsthand management/GitHub experience rather than as a generic tooling take.

See [`src/content/CLAUDE.md`](src/content/CLAUDE.md) for detailed writing voice and SEO guidance.

## Testing

- Unit tests ([Vitest](https://vitest.dev)): `*.test.ts` alongside source, mostly `src/utils/` and `src/lib/`, plus [`worker/index.test.js`](worker/index.test.js)
- E2E tests ([Playwright](https://playwright.dev)): [`e2e/`](e2e/), with axe-core accessibility checks; CI also runs Lighthouse ([`.lighthouserc.json`](.lighthouserc.json))
- Use happy-dom when a unit test needs a DOM
- Run `npm run check` before committing Astro/TypeScript changes
- HTML must pass validation; images need alt text; links must be valid

## Front Matter

Blog posts and pages require:

```yaml
---
title: Clear title (no Markdown)
description: Brief description for SEO (first 150 chars after stripping Markdown)
---
```

Optional: `comments`, `redirect_from`, `image`, `redirect_to`

## Agent configuration

- [`.github/agents/`](.github/agents/) holds the `code`, `writing`, and `seo` agents. Copilot reads them there; [`.claude/agents/`](.claude/agents/) symlinks them for Claude Code. Use `writing` for posts and docs, `seo` for meta tags and structured data, and `code` for everything else.
- [`.github/instructions/`](.github/instructions/) holds path-scoped instructions. Each file carries Copilot's `applyTo:` and Claude Code's `paths:`, and [`.claude/rules/`](.claude/rules/) symlinks them.
- [`.github/workflows/copilot-setup-steps.yml`](.github/workflows/copilot-setup-steps.yml) installs Node and dependencies for Copilot's cloud agent.
- [`.claude/settings.json`](.claude/settings.json) registers Claude Code hooks in [`.claude/hooks/`](.claude/hooks/): `lint-guard` denies the repo-wide `npm run lint*` and `remark -o` commands above, and after each edit `emdash-check`, `prose-lint`, and `eslint-check` lint just that file (em dashes on added lines only) and feed failures back. Copilot doesn't run them.
