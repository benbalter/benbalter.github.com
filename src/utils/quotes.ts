/**
 * Shareable pull-quotes.
 *
 * Quotes are authored inline in posts as `:quote[text]{#id}` directives — the
 * post is the single source of truth (see src/lib/remark-quote-directive.ts for
 * the inline rendering). This module collects those directives from post bodies
 * so the /quotes wall (and its schema) can list every quote and deep-link to it
 * in context. Only quotes in listable (published, non-archived) posts are
 * collected, so every quote has a real, shareable source.
 */

import type { CollectionEntry } from 'astro:content';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import type { Root, Node, RootContent } from 'mdast';
import { visit } from 'unist-util-visit';
import { getPostUrl } from './post-urls';
import { isListablePost } from './post-filtering';
import {
  QUOTE_DIRECTIVE_NAME,
  directiveText,
  quoteDirectiveId,
} from '../lib/remark-quote-directive';

/** A quote extracted from a post body. */
export interface Quote {
  id: string;
  text: string;
  /** Source post content id. */
  post: string;
}

/** A quote joined to its source post's display metadata. */
export interface ResolvedQuote extends Quote {
  postTitle: string;
  postUrl: string;
}

// remark-directive registers the micromark extension at parse time, so `.parse`
// alone yields textDirective nodes — no need to run the full pipeline.
const parser = unified().use(remarkParse).use(remarkDirective);

type DirectiveNode = Node & {
  name?: string;
  attributes?: Record<string, string | null | undefined> | null;
  children?: RootContent[];
};

function extractQuotes(post: CollectionEntry<'posts'>): Quote[] {
  const tree = parser.parse(post.body ?? '') as Root;
  const found: Quote[] = [];
  visit(tree, (node: Node) => {
    const n = node as DirectiveNode;
    if (n.type === 'textDirective' && n.name === QUOTE_DIRECTIVE_NAME) {
      found.push({
        id: quoteDirectiveId(n),
        text: directiveText(n.children),
        post: post.id,
      });
    }
  });
  return found;
}

// Cache per posts-array reference: one parse pass per consuming route, and
// fresh results for independent inputs (e.g. across tests).
const cache = new WeakMap<CollectionEntry<'posts'>[], Quote[]>();

/**
 * Collect every inline quote across listable posts. Throws on a duplicate id
 * (two posts can't both claim `#foo` — it would collide in getStaticPaths).
 */
export function getQuotes(posts: CollectionEntry<'posts'>[]): Quote[] {
  const cached = cache.get(posts);
  if (cached) return cached;

  const quotes: Quote[] = [];
  const seen = new Map<string, string>(); // id -> defining post id

  for (const post of posts.filter(isListablePost)) {
    for (const quote of extractQuotes(post)) {
      const prior = seen.get(quote.id);
      if (prior) {
        throw new Error(
          `Duplicate :quote id "${quote.id}" in ${post.id} ` +
            `(already defined in ${prior}).`
        );
      }
      seen.set(quote.id, post.id);
      quotes.push(quote);
    }
  }

  cache.set(posts, quotes);
  return quotes;
}

/** Collect quotes and join each to its source post's title and URL. */
export function resolveQuotes(posts: CollectionEntry<'posts'>[]): ResolvedQuote[] {
  const byId = new Map(posts.map((post) => [post.id, post]));
  return getQuotes(posts).map((quote) => {
    // The post is guaranteed present — the quote was extracted from it.
    const post = byId.get(quote.post)!;
    return {
      ...quote,
      postTitle: post.data.title,
      postUrl: getPostUrl(post.id),
    };
  });
}
