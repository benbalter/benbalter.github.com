/**
 * Tests for the remarkKramdownAttrs plugin
 * 
 * These tests verify the plugin logic by directly invoking it on AST structures.
 * We mock unist-util-visit to avoid ESM issues in Jest, using a simple implementation
 * that provides the core visit functionality.
 */

import type { Root, Paragraph, Text, Image, Table, Parent as MdastParent } from 'mdast';

// Mock unist-util-visit with a simple implementation
jest.mock('unist-util-visit', () => ({
  visit: (
    tree: Record<string, unknown>,
    testOrVisitor: string | ((node: unknown, index?: number, parent?: MdastParent) => void),
    maybeVisitor?: (node: unknown, index?: number, parent?: MdastParent) => void
  ) => {
    const typeTest = typeof testOrVisitor === 'string' ? testOrVisitor : null;
    const visitor = typeof testOrVisitor === 'function' ? testOrVisitor : maybeVisitor;

    const walk = (node: unknown, index?: number, parent?: MdastParent): void => {
      if (!node || typeof node !== 'object') return;
      
      const typedNode = node as { type?: string; children?: unknown[] };
      
      // Call visitor if type matches (or no type filter)
      if (typeTest === null || typedNode.type === typeTest) {
        if (visitor) {
          visitor(node, index, parent);
        }
      }
      
      // Recursively walk children
      if (typedNode.children && Array.isArray(typedNode.children)) {
        typedNode.children.forEach((child, idx) => {
          walk(child, idx, node as MdastParent);
        });
      }
    };

    walk(tree);
  },
}));

// Import the plugin after mocking
import remarkKramdownAttrs from './remark-kramdown-attrs';

describe('remarkKramdownAttrs', () => {
  describe('plugin structure', () => {
    it('should return a function', () => {
      const plugin = remarkKramdownAttrs();
      expect(typeof plugin).toBe('function');
    });

    it('should process a tree without throwing', () => {
      const plugin = remarkKramdownAttrs();
      const tree: Root = {
        type: 'root',
        children: [],
      };
      
      // Should not throw
      expect(() => plugin(tree)).not.toThrow();
    });
  });

  describe('block-level attribute detection', () => {
    it('should detect and apply attributes to previous sibling', () => {
      const plugin = remarkKramdownAttrs();
      
      // Create a simple tree with a table followed by an attribute paragraph
      const table: Table = {
        type: 'table',
        children: [
          {
            type: 'tableRow',
            children: [
              { type: 'tableCell', children: [{ type: 'text', value: 'Cell' } as Text] }
            ]
          }
        ],
      };
      
      const attrParagraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: '{: .table }' } as Text],
      };
      
      const tree: Root = {
        type: 'root',
        children: [table, attrParagraph],
      };
      
      plugin(tree);
      
      // Check that attributes were applied to the table
      expect(table.data).toBeDefined();
      expect(table.data?.hProperties).toBeDefined();
      expect((table.data?.hProperties as Record<string, unknown>)?.className).toContain('table');
      
      // Check that the attribute paragraph was removed
      expect(tree.children).not.toContain(attrParagraph);
    });

    it('should parse multiple classes', () => {
      const plugin = remarkKramdownAttrs();
      
      const paragraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Test content' } as Text],
      };
      
      const attrParagraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: '{: .class1 .class2 .class3 }' } as Text],
      };
      
      const tree: Root = {
        type: 'root',
        children: [paragraph, attrParagraph],
      };
      
      plugin(tree);
      
      const classes = (paragraph.data?.hProperties as Record<string, unknown>)?.className;
      expect(classes).toContain('class1');
      expect(classes).toContain('class2');
      expect(classes).toContain('class3');
    });

    it('should parse ID attributes', () => {
      const plugin = remarkKramdownAttrs();
      
      const paragraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Test content' } as Text],
      };
      
      const attrParagraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: '{: #my-id }' } as Text],
      };
      
      const tree: Root = {
        type: 'root',
        children: [paragraph, attrParagraph],
      };
      
      plugin(tree);
      
      expect((paragraph.data?.hProperties as Record<string, unknown>)?.id).toBe('my-id');
    });

    it('should parse style attributes', () => {
      const plugin = remarkKramdownAttrs();
      
      const paragraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Test content' } as Text],
      };
      
      const attrParagraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: '{: style="color: red;" }' } as Text],
      };
      
      const tree: Root = {
        type: 'root',
        children: [paragraph, attrParagraph],
      };
      
      plugin(tree);
      
      expect((paragraph.data?.hProperties as Record<string, unknown>)?.style).toBe('color: red;');
    });

    it('should handle combined class, ID, and style', () => {
      const plugin = remarkKramdownAttrs();
      
      const paragraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Test content' } as Text],
      };
      
      const attrParagraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: '{: .highlighted #special style="margin: 10px;" }' } as Text],
      };
      
      const tree: Root = {
        type: 'root',
        children: [paragraph, attrParagraph],
      };
      
      plugin(tree);
      
      const props = paragraph.data?.hProperties as Record<string, unknown>;
      expect(props?.className).toContain('highlighted');
      expect(props?.id).toBe('special');
      expect(props?.style).toBe('margin: 10px;');
    });
  });

  describe('inline attribute detection', () => {
    it('should apply attributes to images', () => {
      const plugin = remarkKramdownAttrs();
      
      const image: Image = {
        type: 'image',
        url: 'https://example.com/image.png',
        alt: 'Alt text',
      };
      
      const attrText: Text = {
        type: 'text',
        value: '{: .img-fluid }',
      };
      
      const paragraph: Paragraph = {
        type: 'paragraph',
        children: [image, attrText],
      };
      
      const tree: Root = {
        type: 'root',
        children: [paragraph],
      };
      
      plugin(tree);
      
      expect((image.data?.hProperties as Record<string, unknown>)?.className).toContain('img-fluid');
      // The attribute text should be removed or emptied
      expect(attrText.value).toBe('');
    });

    it('should apply multiple classes to images', () => {
      const plugin = remarkKramdownAttrs();
      
      const image: Image = {
        type: 'image',
        url: 'https://example.com/image.png',
        alt: 'Alt text',
      };
      
      const attrText: Text = {
        type: 'text',
        value: '{: .w-75 .d-block .mx-auto }',
      };
      
      const paragraph: Paragraph = {
        type: 'paragraph',
        children: [image, attrText],
      };
      
      const tree: Root = {
        type: 'root',
        children: [paragraph],
      };
      
      plugin(tree);
      
      const classes = (image.data?.hProperties as Record<string, unknown>)?.className;
      expect(classes).toContain('w-75');
      expect(classes).toContain('d-block');
      expect(classes).toContain('mx-auto');
    });
  });

  describe('edge cases', () => {
    it('should not modify elements without kramdown attributes', () => {
      const plugin = remarkKramdownAttrs();
      
      const paragraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Just regular text' } as Text],
      };
      
      const tree: Root = {
        type: 'root',
        children: [paragraph],
      };
      
      plugin(tree);
      
      expect(paragraph.data).toBeUndefined();
    });

    it('should handle empty tree', () => {
      const plugin = remarkKramdownAttrs();
      
      const tree: Root = {
        type: 'root',
        children: [],
      };
      
      // Should not throw
      expect(() => plugin(tree)).not.toThrow();
    });

    it('should handle whitespace variations in attribute syntax', () => {
      const plugin = remarkKramdownAttrs();
      
      const paragraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: 'Test content' } as Text],
      };
      
      const attrParagraph: Paragraph = {
        type: 'paragraph',
        children: [{ type: 'text', value: '{:   .spaced   }' } as Text],
      };
      
      const tree: Root = {
        type: 'root',
        children: [paragraph, attrParagraph],
      };
      
      plugin(tree);
      
      expect((paragraph.data?.hProperties as Record<string, unknown>)?.className).toContain('spaced');
    });
  });
});

