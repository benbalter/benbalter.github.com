import { describe, it, expect } from 'vitest';
import { selectReadingIslandState } from './reading-island-state';

const base = { ratio: 0.5, hasSelection: false, ctaVisible: false };

describe('selectReadingIslandState', () => {
  it('shows progress while reading the body', () => {
    expect(selectReadingIslandState(base)).toBe('progress');
  });

  it('stays hidden before the reveal threshold', () => {
    expect(selectReadingIslandState({ ...base, ratio: 0.01 })).toBe('hidden');
  });

  it('respects a custom reveal threshold', () => {
    expect(selectReadingIslandState({ ...base, ratio: 0.2, revealAfter: 0.3 })).toBe('hidden');
    expect(selectReadingIslandState({ ...base, ratio: 0.4, revealAfter: 0.3 })).toBe('progress');
  });

  it('shows the CTA when the subscribe card is in view', () => {
    expect(selectReadingIslandState({ ...base, ratio: 0.95, ctaVisible: true })).toBe('cta');
  });

  it('prioritizes share over the CTA when text is selected', () => {
    expect(
      selectReadingIslandState({ ...base, ratio: 0.95, ctaVisible: true, hasSelection: true })
    ).toBe('share');
  });

  it('shows share even at the very top (selection is immediate intent)', () => {
    expect(selectReadingIslandState({ ...base, ratio: 0, hasSelection: true })).toBe('share');
  });

  it('treats a non-finite ratio as hidden (no selection)', () => {
    expect(selectReadingIslandState({ ...base, ratio: Number.NaN })).toBe('hidden');
  });
});
