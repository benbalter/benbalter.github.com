/**
 * Tests for BlogPosting structured data schema
 */

import { describe, it, expect } from 'vitest';
import { generateBlogPostingSchema } from './structured-data';
import { siteConfig } from '../config';

describe('generateBlogPostingSchema', () => {
  it('should generate valid BlogPosting schema', () => {
    const props = {
      title: 'Test Blog Post',
      description: 'This is a test post',
      url: 'https://ben.balter.com/2024/01/01/test-post/',
      publishedTime: new Date('2024-01-01'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BlogPosting');
  });

  it('should include post title and description', () => {
    const props = {
      title: 'Test Blog Post',
      description: 'This is a test post',
      url: 'https://ben.balter.com/2024/01/01/test-post/',
      publishedTime: new Date('2024-01-01'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('headline', 'Test Blog Post');
    expect(schema).toHaveProperty('description', 'This is a test post');
  });

  it('should include post URL', () => {
    const props = {
      title: 'Test Blog Post',
      url: 'https://ben.balter.com/2024/01/01/test-post/',
      publishedTime: new Date('2024-01-01'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('url', 'https://ben.balter.com/2024/01/01/test-post/');
  });

  it('should include published date in ISO format', () => {
    const publishDate = new Date('2024-01-15T12:00:00Z');
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: publishDate,
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('datePublished', publishDate.toISOString());
  });

  it('should use published date as modified date when no modified date provided', () => {
    const publishDate = new Date('2024-01-15T12:00:00Z');
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: publishDate,
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('dateModified', publishDate.toISOString());
  });

  it('should use custom modified date when provided', () => {
    const publishDate = new Date('2024-01-15T12:00:00Z');
    const modifiedDate = new Date('2024-02-01T12:00:00Z');
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: publishDate,
      modifiedTime: modifiedDate,
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('dateModified', modifiedDate.toISOString());
  });

  it('should include custom image when provided', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
      image: 'https://ben.balter.com/assets/img/custom-image.jpg',
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('image', 'https://ben.balter.com/assets/img/custom-image.jpg');
  });

  it('should use default headshot when no image provided', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('image', `${siteConfig.url}/assets/img/headshot.jpg`);
  });

  it('should include author information', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('author');
    expect(schema.author).toHaveProperty('@type', 'Person');
    expect(schema.author).toHaveProperty('name', siteConfig.author);
  });

  it('should accept custom author name', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
      author: 'Custom Author',
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('author');
    expect(schema.author).toHaveProperty('name', 'Custom Author');
  });

  it('should include publisher information', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('publisher');
    expect(schema.publisher).toHaveProperty('@type', 'Person');
    expect(schema.publisher).toHaveProperty('@id', 'https://ben.balter.com/#person');
  });

  it('should include mainEntityOfPage', () => {
    const props = {
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    };
    
    const schema = generateBlogPostingSchema(props);
    
    expect(schema).toHaveProperty('mainEntityOfPage');
    expect(schema.mainEntityOfPage).toHaveProperty('@type', 'WebPage');
    expect(schema.mainEntityOfPage).toHaveProperty('@id', props.url);
  });

  it('should include wordCount when provided', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
      wordCount: 1500,
    });
    
    expect(schema).toHaveProperty('wordCount', 1500);
  });

  it('should omit wordCount when not provided', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    });
    
    expect(schema).not.toHaveProperty('wordCount');
  });

  it('should include inLanguage', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    });
    
    expect(schema).toHaveProperty('inLanguage', 'en');
  });



  it('should include @id reference in author', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    });
    
    expect(schema.author).toHaveProperty('@id', `${siteConfig.url}/#person`);
  });

  it('should include author url and image', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    });
    
    expect(schema.author).toHaveProperty('url', siteConfig.url);
    expect(schema.author).toHaveProperty('image', `${siteConfig.url}/assets/img/headshot.jpg`);
  });

  it('should include isAccessibleForFree', () => {
    const schema = generateBlogPostingSchema({
      title: 'Test Post',
      url: 'https://ben.balter.com/2024/01/15/test/',
      publishedTime: new Date('2024-01-15'),
    });
    
    expect(schema).toHaveProperty('isAccessibleForFree', true);
  });
});

describe('book and reading-list structured data', () => {
  const base = {
    title: 'Test Blog Post',
    url: 'https://ben.balter.com/2024/01/01/test-post/',
    publishedTime: new Date('2024-01-01'),
  };

  it('mentions the book as a Book authored by the site Person when the post is tied to it', async () => {
    const { bookSchema } = await import('./structured-data');
    const schema = generateBlogPostingSchema({ ...base, mentionsBook: true }) as unknown as Record<string, unknown>;
    expect(schema.mentions).toEqual(bookSchema());
    const book = bookSchema() as unknown as Record<string, unknown>;
    expect(book['@type']).toBe('Book');
    expect(book.name).toBe(siteConfig.bookTitle);
    expect(book.url).toBe('https://open-and-async.com/');
    expect(String(book.url)).not.toContain('utm_');
    expect((book.author as Record<string, unknown>)['@id']).toBe(`${siteConfig.url}/#person`);
  });

  it('omits mentions for posts not tied to the book', () => {
    const schema = generateBlogPostingSchema(base) as unknown as Record<string, unknown>;
    expect(schema.mentions).toBeUndefined();
  });

  it('builds an ordered ItemList with absolute URLs', async () => {
    const { generateItemListSchema } = await import('./structured-data');
    const list = generateItemListSchema('Reading list', [
      { name: 'Why URLs', url: '/2015/11/12/why-urls/' },
      { name: 'Why async', url: 'https://ben.balter.com/2022/03/17/why-async/' },
    ]) as unknown as Record<string, unknown>;
    expect(list['@type']).toBe('ItemList');
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Why URLs', url: 'https://ben.balter.com/2015/11/12/why-urls/' },
      { '@type': 'ListItem', position: 2, name: 'Why async', url: 'https://ben.balter.com/2022/03/17/why-async/' },
    ]);
  });
});
