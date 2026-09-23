/**
 * Table of contents entries, built from the headings Astro's Markdown
 * pipeline already collects (`render(entry).headings`), used by both the
 * inline and sidebar TOC components.
 */

import type { MarkdownHeading } from 'astro';

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

/**
 * Clean a collected heading's text. Astro collects headings after the site's
 * rehype plugins run, so the text includes the `#` glyph rehype-autolink-headings
 * appends to each heading.
 */
export function cleanHeadingText(text: string): string {
  return text.replace(/#$/, '').trim();
}

/**
 * Slug of the visually hidden "Footnotes" h2 that remark-gfm adds above a
 * post's footnotes. It's a real heading, so Astro collects it, but it isn't
 * part of the post's outline.
 */
const FOOTNOTES_SLUG = 'footnote-label';

/** False for the hidden footnotes heading, which isn't part of the post's outline. */
export function isOutlineHeading(heading: MarkdownHeading): boolean {
  return heading.slug !== FOOTNOTES_SLUG;
}

/** h2 and h3 headings as TOC entries, skipping footnotes and empty headings. */
export function tocEntries(headings: readonly MarkdownHeading[]): TocEntry[] {
  return headings
    .filter((h) => (h.depth === 2 || h.depth === 3) && isOutlineHeading(h))
    .map((h) => ({ level: h.depth, id: h.slug, text: cleanHeadingText(h.text) }))
    .filter((h) => h.text);
}

/** Minimum number of headings required to show a TOC. */
export const MIN_HEADINGS_FOR_TOC = 3;
