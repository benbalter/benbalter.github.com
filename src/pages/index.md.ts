/**
 * Homepage Markdown representation for agent content negotiation.
 *
 * Emitted at `/index.md` and served by the Worker (worker/index.js) when a
 * request for `/` carries `Accept: text/markdown`. The homepage has no single
 * Markdown source, so this composes a concise overview — site description,
 * primary pages, and recent posts — rather than converting the rendered HTML.
 */

import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../utils/posts';
import { getPostUrl } from '../utils/post-urls';
import { siteConfig } from '../config';

const PRIMARY_PAGES: Array<{ title: string; path: string }> = [
  { title: 'About', path: '/about/' },
  { title: 'Résumé', path: '/resume/' },
  { title: 'Posts', path: '/posts/' },
  { title: 'Contact', path: '/contact/' },
];

const RECENT_POST_COUNT = 20;

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts({ sorted: true });
  const recent = posts.slice(0, RECENT_POST_COUNT);

  const lines: string[] = [
    `# ${siteConfig.name}`,
    '',
    siteConfig.description,
    '',
    '## Pages',
    '',
    ...PRIMARY_PAGES.map((p) => `- [${p.title}](${siteConfig.url}${p.path})`),
    '',
    '## Recent posts',
    '',
    ...recent.map((post) => `- [${post.data.title}](${siteConfig.url}${getPostUrl(post.id)})`),
    '',
    `See [all posts](${siteConfig.url}/posts/) or the [Atom feed](${siteConfig.url}/feed.xml).`,
    '',
  ];

  const markdown = lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';

  return new Response(markdown, {
    status: 200,
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
