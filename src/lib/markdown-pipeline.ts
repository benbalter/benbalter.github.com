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
import remarkDirective from 'remark-directive';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import { remarkGitHubMentions } from './remark-github-mentions';
import { remarkCalloutDirectives } from './remark-callout-directives';
import { rehypeRelativeUrls } from './rehype-relative-urls';
import { rehypeBootstrapTables } from './rehype-bootstrap-tables';
import { rehypeImageLoading } from './rehype-image-loading';
import { rehypeFigure } from './rehype-figure';
import { rehypeFootnoteA11y } from './rehype-footnote-a11y';

// Typography plugins for remark-textr
import typographicArrows from 'typographic-arrows';
import typographicCopyright from 'typographic-copyright';
import typographicEmDashes from 'typographic-em-dashes';
import typographicEnDashes from 'typographic-en-dashes';
import typographicMathSymbols from 'typographic-math-symbols';
import typographicRegisteredTrademark from 'typographic-registered-trademark';
import typographicSingleSpaces from 'typographic-single-spaces';
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
  // Directive syntax (:::note, :::warning, etc.) and callout transformer
  remarkDirective,
  remarkCalloutDirectives,
  remarkTextrConfig,
];

// Shared rehype plugins list
export const sharedRehypePlugins = [
  rehypeSlug,
  rehypeAutolinkHeadingsConfig,
  rehypeAccessibleEmojis,
  rehypeRelativeUrls,
  rehypeRaw,
  rehypeBootstrapTables,
  rehypeFigure,
  rehypeFootnoteA11y,
  rehypeImageLoading,
  rehypeExternalLinksConfig,
];

// Shared Shiki configuration for syntax highlighting
export const sharedShikiConfig = {
  themes: {
    light: 'github-light',
    dark: 'github-dark',
  },
  wrap: true,
};
