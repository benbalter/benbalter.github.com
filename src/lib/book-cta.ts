/**
 * Shared bits for the Open and Async book CTAs (BookCta.astro and
 * BookLaunchCta.astro) so the title treatment and decorative motif can't drift
 * apart between the everyday promos and the launch panel.
 */

import { siteConfig } from '../config';

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
