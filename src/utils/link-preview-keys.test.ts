import { describe, it, expect } from 'vitest';
import { externalPreviewKey, githubRepoKey, parseWaybackUrl, wikipediaKey } from './link-preview-keys';

describe('githubRepoKey', () => {
  it('keys a repo root link, lowercased', () => {
    expect(githubRepoKey('https://github.com/benbalter/Word-to-Markdown')).toBe('github:benbalter/word-to-markdown');
  });

  it('treats a trailing slash, #readme, and .git as the repo root', () => {
    expect(githubRepoKey('https://github.com/jekyll/jekyll/')).toBe('github:jekyll/jekyll');
    expect(githubRepoKey('https://github.com/jekyll/jekyll#readme')).toBe('github:jekyll/jekyll');
    expect(githubRepoKey('https://github.com/jekyll/jekyll.git')).toBe('github:jekyll/jekyll');
  });

  it('ignores deeper links, profiles, and site pages', () => {
    expect(githubRepoKey('https://github.com/jekyll/jekyll/issues/1')).toBeNull();
    expect(githubRepoKey('https://github.com/benbalter')).toBeNull();
    expect(githubRepoKey('https://github.com/blog/1234-some-post')).toBeNull();
    expect(githubRepoKey('https://github.com/features/actions')).toBeNull();
  });

  it('ignores other hosts', () => {
    expect(githubRepoKey('https://gist.github.com/benbalter/abc')).toBeNull();
    expect(githubRepoKey('https://example.com/jekyll/jekyll')).toBeNull();
  });
});

describe('wikipediaKey', () => {
  it('decodes percent-encoding so both spellings share a key', () => {
    expect(wikipediaKey('https://en.wikipedia.org/wiki/Lock_%28computer_science%29'))
      .toBe('wikipedia:Lock_(computer_science)');
    expect(wikipediaKey('https://en.wikipedia.org/wiki/Lock_(computer_science)'))
      .toBe('wikipedia:Lock_(computer_science)');
  });

  it('drops the fragment and capitalizes the first letter', () => {
    expect(wikipediaKey('https://en.wikipedia.org/wiki/inverted_pyramid#History'))
      .toBe('wikipedia:Inverted_pyramid');
  });

  it('accepts mobile links', () => {
    expect(wikipediaKey('https://en.m.wikipedia.org/wiki/Bikeshedding')).toBe('wikipedia:Bikeshedding');
  });

  it('skips namespaced pages and other languages', () => {
    expect(wikipediaKey('https://en.wikipedia.org/wiki/File:Example.png')).toBeNull();
    expect(wikipediaKey('https://de.wikipedia.org/wiki/Berlin')).toBeNull();
    expect(wikipediaKey('https://en.wikipedia.org/w/index.php?title=Foo')).toBeNull();
  });
});

describe('externalPreviewKey', () => {
  it('returns null for unrelated links', () => {
    expect(externalPreviewKey('/2024/01/15/my-post/')).toBeNull();
    expect(externalPreviewKey('https://example.com/')).toBeNull();
  });
});

describe('parseWaybackUrl', () => {
  it('parses the capture time in UTC and the original URL', () => {
    const snapshot = parseWaybackUrl('https://web.archive.org/web/20111222235959/http://www.whitehouse.gov/blog/');
    expect(snapshot?.captured.toISOString()).toBe('2011-12-22T23:59:59.000Z');
    expect(snapshot?.original).toBe('http://www.whitehouse.gov/blog/');
  });

  it('keeps the original query string', () => {
    expect(parseWaybackUrl('https://web.archive.org/web/20140720040651/http://dotgov-browser.herokuapp.com/domains?cms=wordpress')?.original)
      .toBe('http://dotgov-browser.herokuapp.com/domains?cms=wordpress');
  });

  it('accepts modifiers and partial timestamps', () => {
    expect(parseWaybackUrl('https://web.archive.org/web/20140301id_/http://example.com/')?.captured.toISOString())
      .toBe('2014-03-01T00:00:00.000Z');
    expect(parseWaybackUrl('https://web.archive.org/web/2014/https://example.com/')?.captured.getUTCFullYear()).toBe(2014);
  });

  it('repairs a collapsed scheme slash and a missing scheme', () => {
    expect(parseWaybackUrl('https://web.archive.org/web/20140301000000/http:/example.com/')?.original).toBe('http://example.com/');
    expect(parseWaybackUrl('https://web.archive.org/web/20140301000000/example.com/')?.original).toBe('http://example.com/');
  });

  it('rejects wildcard searches and other hosts', () => {
    expect(parseWaybackUrl('https://web.archive.org/web/2014*/example.com')).toBeNull();
    expect(parseWaybackUrl('https://archive.org/details/foo')).toBeNull();
  });
});
