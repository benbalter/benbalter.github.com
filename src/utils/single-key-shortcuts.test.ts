import { afterEach, describe, expect, it, vi } from 'vitest';
import { setSingleKeyShortcutsEnabled, singleKeyShortcutsEnabled } from './single-key-shortcuts';

describe('single-key shortcuts setting', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('is on by default', () => {
    expect(singleKeyShortcutsEnabled()).toBe(true);
  });

  it('turns off and back on', () => {
    setSingleKeyShortcutsEnabled(false);
    expect(singleKeyShortcutsEnabled()).toBe(false);
    setSingleKeyShortcutsEnabled(true);
    expect(singleKeyShortcutsEnabled()).toBe(true);
  });

  it('stays on when storage throws', () => {
    vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => setSingleKeyShortcutsEnabled(false)).not.toThrow();
    expect(singleKeyShortcutsEnabled()).toBe(true);
  });
});
