/**
 * Expressive Code plugin that gives each code block's copy button an
 * `aria-label`.
 *
 * The built-in frames plugin renders the button with only a `title` and an
 * empty `<div>` for its icon. Browsers fall back to `title` for the
 * accessible name, but html-validate's `text-content` rule (and some
 * assistive tech) doesn't, so every code block on the site was a warning.
 * Copying the localized `title` into `aria-label` keeps one source for the
 * wording.
 *
 * Expressive Code prepends its built-in plugins, so this runs after frames
 * has added the button.
 */

import type { ExpressiveCodePlugin } from 'astro-expressive-code';
import { selectAll } from 'astro-expressive-code/hast';

export function pluginCopyButtonLabel(): ExpressiveCodePlugin {
  return {
    name: 'copy-button-label',
    hooks: {
      postprocessRenderedBlock: ({ renderData }) => {
        for (const button of selectAll('button[data-code]', renderData.blockAst)) {
          const { title, ariaLabel } = button.properties;
          if (typeof title === 'string' && title && !ariaLabel) {
            button.properties.ariaLabel = title;
          }
        }
      },
    },
  };
}
