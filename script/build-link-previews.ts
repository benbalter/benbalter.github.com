/**
 * Cache GitHub repo and Wikipedia article metadata for link preview cards.
 *
 * Scans posts for links to GitHub repo roots and English Wikipedia articles,
 * fetches what each card shows, and writes src/data/link-previews.json, which
 * is committed so builds never call third-party APIs (and readers' browsers
 * never do either). Served at /link-previews.json for src/scripts/link-previews.ts.
 *
 * Incremental: only links without a cached entry are fetched, and entries no
 * post links to anymore are dropped. Star counts drift until a --refresh.
 *
 * Usage:
 *   npm run link-previews              # fetch new links, prune unused ones
 *   npm run link-previews -- --refresh # refetch everything (fresh star counts)
 *
 * Uses GITHUB_TOKEN if set, else `gh auth token`, else GitHub's anonymous
 * rate limit (60 requests an hour).
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  externalPreviewKey,
  type ExternalPreview,
  type ExternalPreviewCache,
} from '../src/utils/link-preview-keys';

const ROOT = join(import.meta.dirname, '..');
const POSTS_DIR = join(ROOT, 'src/content/posts');
const OUTPUT = join(ROOT, 'src/data/link-previews.json');

const USER_AGENT = 'ben.balter.com link previews (https://github.com/benbalter/benbalter.github.com)';
const CONCURRENCY = 4;
const EXTRACT_MAX = 280;

/**
 * URLs in Markdown/MDX, keeping balanced parentheses (Wikipedia titles use them)
 * and apostrophes ("Godwin's_law"). Markdown-escaped parens (`\(`) are
 * unescaped before keying, the way they render.
 */
const URL_PATTERN = /https?:\/\/(?:[^\s()<>"\]]|\\?\([^\s()<>"]*\\?\))+/g;

function githubToken(): string | undefined {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || undefined;
  } catch {
    return undefined;
  }
}

/** Every previewable key linked from a post */
function linkedKeys(): Set<string> {
  const keys = new Set<string>();
  for (const file of readdirSync(POSTS_DIR)) {
    if (!/\.mdx?$/.test(file)) continue;
    const body = readFileSync(join(POSTS_DIR, file), 'utf8');
    for (const [url] of body.matchAll(URL_PATTERN)) {
      const key = externalPreviewKey(url.replace(/\\([()])/g, '$1'));
      if (key) keys.add(key);
    }
  }
  return keys;
}

/** The first sentence or two of a Wikipedia extract, at most EXTRACT_MAX characters */
export function trimExtract(extract: string): string {
  const text = extract.replace(/\s+/g, ' ').trim();
  // Split after sentence punctuation, including any closing quote or paren
  const sentences = text.split(/(?<=[.!?]["'”’)\]]*)\s+/);
  let out = '';
  for (const sentence of sentences) {
    if (out && `${out} ${sentence}`.length > EXTRACT_MAX) break;
    out = out ? `${out} ${sentence}` : sentence;
  }
  return out.length > EXTRACT_MAX ? `${out.slice(0, EXTRACT_MAX - 1).replace(/\s+\S*$/, '')}…` : out;
}

/** The fields used from GET /repos/{owner}/{repo} */
interface GitHubRepoResponse {
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  archived: boolean;
}

/** The fields used from Wikipedia's REST page summary */
interface WikipediaSummaryResponse {
  type: string;
  title: string;
  description?: string;
  extract?: string;
}

async function getJson<T>(url: string, headers: Record<string, string>): Promise<{ status: number; body: T | null }> {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT, ...headers }, signal: AbortSignal.timeout(15_000) });
  return { status: response.status, body: response.ok ? ((await response.json()) as T) : null };
}

async function fetchGitHub(key: string, token: string | undefined): Promise<ExternalPreview | null> {
  const repo = key.slice('github:'.length);
  const { status, body } = await getJson<GitHubRepoResponse>(`https://api.github.com/repos/${repo}`, {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });
  if (status === 403 || status === 429) throw new Error(`GitHub rate limit (HTTP ${status})`);
  if (!body) return null;
  return {
    kind: 'github',
    title: body.full_name,
    ...(body.description ? { description: body.description.trim() } : {}),
    ...(body.language ? { language: body.language } : {}),
    stars: body.stargazers_count ?? 0,
    ...(body.archived ? { archived: true } : {}),
  };
}

async function fetchWikipedia(key: string): Promise<ExternalPreview | null> {
  const title = key.slice('wikipedia:'.length);
  const { body } = await getJson<WikipediaSummaryResponse>(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}?redirect=true`,
    { Accept: 'application/json' },
  );
  if (!body || body.type === 'disambiguation' || !body.extract) return null;
  return {
    kind: 'wikipedia',
    title: body.title,
    ...(body.description ? { description: body.description } : {}),
    extract: trimExtract(body.extract),
  };
}

async function main() {
  const refresh = process.argv.includes('--refresh');
  const existing: ExternalPreviewCache = existsSync(OUTPUT)
    ? JSON.parse(readFileSync(OUTPUT, 'utf8'))
    : { generatedAt: '', previews: {} };

  const keys = [...linkedKeys()].sort();
  const previews: Record<string, ExternalPreview> = {};
  const todo: string[] = [];
  for (const key of keys) {
    const cached = existing.previews[key];
    if (cached && !refresh) previews[key] = cached;
    else todo.push(key);
  }

  const token = todo.some((key) => key.startsWith('github:')) ? githubToken() : undefined;
  let fetched = 0;
  const missing: string[] = [];

  const queue = [...todo];
  async function worker() {
    for (let key = queue.shift(); key; key = queue.shift()) {
      try {
        const preview = key.startsWith('github:') ? await fetchGitHub(key, token) : await fetchWikipedia(key);
        if (preview) {
          previews[key] = preview;
          fetched++;
        } else {
          missing.push(key);
        }
      } catch (error) {
        // Keep the stale entry rather than losing it to a transient failure
        if (existing.previews[key]) previews[key] = existing.previews[key];
        console.warn(`link-previews: ${key}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const sorted = Object.fromEntries(Object.entries(previews).sort(([a], [b]) => a.localeCompare(b)));
  const pruned = Object.keys(existing.previews).filter((key) => !keys.includes(key)).length;
  const changed = JSON.stringify(sorted) !== JSON.stringify(existing.previews);
  const output: ExternalPreviewCache = {
    generatedAt: changed ? new Date().toISOString() : existing.generatedAt,
    previews: sorted,
  };
  writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`);

  console.log(
    `link-previews: ${Object.keys(sorted).length} cached (${fetched} fetched, ${pruned} pruned, ${missing.length} not found or skipped).`,
  );
  if (missing.length) console.log(`  not found or skipped: ${missing.join(', ')}`);
}

await main();
