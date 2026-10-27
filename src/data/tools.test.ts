import { describe, it, expect } from 'vitest';
import { PITCH_MAX, tools } from './tools';

describe('tools', () => {
  it.each(tools)('$name pitch fits the hover card without being clamped', ({ pitch }) => {
    expect(pitch.length).toBeLessThanOrEqual(PITCH_MAX);
  });
});
