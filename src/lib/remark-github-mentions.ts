/**
 * Remark plugin to convert @mentions to GitHub profile links
 * 
 * This plugin replicates the functionality of the jekyll-mentions plugin
 * by converting @username syntax to links to GitHub user profiles.
 * 
 * Examples:
 * - @benbalter → <a href="https://github.com/benbalter">@benbalter</a>
 * - @defunkt → <a href="https://github.com/defunkt">@defunkt</a>
 * 
 * Based on remark-mentions with custom configuration for GitHub.
 */

import mentions from 'remark-mentions';

/**
 * Configure remark-mentions to link to GitHub profiles
 * 
 * @returns Configured remark-mentions plugin
 */
export function remarkGitHubMentions() {
  // @ts-ignore - remark-mentions has incomplete type definitions
  return mentions({
    usernameLink: (username: string) => `https://github.com/${username}`,
  });
}
