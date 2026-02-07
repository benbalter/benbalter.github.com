/**
 * Main RSS Feed for Blog Posts
 * 
 * Generates an RSS 2.0 feed at /feed.xml for all blog posts.
 * This matches the Jekyll feed structure and URLs.
 */

import rss from '@astrojs/rss';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { APIContext } from 'astro';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { siteConfig } from '../config';
import { getDateFromSlug, getPostUrl } from '../utils/post-urls';

// Import remark and rehype plugins used in astro.config.mjs
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import remarkSmartypants from 'remark-smartypants';
import remarkTextr from 'remark-textr';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeExternalLinks from 'rehype-external-links';
import { remarkGitHubMentions } from '../lib/remark-github-mentions';
import { rehypeRelativeUrls } from '../lib/rehype-relative-urls';
import { rehypeBootstrapTables } from '../lib/rehype-bootstrap-tables';

// Typography plugins for remark-textr
// @ts-expect-error - No type definitions available
import typographicArrows from 'typographic-arrows';
// @ts-expect-error - No type definitions available
import typographicCopyright from 'typographic-copyright';
// @ts-expect-error - No type definitions available
import typographicEmDashes from 'typographic-em-dashes';
// @ts-expect-error - No type definitions available
import typographicEnDashes from 'typographic-en-dashes';
// @ts-expect-error - No type definitions available
import typographicMathSymbols from 'typographic-math-symbols';
// @ts-expect-error - No type definitions available
import typographicRegisteredTrademark from 'typographic-registered-trademark';
// @ts-expect-error - No type definitions available
import typographicSingleSpaces from 'typographic-single-spaces';
// @ts-expect-error - No type definitions available
import typographicTrademark from 'typographic-trademark';

// Create a markdown processor once at module level to avoid recreating it on each request
// This improves response times by reusing the processor configuration
const markdownProcessor = createMarkdownProcessor({
  remarkPlugins: [
    remarkGfm,
    remarkEmoji,
    remarkSmartypants as any, // Type mismatch with unified plugin types
    remarkGitHubMentions,
    [remarkTextr, {
      options: { locale: 'en-us' },
      plugins: [
        typographicArrows,
        typographicCopyright,
        typographicEmDashes,
        typographicEnDashes,
        typographicMathSymbols,
        typographicRegisteredTrademark,
        typographicSingleSpaces,
        typographicTrademark,
      ],
    }],
  ],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        className: ['anchor-link'],
        ariaLabel: 'Link to this section',
      },
      content: {
        type: 'element',
        tagName: 'span',
        properties: { className: ['anchor-icon'] },
        children: [{ type: 'text', value: '#' }]
      }
    }],
    rehypeUnwrapImages,
    rehypeAccessibleEmojis as any, // Type mismatch with unified plugin types
    rehypeRelativeUrls,
    rehypeBootstrapTables,
    [rehypeExternalLinks, {
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
    }],
  ],
  shikiConfig: {
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    wrap: true,
  },
  smartypants: true,
});

export async function GET(context: APIContext) {
  // Get all published posts, sorted by date (newest first)
  const posts = await getCollection('posts', ({ data }: CollectionEntry<'posts'>) => {
    return data.published !== false;
  });
  
  // Sort posts by filename date (newest first)
  const sortedPosts = posts.sort((a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>) => {
    const dateA = getDateFromSlug(a.slug);
    const dateB = getDateFromSlug(b.slug);
    return dateB.getTime() - dateA.getTime();
  });

  // Await the markdown processor initialization
  const processor = await markdownProcessor;

  // Render all posts to get their HTML content
  const items = await Promise.all(
    sortedPosts.map(async (post: CollectionEntry<'posts'>) => {
      const pubDate = getDateFromSlug(post.slug);
      const postUrl = getPostUrl(post.slug);
      
      // Render the post markdown to HTML
      const result = await processor.render(post.body, {
        frontmatter: post.data,
      });
      const content = result.code;
      
      return {
        title: post.data.title,
        description: post.data.description,
        content,
        link: `${siteConfig.url}${postUrl}`,
        pubDate,
      };
    })
  );

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site || siteConfig.url,
    items,
  });
}
