/**
 * Email/RSS framing helpers.
 *
 * Shared by the RSS feed (src/pages/feed.xml.ts) and the Kit email broadcast
 * (script/email-broadcast.mjs) so both frame a post identically: a "new post"
 * lead-in on top and a book callout on the bottom.
 *
 * The on-site <BookCta> relies on Tailwind, SVG, and scoped styles that don't
 * survive email clients, so bookCtaHtml() is a self-contained, inline-styled
 * equivalent. Keep its copy in sync with src/components/BookCta.astro.
 */

import { siteConfig } from '../config';

// Escape a raw ampersand for use inside HTML (this content is delivered as
// HTML, e.g. rendered by Kit into email). Only the book title needs it today.
const bookTitle = siteConfig.bookTitle.replace(/&/g, '&amp;');

/**
 * A short framing line prepended to each post so email subscribers (and RSS
 * readers) immediately know this is a new post on ben.balter.com and can jump
 * to the canonical web version. The raw post body starts mid-thought otherwise
 * — fine in context, disorienting as the first line of an email.
 */
export function leadInHtml(link: string): string {
  return (
    `<p style="margin:0 0 1.75em;font-size:15px;color:#57606a;">` +
    `A new post from <a href="${siteConfig.url}" style="color:#0969da;text-decoration:none;">ben.balter.com</a>` +
    ` &middot; <a href="${link}" style="color:#0969da;text-decoration:none;">Read it on the web &rarr;</a>` +
    `</p>`
  );
}

/**
 * A plain, inline-styled book callout appended to each post. Mirrors the
 * relation-aware headline of the on-site <BookCta>.
 *
 * Now that the book has launched, the label and CTA below sell ("Out now" /
 * "Buy it") rather than capture emails — kept in sync with <BookCta>.
 */
export function bookCtaHtml(relation?: 'adapted' | 'cut' | 'inspired'): string {
  const headline =
    relation === 'adapted'
      ? `This post is adapted from my book, ${bookTitle}.`
      : relation === 'cut'
        ? `There's a whole book's worth more where this came from.`
        : relation === 'inspired'
          ? `This post inspired a chapter in my book, ${bookTitle}.`
          : `Liked this post? It's now a book.`;

  return (
    `<hr style="margin:2.5em 0 1.5em;border:none;border-top:1px solid #d0d7de;" />` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 1em;border-collapse:collapse;">` +
    `<tr><td style="border:1px solid #d0d7de;border-radius:8px;padding:16px 20px;background:#f6f8fa;">` +
    `<p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#57606a;">Out now</p>` +
    `<p style="margin:0 0 6px;font-size:16px;font-weight:600;color:#1f2328;">${headline}</p>` +
    `<p style="margin:0 0 12px;font-size:14px;color:#424a53;">${siteConfig.bookDescription}.</p>` +
    `<a href="${siteConfig.bookUrlEmail}" style="font-size:14px;font-weight:600;color:#0969da;text-decoration:none;">Buy it — ${siteConfig.bookPrice} &rarr;</a>` +
    `</td></tr></table>`
  );
}
