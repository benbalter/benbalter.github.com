/**
 * Static JSON endpoint mapping post URLs to metadata for link previews.
 * Generated at build time — no runtime cost.
 *
 * Headings come from Astro's own collector (`render(post).headings`), the same
 * slugs rehype-slug put on the page, rather than a regex over the Markdown
 * body, which also matched `#` lines inside code fences.
 */

import { render } from 'astro:content';
import type { MarkdownHeading } from 'astro';
import { getPostUrl } from '../utils/post-urls';
import { getPublishedPosts } from '../utils/posts';
import { cleanHeadingText, isOutlineHeading } from '../utils/toc';

export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface PostMeta {
  title: string;
  description: string;
  headings: Heading[];
}

/** Collected headings in the link-preview shape, minus footnotes and the anchor glyph. */
export function toPreviewHeadings(headings: readonly MarkdownHeading[]): Heading[] {
  return headings
    .filter(isOutlineHeading)
    .map(({ depth, slug, text }) => ({ depth, slug, text: cleanHeadingText(text) }));
}

export async function GET() {
  const posts = await getPublishedPosts();
  const meta: Record<string, PostMeta> = {};

  for (const post of posts) {
    const { headings } = await render(post);
    meta[getPostUrl(post.id)] = {
      title: post.data.title,
      description: post.data.description,
      headings: toPreviewHeadings(headings),
    };
  }

  return new Response(JSON.stringify(meta), {
    headers: { 'Content-Type': 'application/json' },
  });
}
