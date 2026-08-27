/**
 * About — Markdown (.md) representation for agent content negotiation.
 *
 * Emitted at `/about.md` and served by the Worker (worker/index.js) when a
 * request for `/about/` carries `Accept: text/markdown`. Composes the same
 * material shown on /about (src/pages/about.astro) — bio, at-a-glance facts,
 * popular writing, and contact links — from the shared sources so the .md
 * never drifts from the HTML page.
 *
 * `output: 'static'` means this runs at build time and Astro writes the
 * Response body to dist-astro/about.md. The bio bodies are already Markdown,
 * so we stitch them under generated headings.
 */

import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { siteConfig, popularPostSlugs, contactLinks } from '../config';
import { aboutContent } from '../content/about-bio';
import { getPostUrl, getDateFromSlug, formatPostDate } from '../utils/post-urls';
import { isListablePost } from '../utils/post-filtering';

export const GET: APIRoute = async () => {
  // Bio paragraphs are already valid Markdown (links intact) — keep them as-is.
  const bioParagraphs = aboutContent
    .split('\n\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Popular posts, resolved from slugs (same list the HTML page renders).
  const allPosts = await getCollection('posts', isListablePost);
  const popularPosts = popularPostSlugs
    .map((slug) => allPosts.find((post: CollectionEntry<'posts'>) => post.id === slug))
    .filter((p): p is CollectionEntry<'posts'> => p !== undefined);

  const lines: string[] = [];

  lines.push('# About Ben Balter');
  lines.push('');
  for (const para of bioParagraphs) {
    lines.push(para);
    lines.push('');
  }

  // --- At a glance ---------------------------------------------------------
  lines.push('## At a glance');
  lines.push('');
  lines.push(`- **Previously:** ${siteConfig.formerJobTitle}, ${siteConfig.formerEmployer}`);
  lines.push('- **Location:** Washington, DC');
  lines.push('- **Education:** JD & MBA, George Washington University');
  lines.push(`- **Résumé:** [Full resume](${siteConfig.url}/resume/)`);
  lines.push('');

  // --- Popular writing -----------------------------------------------------
  if (popularPosts.length > 0) {
    lines.push('## Popular writing');
    lines.push('');
    lines.push('Most-read posts from the blog.');
    lines.push('');
    for (const post of popularPosts) {
      const date = formatPostDate(getDateFromSlug(post.id));
      lines.push(`- [${post.data.title}](${siteConfig.url}${getPostUrl(post.id)}) (${date})`);
    }
    lines.push('');
    lines.push(`See [all posts](${siteConfig.url}/posts/).`);
    lines.push('');
  }

  // --- Get in touch --------------------------------------------------------
  lines.push('## Get in touch');
  lines.push('');
  lines.push(
    `Email me at [${siteConfig.email}](mailto:${siteConfig.email}) or find me on these networks:`
  );
  lines.push('');
  for (const link of contactLinks) {
    const url = link.url.startsWith('/') ? `${siteConfig.url}${link.url}` : link.url;
    lines.push(`- [${link.name}](${url})`);
  }
  lines.push('');

  const markdown = lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';

  return new Response(markdown, {
    status: 200,
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
