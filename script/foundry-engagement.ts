#!/usr/bin/env tsx
/**
 * foundry-engagement.ts — engagement audit of the published archive.
 *
 * Complements foundry-qa.ts (per-post correctness) and foundry-interlinks.ts
 * (cross-post linking). For each post it asks the model for three engagement
 * levers, then validates in code where it can:
 *   1. Pull quotes  — the most quotable/shareable lines to feature as a
 *      <blockquote> callout. Must be VERBATIM from the post (validated).
 *   2. Objection blocks — a skeptical reader's strongest counterargument the
 *      post doesn't yet address, plus a crisp response ("A fair objection …").
 *   3. Engagement adds — TL;DR, a sharper subhead/opening, a reader CTA/question,
 *      a tweetable summary, a "further reading" nudge, key-takeaways box, etc.
 *
 * Report-only; never edits a post. Transport mirrors foundry-interlinks.ts
 * (Azure v1 surface, api-key header, model-in-body, backoff on 429/503).
 *
 * Usage (env matches the book project — `. ~/projects/book/.env` works):
 *   set -a; . ~/projects/book/.env; set +a
 *   npx tsx script/foundry-engagement.ts --dry-run
 *   npx tsx script/foundry-engagement.ts --top 25            # newest 25
 *   npx tsx script/foundry-engagement.ts --all --model gpt-5.4 --concurrency 3
 *   npx tsx script/foundry-engagement.ts --popular           # curated popular set only
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { popularPostSlugs } from '../src/config';

// ---------------------------------------------------------------- CLI args ---
const argv = process.argv.slice(2);
const hasFlag = (f: string) => argv.includes(f);
const flagVal = (f: string, d: string) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const DRY_RUN = hasFlag('--dry-run');
const ALL = hasFlag('--all');
const POPULAR = hasFlag('--popular');
const TOP = parseInt(flagVal('--top', '25'), 10);
const CONCURRENCY = parseInt(flagVal('--concurrency', '3'), 10);

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
const OUT_DIR = path.join(ROOT, 'engage');
const VOICE_GUIDE = fs.readFileSync(path.join(ROOT, 'src/content/CLAUDE.md'), 'utf-8');

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
  if (!reasoning) body.temperature = 0.4;
  if (json) body.response_format = { type: 'json_object' };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  let res: Response;
  for (let attempt = 0; ; attempt++) {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'api-key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
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
  url: string;
  title: string;
  description: string;
  body: string;
  normBody: string; // whitespace-collapsed lowercase, for verbatim checks
}

const norm = (s: string) => s.replace(/\s+/g, ' ').toLowerCase().trim();

function loadCorpus(): Post[] {
  const files = glob.sync('src/content/posts/*.{md,mdx}', { cwd: ROOT, absolute: true }).sort();
  const posts: Post[] = [];
  for (const file of files) {
    const parsed = matter(fs.readFileSync(file, 'utf-8'));
    const fm = parsed.data as Record<string, any>;
    if (fm.published === false || fm.archived === true || fm.redirect_to) continue;
    const id = path.basename(file).replace(/\.(md|mdx)$/, '');
    const m = id.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
    const url = m ? `/${m[1]}/${m[2]}/${m[3]}/${m[4]}/` : `/${id}/`;
    posts.push({
      id,
      date: id.slice(0, 10),
      url,
      title: fm.title ?? id,
      description: fm.description ?? '',
      body: parsed.content,
      normBody: norm(parsed.content),
    });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

// ---------------------------------------------------------------- engagement ---
interface PullQuote {
  text: string;
  why: string;
}
interface Objection {
  objection: string;
  response: string;
  placement: string;
}
interface EngagementIdea {
  type: string;
  suggestion: string;
}
interface Findings {
  pullQuotes: PullQuote[];
  objections: Objection[];
  engagement: EngagementIdea[];
}

const STUB: Findings = {
  pullQuotes: [{ text: 'dry-run stub quote not in post', why: 'stub' }],
  objections: [{ objection: 'stub', response: 'stub', placement: 'stub' }],
  engagement: [{ type: 'tldr', suggestion: 'stub' }],
};

async function auditPost(post: Post): Promise<Findings> {
  const text = await chat(
    [
      {
        role: 'system',
        content: `You are an engagement editor for Ben Balter's blog. Suggest ways to make an existing post more shareable and sticky WITHOUT changing its argument or voice. Respect his voice guide (no AI-tells, no hype).\n\n===== VOICE GUIDE =====\n${VOICE_GUIDE}`,
      },
      {
        role: 'user',
        content: `POST: "${post.title}" (${post.url})\n\n${post.body.slice(0, 9000)}\n\nReturn JSON with three keys:\n\n1. "pullQuotes": up to 3 of the most quotable, shareable lines to feature as a blockquote callout. Each "text" MUST be copied VERBATIM from the post body above (an exact sentence or clause, no paraphrasing). Include "why" it lands.\n\n2. "objections": up to 2 "fair objection" blocks — the strongest counterargument a skeptical reader would raise that the post does NOT already address, plus a crisp 1-2 sentence "response" in Ben's voice, and "placement" (which section it belongs after). New content, not verbatim.\n\n3. "engagement": up to 4 other concrete levers to lift engagement. For each, "type" is one of: tldr, subhead, opening-hook, reader-cta, tweetable, key-takeaways, further-reading, visual. "suggestion" is the specific, ready-to-use text or change. Be concrete, not generic advice.\n\nJSON shape: {"pullQuotes":[{"text","why"}],"objections":[{"objection","response","placement"}],"engagement":[{"type","suggestion"}]}. Use empty arrays if nothing is worth suggesting.`,
      },
    ],
    { json: true, stub: JSON.stringify(STUB) }
  );
  const f = parseJson<Findings>(text);
  // Validate pull quotes are actually verbatim in the post (fuzzy on whitespace/case).
  const pullQuotes = (f.pullQuotes ?? []).filter((q) => q.text && post.normBody.includes(norm(q.text)));
  return {
    pullQuotes,
    objections: (f.objections ?? []).filter((o) => o.objection && o.response),
    engagement: (f.engagement ?? []).filter((e) => e.type && e.suggestion),
  };
}

function writePostFile(post: Post, f: Findings) {
  const L: string[] = [`# Engagement — ${post.title}`, '', `Post: \`${post.url}\``, ''];
  L.push('## Pull quotes');
  if (f.pullQuotes.length) for (const q of f.pullQuotes) L.push(`> ${q.text}`, `— _${q.why}_`, '');
  else L.push('_None._', '');
  L.push('## Fair-objection blocks');
  if (f.objections.length)
    for (const o of f.objections) L.push(`- **Objection:** ${o.objection}`, `  - **Response:** ${o.response}`, `  - **Place after:** ${o.placement}`, '');
  else L.push('_None._', '');
  L.push('## Other engagement levers');
  if (f.engagement.length) for (const e of f.engagement) L.push(`- **${e.type}:** ${e.suggestion}`);
  else L.push('_None._');
  fs.writeFileSync(path.join(OUT_DIR, `${post.id}.md`), L.join('\n') + '\n');
}

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

const estCost = () => `~$${((promptTokens / 1e6) * 2.5 + (completionTokens / 1e6) * 10).toFixed(2)} (est.)`;

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
  console.log(`\n📣 foundry-engagement ${DRY_RUN ? '(DRY RUN)' : ''} · model=${MODEL}\n`);
  requireCreds();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const all = loadCorpus();
  let targets: Post[];
  if (POPULAR) {
    const pop = new Set(popularPostSlugs);
    targets = all.filter((p) => pop.has(p.id));
  } else if (ALL) {
    targets = all;
  } else {
    targets = all.slice(0, TOP);
  }
  console.log(`📚 ${all.length} posts · auditing ${targets.length} ${POPULAR ? '(popular)' : ALL ? '(all)' : `(newest ${TOP})`}`);

  const summary: { post: Post; f: Findings }[] = [];
  let done = 0;
  await pool(targets, DRY_RUN ? 1 : CONCURRENCY, async (post) => {
    try {
      const f = await auditPost(post);
      writePostFile(post, f);
      summary.push({ post, f });
    } catch (e) {
      console.log(`  ✗ ${post.id}: ${(e as Error).message}`);
    }
    if (++done % 10 === 0 || done === targets.length) console.log(`  ...${done}/${targets.length}`);
  });

  const tot = summary.reduce(
    (a, s) => ({
      q: a.q + s.f.pullQuotes.length,
      o: a.o + s.f.objections.length,
      e: a.e + s.f.engagement.length,
    }),
    { q: 0, o: 0, e: 0 }
  );
  const L: string[] = [
    '# Engagement audit',
    '',
    `Generated by \`script/foundry-engagement.ts\` on ${new Date().toISOString().slice(0, 10)} using \`${MODEL}\`. Report-only. Pull-quote text is verbatim from each post; objections and levers are suggestions to add.`,
    '',
    `- Posts audited: ${summary.length}`,
    `- Pull quotes: ${tot.q} · Objection blocks: ${tot.o} · Engagement levers: ${tot.e}`,
    `- API calls: ${apiCalls} · tokens: ${promptTokens.toLocaleString()} in / ${completionTokens.toLocaleString()} out · ${estCost()}`,
    '',
    '| Post | 💬 quotes | 🤔 objections | ✨ levers |',
    '|------|:--:|:--:|:--:|',
    ...summary.map((s) => `| [${s.post.title}](./${s.post.id}.md) | ${s.f.pullQuotes.length} | ${s.f.objections.length} | ${s.f.engagement.length} |`),
  ];
  fs.writeFileSync(path.join(OUT_DIR, 'ENGAGEMENT.md'), L.join('\n') + '\n');
  fs.writeFileSync(
    path.join(OUT_DIR, 'engagement.json'),
    JSON.stringify(summary.map((s) => ({ id: s.post.id, url: s.post.url, ...s.f })), null, 2)
  );

  console.log(`\n✅ ${tot.q} pull quotes · ${tot.o} objection blocks · ${tot.e} engagement levers · ${estCost()}`);
  console.log(`   Report: engage/ENGAGEMENT.md (per-post detail in engage/<id>.md)\n`);
}

main().catch((e) => {
  console.error('\n❌ Failed:', e.message);
  process.exit(1);
});
