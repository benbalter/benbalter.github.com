/**
 * Remark plugin to convert @mentions to GitHub profile links
 * Replicates Jekyll's jekyll-mentions plugin functionality
 * 
 * Converts: @username → <a href="https://github.com/username">@username</a>
 */

import { visit } from 'unist-util-visit';
import type { Root, Text, Link, PhrasingContent } from 'mdast';

// Match @username pattern:
// - Starts with @
// - Alphanumeric character (a-z, A-Z, 0-9)
// - Optionally followed by 0-37 characters (alphanumeric or hyphen)
// - Ends with alphanumeric character
// Total: 1-39 characters (GitHub username limit)
const MENTION_PATTERN = /@([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?)/g;

export function remarkMentions() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === undefined) return;

      const text = node.value;
      const matches = [...text.matchAll(MENTION_PATTERN)];

      if (matches.length === 0) return;

      // Split text into parts and create link nodes
      const newNodes: PhrasingContent[] = [];
      let lastIndex = 0;

      for (const match of matches) {
        const matchIndex = match.index!;
        const username = match[1];

        // Add text before the mention
        if (matchIndex > lastIndex) {
          newNodes.push({
            type: 'text',
            value: text.slice(lastIndex, matchIndex),
          });
        }

        // Add the mention as a link
        const linkNode: Link = {
          type: 'link',
          url: `https://github.com/${username}`,
          title: null,
          children: [
            {
              type: 'text',
              value: `@${username}`,
            },
          ],
        };
        newNodes.push(linkNode);

        lastIndex = matchIndex + match[0].length;
      }

      // Add remaining text after last mention
      if (lastIndex < text.length) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex),
        });
      }

      // Replace the text node with the new nodes
      parent.children.splice(index, 1, ...newNodes);
    });
  };
}
