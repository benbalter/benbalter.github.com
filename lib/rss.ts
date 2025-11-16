import { Feed } from 'feed';
import { getAllPosts, getPostUrlParts } from './posts';
import { getSiteConfig } from './config';
import { getClips } from './data';

/**
 * Generate RSS feed XML for blog posts
 * Replaces jekyll-feed plugin functionality
 * Uses the 'feed' library for standards-compliant RSS generation
 */
export function generatePostsFeed(): string {
  const config = getSiteConfig();
  const posts = getAllPosts().slice(0, 20); // Latest 20 posts
  
  const feed = new Feed({
    title: config.title,
    description: config.description,
    id: config.url,
    link: config.url,
    language: 'en-US',
    feedLinks: {
      rss2: `${config.url}/feed.xml`,
    },
    author: {
      name: config.author.name,
    },
    copyright: `Copyright © ${new Date().getFullYear()} ${config.author.name}`,
  });
  
  posts.forEach(post => {
    const { url } = getPostUrlParts(post);
    const fullUrl = `${config.url}${url}`;
    
    feed.addItem({
      title: post.title,
      id: fullUrl,
      link: fullUrl,
      description: post.description || '',
      date: new Date(post.date),
      author: [
        {
          name: config.author.name,
        },
      ],
    });
  });
  
  return feed.rss2();
}

/**
 * Generate RSS feed XML for press clips
 * Replaces custom press-feed.xml functionality
 * Uses the 'feed' library for standards-compliant RSS generation
 */
export function generatePressFeed(): string {
  const config = getSiteConfig();
  const clips = getClips();
  
  const feed = new Feed({
    title: `${config.title} - Press`,
    description: `Press clips for ${config.title}`,
    id: `${config.url}/press`,
    link: `${config.url}/press`,
    language: 'en-US',
    feedLinks: {
      rss2: `${config.url}/press/feed/`,
    },
    author: {
      name: config.author.name,
    },
    copyright: `Copyright © ${new Date().getFullYear()} ${config.author.name}`,
  });
  
  clips.forEach(clip => {
    feed.addItem({
      title: clip.title,
      id: clip.url,
      link: clip.url,
      date: new Date(clip.date),
      author: [
        {
          name: clip.publication,
        },
      ],
    });
  });
  
  return feed.rss2();
}
