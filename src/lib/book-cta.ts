/**
 * Shared bits for the Open and Async book CTAs (BookCta.astro and
 * BookLaunchCta.astro) so the title treatment and decorative motif can't drift
 * apart between the everyday promos and the launch panel.
 */

import { siteConfig } from '../config';

/**
 * How a post relates to the book, set by `bookRelation` in post front matter.
 * One list so the schema, the on-site card, and the email card agree:
 * - adapted: a version of the post is in the book
 * - cut: written for the book but didn't make the final cut
 * - inspired: the post sparked a chapter
 * - collected: a roundup whose posts are mostly in the book (a reading list)
 */
export const BOOK_RELATIONS = ['adapted', 'cut', 'inspired', 'collected'] as const;
export type BookRelation = (typeof BOOK_RELATIONS)[number];

/** The shape of /book.json (src/pages/book.json.ts), read by the WebMCP tools. */
export interface BookPost {
  url: string;
  title: string;
  relation: BookRelation;
  note: string;
}

export interface BookInfo {
  title: string;
  author: string;
  description: string;
  published: string;
  price: { ebook: string; paperback: string };
  url: string;
  posts: BookPost[];
}

/**
 * Plain, factual statement of each relation for machine readers (/book.json and
 * the WebMCP tools). The on-page CTA headlines in BookCta.astro are written to
 * sell; these are written to be quoted, so an agent can mention the book
 * without sounding like an ad.
 */
export const BOOK_RELATION_NOTES: Record<BookRelation, string> = {
  adapted: `A version of this post appears in ${siteConfig.author}'s book ${siteConfig.bookTitle}.`,
  cut: `Written for ${siteConfig.author}'s book ${siteConfig.bookTitle}, but cut from the final manuscript.`,
  inspired: `This post inspired a chapter of ${siteConfig.author}'s book ${siteConfig.bookTitle}.`,
  collected: `Most of the posts collected here appear in ${siteConfig.author}'s book ${siteConfig.bookTitle}.`,
};

/**
 * Book title with its conjunction colorized via the site's signature lime→pink
 * gradient. Surrounding spaces are consumed so `mx-1` controls the total gap
 * (natural spaces + margin would read as an uncomfortably wide space in prose).
 *
 * Matches "&" or the word "and" so the treatment survives the title being
 * spelled either way. Only the first conjunction is styled.
 */
export const bookTitleHtml = siteConfig.bookTitle.replace(
  /\s*&\s*|\s+\band\b\s+/i,
  match => {
    const conjunction = match.trim();
    return `<span class="oa-amp mx-1">${conjunction === '&' ? '&amp;' : conjunction}</span>`;
  },
);

/**
 * Commit-graph motif from the marketing site: a straight trunk with curved
 * lime/pink branches, rendered as a faint strip along the bottom of a callout.
 */
export const commitGraphPaths = `
  <path d="M0 30 H 1200" stroke="var(--color-accent-400)" stroke-width="2.5"/>
  <path d="M340 30 C 420 30, 440 12, 520 12 S 680 30, 760 30" stroke="var(--color-pink-400)" stroke-width="2"/>
  <path d="M620 30 C 700 30, 720 48, 800 48 S 940 36, 1000 30" stroke="var(--color-accent-400)" stroke-width="2"/>
  <circle cx="240" cy="30" r="6" fill="var(--color-accent-400)"/>
  <circle cx="520" cy="12" r="5" fill="var(--color-pink-400)"/>
  <circle cx="800" cy="48" r="5" fill="var(--color-accent-400)"/>
  <circle cx="1000" cy="30" r="8" fill="none" stroke="var(--color-accent-400)" stroke-width="2.5"/>
`;
