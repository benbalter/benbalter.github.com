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
const TOP = intFlag(argv, '--top', 25);
const CONCURRENCY = intFlag(argv, '--concurrency', 5);
const MAX_SUGGESTIONS = 4;

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
const OUT_DIR = path.join(ROOT, 'audit');
const client = createFoundryClient({ endpoint: chatEndpoint(ENDPOINT_RAW), apiKey: API_KEY, model: MODEL, dryRun: DRY_RUN });

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
  return loadPosts(ROOT)
    .map((p) => {
      const linked = new Set<string>();
      for (const m of p.body.matchAll(/\]\(([^)]+)\)|href="([^"]+)"/g)) {
        const n = normalizeInternal(m[1] || m[2] || '');
        if (n) linked.add(n);
      }
      return { ...p, url: postUrl(p.id), bodyLower: p.body.toLowerCase(), linkedTargets: linked };
    })
    .sort((a, b) => b.date.localeCompare(a.date)); // newest first
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
  const text = await client.chat(
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
    { maxTokens: 4000, temperature: 0.3, json: true, stub }
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
    `- API calls: ${client.usage.apiCalls} · tokens: ${client.usage.promptTokens.toLocaleString()} in / ${client.usage.completionTokens.toLocaleString()} out · ${estCost(client.usage, 2.5, 10)}`,
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

  console.log(`\n✅ ${totalLinks} interlink opportunities across ${targets.length} posts · ${estCost(client.usage, 2.5, 10)}`);
  console.log(`   Report: audit/INTERLINKS.md (per-post detail in audit/<id>.md)\n`);
}

main().catch((e) => {
  console.error('\n❌ Failed:', e.message);
  process.exit(1);
});
