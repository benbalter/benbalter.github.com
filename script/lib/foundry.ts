/**
 * foundry.ts — shared plumbing for the script/foundry-*.ts tools.
 *
 * These scripts all talk to the same Azure AI Foundry (Azure OpenAI) v1
 * (OpenAI-compatible) surface and grew independently, so the transport, JSON
 * parsing, CLI parsing, corpus loading, and concurrency helpers drifted apart —
 * and the drift caused real bugs (a fence-truncating parseJson, a script with no
 * retry/backoff, inconsistent live-post filtering). This module is the single
 * source of truth for that shared surface. Per-script specifics (model defaults,
 * env-var precedence, prompt shapes, the Post shape each script augments) stay in
 * the scripts.
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

// ---------------------------------------------------------------- CLI args ---
export const hasFlag = (argv: string[], f: string) => argv.includes(f);
export const flagVal = (argv: string[], f: string, d: string) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};

/** Like flagVal, but validated as a positive integer. A bad value (e.g.
 *  `--concurrency abc`) exits with a clear error instead of silently passing NaN
 *  into slice()/pool() and doing something baffling. */
export const intFlag = (argv: string[], f: string, def: number): number => {
  const raw = flagVal(argv, f, String(def));
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) {
    console.error(`\n❌ ${f} must be a positive integer (got "${raw}").\n`);
    process.exit(1);
  }
  return n;
};

// -------------------------------------------------------------- Azure config ---
/** Point any base/endpoint at the chat/completions resource, preserving ?query. */
export function chatEndpoint(raw: string): string {
  const trimmed = raw.replace(/\/$/, '');
  if (!trimmed) return '';
  const [p, query] = trimmed.split('?');
  const withPath = p.endsWith('/chat/completions') ? p : `${p}/chat/completions`;
  return query ? `${withPath}?${query}` : withPath;
}

/** Reasoning-family deployments (o-series, gpt-5*) reject `temperature` and burn
 *  part of the token budget on hidden reasoning before any visible output. */
export const isReasoningModel = (m: string) => /^(o\d|gpt-5)/i.test(m);

/** Exit with guidance if creds are missing (no-op under dry-run). Pass the raw
 *  endpoint/key each script resolved — only their presence is checked. */
export function requireCreds(endpoint: string, apiKey: string, dryRun: boolean): void {
  if (dryRun) return;
  const missing = [
    !endpoint && 'AZURE_API_ENDPOINT (or AZURE_OPENAI_ENDPOINT)',
    !apiKey && 'AZURE_API_KEY (or AZURE_OPENAI_API_KEY)',
  ].filter(Boolean);
  if (missing.length) {
    console.error(`\n❌ Missing env: ${missing.join(', ')}.`);
    console.error('   Try `set -a; . ~/projects/book/.env; set +a`, or use --dry-run.\n');
    process.exit(1);
  }
}

// ------------------------------------------------------------- JSON parsing ---
/** Tolerant JSON parse. With response_format=json_object the content is already
 *  pure JSON, so try that first — critically, do NOT run a fenced-code regex over
 *  the whole string, or a ```code``` block quoted inside a string value gets
 *  mis-extracted and truncates the JSON. Only match a fence anchored to the ends. */
export function parseJson<T = any>(text: string): T {
  const t = (text ?? '').trim();
  if (!t) throw new Error('model returned empty content (no JSON to parse)');
  try {
    return JSON.parse(t) as T;
  } catch {
    /* fall through to recovery */
  }
  // Whole-string markdown fence (anchored, so inner body fences don't match).
  const fence = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) {
    try {
      return JSON.parse(fence[1]) as T;
    } catch {
      /* fall through */
    }
  }
  // Last resort: outermost bracket/brace span.
  const start = t.search(/[[{]/);
  const end = Math.max(t.lastIndexOf(']'), t.lastIndexOf('}'));
  if (start >= 0 && end > start) return JSON.parse(t.slice(start, end + 1)) as T;
  throw new Error(`could not parse JSON from model output: ${t.slice(0, 200)}…`);
}

// --------------------------------------------------------------- chat client ---
export type Msg = { role: 'system' | 'user' | 'assistant'; content: string };

export interface Usage {
  promptTokens: number;
  completionTokens: number;
  apiCalls: number;
}

export interface ChatOpts {
  maxTokens?: number;
  temperature?: number;
  json?: boolean;
  stub?: string;
  /** Throw when the model truncates (finish_reason=length) instead of returning
   *  partial content — callers that JSON.parse the result want this on. */
  failOnLength?: boolean;
}

export interface FoundryClientOpts {
  endpoint: string;
  apiKey: string;
  model: string;
  dryRun?: boolean;
  /** Floor on max_completion_tokens for reasoning models, which spend hidden
   *  tokens before visible output. Default 16000 (matches most scripts). */
  reasoningMinTokens?: number;
  /** Abort a single request that hasn't responded in this many ms, so a hung
   *  socket can't stall the whole run. Treated like a network error → retried.
   *  Default 120000 (reasoning models are slow). */
  timeoutMs?: number;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Create an Azure chat client with a live `usage` counter. One `chat()` call =
 *  one completion, with network + 429/5xx backoff honoring Retry-After. */
export function createFoundryClient(cfg: FoundryClientOpts): {
  chat: (messages: Msg[], opts?: ChatOpts) => Promise<string>;
  usage: Usage;
} {
  const { endpoint, apiKey, model, dryRun = false, reasoningMinTokens = 16000, timeoutMs = 120_000 } = cfg;
  const usage: Usage = { promptTokens: 0, completionTokens: 0, apiCalls: 0 };

  async function chat(messages: Msg[], opts: ChatOpts = {}): Promise<string> {
    const { maxTokens = 4000, temperature, json = false, stub = '', failOnLength = false } = opts;
    if (dryRun) return stub; // exercise the pipeline offline, no spend

    const reasoning = isReasoningModel(model);
    const body: Record<string, unknown> = {
      model,
      messages,
      max_completion_tokens: reasoning ? Math.max(maxTokens, reasoningMinTokens) : maxTokens,
    };
    // Reasoning models reject a non-default temperature; skip it entirely for them.
    if (!reasoning && temperature !== undefined) body.temperature = temperature;
    if (json) body.response_format = { type: 'json_object' };

    let lastErr = '';
    for (let attempt = 0; attempt < 5; attempt++) {
      let res: Response;
      try {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(timeoutMs), // abort → caught below → retried
        });
      } catch (e) {
        lastErr = `network: ${(e as Error).message}`;
        await sleep(1500 * 2 ** attempt);
        continue;
      }
      // Back off on throttling (429) / transient (5xx). Honor Retry-After if given.
      if (res.status === 429 || res.status >= 500) {
        const ra = Number(res.headers.get('retry-after')) || 0;
        lastErr = `${res.status} ${res.statusText}`;
        await sleep(ra ? ra * 1000 : 1500 * 2 ** attempt);
        continue;
      }
      if (!res.ok) {
        throw new Error(`Azure API ${res.status} ${res.statusText}: ${await res.text()}`);
      }
      const data: any = await res.json();
      usage.apiCalls++;
      if (data.usage) {
        usage.promptTokens += data.usage.prompt_tokens ?? 0;
        usage.completionTokens += data.usage.completion_tokens ?? 0;
      }
      const choice = data.choices?.[0];
      if (failOnLength && choice?.finish_reason === 'length') {
        throw new Error('finish_reason=length (raise maxTokens or shorten input)');
      }
      return choice?.message?.content ?? '';
    }
    throw new Error(`Azure API gave up after retries: ${lastErr}`);
  }

  return { chat, usage };
}

/** Ballpark spend from token usage. Rates are $/1M tokens (Azure rate varies). */
export const estCost = (usage: Usage, inRate: number, outRate: number): string =>
  `$${((usage.promptTokens / 1e6) * inRate + (usage.completionTokens / 1e6) * outRate).toFixed(2)} (est.)`;

// ------------------------------------------------------------- corpus loading ---
export interface BasePost {
  id: string;
  date: string;
  title: string;
  description: string;
  body: string;
}

/** Map a post id (`YYYY-MM-DD-slug`) to its published URL `/YYYY/MM/DD/slug/`. */
export function postUrl(id: string): string {
  const m = id.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  return m ? `/${m[1]}/${m[2]}/${m[3]}/${m[4]}/` : `/${id}/`;
}

/** Load live posts from src/content/posts, in filename (chronological) order.
 *  Skips drafts (published:false), archived, and redirect_to stubs — the single
 *  source of truth for "which posts count". Callers augment BasePost as needed. */
export function loadPosts(root: string, opts: { skipEmpty?: boolean } = {}): BasePost[] {
  const files = glob.sync('src/content/posts/*.{md,mdx}', { cwd: root, absolute: true }).sort();
  const posts: BasePost[] = [];
  for (const file of files) {
    const parsed = matter(fs.readFileSync(file, 'utf-8'));
    const fm = parsed.data as Record<string, any>;
    if (fm.published === false || fm.archived === true || fm.redirect_to) continue;
    if (opts.skipEmpty && !parsed.content.trim()) continue;
    const id = path.basename(file).replace(/\.(md|mdx)$/, '');
    posts.push({
      id,
      date: id.slice(0, 10),
      title: fm.title ?? id,
      description: fm.description ?? '',
      body: parsed.content,
    });
  }
  return posts;
}

// --------------------------------------------------------------- concurrency ---
/** Run `fn` over `items` with at most `size` in flight; results keep input order. */
export async function pool<T, R>(
  items: T[],
  size: number,
  fn: (t: T, i: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker));
  return results;
}
