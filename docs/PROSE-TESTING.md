# Prose Testing

How the Markdown in this repository (posts, résumé positions, and docs) gets checked for spelling, grammar, and style, and which of those checks can fail a build.

## What CI runs

The `Content Linting` job in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs [`script/cibuild-content`](../script/cibuild-content), which runs these in order:

| Step | Tool | Fails the build? |
| --- | --- | --- |
| `npm run lint-md-check` | [markdownlint](https://github.com/DavidAnson/markdownlint-cli2) | Yes |
| `script/lint-text` | [textlint](https://textlint.org) | No: it runs as a dry run, which always exits 0 |
| `script/vale` | [Vale](https://vale.sh) | Yes, on error-level alerts |
| `script/vale-ai-tells` | Vale with the ai-tells package | No: advisory |
| `script/harper` | [Harper](https://github.com/Automattic/harper) | No: `harper-cli` always exits 1, so the wrapper ignores its exit code |
| `npm run check-image-privacy` | [`script/check-image-privacy.ts`](../script/check-image-privacy.ts) | Yes |
| `npm run validate-seo` | [`script/validate-seo.ts`](../script/validate-seo.ts) | Yes, on errors; length warnings are advisory |

The same job first runs `npm run check-content-integrity`, which stops a bulk edit (six or more posts) from changing code, URLs, or quoted text.

[LanguageTool](https://languagetool.org) runs as its own CI job against a Docker service container, and fails the build on a finding.

remark and its retext plugins, which include the spell-checker, don't run in CI. They run locally through `npm run lint-check` (part of `npm test`), and only report.

## Running the checks locally

```bash
# Everything CI runs for content
script/cibuild-content

# One tool at a time, on one file
npx markdownlint-cli2 src/content/posts/my-post.md
npx remark src/content/posts/my-post.md   # report-only
vale src/content/posts/my-post.md
script/harper
script/languagetool
```

Lint the files you changed. `npm run lint-md` and `npm run lint` rewrite every file in the repository that has a violation.

`markdownlint-cli2 --fix <file>` is safe to run on a single file. Never run `remark <file> -o`: writing remark's output back adds backslash escapes (`\[`, `\_`) that break the build. See [`AGENTS.md`](../AGENTS.md#markdown-linting).

## The tools

### markdownlint

Structure and formatting of Markdown. Configured in [`.markdownlint-cli2.cjs`](../.markdownlint-cli2.cjs).

### remark and retext

Configured in [`.remarkrc.js`](../.remarkrc.js). The active retext plugins:

- `retext-spell`: spelling, with the custom dictionary in [`dictionary.txt`](../dictionary.txt)
- `retext-indefinite-article`: a/an
- `retext-repeated-words`: doubled words
- `retext-redundant-acronyms`: "ATM machine"
- `retext-sentence-spacing`: spacing between sentences

Off, with the reasons in `.remarkrc.js`: `retext-equality` (Vale covers it), `retext-passive`, `retext-readability`, `retext-simplify`, and `retext-intensify` (too noisy for this writing).

Typography (smart quotes, dashes) is applied when the site renders, not by the linter.

### textlint

Common misspellings, terminology ("GitHub", not "Github"), unmatched pairs, and doubled spaces. Configured in [`.textlintrc`](../.textlintrc).

### Vale

Style rules, including the `BenBalter` and `AIPatterns` styles from [benbalter/vale-styles](https://github.com/benbalter/vale-styles), plus alex, proselint, write-good, and the Microsoft style guide. Configured in [`.vale.ini`](../.vale.ini). CI installs Vale and [`script/vale`](../script/vale) refuses to pass without it; locally the script skips Vale if it isn't installed (`brew install vale`).

`script/vale` also fails on any em dash in the agent-instruction files.

### Harper

Offline grammar checking. Install the `harper-cli` binary to run it locally.

### LanguageTool

Grammar and style. Disabled rules are in [`.languagetoolrc.json`](../.languagetoolrc.json); its spelling, a/an, and repeated-word rules are off because the retext plugins cover them. To run it locally you need a LanguageTool server:

```bash
docker run -d -p 8010:8010 erikvl87/languagetool
script/languagetool
```

## False positives

- Spelling: add the word to `dictionary.txt`, then run `script/alphabetize-dictionary`.
- Terminology: add it to `terminology.exclude` in `.textlintrc`.
- Vale: adjust the rule's level in `.vale.ini`.
