#!/usr/bin/env tsx
/**
 * foundry-interlinks.ts — corpus-level interlinking audit of the published archive.
 *
 * The per-post QA pass (script/foundry-qa.ts) reads one post at a time, so it
 * structurally can't see the whole catalog. This does the complementary thing:
 * for each post, it shows the model the FULL catalog and asks where an internal
 * link to another post would genuinely help the reader — the "link generously to
 * related posts" guidance in src/content/CLAUDE.md, applied at scale. Report-only;
 * it never edits a post. Suggestions are validated in code (anchor must already
 * exist in the post, target must be a real post, not already linked).
 *
 * Transport mirrors script/foundry-drafts.ts: Azure v1 (OpenAI-compatible) surface,
 * header `api-key`, model-in-body, `max_completion_tokens`, native fetch, no SDK.
 *
 * Usage (env matches the book project — `. ~/projects/book/.env` just works):
 *   set -a; . ~/projects/book/.env; set +a
 *   npx tsx script/foundry-interlinks.ts --dry-run         # no spend, prove wiring
 *   npx tsx script/foundry-interlinks.ts --top 30          # 30 newest posts
 *   npx tsx script/foundry-interlinks.ts --all --model gpt-5.4 --concurrency 5
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

// ---------------------------------------------------------------- CLI args ---
const argv = process.argv.slice(2);
const hasFlag = (f: string) => argv.includes(f);
const flagVal = (f: string, d: string) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const DRY_RUN = hasFlag('--dry-run');
const ALL = hasFlag('--all');
const TOP = parseInt(flagVal('--top', '25'), 10);
const CONCURRENCY = parseInt(flagVal('--concurrency', '5'), 10);
const MAX_SUGGESTIONS = 4;

// -------------------------------------------------------------- Azure config ---
const ENDPOINT_RAW =
  process.env.AZURE_OPENAI_ENDPOINT ||
  process.env.AZURE_AI_ENDPOINT ||
  process.env.AZURE_API_ENDPOINT ||
  '';
const API_KEY =
  process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY || process.env.AZURE_AI_KEY || '';
const MODEL = process.env.AZURE_OPENAI_DEPLOYMENT || process.env.AI_MODEL || flagVal('--model', 'gpt-4.1');

function chatEndpoint(raw: string): string {
  const trimmed = raw.replace(/\/$/, '');
  if (!trimmed) return '';
  const [p, q] = trimmed.split('?');
  const withPath = p.endsWith('/chat/completions') ? p : `${p}/chat/completions`;
  return q ? `${withPath}?${q}` : withPath;
}
const ENDPOINT = chatEndpoint(ENDPOINT_RAW);
const isReasoningModel = (m: string) => /^(o\d|gpt-5)/i.test(m);

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'audit');

let promptTokens = 0;
let completionTokens = 0;
let apiCalls = 0;

type Msg = { role: 'system' | 'user'; content: string };

async function chat(messages: Msg[], opts: { json?: boolean; stub?: string } = {}): Promise<string> {
  const { json = false, stub = '' } = opts;
  if (DRY_RUN) return stub;
  const reasoning = isReasoningModel(MODEL);
  const body: Record<string, unknown> = {
    model: MODEL,
    messages,
    max_completion_tokens: reasoning ? 16000 : 4000,
  };
  if (!reasoning) body.temperature = 0.3;
  if (json) body.response_format = { type: 'json_object' };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  let res: Response;
  for (let attempt = 0; ; attempt++) {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    // Back off on throttling (429) / transient (503). Honor Retry-After if given.
    if ((res.status === 429 || res.status === 503) && attempt < 6) {
      const ra = parseInt(res.headers.get('retry-after') || '', 10);
      await sleep(ra > 0 ? ra * 1000 : Math.min(3000 * 2 ** attempt, 40000));
      continue;
    }
    break;
  }
  if (!res.ok) throw new Error(`Azure API ${res.status}: ${await res.text()}`);
  const data: any = await res.json();
  apiCalls++;
  if (data.usage) {
    promptTokens += data.usage.prompt_tokens ?? 0;
    completionTokens += data.usage.completion_tokens ?? 0;
  }
  return data.choices?.[0]?.message?.content ?? '';
}

/** Tolerant JSON parse. With response_format=json_object the content is already
 *  pure JSON, so try that first — critically, do NOT run a fenced-code regex over
 *  the whole string, or a ```code``` block quoted from a post body gets mis-extracted. */
function parseJson<T = any>(text: string): T {
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

// ------------------------------------------------------------- corpus loading ---
interface Post {
  id: string;
  date: string;
  url: string; // /YYYY/MM/DD/slug/
  title: string;
  description: string;
  body: string;
  bodyLower: string;
  linkedTargets: Set<string>; // normalized /YYYY/MM/DD/slug/ this post already links to
}

function postUrl(id: string): string {
  const m = id.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (!m) return `/${id}/`;
  const [, y, mo, d, slug] = m;
  return `/${y}/${mo}/${d}/${slug}/`;
}

/** Normalize any internal link (absolute or relative) to /YYYY/MM/DD/slug/ or null. */
function normalizeInternal(href: string): string | null {
  const m = href.match(/(?:ben\.balter\.com)?(\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+)\/?/i);
  return m ? `${m[1]}/` : null;
}

function loadCorpus(): Post[] {
  const files = glob.sync('src/content/posts/*.{md,mdx}', { cwd: ROOT, absolute: true }).sort();
  const posts: Post[] = [];
  for (const file of files) {
    const parsed = matter(fs.readFileSync(file, 'utf-8'));
    const fm = parsed.data as Record<string, any>;
    if (fm.published === false || fm.archived === true || fm.redirect_to) continue;
    const id = path.basename(file).replace(/\.(md|mdx)$/, '');
    const body = parsed.content;
    const linked = new Set<string>();
    for (const m of body.matchAll(/\]\(([^)]+)\)|href="([^"]+)"/g)) {
      const n = normalizeInternal(m[1] || m[2] || '');
      if (n) linked.add(n);
    }
    posts.push({
      id,
      date: id.slice(0, 10),
      url: postUrl(id),
      title: fm.title ?? id,
      description: fm.description ?? '',
      body,
      bodyLower: body.toLowerCase(),
      linkedTargets: linked,
    });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date)); // newest first
}

// --------------------------------------------------------------- interlinking ---
interface Suggestion {
  anchor: string;
  targetUrl: string;
  targetTitle: string;
  reason: string;
}

function catalogIndex(posts: Post[]): string {
  return posts
    .map((p) => `- [${p.title}](${p.url}) — ${p.description.slice(0, 110)}`)
    .join('\n');
}

async function auditPost(post: Post, catalog: string, urlSet: Set<string>): Promise<Suggestion[]> {
  const stub = JSON.stringify({
    suggestions: [
      { anchor: 'dry run', targetUrl: '/2022/03/17/why-async/', targetTitle: 'Why async', reason: 'stub' },
    ],
  });
  const text = await chat(
    [
      {
        role: 'system',
        content:
          "You improve internal linking on Ben Balter's blog. Given one post and the full catalog of his other posts, find places where linking to another specific post would genuinely help the reader (deepen a concept, support a claim, offer a next read). Be conservative: quality over quantity, only truly relevant links.",
      },
      {
        role: 'user',
        content: `POST: "${post.title}" (${post.url})\n\n${post.body.slice(0, 9000)}\n\n===== CATALOG (other posts you may link to) =====\n${catalog}\n\nSuggest up to ${MAX_SUGGESTIONS} internal links to ADD to this post. HARD RULES:\n- "anchor" MUST be an exact phrase that ALREADY appears verbatim in the post body above (so it can be turned into a link without rewriting).\n- "targetUrl" MUST be copied exactly from a catalog entry.\n- Do NOT suggest linking to the post itself.\n- Prefer strong topical matches; if nothing is clearly worth linking, return an empty list.\nReturn JSON: {"suggestions":[{"anchor":"exact phrase from the post","targetUrl":"/YYYY/MM/DD/slug/","targetTitle":"catalog title","reason":"one line: why this helps the reader"}]}`,
      },
    ],
    { json: true, stub }
  );
  const raw = parseJson<{ suggestions: Suggestion[] }>(text).suggestions ?? [];
  // Validate in code — the model is unreliable about its own hard rules.
  return raw.filter(
    (s) =>
      s.anchor &&
      s.targetUrl &&
      urlSet.has(s.targetUrl) &&
      s.targetUrl !== post.url &&
      !post.linkedTargets.has(s.targetUrl) &&
      post.bodyLower.includes(s.anchor.toLowerCase())
  );
}

function writePostFile(post: Post, suggestions: Suggestion[]) {
  const lines = [`# Interlink suggestions — ${post.title}`, '', `Post: \`${post.url}\``, ''];
  if (!suggestions.length) {
    lines.push('_No confident interlink opportunities found._');
  } else {
    for (const s of suggestions) {
      lines.push(`- Link **“${s.anchor}”** → [${s.targetTitle}](${s.targetUrl})`);
      lines.push(`  - ${s.reason}`);
    }
  }
  fs.writeFileSync(path.join(OUT_DIR, `${post.id}.md`), lines.join('\n') + '\n');
}

// --------------------------------------------------------------- concurrency ---
async function pool<T>(items: T[], n: number, fn: (t: T, i: number) => Promise<void>) {
  let idx = 0;
  const workers = Array.from({ length: Math.min(n, items.length) }, async () => {
    while (idx < items.length) {
      const i = idx++;
      await fn(items[i], i);
    }
  });
  await Promise.all(workers);
}

function estCost(): string {
  const cost = (promptTokens / 1e6) * 2.5 + (completionTokens / 1e6) * 10;
  return `~$${cost.toFixed(2)} (est.)`;
}

// ----------------------------------------------------------------------- main ---
function requireCreds() {
  if (DRY_RUN) return;
  const missing = [!ENDPOINT && 'AZURE_API_ENDPOINT', !API_KEY && 'AZURE_API_KEY'].filter(Boolean);
  if (missing.length) {
    console.error(`\n❌ Missing env: ${missing.join(', ')}. Try \`set -a; . ~/projects/book/.env; set +a\`.\n`);
    process.exit(1);
  }
}

async function main() {
  console.log(`\n🔗 foundry-interlinks ${DRY_RUN ? '(DRY RUN)' : ''} · model=${MODEL}\n`);
  requireCreds();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const all = loadCorpus();
  const urlSet = new Set(all.map((p) => p.url));
  const catalog = catalogIndex(all);
  const targets = ALL ? all : all.slice(0, TOP);
  console.log(`📚 ${all.length} posts in catalog · auditing ${targets.length} ${ALL ? '(all)' : `(newest ${TOP})`}`);

  const summary: { post: Post; suggestions: Suggestion[] }[] = [];
  let done = 0;
  await pool(targets, DRY_RUN ? 1 : CONCURRENCY, async (post) => {
    try {
      const suggestions = await auditPost(post, catalog, urlSet);
      writePostFile(post, suggestions);
      summary.push({ post, suggestions });
    } catch (e) {
      console.log(`  ✗ ${post.id}: ${(e as Error).message}`);
      summary.push({ post, suggestions: [] });
    }
    done++;
    if (done % 10 === 0 || done === targets.length) console.log(`  ...${done}/${targets.length}`);
  });

  // Aggregate report, most-opportunities first.
  summary.sort((a, b) => b.suggestions.length - a.suggestions.length);
  const totalLinks = summary.reduce((n, s) => n + s.suggestions.length, 0);
  const lines: string[] = [
    '# Interlinking audit',
    '',
    `Generated by \`script/foundry-interlinks.ts\` on ${new Date().toISOString().slice(0, 10)} using \`${MODEL}\`. Report-only. Each suggested anchor already exists verbatim in the post and points at a real, not-yet-linked post — turn it into a link without rewriting.`,
    '',
    `- Posts audited: ${targets.length}`,
    `- Interlink opportunities found: ${totalLinks}`,
    `- API calls: ${apiCalls} · tokens: ${promptTokens.toLocaleString()} in / ${completionTokens.toLocaleString()} out · ${estCost()}`,
    '',
    '| Post | Opportunities |',
    '|------|--------------|',
    ...summary
      .filter((s) => s.suggestions.length)
      .map((s) => `| [${s.post.title}](./${s.post.id}.md) | ${s.suggestions.length} |`),
    '',
    '## All suggestions',
    '',
  ];
  for (const { post, suggestions } of summary.filter((s) => s.suggestions.length)) {
    lines.push(`### ${post.title} — \`${post.url}\``);
    for (const s of suggestions) {
      lines.push(`- **“${s.anchor}”** → [${s.targetTitle}](${s.targetUrl}) — ${s.reason}`);
    }
    lines.push('');
  }
  fs.writeFileSync(path.join(OUT_DIR, 'INTERLINKS.md'), lines.join('\n'));
  fs.writeFileSync(
    path.join(OUT_DIR, 'interlinks.json'),
    JSON.stringify(summary.map((s) => ({ id: s.post.id, url: s.post.url, suggestions: s.suggestions })), null, 2)
  );

  console.log(`\n✅ ${totalLinks} interlink opportunities across ${targets.length} posts · ${estCost()}`);
  console.log(`   Report: audit/INTERLINKS.md (per-post detail in audit/<id>.md)\n`);
}

main().catch((e) => {
  console.error('\n❌ Failed:', e.message);
  process.exit(1);
});
