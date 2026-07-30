import { describe, it, expect } from 'vitest';
import { viewTransitionName } from './view-transition-name';

describe('viewTransitionName', () => {
  it('derives a valid custom-ident from a post path', () => {
    expect(viewTransitionName('/2026/07/30/title/')).toBe('vt-2026-07-30-title');
  });

  it('always starts with the vt- prefix so it never begins with a digit', () => {
    expect(viewTransitionName('/2026/07/30/title/')).toMatch(/^vt-[a-z0-9-]+$/);
  });

  it('produces the same name for a card url and the matching article pathname', () => {
    const cardUrl = 'https://balter.com/2026/07/30/title/';
    const articlePathname = '/2026/07/30/title/';
    expect(viewTransitionName(cardUrl)).toBe(viewTransitionName(articlePathname));
  });

  it('is insensitive to a trailing slash', () => {
    expect(viewTransitionName('/2026/07/30/title')).toBe(
      viewTransitionName('/2026/07/30/title/')
    );
  });

  it('ignores query strings and hashes', () => {
    expect(viewTransitionName('/2026/07/30/title/?utm=x#section')).toBe(
      'vt-2026-07-30-title'
    );
  });

  it('gives distinct names to distinct posts', () => {
    expect(viewTransitionName('/2026/07/30/one/')).not.toBe(
      viewTransitionName('/2026/07/30/two/')
    );
  });

  it('falls back to vt-root for the root path', () => {
    expect(viewTransitionName('/')).toBe('vt-root');
  });
});
