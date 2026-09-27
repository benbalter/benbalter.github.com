import { describe, it, expect } from 'vitest';
import {
  entryUrl,
  sitemapExclusions,
  frontMatterRedirects,
  formatRedirects,
  redirectSources,
  loadRoutedEntries,
  type RoutedEntry,
} from './front-matter-routes';

const post = (id: string, data: RoutedEntry['data'] = {}): RoutedEntry => ({ collection: 'posts', id, data });
const page = (id: string, data: RoutedEntry['data'] = {}): RoutedEntry => ({ collection: 'pages', id, data });

describe('entryUrl', () => {
  it('maps posts to /YYYY/MM/DD/slug/', () => {
    expect(entryUrl(post('2014-11-06-rules-of-communicating'))).toBe('/2014/11/06/rules-of-communicating/');
  });

  it('uses a page permalink when set', () => {
    expect(entryUrl(page('resume', { permalink: '/resume/' }))).toBe('/resume/');
  });

  it('falls back to /id/ for pages without a permalink', () => {
    expect(entryUrl(page('fine-print'))).toBe('/fine-print/');
  });
});

describe('sitemapExclusions', () => {
  it('returns only entries with sitemap: false', () => {
    const entries = [
      post('2020-01-01-hidden', { sitemap: false }),
      post('2020-01-02-shown', { sitemap: true }),
      page('about'),
      page('secret', { sitemap: false, permalink: '/secret-page/' }),
    ];
    expect(sitemapExclusions(entries)).toEqual(['/2020/01/01/hidden/', '/secret-page/']);
  });

  it('excludes redirect_to entries, since their URL 301s', () => {
    expect(sitemapExclusions([post('2012-04-23-syndicated', { redirect_to: 'https://example.com/' })])).toEqual([
      '/2012/04/23/syndicated/',
    ]);
  });

  it('ignores truthy non-boolean values', () => {
    expect(sitemapExclusions([page('x', { sitemap: 'false' })])).toEqual([]);
  });
});

describe('frontMatterRedirects', () => {
  it('turns redirect_from (string or array) into rules pointing at the entry URL', () => {
    const entries = [
      post('2014-11-06-rules', { redirect_from: '/2014/11/03/rules/' }),
      page('reading', { permalink: '/reading/', redirect_from: ['/books/', '/cv/'] }),
    ];
    expect(frontMatterRedirects(entries)).toEqual([
      { source: '/2014/11/03/rules/', destination: '/2014/11/06/rules/', status: 301 },
      { source: '/books/', destination: '/reading/', status: 301 },
      { source: '/cv/', destination: '/reading/', status: 301 },
    ]);
  });

  it('turns redirect_to into a rule from the entry URL', () => {
    expect(frontMatterRedirects([post('2012-04-23-syndicated', { redirect_to: 'https://example.com/a/' })])).toEqual([
      { source: '/2012/04/23/syndicated/', destination: 'https://example.com/a/', status: 301 },
    ]);
  });

  it('throws when redirect_from shadows another entry', () => {
    const entries = [post('2020-01-01-a', { redirect_from: '/2020/01/02/b/' }), post('2020-01-02-b')];
    expect(() => frontMatterRedirects(entries)).toThrow(/shadows an existing page/);
  });

  it('returns nothing for entries without redirect fields', () => {
    expect(frontMatterRedirects([post('2020-01-01-a'), page('about')])).toEqual([]);
  });
});

describe('formatRedirects', () => {
  it('emits both trailing-slash forms for directory-style sources', () => {
    expect(formatRedirects([{ source: '/books/', destination: '/reading/', status: 301 }])).toEqual([
      '/books/ /reading/ 301',
      '/books /reading/ 301',
    ]);
  });

  it('leaves file-style sources alone', () => {
    expect(formatRedirects([{ source: '/feed.rss', destination: '/feed.xml', status: 301 }])).toEqual([
      '/feed.rss /feed.xml 301',
    ]);
  });
});

describe('redirectSources', () => {
  it('lists sources, skipping comments and blank lines', () => {
    const contents = '# comment\n\n/a /b 301\n  /c https://x.test/ 301\n';
    expect(redirectSources(contents)).toEqual(['/a', '/c']);
  });
});

describe('loadRoutedEntries (real content)', () => {
  const entries = loadRoutedEntries();

  it('loads posts and pages', () => {
    expect(entries.some((e) => e.collection === 'posts')).toBe(true);
    expect(entries.some((e) => e.collection === 'pages')).toBe(true);
  });

  it('produces redirects with unique sources that never shadow a page', () => {
    const sources = formatRedirects(frontMatterRedirects(entries)).map((line) => line.split(' ')[0]);
    expect(new Set(sources).size).toBe(sources.length);
  });
});
