#!/usr/bin/env tsx
/* eslint-disable @typescript-eslint/no-floating-promises */

/**
 * Unit tests for build-related-posts.ts
 * Uses Node's built-in test runner
 */

import {describe, it} from 'node:test';
import assert from 'node:assert';
import {extractPlainText, readPosts, findRelatedPosts} from './build-related-posts.js';

describe('extractPlainText', () => {
  it('should remove code blocks', async () => {
    const markdown = 'Some text\n```js\nconst x = 1;\n```\nMore text';
    const result = await extractPlainText(markdown);
    assert.strictEqual(result.includes('const'), false);
    assert.strictEqual(result.includes('some text'), true);
    assert.strictEqual(result.includes('more text'), true);
  });

  it('should remove inline code', async () => {
    const markdown = 'Use `npm install` to install packages';
    const result = await extractPlainText(markdown);
    assert.strictEqual(result.includes('`'), false);
    assert.strictEqual(result.includes('npm install'), false);
    assert.strictEqual(result.includes('use'), true);
  });

  it('should convert links to text', async () => {
    const markdown = 'Check out [this link](https://example.com)';
    const result = await extractPlainText(markdown);
    assert.strictEqual(result.includes('this link'), true);
    assert.strictEqual(result.includes('https://'), false);
    assert.strictEqual(result.includes('['), false);
  });

  it('should remove markdown symbols', async () => {
    const markdown = '# Heading\n**bold** and *italic* and ~~strikethrough~~';
    const result = await extractPlainText(markdown);
    assert.strictEqual(result.includes('#'), false);
    assert.strictEqual(result.includes('*'), false);
    assert.strictEqual(result.includes('~'), false);
    assert.strictEqual(result.includes('heading'), true);
    assert.strictEqual(result.includes('bold'), true);
  });

  it('should normalize whitespace', async () => {
    const markdown = 'Line 1\n\n\nLine 2\n\nLine 3';
    const result = await extractPlainText(markdown);
    assert.strictEqual(result.includes('\n'), false);
    assert.strictEqual(/\s{2,}/.exec(result), null);
  });

  it('should convert to lowercase', async () => {
    const markdown = 'UPPERCASE Text';
    const result = await extractPlainText(markdown);
    assert.strictEqual(result, 'uppercase text');
  });
});

describe('readPosts', () => {
  it('should return an array of posts', async () => {
    const posts = await readPosts();
    assert.ok(Array.isArray(posts));
    assert.ok(posts.length > 0);
  });

  it('should have required properties', async () => {
    const posts = await readPosts();
    const firstPost = posts[0];
    
    assert.ok('path' in firstPost);
    assert.ok('content' in firstPost);
    assert.ok('title' in firstPost);
    
    assert.strictEqual(typeof firstPost.path, 'string');
    assert.strictEqual(typeof firstPost.content, 'string');
    assert.strictEqual(typeof firstPost.title, 'string');
  });

  it('should have paths starting with _posts/', async () => {
    const posts = await readPosts();
    for (const post of posts) {
      assert.ok(post.path.startsWith('_posts/'));
    }
  });

  it('should have paths ending with .md', async () => {
    const posts = await readPosts();
    for (const post of posts) {
      assert.ok(post.path.endsWith('.md'));
    }
  });

  it('should exclude ignored posts', async () => {
    const posts = await readPosts();
    const ignoredPaths = [
      '_posts/2011-11-29-towards-a-more-agile-government.md',
      '_posts/2012-12-26-securing-the-status-quo.md',
    ];
    
    for (const post of posts) {
      assert.ok(!ignoredPaths.includes(post.path));
    }
  });

  it('should have non-empty content for most posts', async () => {
    const posts = await readPosts();
    const postsWithContent = posts.filter(p => p.content.length > 0);
    // At least 95% of posts should have content
    assert.ok(postsWithContent.length / posts.length > 0.95);
  });
});

describe('findRelatedPosts', () => {
  it('should return a record of related posts', async () => {
    const posts = await readPosts();
    const related = findRelatedPosts(posts);
    
    assert.strictEqual(typeof related, 'object');
    assert.ok(Object.keys(related).length > 0);
  });

  it('should have 11 related posts for each post', async () => {
    const posts = await readPosts();
    const related = findRelatedPosts(posts);
    
    for (const [_postPath, relatedPosts] of Object.entries(related)) {
      assert.strictEqual(relatedPosts.length, 11);
    }
  });

  it('should not include self in related posts', async () => {
    const posts = await readPosts();
    const related = findRelatedPosts(posts);
    
    for (const [postPath, relatedPosts] of Object.entries(related)) {
      assert.ok(!relatedPosts.includes(postPath));
    }
  });

  it('should have valid post paths in related posts', async () => {
    const posts = await readPosts();
    const related = findRelatedPosts(posts);
    const validPaths = new Set(posts.map(p => p.path));
    
    for (const [_postPath, relatedPosts] of Object.entries(related)) {
      for (const relatedPath of relatedPosts) {
        assert.ok(validPaths.has(relatedPath));
      }
    }
  });

  it('should return consistent results', async () => {
    const posts = await readPosts();
    const related1 = findRelatedPosts(posts);
    const related2 = findRelatedPosts(posts);
    
    assert.deepStrictEqual(related1, related2);
  });
});

describe('integration', () => {
  it('should process all posts without errors', async () => {
    const posts = await readPosts();
    const related = findRelatedPosts(posts);
    
    assert.ok(posts.length > 0);
    assert.strictEqual(Object.keys(related).length, posts.length);
  });
});
