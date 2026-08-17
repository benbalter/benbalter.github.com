---
title: I made my book accessible by writing it like software
description: "Most ebooks fail basic accessibility checks. Mine doesn't—not because I ran a last-minute audit, but because a failing accessibility test breaks the build the same way a failing unit test does."
tldr: "Accessibility doesn't have to be a final-week audit. Write the book in semantic Markdown and gate every build on axe-core, EPUBCheck, and Ace by DAISY, and an accessible book falls out by default—for the same unremarkable reason the links work and the page count is right."
published: false
---

The day before a lot of books go to print, someone runs an accessibility checker for the first time, watches it light up red, and quietly decides "AA-ish" is close enough. The check is a gate bolted onto the end of a process that never once thought about it.

I [built *Open and Async* like software](/2026/08/17/how-i-over-engineered-my-book/)—Markdown in git, rendered by a pipeline, tested on every build. Accessibility wasn't a pass I bolted on at the end. It was a check that had to stay green the whole way through, the same status as "do the cross-references resolve" and "does the book still fit its 6×9 page count." A build that fails it isn't a book I can ship, so I catch problems while the work is still fresh, not in a panic the week before launch.

## Markdown does most of the work for you

Here's the part nobody tells you: a huge share of accessibility is just *not throwing away structure you already have.*

Write in Markdown and a heading is a heading, a list is a list, a link carries its own text. You can't fake a heading by making a line big and bold—`##` is a real `<h2>` or it's nothing. That constraint, which chafes when you want a pixel in a particular place, is exactly what a screen reader needs: a real outline it can jump through, a table of contents that means something, and no wall of text that only *looks* organized.

Compare the usual path—drafting in a word processor or a design tool, where "heading" is a font size and "list" is a few lines that happen to start with a dash. It looks fine. It reads fine, if you can see it. Hand it to assistive technology and the structure isn't there, because it was never real in the first place. You styled the appearance of structure and skipped the thing itself.

My source is semantic from the first keystroke. Pandoc turns that Markdown into HTML and EPUB that inherit the structure for free: real headings, real lists, real landmarks. A Lua filter adds DPUB-ARIA roles so a screen reader knows a callout is a callout and the table of contents is the table of contents. Alt text lives right next to the image it describes, in the same file I'm already editing, so there's no separate "add the alt text" task to forget. :quote[Accessibility mostly falls out of writing in plain text.]{#falls-out-of-plain-text} I'm not fighting the format. I'm letting it do its job.

## The tests run before anything ships

Structure gets you most of the way. Automation keeps you honest about the rest.

Every build runs the rendered book through [axe-core](https://github.com/dequelabs/axe-core)—the engine behind much of the web's accessibility tooling—driven by Playwright against the actual HTML output, not a hopeful approximation of it. Contrast, in both light and dark themes. Heading order, with no skipped levels. Landmarks, names, roles. Link text that says where it goes, so not a single bare "click here" survives. A declared language, so a screen reader reaches for the right pronunciation. The EPUB gets two more gates on top: [EPUBCheck](https://www.w3.org/publishing/epubcheck/) for spec conformance and [Ace by DAISY](https://daisy.org/activities/software/ace/) for the accessibility metadata and structure that e-readers and library systems actually look for.

These tools have existed for years; what matters is *when* they run. Wired into the build, the same commit that fails an accessibility check can't produce a shippable file—a skipped heading level fails the build exactly like a broken link does. I get a verdict in a couple of minutes locally, and for real on every release, so a regression surfaces while the change is still fresh in my head, not in a triage spreadsheet two days before the deadline as I try to reverse-engineer which of the book's 576 pages a tool is unhappy about.

It's the oldest lesson in software, pointed at a book: the cost of a defect climbs the longer it lives. Catch it at the keystroke and it's a typo. Catch it at launch and it's a project.

## The standards, and why they're not optional anymore

The book targets [WCAG](https://www.w3.org/TR/WCAG21/) 2.1 Level AA and EPUB Accessibility 1.1 — the conformance levels it [declares in its accessibility statement](https://open-and-async.com/accessibility/). Those aren't vanity badges. They're the standards the [European Accessibility Act](https://ec.europa.eu/social/main.jsp?catId=1202) points to for ebooks—in force since June 2025, with the practical effect that an inaccessible book is increasingly one EU retailers won't list. "Accessible edition" stopped being a nice-to-have and started being a market you're either in or you're not.

But the regulation is the floor, not the reason. An accessible book is a *better* book, full stop. The text reflows, so a reader sets their own font, size, spacing, and color instead of squinting at whatever I happened to pick. The navigation works, so anyone can jump straight to the chapter they need. It reads cleanly aloud, which matters as much for the commuter with the screen off as for the reader using a screen reader. Build it so it works for the person with the highest bar, and it works better for everyone underneath.

## You don't need my pipeline—you need the order of operations

The specific tools are incidental. Markdown, Pandoc, axe, Playwright, GitHub Actions—swap any of them for your favorite and the lesson holds. What actually matters is two decisions, both made at the start:

1. **Write in something with real structure**, so semantics are the default and faking them takes effort, instead of the other way around.
2. **Make accessibility a test that runs on every change**, so it's a continuous constraint you live inside—not a gate you slam into at the end.

Do that and "accessible" stops being a heroic final sprint and becomes the ambient state of the project. The book is accessible for the same unremarkable reason the links work and the page count is right: a machine checks, every time, and I can't ship until it's happy.

:quote[The most accessible thing I did for my readers, it turns out, was refuse to wait until the end to think about them.]{#refuse-to-wait}
