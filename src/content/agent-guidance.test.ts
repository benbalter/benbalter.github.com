/**
 * Keeps the writing guidance for AI agents in one place.
 *
 * Ben's full style guide is the private `writing-style` skill. This public
 * repository can't vendor it, so it keeps one short summary of the voice in
 * src/content/CLAUDE.md, and the `writing` agent (.github/agents/writing.md,
 * read by GitHub Copilot and, through a symlink, Claude Code) points at both.
 *
 * The agent file used to carry its own 500-line copy of the guide. Nothing
 * checked it, so it drifted until it contradicted the skill: numbered
 * footnotes, "Picture this" openers, a "## Conclusion" template. These tests
 * fail if that copy grows back, or if the summary loses a rule the agent file
 * now relies on it for.
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { dirname, join, resolve } from 'path';

const root = process.cwd();
const agentPath = join(root, '.github', 'agents', 'writing.md');
const summaryPath = join(root, 'src', 'content', 'CLAUDE.md');
const agent = readFileSync(agentPath, 'utf-8');
const summary = readFileSync(summaryPath, 'utf-8');

/** Room for the pointers, a workflow, and a checklist, but not a style guide. */
const MAX_AGENT_LINES = 60;

/** Advice the old copy gave that the skill and the summary reject. */
const CONTRADICTIONS: [string, RegExp][] = [
  ['numbered footnotes (name them by topic)', /\[\^\d+\]/],
  ['the "Picture this" opener', /picture this/i],
  ['a "Conclusion" label heading', /^#+\s*conclusion\s*$/im],
  ['"As I mentioned in" link phrasing', /as i (mentioned|wrote) in|i've written before about/i],
  ['expanding acronyms on first use (the site uses src/data/acronyms.yml)', /expand acronyms/i],
  ['"acknowledge alternative perspectives" (answer the strongest objection once)', /alternative perspectives/i],
  ['a spaced hyphen after a bold lead-in', /\*\*\s+-\s+\S/],
];

/** Rules the agent file no longer states, so the summary has to. */
const SUMMARY_RULES: [string, RegExp][] = [
  ['the em dash ban', /em dashes[^\n]*banned/i],
  ['the objection callout', /:::objection\[/],
  ['footnotes named by topic', /name footnotes by topic/i],
  ['no bold as a heading', /never use bold as a heading/i],
  ['pull quotes', /:quote\[/],
  ['structural tells', /structural tells/i],
  ['acronyms through the glossary', /acronyms\.yml/],
];

describe('writing agent', () => {
  it('sends Claude Code to the writing-style skill and everyone to the summary', () => {
    // Preloaded through the frontmatter, with the body as the fallback when
    // Claude Code skips a skill that isn't installed.
    expect(agent).toMatch(/^skills:\n\s+- writing-style$/m);
    expect(agent).toMatch(/load the `writing-style` skill/);
    expect(agent).toContain('](../../src/content/CLAUDE.md)');
  });

  it('links only to files that exist', () => {
    const links = [...agent.matchAll(/\]\((\.[^)#]+)/g)].map(match => match[1]);
    expect(links.length).toBeGreaterThan(0);
    links.forEach(link => {
      expect(existsSync(resolve(dirname(agentPath), link)), `${link} doesn't exist`).toBe(true);
    });
  });

  it("doesn't regrow its own copy of the style guide", () => {
    const lines = agent.trimEnd().split('\n').length;
    expect(
      lines,
      `.github/agents/writing.md is ${lines} lines. Voice rules belong in the writing-style skill or src/content/CLAUDE.md, not in a second copy here.`,
    ).toBeLessThanOrEqual(MAX_AGENT_LINES);
  });

  it.each(CONTRADICTIONS)("doesn't recommend %s", (_name, pattern) => {
    expect(agent).not.toMatch(pattern);
  });
});

describe('src/content/CLAUDE.md', () => {
  it('names the skill as the source of truth', () => {
    expect(summary).toMatch(/`writing-style` skill/);
  });

  it.each(SUMMARY_RULES)('covers %s', (_name, pattern) => {
    expect(summary).toMatch(pattern);
  });

  it("doesn't use numbered footnotes in its examples", () => {
    expect(summary).not.toMatch(/\[\^\d+\]/);
  });
});

// The skill's repository is private, so CI can't read it. This runs wherever
// the skill is installed, which is where Ben's Claude Code sessions run the
// tests before committing.
const longFormPath = join(homedir(), '.claude', 'skills', 'writing-style', 'references', 'long-form.md');

describe.skipIf(!existsSync(longFormPath))('agreement with the installed writing-style skill', () => {
  const longForm = existsSync(longFormPath) ? readFileSync(longFormPath, 'utf-8') : '';

  /** Pull one number out of a guide, failing with a readable message if the wording moved. */
  function limit(text: string, pattern: RegExp, what: string): number {
    const match = text.match(pattern);
    expect(match, `Couldn't find ${what}. If the wording changed, update the pattern in this test.`).not.toBeNull();
    return Number(match![1]);
  }

  it('uses the same title length limit', () => {
    const skill = limit(longForm, /`title` field under about (\d+)/, "the skill's title limit");
    const site = limit(summary, /\*\*Title\*\*: under about (\d+) characters/, "the summary's title limit");
    expect(site).toBe(skill);
  });

  it('uses the same description length', () => {
    const skill = limit(longForm, /cuts it around (\d+) characters/, "the skill's description length");
    const site = limit(summary, /first (\d+) characters after stripping Markdown/, "the summary's description length");
    expect(site).toBe(skill);
  });
});
