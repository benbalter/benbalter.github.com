/**
 * Tests for Tailwind table styling and accessible header scopes
 *
 * Verifies that Tailwind table classes are added to markdown tables
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { rehypeTailwindTables } from './rehype-tailwind-tables';

describe('rehypeTailwindTables', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm) // Required for table parsing
    .use(remarkRehype)
    .use(rehypeTailwindTables)
    .use(rehypeStringify);

  it('should add Tailwind table classes to markdown table', async () => {
    const markdown = `
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
`;
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('w-full');
    expect(html).toContain('border-collapse');
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

    expect(html).toContain('w-full');
    expect(html).toContain('border-collapse');
    expect(html).toContain('<th scope="col">Name</th>');
    expect(html).toContain('<td>Alice</td>');
  });

  it('should set column-header scope in the head and row-header scope in the body', async () => {
    const htmlProcessor = unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeTailwindTables)
      .use(rehypeStringify);
    const markdown = `
<table>
  <thead><tr><th>Column</th></tr></thead>
  <tbody><tr><th>Row</th><td>Value</td></tr></tbody>
</table>
`;
    const result = await htmlProcessor.process(markdown);
    const html = String(result);

    expect(html).toContain('<th scope="col">Column</th>');
    expect(html).toContain('<th scope="row">Row</th>');
  });

  it('should preserve an explicit header scope', async () => {
    const htmlProcessor = unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeTailwindTables)
      .use(rehypeStringify);
    const result = await htmlProcessor.process(
      '<table><tbody><tr><th scope="colgroup">Group</th></tr></tbody></table>',
    );

    expect(String(result)).toContain('<th scope="colgroup">Group</th>');
  });

  it('should add column scope to Markdown table headers', async () => {
    const markdown = `
| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
`;
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('<th scope="col">Header 1</th>');
    expect(html).toContain('<th scope="col">Header 2</th>');
  });

  it('should handle table with alignment', async () => {
    const markdown = `
| Left | Center | Right |
| :--- | :----: | ----: |
| 1    | 2      | 3     |
`;
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('w-full');
    expect(html).toContain('border-collapse');
  });

  it('should not duplicate classes if already present', async () => {
    // This test verifies behavior when processing HTML that already has the class
    // In practice, markdown tables don't start with classes, but the plugin should
    // handle this edge case gracefully
    const processor2 = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeTailwindTables)
      .use(rehypeTailwindTables) // Apply twice
      .use(rehypeStringify);

    const markdown = `
| A | B |
| - | - |
| 1 | 2 |
`;
    const result = await processor2.process(markdown);
    const html = String(result);

    // Should only have one 'w-full' class, not duplicated
    const tableMatch = html.match(/class="([^"]*)"/);
    expect(tableMatch).not.toBeNull();
    const classes = tableMatch![1].split(' ');
    const wFullClassCount = classes.filter((c) => c === 'w-full').length;
    expect(wFullClassCount).toBe(1);
  });

  it('should handle empty table', async () => {
    const markdown = `
| Empty |
| ----- |
`;
    const result = await processor.process(markdown);
    const html = String(result);

    expect(html).toContain('w-full');
    expect(html).toContain('border-collapse');
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

    // Count occurrences of w-full (each table should have it)
    const matches = html.match(/w-full/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBe(2);
  });
});
