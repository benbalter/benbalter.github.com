/**
 * Rehype plugin to add Tailwind classes and accessible header scopes to tables.
 *
 * This plugin adds Tailwind utility classes to table elements in the HTML,
 * ensuring consistent styling for markdown tables rendered in blog posts.
 *
 * Table styling includes:
 * - Full width tables
 * - Proper padding and borders
 * - Dark mode support via Tailwind's dark: prefix
 */

import type { Root, Element, ElementContent } from 'hast';

/**
 * Add table styles and set header scope according to table section.
 */
export function rehypeTailwindTables() {
  return (tree: Root) => {
    const walk = (node: Root | Element, section?: 'thead' | 'tbody') => {
      let currentSection = section;

      if (node.type === 'element') {
        if (node.tagName === 'table') {
          node.properties ??= {};

          // Normalize classes from existing HTML and merge Tailwind utilities.
          const existingClasses: unknown = node.properties.className;
          const classes = Array.isArray(existingClasses)
            ? existingClasses.map(String)
            : typeof existingClasses === 'string'
              ? existingClasses.split(/\s+/).filter(Boolean)
              : [];

          for (const className of ['w-full', 'border-collapse']) {
            if (!classes.includes(className)) classes.push(className);
          }
          node.properties.className = classes;
        }

        if (node.tagName === 'thead' || node.tagName === 'tbody') {
          currentSection = node.tagName;
        }

        if (node.tagName === 'th' && currentSection && !node.properties?.scope) {
          node.properties ??= {};
          node.properties.scope = currentSection === 'thead' ? 'col' : 'row';
        }
      }

      for (const child of node.children as ElementContent[]) {
        if (child.type === 'element') {
          walk(child, currentSection);
        }
      }
    };

    walk(tree);
  };
}
