/**
 * Tests for posts-meta.json API endpoint
 *
 * This endpoint generates a JSON mapping of post URLs to metadata
 * (title, description, headings) for link previews.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

import { getCollection } from 'astro:content';
import { GET, stripMarkdown, extractHeadings } from './posts-meta.json';

const mockGetCollection = vi.mocked(getCollection);

/** Create a minimal mock post matching the shape used by the endpoint */
function createMockPost(
  id: string,
  title: string,
  description: string,
  body = '',
  published = true,
) {
  return {
    id,
    collection: 'posts' as const,
    data: { title, description, published },
    body,
  };
}

describe('posts-meta.json', () => {
  describe('stripMarkdown', () => {
    it('should strip bold formatting', () => {
      expect(stripMarkdown('**bold text**')).toBe('bold text');
    });

    it('should strip alternate bold formatting', () => {
      expect(stripMarkdown('__bold alt__')).toBe('bold alt');
    });

    it('should strip italic formatting', () => {
      expect(stripMarkdown('*italic*')).toBe('italic');
    });

    it('should strip alternate italic formatting', () => {
      expect(stripMarkdown('_italic alt_')).toBe('italic alt');
    });

    it('should strip inline code', () => {
      expect(stripMarkdown('`code`')).toBe('code');
    });

    it('should strip links keeping text', () => {
      expect(stripMarkdown('[link text](https://example.com)')).toBe('link text');
    });

    it('should strip strikethrough', () => {
      expect(stripMarkdown('~~deleted~~')).toBe('deleted');
    });

    it('should handle plain text unchanged', () => {
      expect(stripMarkdown('plain text')).toBe('plain text');
    });

    it('should handle combined formatting', () => {
      expect(stripMarkdown('**bold** and *italic* and `code`')).toBe('bold and italic and code');
    });
  });

  describe('extractHeadings', () => {
    it('should extract a single heading', () => {
      const headings = extractHeadings('## My Heading\n\nSome content');
      expect(headings).toHaveLength(1);
      expect(headings[0]).toEqual({
        depth: 2,
        slug: 'my-heading',
        text: 'My Heading',
      });
    });

    it('should extract headings at different depths', () => {
      const headings = extractHeadings('# H1\n## H2\n### H3\n#### H4');
      expect(headings).toHaveLength(4);
      expect(headings[0].depth).toBe(1);
      expect(headings[1].depth).toBe(2);
      expect(headings[2].depth).toBe(3);
      expect(headings[3].depth).toBe(4);
    });

    it('should strip markdown from heading text', () => {
      const headings = extractHeadings('## **Bold** heading with `code`');
      expect(headings[0].text).toBe('Bold heading with code');
    });

    it('should return empty array for no headings', () => {
      expect(extractHeadings('Just some paragraph text.')).toEqual([]);
    });

    it('should return empty array for empty body', () => {
      expect(extractHeadings('')).toEqual([]);
    });

    it('should generate unique slugs for duplicate headings', () => {
      const headings = extractHeadings('## Heading\n## Heading\n## Heading');
      expect(headings).toHaveLength(3);
      expect(headings[0].slug).toBe('heading');
      expect(headings[1].slug).toBe('heading-1');
      expect(headings[2].slug).toBe('heading-2');
    });

    it('should not match lines without a space after hashes', () => {
      // "##NoSpace" is not a valid heading
      expect(extractHeadings('##NoSpace')).toEqual([]);
    });
  });

  describe('GET', () => {
    beforeEach(() => {
      mockGetCollection.mockReset();
    });

    it('should return a JSON response with correct content type', async () => {
      mockGetCollection.mockResolvedValue([] as any);
      const response = await GET();
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should return valid JSON', async () => {
      mockGetCollection.mockResolvedValue([] as any);
      const response = await GET();
      const text = await response.text();
      expect(() => JSON.parse(text)).not.toThrow();
    });

    it('should return empty object for empty collection', async () => {
      mockGetCollection.mockResolvedValue([] as any);
      const response = await GET();
      const data = JSON.parse(await response.text());
      expect(data).toEqual({});
    });

    it('should map post URLs to metadata', async () => {
      mockGetCollection.mockResolvedValue([
        createMockPost(
          '2024-01-15-test-post',
          'Test Post Title',
          'A test description',
          '## First Heading\n\nContent\n\n## Second Heading',
        ),
      ] as any);

      const response = await GET();
      const data = JSON.parse(await response.text());

      expect(data).toHaveProperty('/2024/01/15/test-post/');
      const meta = data['/2024/01/15/test-post/'];
      expect(meta.title).toBe('Test Post Title');
      expect(meta.description).toBe('A test description');
      expect(meta.headings).toHaveLength(2);
      expect(meta.headings[0].text).toBe('First Heading');
      expect(meta.headings[1].text).toBe('Second Heading');
    });

    it('should handle posts with no body', async () => {
      mockGetCollection.mockResolvedValue([
        createMockPost('2024-01-15-no-body', 'No Body', 'Description', ''),
      ] as any);

      const response = await GET();
      const data = JSON.parse(await response.text());
      expect(data['/2024/01/15/no-body/'].headings).toEqual([]);
    });

    it('should handle posts with undefined body', async () => {
      const post = createMockPost('2024-01-15-undef', 'Undef', 'Desc');
      (post as any).body = undefined;
      mockGetCollection.mockResolvedValue([post] as any);

      const response = await GET();
      const data = JSON.parse(await response.text());
      // body ?? '' should gracefully produce no headings
      expect(data['/2024/01/15/undef/'].headings).toEqual([]);
    });

    it('should include multiple posts keyed by URL', async () => {
      mockGetCollection.mockResolvedValue([
        createMockPost('2024-01-15-first', 'First', 'Desc 1'),
        createMockPost('2024-02-20-second', 'Second', 'Desc 2'),
      ] as any);

      const response = await GET();
      const data = JSON.parse(await response.text());
      expect(Object.keys(data)).toHaveLength(2);
      expect(data).toHaveProperty('/2024/01/15/first/');
      expect(data).toHaveProperty('/2024/02/20/second/');
    });

    it('should pass the published filter to getCollection', async () => {
      mockGetCollection.mockResolvedValue([] as any);
      await GET();

      expect(mockGetCollection).toHaveBeenCalledWith('posts', expect.any(Function));

      // Verify the filter function
      const filterFn = mockGetCollection.mock.calls[0][1] as (entry: any) => boolean;
      expect(filterFn({ data: { published: true } })).toBe(true);
      expect(filterFn({ data: { published: false } })).toBe(false);
      expect(filterFn({ data: {} })).toBe(true); // undefined !== false
    });
  });
});
