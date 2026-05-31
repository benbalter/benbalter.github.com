import type { CollectionEntry } from 'astro:content';
import { getPostUrl, getDateFromSlug, formatPostDate, formatISODate } from './post-urls';
import { calculateReadingTime } from './reading-time';

export interface PostMetadata {
  postUrl: string;
  date: string;
  isoDate: string;
  readingTime: number;
}

export function getPostMetadata(post: CollectionEntry<'posts'>): PostMetadata {
  const postDate = getDateFromSlug(post.id);
  return {
    postUrl: getPostUrl(post.id),
    date: formatPostDate(postDate),
    isoDate: formatISODate(postDate),
    readingTime: calculateReadingTime(post.body),
  };
}
