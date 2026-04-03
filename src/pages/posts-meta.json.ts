/**
 * Static JSON endpoint mapping post URLs to metadata for link previews.
 * Generated at build time — no runtime cost.
 */

import { getCollection } from 'astro:content';
import { getPostUrl } from '../utils/post-urls';
import GithubSlugger from 'github-slugger';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface PostMeta {
  title: string;
  description: string;
  headings: Heading[];
}

/** Strip inline markdown formatting from heading text */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')       // bold
    .replace(/__(.+?)__/g, '$1')            // bold alt
    .replace(/\*(.+?)\*/g, '$1')            // italic
    .replace(/_(.+?)_/g, '$1')              // italic alt
    .replace(/~~(.+?)~~/g, '$1')            // strikethrough
    .replace(/`(.+?)`/g, '$1')              // inline code
    .replace(/\[(.+?)\]\([^)]+\)/g, '$1')   // links
    .trim();
}

/** Extract headings from raw markdown body */
function extractHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  const regex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = regex.exec(body)) !== null) {
    const depth = match[1].length;
    const text = stripMarkdown(match[2]);
    headings.push({ depth, slug: slugger.slug(text), text });
  }

  return headings;
}

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => data.published !== false);
  const meta: Record<string, PostMeta> = {};

  for (const post of posts) {
    const url = getPostUrl(post.id);
    meta[url] = {
      title: post.data.title,
      description: post.data.description,
      headings: extractHeadings(post.body ?? ''),
    };
  }

  return new Response(JSON.stringify(meta), {
    headers: { 'Content-Type': 'application/json' },
  });
}
