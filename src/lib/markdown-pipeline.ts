/**
 * Shared Markdown Processing Pipeline
 * 
 * This module exports the shared remark and rehype plugin configurations
 * used across the site (astro.config.mjs) and RSS feed (feed.xml.ts).
 * 
 * Keeping the configuration in one place ensures consistency and prevents drift.
 */

import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import remarkTextr from 'remark-textr';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import { remarkGitHubMentions } from './remark-github-mentions';
import { rehypeRelativeUrls } from './rehype-relative-urls';
import { rehypeBootstrapTables } from './rehype-bootstrap-tables';
import { rehypeBoldKeyPhrases } from './rehype-bold-key-phrases';

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

// Shared rehype plugin configurations
export const rehypeExternalLinksConfig = [rehypeExternalLinks, {
  target: '_blank',
  rel: ['noopener', 'noreferrer'],
}];

export const rehypeAutolinkHeadingsConfig = [rehypeAutolinkHeadings, {
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
}];

// Typography plugin configuration for remark-textr
export const remarkTextrConfig = [remarkTextr, {
  options: {
    locale: 'en-us',
  },
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
}];

// Shared remark plugins list
export const sharedRemarkPlugins = [
  remarkGfm,
  remarkEmoji,
  remarkSmartypants,
  remarkGitHubMentions,
  remarkTextrConfig,
];

// Shared rehype plugins list
export const sharedRehypePlugins = [
  rehypeSlug,
  rehypeAutolinkHeadingsConfig,
  rehypeUnwrapImages,
  rehypeAccessibleEmojis,
  rehypeRelativeUrls,
  rehypeBootstrapTables,
  rehypeExternalLinksConfig,
  rehypeBoldKeyPhrases, // Bold key phrases in popular posts
];

// Shared Shiki configuration for syntax highlighting
export const sharedShikiConfig = {
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
  wrap: true,
};
