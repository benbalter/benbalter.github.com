import { describe, it, expect } from 'vitest';
import { formatTimeRemaining } from './time-remaining';

describe('formatTimeRemaining', () => {
  it('returns the full time at progress 0', () => {
    expect(formatTimeRemaining(10, 0)).toBe('10 min left');
  });

  it('returns half the time at progress 0.5', () => {
    expect(formatTimeRemaining(10, 0.5)).toBe('5 min left');
  });

  it('rounds up to at least 1 min when under 1 min remains', () => {
    expect(formatTimeRemaining(5, 0.85)).toBe('1 min left');
  });

  it('returns empty string when under half a minute remains', () => {
    expect(formatTimeRemaining(10, 0.98)).toBe('');
  });

  it('returns empty string at progress 1', () => {
    expect(formatTimeRemaining(10, 1)).toBe('');
  });

  it('clamps progress above 1', () => {
    expect(formatTimeRemaining(10, 2)).toBe('');
  });

  it('clamps negative progress to 0', () => {
    expect(formatTimeRemaining(10, -0.5)).toBe('10 min left');
  });

  it('returns empty string when total minutes is zero', () => {
    expect(formatTimeRemaining(0, 0.5)).toBe('');
  });

  it('returns empty string when total minutes is NaN', () => {
    expect(formatTimeRemaining(Number.NaN, 0.5)).toBe('');
  });

  it('returns empty string when progress is NaN', () => {
    expect(formatTimeRemaining(10, Number.NaN)).toBe('');
  });

  it('rounds 1.5 to 2', () => {
    // 3 min total, 0.5 progress => 1.5 min => rounds to 2
    expect(formatTimeRemaining(3, 0.5)).toBe('2 min left');
  });
});
