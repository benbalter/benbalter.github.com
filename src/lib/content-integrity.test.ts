import { describe, it, expect } from 'vitest';
import {
  BULK_POST_THRESHOLD,
  comparePost,
  extractRegions,
  firstDifference,
  hasReviewTrailer,
  isBulk,
  normalize,
  type Finding,
} from './content-integrity';

const md = { before: false, after: false };
const mdx = { before: true, after: true };
const kinds = (findings: Finding[]) => findings.map((f) => f.kind);

const FRONTMATTER = '---\ntitle: Test post\ndescription: A test post\n---\n\n';
const words = (n: number, word = 'prose') => Array.from({ length: n }, () => word).join(' ');

describe('extractRegions', () => {
  it('finds code, inline code, URLs, and blockquotes in Markdown', () => {
    const r = extractRegions(
      `${FRONTMATTER}Some \`inline()\` code and [a link](https://example.com).\n\n` +
        '![alt](/img.png)\n\n> A quoted line\n\n```js\nconst x = 1;\n```\n',
      false,
    );
    expect(r['inline code']).toEqual(['inline()']);
    expect(r.url).toEqual(['https://example.com', '/img.png']);
    expect(r.blockquote).toEqual(['A quoted line']);
    expect(r['code block']).toEqual(['const x = 1;']);
  });

  it('counts prose words only: no front matter, code, URLs, or kramdown attribute lists', () => {
    const r = extractRegions(
      `${FRONTMATTER}One two [three](https://ignored.example/four) five.\n\n\`not counted\`\n\n` +
        '```\nnot counted either\n```\n\n![img](/x.png){: .float-end }\n',
      false,
    );
    expect(r.words).toBe(4);
  });

  it('captures raw HTML scripts and URL attributes in Markdown', () => {
    const r = extractRegions(
      `${FRONTMATTER}<script src="https://gist.github.com/1.js"></script>\n\n<iframe src="https://www.youtube.com/embed/x"></iframe>\n`,
      false,
    );
    expect(r['script/style']).toEqual(['<script src="https://gist.github.com/1.js"></script>']);
    expect(r.url).toEqual(['https://www.youtube.com/embed/x']);
  });

  it('captures JSX scripts and href/src attributes in MDX', () => {
    const r = extractRegions(
      `${FRONTMATTER}<a href="https://example.com">x</a>\n\n<script is:inline>\n{\`go('https://api.github.com/octocat');\`}\n</script>\n`,
      true,
    );
    expect(r.url).toEqual(['https://example.com']);
    expect(r['script/style']).toHaveLength(1);
    expect(r['script/style'][0]).toContain('api.github.com/octocat');
    expect(r.fallback).toBe(false);
  });

  it('falls back to Markdown parsing for invalid MDX instead of throwing', () => {
    const r = extractRegions(`${FRONTMATTER}<!-- an HTML comment is invalid MDX -->\n\n> quote\n`, true);
    expect(r.fallback).toBe(true);
    expect(r.blockquote).toEqual(['quote']);
  });
});

describe('normalize', () => {
  it('straightens curly quotes and collapses whitespace', () => {
    expect(normalize('  it\u2019s \u201Cquoted\u201D\n  text ')).toBe('it\'s "quoted" text');
  });
});

describe('comparePost', () => {
  it('reports nothing for prose-only edits', () => {
    const before = `${FRONTMATTER}The team were happy. See [docs](https://example.com).\n`;
    const after = `${FRONTMATTER}The team was happy. See [docs](https://example.com).\n`;
    expect(comparePost(before, after, md)).toEqual([]);
  });

  it('ignores curly-vs-straight quote changes inside blockquotes', () => {
    const before = `${FRONTMATTER}> It\u2019s here\n`;
    const after = `${FRONTMATTER}> It's here\n`;
    expect(comparePost(before, after, md)).toEqual([]);
  });

  it('does not report additions', () => {
    const before = `${FRONTMATTER}Text.\n`;
    const after = `${FRONTMATTER}Text. \`new\` and [link](https://new.example).\n\n> new quote\n\n\`\`\`\nnew code\n\`\`\`\n`;
    expect(comparePost(before, after, md)).toEqual([]);
  });

  it('reports a deleted post', () => {
    expect(comparePost(`${FRONTMATTER}Text.\n`, null, md)).toEqual([{ kind: 'deleted' }]);
  });

  it('reports a removed URL and a changed code block', () => {
    const before = `${FRONTMATTER}[a](https://a.example)\n\n\`\`\`\nfoo(1)\n\`\`\`\n`;
    const after = `${FRONTMATTER}a\n\n\`\`\`\nfoo(2)\n\`\`\`\n`;
    expect(comparePost(before, after, md)).toEqual([
      { kind: 'code block', before: 'foo(1)', after: 'foo(2)' },
      { kind: 'url', before: 'https://a.example', after: null },
    ]);
  });

  describe('word loss thresholds', () => {
    it('ignores a small percentage loss on a long post', () => {
      // 1000 → 950 words: 50 words but only 5%.
      expect(kinds(comparePost(`${FRONTMATTER}${words(1000)}\n`, `${FRONTMATTER}${words(950)}\n`, md))).toEqual([]);
    });

    it('ignores a large percentage loss of few words', () => {
      // 60 → 30 words: 50% but only 30 words.
      expect(kinds(comparePost(`${FRONTMATTER}${words(60)}\n`, `${FRONTMATTER}${words(30)}\n`, md))).toEqual([]);
    });

    it('flags a loss over both limits', () => {
      expect(comparePost(`${FRONTMATTER}${words(1000)}\n`, `${FRONTMATTER}${words(800)}\n`, md)).toEqual([
        { kind: 'word loss', before: 1000, after: 800 },
      ]);
    });
  });

  // Fixtures reproducing the real incidents that motivated this check.
  describe('historical incidents', () => {
    it('catches a script endpoint rewritten by a copy pass (2e13b67d, Zen of GitHub)', () => {
      const zen = (endpoint: string) =>
        `${FRONTMATTER}<div class="row">\n<div class="col-sm-7">\n  <pre id="zen"></pre>\n</div>\n</div>\n\n` +
        `These aren't mere words.\n\n<script is:inline>\n{\`zen = document.getElementById("zen");\n` +
        `xhr = new XMLHttpRequest();\nxhr.open('GET', 'https://api.github.com/${endpoint}');\nxhr.send();\`}\n</script>\n`;
      const findings = comparePost(zen('octocat'), zen('zen'), mdx);
      expect(kinds(findings)).toEqual(['script/style']);
      const finding = findings[0] as { before: string; after: string };
      expect(firstDifference(finding.before, finding.after)).toEqual({
        before: "xhr.open('GET', 'https://api.github.com/octocat');",
        after: "xhr.open('GET', 'https://api.github.com/zen');",
      });
    });

    it('catches a verb changed inside a quotation (grammar pass)', () => {
      const quote = (verbs: string) =>
        `${FRONTMATTER}As I wrote before:\n\n> [URLs] provide a single source of truth and ${verbs} the reasoning behind the decision.\n`;
      expect(kinds(comparePost(quote('exposes'), quote('expose'), mdx))).toEqual(['blockquote']);
    });

    it('catches a section deleted by a compatibility pass (da5acbb0)', () => {
      const intro = `${FRONTMATTER}## 1. Why it matters\n\n${words(300, 'argument')}\n\n`;
      const lost = `## 2. The part that went missing\n\n${words(400, 'detail')} \`get_bloginfo()\`\n\n<script src="https://gist.github.com/1058469.js"></script>\n`;
      const findings = comparePost(intro + lost, intro, md);
      expect(kinds(findings)).toEqual(['word loss', 'inline code', 'script/style']);
    });
  });
});

describe('firstDifference', () => {
  it('windows long single-line changes around the first difference', () => {
    const prefix = 'x'.repeat(200);
    const diff = firstDifference(`${prefix} exposes the reasoning`, `${prefix} expose the reasoning`);
    expect(diff.before.startsWith('…')).toBe(true);
    expect(diff.before).toContain('exposes');
    expect(diff.after).toContain('expose the');
  });

  it('reports removals', () => {
    expect(firstDifference('\n  gone()\n', null)).toEqual({ before: 'gone()', after: '(removed)' });
  });
});

describe('gating', () => {
  it(`treats ${BULK_POST_THRESHOLD}+ changed posts as a bulk pass`, () => {
    expect(isBulk(BULK_POST_THRESHOLD - 1)).toBe(false);
    expect(isBulk(BULK_POST_THRESHOLD)).toBe(true);
  });

  it('recognizes the review trailer in any commit message', () => {
    expect(hasReviewTrailer('Fix typos\n\nContent-Integrity: reviewed\nCo-Authored-By: x')).toBe(true);
    expect(hasReviewTrailer('fix\n---\ncontent-integrity: Reviewed')).toBe(true);
    expect(hasReviewTrailer('Mentions Content-Integrity: reviewed mid-line')).toBe(false);
    expect(hasReviewTrailer('Fix typos')).toBe(false);
  });
});
