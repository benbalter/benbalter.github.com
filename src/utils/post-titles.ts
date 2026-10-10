import { getCollection, type CollectionEntry } from 'astro:content';
import { getPostUrl } from './post-urls';

/**
 * Every post's title keyed by its URL path (/YYYY/MM/DD/slug/), for turning a
 * list of post URLs (front matter `posts:`/`roles:`) into real titles.
 */
export async function getPostTitlesByUrl(): Promise<Map<string, string>> {
  const posts = await getCollection('posts');
  return new Map(posts.map((post: CollectionEntry<'posts'>) => [getPostUrl(post.id), post.data.title]));
}

/** A site URL as a path: drops the https://ben.balter.com origin if present. */
export function sitePath(url: string): string {
  return url.replace(/^https?:\/\/ben\.balter\.com/, '');
}
