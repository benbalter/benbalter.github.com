/**
 * Tests for feed.xml API endpoint
 *
 * This endpoint generates an RSS 2.0 feed of blog posts.
 * Heavily depends on external libraries, so we mock them and verify
 * the GET function constructs the correct RSS options.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Hoist mock functions so they can be referenced in vi.mock factories
const mockRender = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ code: '<p>Rendered HTML</p>' }),
);
const mockRss = vi.hoisted(() =>
  vi.fn((..._args: any[]) => new Response('<?xml version="1.0" encoding="UTF-8"?><rss></rss>')),
);

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

vi.mock('@astrojs/rss', () => ({
  default: mockRss,
}));

vi.mock('@astrojs/markdown-remark', () => ({
  createMarkdownProcessor: vi.fn().mockResolvedValue({
    render: mockRender,
  }),
}));

vi.mock('../lib/markdown-pipeline', () => ({
  sharedRemarkPlugins: [],
  sharedRehypePlugins: [],
  sharedShikiConfig: {},
}));

import { getCollection } from 'astro:content';
import { GET } from './feed.xml';
import { siteConfig } from '../config';

const mockGetCollection = vi.mocked(getCollection);

/** Create a minimal mock post for the feed endpoint */
function createMockPost(
  id: string,
  title: string,
  description: string,
  body = 'Post body',
) {
  return {
    id,
    collection: 'posts' as const,
    data: { title, description, published: true },
    body,
  };
}

/** Build a minimal APIContext stub */
function createContext(siteUrl = 'https://ben.balter.com/') {
  return {
    site: new URL(siteUrl),
    request: new Request(`${siteUrl}feed.xml`),
    url: new URL(`${siteUrl}feed.xml`),
    params: {},
  } as any;
}

describe('feed.xml', () => {
  beforeEach(() => {
    mockGetCollection.mockReset();
    mockRss.mockClear();
    mockRender.mockClear();
    mockRender.mockResolvedValue({ code: '<p>Rendered HTML</p>' });
  });

  it('should call getCollection with a published filter', async () => {
    mockGetCollection.mockResolvedValue([] as any);
    await GET(createContext());

    expect(mockGetCollection).toHaveBeenCalledWith('posts', expect.any(Function));

    const filterFn = mockGetCollection.mock.calls[0][1] as (entry: any) => boolean;
    expect(filterFn({ data: { published: true } })).toBe(true);
    expect(filterFn({ data: { published: false } })).toBe(false);
    expect(filterFn({ data: {} })).toBe(true); // undefined !== false
  });

  it('should pass correct site metadata to rss()', async () => {
    mockGetCollection.mockResolvedValue([] as any);
    await GET(createContext());

    expect(mockRss).toHaveBeenCalledTimes(1);
    const options = mockRss.mock.calls[0][0] as any;
    expect(options.title).toBe(siteConfig.name);
    expect(options.description).toBe(siteConfig.description);
    expect(options.site).toBe('https://ben.balter.com');
  });

  it('should use context.site for the base URL', async () => {
    mockGetCollection.mockResolvedValue([] as any);
    await GET(createContext('https://custom.example.com/'));

    const options = mockRss.mock.calls[0][0] as any;
    expect(options.site).toBe('https://custom.example.com');
  });

  it('should fall back to siteConfig.url when context.site is undefined', async () => {
    mockGetCollection.mockResolvedValue([] as any);
    await GET({ site: undefined } as any);

    const options = mockRss.mock.calls[0][0] as any;
    expect(options.site).toBe(siteConfig.url);
  });

  it('should build items with correct fields', async () => {
    mockGetCollection.mockResolvedValue([
      createMockPost('2024-06-15-my-post', 'My Post', 'Post description', '# Hello'),
    ] as any);

    await GET(createContext());

    const options = mockRss.mock.calls[0][0] as any;
    expect(options.items).toHaveLength(1);

    const item = options.items[0];
    expect(item.title).toBe('My Post');
    expect(item.description).toBe('Post description');
    expect(item.content).toBe('<p>Rendered HTML</p>');
    expect(item.link).toBe('https://ben.balter.com/2024/06/15/my-post/');
    expect(item.author).toBe(siteConfig.email);
    expect(item.pubDate).toBeInstanceOf(Date);
  });

  it('should sort posts by date with newest first', async () => {
    mockGetCollection.mockResolvedValue([
      createMockPost('2024-01-01-old', 'Old', 'Old post'),
      createMockPost('2024-06-15-new', 'New', 'New post'),
      createMockPost('2024-03-10-mid', 'Mid', 'Mid post'),
    ] as any);

    await GET(createContext());

    const options = mockRss.mock.calls[0][0] as any;
    const titles = options.items.map((i: any) => i.title);
    expect(titles).toEqual(['New', 'Mid', 'Old']);
  });

  it('should limit to 20 items', async () => {
    const posts = Array.from({ length: 25 }, (_, i) => {
      const day = String(i + 1).padStart(2, '0');
      return createMockPost(`2024-01-${day}-post-${i}`, `Post ${i}`, `Desc ${i}`);
    });
    mockGetCollection.mockResolvedValue(posts as any);

    await GET(createContext());

    const options = mockRss.mock.calls[0][0] as any;
    expect(options.items).toHaveLength(20);
  });

  it('should render markdown for each post', async () => {
    mockGetCollection.mockResolvedValue([
      createMockPost('2024-01-01-a', 'A', 'Desc A', 'Body A'),
      createMockPost('2024-01-02-b', 'B', 'Desc B', 'Body B'),
    ] as any);

    await GET(createContext());

    // render should be called once per post
    expect(mockRender).toHaveBeenCalledTimes(2);
    expect(mockRender).toHaveBeenCalledWith('Body A', expect.objectContaining({ frontmatter: expect.any(Object) }));
    expect(mockRender).toHaveBeenCalledWith('Body B', expect.objectContaining({ frontmatter: expect.any(Object) }));
  });

  it('should handle empty collection', async () => {
    mockGetCollection.mockResolvedValue([] as any);
    await GET(createContext());

    const options = mockRss.mock.calls[0][0] as any;
    expect(options.items).toEqual([]);
  });
});
