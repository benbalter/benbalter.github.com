/**
 * Shared utility functions for redirect generation
 */

/**
 * Expected filename format for blog posts: YYYY-MM-DD-slug.md or YYYY-MM-DD-slug.mdx
 * Example: 2023-12-08-my-post-title.md
 */
const POST_FILENAME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.mdx?$/;

/**
 * Extract date components and slug from post filename
 * @param filename - Post filename (e.g., "2023-12-08-my-post.md")
 * @returns Object with year, month, day, and slug, or null if invalid format
 */
export function parsePostFilename(filename: string): {
  year: string;
  month: string;
  day: string;
  slug: string;
} | null {
  const match = filename.match(POST_FILENAME_PATTERN);
  if (!match) return null;

  const [, year, month, day, slug] = match;
  return { year, month, day, slug };
}

/**
 * Generate post URL from date components and slug
 * @param year - Year (YYYY)
 * @param month - Month (MM)
 * @param day - Day (DD)
 * @param slug - Post slug
 * @returns Post URL with trailing slash (e.g., "/2023/12/08/my-post/")
 */
export function generatePostUrl(
  year: string,
  month: string,
  day: string,
  slug: string
): string {
  return `/${year}/${month}/${day}/${slug}/`;
}

/**
 * Extract date and slug from filename and generate URL
 * @param filename - Post filename (e.g., "2023-12-08-my-post.md")
 * @returns Post URL or null if filename format is invalid
 */
export function filenameToUrl(filename: string): string | null {
  const parsed = parsePostFilename(filename);
  if (!parsed) return null;

  return generatePostUrl(parsed.year, parsed.month, parsed.day, parsed.slug);
}
