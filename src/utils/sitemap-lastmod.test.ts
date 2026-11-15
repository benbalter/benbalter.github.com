import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

  it('counts a merged pull request as one commit, so a split-up sweep is still skipped', () => {
    const dir = mkdtempSync(join(tmpdir(), 'lastmod-'));
    try {
      const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' };
      const git = (args: string[], date: string) =>
        execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', '-c', 'commit.gpgsign=false', ...args], {
          cwd: dir,
          env: { ...env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date },
          stdio: 'ignore',
        });
      const posts = Array.from({ length: 6 }, (_, i) => `src/content/posts/2020-01-0${i + 1}-p${i}.md`);
      const write = (file: string, text: string) => {
        mkdirSync(join(dir, 'src/content/posts'), { recursive: true });
        writeFileSync(join(dir, file), text);
      };

      git(['init', '-q', '-b', 'main'], '2020-01-01T00:00:00Z');
      posts.forEach((p) => write(p, 'v1'));
      git(['add', '.'], '2020-01-01T00:00:00Z');
      git(['commit', '-qm', 'publish'], '2020-01-01T00:00:00Z');

      // A sweep split into three commits of two posts each, merged as one PR.
      git(['checkout', '-qb', 'sweep'], '2020-02-01T00:00:00Z');
      for (let i = 0; i < 6; i += 2) {
        write(posts[i], 'v2');
        write(posts[i + 1], 'v2');
        git(['commit', '-qam', `sweep ${i}`], '2020-02-01T00:00:00Z');
      }
      git(['checkout', '-q', 'main'], '2020-02-02T00:00:00Z');
      git(['merge', '-q', '--no-ff', '-m', 'merge sweep', 'sweep'], '2020-02-02T00:00:00Z');

      // A deliberate one-post edit, also merged as a PR.
      git(['checkout', '-qb', 'edit'], '2020-03-01T00:00:00Z');
      write(posts[0], 'v3');
      git(['commit', '-qam', 'edit'], '2020-03-01T00:00:00Z');
      git(['checkout', '-q', 'main'], '2020-03-02T00:00:00Z');
      git(['merge', '-q', '--no-ff', '-m', 'merge edit', 'edit'], '2020-03-02T00:00:00Z');

      const index = buildLastmodIndex(dir);
      expect(index.get(posts[0])).toMatch(/^2020-03-02/);
      // Untouched since the sweep: no entry, so lastmodForUrl falls back to the
      // publish date. (The initial commit touches all six, so it's a sweep too.)
      expect(index.has(posts[1])).toBe(false);
      expect(index.has(posts[5])).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
