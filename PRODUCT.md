# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary readers are engineers, engineering managers, and product and technology leaders. Most are mid-career and work at, or care about, large engineering organizations. They usually arrive from a shared link (Slack, a 1:1 doc, social media, a direct message) rather than from search. They want help with a problem they can name: a reorg, getting promoted while remote, running better 1:1s, hiring, open source licensing, or async communication. They come to read one post, judge whether it's worth passing along, and maybe read a second.

Secondary audiences, in order:

- Readers who might buy *Open and Async*, Ben's book on remote and distributed teams.
- Recruiters, hiring managers, and peers checking Ben's background through the résumé, about page, and contact page.

The acronym glossary ([`src/data/acronyms.yml`](src/data/acronyms.yml)) assumes this technical audience: it explains process and role jargon (OKR, DRI, IC) but leaves out web and business basics (API, CEO).

## Product Purpose

ben.balter.com is Ben Balter's personal site and blog. Writing comes first: posts on product, engineering leadership, open source, and showing your work. The book, the newsletter, and the professional profile support the reading and never compete with it.

A visit succeeds when the reader does one of two things:

1. **Shares a post.** Distribution depends on sharing more than on search, so a post should be easy to grasp, quote, and link to.
2. **Clicks through to the book** at [open-and-async.com](https://open-and-async.com/).

Subscribing and reaching out are welcome, but they aren't how this site measures success.

## Positioning

Ben's writing draws on a decade inside GitHub: trust and safety, security, internal platforms, engineering operations, and government outreach. Earlier he was an attorney, a Presidential Innovation Fellow, and part of the White House's first agile development team. Posts take one clear, sometimes contrarian position, back it with first-hand experience or data, and usually end with a playbook the reader can reuse. No other site can claim that combination of lived experience and a lawyer-turned-engineer's eye.

## Operating Context

- Readers usually land on a single post from a shared link, often on a phone, and often with no idea who Ben is.
- Posts are evergreen. Publish dates are hidden at the top of a post on purpose, so a post from years ago still reads as current.
- Posts are also available as Markdown, RSS, email (Kit), AT Protocol (standard.site), and `llms.txt`, so the content has to make sense outside the HTML page.
- The résumé is published as a web page, a PDF, a Word document, Markdown, and a LinkedIn-formatted version, all built from one source.

## Capabilities and Constraints

- An [Astro](https://astro.build) 7 static site with Tailwind CSS v4, hosted on Cloudflare Workers. No JavaScript ships unless a feature needs interactivity.
- Features include related posts, a table of contents, reading progress, search, keyboard shortcuts, share buttons, acronym tooltips, view transitions, dark mode, and a bookmarklets page.
- Content sources:
  - Posts: [`src/content/posts/`](src/content/posts/)
  - Résumé positions: [`src/content/resume-positions/`](src/content/resume-positions/)
  - Bio: [`src/content/about-bio.ts`](src/content/about-bio.ts)
  - LinkedIn bio: [`src/content/linkedin-bio.ts`](src/content/linkedin-bio.ts)
- The site's tagline appears in the navigation and the homepage `<title>`, and is capped at 50 characters.
- Performance and accessibility come before visual flourish. Core Web Vitals currently pass, and CI runs Lighthouse.
- The site is in production, so changes should be conservative and keep existing features working.

## Brand Commitments

- The name is "Ben Balter". The current tagline is "Product, leadership, and showing your work".
- The voice is direct, opinionated, and conversational, with dry humor: a smart colleague over coffee. See [`src/content/CLAUDE.md`](src/content/CLAUDE.md).
- No em dashes in any copy. Use Oxford commas and natural contractions. Write in inclusive language, for a global audience.
- Nothing about the current visual style is binding. Treat it as evidence of what exists, not as a commitment, and a redesign is open.

## Evidence on Hand

- Nearly 200 posts: about 170 current ones, plus about 25 archived posts that stay published behind a warning and are left out of listings. Curated popular picks live in `popularPostSlugs` in [`src/config.ts`](src/config.ts).
- Real credentials and quotes are in [`src/content/about-bio.ts`](src/content/about-bio.ts), including the US CTO quote and the public figures already published there.
- The *Open and Async* book, with its own site and brand assets kept in a separate repo. On this site it appears through `BookCta` and `BookLaunchCta`.
- Images:
  - Headshot: [`public/assets/img/headshot.jpg`](public/assets/img/headshot.jpg)
  - Header image: [`public/assets/img/header.*`](public/assets/img/)
  - Charts from posts about the book's build process
- There are no testimonials, reader reviews, or published traffic figures, and future work must not invent any. Analytics stay private and never appear in copy or commits.

## Product Principles

1. **Reading wins.** If a feature, call to action, or decoration gets between a reader and the post, the post comes first.
2. **Built to be shared.** Every post should be easy to skim, quote, and link to, and should look right when it's shared or read somewhere else.
3. **Promote the book without interrupting the reading.** *Open and Async* is the main conversion goal, so place it where a reader who's finished a post will see it: right after the share action at the end of a post. Never inside the post body. A mid-post callout was tried and removed for breaking the reading.
4. **Show your work.** The site practices what it argues for: open source, transparent, and fast.
5. **Evergreen over timely.** Content and its presentation should still read as relevant years from now.

## Accessibility & Inclusion

- Meet WCAG 2.1 AA. Playwright runs axe-core checks and enforces 44×44px minimum touch targets.
- Respect `prefers-reduced-motion`. View transitions are already tested for it.
- HTML must validate, every image needs alt text, and every link must work.
- Write for a global, neurodiverse audience: no cultural idioms, and no ambiguous date formats.
