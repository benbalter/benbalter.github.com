/**
 * Rehype plugin to bold key phrases in popular posts
 *
 * This plugin identifies and bolds specific key phrases in blog posts
 * to improve readability and engagement. Key phrases are memorable
 * concepts, taglines, and takeaways that represent the core ideas.
 *
 * The plugin:
 * - Only applies to posts specified in the keyPhrases configuration
 * - Performs case-insensitive matching
 * - Preserves existing formatting (doesn't double-bold)
 * - Only bolds text nodes, not code blocks or headings
 */

import { visit } from 'unist-util-visit';
import type { Root, Element, Text, Parent } from 'hast';
import type { VFile } from 'vfile';
import { popularPostKeyPhrases } from '../data/popular-post-key-phrases';

/**
 * Rehype plugin to bold key phrases in post content
 *
 * This plugin automatically detects the post slug from the file path
 * and applies bolding to key phrases if the post is in the popular posts list.
 *
 * @returns Transformer function for rehype
 */
export function rehypeBoldKeyPhrases() {
  return (tree: Root, file: VFile) => {
    // Extract post slug from file path
    // File path is like: /path/to/src/content/posts/2022-03-17-why-async.mdx
    const postSlug = getPostSlugFromPath(file.path);
    
    // Skip if no post slug or no phrases for this post
    if (!postSlug || !popularPostKeyPhrases[postSlug] || popularPostKeyPhrases[postSlug].length === 0) {
      return;
    }

    const phrases = popularPostKeyPhrases[postSlug];
    
    // Create a regex pattern that matches any of the key phrases (case-insensitive)
    // Sort by length (longest first) to match longer phrases before shorter ones
    const sortedPhrases = [...phrases].sort((a, b) => b.length - a.length);
    const pattern = new RegExp(
      `\\b(${sortedPhrases.map(escapeRegex).join('|')})\\b`,
      'gi'
    );

    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      // Skip if this text node is already inside specific elements
      if (!parent || shouldSkipElement(parent)) {
        return;
      }

      const text = node.value;
      const matches = [...text.matchAll(pattern)];

      // Skip if no matches
      if (matches.length === 0) {
        return;
      }

      // Build new nodes array with bold elements for matched phrases
      const newNodes: Array<Text | Element> = [];
      let lastIndex = 0;

      for (const match of matches) {
        const matchStart = match.index!;
        const matchEnd = matchStart + match[0].length;

        // Add text before match
        if (matchStart > lastIndex) {
          newNodes.push({
            type: 'text',
            value: text.slice(lastIndex, matchStart),
          });
        }

        // Add bold element with matched text
        newNodes.push({
          type: 'element',
          tagName: 'strong',
          properties: {},
          children: [
            {
              type: 'text',
              value: match[0], // Use actual matched text to preserve case
            },
          ],
        });

        lastIndex = matchEnd;
      }

      // Add remaining text after last match
      if (lastIndex < text.length) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex),
        });
      }

      // Replace the text node with the new nodes
      if (index !== undefined && parent && 'children' in parent) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if we should skip bolding text within this element
 */
function shouldSkipElement(parent: Parent): boolean {
  if ('tagName' in parent && parent.tagName) {
    const skipTags = [
      'code',      // Code blocks and inline code
      'pre',       // Pre-formatted text
      'h1',        // Headings (already emphasized)
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'strong',    // Already bold
      'b',         // Already bold
      'a',         // Links (keep link text clean)
    ];
    return skipTags.includes(parent.tagName as string);
  }
  return false;
}

/**
 * Extract post slug from file path
 * File path format: /path/to/src/content/posts/2022-03-17-why-async.mdx
 * Returns: 2022-03-17-why-async
 */
function getPostSlugFromPath(filePath: string | undefined): string | null {
  if (!filePath) return null;
  
  // Match the post filename pattern (YYYY-MM-DD-slug.md or .mdx)
  const match = filePath.match(/([0-9]{4}-[0-9]{2}-[0-9]{2}-.+?)\.(md|mdx)$/);
  if (match) {
    return match[1];
  }
  
  return null;
}
