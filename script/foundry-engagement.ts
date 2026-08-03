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
import { popularPostSlugs } from '../src/config';
import {
  hasFlag,
  flagVal,
  intFlag,
  chatEndpoint,
  createFoundryClient,
  parseJson,
  pool,
  loadPosts,
  estCost,
} from './lib/foundry';

// ---------------------------------------------------------------- CLI args ---
const argv = process.argv.slice(2);
const DRY_RUN = hasFlag(argv, '--dry-run');
const ALL = hasFlag(argv, '--all');
const POPULAR = hasFlag(argv, '--popular');
const TOP = intFlag(argv, '--top', 25);
const CONCURRENCY = intFlag(argv, '--concurrency', 3);

// -------------------------------------------------------------- Azure config ---
const ENDPOINT_RAW =
  process.env.AZURE_OPENAI_ENDPOINT ||
  process.env.AZURE_AI_ENDPOINT ||
  process.env.AZURE_API_ENDPOINT ||
  '';
const API_KEY =
  process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY || process.env.AZURE_AI_KEY || '';
const MODEL = process.env.AZURE_OPENAI_DEPLOYMENT || process.env.AI_MODEL || flagVal(argv, '--model', 'gpt-4.1');

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'engage');
const VOICE_GUIDE = fs.readFileSync(path.join(ROOT, 'src/content/CLAUDE.md'), 'utf-8');
const client = createFoundryClient({ endpoint: chatEndpoint(ENDPOINT_RAW), apiKey: API_KEY, model: MODEL, dryRun: DRY_RUN });

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
  return loadPosts(ROOT)
    .map((p) => {
      const m = p.id.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
      const url = m ? `/${m[1]}/${m[2]}/${m[3]}/${m[4]}/` : `/${p.id}/`;
      return { ...p, url, normBody: norm(p.body) };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
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
  const text = await client.chat(
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
    { maxTokens: 4000, temperature: 0.4, json: true, stub: JSON.stringify(STUB) }
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

// ----------------------------------------------------------------------- main ---
function requireCreds() {
  if (DRY_RUN) return;
  const missing = [!ENDPOINT_RAW && 'AZURE_API_ENDPOINT', !API_KEY && 'AZURE_API_KEY'].filter(Boolean);
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
    `- API calls: ${client.usage.apiCalls} · tokens: ${client.usage.promptTokens.toLocaleString()} in / ${client.usage.completionTokens.toLocaleString()} out · ${estCost(client.usage, 2.5, 10)}`,
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

  console.log(`\n✅ ${tot.q} pull quotes · ${tot.o} objection blocks · ${tot.e} engagement levers · ${estCost(client.usage, 2.5, 10)}`);
  console.log(`   Report: engage/ENGAGEMENT.md (per-post detail in engage/<id>.md)\n`);
}

main().catch((e) => {
  console.error('\n❌ Failed:', e.message);
  process.exit(1);
});
