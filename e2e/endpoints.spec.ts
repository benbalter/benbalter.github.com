import { test, expect } from '@playwright/test';

/**
 * Machine-readable endpoints: feeds, llms.txt, Markdown siblings, resume
 * exports, and /.well-known files. Unit tests cover these with mocked
 * collections; this fetches them from a real build to catch routing and
 * rendering breakage. /resume.pdf is skipped because local builds use SKIP_PDF.
 */

const endpoints: Array<{
  path: string;
  contentType: RegExp;
  contains: string | RegExp;
}> = [
  { path: '/feed.xml', contentType: /xml/, contains: '<rss version="2.0"' },
  { path: '/llms.txt', contentType: /text\/plain/, contains: '# Ben Balter' },
  { path: '/index.md', contentType: /markdown|text\/plain/, contains: '# ' },
  { path: '/about.md', contentType: /markdown|text\/plain/, contains: '# ' },
  { path: '/resume.md', contentType: /markdown|text\/plain/, contains: '## Experience' },
  {
    path: '/2014/11/06/rules-of-communicating-at-github.md',
    contentType: /markdown|text\/plain/,
    contains: '# 15 rules for communicating at GitHub',
  },
  { path: '/.well-known/security.txt', contentType: /text\/plain/, contains: 'Contact:' },
];

test.describe('Machine-readable endpoints', () => {
  for (const { path, contentType, contains } of endpoints) {
    test(`${path} returns expected content`, async ({ request }) => {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toMatch(contentType);
      const body = await res.text();
      if (typeof contains === 'string') {
        expect(body).toContain(contains);
      } else {
        expect(body).toMatch(contains);
      }
    });
  }

  test('/resume.docx is a Word document', async ({ request }) => {
    const res = await request.get('/resume.docx');
    expect(res.status()).toBe(200);
    const bytes = await res.body();
    // .docx is a zip archive: "PK\x03\x04".
    expect(bytes.subarray(0, 4).toString('latin1')).toBe('PK\x03\x04');
  });
});
