/**
 * Tests for related posts calculations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { findRelatedPosts, clearRelatedPostsCache } from './related-posts';
import type { CollectionEntry } from 'astro:content';

// Helper function to create mock posts for testing
function createMockPost(
  slug: string,
  title: string,
  description: string,
  published = true,
  archived = false,
  body = ''
): CollectionEntry<'posts'> {
  return {
    id: slug,
    collection: 'posts',
    body,
    data: {
      title,
      description,
      published,
      archived,
    } as any,
  } as CollectionEntry<'posts'>;
}

describe('findRelatedPosts', () => {
  // Clear cache before each test to ensure test isolation
  beforeEach(() => {
    clearRelatedPostsCache();
  });

  it('should return related posts based on content similarity', async () => {
    const post1 = createMockPost(
      '2024-01-01-javascript-tutorial',
      'JavaScript Tutorial',
      'Learn JavaScript programming basics and advanced concepts'
    );
    const post2 = createMockPost(
      '2024-01-02-python-tutorial',
      'Python Tutorial',
      'Learn Python programming basics and advanced concepts'
    );
    const post3 = createMockPost(
      '2024-01-03-cooking-recipes',
      'Cooking Recipes',
      'Delicious recipes for dinner and dessert'
    );
    
    const allPosts = [post1, post2, post3];
    const related = await findRelatedPosts(post1, allPosts, 10);
    
    // post2 (Python tutorial) should be more similar to post1 (JavaScript tutorial)
    // than post3 (Cooking recipes)
    expect(related.length).toBeGreaterThan(0);
    expect(related[0].id).toBe('2024-01-02-python-tutorial');
  });

  it('should exclude the current post from results', async () => {
    const post1 = createMockPost(
      '2024-01-01-test',
      'Test Post',
      'This is a test post'
    );
    const post2 = createMockPost(
      '2024-01-02-another',
      'Another Post',
      'This is another test post'
    );
    
    const allPosts = [post1, post2];
    const related = await findRelatedPosts(post1, allPosts, 10);
    
    // Should not include the current post
    expect(related.every(p => p.id !== post1.id)).toBe(true);
  });

  it('should exclude archived posts from results', async () => {
    const post1 = createMockPost(
      '2024-01-01-current',
      'Current Post',
      'This is the current post'
    );
    const post2 = createMockPost(
      '2024-01-02-archived',
      'Archived Post',
      'This is an archived post',
      true,
      true
    );
    const post3 = createMockPost(
      '2024-01-03-active',
      'Active Post',
      'This is an active post'
    );
    
    const allPosts = [post1, post2, post3];
    const related = await findRelatedPosts(post1, allPosts, 10);
    
    // Should not include archived posts
    expect(related.every(p => p.id !== post2.id)).toBe(true);
  });

  it('should respect the maxResults limit', async () => {
    const post1 = createMockPost(
      '2024-01-01-main',
      'Main Post',
      'Programming tutorial about coding'
    );
    
    // Create 15 similar posts
    const allPosts = [post1];
    for (let i = 2; i <= 16; i++) {
      allPosts.push(createMockPost(
        `2024-01-${String(i).padStart(2, '0')}-post${i}`,
        `Post ${i}`,
        'Programming tutorial about coding'
      ));
    }
    
    const related = await findRelatedPosts(post1, allPosts, 5);
    
    // Should return at most 5 posts
    expect(related.length).toBeLessThanOrEqual(5);
  });

  it('should handle posts with empty descriptions', async () => {
    const post1 = createMockPost(
      '2024-01-01-post1',
      'Post with Description',
      'This post has a description'
    );
    const post2 = createMockPost(
      '2024-01-02-post2',
      'Post without Description',
      ''
    );
    
    const allPosts = [post1, post2];
    const related = await findRelatedPosts(post1, allPosts, 10);
    
    // Should not crash with empty descriptions
    expect(Array.isArray(related)).toBe(true);
  });

  it('should return posts sorted by similarity score', async () => {
    const post1 = createMockPost(
      '2024-01-01-javascript',
      'JavaScript Basics',
      'JavaScript programming language tutorial'
    );
    const post2 = createMockPost(
      '2024-01-02-js-advanced',
      'Advanced JavaScript',
      'JavaScript advanced programming techniques'
    );
    const post3 = createMockPost(
      '2024-01-03-cooking',
      'Cooking Tips',
      'How to cook delicious meals'
    );
    const post4 = createMockPost(
      '2024-01-04-js-frameworks',
      'JavaScript Frameworks',
      'JavaScript frameworks and libraries tutorial'
    );
    
    const allPosts = [post1, post2, post3, post4];
    const related = await findRelatedPosts(post1, allPosts, 10);
    
    // The most similar posts should come first
    // Both post2 and post4 have "JavaScript" but post2 has more similarity
    expect(related.length).toBeGreaterThan(0);
    // Verify that cooking post is not first
    if (related.length > 0) {
      expect(related[0].id).not.toBe('2024-01-03-cooking');
    }
  });

  it('should handle single post scenario', async () => {
    const post1 = createMockPost(
      '2024-01-01-only-post',
      'Only Post',
      'This is the only post'
    );
    
    const allPosts = [post1];
    const related = await findRelatedPosts(post1, allPosts, 10);
    
    // Should return empty array when there's only one post
    expect(related).toEqual([]);
  });

  it('should filter out stop words and find similarity', async () => {
    const post1 = createMockPost(
      '2024-01-01-post1',
      'JavaScript Programming Language Tutorial',
      'Learn JavaScript programming with practical examples and exercises'
    );
    const post2 = createMockPost(
      '2024-01-02-post2',
      'Python Programming Language Guide',
      'Python programming fundamentals with code examples'
    );
    const post3 = createMockPost(
      '2024-01-03-post3',
      'Cooking Recipes',
      'Delicious meals and desserts for everyone'
    );
    
    const allPosts = [post1, post2, post3];
    const related = await findRelatedPosts(post1, allPosts, 10);
    
    // Should find post2 as more similar than post3 despite stop words
    // Based on meaningful shared words like "programming", "language", "examples"
    expect(related.length).toBeGreaterThan(0);
    if (related.length > 0) {
      // post2 (programming) should rank higher than post3 (cooking)
      expect(related[0].id).toBe('2024-01-02-post2');
    }
  });

  it('should rank posts with similar body content higher', async () => {
    const post1 = createMockPost(
      '2024-01-01-remote-work',
      'Remote Work Tips',
      'Advice for working remotely',
      true,
      false,
      'Working from home requires discipline and communication. Distributed teams need async collaboration tools and clear documentation practices.'
    );
    const post2 = createMockPost(
      '2024-01-02-async-collab',
      'Async Collaboration',
      'How teams collaborate asynchronously',
      true,
      false,
      'Distributed teams thrive with async communication. Remote workers benefit from clear documentation and collaboration practices across time zones.'
    );
    const post3 = createMockPost(
      '2024-01-03-gardening',
      'Gardening Guide',
      'Tips for growing vegetables',
      true,
      false,
      'Planting tomatoes and peppers in raised beds yields the best results. Composting enriches the soil and helps retain moisture.'
    );
    
    const allPosts = [post1, post2, post3];
    const related = await findRelatedPosts(post1, allPosts, 10);
    
    expect(related.length).toBe(2);
    // post2 shares body-content topics (distributed, teams, collaboration, async, documentation)
    expect(related[0].id).toBe('2024-01-02-async-collab');
  });

  it('should still boost title-word matches via weighting', async () => {
    const post1 = createMockPost(
      '2024-01-01-open-source',
      'Open Source Licensing',
      'Understanding open source licenses',
      true,
      false,
      'Software licensing governs how code can be shared and reused.'
    );
    const post2 = createMockPost(
      '2024-01-02-oss-communities',
      'Open Source Communities',
      'Building open source communities',
      true,
      false,
      'Maintaining healthy contributor ecosystems in projects.'
    );
    const post3 = createMockPost(
      '2024-01-03-proprietary',
      'Proprietary Software',
      'Commercial software models',
      true,
      false,
      'Software licensing determines distribution rights for commercial products. Code reuse policies vary by vendor.'
    );
    
    const allPosts = [post1, post2, post3];
    const related = await findRelatedPosts(post1, allPosts, 10);
    
    expect(related.length).toBe(2);
    // post2 shares "open source" in the title (boosted weight) even though
    // post3 shares body words like "licensing", "software", "code"
    expect(related[0].id).toBe('2024-01-02-oss-communities');
  });
});
