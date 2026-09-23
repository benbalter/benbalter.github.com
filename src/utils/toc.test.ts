import { describe, it, expect } from 'vitest';
import { tocEntries, cleanHeadingText, isOutlineHeading, MIN_HEADINGS_FOR_TOC } from './toc';

describe('tocEntries', () => {
  it('maps h2 and h3 headings to TOC entries', () => {
    expect(
      tocEntries([
        { depth: 2, slug: 'intro', text: 'Introduction' },
        { depth: 3, slug: 'details', text: 'Details' },
        { depth: 2, slug: 'conclusion', text: 'Conclusion' },
      ]),
    ).toEqual([
      { level: 2, id: 'intro', text: 'Introduction' },
      { level: 3, id: 'details', text: 'Details' },
      { level: 2, id: 'conclusion', text: 'Conclusion' },
    ]);
  });

  it('ignores h1, h4, h5, and h6 headings', () => {
    expect(
      tocEntries([
        { depth: 1, slug: 'title', text: 'Title' },
        { depth: 2, slug: 'kept', text: 'Kept' },
        { depth: 4, slug: 'h4', text: 'H4' },
        { depth: 5, slug: 'h5', text: 'H5' },
        { depth: 6, slug: 'h6', text: 'H6' },
      ]),
    ).toEqual([{ level: 2, id: 'kept', text: 'Kept' }]);
  });

  it('strips the trailing anchor glyph from heading text', () => {
    expect(tocEntries([{ depth: 2, slug: 'test', text: 'Heading#' }])).toEqual([
      { level: 2, id: 'test', text: 'Heading' },
    ]);
  });

  it('skips headings with empty text after cleaning', () => {
    expect(tocEntries([{ depth: 2, slug: 'empty', text: '#' }])).toEqual([]);
  });

  it('skips the hidden footnotes heading', () => {
    expect(
      tocEntries([
        { depth: 2, slug: 'intro', text: 'Intro' },
        { depth: 2, slug: 'footnote-label', text: 'Footnotes' },
      ]),
    ).toEqual([{ level: 2, id: 'intro', text: 'Intro' }]);
  });

  it('returns an empty array when there are no headings', () => {
    expect(tocEntries([])).toEqual([]);
  });
});

describe('cleanHeadingText', () => {
  it('removes a trailing # and surrounding whitespace', () => {
    expect(cleanHeadingText(' Heading #')).toBe('Heading');
  });

  it('keeps a # that is not at the end', () => {
    expect(cleanHeadingText('C# tips')).toBe('C# tips');
  });
});

describe('isOutlineHeading', () => {
  it('is false only for the footnotes heading', () => {
    expect(isOutlineHeading({ depth: 2, slug: 'footnote-label', text: 'Footnotes' })).toBe(false);
    expect(isOutlineHeading({ depth: 2, slug: 'intro', text: 'Intro' })).toBe(true);
  });
});

describe('MIN_HEADINGS_FOR_TOC', () => {
  it('is 3', () => {
    expect(MIN_HEADINGS_FOR_TOC).toBe(3);
  });
});
