/**
 * Rehype plugin to reserve layout space for images and prevent CLS
 *
 * Most post images are remote WordPress uploads with no intrinsic dimensions,
 * so the browser can't reserve space until the bytes arrive — the paragraph
 * below jumps when the image loads (Cumulative Layout Shift).
 *
 * WordPress encodes each rendition's size in the filename (`…-300x223.png`),
 * so we parse those into `width`/`height` attributes. Combined with the
 * `.post-content img { max-width: 100%; height: auto }` rule, the browser
 * derives an aspect-ratio box and reserves space up front — no shift, no
 * distortion.
 *
 * Images that already carry dimensions are left alone. Images whose src has no
 * parseable size (WordPress originals, non-WP hosts) can't be sized here and
 * are logged once so the gap is visible rather than silent.
 *
 * Must run after rehype-raw so inline HTML `<img>` tags are proper elements.
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

/** WordPress rendition suffix: `-<width>x<height>` before the extension. */
const DIMENSION_SUFFIX = /-(\d+)x(\d+)\.[a-z0-9]+(?:[?#].*)?$/i;

/** Warn at most once per src across the whole build. */
const warned = new Set<string>();

export function rehypeImageDimensions() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'img' || !node.properties) return;

      // Respect dimensions that are already present.
      if (node.properties.width != null || node.properties.height != null) return;

      const src = typeof node.properties.src === 'string' ? node.properties.src : '';
      if (!src) return;

      const match = src.match(DIMENSION_SUFFIX);
      if (!match) {
        if (!warned.has(src)) {
          warned.add(src);
          console.warn(`[rehype-image-dimensions] no parseable size, skipping: ${src}`);
        }
        return;
      }

      node.properties.width = Number(match[1]);
      node.properties.height = Number(match[2]);
    });
  };
}
