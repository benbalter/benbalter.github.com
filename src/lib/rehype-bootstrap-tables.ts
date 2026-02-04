/**
 * Rehype plugin to add table styling classes to markdown tables
 *
 * This plugin adds styling classes to all table elements in the HTML,
 * ensuring consistent styling for markdown tables rendered in blog posts.
 *
 * Table styling includes:
 * - Full width tables
 * - Proper padding and borders
 * - Dark mode support via Tailwind's dark: prefix
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

/**
 * Rehype plugin to add table styling classes to tables
 *
 * @returns Transformer function for rehype
 */
export function rehypeBootstrapTables() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'table') {
        // Initialize properties if not present
        if (!node.properties) {
          node.properties = {};
        }

        // Get existing classes or create empty array
        const existingClasses = node.properties.className;
        let classes: string[] = [];

        if (Array.isArray(existingClasses)) {
          classes = existingClasses.map(String);
        } else if (typeof existingClasses === 'string') {
          classes = existingClasses.split(' ').filter(Boolean);
        }

        // Add table styling classes if not already present
        const tableClasses = ['w-full', 'border-collapse'];
        for (const cls of tableClasses) {
          if (!classes.includes(cls)) {
            classes.push(cls);
          }
        }

        node.properties.className = classes;
      }
    });
  };
}
