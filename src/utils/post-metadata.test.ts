/**
 * Tests for post metadata utility
 */

import { describe, it, expect, vi } from 'vitest';

// Mock the dependencies before importing the module under test
vi.mock('./post-urls', () => ({
  getPostUrl: vi.fn((id: string) => `/2024/01/15/${id.replace(/^\d{4}-\d{2}-\d{2}-/, '')}/`),
  getDateFromSlug: vi.fn(() => new Date(2024, 0, 15)),
  formatPostDate: vi.fn(() => 'January 15, 2024'),
  formatISODate: vi.fn(() => '2024-01-15'),
}));

vi.mock('./reading-time', () => ({
  calculateReadingTime: vi.fn(() => 5),
}));

import { getPostMetadata } from './post-metadata';

describe('getPostMetadata', () => {
  it('should return the correct metadata shape', () => {
    const mockPost = {
      id: '2024-01-15-test-post',
      body: 'Some content here',
      data: { title: 'Test Post' },
    } as any;

    const result = getPostMetadata(mockPost);

    expect(result).toEqual({
      postUrl: '/2024/01/15/test-post/',
      date: 'January 15, 2024',
      isoDate: '2024-01-15',
      readingTime: 5,
    });
  });

  it('should have all required properties', () => {
    const mockPost = {
      id: '2023-06-01-another-post',
      body: 'More content',
      data: { title: 'Another Post' },
    } as any;

    const result = getPostMetadata(mockPost);

    expect(result).toHaveProperty('postUrl');
    expect(result).toHaveProperty('date');
    expect(result).toHaveProperty('isoDate');
    expect(result).toHaveProperty('readingTime');
  });
});
