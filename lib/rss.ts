import { Feed } from 'feed';
import { getAllPosts, getPostUrlParts } from './posts';
import { getSiteConfig } from './config';
import { getClips } from './data';

/**
 * Create a base Feed instance with common configuration
 */
function createBaseFeed(
  title: string,
  description: string,
  id: string,
  link: string,
  feedUrl: string
): Feed {
  const config = getSiteConfig();
  
  return new Feed({
    title,
    description,
    id,
    link,
    language: 'en-US',
    feedLinks: {
      rss2: feedUrl,
    },
    author: {
      name: config.author.name,
    },
    copyright: `Copyright © ${new Date().getFullYear()} ${config.author.name}`,
  });
}

/**
 * Generate RSS feed XML for blog posts
 * Replaces jekyll-feed plugin functionality
 * Uses the 'feed' library for standards-compliant RSS generation
 */
export function generatePostsFeed(): string {
  const config = getSiteConfig();
  const posts = getAllPosts().slice(0, 20); // Latest 20 posts
  
  const feed = createBaseFeed(
    config.title,
    config.description,
    config.url,
    config.url,
    `${config.url}/feed.xml`
  );
  
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
  
  const feed = createBaseFeed(
    `${config.title} - Press`,
    `Press clips for ${config.title}`,
    `${config.url}/press`,
    `${config.url}/press`,
    `${config.url}/press/feed/`
  );
  
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
