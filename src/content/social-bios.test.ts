import { describe, it, expect } from 'vitest';
import { socialBios, bioLength } from './social-bios';
import { socialLinks } from '../config';

describe('socialBios', () => {
  it.each(socialBios.filter((entry) => entry.limit !== undefined).map((entry) => [entry.network, entry]))('%s bio stays within its limit', (_network, entry) => {
    expect(bioLength(entry)).toBeLessThanOrEqual(entry.limit ?? Infinity);
  });

  it('uses the same network names as the site links, where the site links to it', () => {
    const linked = new Set(socialLinks.map((link) => link.name.toLowerCase()));
    const linkedBios = socialBios.filter((entry) => linked.has(entry.network.toLowerCase()));
    for (const entry of linkedBios) {
      expect(socialLinks.map((link) => link.name)).toContain(entry.network);
    }
    expect(linkedBios.length).toBeGreaterThan(0);
  });

  it('lists each network once', () => {
    const names = socialBios.map((entry) => entry.network);
    expect(new Set(names).size).toBe(names.length);
  });

  it('counts graphemes, not UTF-16 units, where the network does', () => {
    expect(bioLength({ ...socialBios[0], bio: '👩‍💻', unit: 'graphemes' })).toBe(1);
    expect(bioLength({ ...socialBios[0], bio: '👩‍💻', unit: 'characters' })).toBe(5);
  });
});
