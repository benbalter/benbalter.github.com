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
| `remark` | Lint markdown with remark, then clean up escaping artifacts via `fix-lint` | `script/remark` | Before committing markdown changes |
| `fix-lint` | Remove excessive escaping that remark adds (backslash-brackets, underscores, etc.) | `script/fix-lint` | Always run after `script/remark` or `npm run lint-md` |
| `lint-text` | Run textlint on markdown files (wrapper around `npm run lint-text`) | `script/lint-text` | Before committing prose changes |
| `vale` | Run [Vale](https://vale.sh) prose style and grammar checks on markdown | `script/vale` | Before committing prose changes |
| `harper` | Run [Harper](https://github.com/Automattic/harper) offline grammar checker on posts | `script/harper` | Before committing prose changes |
| `languagetool` | Run [LanguageTool](https://languagetool.org) grammar checker against a local server | `script/languagetool [file...]` | During CI or locally with a running LanguageTool server |
| `cibuild-content` | Run all content-quality checks in sequence (remark → textlint → Vale → Harper → LanguageTool) | `script/cibuild-content` | In CI; or locally to run the full prose-lint suite |

### Linting — code

| Script | Description | Usage | When to run |
| --- | --- | --- | --- |
| `super-linter` | Run [GitHub Super Linter](https://github.com/super-linter/super-linter) locally via Docker | `script/super-linter` | To replicate CI linting locally |

### SEO and validation

| Script | Description | Usage | When to run |
| --- | --- | --- | --- |
| `validate-seo.ts` | Check all pages for SEO issues (missing titles, duplicate titles, meta descriptions, heading hierarchy, image alt text) | `npm run validate-seo` | Before publishing new content |

### Utilities

| Script | Description | Usage | When to run |
| --- | --- | --- | --- |
| `alphabetize-dictionary` | Sort and deduplicate entries in `dictionary.txt` (used by spellcheck) | `script/alphabetize-dictionary` | After adding words to the dictionary |
| `branding` | Print the ASCII art banner | `script/branding` | Called by `bootstrap` and `cibuild-content` |
| `title` | Print a section-title banner (used by `cibuild-content` to separate steps) | `script/title "step name"` | Called internally by other scripts |

## Prerequisites

| Dependency | Required by | Install |
| --- | --- | --- |
| Node.js 22+ | All scripts | <https://nodejs.org> |
| Ruby | `alphabetize-dictionary`, `fix-lint` | `brew install ruby` or system Ruby |
| Docker | `super-linter` | <https://docs.docker.com/get-docker/> |
| Vale | `vale` | <https://vale.sh/docs/vale-cli/installation/> |
| Harper | `harper` | <https://github.com/Automattic/harper> |
| LanguageTool server | `languagetool` | `docker run -d -p 8010:8010 erikvl87/languagetool` |

Vale and Harper are optional — scripts that depend on them print an install hint and exit gracefully if the tool is not found. LanguageTool requires a running server (defaults to `http://localhost:8010`); the script skips silently if the server is unreachable.

## npm script mappings

Many scripts are also available as npm commands:

```text
npm run build          → astro build + inject-modulepreload + inject-image-size + pagefind
npm run lint           → lint-js + lint-json + lint-md
npm run lint-md        → remark + markdownlint-cli2
npm run lint-text      → textlint
npm run validate-seo   → script/validate-seo.ts (via tsx)
npm run test           → astro check + lint
npm run test:vitest    → Vitest unit tests
npm run test:e2e       → Playwright E2E tests
npm run super-linter   → script/super-linter
```
