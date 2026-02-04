/**
 * Rehype plugin to add Bootstrap table classes to markdown tables
 *
 * This plugin adds Bootstrap's `table` class to all table elements in the HTML,
 * ensuring consistent styling for markdown tables rendered in blog posts.
 *
 * Bootstrap table styling includes:
 * - Proper padding and borders
 * - Striped rows (when using table-striped)
 * - Responsive behavior when wrapped in .table-responsive
 * - Dark mode support via Bootstrap's color variables
 */

import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

/**
 * Rehype plugin to add Bootstrap table classes to tables
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

        // Add Bootstrap table class if not already present
        if (!classes.includes('table')) {
          classes.push('table');
        }

        node.properties.className = classes;
      }
    });
  };
}
