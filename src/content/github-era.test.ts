/**
 * Keeps the `writtenAtGitHub` label honest.
 *
 * Post dates are hidden, so a post that describes GitHub's internal practices
 * in the present tense ("At GitHub, we…") reads as how GitHub works today. The
 * label is what tells readers otherwise, so a post with that framing must carry
 * it, and a post written after Ben left GitHub must not.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { getGitHubTenure, type TenurePosition } from '../utils/github-tenure';

const postsDir = join(process.cwd(), 'src', 'content', 'posts');
const positionsDir = join(process.cwd(), 'src', 'content', 'resume-positions');

function readFrontMatter(path: string): { data: Record<string, unknown>; body: string } {
  const { data, content } = matter(readFileSync(path, 'utf-8'));
  return { data, body: content };
}

const tenure = getGitHubTenure(
  readdirSync(positionsDir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => readFrontMatter(join(positionsDir, file)).data as unknown as TenurePosition),
);

// Present-tense descriptions of GitHub's internals. Past tense ("At GitHub, we
// used…", "When I was at GitHub, I…") is fine without the label.
const presentTenseGitHub = [
  /\bAt GitHub,? we (?!used\b|were\b|had\b|did\b|once\b)/,
  /\b[Aa]s we say at GitHub\b/,
  /\bhere at GitHub\b/i,
];

const posts = readdirSync(postsDir)
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => {
    const { data, body } = readFrontMatter(join(postsDir, file));
    return {
      file,
      date: new Date(`${file.slice(0, 10)}T00:00:00Z`),
      flagged: data.writtenAtGitHub === true,
      archived: data.archived === true,
      prose: body.replace(/```[\s\S]*?```/g, ''),
    };
  });

describe('writtenAtGitHub label', () => {
  it('is not set on posts written after Ben left GitHub', () => {
    const offenders = posts
      .filter((post) => post.flagged && post.date > tenure.end)
      .map((post) => post.file);
    expect(offenders, `Posts dated after ${tenure.end.toISOString().slice(0, 10)} can't have been written at GitHub`).toEqual([]);
  });

  it('is set on posts that describe GitHub in the present tense', () => {
    const offenders = posts
      .filter((post) => !post.flagged && !post.archived)
      .filter((post) => post.date >= tenure.start && post.date <= tenure.end)
      .filter((post) => presentTenseGitHub.some((pattern) => pattern.test(post.prose)))
      .map((post) => post.file);
    expect(
      offenders,
      'These posts describe GitHub in the present tense; add `writtenAtGitHub: true` or move the GitHub descriptions to the past tense',
    ).toEqual([]);
  });
});
