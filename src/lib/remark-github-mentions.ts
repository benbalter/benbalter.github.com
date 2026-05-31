/**
 * Remark plugin to convert @mentions to GitHub profile links.
 *
 * Replicates jekyll-mentions: `@benbalter` → `<a href="https://github.com/benbalter"><strong>@benbalter</strong></a>`.
 *
 * Skips a small denylist of generic English words (e.g. `@mention`, `@mentions`)
 * that match the username regex but are prose, not handles — the @-syntax is
 * commonly used to refer to the concept of mentioning. Linking those produced
 * 404s to nonexistent GitHub users.
 */

import type { Plugin } from 'unified';
import type { Root, PhrasingContent } from 'mdast';
import { findAndReplace, type ReplaceFunction } from 'mdast-util-find-and-replace';

// Common English words that the @-mention regex matches but which refer to the
// concept of mentioning, not a GitHub handle. Extend if more false positives
// surface in lychee reports.
const RESERVED_USERNAMES = new Set([
  'mention',
  'mentions',
  'mentioned',
  'mentioning',
]);

// Same shape as remark-mentions: leading boundary, @, then a GitHub-ish username.
const MENTION_REGEX = /(?:^|\s)@([\da-z][-\da-z_]{0,38})/gi;

export const remarkGitHubMentions: Plugin<[], Root> = () => (tree) => {
  const replace: ReplaceFunction = (value: string, username: string) => {
    if (RESERVED_USERNAMES.has(username.toLowerCase())) {
      return false;
    }

    const leading: PhrasingContent[] = [];
    const atIndex = value.indexOf('@');
    if (atIndex > 0) {
      leading.push({ type: 'text', value: value.substring(0, atIndex) });
    }

    return [
      ...leading,
      {
        type: 'link',
        url: `https://github.com/${username}`,
        children: [
          { type: 'strong', children: [{ type: 'text', value: value.trim() }] },
        ],
      },
    ];
  };

  findAndReplace(tree, [[MENTION_REGEX, replace]]);
};
