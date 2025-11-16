/**
 * GitHub metadata utilities
 * Replaces jekyll-github-metadata plugin functionality
 * 
 * Provides repository metadata from GitHub API using Octokit
 */

import { Octokit } from '@octokit/rest';
import { getSiteConfig } from './config';

/**
 * Get Octokit instance with optional authentication
 */
function getOctokit(): Octokit {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
}

/**
 * Parse repository owner and name from config
 * Returns tuple of [owner, repo]
 */
function parseRepository(): [string, string] {
  const config = getSiteConfig();
  const [owner, repo] = config.repository.split('/');
  return [owner, repo];
}

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
  const parts = config.repository.split('/');
  const owner = parts[0] || '';
  const repo = parts[1] || '';
  const [owner, repo] = parseRepository();
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
 * Get repository contributors from GitHub API using Octokit
 * This should be called during build time and cached
 */
export async function fetchContributors(limit: number = 30): Promise<Array<{
  login: string;
  contributions: number;
  avatar_url: string;
  html_url: string;
}>> {
  const config = getSiteConfig();
  const parts = config.repository.split('/');
  const owner = parts[0] || '';
  const repo = parts[1] || '';
  const [owner, repo] = parseRepository();
  
  try {
    const octokit = getOctokit();
    const { data } = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: limit,
    });
    
    return data.map(contributor => ({
      login: contributor.login || '',
      contributions: contributor.contributions,
      avatar_url: contributor.avatar_url || '',
      html_url: contributor.html_url || '',
    }));
  } catch (error) {
    console.warn('Error fetching contributors with Octokit:', error);
    return [];
  }
}

/**
 * Get repository information from GitHub API using Octokit
 * This should be called during build time and cached
 */
export async function fetchRepositoryInfo(): Promise<{
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
} | null> {
  const config = getSiteConfig();
  const parts = config.repository.split('/');
  const owner = parts[0] || '';
  const repo = parts[1] || '';
  const [owner, repo] = parseRepository();
  
  try {
    const octokit = getOctokit();
    const { data } = await octokit.repos.get({
      owner,
      repo,
    });
    
    return {
      name: data.name,
      full_name: data.full_name,
      description: data.description,
      html_url: data.html_url,
      stargazers_count: data.stargazers_count,
      forks_count: data.forks_count,
      open_issues_count: data.open_issues_count,
      watchers_count: data.watchers_count,
      default_branch: data.default_branch,
      created_at: data.created_at,
      updated_at: data.updated_at,
      pushed_at: data.pushed_at,
    };
  } catch (error) {
    console.warn('Error fetching repository info with Octokit:', error);
    return null;
  }
}
