import { describe, it, expect } from 'vitest';
import { extractHeadings, MIN_HEADINGS_FOR_TOC } from './toc';

describe('extractHeadings', () => {
  it('extracts h2 and h3 headings with IDs', () => {
    const html = `
      <h2 id="intro">Introduction</h2>
      <p>Some content</p>
      <h3 id="details">Details</h3>
      <h2 id="conclusion">Conclusion</h2>
    `;
    expect(extractHeadings(html)).toEqual([
      { level: 2, id: 'intro', text: 'Introduction' },
      { level: 3, id: 'details', text: 'Details' },
      { level: 2, id: 'conclusion', text: 'Conclusion' },
    ]);
  });

  it('strips nested HTML tags from heading text', () => {
    const html = '<h2 id="test"><a href="#test">Linked <strong>heading</strong></a></h2>';
    expect(extractHeadings(html)).toEqual([
      { level: 2, id: 'test', text: 'Linked heading' },
    ]);
  });

  it('strips trailing # from heading text', () => {
    const html = '<h2 id="test"><a href="#test">Heading#</a></h2>';
    expect(extractHeadings(html)).toEqual([
      { level: 2, id: 'test', text: 'Heading' },
    ]);
  });

  it('skips headings with empty text after stripping', () => {
    const html = '<h2 id="empty"><a href="#empty">#</a></h2>';
    expect(extractHeadings(html)).toEqual([]);
  });

  it('ignores h1, h4, h5, h6 headings', () => {
    const html = `
      <h1 id="title">Title</h1>
      <h2 id="section">Section</h2>
      <h4 id="sub">Sub</h4>
    `;
    expect(extractHeadings(html)).toEqual([
      { level: 2, id: 'section', text: 'Section' },
    ]);
  });

  it('returns empty array for content with no headings', () => {
    expect(extractHeadings('<p>No headings here</p>')).toEqual([]);
  });

  it('handles headings with extra attributes', () => {
    const html = '<h2 id="test" class="text-lg" data-custom="true">Heading</h2>';
    expect(extractHeadings(html)).toEqual([
      { level: 2, id: 'test', text: 'Heading' },
    ]);
  });
});

describe('MIN_HEADINGS_FOR_TOC', () => {
  it('is 3', () => {
    expect(MIN_HEADINGS_FOR_TOC).toBe(3);
  });
});
