import { describe, it, expect } from 'vitest';
import { socialBios, bioLength } from './social-bios';
import { socialLinks } from '../config';

describe('socialBios', () => {
  it.each(socialBios.map((entry) => [entry.network, entry]))('%s bio stays within its limit', (_network, entry) => {
    expect(bioLength(entry)).toBeLessThanOrEqual(entry.limit);
  });

  it('covers only networks the site links to', () => {
    const linked = socialLinks.map((link) => link.name);
    for (const entry of socialBios) {
      expect(linked).toContain(entry.network);
    }
  });

  it('counts graphemes, not UTF-16 units, where the network does', () => {
    expect(bioLength({ ...socialBios[0], bio: '👩‍💻', unit: 'graphemes' })).toBe(1);
    expect(bioLength({ ...socialBios[0], bio: '👩‍💻', unit: 'characters' })).toBe(5);
  });
});
