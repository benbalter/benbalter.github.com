/**
 * Tests for the inline-quote collector.
 *
 * Quotes are authored as `:quote[text]{#id}` directives in post bodies;
 * getQuotes() parses them out of listable posts.
 */

import { describe, it, expect, vi } from 'vitest';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

import type { CollectionEntry } from 'astro:content';
import { getQuotes, resolveQuotes } from './quotes';
import { quoteFontSize } from '../lib/og-image-generator';

function makePost(
  id: string,
  body: string,
  data: Partial<{ title: string; published: boolean; archived: boolean }> = {}
): CollectionEntry<'posts'> {
  return {
    id,
    body,
    collection: 'posts',
    data: {
      title: data.title ?? `Title for ${id}`,
      description: 'desc',
      published: data.published ?? true,
      archived: data.archived ?? false,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

const POST_A = '2016-09-13-seven-habits-of-highly-effective-githubbers';
const POST_B = '2017-05-23-seven-ways-to-consistently-ship-great-features';

describe('getQuotes', () => {
  it('extracts inline :quote directives from post bodies', () => {
    const posts = [
      makePost(
        POST_A,
        'Intro. :quote[You can be professional without being formal.]{#professional-not-formal} Outro.'
      ),
    ];
    const quotes = getQuotes(posts);
    expect(quotes).toEqual([
      {
        id: 'professional-not-formal',
        text: 'You can be professional without being formal.',
        post: POST_A,
      },
    ]);
  });

  it('collects multiple quotes across multiple posts', () => {
    const posts = [
      makePost(POST_A, ':quote[First line.]{#first}'),
      makePost(POST_B, 'x :quote[Second line.]{#second} y'),
    ];
    expect(getQuotes(posts).map((q) => q.id)).toEqual(['first', 'second']);
  });

  it('ignores quotes in non-listable (archived/unpublished) posts', () => {
    const posts = [
      makePost(POST_A, ':quote[Visible.]{#visible}'),
      makePost(POST_B, ':quote[Hidden.]{#hidden}', { archived: true }),
    ];
    expect(getQuotes(posts).map((q) => q.id)).toEqual(['visible']);
  });

  it('throws on a duplicate id across posts', () => {
    const posts = [
      makePost(POST_A, ':quote[One.]{#dupe}'),
      makePost(POST_B, ':quote[Two.]{#dupe}'),
    ];
    expect(() => getQuotes(posts)).toThrow(/Duplicate :quote id "dupe"/);
  });

  it('throws when a quote directive has no id', () => {
    const posts = [makePost(POST_A, ':quote[No id here.]')];
    expect(() => getQuotes(posts)).toThrow(/missing its id/);
  });

  it('throws on a non-kebab-case id', () => {
    const posts = [makePost(POST_A, ':quote[Bad.]{#Not_Kebab}')];
    expect(() => getQuotes(posts)).toThrow(/must be kebab-case/);
  });
});

describe('resolveQuotes', () => {
  it('joins each quote to its source post title and Jekyll URL', () => {
    const posts = [
      makePost(POST_A, ':quote[A line.]{#a-line}', { title: 'Seven Habits' }),
    ];
    expect(resolveQuotes(posts)).toEqual([
      {
        id: 'a-line',
        text: 'A line.',
        post: POST_A,
        postTitle: 'Seven Habits',
        postUrl: '/2016/09/13/seven-habits-of-highly-effective-githubbers/',
      },
    ]);
  });
});

describe('quoteFontSize', () => {
  it('scales down monotonically as length grows', () => {
    const sizes = [10, 60, 100, 160, 240].map(quoteFontSize);
    for (let i = 1; i < sizes.length; i++) {
      expect(sizes[i]).toBeLessThan(sizes[i - 1]);
    }
  });

  it('gives short quotes the hero size and caps long ones', () => {
    expect(quoteFontSize(20)).toBe(66);
    expect(quoteFontSize(500)).toBe(30);
  });
});
