import { describe, it, expect, vi } from 'vitest';
import {
  createPathResolver,
  fetchRumPathCounts,
  parseRedirectsFile,
  pathSkeleton,
  rankPopularPosts,
  selectPopularPostIds,
  GRAPHQL_URL,
} from './popular-posts';

const POST_IDS = [
  '2015-11-12-why-urls',
  '2022-03-17-why-async',
  '2014-10-08-why-government-contractors-should-3-open-source',
  '2020-01-01-equal-not-equal',
];

function mockFetch(body: unknown, status = 200) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;
}

describe('fetchRumPathCounts', () => {
  const base = {
    token: 'test-token',
    accountTag: 'acct',
    host: 'example.com',
    start: new Date('2026-01-01T00:00:00.000Z'),
    end: new Date('2026-01-31T00:00:00.000Z'),
  };

  it('sends the query with auth, filters, and an ISO window', async () => {
    const fetchImpl = mockFetch({ data: { viewer: { accounts: [{ rumPageloadEventsAdaptiveGroups: [] }] } } });
    await fetchRumPathCounts({ ...base, fetchImpl });
    const [url, init] = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0]!;
    expect(url).toBe(GRAPHQL_URL);
    expect(init.headers.Authorization).toBe('Bearer test-token');
    const { query, variables } = JSON.parse(init.body);
    expect(query).toContain('rumPageloadEventsAdaptiveGroups');
    expect(variables).toMatchObject({
      accountTag: 'acct',
      host: 'example.com',
      start: '2026-01-01T00:00:00Z',
      end: '2026-01-31T00:00:00Z',
      countries: ['CN', 'SG'],
      browsers: ['Unknown'],
    });
  });

  it('returns path counts and skips malformed rows', async () => {
    const fetchImpl = mockFetch({
      data: {
        viewer: {
          accounts: [
            {
              rumPageloadEventsAdaptiveGroups: [
                { count: 3, dimensions: { requestPath: '/a/' } },
                { count: 'x', dimensions: { requestPath: '/b/' } },
                { count: 1, dimensions: {} },
              ],
            },
          ],
        },
      },
    });
    expect(await fetchRumPathCounts({ ...base, fetchImpl })).toEqual([{ path: '/a/', count: 3 }]);
  });

  it('throws on GraphQL errors returned with HTTP 200', async () => {
    const fetchImpl = mockFetch({ data: null, errors: [{ message: 'not authorized' }] });
    await expect(fetchRumPathCounts({ ...base, fetchImpl })).rejects.toThrow('not authorized');
  });

  it('throws on HTTP errors', async () => {
    const fetchImpl = mockFetch({}, 403);
    await expect(fetchRumPathCounts({ ...base, fetchImpl })).rejects.toThrow('HTTP 403');
  });

  it('throws when the dataset is missing', async () => {
    const fetchImpl = mockFetch({ data: { viewer: { accounts: [] } } });
    await expect(fetchRumPathCounts({ ...base, fetchImpl })).rejects.toThrow('no rumPageloadEventsAdaptiveGroups');
  });
});

describe('pathSkeleton', () => {
  it('collapses UTF-8 and mojibake encodings of the same path', () => {
    // "≠" percent-encoded vs. its UTF-8 bytes misread as Windows-1252 ("â‰ ")
    expect(pathSkeleton('/2020/01/01/equal-%E2%89%A0-not-equal/')).toBe(
      pathSkeleton('/2020/01/01/equal-%C3%A2%E2%80%B0%20-not-equal/'),
    );
  });

  it('tolerates malformed escapes', () => {
    expect(pathSkeleton('/a/%E2%ZZ/')).toBe('ae2zz');
  });
});

describe('createPathResolver', () => {
  const resolve = createPathResolver(
    POST_IDS,
    new Map([['/2015/11/12/old-why-urls/', '/2015/11/12/why-urls/']]),
  );

  it('matches canonical post URLs, with or without a trailing slash or query', () => {
    expect(resolve('/2015/11/12/why-urls/')).toBe('2015-11-12-why-urls');
    expect(resolve('/2015/11/12/why-urls')).toBe('2015-11-12-why-urls');
    expect(resolve('/2015/11/12/why-urls/?utm_source=x')).toBe('2015-11-12-why-urls');
  });

  it('matches encoding variants by skeleton', () => {
    expect(resolve('/2014/10/08/why-government-contractors-should-%3C3-open-source')).toBe(
      '2014-10-08-why-government-contractors-should-3-open-source',
    );
    expect(resolve('/2020/01/01/equal-%E2%89%A0-not-equal/')).toBe('2020-01-01-equal-not-equal');
    expect(resolve('/2020/01/01/equal-%C3%A2%E2%80%B0%20-not-equal/')).toBe('2020-01-01-equal-not-equal');
  });

  it('follows redirects to posts', () => {
    expect(resolve('/2015/11/12/old-why-urls/')).toBe('2015-11-12-why-urls');
    expect(resolve('/2015/11/12/old-why-urls')).toBe('2015-11-12-why-urls');
  });

  it('ignores non-post paths', () => {
    expect(resolve('/')).toBeNull();
    expect(resolve('/posts/')).toBeNull();
    expect(resolve('/about/')).toBeNull();
    expect(resolve('/2099/01/01/no-such-post/')).toBeNull();
  });

  it('refuses ambiguous skeleton matches', () => {
    const ambiguous = createPathResolver(['2020-01-01-a-b', '2020-01-01-ab']);
    expect(ambiguous('/2020/01/01/a-b/')).toBe('2020-01-01-a-b');
    expect(ambiguous('/2020/01/01/a_b/')).toBeNull();
  });
});

describe('rankPopularPosts', () => {
  it('merges variants, drops non-posts, and ranks by count', () => {
    const ranked = rankPopularPosts(
      [
        { path: '/', count: 100 },
        { path: '/2022/03/17/why-async/', count: 3 },
        { path: '/2015/11/12/why-urls/', count: 2 },
        { path: '/2015/11/12/why-urls', count: 2 },
        { path: '/posts/', count: 50 },
      ],
      POST_IDS,
    );
    expect(ranked).toEqual([
      { id: '2015-11-12-why-urls', url: '/2015/11/12/why-urls/', count: 4 },
      { id: '2022-03-17-why-async', url: '/2022/03/17/why-async/', count: 3 },
    ]);
  });

  it('breaks ties by id, newest first, and honors the limit', () => {
    const ranked = rankPopularPosts(
      [
        { path: '/2015/11/12/why-urls/', count: 1 },
        { path: '/2022/03/17/why-async/', count: 1 },
        { path: '/2020/01/01/equal-not-equal/', count: 1 },
      ],
      POST_IDS,
      { limit: 2 },
    );
    expect(ranked.map((p) => p.id)).toEqual(['2022-03-17-why-async', '2020-01-01-equal-not-equal']);
  });
});

describe('parseRedirectsFile', () => {
  it('keeps simple on-site rules only', () => {
    const map = parseRedirectsFile(
      ['# comment', '', '/old/ /new/ 301', '/q/* /posts/ 301', '/:year/x /y/ 301', '/talks/ https://example.com 301'].join(
        '\n',
      ),
    );
    expect([...map]).toEqual([['/old/', '/new/']]);
  });
});

describe('selectPopularPostIds', () => {
  const data = {
    generatedAt: '2026-01-31T00:00:00Z',
    windowDays: 30,
    source: 'test',
    posts: [
      { id: '2015-11-12-why-urls', url: '/2015/11/12/why-urls/', count: 3 },
      { id: '2099-01-01-gone', url: '/2099/01/01/gone/', count: 2 },
      { id: '2022-03-17-why-async', url: '/2022/03/17/why-async/', count: 1 },
    ],
  };

  it('returns listable ids in rank order', () => {
    expect(selectPopularPostIds(data, POST_IDS)).toEqual(['2015-11-12-why-urls', '2022-03-17-why-async']);
  });

  it('applies exclusions and the limit', () => {
    expect(selectPopularPostIds(data, POST_IDS, { exclude: ['2015-11-12-why-urls'] })).toEqual([
      '2022-03-17-why-async',
    ]);
    expect(selectPopularPostIds(data, POST_IDS, { limit: 1 })).toEqual(['2015-11-12-why-urls']);
  });

  it('returns nothing for missing or malformed data', () => {
    expect(selectPopularPostIds(undefined, POST_IDS)).toEqual([]);
    expect(selectPopularPostIds({}, POST_IDS)).toEqual([]);
    expect(selectPopularPostIds({ posts: [null, { id: 4 }] }, POST_IDS)).toEqual([]);
  });
});
