/**
 * Tests for rehype-bootstrap-tables plugin
 *
 * Verifies that Bootstrap table classes are added to markdown tables
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { rehypeBootstrapTables } from './rehype-bootstrap-tables';

describe('rehypeBootstrapTables', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm) // Required for table parsing
    .use(remarkRehype)
    .use(rehypeBootstrapTables)
    .use(rehypeStringify);

  it('should add table class to markdown table', async () => {
    const markdown = `
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
`;
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('class="table"');
    expect(html).toContain('<table');
  });

  it('should handle table with multiple rows', async () => {
    const markdown = `
| Name  | Age | City    |
| ----- | --- | ------- |
| Alice | 30  | NYC     |
| Bob   | 25  | LA      |
| Carol | 35  | Chicago |
`;
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('class="table"');
    expect(html).toContain('<th>Name</th>');
    expect(html).toContain('<td>Alice</td>');
  });

  it('should handle table with alignment', async () => {
    const markdown = `
| Left | Center | Right |
| :--- | :----: | ----: |
| 1    | 2      | 3     |
`;
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('class="table"');
  });

  it('should not duplicate table class if already present', async () => {
    // This test verifies behavior when processing HTML that already has the class
    // In practice, markdown tables don't start with classes, but the plugin should
    // handle this edge case gracefully
    const processor2 = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeBootstrapTables)
      .use(rehypeBootstrapTables) // Apply twice
      .use(rehypeStringify);

    const markdown = `
| A | B |
| - | - |
| 1 | 2 |
`;
    const result = await processor2.process(markdown);
    const html = String(result);

    // Should only have one 'table' class, not duplicated
    const tableMatch = html.match(/class="([^"]*)"/);
    expect(tableMatch).not.toBeNull();
    const classes = tableMatch![1].split(' ');
    const tableClassCount = classes.filter((c) => c === 'table').length;
    expect(tableClassCount).toBe(1);
  });

  it('should handle empty table', async () => {
    const markdown = `
| Empty |
| ----- |
`;
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('class="table"');
  });

  it('should handle multiple tables in same document', async () => {
    const markdown = `
## Table 1

| A | B |
| - | - |
| 1 | 2 |

## Table 2

| X | Y |
| - | - |
| 3 | 4 |
`;
    const result = await processor.process(markdown);
    const html = String(result);

    // Count occurrences of class="table"
    const matches = html.match(/class="table"/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBe(2);
  });
});
