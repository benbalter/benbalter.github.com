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
