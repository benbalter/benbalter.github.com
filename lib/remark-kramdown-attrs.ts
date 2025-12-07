/**
 * A remark plugin to support kramdown-style attribute lists.
 *
 * Kramdown uses {: .class #id attr="value" } syntax after block elements
 * (tables, images, paragraphs, etc.) to add attributes.
 *
 * Examples:
 *   - `{: .table .w-75 }` - adds classes
 *   - `{: #my-id }` - adds an id
 *   - `{: style="color: red;" }` - adds inline style
 *   - `![alt text](url){: .img-fluid .mx-auto }` - adds classes to image
 *
 * Note: Unlike remark-directive, this handles the specific kramdown syntax
 * which uses {: attrs } rather than ::: directive syntax.
 */

import type { Root, Parent, Paragraph, Text } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

// Type for mdast nodes that can have data.hProperties
interface MdastNode {
  type: string;
  data?: {
    hProperties?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Pattern to match kramdown-style attribute lists
// Matches: {: .class #id attr="value" } or {: .class }
// Can be on its own line (block-level) or inline after an element
const KRAMDOWN_ATTR_PATTERN = /\{:\s*([^}]+)\s*\}/g;

// Pattern to match individual attributes within the braces
const CLASS_PATTERN = /\.([a-zA-Z0-9_-]+)/g;
const ID_PATTERN = /#([a-zA-Z0-9_-]+)/;
const ATTR_PATTERN = /([a-zA-Z0-9_-]+)=["']([^"']+)["']/g;

interface ParsedAttrs {
  classes: string[];
  id?: string;
  style?: string;
  otherAttrs: Record<string, string>;
}

/**
 * Parse kramdown-style attribute string into structured data
 */
function parseKramdownAttrs(attrString: string): ParsedAttrs {
  const classes: string[] = [];
  let id: string | undefined;
  let style: string | undefined;
  const otherAttrs: Record<string, string> = {};

  // Extract classes (.class-name)
  let classMatch;
  while ((classMatch = CLASS_PATTERN.exec(attrString)) !== null) {
    if (classMatch[1]) {
      classes.push(classMatch[1]);
    }
  }
  // Reset lastIndex for next pattern
  CLASS_PATTERN.lastIndex = 0;

  // Extract ID (#id)
  const idMatch = ID_PATTERN.exec(attrString);
  if (idMatch?.[1]) {
    id = idMatch[1];
  }

  // Extract other attributes (attr="value")
  let attrMatch;
  while ((attrMatch = ATTR_PATTERN.exec(attrString)) !== null) {
    const [, name, value] = attrMatch;
    if (name === 'style') {
      style = value;
    } else if (name && value) {
      otherAttrs[name] = value;
    }
  }
  // Reset lastIndex for next use
  ATTR_PATTERN.lastIndex = 0;

  return { classes, id, style, otherAttrs };
}

/**
 * Store parsed attributes in a node's data.hProperties
 * These will be picked up by remark-rehype and applied to the HTML element
 */
function applyAttrsToNode(
  node: MdastNode,
  attrs: ParsedAttrs
): void {
  if (!node.data) {
    node.data = {};
  }
  if (!node.data.hProperties) {
    node.data.hProperties = {};
  }
  const props = node.data.hProperties;

  if (attrs.classes.length > 0) {
    const existingClass = (props.className as string[] | string | undefined);
    if (Array.isArray(existingClass)) {
      props.className = [...existingClass, ...attrs.classes];
    } else if (typeof existingClass === 'string') {
      props.className = [existingClass, ...attrs.classes];
    } else {
      props.className = attrs.classes;
    }
  }

  if (attrs.id) {
    props.id = attrs.id;
  }

  if (attrs.style) {
    props.style = attrs.style;
  }

  for (const [key, value] of Object.entries(attrs.otherAttrs)) {
    props[key] = value;
  }
}

/**
 * Check if a text node contains only a kramdown attribute list
 */
function isKramdownOnlyParagraph(node: Paragraph): {
  isMatch: boolean;
  attrString?: string;
} {
  if (node.children.length !== 1) {
    return { isMatch: false };
  }

  const child = node.children[0];
  if (child?.type !== 'text') {
    return { isMatch: false };
  }

  const text = (child as Text).value.trim();
  const match = text.match(/^\{:\s*([^}]+)\s*\}$/);
  if (match) {
    return { isMatch: true, attrString: match[1] };
  }

  return { isMatch: false };
}

/**
 * Handle inline kramdown attributes on images and links
 * e.g., ![alt](url){: .class } or [text](url){: .class }
 */
function processInlineAttrs(node: Paragraph): void {
  for (let i = 0; i < node.children.length - 1; i++) {
    const current = node.children[i];
    const next = node.children[i + 1];

    // Check if current is an image or link and next is a text with kramdown attrs
    if (
      current &&
      (current.type === 'image' || current.type === 'link') &&
      next?.type === 'text'
    ) {
      const textNode = next as Text;
      const match = textNode.value.match(/^\{:\s*([^}]+)\s*\}/);

      if (match) {
        const attrs = parseKramdownAttrs(match[1] as string);
        applyAttrsToNode(current as unknown as MdastNode, attrs);

        // Remove the attribute text from the text node
        textNode.value = textNode.value.slice(match[0].length);

        // If the text node is now empty, mark it for removal
        if (textNode.value.trim() === '') {
          (textNode as Text & { _remove?: boolean })._remove = true;
        }
      }
    }
  }

  // Remove marked nodes
  node.children = node.children.filter(
    (child) => !(child as Text & { _remove?: boolean })._remove
  );
}

/**
 * Find the previous sibling element in the parent
 */
function findPreviousSibling(
  parent: Parent,
  index: number
): { node: Parent['children'][number]; index: number } | null {
  // Skip over empty paragraphs or whitespace-only text nodes
  for (let i = index - 1; i >= 0; i--) {
    const sibling = parent.children[i];
    if (!sibling) continue;

    if (sibling.type === 'paragraph') {
      // Check if it's a meaningful paragraph (not empty)
      const para = sibling as Paragraph;
      if (para.children.length > 0) {
        return { node: sibling, index: i };
      }
    } else {
      // Tables, headings, lists, etc.
      return { node: sibling, index: i };
    }
  }
  return null;
}

/**
 * remark plugin to handle kramdown-style attribute lists
 */
const remarkKramdownAttrs: Plugin<[], Root> = function () {
  return (tree: Root) => {
    // First pass: handle inline attributes on images/links within paragraphs
    visit(tree, 'paragraph', (node: Paragraph) => {
      processInlineAttrs(node);
    });

    // Second pass: handle block-level attribute paragraphs
    // We need to collect nodes to remove and modifications to make
    const nodesToRemove: Set<Paragraph> = new Set();

    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (index === undefined || !parent) return;

      const { isMatch, attrString } = isKramdownOnlyParagraph(node);

      if (isMatch && attrString) {
        const attrs = parseKramdownAttrs(attrString);
        const prevSibling = findPreviousSibling(parent as Parent, index);

        if (prevSibling) {
          applyAttrsToNode(prevSibling.node as unknown as MdastNode, attrs);
          nodesToRemove.add(node);
        }
      }
    });

    // Remove the attribute-only paragraphs
    visit(tree, (node) => {
      if ('children' in node && Array.isArray((node as Parent).children)) {
        (node as Parent).children = (node as Parent).children.filter(
          (child) => !nodesToRemove.has(child as Paragraph)
        );
      }
    });
  };
};

export default remarkKramdownAttrs;
