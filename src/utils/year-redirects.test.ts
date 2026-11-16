import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// public/_redirects lists one static rule per year of posts (/YYYY/ and
// /YYYY, pointing at that year's section on /posts/). Nothing generates them,
// so this fails when the first post of a new year lands without its rules.
const redirects = new Map(
  readFileSync(join(process.cwd(), 'public', '_redirects'), 'utf-8')
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => {
      const [source = '', destination = ''] = line.trim().split(/\s+/);
      return [source, destination] as const;
    }),
);

const postYears = [
  ...new Set(
    readdirSync(join(process.cwd(), 'src', 'content', 'posts'))
      .map((file) => /^(\d{4})-\d{2}-\d{2}-/.exec(file)?.[1])
      .filter((year): year is string => year !== undefined),
  ),
].sort();

describe('year archive redirects', () => {
  it('finds post years to check', () => {
    expect(postYears.length).toBeGreaterThan(0);
  });

  it.each(postYears)('redirects /%s/ and /%s to /posts/', (year) => {
    for (const source of [`/${year}/`, `/${year}`]) {
      const destination = redirects.get(source);
      expect(destination, `public/_redirects needs a rule for ${source}`).toBeDefined();
      expect(destination).toMatch(new RegExp(`^/posts/(#${year})?$`));
    }
  });
});
