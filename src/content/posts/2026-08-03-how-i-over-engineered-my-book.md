---
title: How I over-engineered my book
description: "How I wrote and published a book the way I'd ship software: Markdown in Git, thousands of automated checks, and a Pandoc build pipeline that produces every format on each push."
tldr: "I treated my book like a software project—Markdown in Git, real-time and CI linting, ~5,500 automated checks, and a Pandoc pipeline that builds the web, EPUB, Kindle, and print editions on every push."
---

When you think about starting a new writing project, most people think about firing up Word or Google Docs. The publishing industry is no different. You spend months (or in my case years) writing a book, and then at the last moment it's formatted for print and ebook. I started down this path, but all of the tools felt subpar to the ones I used as a developer every day.

Then it clicked. I've been making websites for decades. What if, instead of starting with a word processor and doing a magic-trick reveal at the end, we could re-think authoring for modern publishing in a way that makes for an amazing authoring experience? What if we could use the same tools that we use to make websites to make books? There were a few missteps along the way (I do *not*, for example, recommend trying to learn LaTeX for typesetting), but in the end, I would not have written [Open and Async](https://open-and-async.com) any other way. Here was my process:

## Content

Naturally, the content itself lived as Markdown files in a Git repository. I used VS Code, with a handful of prose extensions (listed below). Each chapter was its own Markdown file, and a single `index.yml` file defined the order, making it easy to re-order chapters or add new ones. Practically, that meant that most writing occurred in Codespaces on an iPad, with a Bluetooth keyboard. I could write anywhere, and the Git repository kept everything in sync. This allowed me to focus on the content without distraction, and with the ability to easily roll back changes if I made a mistake. Not to mention, I had real-time feedback on my writing from the various prose linters, just as I would have real-time feedback on my code from ESLint or Prettier.

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

All six also ran in CI (Alex and Write-good folded into Vale there; more on that below). Together, they enforced ~300 curated style rules covering 500+ banned terms, sitting on top of a 5,000-rule grammar engine.

### On each push

In addition to running those linters in CI (some blocking), I built a custom test suite of my own: a standalone Node script of content validators, a Vitest suite, and Playwright specs. The validators are the fun part, so here are a few favorites:

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

All in all, the CI suite ran ~70 test files with 2,204 test cases and ~3,900 `expect()` assertions, plus another ~1,600 per-chapter structural checks from the validators above — roughly 5,500 automated checks in total.

## Audits

### Duplication detection

After reading the book over and over, I was _convinced_ I'd repeated the same idea across chapters. I wanted proof, not a hunch — so I built three layers of duplication detection, each catching what the one before it misses:

- **`jscpd`** — token-level copy-paste detection. Catches longer verbatim blocks I'd pasted between chapters, but nothing subtler.[^dry]
- **n-gram** — deterministic, zero-tokens, no AI or network. Tokenizes every chapter in `index.yml`, strips Markdown/Pandoc syntax, builds word n-grams (phrases of n words), and flags phrases appearing in more than one chapter (plus a "most-repeated stock wording" ranking). Two modes: cross-chapter (default `--n`) and intra-chapter (`--scope=intra --n=8`) for a chapter repeating itself.
- **semantic** — the one the other two can't do: the same _point_ restated in different words. An on-demand LLM audit, designed so it never feeds the whole book to a model — three passes, each over small units:
  - **intra** — one call per chapter: "where does this chapter restate itself?"
  - **cross** — a single call over every chapter's TL;DR, producing a map of conceptually overlapping chapters. A whole-book scan for the cost of one call.
  - **arguments** — extract each chapter's load-bearing claims one call at a time, then cluster the same argument across all chapters in one final call. Catches arguments made in body prose that `cross` misses.

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

Separately, I also had a traits analysis test, which scored each chapter on persuasion and engagement traits, catching prose that was technically clean but flat so I could give it another pass.

#### Deterministic audits

In addition to the probabilistic LLM audits, I built a set of deterministic audits that I could run after a round of editing to see if the book was improving as a reading experience:

- **`audit-chapter-lengths.js` / `audit-paragraph-lengths.js`** — word and paragraph distribution, flagging outlier chapters and walls of text.
- **`reading-time.js`** — per-chapter and whole-book reading time at 238 wpm (average adult non-fiction speed).
- **`check-epub-size.js`** — a hard EPUB size budget; fails CI if any build blows past its threshold (Kindle penalizes oversized files on delivery).
- **Advisory local checkers**: `proselint`, GNU `diction` (wordy/misused phrases), GNU `style` (Flesch and other readability stats), and `consistency-check.js` (consistent spelling, hyphenation, and capitalization of key terms book-wide — is it "open source" or "open-source," "async" or "asynchronous").
- **Dashboard** — an on-demand `writing-dashboard.js` that renders book-wide stats to HTML: word counts, callout inventory, and "attention items" (chapters missing a TL;DR, unbalanced callouts, and the like). Its `--check` mode is a CI gate that fails the build unless attention items are at zero.

## Design

I am _far_ from a designer. Adding to that, I had never published an ebook before, and had no idea how they worked, beyond reading many of them. Two "ah hah" moments changed the way I thought about publishing:

- **An ebook is a website in a trench coat** - Ebooks are just HTML and CSS, albeit a very stripped down version. If you can make a website, you can make an ebook. 
- **A print book can be a website in a trench coat if you try hard enough** - CSS natively has powerful `@media print` and `@page` rules, including left and right page styling, title pages, page numbers, and more.

For the interior design, I went with Tailwind CSS, my go to CSS framework. I trusted that it would give me an optimized build, and that `@tailwindcss/typography` would give me a good starting point for the typography.

One call out: I purposefully hired a _human_ designer for the cover. For a book about being authentic, the first impression had to be authentic.

### Tests

Of course, I built a test suite to validate the design and layout too — driven by Playwright against the built HTML, so it checks what actually renders, not what I hoped the CSS did. Two categories:

#### Accessibility (axe-core)

Runs the `axe-core` engine over the rendered book, in **both light and dark mode**, against WCAG 2.1 AA. This is the `test:a11y` gate, enforced in CI as `validate-playwright`:

- **No critical or serious violations** on the full page.
- **Color contrast** passes AA thresholds — in both color schemes.
- **Images have alt text.**
- **Headings are in logical order** (no skipped levels).
- **Links have discernible text** (no bare "click here" or empty anchors).
- **Document declares a `lang` attribute** so screen readers pick the right pronunciation.

#### Visual & layout regression (Playwright)

Asserts that the actual computed styles match the design intent — the stuff that silently breaks when a CSS refactor goes sideways:

- **Title page** — title, subtitle, and author render centered, with the subtitle in a lighter weight.
- **Table of contents** — a real `nav` element with the `doc-toc` role, containing working navigation links.
- **Copyright page** — present, and bottom-aligned via flexbox on screen.
- **Callouts** — every callout type (TL;DR, Pro-tip, For-managers, For-ICs, Common-objection, Key-takeaways) has its distinct left-border color, background, and auto-generated label prefix — and each type's border color is unique, so they're never confusable.
- **Small caps** — acronyms actually get `font-variant: small-caps` and letter-spacing, not just a class name.
- **Heading hierarchy** — H2 is larger than body text, H3 smaller than H2.
- **Links** are underlined; **code blocks** have a dark background for contrast and inline code a visible background; **blockquotes** carry a left border.
- **Body typography** uses the Tailwind Typography `prose` class.

## Building

We've got clean Markdown, and a test suite that ensures the content is clean, but we still need to get it into a format that can be published (EPUB, Kindle, and Paperback). Core to that custom build pipeline was [Pandoc](https://pandoc.org/), a universal document converter that can read Markdown and spit out just about anything else. I used Pandoc as the engine, but built a lot of custom tooling around it to make it work for my needs:

### A reproducible toolchain

Pandoc is only the engine. The full build also needs [WeasyPrint](https://weasyprint.org/) to draw the PDF, Ghostscript to convert it, and a pile of Noto fonts for full Unicode coverage — a gnarly stack of native dependencies to install by hand. So the whole thing lives in a Docker image and a dev container, pinned to an exact renderer version (a detail that matters more than you'd think — see the page-count gate below). That container is also why I could draft the book from an iPad: the heavy toolchain ran in Codespaces, not on my lap.

### Pre-processing (before Pandoc sees the text)

Everything starts on a throwaway copy of the source tree, so these transforms never touch the real chapters. A couple of scripts massage that copy before Pandoc ever runs:

- **`update-revision.js`** — stamps the exact build SHA and version onto the title page, so every copy is traceable to the commit it came from.
- **`links-to-footnotes.js`** — rewrites inline links as numbered footnotes for the print build. A hyperlink is useless on paper; a footnote with the full URL isn't.
- **A per-format manifest** — the same chapters, but reshuffled per output: the EPUB builds get a short list of shareable quote links; print and Kindle get a QR share page instead. Same source, subtly different books.

### CSS pipeline

The whole book is styled with a single stylesheet, but each format needs a slightly different slice of it:

- **One Tailwind stylesheet** (`src/style.css`) compiles through PostCSS to `dist/style.css`. Screen, print, and EPUB all start from the same source of truth.
- **`strip-page-rules.js`** — derives a separate, cut-down stylesheet for EPUB, stripping the CSS Paged-Media features (`@page`, `target-counter()`, `oklch()`, custom properties) that Kindle and EPUBCheck choke on.

### Lua filters (the interesting part)

This is the part I didn't expect to love. Pandoc parses everything into an abstract syntax tree and lets you rewrite that tree with small Lua scripts before it renders — so format-specific tweaks live in code, not smeared through the prose:

- **`add-div-titles.lua`** — injects the callout labels ("TL;DR: ", "💡 Pro-Tip: ", "👔 For managers: ") and DPUB-ARIA accessibility roles, so those labels aren't hardcoded in every chapter and can differ per format.
- **`strip-comments.lua`** — strips HTML comments out of the HTML and EPUB output.
- **`strip-emoji-kindle.lua`** — swaps color emoji for Kindle-safe glyphs, because e-ink has no bundled emoji font.
- **`body-emoji-images.lua`** — for the print PDF, converts body emoji to inline Twemoji `<img>` tags so they render in full color on the page.
- **`tagline-share-links.lua`** — appends a "share this idea" permalink after each of the book's bumper-sticker lines in the EPUB.

### Rendering & post-processing per format

With the tree transformed, each format renders down its own path — and the print PDF has the longest one:

- **HTML and PDF** render through Pandoc, with the PDF drawn by **WeasyPrint**, an HTML/CSS-to-PDF engine. In other words, I typeset the whole book with the same box model I'd use for a web page.
- **EPUB** embeds WOFF2 font subsets, then `postprocess-epub.js` cleans up the package to keep it valid and small.
- **The paperback PDF** gets converted to **PDF/X-1a:2001** via Ghostscript — CMYK color, an embedded USWebCoatedSWOP ICC profile, and flattened transparency.
- **A page-count gate** (`check-pdf-page-count.js`) locks the print PDF at exactly 576 pages. Spine width is calculated from the page count, so if the count drifts, the cover art no longer fits the spine.

All told, five things come out the other end: a web preview, an EPUB, a Kindle-specific EPUB, a 6"×9" paperback PDF, and that same PDF converted to PDF/X-1a — an ancient, strictly color-managed flavor of PDF that IngramSpark, the vendor that gets books into stores and libraries, refuses to live without.[^docx]

### Testing the build

That ~70-file Vitest suite from earlier? Most of it has nothing to do with the prose — it's there to keep the _build_ honest. A Pandoc upgrade or a stray line of CSS can silently break an output format, and I wouldn't find out until a reader's Kindle rendered the wrong font. The tests catch it first. Roughly grouped:

- **Build-pipeline correctness** — that each transform does exactly what it should: `strip-page-rules`, `preprocess-markdown`, `links-to-footnotes`, `inline-footnotes`, `postprocess-epub`, `reorder-print-frontmatter`, and the PostCSS/minify steps.
- **Format & distributor compliance** — the rules each store enforces: `test-distributor-compliance`, `check-epub-size`, `generate-onix` (the metadata feed the catalogs ingest), `test-cover-requirements`, and `check-pdf-page-count`, which locks the paperback at exactly 576 pages so the spine width can't drift.
- **Typography regression** — the biggest cluster, because typography is where things break quietly: smallcaps, tables, print contrast, dark mode, and the print layout and pagination rules.
- **Kindle & EPUB constraints** — Kindle is the fussiest target, so it gets its own battery: font embedding, CSS validation, cross-format parity, and emoji handling (e-ink has no emoji font).
- **Content-rule unit tests** — the custom validators from earlier, run against known-good and known-bad fixtures so the linters themselves don't regress.
- **Tooling** — the odds and ends: the sales-report scraper, the audiobook pipeline, image optimization, and so on.

### Validation gates

Unit tests prove _my_ code is right; they don't prove the _output_ is valid. For that, the build runs each artifact through the same validators the stores themselves use — so a rejection happens on my laptop, not on upload day:

- **EPUBCheck** — the industry-standard EPUB validator. Every store runs it on upload, so I run it first; a failure here is a hard rejection everywhere.
- **ACE by DAISY** — an accessibility audit built specifically for EPUB, on top of the axe-core checks from earlier.
- **lychee** — crawls every link in the built HTML for rot.
- **HTML validation** — catches malformed markup before it can become a malformed ebook.

And the per-format builders double as smoke tests: if any format fails to build, the whole pipeline goes red.

### Every push, every format

None of this is something I have to remember to run. Every push to `main` fans out into **14 parallel CI jobs**: build the CSS, then the EPUB, Kindle EPUB, print PDF, PDF/X-1a, HTML, and DOCX side by side, and validate each one — EPUBCheck, ACE, links, HTML, duplicates, and the Playwright suite — as its artifact comes ready. A green check means every format built and passed every gate; a red X means something's off before I've even alt-tabbed away.

<!-- SCREENSHOT: GitHub Actions run showing the parallel build + validate jobs -->

And because every build stamps its commit onto the title page, the book is versioned like software. I'm on release 1.0.1 — with a tag and a changelog, not a graveyard of `final_v3_revised_ACTUALLY_FINAL.docx` files. A typo fix is a point release.

### By the numbers

- **~100,000 words** across ~70 chapters and sections
- **576 pages** in print (6"×9")
- **5 published formats** (plus a DOCX I don't ship)
- **~70 test files**, 2,204 test cases, ~5,500 automated checks
- **14 parallel CI jobs** on every push
- **~300 style rules** covering 500+ banned terms, over a 5,000-rule grammar engine
- **5,000+ commits** to get here

## Publishing

## Looking forward

* Translations
* Audiobookxs
- Audiobook QA (a whole sub-suite): audiobook-qc-suite.js, audiobook-stt-qc.js, audiobook-phoneme-qc.js, audiobook-pronunciation-audit.js + the audiobook-qc.yml/audiobook-release-qc.yml workflows.


## TODO:


[^cspell]: I'm a terrible speller so I also ran [CSpell](https://github.com/streetsidesoftware/cspell) in VS Code, which shared a custom dictionary with Harper.
[^dry]: jscpd is not prose-specific. It's a great way to DRY up code.
[^docx]: The build actually emits a sixth artifact—a DOCX—for editors who prefer to review in Word, but it's a working format, not something I publish.