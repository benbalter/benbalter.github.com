/**
 * Rehype plugin: mid-post book callout
 *
 * Posts adapted from the book, or that inspired a chapter (`bookRelation:
 * adapted | inspired`), get a one-line callout about a third of the way in.
 * The end-of-post BookCta only reaches readers who finish the post. Clicks
 * from the callout land on the book site tagged utm_source=benbalter-inline,
 * so it's measured separately.
 *
 * Reads frontmatter from Astro's file.data, so it's a no-op off-site (the RSS
 * and email pipelines don't pass frontmatter, and the feed already appends its
 * own CTA). Skipped for `cut` posts (not in the book), for hideBookCta, and for
 * posts too short to have a "middle".
 */

import type { Root, Element, ElementContent } from 'hast';
import type { VFile } from 'vfile';
import { siteConfig } from '../config';

const MIN_BLOCKS = 6;

const HEADLINES: Record<string, string> = {
  adapted: 'A version of this post is a chapter in my book,',
  inspired: 'This post inspired a chapter in my book,',
};

function callout(relation: string): Element {
  return {
    type: 'element',
    tagName: 'aside',
    properties: { className: ['callout', 'callout-tip', 'book-inline-cta'], role: 'note', ariaLabel: 'About the book' },
    children: [
      {
        type: 'element',
        tagName: 'p',
        properties: {},
        children: [
          { type: 'text', value: `${HEADLINES[relation]} ` },
          {
            type: 'element',
            tagName: 'a',
            properties: { href: siteConfig.bookUrlInline, dataTrackBookCta: '' },
            children: [
              { type: 'element', tagName: 'em', properties: {}, children: [{ type: 'text', value: 'Open & Async' }] },
            ],
          },
          { type: 'text', value: '.' },
        ],
      },
    ],
  };
}

export function rehypeBookInlineCta() {
  return (tree: Root, file: VFile) => {
    const fm = (file.data as { astro?: { frontmatter?: Record<string, unknown> } }).astro?.frontmatter;
    const relation = fm?.bookRelation;
    if (typeof relation !== 'string' || !(relation in HEADLINES) || fm?.hideBookCta) return;

    // Top-level block elements only (skip whitespace text nodes).
    const blocks = tree.children
      .map((node, index) => ({ node, index }))
      .filter((b): b is { node: Element; index: number } => b.node.type === 'element');
    if (blocks.length < MIN_BLOCKS) return;

    // Prefer the boundary just before the second h2 when it sits in the first
    // half; otherwise after the paragraph nearest the one-third mark.
    const h2s = blocks.filter((b) => b.node.tagName === 'h2');
    let insertAt: number | undefined;
    if (h2s.length >= 2 && h2s[1].index <= tree.children.length / 2) {
      insertAt = h2s[1].index;
    } else {
      const target = Math.floor(blocks.length / 3);
      const para = blocks.slice(target).find((b) => b.node.tagName === 'p');
      if (para) insertAt = para.index + 1;
    }
    if (insertAt === undefined) return;

    tree.children.splice(insertAt, 0, callout(relation) as ElementContent);
  };
}
