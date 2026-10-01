/**
 * Tests for the /bookmarklets/ data and install-link encoding
 */

import { describe, it, expect } from 'vitest';
import { bookmarklets, bookmarkletHref } from './bookmarklets';
import data from './bookmarklets.json';

describe('bookmarklets', () => {
  it('records the bookmarklets commit the vendored code came from', () => {
    expect(data.commit).toMatch(/^[0-9a-f]{40}$/);
  });

  it('lists every vendored bookmarklet exactly once', () => {
    expect(bookmarklets.map(({ id }) => id).sort()).toEqual(Object.keys(data.code).sort());
  });

  it('links each bookmarklet to its source in the monorepo', () => {
    for (const { id, repo } of bookmarklets) {
      expect(repo).toBe(`https://github.com/benbalter/bookmarklets/tree/main/bookmarklets/${id}`);
    }
  });

  it('has vendored code for every bookmarklet', () => {
    for (const bookmarklet of bookmarklets) {
      expect(bookmarklet.code.length, bookmarklet.id).toBeGreaterThan(0);
    }
  });

  it('builds a javascript: href that decodes back to the exact code', () => {
    for (const { code } of bookmarklets) {
      const href = bookmarkletHref(code);
      const scheme = 'javascript:';
      expect(href.slice(0, scheme.length)).toBe(scheme);
      expect(decodeURIComponent(href.slice(scheme.length))).toBe(code);
    }
  });

  it('escapes characters a javascript: URL would otherwise misread', () => {
    expect(bookmarkletHref('a%20b#c')).toBe('javascript:a%2520b%23c');
  });
});
