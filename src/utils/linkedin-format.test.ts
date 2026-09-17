/**
 * Regression guard: every LinkedIn-bound resume field must fit inside
 * LinkedIn's character limits.
 *
 * This prevents the previous overflow (government-evangelist.md @ 2,142 chars)
 * from recurring as the resume evolves.
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  cleanDescription,
  linkedinCharCount,
  LINKEDIN_LIMITS,
} from './linkedin-format';
import {
  linkedinHeadline,
  linkedinAboutText,
} from '../content/linkedin-bio';

const positionsDir = path.join(
  process.cwd(),
  'src',
  'content',
  'resume-positions',
);

interface PositionFile {
  file: string;
  charCount: number;
}

function loadPositions(): PositionFile[] {
  return fs
    .readdirSync(positionsDir)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const raw = fs.readFileSync(path.join(positionsDir, file), 'utf8');
      const { content } = matter(raw);
      return {
        file,
        charCount: linkedinCharCount(cleanDescription(content)),
      };
    });
}

describe('LinkedIn resume field character limits', () => {
  it('Headline stays within LinkedIn limit', () => {
    expect(linkedinHeadline.length).toBeLessThanOrEqual(
      LINKEDIN_LIMITS.headline,
    );
  });

  it('About stays within LinkedIn limit', () => {
    expect(linkedinAboutText.length).toBeLessThanOrEqual(LINKEDIN_LIMITS.about);
  });

  describe('Position descriptions', () => {
    const positions = loadPositions();

    it('discovers at least one position file', () => {
      expect(positions.length).toBeGreaterThan(0);
    });

    it.each(positions)(
      '$file is within $#2000 LinkedIn limit ($charCount chars)',
      ({ charCount }) => {
        expect(charCount).toBeLessThanOrEqual(LINKEDIN_LIMITS.description);
      },
    );
  });
});

/**
 * Paragraph breaks survive the copy-to-LinkedIn path.
 *
 * `stripMarkdown` ends with `\s+ -> ' '`, which flattens every newline. Bullets
 * were protected by a placeholder; paragraph breaks were not, so a position's
 * lede paragraph ran straight into its first bullet when pasted into LinkedIn.
 */
describe('cleanDescription paragraph breaks', () => {
  const asPasted = (markdown: string) =>
    cleanDescription(markdown).replace(/<br\s*\/?>/gi, '\n');

  it('keeps the blank line between a lede paragraph and its bullets', () => {
    expect(asPasted('Lede paragraph here.\n\n- Bullet one.\n- Bullet two.')).toBe(
      'Lede paragraph here.\n\n• Bullet one.\n• Bullet two.',
    );
  });

  it('keeps the blank line between two paragraphs', () => {
    expect(asPasted('Para one.\n\nPara two.')).toBe('Para one.\n\nPara two.');
  });

  it('collapses a markdown soft wrap to a space', () => {
    expect(asPasted('Line one\nstill same paragraph.')).toBe(
      'Line one still same paragraph.',
    );
  });

  it('does not open a bullets-only description with a break', () => {
    expect(asPasted('- Bullet one.\n- Bullet two.')).toBe('• Bullet one.\n• Bullet two.');
  });

  it('leaves no trailing space before a line break', () => {
    expect(asPasted('Lede.\n\n- Bullet.')).not.toMatch(/[ \t]\n/);
  });

  it('renders a real position body with its lede intact', () => {
    const body = fs.readFileSync(
      path.join(positionsDir, 'hubber-enablement.md'),
      'utf-8',
    );
    const pasted = asPasted(matter(body).content.trim());
    expect(pasted).toMatch(/content\.\n\n• Platform product ownership/);
  });
});
