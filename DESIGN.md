---
name: Ben Balter
description: Product, leadership, and showing your work
colors:
  primary: "#337ab7"
  primary-50: "#f0f7fc"
  primary-100: "#e0eef9"
  primary-200: "#b3d4f0"
  primary-300: "#80b9e6"
  primary-400: "#4d9edc"
  primary-600: "#2a6493"
  primary-700: "#204d6f"
  primary-800: "#17364b"
  primary-900: "#0d1f28"
  gray-100: "#f8f9fa"
  gray-200: "#e9ecef"
  gray-300: "#dee2e6"
  gray-400: "#ced4da"
  gray-500: "#adb5bd"
  gray-600: "#6c757d"
  gray-700: "#495057"
  gray-800: "#343a40"
  gray-900: "#212529"
  paper: "#ffffff"
  brand-950: "#102038"
  brand-900: "#1b2a47"
  brand-600: "#2e3e62"
  accent-400: "#d0d820"
  pink-400: "#f070a8"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.875rem, 1.5rem + 1.875vw, 2.441rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 1.25rem + 1.25vw, 1.953rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.75vw, 1.563rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.7
    fontFeature: "\"kern\" 1, \"liga\" 1, \"calt\" 1, \"cv01\" 1, \"cv03\" 1"
  prose:
    fontFamily: "Lora, Georgia, Times New Roman, Times, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "0.005em"
    fontFeature: "\"kern\" 1, \"liga\" 1, \"onum\" 1, \"pnum\" 1"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0.025em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace"
    fontSize: "0.9em"
    fontWeight: 400
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "6px 16px"
  input-email:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.gray-900}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  card-post:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-post-featured:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: "24px"
  navbar:
    backgroundColor: "{colors.gray-100}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  nav-link:
    textColor: "{colors.primary-800}"
    padding: "12px 16px"
    height: "44px"
  nav-link-active:
    textColor: "{colors.gray-900}"
  book-cta:
    backgroundColor: "{colors.brand-950}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    padding: "32px"
  book-cta-button:
    textColor: "{colors.brand-950}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
  tooltip:
    backgroundColor: "{colors.gray-900}"
    textColor: "{colors.gray-100}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
---

<!-- markdownlint-disable-next-line MD025 -- the frontmatter's typography `title:` role reads as a page title to markdownlint -->
# Design System: Ben Balter

<!-- Record of the incumbent system as of 2026-10-09, written before a planned redesign. It describes what ships today; it is not a target. PRODUCT.md holds no visual commitments, so a redesign may replace any of this. -->

## Overview

**Creative North Star: "The Working Notebook"**

The site reads like a colleague's well-kept notes: plain, practical, and arranged for reading rather than for show. There's one blue, a neutral gray scale, a white page, and a serif body face that slows the eye down just enough for long-form argument. Interface chrome (navigation, cards, metadata) switches to a sans-serif so the reader can tell at a glance what's content and what's apparatus.

It's built entirely with Tailwind CSS v4: utilities in components, tokens in the `@theme` block of `src/styles/global.css`, `@tailwindcss/typography` for prose, and a small `@layer components` set for shared patterns. Bootstrap isn't a dependency. Its influence is visual heritage only, because the site started on Bootstrap 3 and kept its values when it moved to Tailwind: the primary blue is Bootstrap 3's link blue, the gray scale is Bootstrap's, and class names like `navbar`, `nav-link`, and `link-secondary` survive from that era. On top of that base, recent work added refinement: fluid type, Lora for prose, tuned link underlines, soft two-layer card shadows, view transitions, and careful dark mode. The result is competent and calm, though not distinctive. Its personality lives in the writing, not the frame.

Density is low. Posts get a single generous column, and index pages use a three-up card grid. Motion is minimal: hover lifts of a pixel or two, fades, and nothing that doesn't respect `prefers-reduced-motion`.

**Key Characteristics:**

- One accent color (primary blue) on a white or near-black page, with Bootstrap-derived grays.
- Serif for reading (Lora), sans-serif for everything else (Inter).
- Flat surfaces with soft, low shadows on cards; depth is a hover response.
- Corners are gently rounded (8px), never sharp and never pill-shaped except for icon chips.
- The *Open and Async* book promos are a deliberately foreign object: navy, lime, and pink inside an otherwise blue-gray site.
- Dark mode follows the system setting only; there's no manual toggle.

## Colors

A single cool blue accent over Bootstrap's neutral grays, with a separate navy-lime-pink palette kept inside the book promos.

### Primary

- **Ledger Blue** (`primary`): The only accent in the site's own UI. Links, nav links, blockquote rules, focus outlines, text selection (30% mix), the subscribe button, card hover borders, and list bullets in prose. In dark mode, links step up to `primary-300` / `primary-400` to keep 4.5:1 contrast.
- **Ledger Blue ramp** (`primary-50` through `primary-900`): Hover and dark-mode variants of the same blue. `primary-800` is the resting nav-link color in light mode; `primary-300` is the dark-mode link color.

### Neutral

- **Paper** (`paper`): Light-mode page and card background.
- **Bootstrap Ink** (`gray-900`): Body text in light mode; page background in dark mode.
- **Graphite** (`gray-800`): Card and navbar surface in dark mode; the lead paragraph's text color in light mode.
- **Slate Gray** (`gray-600`, `gray-700`): Secondary text, metadata, blockquote text, footnotes.
- **Rule Gray** (`gray-200`, `gray-300`): Card borders, horizontal rules, code-block borders.
- **Mist** (`gray-100`): Navbar background in light mode, code backgrounds. `gray-50` is a deliberate alias with the same value (Bootstrap's scale starts at 100); it stays defined so `bg-gray-50` doesn't fall back to Tailwind's default.

### The Open and Async sub-brand

These colors mirror open-and-async.com and appear only in `BookCta` and `BookLaunchCta`. They form a self-contained "book object" and are the same in both color schemes.

- **Midnight Navy** (`brand-950`): The book card's base.
- **Badge Navy** (`brand-900`): The "Out now" badge background.
- **Spine Navy** (`brand-600`): Book card and badge borders.
- **Commit Lime** (`accent-400`): Badge prompt glyph, inline book link, focus outline on book CTAs, and the start of the gradient.
- **Merge Pink** (`pink-400`): The end of the lime-to-pink gradient on the ampersand and the buy button; the inline book link's hover color.

### Named Rules

**The One Blue Rule.** In the site's own UI, primary blue is the only chromatic color. Callout boxes (note, warning, error, success) use Tailwind's stock blue, yellow, red, and green for meaning, not decoration.

**The Book Object Rule.** Navy, lime, and pink belong to the book and stay inside its container. Never use them for general site UI, and never put the site blue inside a book promo.

## Typography

**Display / UI Font:** Inter (self-hosted through Astro's Fonts API at 400, 600, and 700, with system sans fallbacks)
**Prose Font:** Lora (self-hosted at 400, 500, and 700, with Georgia and serif fallbacks)
**Mono Font:** The system monospace stack (`ui-monospace`, SF Mono, Menlo, Consolas)

**Character:** A workmanlike pairing. Inter's tight, neutral headings frame Lora's warmer, bookish body text, so the article reads like a printed essay set inside a clean web interface.

### Hierarchy

- **Display** (Inter 700, fluid 30–39px, line-height 1.15, tracking –0.025em): Page and post titles (`h1`).
- **Headline** (Inter 700, fluid 24–31px, 1.2): Section headings (`h2`), including the homepage "Popular Posts" and "Recent Posts" labels.
- **Title** (Inter 600, fluid 20–25px, 1.3): Subsections (`h3`) and featured post-card titles (which use 20px bold).
- **Body** (Inter 400, fluid 16–18px, 1.7): All non-article text, including cards, about pages, and the résumé.
- **Prose** (Lora 400, 18px under `prose-lg`, 1.8, old-style figures): Post bodies. The first paragraph is bumped to `text-lg` at 1.9 line-height as a lead. Blockquotes are Lora italic.
- **Label** (Inter 600, 14px, uppercase with wide tracking): `h6`, footnote headings, the objection block's label. The book badge uses the mono stack at 0.7rem with the widest tracking instead.

Headings use `text-wrap: balance`, paragraphs use `text-wrap: pretty` with automatic hyphenation, and orphans and widows are set to 3. Tables switch to Inter with tabular figures because they're scanned, not read.

### Named Rules

**The Content Is Serif Rule.** Lora is only for what Ben wrote: post bodies and blockquotes. Anything the reader operates (navigation, cards, captions, footnotes, tables, asides, callouts) is Inter.

**The Code Wraps Clean Rule.** Code never inherits prose letter or word spacing, and never hyphenates.

## Layout

The site is a single centered column inside `.site-container` (max 1140px, 16px side padding). A hero header image (256px tall, 180px on mobile) sits above the navbar on the homepage, and the navbar loses its top corners to join it.

Posts sit in a 40rem column, which sets 18px Lora at roughly 65–75 characters per line. At the `xl` breakpoint (1280px) the wrapper widens to 58rem for a sticky 14rem table-of-contents sidebar; the extra width never goes to longer lines. Index pages use a flex-wrap card grid: one column on mobile, two from `md` (768px), three from `lg` (1024px), with 16px gutters.

Vertical rhythm is set in rems. Homepage sections are separated by 64px (32px on mobile), with a short 48×2px tinted rule under each section heading. Paragraphs get 28px below (24px on mobile), and `h2` gets 2.25em above inside prose.

The only breakpoint with custom CSS is 768px. Below it, code blocks bleed to the screen edges, tables scroll horizontally, and anchor links stay visible at 60% opacity because there's no hover.

Every interactive element is at least 44×44px, enforced by a Playwright test.

## Elevation & Depth

The system is flat at rest, with soft, diffuse shadows that deepen on hover. Depth signals "this card is clickable," never hierarchy. Dark mode uses its own shadow tokens with heavier alpha so they read on near-black.

### Shadow Vocabulary

- **Card** (`--shadow-card`): Resting state for objection blocks and book CTAs.
- **Card hover** (`--shadow-card-hover`): Hover state for those, and the always-on shadow for floating link-preview cards.
- **Card dark / card hover dark** (`--shadow-card-dark`, `--shadow-card-hover-dark`): The same two steps for dark mode.
- **Tailwind `shadow-sm` / `shadow-md` / `shadow-lg`**: Navbar (sm), post-card hover (md), featured post-card hover (lg).

### Named Rules

**The Lift Means Link Rule.** A card only gains shadow or moves (`-translate-y-px` to `-0.5`) when the whole card is one link. Static containers stay flat.

## Shapes

Corners are gently rounded throughout. 8px (`rounded-lg`) is the default for cards, the navbar, the subscribe card, and callouts. 6px (`rounded-md`) is for form controls and small badges. 12px (`rounded-xl`) is reserved for the book CTA, which reads as a separate object. 4px is for inline code, tooltips, and small toggles. Full rounding appears only on circular icon chips (the subscribe icons).

Borders are 1px `gray-200` (`gray-700` in dark mode). Accent borders are reserved for meaning: a 3px primary left rule on blockquotes, a 4px left rule on callouts, and a 2px tinted top border on featured post cards.

## Components

### Buttons

The site has no shared button class. `.btn` survives from Bootstrap only as a marker: it has no styles of its own, and `global.css` uses `main a:not(.btn)` to keep content-link underlines off the bookmarklet drag buttons. Three real buttons exist:

- **Share button:** The end-of-post primary action. Primary blue fill, white 16px semibold Inter, 8px corners, 44px tall, with a share icon. It opens the native share sheet where one exists and becomes "Copy link" (then "Link copied") elsewhere. Beside it, four 44px icon-only network links (LinkedIn, Bluesky, X, Email) tint to 10% blue on hover.
- **Subscribe button:** Primary blue fill, white text, 14px semibold Inter, 6px corners, 6×16px padding. Hover drops to 90% opacity; focus shows a 2px 40%-blue ring with an offset. Disabled is 60% opacity with a spinner.
- **Book buy button:** A lime-to-pink gradient fill with a navy label (white fails contrast on lime), 8px corners, 10×20px padding, and a trailing arrow that nudges 2px right on hover.

### Cards / Containers

- **Post card:** White (dark: `gray-800`), 1px `gray-200` border, 8px corners, 16px padding (24px for the featured variant). The whole card is the link through a stretched pseudo-element. On hover the border turns blue, the title turns blue, and the card lifts 1px with `shadow-md`. Featured cards lift 2px with `shadow-lg` and carry a 2px top border at 20% blue that strengthens to 60%. Titles are Inter; descriptions are clamped to 3 lines (featured) or 2 (default).
- **Subscribe card:** A bordered panel of RSS, email, and social rows, each led by a 36px circular icon chip at 10% blue. On hover the panel gets a 3% blue wash.
- **Objection block:** An aside with a faint diagonal blue gradient, `shadow-card`, a small uppercase blue label, and a bold question heading.
- **Callouts:** A 4px colored left border, an 8px corner, a tinted background, and an Inter title with an icon. They slide in 8px on entry unless reduced motion is set.

### Inputs / Fields

- **Email input:** White, 1px `gray-300` border, 6px corners, 14px text. Focus swaps the border to primary blue and adds a 2px ring at 40% blue.

### Navigation

A Mist (`gray-100` at 95% with backdrop blur) bar with a 1px border, 8px corners, and `shadow-sm`. On the left are the brand name in bold Inter and four links (Posts, About, Resume, Contact). On the right are a search button and, from `lg` up, the tagline set off by a 2px tinted left rule. Links rest at `primary-800`; the active link turns `gray-900` and semibold, and a hidden bold copy reserves its width so the bar doesn't shift. Below 768px the links collapse behind a hamburger toggle with a max-height animation.

### End of post

Posts carry no byline: every post has the same author, and the name is already in the site title and the footer bio. The order is fixed and follows PRODUCT.md's success metrics: the share bar, the book CTA (featured for posts adapted from or inspiring a chapter, inline otherwise), "Keep reading" (one prominent card plus up to three compact list items under a single visible heading, no eyebrow labels), the subscribe card, older/newer links, and a footer with the bio, publish date, revision history, and the open source link.

### Book CTA (signature component)

A navy card (`brand-950`) with a 12px corner, a 1px `brand-600` border, and a faint commit-graph SVG along its bottom edge. It holds the 3D book cover, a mono "> Out now" badge, the title with a lime-to-pink gradient ampersand, and the gradient buy button. The featured variant fades up on load. It's the only place the site shows color beyond blue.

### Inline shareable quote

A highlighted run of prose (14% blue background, rising to 24% on hover) with a small share icon. Arriving through its `#quote-` deep link raises the highlight to 38% with a matching glow, so the reader sees which line was shared.

### Link-preview card

A 320px floating card that appears when hovering an internal post link. It shows the title, a two-line description, and the section name in blue, with `shadow-card-hover`. It fades up 4px over 150ms.

## Do's and Don'ts

### Do

- **Do** keep primary blue as the only accent in site UI (The One Blue Rule).
- **Do** set post bodies in Lora and everything else in Inter (The Content Is Serif Rule).
- **Do** keep every tap target at least 44×44px and every link at 4.5:1 contrast in both color schemes.
- **Do** pair every hover lift or fade with a `prefers-reduced-motion` fallback.
- **Do** define dark-mode values next to their light-mode rules with `@media (prefers-color-scheme: dark)`, the pattern used across `global.css`.
- **Do** use the `--shadow-card` tokens for new cards instead of ad hoc shadows.

### Don't

- **Don't** use navy, lime, or pink outside a book promo (The Book Object Rule).
- **Don't** add shadows or lift to containers that aren't a single link (The Lift Means Link Rule).
- **Don't** add `.btn` expecting Bootstrap styles; it only opts a link out of content-link styling.
- **Don't** treat this file as a target. It records the incumbent system before a redesign, and PRODUCT.md makes no visual commitments.
