import { visit } from 'unist-util-visit';
import type { Root, Text } from 'hast';

/**
 * Rehype plugin to handle Liquid include tags in markdown content.
 * This allows us to gradually migrate from Jekyll to Next.js by processing
 * Liquid syntax and replacing it with equivalent HTML.
 */
export default function rehypeLiquidIncludes() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!node.value || typeof index !== 'number' || !parent) return;
      
      // Match {% include_cached github-culture.html %} or {% include github-culture.html %}
      const githubCultureMatch = node.value.match(/\{%\s*include(?:_cached)?\s+github-culture\.html\s*%\}/);
      
      if (githubCultureMatch) {
        // Replace with the rendered HTML for the GitHub culture callout
        const calloutHtml = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['alert', 'alert-primary', 'text-center'],
            role: 'alert',
          },
          children: [
            {
              type: 'text',
              value: 'Interested in learning more about how GitHub works and what it\'s like to be a GitHubber?',
            },
            {
              type: 'element',
              tagName: 'br',
              properties: {},
              children: [],
            },
            {
              type: 'element',
              tagName: 'a',
              properties: {
                href: '/2021/02/01/what-to-read-before-starting-or-interviewing-at-github/',
                className: ['alert-link'],
              },
              children: [
                {
                  type: 'text',
                  value: 'Check out these popular posts on GitHub\'s culture and communication patterns',
                },
              ],
            },
            {
              type: 'text',
              value: '.',
            },
          ],
        };
        
        // Replace the text node with the callout element
        parent.children[index] = calloutHtml as any;
      }
    });
  };
}
