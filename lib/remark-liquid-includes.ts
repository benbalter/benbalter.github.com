import { visit } from 'unist-util-visit';
import type { Root, Html } from 'mdast';

/**
 * Remark plugin to process Jekyll Liquid includes in markdown.
 * Converts {% include_cached github-culture.html %} to actual HTML.
 */
export default function remarkLiquidIncludes() {
  return (tree: Root) => {
    // Check paragraph nodes that might contain the include
    // Process in reverse order to avoid index issues when removing nodes
    visit(tree, 'paragraph', (node, index, parent) => {
      if (index === null || !parent) return;
      
      // Check if the paragraph contains only the include
      if (node.children.length === 1 && node.children[0] && node.children[0].type === 'text') {
        const text = node.children[0].value;
        const githubCultureRegex = /^\{%\s*include_cached\s+github-culture\.html\s*%\}$/;
        
        if (githubCultureRegex.test(text.trim())) {
          // Replace with actual HTML content - use a standalone block element
          const htmlContent = `<div class="alert alert-primary text-center" role="alert">
Interested in learning more about how GitHub works and what it's like to be a GitHubber?<br />
<a href="/2021/02/01/what-to-read-before-starting-or-interviewing-at-github/" class="alert-link">Check out these popular posts on GitHub's culture and communication patterns</a>.
</div>`;
          
          // Create HTML node
          const htmlNode: Html = {
            type: 'html',
            value: htmlContent,
          };
          
          // Replace paragraph with HTML node
          if (parent.children && typeof index === 'number') {
            parent.children[index] = htmlNode;
          }
        }
      }
    });
  };
}
