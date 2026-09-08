/**
 * Rehype plugin (email only) — degrade web-only media to email-safe fallbacks.
 *
 * Posts can embed `<style>` blocks, autoplaying `<video>` GIF-replacements, and
 * `<audio>` players. None of that survives an inbox: email clients strip
 * `<style>`, don't play inline `<video>`/`<audio>`, and Kit's broadcast API
 * flat-out rejects a payload containing them with a generic 422 ("There has been
 * an error saving your changes"), so the broadcast never sends at all.
 *
 * For email we therefore:
 *   - drop `<style>` elements entirely,
 *   - replace each `<video>` with its poster image (if any) linking to the
 *     playable source, or a plain "▶ label" link when there's no poster,
 *   - replace each `<audio>` with a "🔊 label" link to the audio file.
 *
 * All asset URLs are absolutized against `siteUrl` because the email pipeline
 * deliberately omits relative-URL rewriting, so `/video/…` and `/audio/…` paths
 * would otherwise be unresolvable in an inbox. Web rendering is untouched — this
 * runs only in the email pipeline's rehype list.
 */

import { visit, SKIP } from 'unist-util-visit';
import type { VisitorResult } from 'unist-util-visit';
import type { Root, Element, ElementContent } from 'hast';

interface Options {
  /** Absolute base URL for the site, e.g. "https://ben.balter.com" (no trailing slash needed). */
  siteUrl?: string;
}

/** Read a string property, tolerating hast's aria-label → ariaLabel normalization. */
function stringProp(node: Element, ...names: string[]): string | undefined {
  for (const name of names) {
    const value = node.properties?.[name];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return undefined;
}

/** Absolutize a root-relative URL against siteUrl; leave absolute URLs alone. */
function absolutize(url: string | undefined, siteUrl: string): string | undefined {
  if (!url) return undefined;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//')) return url;
  if (url.startsWith('/')) return `${siteUrl.replace(/\/$/, '')}${url}`;
  return url;
}

/** Collect `<source>` children as {src, type} pairs. */
function sources(node: Element): { src: string | undefined; type: string | undefined }[] {
  return node.children
    .filter((c): c is Element => c.type === 'element' && c.tagName === 'source')
    .map((s) => ({ src: stringProp(s, 'src'), type: stringProp(s, 'type') }));
}

/** Pick the most email-friendly playable source (mp4 for video, mpeg for audio). */
function preferredSource(node: Element, preferType: RegExp): string | undefined {
  const list = sources(node);
  const preferred = list.find((s) => s.type && preferType.test(s.type) && s.src);
  return (preferred?.src ?? list.find((s) => s.src)?.src) || stringProp(node, 'src');
}

/** Build an <a href=…>children</a> element. */
function link(href: string, children: ElementContent[]): Element {
  return {
    type: 'element',
    tagName: 'a',
    properties: { href, target: '_blank', rel: ['noopener', 'noreferrer'] },
    children,
  };
}

export function rehypeEmailMediaFallback(options: Options = {}) {
  const siteUrl = options.siteUrl || 'https://ben.balter.com';

  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent): VisitorResult => {
      if (!parent || index === undefined) return;

      // Drop <style> blocks — email clients strip them and Kit rejects them.
      if (node.tagName === 'style') {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }

      if (node.tagName === 'video') {
        const label = stringProp(node, 'ariaLabel', 'aria-label', 'title') || 'Watch the clip';
        const href =
          absolutize(preferredSource(node, /mp4/i), siteUrl) ||
          absolutize(stringProp(node, 'poster'), siteUrl);
        const poster = absolutize(stringProp(node, 'poster'), siteUrl);

        let replacement: Element;
        if (poster) {
          const img: Element = {
            type: 'element',
            tagName: 'img',
            properties: { src: poster, alt: label, style: 'max-width:100%;height:auto;border-radius:.5rem' },
            children: [],
          };
          replacement = href ? link(href, [img]) : img;
        } else {
          replacement = link(href || '#', [{ type: 'text', value: `▶ ${label}` }]);
        }
        parent.children[index] = replacement;
        return [SKIP, index];
      }

      if (node.tagName === 'audio') {
        const label = stringProp(node, 'ariaLabel', 'aria-label', 'title') || 'Listen';
        const href = absolutize(preferredSource(node, /mpe?g|mp3/i), siteUrl);
        parent.children[index] = link(href || '#', [{ type: 'text', value: `🔊 ${label}` }]);
        return [SKIP, index];
      }
    });
  };
}
