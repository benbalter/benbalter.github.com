/**
 * Table of contents heading extraction utility.
 *
 * Parses rendered HTML to extract h2/h3 headings with their IDs,
 * used by both the inline and sidebar TOC components.
 */

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract h2 and h3 headings with their IDs from rendered HTML.
 * Strips nested HTML tags (e.g. anchor links from rehype-autolink-headings)
 * and trailing `#` characters.
 */
export function extractHeadings(html: string): TocEntry[] {
  const headingRegex = /<h([23])\s+id="([^"]+)"[^>]*>(.*?)<\/h[23]>/gi;
  const headings: TocEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(html)) !== null) {
    const text = match[3].replace(/<[^>]+>/g, '').replace(/#$/, '').trim();
    if (text) {
      headings.push({
        level: parseInt(match[1]),
        id: match[2],
        text,
      });
    }
  }

  return headings;
}

/** Minimum number of headings required to show a TOC. */
export const MIN_HEADINGS_FOR_TOC = 3;
