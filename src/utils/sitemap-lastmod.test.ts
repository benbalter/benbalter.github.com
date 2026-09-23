import { describe, it, expect } from 'vitest';
import { parseGitLog, sourcesForUrl, lastmodForUrl, buildLastmodIndex } from './sitemap-lastmod';

const SITE = 'https://ben.balter.com';

describe('parseGitLog', () => {
  it('keeps the newest date per file (log output is newest first)', () => {
    const output = [
      '\0' + '2026-09-20T10:00:00-04:00',
      '',
      'src/content/posts/2020-01-01-a.md',
      '\0' + '2026-01-05T10:00:00-05:00',
      '',
      'src/content/posts/2020-01-01-a.md',
      'src/content/pages/resume.md',
    ].join('\n');

    const index = parseGitLog(output);
    expect(index.get('src/content/posts/2020-01-01-a.md')).toBe('2026-09-20T10:00:00-04:00');
    expect(index.get('src/content/pages/resume.md')).toBe('2026-01-05T10:00:00-05:00');
  });

  it('skips sweep commits that touch more posts than the threshold', () => {
    const output = [
      '\0' + '2026-08-01T00:00:00Z',
      'src/content/posts/2020-01-01-a.md',
      'src/content/posts/2020-01-02-b.md',
      'src/content/posts/2020-01-03-c.md',
      '\0' + '2024-05-01T00:00:00Z',
      'src/content/posts/2020-01-01-a.md',
    ].join('\n');

    const index = parseGitLog(output, 2);
    expect(index.get('src/content/posts/2020-01-01-a.md')).toBe('2024-05-01T00:00:00Z');
    expect(index.has('src/content/posts/2020-01-02-b.md')).toBe(false);
  });

  it('returns an empty map for empty output', () => {
    expect(parseGitLog('').size).toBe(0);
  });
});

describe('sourcesForUrl', () => {
  it('maps a post URL to its dated .md and .mdx source', () => {
    expect(sourcesForUrl(`${SITE}/2021/03/05/some-post/`)).toEqual([
      'src/content/posts/2021-03-05-some-post.md',
      'src/content/posts/2021-03-05-some-post.mdx',
    ]);
  });

  it('maps the résumé to its page entry and every position', () => {
    expect(sourcesForUrl(`${SITE}/resume/`)).toEqual([
      'src/content/pages/resume.md',
      'src/content/resume-positions/',
    ]);
  });

  it('maps a top-level page to its content entry', () => {
    expect(sourcesForUrl(`${SITE}/other-recommended-reading/`)).toContain(
      'src/content/pages/other-recommended-reading.md',
    );
  });

  it('returns nothing for the homepage, where there is no single source', () => {
    expect(sourcesForUrl(`${SITE}/`)).toEqual([]);
  });
});

describe('lastmodForUrl', () => {
  const index = new Map([
    ['src/content/posts/2021-03-05-some-post.mdx', '2025-06-01T00:00:00Z'],
    ['src/content/pages/resume.md', '2026-01-01T00:00:00Z'],
    ['src/content/resume-positions/owner.md', '2026-09-17T00:00:00Z'],
    ['src/content/resume-positions/swat-team.md', '2026-02-01T00:00:00Z'],
  ]);

  it('finds a post by either extension', () => {
    expect(lastmodForUrl(`${SITE}/2021/03/05/some-post/`, index)).toBe('2025-06-01T00:00:00Z');
  });

  it('takes the newest date across a directory of sources', () => {
    expect(lastmodForUrl(`${SITE}/resume/`, index)).toBe('2026-09-17T00:00:00Z');
  });

  it('falls back to the publish date for a post with no qualifying edit', () => {
    expect(lastmodForUrl(`${SITE}/2012/04/10/untouched/`, index)).toBe('2012-04-10');
  });

  it('omits lastmod rather than guessing when a non-post URL has no known source', () => {
    expect(lastmodForUrl(`${SITE}/`, index)).toBeUndefined();
    expect(lastmodForUrl(`${SITE}/about/`, index)).toBeUndefined();
  });

  it('omits lastmod everywhere without git history, even for posts', () => {
    expect(lastmodForUrl(`${SITE}/2012/04/10/untouched/`, new Map())).toBeUndefined();
  });
});

describe('buildLastmodIndex', () => {
  it('returns an empty index outside a git repository instead of throwing', () => {
    expect(buildLastmodIndex('/').size).toBe(0);
  });
});
