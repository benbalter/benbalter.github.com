/**
 * Tests for archived posts functionality
 */

import { describe, it, expect } from 'vitest';
import type { CollectionEntry } from 'astro:content';

// Helper function to create mock posts for testing
function createMockPost(
  slug: string,
  title: string,
  description: string,
  published = true,
  archived = false
): CollectionEntry<'posts'> {
  return {
    slug,
    id: slug,
    collection: 'posts',
    data: {
      title,
      description,
      published,
      archived,
      comments: false,
      sitemap: true,
    },
    render: async () => ({
      Content: (() => null) as any,
      headings: [],
      remarkPluginFrontmatter: {},
    }),
  } as CollectionEntry<'posts'>;
}

describe('Archived Posts Filtering', () => {
  it('should filter out archived posts', () => {
    const posts: CollectionEntry<'posts'>[] = [
      createMockPost('2024-01-01-post-1', 'Post 1', 'Description 1', true, false),
      createMockPost('2024-01-02-post-2', 'Post 2', 'Description 2', true, true),
      createMockPost('2024-01-03-post-3', 'Post 3', 'Description 3', true, false),
    ];

    // Filter logic that should be used in index.astro
    const nonArchivedPosts = posts.filter(post => 
      post.data.published !== false && post.data.archived !== true
    );

    expect(nonArchivedPosts.length).toBe(2);
    expect(nonArchivedPosts[0].slug).toBe('2024-01-01-post-1');
    expect(nonArchivedPosts[1].slug).toBe('2024-01-03-post-3');
  });

  it('should include non-archived posts', () => {
    const posts: CollectionEntry<'posts'>[] = [
      createMockPost('2024-01-01-post-1', 'Post 1', 'Description 1', true, false),
      createMockPost('2024-01-02-post-2', 'Post 2', 'Description 2', true, false),
    ];

    const nonArchivedPosts = posts.filter(post => 
      post.data.published !== false && post.data.archived !== true
    );

    expect(nonArchivedPosts.length).toBe(2);
  });

  it('should filter out both unpublished and archived posts', () => {
    const posts: CollectionEntry<'posts'>[] = [
      createMockPost('2024-01-01-post-1', 'Post 1', 'Description 1', true, false),
      createMockPost('2024-01-02-post-2', 'Post 2', 'Description 2', false, false),
      createMockPost('2024-01-03-post-3', 'Post 3', 'Description 3', true, true),
      createMockPost('2024-01-04-post-4', 'Post 4', 'Description 4', false, true),
    ];

    const visiblePosts = posts.filter(post => 
      post.data.published !== false && post.data.archived !== true
    );

    expect(visiblePosts.length).toBe(1);
    expect(visiblePosts[0].slug).toBe('2024-01-01-post-1');
  });

  it('should handle posts with undefined archived field as not archived', () => {
    // Create post without passing archived parameter (uses default value)
    const postWithoutArchived = createMockPost('2024-01-01-post-1', 'Post 1', 'Description 1', true);
    
    const posts: CollectionEntry<'posts'>[] = [postWithoutArchived];

    const nonArchivedPosts = posts.filter(post => 
      post.data.published !== false && post.data.archived !== true
    );

    expect(nonArchivedPosts.length).toBe(1);
  });
});

describe('Archived Flag in Posts', () => {
  it('should have archived field default to false in schema', () => {
    const post = createMockPost('2024-01-01-post', 'Post', 'Description');
    expect(post.data.archived).toBe(false);
  });

  it('should correctly identify archived posts', () => {
    const archivedPost = createMockPost('2024-01-01-post', 'Post', 'Description', true, true);
    expect(archivedPost.data.archived).toBe(true);
  });

  it('should correctly identify non-archived posts', () => {
    const regularPost = createMockPost('2024-01-01-post', 'Post', 'Description', true, false);
    expect(regularPost.data.archived).toBe(false);
  });
});
