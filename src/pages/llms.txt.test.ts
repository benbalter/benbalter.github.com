/**
 * Tests for llms.txt API endpoint
 *
 * This endpoint generates a plain-text file for AI assistants with site
 * information, recent posts, and resource links.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

import { getCollection } from 'astro:content';
import { siteConfig } from '../config';

const mockGetCollection = vi.mocked(getCollection);

/** Create a minimal mock post */
function createMockPost(
  id: string,
  title: string,
  description: string,
  extra: Record<string, unknown> = {},
) {
  return {
    id,
    collection: 'posts' as const,
    data: { title, description, published: true, ...extra },
    body: 'Post body content',
  };
}

/** Create a minimal mock page */
function createMockPage(
  id: string,
  title: string,
  description: string,
  permalink: string,
) {
  return {
    id,
    collection: 'pages' as const,
    data: { title, description, permalink, published: true },
    body: '',
  };
}

// Lazily import the module under test after mocks are set up
async function importGET() {
  // Dynamic import ensures vi.mock has been applied
  const mod = await import('./llms.txt');
  return mod.GET;
}

describe('llms.txt', () => {
  beforeEach(() => {
    mockGetCollection.mockReset();
  });

  /** Helper: set up default mocks and call GET */
  async function callGET(
    posts: ReturnType<typeof createMockPost>[] = [],
    pages: ReturnType<typeof createMockPage>[] = [],
  ) {
    mockGetCollection.mockImplementation(async (collection: any) => {
      if (collection === 'posts') return posts as any;
      if (collection === 'pages') return pages as any;
      return [] as any;
    });

    const GET = await importGET();
    return GET({} as any);
  }

  it('should return a 200 response', async () => {
    const response = await callGET();
    expect(response.status).toBe(200);
  });

  it('should return text/plain content type', async () => {
    const response = await callGET();
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
  });

  it('should start with the site name as a heading', async () => {
    const response = await callGET();
    const text = await response.text();
    expect(text).toMatch(new RegExp(`^# ${siteConfig.name}`));
  });

  it('should contain the site description as a blockquote', async () => {
    const response = await callGET();
    const text = await response.text();
    expect(text).toContain(`> ${siteConfig.description}`);
  });

  it('should contain the About and Professional Information section', async () => {
    const response = await callGET();
    const text = await response.text();
    expect(text).toContain('## About and Professional Information');
    expect(text).toContain(`${siteConfig.url}/about/`);
    expect(text).toContain(`${siteConfig.url}/contact/`);
  });

  it('should contain the Recent Blog Posts section', async () => {
    const posts = [
      createMockPost('2024-06-01-recent-post', 'Recent Post', 'A recent post description'),
    ];
    const response = await callGET(posts);
    const text = await response.text();
    expect(text).toContain('## Recent Blog Posts');
    expect(text).toContain('Recent Post');
    expect(text).toContain('/2024/06/01/recent-post/');
    expect(text).toContain('A recent post description');
  });

  it('should contain the Site Information section', async () => {
    const response = await callGET();
    const text = await response.text();
    expect(text).toContain('## Site Information');
    expect(text).toContain('RSS Feed');
    expect(text).toContain('feed.xml');
    expect(text).toContain('Site Source Code');
    expect(text).toContain('Fine Print');
  });

  it('should include the resume link when a resume page exists', async () => {
    const pages = [
      createMockPage('resume', 'Resume', 'Professional resume', '/resume/'),
    ];
    const response = await callGET([], pages);
    const text = await response.text();
    expect(text).toContain('Resume');
    expect(text).toContain('/resume/');
  });

  it('should limit to 10 recent posts', async () => {
    const posts = Array.from({ length: 15 }, (_, i) => {
      const day = String(i + 1).padStart(2, '0');
      return createMockPost(
        `2024-01-${day}-post-${i}`,
        `Post ${i}`,
        `Description ${i}`,
      );
    });
    const response = await callGET(posts);
    const text = await response.text();

    // Should include the 10 most recent, sorted newest first
    expect(text).toContain('Post 14'); // Jan 15 (newest)
    expect(text).toContain('Post 5');  // Jan 6 (10th newest)
    expect(text).not.toContain('Post 4'); // Jan 5 (11th, excluded)
  });

  it('should sort posts by date with newest first', async () => {
    const posts = [
      createMockPost('2024-01-01-older', 'Older Post', 'Older'),
      createMockPost('2024-06-15-newer', 'Newer Post', 'Newer'),
      createMockPost('2024-03-10-middle', 'Middle Post', 'Middle'),
    ];
    const response = await callGET(posts);
    const text = await response.text();

    const newerIdx = text.indexOf('Newer Post');
    const middleIdx = text.indexOf('Middle Post');
    const olderIdx = text.indexOf('Older Post');
    expect(newerIdx).toBeLessThan(middleIdx);
    expect(middleIdx).toBeLessThan(olderIdx);
  });

  it('should show GitHub Culture section when culture post exists', async () => {
    const cultureId = '2021-02-01-what-to-read-before-starting-or-interviewing-at-github';
    const linkedId = '2020-01-01-linked-post';
    const posts = [
      createMockPost(cultureId, 'Culture Post', 'Culture description', {
        posts: ['/2020/01/01/linked-post/'],
        roles: [],
      }),
      createMockPost(linkedId, 'Linked Post', 'Linked description'),
    ];
    const response = await callGET(posts);
    const text = await response.text();

    expect(text).toContain('## GitHub Culture');
    expect(text).toContain('Culture Post');
    expect(text).toContain('Linked Post');
  });

  it('should handle empty collections gracefully', async () => {
    const response = await callGET([], []);
    const text = await response.text();

    // Should still have the basic structure
    expect(text).toContain(`# ${siteConfig.name}`);
    expect(text).toContain('## Recent Blog Posts');
    expect(text).toContain('## Site Information');
    // No GitHub Culture section when no culture post exists
    expect(text).not.toContain('## GitHub Culture');
  });
});
