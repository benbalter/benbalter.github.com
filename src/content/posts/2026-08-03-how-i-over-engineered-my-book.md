---
title: How I over-engineered my book
description: "My book has a build that can refuse to ship it: seven blocking prose linters, a CSS transpiler targeting a platform with no DevTools, and a Python script that fixes a bug you can't fix in CSS. What building a book like software actually taught me."
tldr: "An ebook is a zip archive of HTML and CSS, which makes a book a build target rather than a document. So I built mine like software—Markdown in git, five output formats, prose linters that block CI—and the tooling turned out to cost about one commit in five."
---

Most books get written in Word or Google Docs and exported to PDF at the very end, as an afterthought. That felt wrong, but my first swing at something better involved learning LaTeX, which I *would not* recommend to anyone who values their weekends.

## An ebook is a website in a trench coat

Then it clicked. An EPUB—the format behind every non-Amazon ebook—is a zip archive full of XHTML and CSS. Kindle is the same deal: you hand Amazon an EPUB and it converts that into its own format. A print-ready PDF is a stylesheet with different page dimensions.

I've been building websites most of my life. :quote[The book wasn't a document problem. It was a build target.]{#not-a-document-problem}

So I built it like software. Markdown in git, one source of truth, everything else generated. Which also meant the book could practice what it preached: [it argues](/2026/07/21/open-and-async/) that version control, code review, CI, and automated testing belong in knowledge work, not just in code. If I believed that, the book should be the proof.

## The stack

Seventy-five Markdown files. [Pandoc](https://pandoc.org/) converts them to HTML, EPUB, and PDF. [WeasyPrint](https://weasyprint.org/) handles print layout, driven entirely by CSS. Tailwind v4 does the styling. A [`justfile`](https://github.com/casey/just) ties 49 recipes together (apparently the cool kids don't use `make` anymore), and a Dockerfile pins every binary so the build doesn't drift.

Five things come out the other end: a web preview, an EPUB, a Kindle-specific EPUB, a 6"×9" paperback PDF, and that same PDF converted to PDF/X-1a—an ancient, strictly color-managed flavor of PDF that IngramSpark, the vendor that gets books into stores and libraries, refuses to live without. Amazon's press takes the normal one.

## I accidentally wrote a CSS transpiler

The stylesheet is 3,707 lines of thoroughly modern CSS. Custom properties, `@layer`, nesting, `oklch()` colors, `rem` everywhere. Clean, expressive, and completely unreadable to an e-reader.

So `strip-page-rules.js`—1,183 lines—takes the compiled CSS and downgrades it until a device from 2015 can parse it. Here's one callout box before:

```css
@layer components {
  .tldr {
    font-family: var(--font-body);
    margin-top: 0.25rem;
    padding: 0.875rem 1.25rem;
    background-color: var(--color-summary-bg);
    border-radius: var(--radius-callout);
  }
  .tldr::before { content: "TL;DR: "; }
}
```

And after:

```css
.tldr{font-family:"Source Serif 4",serif;margin-top:.25em;padding:.875em 1.25em;
background-color:#f8f9fa;border-radius:.375em}
```

The `@layer` is gone. Every variable is resolved. Every `rem` is an `em`. And the `::before` has vanished entirely, because pseudo-element support on Kindle is a coin flip—so that "TL;DR:" label gets written into the document itself by a filter that rewrites Pandoc's parsed document tree before it becomes a file. Multiply that by a few thousand rules and you get a CSS-to-CSS compiler I did not set out to write.

**There are no DevTools.** No error console. No spec to check, because the vendors don't publish one. You learn your CSS is wrong when a file renders badly on a device sitting on a stranger's nightstand, three weeks after you shipped.

So the tests aren't there for tidiness. They're the only instrument I have. One suite asserts every transformation—`oklch()` became hex, nesting got flattened, `@layer` is gone. Another scans the output for anything forbidden that slipped through. A third checks that none of it accidentally reordered the cascade, because a selector that quietly stops winning means a heading silently renders at the wrong size, and nobody tells you. When you can't observe production, :quote[your test suite stops being quality assurance and becomes your only way of seeing.]{#your-only-way-of-seeing}

There are 2,396 of them, across 65 files, which is less impressive than it sounds. A lot are cheap, generated assertions—one per emoji, one per chapter, one per forbidden CSS function. Breadth over cleverness, because breadth is what catches a platform that won't tell you anything.

## The dark box

My favorite bug is one you can't fix in CSS.

The book uses emoji in its callout labels—💡 for pro tips, 👔 for the manager asides. Kindle e-ink devices don't ship an emoji font, so those render as nothing, or as tofu: the empty rectangle a font puts up when it has no glyph for a character. Fine. A filter walks the document tree and handles them in tiers. Ones with plain Unicode equivalents get swapped (✅ becomes ✓). Ones that carry meaning get replaced with [Twemoji](https://github.com/jdecked/twemoji) PNGs. The rest get dropped.

Then the images shipped with a dark rectangle around them.

Twemoji's PNGs are transparent, but the RGB values *underneath* the transparent pixels are dark slate. Invisible if you honor the alpha channel. Very visible if you don't. Some Kindle renderers don't—they flatten the alpha, and you get a charcoal box around every emoji.

My first fix was to bake the callout's background color into each PNG and delete the alpha channel outright. Worked beautifully on a light-mode Paperwhite. Looked terrible on Kindle for iOS, which honors transparency and doesn't paint the callout tint behind the image, so every emoji got a colored rectangle instead of a dark one. I'd traded one box for another.

What shipped keeps the alpha intact but rewrites the RGB of every fully-transparent pixel to white. Renderers that honor alpha get real transparency and clean edges. Renderers that flatten it get white, which disappears on a white page. A Python script does this to every emoji at build time.

It's the most ordinary bug in the world. Mine just happened to be in a book.

## Linting my own prose

The book claims clear writing is a professional skill. Felt hypocritical not to hold the manuscript to the standard I'd hold code to.

So the manuscript goes through seven prose linters, all of them in CI, all of them blocking: [textlint](https://textlint.github.io/), [Harper](https://github.com/Automattic/harper), [LanguageTool](https://languagetool.org/), [proselint](https://github.com/amperser/proselint), [Vale](https://vale.sh/), and GNU `diction` and `style`. Plus a 521-word custom dictionary so the spell checker stops flagging "async."

On top of those, six rules I wrote myself. One kills vague intensifiers (`very unique`, `highly effective`). One flags Americanisms like `hit it out of the park`, which land badly for a global audience and translate even worse. One catches sentences that tell readers what they're already thinking—`you're probably wondering`, `we all know that`—which is a writer assuming agreement instead of earning it. One enforces small-caps markup on every acronym, a level of typographic pedantry I've made peace with. One catches clichés, and yes, it runs against the manuscript, not this post, which is the only reason the preceding paragraphs haven't burst into flames.

The last one, `no-ai-like-patterns`, flags formulaic LLM phrasing: `It's important to note that`, `Let's dive into`, a paragraph opening with `Furthermore`. It has 76 tests of its own, a sentence I'd like the record to show I'm aware of.

It also caught me. It flagged a paragraph I was *certain* I'd written myself—and I had. But reading it back cold, it did sound ghost-authored. I'd absorbed the cadence from reading too much generated text and produced a fluent imitation of nothing.

That's the case for linting prose, and it has nothing to do with typos. A linter can't tell good writing from bad. What it can spot are the patterns you reach for when you've stopped thinking, which is precisely the thing you can't see in your own draft. Same reason `eslint` earns its keep.

## The book ships an API

This one solved no problem. I built it because I wanted to.

The book's method is a set of reusable moves—how to run a meeting as an escalation rather than a default, how to write a status update that reports impact instead of activity, how to answer the objection that [async is too slow](/2022/03/17/why-async/). A build step extracts them into a dataset, and a [Model Context Protocol](https://modelcontextprotocol.io/) server hands them to an AI agent as callable tools. Ask it to handle a piece of pushback and it returns the reframe, plus where in the book it came from:

```json
{
  "trigger": "We tried remote work during the pandemic and it was a disaster.",
  "reframe": "What failed wasn't remote work — it was a meeting-heavy office
    routine bolted onto video calls during a crisis, with nothing written down
    and managers checking who was online.",
  "chapter": "defining-open-async-and-remotefirst-work"
}
```

The method ships separately from the manuscript, so you can ask a model how to convert a meeting to async without handing it 105,000 words of prose.

Meanwhile, buried in the copyright page of every edition:

> The author reserves all rights to text and data mining and to training AI or machine-learning systems on this work (EU Digital Single Market Directive, Art. 4(3) reservation).

There's a test that fails the build if that sentence ever quietly disappears from any format. A book with a chapter on using AI as a thought partner, defending itself against becoming training data, enforced in CI.

## The part where it touches paper

There's a check that fails the build if the print PDF isn't 576 pages. Page count determines the width of the spine, the spine is printed on the physical cover, and a cover sized for the wrong spine is a garbage box full of paperbacks.

That check exists because the page count is load-bearing and *not* under my control. It turned out to shift with the Pandoc version, which is now pinned in CI for exactly that reason. The rest of the publishing machinery—two vendors wanting two PDF flavors, an ISBN per format, subject codes so the file lands on the right catalog shelf—is dull, but it's all code, which means it's all tested.

## Was it worth it?

Yes, and not in the "worth it if you enjoy suffering" sense.

The honest accounting first. Of 4,944 commits, 1,065 touched the toolchain at all—about one in five. The infrastructure wasn't a two-year detour from writing the book; the other four commits in five were the book. That ratio is the argument, and if it were inverted I'd be writing a different post.

I learned more here than on anything I've shipped in years. Building for an undocumented, un-inspectable runtime forced a discipline about testing I'd never really needed on the web, where you can always just open DevTools. And writing a CSS-to-CSS compiler taught me more about the cascade than a decade of writing CSS did.

The habits came with me. [My résumé](https://ben.balter.com/resume.pdf) works the same way now—Markdown source, CSS for the print layout, and CI renders the PDF on every push—so updating it is a commit instead of a fight with a word processor. The style guide behind those custom lint rules got pulled out into [a standalone Gist](https://gist.github.com/benbalter/139f9e57e2ed389a4579121833f31644) I can drop into any project, or hand to an AI assistant, and get something that sounds like me back.

Then I pointed the whole apparatus at this blog's archive. A post from April 2011 had been saying "Its got a set of slick attachment functions" for fifteen years. Another spent that same decade and a half offering enterprise-grade security for your "propriety or sensitive information." Thousands of people read those. Nobody ever mentioned it. :quote[You don't find out. You have to go looking.]{#you-have-to-go-looking}

This post tripped the blog's linter twice on its way out the door, incidentally. Both times for quoting the banned phrases as examples.

And the book is better for it. I can `git bisect` a rendering regression down to the commit that caused it. Fixing a typo is a commit, not a re-export, and it propagates to all five formats at once—which is the difference between fixing it and deciding it isn't worth fixing. Every one of those checks is enforced by something that doesn't get tired at 11 p.m. and decide it's probably fine.

I could have written this in Google Docs and shipped sooner. It would have been a worse book, and I'd have learned nothing.

Accessibility turned out to be big enough that it's getting its own post.
