/**
 * GitHub metadata utilities
 * Replaces jekyll-github-metadata plugin functionality
 * 
 * Provides repository metadata from GitHub API or static config
 */

import { getSiteConfig } from './config';

export interface GitHubMetadata {
  owner: string;
  repo: string;
  url: string;
  contributorsUrl: string;
  issuesUrl: string;
  releasesUrl: string;
  compareUrl: (base: string, head: string) => string;
  commitUrl: (sha: string) => string;
  blobUrl: (branch: string, path: string) => string;
  editUrl: (branch: string, path: string) => string;
}

/**
 * Get GitHub repository metadata from config
 * Uses _config.yml repository field
 */
export function getGitHubMetadata(): GitHubMetadata {
  const config = getSiteConfig();
  const [owner, repo] = config.repository.split('/');
  const baseUrl = `https://github.com/${owner}/${repo}`;
  
  return {
    owner,
    repo,
    url: baseUrl,
    contributorsUrl: `${baseUrl}/graphs/contributors`,
    issuesUrl: `${baseUrl}/issues`,
    releasesUrl: `${baseUrl}/releases`,
    compareUrl: (base: string, head: string) => `${baseUrl}/compare/${base}...${head}`,
    commitUrl: (sha: string) => `${baseUrl}/commit/${sha}`,
    blobUrl: (branch: string, path: string) => `${baseUrl}/blob/${branch}/${path}`,
    editUrl: (branch: string, path: string) => `${baseUrl}/edit/${branch}/${path}`,
  };
}

/**
 * Get repository contributors from GitHub API
 * This should be called during build time and cached
 */
export async function fetchContributors(limit: number = 30): Promise<Array<{
  login: string;
  contributions: number;
  avatar_url: string;
  html_url: string;
}>> {
  const config = getSiteConfig();
  const [owner, repo] = config.repository.split('/');
  
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${limit}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Use GITHUB_TOKEN if available for higher rate limits
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );
    
    if (!response.ok) {
      console.warn(`Failed to fetch contributors: ${response.status} ${response.statusText}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Error fetching contributors:', error);
    return [];
  }
}

/**
 * Get repository information from GitHub API
 * This should be called during build time and cached
 */
export async function fetchRepositoryInfo(): Promise<{
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
} | null> {
  const config = getSiteConfig();
  const [owner, repo] = config.repository.split('/');
  
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          }),
        },
      }
    );
    
    if (!response.ok) {
      console.warn(`Failed to fetch repository info: ${response.status} ${response.statusText}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Error fetching repository info:', error);
    return null;
  }
}
