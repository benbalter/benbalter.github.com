import { describe, it, expect } from 'vitest';
import { checkPostStructure, countSentences, MAX_PULL_QUOTES } from './post-structure';

const FRONTMATTER = '---\ntitle: Test post\ndescription: A test post\n---\n\n';
const words = (n: number, word = 'prose') => Array.from({ length: n }, () => word).join(' ');
const quote = (id: string) => `:quote[A line worth sharing.]{#${id}}`;

describe('checkPostStructure', () => {
  it('passes a well-structured post', () => {
    const post =
      `${FRONTMATTER}${words(200)} ${quote('a')}\n\n` +
      `## Write the claim as the heading\n\n${words(240)} ${quote('b')}\n\n` +
      `## Copy teams, not team members\n\n- **Lead-in.** A list item with a bold lead-in.\n`;
    expect(checkPostStructure(post, false)).toEqual([]);
  });

  describe('label headings', () => {
    it('flags H2 and H3 labels', () => {
      const post = `${FRONTMATTER}## Background\n\nText.\n\n### Key takeaways\n\nText.\n\n## Conclusion:\n\nText.\n`;
      expect(checkPostStructure(post, false)).toEqual([
        'Heading "Background" is a label. Make it a claim a skimmer can act on.',
        'Heading "Key takeaways" is a label. Make it a claim a skimmer can act on.',
        'Heading "Conclusion:" is a label. Make it a claim a skimmer can act on.',
      ]);
    });

    it('leaves headings that only contain a label word alone', () => {
      const post = `${FRONTMATTER}## The summary is the hard part\n\nText.\n\n## Background checks are theater\n\nText.\n`;
      expect(checkPostStructure(post, false)).toEqual([]);
    });
  });

  describe('fake headings', () => {
    it('flags a paragraph that is only bold text', () => {
      const post = `${FRONTMATTER}**Why this matters**\n\nText.\n`;
      expect(checkPostStructure(post, false)).toEqual([
        '"Why this matters" is a bold line standing in for a heading. Use a real ## heading.',
      ]);
    });

    it('leaves bold lead-ins, list items, and long bold notes alone', () => {
      const post =
        `${FRONTMATTER}**Lead-in.** Followed by a sentence.\n\n- **In a list**\n\n` +
        `**Update (2014-06-12): comments have been closed in favor of the project wiki, where support now lives.**\n`;
      expect(checkPostStructure(post, false)).toEqual([]);
    });
  });

  describe('pull quotes', () => {
    it(`flags more than ${MAX_PULL_QUOTES} in a post`, () => {
      const sections = Array.from({ length: 6 }, (_, i) => `## Section ${i}\n\n${quote(`q${i}`)}\n`).join('\n');
      expect(checkPostStructure(`${FRONTMATTER}${sections}`, false)).toEqual([
        '6 pull quotes; keep it to 5 or fewer so each one stands out.',
      ]);
    });

    it('flags two in one section, including the intro', () => {
      const post = `${FRONTMATTER}${quote('a')} ${quote('b')}\n\n## The body\n\n${quote('c')}\n\n${quote('d')}\n`;
      expect(checkPostStructure(post, false)).toEqual([
        '2 pull quotes in the intro; use at most one per section.',
        '2 pull quotes in "The body"; use at most one per section.',
      ]);
    });

    it('counts H3 subsections as part of their H2 section', () => {
      const post = `${FRONTMATTER}## The body\n\n${quote('a')}\n\n### A subsection\n\n${quote('b')}\n`;
      expect(checkPostStructure(post, false)).toEqual(['2 pull quotes in "The body"; use at most one per section.']);
    });

    it('finds quotes in MDX', () => {
      const post = `${FRONTMATTER}import X from './x.astro';\n\n${quote('a')} ${quote('b')}\n\n<X />\n`;
      expect(checkPostStructure(post, true)).toEqual(['2 pull quotes in the intro; use at most one per section.']);
    });
  });

  describe('sparse headings', () => {
    it('flags a long post with too few H2s', () => {
      const post = `${FRONTMATTER}${words(600)}\n\n## Only one heading\n\n${words(600)}\n`;
      expect(checkPostStructure(post, false)).toEqual([
        '1200 words under 1 H2 heading (about 600 words a section). Add a heading every 250 words or so.',
      ]);
    });

    it('leaves short posts and well-sectioned long posts alone', () => {
      const short = `${FRONTMATTER}${words(700)}\n`;
      const sectioned = `${FRONTMATTER}${words(400)}\n\n## One\n\n${words(400)}\n\n## Two\n\n${words(400)}\n`;
      expect(checkPostStructure(short, false)).toEqual([]);
      expect(checkPostStructure(sectioned, false)).toEqual([]);
    });

    it("doesn't count code toward the word total", () => {
      const post = `${FRONTMATTER}${words(300)}\n\n\`\`\`text\n${words(2000)}\n\`\`\`\n`;
      expect(checkPostStructure(post, false)).toEqual([]);
    });
  });

  describe('tldr', () => {
    it('flags one sentence or more than three', () => {
      expect(checkPostStructure(FRONTMATTER, false, { tldr: 'Just one sentence.' })).toEqual([
        'tldr is 1 sentence; aim for two or three.',
      ]);
      expect(checkPostStructure(FRONTMATTER, false, { tldr: 'One. Two. Three. Four.' })).toEqual([
        'tldr is 4 sentences; aim for two or three.',
      ]);
    });

    it('flags a tldr that repeats the description', () => {
      const description = 'Write it down. Then link to it.';
      expect(checkPostStructure(FRONTMATTER, false, { description, tldr: 'Write it down.  Then link to it.' })).toEqual([
        'tldr repeats description. Give each its own job: the description earns the click, the tldr states the thesis and the action.',
      ]);
    });

    it('leaves a missing or two-to-three-sentence tldr alone', () => {
      expect(checkPostStructure(FRONTMATTER, false, {})).toEqual([]);
      expect(checkPostStructure(FRONTMATTER, false, { tldr: 'State the thesis. Then the action.' })).toEqual([]);
    });
  });
});

describe('countSentences', () => {
  it('counts sentences ending in . ! or ?', () => {
    expect(countSentences('One. Two! Three?')).toBe(3);
  });

  it("doesn't split on a period inside a word or number", () => {
    expect(countSentences('Node.js 22.1 shipped. It works.')).toBe(2);
  });

  it('counts unterminated text as zero', () => {
    expect(countSentences('no punctuation here')).toBe(0);
  });
});
