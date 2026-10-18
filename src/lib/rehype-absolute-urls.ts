/**
 * Rehype plugin (feed and email only) — absolutize root-relative URLs.
 *
 * Many posts link to other posts and images with root-relative paths like
 * `/2022/03/17/why-async/` or `/assets/img/…`. On the web those resolve against
 * the page, but feed readers and mail clients have no base URL, so the links
 * and images break. This rewrites `href`, `src`, `poster`, and `srcset` values
 * that start with `/` (but not protocol-relative `//`) against `siteUrl`.
 *
 * Runs last in the syndication pipeline: rehype-external-links treats every
 * `http(s):` URL as external, so absolutizing before it would open internal
 * links in a new tab.
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

interface Options {
  /** Absolute base URL for the site, e.g. "https://ben.balter.com" (no trailing slash needed). */
  siteUrl?: string;
}

/** Absolutize a root-relative URL against siteUrl; leave absolute URLs alone. */
export function absolutize(url: string | undefined, siteUrl: string): string | undefined {
  if (!url) return undefined;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//')) return url;
  if (url.startsWith('/')) return `${siteUrl.replace(/\/$/, '')}${url}`;
  return url;
}

/** Absolutize each candidate URL in a `srcset` list, keeping its descriptor. */
function absolutizeSrcset(srcset: string, siteUrl: string): string {
  return srcset
    .split(',')
    .map((candidate) => {
      const [url, ...descriptor] = candidate.trim().split(/\s+/);
      return [absolutize(url, siteUrl), ...descriptor].join(' ');
    })
    .join(', ');
}

const URL_PROPERTIES = ['href', 'src', 'poster'] as const;

export function rehypeAbsoluteUrls(options: Options = {}) {
  const siteUrl = options.siteUrl || 'https://ben.balter.com';

  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      const props = node.properties;
      if (!props) return;

      for (const name of URL_PROPERTIES) {
        const value = props[name];
        if (typeof value === 'string') props[name] = absolutize(value, siteUrl);
      }

      // hast parses srcset into an array of candidate strings; raw HTML may leave a string.
      const srcSet = props.srcSet;
      if (typeof srcSet === 'string' || Array.isArray(srcSet)) {
        const list = Array.isArray(srcSet) ? srcSet.join(', ') : srcSet;
        props.srcSet = absolutizeSrcset(list, siteUrl);
      }
    });
  };
}
