/**
 * Tests for the /bookmarklets/ data and install-link encoding
 */

import { describe, it, expect } from 'vitest';
import { bookmarklets, bookmarkletHref } from './bookmarklets';

describe('bookmarklets', () => {
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
