---
title: "Accessible by default: writing a book like software"
description: "The ebook meets the Web Content Accessibility Guidelines (WCAG 2.1 Level AA) because the format wouldn't let me fake a heading and a browser audits every build, not because anyone scheduled a week for it. What Markdown can't check—color contrast, generated markup—axe-core checks under Playwright."
tldr: "Most of accessibility is structure, and Markdown won't let you fake it: `##` is a real heading or it's nothing. The parts the source can't check, like color contrast, get audited in a real browser on every build, so a violation fails CI the same way a broken link does. The structure a screen reader needs is the same structure a text-to-speech engine, a retrieval index, and an LLM need—as long as the file ships DRM-free enough to reach them."
published: true
---

The ebook edition of [*Open and Async*](https://open-and-async.com/?utm_source=benbalter-accessibility-post) conforms to the Web Content Accessibility Guidelines ([WCAG](https://www.w3.org/TR/WCAG21/)) at 2.1 Level AA, documented in the book's [accessibility statement](https://open-and-async.com/accessibility/). I'd like to tell you that took discipline, but most of it was done before I went looking: I write in Markdown, and [the build pipeline I'd overengineered](/2026/08/17/how-i-over-engineered-my-book/) for unrelated reasons was already running a browser over the output on every push. Here's what actually did the work, and what it missed.

## Markdown won't let you fake structure

Most of accessibility, at least for a book, is structure. Headings that are actually headings, lists that are actually lists, and links that say where they go.

Markdown is inflexible about that, in the best way. `##` is an `<h2>` or it's nothing. There's no font size to reach for, so there's no way to make a line that *looks* like a heading without being one. Alt text sits on the same line as the image it describes, conspicuously empty when it's missing.

[Open a word processor](/2014/03/31/word-versus-markdown-more-than-mere-semantics/) and a heading is a style you're welcome to apply—or you can select the line, bump it to 18pt bold, and move on. Both look identical on the page. Only one of them is a heading when assistive tech comes looking, and nothing in the editor tells you which one you made. :quote[I didn't get real headings through discipline. I got them because my formatting doesn't offer the other option.]{#format-offers-no-option}

And everything downstream inherits those semantics. Pandoc renders the same source into HTML and EPUB, and a Lua filter adds [DPUB-ARIA](https://www.w3.org/TR/dpub-aria-1.0/) roles on the way through. A screen reader knows a callout is a callout, and knows which list of links is the table of contents.[^pipeline]

## Markdown can't check the parts you didn't write

Three weeks out from launch, the book came out to 575 pages. Print books get bound in signatures—big sheets folded down into 16 or 32 pages at a time—so an odd count meant a blank page at the end. Might as well fill it. At midnight I wrote a one-page back-matter spread—a QR code pointing at the book's [quote wall](https://open-and-async.com/q/)—and print landed at a tidy 576. Deploying on a Friday afternoon, in book form. It went about how you'd expect.

In the EPUB, that QR went out as a bare inline `<svg>`—not marked decorative, not given a name, just left for assistive tech to guess about, two files from my own [conformance claims](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html). Every build already ran the rendered book through [axe-core](https://github.com/dequelabs/axe-core), and every EPUB through [EPUBCheck](https://www.w3.org/publishing/epubcheck/) and [Ace by DAISY](https://daisy.org/activities/software/ace/).[^checks][^standards] All three came back green and the book shipped with it. Why they were green is the more useful half of the story.

### Contrast doesn't exist until the render

Start with contrast, the cleanest example of something the source can't check, because the source doesn't contain it. Markdown has no color. The foreground comes from one CSS rule, the background from another—usually a different file, often behind a media query—and the pair only exists once the cascade has run. There's nothing to grep, so the accessibility suite is [Playwright](https://playwright.dev/) driving a real browser over the built HTML, injecting axe-core into the page, and auditing the DOM the browser actually resolved.

That's what makes the contrast rule possible. For every text node, axe reads the computed `color`, walks up the ancestors until it finds a background that isn't transparent, blends in any semi-transparent layers it passes through, converts both ends to relative luminance (perceived brightness, not the RGB values), and checks the ratio against [WCAG 1.4.3](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html): 4.5:1 for body text, 3:1 for large text (18pt, or 14pt bold). :quote[The pairs that fail are the ones nobody designed.]{#pairs-nobody-designed} Inline `<code>` inside a tinted callout. A muted caption on a page background that isn't quite white. Two rules that are each fine alone and only meet in the render.

Then the whole audit runs a second time with `page.emulateMedia({ colorScheme: 'dark' })`, which flips `prefers-color-scheme` and hands axe the same DOM with an entirely different set of computed colors. Same tree, different palette, two verdicts. Both have to come back with no critical or serious violations or `validate-playwright` goes red alongside the build jobs.[^gate]

### What the checks can't see

What none of it can see is markup that never announced what it was. Every axe rule that fires on an unnamed image keys off either an `<img>` element or an explicit role: `image-alt` matches `img`, `svg-img-alt` matches `svg[role="graphics-document"]` and its neighbors. A `<svg>` with no role matches nothing at all, and EPUBCheck has no opinion about accessible names in the first place. :quote[The QR didn't fail a check. There was no check for it to fail.]{#no-check-to-fail} Your checks have the same shape, whatever you're building: they cover the categories somebody thought to name, and generated markup rarely announces itself as a category. Tagging this one decorative was my own postprocessing step's job, and my rule was too specific.[^qr]

## Accessible is a synonym for inclusive

Strip away the acronyms and conformance levels and what's left is a question about who gets to read the thing.

An accessible ebook reflows, so a reader sets their own font, size, spacing, and colors instead of squinting at whatever I happened to pick. I'm one of those readers, after enough years of staring at a screen all day. Its navigation works, so anyone can jump straight to the chapter they came for. It reads cleanly aloud, which matters as much for someone on a commute with the screen off as for someone using a screen reader. I can vouch for that part firsthand: I read the whole book screen off, listening straight through, while prepping the narration—the one audit no checker in my pipeline runs, and the kind that catches what a green build can't. A narrated edition turned out to be a much smaller lift than I'd budgeted for, because the structure that passed axe is the structure a voice follows. More on that soon.

None of that is charity. A book that only works at my font size is making the same mistake as a decision that only happens in a meeting—the format quietly decides who gets to participate, and then everyone calls the result a preference.

Some of it pays off where I'll never see it. The EPUB's metadata declares what the file is and what it conforms to, which is how the book ended up on [Bookshare](https://www.bookshare.org/), the Department of Education-backed library where readers with print disabilities get books free, in DAISY, braille, or large print. I'll never hear from that reader. Getting into that catalog cost nothing beyond accurately describing what I'd already built.

## A screen reader and a language model want the same thing

Every chapter in the book opens with a TL;DR, written in the source as a fenced div: `::: {.tldr}`. The Lua filter turns that into a labeled callout with a DPUB-ARIA role, so assistive tech announces it as a summary rather than reading it as another paragraph of body text.

That same annotation is what a build script reads to assemble the structured layer of the book's [MCP server](https://modelcontextprotocol.io/): 44 chapter TL;DRs, nine key-takeaway blocks, and the full outline, pulled straight out of the manuscript with nobody hand-curating a machine-readable copy of any of it. One piece of markup, two consumers that have nothing else in common.

That overlap isn't limited to my build script. Alt text is the only description a model has of your image. Headings are the boundaries a retrieval system chunks on. Link text is what an index actually reads. :quote[Neither a screen reader nor an LLM can see your 18pt bold. Both of them can read an `<h2>`.]{#neither-can-see-bold} Semantic structure has become the interface for everything that isn't a pair of human eyes. The accessible version of your writing and the machine-readable version turn out to be the same file.

Which is also why the book ships DRM-free everywhere it's sold. DRM encrypts the EPUB so only an approved app can open it, and every tool downstream of that lock is on the wrong side of it—a screen reader the vendor doesn't support, a text-to-speech engine, a braille conversion, an agent the reader points at a book they paid for. :quote[DRM is the one accessibility bug a reader can't file.]{#drm-cant-file} The structure only counts if the file is one they can open with whatever they read with.[^drm]

## Steal this

You don't need my pipeline. Two decisions get you almost everything, and the first one is free.

Write in a format where structure is real. Markdown, if you like it. Your word processor's actual heading styles, if you don't. The goal is that faking structure takes more effort than doing it properly, so the lazy path and the correct path are the same path.

Then run one checker against the built output, on a schedule you can't skip—one command wired into whatever already runs when you export or deploy. It doesn't have to be axe and it doesn't have to be thorough on day one. It has to be automatic, because the answer only helps while you still remember what you were doing.

Do both and accessibility stops being a heroic sprint at the end of the project. The ebook is accessible for the same unremarkable reason its links work: a machine checks, every build, and I can't ship until it's happy.

[^pipeline]: The whole thing is Markdown in Git, rendered by Pandoc into five formats and tested on every push. I wrote up [the full pipeline](/2026/08/17/how-i-over-engineered-my-book/) separately, in more detail than anyone asked for.

[^checks]: axe-core runs under Playwright against the actual built HTML, in light and dark, checking contrast, heading order with no skipped levels, alt text, link text that says where it goes, and a declared `lang` so a screen reader picks the right pronunciation. EPUBCheck covers spec conformance and Ace covers the accessibility metadata and structure that e-readers and library catalogs read.

[^gate]: It's a separate CI job rather than a step inside the build, so the audit runs in parallel with the EPUB, Kindle, and PDF builds instead of adding to the critical path. The whole graph finishes in about five minutes, which is the actual reason the checks survived—a gate slow enough to be annoying is a gate you start skipping.

[^qr]: Fixed in v1.0.1. My decorative-image rule matched `<img class="callout-emoji">`, and the QR was neither an `img` nor a callout, so it walked right past. The EPUB postprocessing step now tags QR SVGs with `aria-hidden="true"`, identifying them by the `shape-rendering="crispEdges"` attribute that's unique to QR renders, so the cover art is left alone. Nothing is lost by hiding it—the URL is printed right underneath as a real link.

[^drm]: It's a checkbox at upload time on every store, and the default in at least one of them is on. Amazon also has a separate publisher-set flag for whether text-to-speech is allowed at all, which is a strange thing to be able to switch off on someone else's behalf.

[^standards]: The book declares WCAG 2.1 Level AA and EPUB Accessibility 1.1 in its [accessibility statement](https://open-and-async.com/accessibility/). Those are the same conformance levels the [European Accessibility Act](https://ec.europa.eu/social/main.jsp?catId=1202) points to for ebooks, in force since June 28, 2025, which is how I ended up reading the conformance-reporting spec closely enough to learn that `a11y:certifierReport` has to be a `<link rel>` rather than a `<meta property>`. EPUBCheck failed my build until I got that one line right. Two things the checks can't fix. The claim covers the ebook—a fixed 6×9 print page doesn't reflow for anybody. And there's still no page list tying the ebook to the paperback's page numbers, so citing the book by page means having the print edition on hand.
