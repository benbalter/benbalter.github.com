/**
 * Resume — Selected Writing
 *
 * Resolves the site's curated "Popular Posts" list (`popularPostSlugs`, the same
 * source the homepage renders above the fold) into resume-ready entries. Sharing
 * one source keeps the resume's Selected Writing section in lockstep with the
 * homepage and every export (HTML, PDF, Markdown, Word) in lockstep with the page.
 */

import type { CollectionEntry } from 'astro:content';
import { popularPostSlugs } from '../config';
import { getPostUrlOrNull } from './post-urls';

export interface ResumeWritingItem {
  title: string;
  /** Root-relative post URL, e.g. /2022/03/17/why-async/ */
  path: string;
  /** Four-digit publication year, parsed from the post id. */
  year: string;
}

/**
 * Resolve `popularPostSlugs` against a set of posts, preserving the curated
 * order from config. Slugs that don't resolve to a post (or whose id isn't a
 * dated slug) are skipped rather than rendered broken.
 */
export function resolvePopularPosts(posts: CollectionEntry<'posts'>[]): ResumeWritingItem[] {
  const bySlug = new Map(posts.map((post) => [post.id, post]));

  return popularPostSlugs
    .map((slug) => {
      const post = bySlug.get(slug);
      if (!post) return null;
      const path = getPostUrlOrNull(post.id);
      if (!path) return null;
      return { title: post.data.title, path, year: post.id.slice(0, 4) };
    })
    .filter((item): item is ResumeWritingItem => item !== null);
}
