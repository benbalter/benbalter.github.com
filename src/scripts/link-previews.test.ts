import { describe, it, expect, afterEach } from 'vitest';
import { normalizePath, isPostLink, escapeHtml } from './link-previews';

describe('normalizePath', () => {
  it('returns path and empty hash for path with trailing slash', () => {
    expect(normalizePath('/2024/01/15/my-post/')).toEqual({
      path: '/2024/01/15/my-post/',
      hash: '',
    });
  });

  it('adds trailing slash when missing', () => {
    expect(normalizePath('/2024/01/15/my-post')).toEqual({
      path: '/2024/01/15/my-post/',
      hash: '',
    });
  });

  it('extracts hash without leading #', () => {
    expect(normalizePath('/2024/01/15/my-post/#section')).toEqual({
      path: '/2024/01/15/my-post/',
      hash: 'section',
    });
  });

  it('handles path with hash but no trailing slash before fragment', () => {
    expect(normalizePath('/2024/01/15/my-post#heading')).toEqual({
      path: '/2024/01/15/my-post/',
      hash: 'heading',
    });
  });

  it('handles root path', () => {
    expect(normalizePath('/')).toEqual({
      path: '/',
      hash: '',
    });
  });

  it('handles full same-origin URL', () => {
    const origin = window.location.origin;
    expect(normalizePath(`${origin}/2024/01/15/my-post/`)).toEqual({
      path: '/2024/01/15/my-post/',
      hash: '',
    });
  });

  it('handles full URL with hash', () => {
    const origin = window.location.origin;
    expect(normalizePath(`${origin}/2024/01/15/my-post/#heading`)).toEqual({
      path: '/2024/01/15/my-post/',
      hash: 'heading',
    });
  });

  it('resolves relative paths against current origin', () => {
    const result = normalizePath('about');
    expect(result.path).toBe('/about/');
    expect(result.hash).toBe('');
  });

  it('handles empty hash fragment (#)', () => {
    const result = normalizePath('/2024/01/15/my-post/#');
    expect(result.path).toBe('/2024/01/15/my-post/');
    expect(result.hash).toBe('');
  });

  it('handles deeply nested paths', () => {
    expect(normalizePath('/a/b/c/d/e')).toEqual({
      path: '/a/b/c/d/e/',
      hash: '',
    });
  });
});

describe('isPostLink', () => {
  let container: HTMLElement;

  function createAnchor(href: string, parent?: HTMLElement): HTMLAnchorElement {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', href);
    (parent || container).appendChild(anchor);
    return anchor;
  }

  // Set up a fresh container before each test
  // Using manual setup/teardown to avoid beforeEach import when afterEach suffices
  afterEach(() => {
    container?.remove();
    // Reset URL to root so self-link logic doesn't leak between tests
    window.history.pushState({}, '', '/');
  });

  function setup() {
    container = document.createElement('div');
    document.body.appendChild(container);
  }

  it('returns true for a valid internal post link', () => {
    setup();
    const anchor = createAnchor('/2024/01/15/my-post/');
    expect(isPostLink(anchor)).toBe(true);
  });

  it('returns true for a post link without trailing slash', () => {
    setup();
    const anchor = createAnchor('/2024/01/15/my-post');
    expect(isPostLink(anchor)).toBe(true);
  });

  it('returns true for a post link with hash fragment', () => {
    setup();
    const anchor = createAnchor('/2024/01/15/my-post/#heading');
    expect(isPostLink(anchor)).toBe(true);
  });

  it('returns true for a different post when on a post page', () => {
    setup();
    window.history.pushState({}, '', '/2024/01/15/my-post/');
    const anchor = createAnchor('/2023/06/10/other-post/');
    expect(isPostLink(anchor)).toBe(true);
  });

  it('returns false for a non-post page link', () => {
    setup();
    const anchor = createAnchor('/about/');
    expect(isPostLink(anchor)).toBe(false);
  });

  it('returns false for the root path', () => {
    setup();
    const anchor = createAnchor('/');
    expect(isPostLink(anchor)).toBe(false);
  });

  it('returns false for an external link even if it matches the post pattern', () => {
    setup();
    const anchor = createAnchor('https://example.com/2024/01/15/my-post/');
    expect(isPostLink(anchor)).toBe(false);
  });

  it('returns false when href attribute is missing', () => {
    setup();
    const anchor = document.createElement('a');
    container.appendChild(anchor);
    expect(isPostLink(anchor)).toBe(false);
  });

  it('returns false for a link nested inside a .link-preview-card', () => {
    setup();
    const card = document.createElement('div');
    card.className = 'link-preview-card';
    container.appendChild(card);
    const anchor = createAnchor('/2024/01/15/my-post/', card);
    expect(isPostLink(anchor)).toBe(false);
  });

  it('returns false for a self-link to the current page', () => {
    setup();
    window.history.pushState({}, '', '/2024/01/15/my-post/');
    const anchor = createAnchor('/2024/01/15/my-post/');
    expect(isPostLink(anchor)).toBe(false);
  });

  it('returns false for a self-link with hash to the current page', () => {
    setup();
    window.history.pushState({}, '', '/2024/01/15/my-post/');
    // Hash-only links still resolve to the current page path
    const anchor = createAnchor('/2024/01/15/my-post/#section');
    // The path portion matches current page, but hash differs —
    // the function strips hash before comparing, so this is a self-link
    expect(isPostLink(anchor)).toBe(false);
  });

  it('returns false for a URL with non-zero-padded date segments', () => {
    setup();
    // POST_URL_PATTERN requires \d{2} for month and day
    const anchor = createAnchor('/2024/1/5/my-post/');
    expect(isPostLink(anchor)).toBe(false);
  });

  it('returns false for a path that looks similar but has extra segments', () => {
    setup();
    // Pattern starts with ^/ and requires 4-digit year, 2-digit month/day
    const anchor = createAnchor('/blog/2024/01/15/my-post/');
    expect(isPostLink(anchor)).toBe(false);
  });
});

describe('escapeHtml', () => {
  // Note: This is a DOM-based escaper (textContent → innerHTML).
  // It escapes <, >, and & but does NOT escape quotes in text content,
  // unlike the string-based escapeHtml in src/utils/html-escape.ts.

  it('escapes less-than signs', () => {
    expect(escapeHtml('<')).toBe('&lt;');
  });

  it('escapes greater-than signs', () => {
    expect(escapeHtml('>')).toBe('&gt;');
  });

  it('escapes ampersands', () => {
    expect(escapeHtml('&')).toBe('&amp;');
  });

  it('returns empty string for empty input', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('does not alter plain text without special characters', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('escapes a full HTML tag string', () => {
    const result = escapeHtml('<script>alert("xss")</script>');
    expect(result).toContain('&lt;script&gt;');
    expect(result).toContain('&lt;/script&gt;');
    expect(result).not.toContain('<script>');
  });

  it('escapes mixed content with ampersands and angle brackets', () => {
    const result = escapeHtml('A < B & C > D');
    expect(result).toBe('A &lt; B &amp; C &gt; D');
  });
});
