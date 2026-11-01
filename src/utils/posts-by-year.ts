import type { CollectionEntry } from 'astro:content';
import { getDateFromSlug } from './post-urls';

export interface PostsByYear {
  /** Years present, newest first */
  years: number[];
  /** Posts for each year, in the order they were given */
  postsByYear: Map<number, CollectionEntry<'posts'>[]>;
}

/**
 * Groups posts by the year in their slug, for year-sectioned index pages
 * (/posts/ and /github-years/). Pass posts already sorted the way each year
 * should list them.
 */
export function groupPostsByYear(posts: CollectionEntry<'posts'>[]): PostsByYear {
  const postsByYear = new Map<number, CollectionEntry<'posts'>[]>();
  for (const post of posts) {
    const year = getDateFromSlug(post.id).getFullYear();
    if (!postsByYear.has(year)) {
      postsByYear.set(year, []);
    }
    postsByYear.get(year)!.push(post);
  }
  const years = [...postsByYear.keys()].sort((a, b) => b - a);
  return { years, postsByYear };
}
