import { describe, it, expect, vi } from 'vitest';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

import { getCollection } from 'astro:content';
import { GET } from '../../pages/book.json';
import { siteConfig } from '../../config';
import { BOOK_RELATION_NOTES, type BookInfo } from '../../lib/book-cta';

function post(id: string, title: string, bookRelation?: string) {
  return { id, data: { title, date: new Date(id.slice(0, 10)), bookRelation } };
}

describe('book.json', () => {
  it('describes the book from config and lists only posts tied to it', async () => {
    vi.mocked(getCollection).mockImplementation((async (_name: string, filter?: (e: unknown) => boolean) => {
      const posts = [
        post('2020-01-01-adapted-post', 'Adapted', 'adapted'),
        post('2021-01-01-plain-post', 'Plain'),
        post('2022-01-01-inspired-post', 'Inspired', 'inspired'),
      ];
      return filter ? posts.filter(filter) : posts;
    }) as never);

    const res = await GET({} as never);
    expect(res.headers.get('Content-Type')).toBe('application/json');
    const book = (await res.json()) as BookInfo;

    expect(book.title).toBe(siteConfig.bookTitle);
    expect(book.url).toBe(siteConfig.bookUrlAgent);
    expect(book.price).toEqual({ ebook: siteConfig.bookPrice, paperback: siteConfig.bookPricePaperback });
    expect(book.posts.map((p) => p.title).sort()).toEqual(['Adapted', 'Inspired']);
    const adapted = book.posts.find((p) => p.title === 'Adapted');
    expect(adapted).toEqual({
      url: `${siteConfig.url}/2020/01/01/adapted-post/`,
      title: 'Adapted',
      relation: 'adapted',
      note: BOOK_RELATION_NOTES.adapted,
    });
  });
});

describe('BOOK_RELATION_NOTES', () => {
  it('names the book in every note and stays free of sales copy', () => {
    for (const note of Object.values(BOOK_RELATION_NOTES)) {
      expect(note).toContain(siteConfig.bookTitle);
      expect(note).not.toMatch(/buy|\$|now|!/i);
    }
  });
});
