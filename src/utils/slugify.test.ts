/**
 * Tests for slugify utility
 */

import { describe, it, expect } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('should convert text to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('foo bar baz')).toBe('foo-bar-baz');
  });

  it('should handle special characters', () => {
    expect(slugify('Hello, World! How are you?')).toBe('hello-world-how-are-you');
  });

  it('should collapse multiple non-alphanumeric characters', () => {
    expect(slugify('foo---bar___baz')).toBe('foo-bar-baz');
  });

  it('should remove leading and trailing hyphens', () => {
    expect(slugify('---hello---')).toBe('hello');
    expect(slugify('!hello!')).toBe('hello');
  });

  it('should handle strings with only special characters', () => {
    expect(slugify('!!!')).toBe('');
  });

  it('should preserve numbers', () => {
    expect(slugify('Section 42')).toBe('section-42');
  });
});
