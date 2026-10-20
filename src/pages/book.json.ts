/**
 * Machine-readable facts about the Open and Async book, plus the posts tied to
 * it (`bookRelation` in front matter), for agents.
 *
 * The WebMCP tools (src/scripts/webmcp.ts) read this: `get_book` returns it,
 * and `search_site` / `get_page` use `posts` to add a one-line note to results
 * that are part of the book's story, and only those. Small on purpose, so the
 * tools don't have to download the much larger posts-meta.json for a lookup.
 */

import type { APIRoute } from 'astro';
import { siteConfig } from '../config';
import { BOOK_RELATION_NOTES, type BookInfo, type BookRelation } from '../lib/book-cta';
import { getPostUrl } from '../utils/post-urls';
import { getPublishedPosts } from '../utils/posts';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts({ sorted: true });

  const book: BookInfo = {
    title: siteConfig.bookTitle,
    author: siteConfig.author,
    description: siteConfig.bookDescription,
    published: siteConfig.bookLaunch,
    price: { ebook: siteConfig.bookPrice, paperback: siteConfig.bookPricePaperback },
    url: siteConfig.bookUrlAgent,
    posts: posts.flatMap((post) => {
      const relation: BookRelation | undefined = post.data.bookRelation;
      if (!relation) return [];
      return [{
        url: `${siteConfig.url}${getPostUrl(post.id)}`,
        title: post.data.title,
        relation,
        note: BOOK_RELATION_NOTES[relation],
      }];
    }),
  };

  return new Response(JSON.stringify(book), {
    headers: { 'Content-Type': 'application/json' },
  });
};
