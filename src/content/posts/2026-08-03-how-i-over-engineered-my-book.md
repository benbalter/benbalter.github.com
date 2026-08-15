---
title: How I over-engineered my book
description: ""
tldr: ""
---

When you think about starting a new writing project, most people think about firing up Word or Google Docs. The publishing industry is no different. You spend months (or in my case years) writing a book, and then at the last moment its formatted for print and ebook. I started down this path, but all of the tools felt subpar to the ones I used as a developer every day.

Then it clicked. I've been making websites for decades. What if, instead of starting with a word processor and then doing a magic trick reveal, what if we could re-think authoring for modern publishing in a way that makes for an amazing authoring experience? What if we could use the same tools that we use to make websites to make books? There were a few missteps along the way (I do *not*, for example, recommend trying to learn LaTeX for typesetting), but in the end, I would not have written [Open and Async](https://open-and-async.com) any other way. Here was my process:

## Content

Naturally, the content itself lived as Markdown files in a Git repository. I used VS Code, with a handful of prose extensions (CITE). Each chapter was its own Markdown file, and a single `index.yml` file defined the order, making it easy to re-order chapters or add new ones. Practically, that meant that most writing occurred in Codespaces on an iPad, with a Bluetooth keyboard. I could write anywhere, and the Git repository kept everything in sync. This allowed me to focus on the content without distraction, and with the ability to easily roll back changes if I made a mistake. Not to mention, I had real-time feedback on my writing from the various prose linters, just as I would have real-time feedback on my code from ESLint or Prettier.

## Testing

With content as code, the next logical step was to set up automated tests. I did that in two ways, real-time, and on push (CI):

### Real-time

Locally, as I typed, I ran several VS Code extensions all giving me real-time feedback. Specifically:

- Markdownlint - DavidAnson.vscode-markdownlint
- [Harper](https://github.com/Automattic/harper)[^cspell]
- [LanguageTool](https://languagetool.org/)
- [Vale](https://vale.sh/)
- Alex (tlahmann.alex-linter, via vale in CI)
- Write-good (travisthetechie.write-good-linter, via vale in CI)

Those six tools also ran in CI (more on that below). Together, they enforced ~300 curated style rules enforcing 500+ banned terms, sitting on top of a 5,000-rule grammar engine.

### On each push

In addition to running those checks in CI (some blocking), I also built a custom test suite using Vitest, Playwright, and a handful of one-off scripts. Here are a few of my favorite examples:

#### Voice & style enforcement

- `validateHypotheticalHooks` — flags formulaic AI-tell openers ("Picture this…", "Imagine…", "Consider a…") at paragraph starts.
- `validateGitHubTense` — catches present-tense claims about working at GitHub; my time there has to read as past-tense recollection.
- `validateBoldKeywords` — flags `**Bold lead-in.**` pseudo-headings and pushes toward real, navigable H4s.
- `validateSentenceStarters` — flags three-plus consecutive sentences opening with the same word.

#### Structural integrity

- `validateCrossReferences` — every `[text](#anchor)` link resolves to a real heading.
- `validateIndexIntegrity` — `index.yml` and the `src/` files agree; no orphaned or unlisted chapters.
- `validateHeadingHierarchy` — no skipped heading levels (e.g., H2 jumping to H4).
- `validateDuplicateHeadings` — no two headings generate the same anchor slug book-wide.
- `validateCalloutDivs` — fenced callout divs (`::: {.tldr}` etc.) are opened and closed correctly.
- `validateCalloutBalance` — a chapter with a "For managers" callout also has its "For ICs" counterpart (and vice versa).
- `validateRoleCalloutLabels` — no hardcoded `**For managers:**` label; the CSS/Lua filter injects it, so hardcoding double-renders.
- `validateSectionIntro*` (4 checks — `HasLead`, `FinalLead`, `NoTldr`, plus the orchestrator) — section-opener pages start with a lead paragraph, end on a lead-in to the section, and skip the TL;DR.
- `validateTldrLength` — every chapter has a TL;DR and it stays within its length budget.
- `validateMinOpenerLength` — the opening hook isn't too thin to do its job.

#### Typographic & mechanical

- `validateSmallcaps` — acronyms use `[API]{.smallcaps}` formatting.
- `validateEscapedSmallcaps` — catches mis-escaped or malformed smallcaps spans.
- `validateAcronymExpansion` — acronyms are expanded on first use.
- `validateEmDashes` — consistent em-dash style and spacing.
- `validateNumberRangeDashes` — numeric ranges use en dashes (5–9, not 5-9).
- `validateQuotePunctuation` — curly quotes and correct punctuation placement.
- `validateListPunctuation` — consistent terminal punctuation within a list.
- `validateDoubledWords` — catches "the the" and friends.
- `validateOpenSourceHyphenation` — "open-source" as an adjective vs. "open source" as a noun.
- `validateParagraphLength` — flags paragraphs that run too long.

#### Guards (build & release safety)

- `validateNoTodoMarkers` — no stray `TODO` markers ship in the manuscript.
- `validateNoTransitionTodos` — no `TODO: TRANSITION` placeholders left between chapters.
- `validateBuildIdentifiers` — required identifier strings are present in the config files (substring match).
- `validateAmazonAssociateTag` — the Amazon Associates affiliate tag is correct where expected.
- `validateNoBareUrlLinkText` — no link whose visible text is just the raw URL.

All in all, the CI suite ran ~70 test files with 2,204 test cases and ~3,900 expect() assertions, plus another ~1,600 per-chapter structural checks from the validators above—roughly 5,500 automated checks in total.

## Audits

### Duplication detection

After reading the book over and over, I was _convinced_ I'd repeated the same idea across chapters. I wanted proof, not a hunch — so I built three layers of duplication detection, each catching what the one before it misses:

- **`jscpd`** — token-level copy-paste detection. Catches longer verbatim blocks I'd pasted between chapters, but nothing subtler.[^dry]
- **n-gram** — deterministic, zero-tokens, no AI or network. Tokenizes every chapter in `index.yml`, strips Markdown/Pandoc syntax, builds word n-grams (phrases of n words), and flags phrases appearing in more than one chapter (plus a "most-repeated stock wording" ranking). Two modes: cross-chapter (default `--n`) and intra-chapter (`--scope=intra --n=8`) for a chapter repeating itself.
- **semantic** — the one the other two can't do: the same _point_ restated in different words. An on-demand LLM audit, designed so it never feeds the whole book to a model — three passes, each over small units:
  - **intra** - one call per chapter, "where does this chapter restate itself?",
  - **cross** - a single call over every chapter's TL;DR → a map of conceptually overlapping chapters, a whole-book scan for the cost of one call, and 
  - **arguments** - extract each chapter's load-bearing claims one call at a time, then cluster the same argument across all chapters in one final call — catches arguments made in body prose that `cross` misses.

### Content audits

Beyond duplication, a second set of tools graded the prose itself — split by how they judge. Some are **probabilistic** (an LLM reads the chapter and forms an opinion; run it twice and the findings can shift), and some are **deterministic** (rules and arithmetic — same input, same output, every time).

#### Probabilistic (LLM) audits

I used a "prose audits" test, a per-chapter LLM auditor with **20 single-purpose lenses**, each asking one narrow question so the model can't hand-wave a vague "looks good." `--lens=all` runs every lens; `--models`/`--rounds` add a deduplicated multi-model and self-consistency panel, so a finding has to survive more than one model (or more than one run) to count. The lenses:

- **AI-tells** — flags phrasing that reads as machine-generated rather than my voice.
- **Claims** — surfaces checkable factual claims that need a source or a sanity check.
- **Consistency** — catches drift in the book's own conventions (terms, formatting, patterns).
- **Taglines** — spots "bumper-sticker" lines worth pulling out as quotable callouts.
- **Proofread** — line-level typos, grammar, and mechanical slips.
- **Dated** — perishable references that will age badly ("recently," "this year," current tools).
- **Global** — idioms and cultural assumptions that trip up a global audience.
- **Cross-reference** — verifies that "see chapter X" pointers actually resolve and say what I claim.
- **Legal** — legal or reputational risk (naming names, unverified accusations).
- **Hook** — whether the opening earns its place or is throat-clearing.
- **Acronyms** — every acronym expanded on first use.
- **Dual-audience** — whether the chapter serves both managers and individual contributors, not just one.
- **Jargon** — unexplained jargon, graded against the "explain it to a new hire" test.
- **Alt-text** — image alt text present and actually descriptive (accessibility).
- **Evidence** — assertions stated without the why or how to back them up.
- **Structure** — heading hierarchy and structural integrity.
- **Readability** — sentences that are hard to parse on one read.
- **Inclusive** — non-inclusive language, judged in context rather than by blocklist.
- **Emphasis** — typographic tics: overused bold, italics, and scare quotes.
- **Promise** — whether the chapter delivers actionable value against the book's core promise.

Separately, I also had a traits analysis test, which scored each chapter on persuasion and engagement traits, catching prose that's technically clean but flat for me to review.

#### Deterministic audits

In addition to the probabilistic LLM audits, I built a set of deterministic audits that I could run after a round of editing to see if the book was improving in terms of reading experience:

- **`audit-chapter-lengths.js` / `audit-paragraph-lengths.js`** — word and paragraph distribution, flagging outlier chapters and walls of text.
- **`reading-time.js`** — per-chapter and whole-book reading time at 238 wpm (average adult non-fiction speed).
- **`check-epub-size.js`** — a hard EPUB size budget; fails CI if any build blows past its threshold (Kindle penalizes oversized files on delivery).
- **Advisory local checkers**: `proselint`, GNU `diction` (wordy/misused phrases), GNU `style` (Flesch and other readability stats), and `consistency-check.js` (consistent spelling, hyphenation, and capitalization of key terms book-wide — is it "open source" or "open-source," "async" or "asynchronous").
- **Dashboard** - I had an on demand writing dashboard that generates an HTML dashboard with book-wide stats: word counts, callout inventory, and "attention items" (chapters missing a TL;DR, unbalanced callouts, etc.).

## Design

I had never published an ebook before. Two "ah hah" moments that changed the way I thought about publishing:

- **An ebook is a website in a trench coat** - EBooks are just HTML and CSS, albeit a very stripped down version. If you can make a website, you can make an ebook. 
- **A print book can be a website in a trench coat if you try hard enough** - CSS natively has powerful `@print` rules, including left and right page styling, title pages, page numbers, and more. (CITE based on actual usage)


For the interior design, I went with Tailwind CSS, my go to CSS framework. I trusted that it would give me an optimized build, and that `@tailwind/typography` would give me a good starting point for the typography.

Cover design.

2. Playwright specs (CI validate-playwright)

- script/accessibility.spec.js — axe-core checks against built HTML (the test:a11y gate, FR-V01).
- script/visual-design.spec.js — rendered layout/visual regression.

## Building

We've got clean Markdown, and a test suite that ensures the content is clean, but we still need to get it into a format that can be published (EPUB, Kindle, and Paperback). Core to that custom build pipeline was [Pandoc](https://pandoc.org/), a universal document converter that can read Markdown and spit out just about anything else. I used Pandoc as the engine, but built a lot of custom tooling around it to make it work for my needs:

### Pre-processing (before Pandoc sees the text)

- `update-revision.js` - stamps the build SHA/version onto the title page.
- `links-to-footnotes.js` - rewrites inline links as numbered footnotes for print (a hyperlink is useless on paper).

### CSS pipeline

- One Tailwind stylesheet (`src/style.css`) → PostCSS → `dist/style.css`.
- `strip-page-rules.js` derives a separate EPUB stylesheet, stripping CSS Paged-Media features (`@page`, `target-counter()`, `oklch()`, custom properties) that Kindle and EPUBCheck choke on.

### Lua filters (the interesting part — Pandoc's AST is programmable)

- `add-div-titles.lua` — injects the callout labels ("TL;DR: ", "💡 Pro-Tip: ", "👔 For managers: ") and DPUB-ARIA roles for EPUB/DOCX, so they aren't hardcoded in the prose.
- `strip-comments.lua` — removes HTML comments from HTML/EPUB output.
- `strip-emoji-kindle.lua` — swaps color emoji for Kindle-safe glyphs (e-ink has no bundled emoji font).
- `body-emoji-images.lua` — converts body emoji to inline Twemoji `<img>` tags for the print PDF.
- `tagline-share-links.lua` — appends a "share this idea" permalink after each tagline in the EPUB.

### Rendering & post-processing per format

- HTML/PDF render through Pandoc; the PDF is drawn by **WeasyPrint** (an HTML/CSS-to-PDF engine — I typeset the book with the same box model as a web page).
- EPUB embeds WOFF2 font subsets, then `postprocess-epub.js` cleans up the package.
- The paperback PDF is converted to **PDF/X-1a:2001** via Ghostscript (`convert-pdfx.sh`) — CMYK, an embedded USWebCoatedSWOP ICC profile, flattened transparency — because IngramSpark won't accept anything else.
- A page-count gate (`check-pdf-page-count.js`) locks the print PDF at exactly 576 pages so spine width can't silently drift.


Pandoc.

Five things come out the other end: a web preview, an EPUB, a Kindle-specific EPUB, a 6"×9" paperback PDF, and that same PDF converted to PDF/X-1a—an ancient, strictly color-managed flavor of PDF that IngramSpark, the vendor that gets books into stores and libraries, refuses to live without. 

1. Vitest suite (npm test → CI lint-and-test)

70 files, ~2,204 cases, ~3,882 assertions. These test the machinery, not the prose. Rough groupings:

- Build-pipeline correctness — strip-page-rules, test-postcss-pipeline, minify-css, preprocess-markdown, links-to-footnotes, inline-footnotes, postprocess-epub, reorder-print-frontmatter.
- Format/distributor compliance — test-distributor-compliance, check-epub-size, generate-onix, test-cover-requirements, check-pdf-page-count (the 576-page lock), update-revision.
- Typography regression (a big cluster) — test-typography, test-typographic-transforms, test-table-typography, test-smallcaps-css, test-accessibility-typography, test-dark-mode-typography, test-print-* (layout/contrast/pagination/callout-css).
- Kindle/EPUB constraints — test-epub-body-constraints, test-epub-font-size, kindle-fonts, kindle-css-validation, kindle-parity, kindle-emoji*, cross-format-parity, test-cross-format-body, test-cascade-regression.
- Content-rule unit tests — no-cliches, no-cultural-idioms, no-vague-intensifiers, no-ai-like-patterns, consistency-check, manage-tldrs, test.test.js (tests the validators themselves).
- Tooling — ai-client, pull-sales, build-mcp-data, audiobook-pipeline, audiobook-tts, reading-time, optimize-images, etc.


7. Build-time validation gates (CI build.yml)

Separate jobs beyond the unit suite: EPUBCheck (validate-epubcheck), ACE by DAISY (validate-ace, EPUB accessibility), link checking (lychee, validate-links), HTML validation (validate-html), plus the per-format builders each acting as a smoke test.






## Publishing

## Looking forward

* Translations
* Audiobookxs
- Audiobook QA (a whole sub-suite): audiobook-qc-suite.js, audiobook-stt-qc.js, audiobook-phoneme-qc.js, audiobook-pronunciation-audit.js + the audiobook-qc.yml/audiobook-release-qc.yml workflows.


## TODO:


[^cspell]: I'm a terrible speller so I also ran [CSpell](https://github.com/streetsidesoftware/cspell) in VS Code, which shared a custom dictionary with Harper.
[^dry]: jscpd is not prose-specific. It's a great way to DRY up code.