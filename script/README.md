# Build scripts

Helper scripts for building, testing, and linting the site. Most follow the [Scripts to Rule Them All](https://github.com/github/scripts-to-rule-them-all) pattern.

## Quick reference

### Setup and build

| Script | Description | Usage | When to run |
| --- | --- | --- | --- |
| `bootstrap` | Install dependencies and set up the dev environment | `script/bootstrap` | After cloning or pulling new changes |
| `test-astro` | Build the Astro site and verify key pages exist | `script/test-astro` | To smoke-test the full build pipeline |
| `analyze-bundle` | Report JavaScript, CSS, and image bundle sizes from `dist-astro/` | `script/analyze-bundle` | After a build, to check for size regressions |

### Post-build transforms

These run automatically as part of `npm run build` (in order: `astro build` → `inject-modulepreload` → `inject-image-size` → Pagefind). You should not need to run them manually.

| Script | Description | Usage | When to run |
| --- | --- | --- | --- |
| `inject-modulepreload` | Scan built HTML for `<script type=module>` tags, resolve their static imports, and inject `<link rel="modulepreload">` hints into `<head>` | `script/inject-modulepreload` | Runs automatically after `astro build` |
| `inject-image-size` | Add missing `width`/`height` attributes to `<img>` tags in built HTML to prevent layout shift (CLS) | `script/inject-image-size` | Runs automatically after `astro build` |

### Linting — prose and markdown

| Script | Description | Usage | When to run |
| --- | --- | --- | --- |
| `remark` | Lint markdown with remark (report-only; does not rewrite files) | `script/remark` | Before committing markdown changes |
| `fix-lint` | Manual rescue: remove backslash escaping left behind if someone ran `remark -o` by hand | `script/fix-lint` | Rarely — only after an accidental `remark -o` |
| `lint-text` | Run textlint on markdown files (wrapper around `npm run lint-text`) | `script/lint-text` | Before committing prose changes |
| `vale` | Run [Vale](https://vale.sh) prose style and grammar checks on markdown | `script/vale` | Before committing prose changes |
| `harper` | Run [Harper](https://github.com/Automattic/harper) offline grammar checker on posts | `script/harper` | Before committing prose changes |
| `languagetool` | Run [LanguageTool](https://languagetool.org) grammar checker against a local server | `script/languagetool [file...]` | During CI or locally with a running LanguageTool server |
| `cibuild-content` | Run all content-quality checks in sequence (markdownlint → textlint → Vale → Harper → SEO); LanguageTool runs as its own CI job | `script/cibuild-content` | In CI; or locally to run the full prose-lint suite |

### Linting — code

| Script | Description | Usage | When to run |
| --- | --- | --- | --- |
| `super-linter` | Run [GitHub Super Linter](https://github.com/super-linter/super-linter) locally via Docker (not part of CI) | `script/super-linter` | For an optional broad lint sweep |

### SEO and validation

| Script | Description | Usage | When to run |
| --- | --- | --- | --- |
| `validate-redirects` | Check `_redirects` syntax (field count, status codes, duplicate sources, loops). Defaults to `public/_redirects`; pass `dist-astro/_redirects` to check the built file, which adds front matter redirects | `script/validate-redirects [file]` | After editing `_redirects` or `redirect_from`/`redirect_to` front matter |
| `validate-seo.ts` | Check all pages for SEO issues (missing titles, duplicate titles, meta descriptions, heading hierarchy, image alt text) | `npm run validate-seo` | Before publishing new content |
| `validate-markdown-siblings` | Check that every page the zone's `Accept: text/markdown` rewrite targets has its pre-built `.md` sibling in `dist-astro/` | `script/validate-markdown-siblings` | Runs in the deploy workflow after the build |
| `check-markdown-negotiation` | Check Markdown content negotiation against the live site (zone rules that `wrangler dev` doesn't run) | `script/check-markdown-negotiation [base-url]` | After changing the zone rules or the Worker |
| `check-content-integrity.ts` | Flag post changes that go beyond prose: >10% word loss, or any edit to code blocks, inline code, scripts/styles, URLs, or blockquote text. Fails only for bulk diffs (6+ posts) without a `Content-Integrity: reviewed` commit trailer; smaller diffs get warnings | `npm run check-content-integrity -- --base=<ref>` | Runs in CI; run locally before committing any automated pass over the archive |

### Utilities

| Script | Description | Usage | When to run |
| --- | --- | --- | --- |
| `alphabetize-dictionary` | Sort and deduplicate entries in `dictionary.txt` (used by spellcheck) | `script/alphabetize-dictionary` | After adding words to the dictionary |
| `branding` | Print the ASCII art banner | `script/branding` | Called by `bootstrap` and `cibuild-content` |
| `title` | Print a section-title banner (used by `cibuild-content` to separate steps) | `script/title "step name"` | Called internally by other scripts |
| `new` | Scaffold a new post in `src/content/posts/` | `script/new <title>` | When starting a post |
| `changed-content` | Print Markdown content files changed between two commits | `script/changed-content <base> <head>` | Used by CI to lint only what a PR touched |
| `build-headshots` | Rebuild every headshot (nav avatars, About photo, social cards, vCard) from one source portrait | `script/build-headshots` | After swapping the source portrait |
| `update-bookmarklets` | Refresh the vendored `src/data/bookmarklets.json` from [benbalter/bookmarklets](https://github.com/benbalter/bookmarklets); `--latest` moves to the tip of `main`, `--check` is the CI guard | `script/update-bookmarklets [--latest\|--check]` | On Renovate's bookmarklets PRs, or when adding a bookmarklet |
| `strip-markdown.awk` | Shared Markdown/MDX-to-plain-text stripper so prose linters see prose, not markup | Used by `harper` and `languagetool` | Called internally |
| `build-link-previews.ts` | Cache GitHub repo and Wikipedia metadata for link hover cards in the committed `src/data/link-previews.json` (served at `/link-previews.json`); incremental, and prunes links no post uses. Uses `GITHUB_TOKEN` or `gh auth token` | `npm run link-previews` (`-- --refresh` refetches everything, for fresh star counts) | After adding posts that link to GitHub repos or Wikipedia |
| `smoke-deploy` | Wait for `/version.txt` to serve a commit, then check that key URLs return 200 | `script/smoke-deploy [commit] [base-url]` | Runs in the deploy workflow after `wrangler deploy`; locally to check what's live |
| `build-remote-image-dimensions` | Cache dimensions of remote `<img>` URLs for `inject-image-size` | `script/build-remote-image-dimensions` | After adding posts with remote images |
| `popular-posts.ts` | Write the gitignored `src/data/popular-posts.json` (top posts by Cloudflare Web Analytics pageviews, trailing 30 days) for the "Most read this month" list on `/posts/`. Needs `CLOUDFLARE_ANALYTICS_API_TOKEN` with Account Analytics: Read; skips quietly without it | `npm run popular-posts` | Runs in the deploy workflow before the build; locally to preview the list |
| `update-ai-tells` / `vale-ai-tells` | Bump the pinned `vale-ai-tells` release; run its advisory, non-gating check | `script/update-ai-tells`, `script/vale-ai-tells` | Run by `update-ai-tells.yml`; advisory locally |
| `analytics.mjs` | Print a Cloudflare Web Analytics (RUM) report | `node script/analytics.mjs` | Ad hoc traffic checks |
| `design-shots.mjs` | Screenshot key pages for design review | `node script/design-shots.mjs` | Before and after visual changes |
| `email-broadcast.mjs` | Send a Kit broadcast for newly published posts | Run by `email-broadcast.yml` | Automatic after deploy |
| `standard-site/` | Publish posts to AT Protocol (standard.site) | `npm run standard-site:*` | Automatic after deploy; manual for backfills |
| `foundry-*.ts` | Azure AI Foundry batch passes over the archive (QA, fixes, classification, interlinks, engagement, drafts) | `npx tsx script/foundry-<name>.ts` | Ad hoc archive audits |

## Prerequisites

| Dependency | Required by | Install |
| --- | --- | --- |
| Node.js 22+ | All scripts | <https://nodejs.org> |
| Ruby | `alphabetize-dictionary`, `fix-lint` | `brew install ruby` or system Ruby |
| Docker | `super-linter` | <https://docs.docker.com/get-docker/> |
| Vale | `vale` | <https://vale.sh/docs/vale-cli/installation/> |
| Harper | `harper` | <https://github.com/Automattic/harper> |
| LanguageTool server | `languagetool` | `docker run -d -p 8010:8010 erikvl87/languagetool` |

Vale and Harper are optional — scripts that depend on them print an install hint and exit gracefully if the tool is not found. LanguageTool requires a running server (defaults to `http://localhost:8010`); locally the script skips if the server is unreachable, and in GitHub Actions it fails instead.

## npm script mappings

Many scripts are also available as npm commands:

```text
npm run build          → astro build + inject-modulepreload + inject-image-size + pagefind
npm run lint           → lint-js + lint-json + lint-md
npm run lint-md        → remark + markdownlint-cli2
npm run lint-text      → textlint
npm run validate-seo   → script/validate-seo.ts (via tsx)
npm run check-content-integrity → script/check-content-integrity.ts (via tsx)
npm run test           → astro check + check:tooling + lint-check + Vitest
npm run test:vitest    → Vitest unit tests
npm run test:e2e       → Playwright E2E tests
npm run super-linter   → script/super-linter
```
