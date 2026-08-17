/**
 * Per-post Markdown representation for agent content negotiation.
 *
 * Emits a `.md` sibling next to each post's HTML page (e.g.
 * `/2020/01/01/slug.md` alongside `/2020/01/01/slug/`). The Worker
 * (worker/index.js) serves this file when a request for the post carries
 * `Accept: text/markdown`, falling back to HTML otherwise.
 *
 * Post bodies are already authored in Markdown, so the highest-fidelity
 * representation is the source itself — we only prepend the title as an H1 and
 * a canonical link. MDX-only syntax (ESM imports/exports and JSX component
 * tags) is stripped via stripMdxSyntax so it doesn't leak into the plain-text
 * representation agents consume.
 */

import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublished } from '../../../../utils/post-filtering';
import { siteConfig } from '../../../../config';
import { stripMdxSyntax } from '../../../../utils/strip-mdx-syntax';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts', isPublished);

  return posts
    .map((post: CollectionEntry<'posts'>) => {
      const dateMatch = post.id.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
      if (!dateMatch) return null;
      const [, year, month, day, slug] = dateMatch;
      return { params: { year, month, day, slug }, props: { post } };
    })
    .filter(Boolean);
};

interface Props {
  post: CollectionEntry<'posts'>;
}

export const GET: APIRoute = ({ props, params }) => {
  const { post } = props as Props;
  const { year, month, day, slug } = params;
  const canonical = `${siteConfig.url}/${year}/${month}/${day}/${slug}/`;

  const parts: string[] = [`# ${post.data.title}`, ''];
  if (post.data.description) {
    parts.push(`*${post.data.description}*`, '');
  }
  parts.push(`[View on ${siteConfig.name}'s site](${canonical})`, '', '---', '');
  parts.push(stripMdxSyntax(post.body ?? '').trim(), '');

  const markdown = parts.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';

  return new Response(markdown, {
    status: 200,
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
