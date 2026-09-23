/**
 * Tests for posts-meta.json API endpoint
 *
 * This endpoint generates a JSON mapping of post URLs to metadata
 * (title, description, headings) for link previews. Headings come from
 * Astro's render() collector, mocked here per post id.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MarkdownHeading } from 'astro';

const headingsById: Record<string, MarkdownHeading[]> = {};

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
  render: vi.fn(async (entry: { id: string }) => ({ headings: headingsById[entry.id] ?? [] })),
}));

import { getCollection } from 'astro:content';
import { GET, toPreviewHeadings } from '../../pages/posts-meta.json';

const mockGetCollection = vi.mocked(getCollection);

/** Create a minimal mock post matching the shape used by the endpoint */
function createMockPost(
  id: string,
  title: string,
  description: string,
  headings: MarkdownHeading[] = [],
  published = true,
) {
  headingsById[id] = headings;
  return {
    id,
    collection: 'posts' as const,
    data: { title, description, published },
  };
}

describe('posts-meta.json', () => {
  describe('toPreviewHeadings', () => {
    it('keeps depth, slug, and text', () => {
      expect(toPreviewHeadings([{ depth: 2, slug: 'intro', text: 'Intro' }])).toEqual([
        { depth: 2, slug: 'intro', text: 'Intro' },
      ]);
    });

    it('strips the trailing anchor glyph rehype-autolink-headings appends', () => {
      expect(toPreviewHeadings([{ depth: 2, slug: 'intro', text: 'Intro#' }])[0].text).toBe('Intro');
    });

    it('drops the hidden footnotes heading', () => {
      expect(
        toPreviewHeadings([
          { depth: 2, slug: 'intro', text: 'Intro' },
          { depth: 2, slug: 'footnote-label', text: 'Footnotes' },
        ]),
      ).toEqual([{ depth: 2, slug: 'intro', text: 'Intro' }]);
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
        createMockPost('2024-01-15-test-post', 'Test Post Title', 'A test description', [
          { depth: 2, slug: 'first-heading', text: 'First Heading#' },
          { depth: 2, slug: 'second-heading', text: 'Second Heading#' },
        ]),
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

    it('should handle posts with no headings', async () => {
      mockGetCollection.mockResolvedValue([
        createMockPost('2024-01-15-no-headings', 'No Headings', 'Description'),
      ] as any);

      const response = await GET();
      const data = JSON.parse(await response.text());
      expect(data['/2024/01/15/no-headings/'].headings).toEqual([]);
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
