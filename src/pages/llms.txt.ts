/**
 * llms.txt - Information for AI Assistants
 * 
 * Generates llms.txt with site information, recent posts, and resources.
 * This file helps AI assistants understand the site structure and content.
 * This replaces the Jekyll template version at the root.
 * 
 * Reference: https://llmstxt.org/
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config';

// Constants
const EXCERPT_LENGTH = 100;
const CULTURE_POST_ID = '2021-02-01-what-to-read-before-starting-or-interviewing-at-github';

/**
 * Generate a URL path from a post ID
 * Post ID format: YYYY-MM-DD-slug.md or .mdx
 * URL format: /YYYY/MM/DD/slug/
 */
function getPostUrl(postId: string): string {
  const postIdWithoutExt = postId.replace(/\.mdx?$/, '');
  const dateMatch = postIdWithoutExt.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  
  if (dateMatch) {
    const [, year, month, day, slug] = dateMatch;
    return `/${year}/${month}/${day}/${slug}/`;
  }
  // Fallback for unexpected formats
  return `/${postIdWithoutExt}/`;
}

export const GET: APIRoute = async () => {
  // Fetch all published posts, sorted by date (newest first)
  const allPosts = await getCollection('posts', ({ data }) => data.published !== false);
  const sortedPosts = allPosts.sort((a, b) => {
    // Post IDs are like "2010-09-12-wordpress-resume-plugin.md"
    // Extract YYYY-MM-DD from the beginning
    const dateA = new Date(a.id.substring(0, 10));
    const dateB = new Date(b.id.substring(0, 10));
    return dateB.getTime() - dateA.getTime();
  });
  const recentPosts = sortedPosts.slice(0, 10);

  // Fetch pages from content collection (only has some pages like resume)
  const allPages = await getCollection('pages');
  const resumePage = allPages.find(p => p.data.permalink === '/resume/');

  // Get the GitHub culture post and its associated posts
  const culturePost = allPosts.find(p => p.id.includes(CULTURE_POST_ID));

  // Mini bio - extracted from About page content (simplified for plain text)
  const miniBio = `Ben Balter is the Director of Hubber Enablement within the Office of the COO at GitHub, the world's largest software development platform, ensuring all Hubbers can do their best (remote) work. Previously, he served as the Director of Technical Business Operations, and as Chief of Staff for Security, he managed the office of the Chief Security Officer, improving overall business effectiveness of the Security organization through portfolio management, strategy, planning, culture, and values.`;

  // Build the content
  let content = `# ${siteConfig.name}\n\n`;
  content += `> ${siteConfig.description}\n\n`;
  content += `${miniBio}\n\n`;

  content += `## About and Professional Information\n\n`;
  content += `* [About](${siteConfig.url}/about/): Learn more about Ben Balter's professional background and experience at GitHub.\n`;
  
  if (resumePage) {
    content += `* [${resumePage.data.title}](${siteConfig.url}${resumePage.data.permalink}): ${resumePage.data.description}\n`;
  }
  
  content += `* [Contact](${siteConfig.url}/contact/): Contact information and social media links for Ben Balter.\n`;

  content += `\n## Recent Blog Posts\n\n`;
  
  for (const post of recentPosts) {
    const postUrl = getPostUrl(post.id);
    
    // Get description or excerpt (first EXCERPT_LENGTH characters of body)
    let description = post.data.description;
    if (!description) {
      const excerpt = post.body
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .replace(/[#*`]/g, '')
        .trim()
        .substring(0, EXCERPT_LENGTH);
      description = excerpt + (excerpt.length >= EXCERPT_LENGTH ? '...' : '');
    }
    
    content += `* [${post.data.title}](${siteConfig.url}${postUrl}): ${description}\n`;
  }

  // Add GitHub Culture section if the post exists
  if (culturePost) {
    content += `\n## GitHub Culture\n\n`;
    content += `Understanding GitHub's unique culture and communication patterns:\n\n`;
    
    // Link to the main culture post
    const cultureUrl = getPostUrl(culturePost.id);
    content += `* [${culturePost.data.title}](${siteConfig.url}${cultureUrl}): ${culturePost.data.description}\n`;
    
    // Try to add individual posts if available
    if (culturePost.data.posts && Array.isArray(culturePost.data.posts)) {
      for (const linkedPostUrl of culturePost.data.posts) {
        const linkedPost = allPosts.find(p => {
          const postPath = getPostUrl(p.id);
          return postPath === linkedPostUrl;
        });
        
        if (linkedPost) {
          content += `  * [${linkedPost.data.title}](${siteConfig.url}${linkedPostUrl}): ${linkedPost.data.description}\n`;
        }
      }
    }
  }

  content += `\n## Site Information\n\n`;
  content += `* [RSS Feed](${siteConfig.url}/feed.xml): Subscribe to all posts\n`;
  content += `* [Site Source Code](https://github.com/${siteConfig.githubRepo}): This site's source code on GitHub (Jekyll with experimental Astro implementation)\n`;
  content += `* [Fine Print](${siteConfig.url}/fine-print/): Legal information and site policies\n`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
