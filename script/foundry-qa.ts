#!/usr/bin/env tsx
/**
 * foundry-qa.ts — burn Azure AI Foundry inference on a quality-assurance pass
 * over the published archive: spelling, grammar, facts, completeness, accuracy,
 * and style. Report-only — it never edits a post.
 *
 * Priority order: the curated most-popular posts (src/config.ts) first, then the
 * rest of the archive newest-first. Each post's findings are written to its own
 * file the moment they land, so an interrupted run still leaves partial value
 * (the point of a credits-expiring-tonight run).
 *
 * Transport mirrors script/foundry-drafts.ts: Azure's v1 (OpenAI-compatible)
 * surface — POST {endpoint}/chat/completions, header `api-key`, model-in-body,
 * `max_completion_tokens`, native fetch (no SDK).
 *
 * Design decisions baked into the prompt (why the report is signal, not noise):
 *  - Ben's voice guide (src/content/CLAUDE.md) is fed in so intentional
 *    fragments, contractions, em-dashes, and "And/But" openers are NOT flagged.
 *  - "fact" findings are CLAIMS TO VERIFY, not asserted errors — the model can't
 *    browse. High-confidence + internal-consistency only, and date-aware (a 2012
 *    post is judged against 2012, not today).
 *  - char-level spelling is deferred to the deterministic pipeline (Vale /
 *    Harper / retext-spell + curated dictionary.txt); the model's budget goes to
 *    what linters can't judge: completeness, accuracy, argument gaps, clarity.
 *
 * Usage (env var names match the book project so `. ~/projects/book/.env` works):
 *   set -a; . ~/projects/book/.env; set +a
 *   npx tsx script/foundry-qa.ts --dry-run          # prove wiring, no spend
 *   npx tsx script/foundry-qa.ts --top 21           # popular + recent (default)
 *   npx tsx script/foundry-qa.ts --all              # whole archive, newest-first
 *   npx tsx script/foundry-qa.ts --model gpt-5.4 --concurrency 4
 */

import * as fs from 'fs';
import * as path from 'path';
import { popularPostSlugs } from '../src/config';
import {
  hasFlag,
  flagVal,
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
const TOP = parseInt(flagVal(argv, '--top', '21'), 10); // 9 popular + ~12 recent
const CONCURRENCY = parseInt(flagVal(argv, '--concurrency', '4'), 10);

// -------------------------------------------------------------- Azure config ---
const ENDPOINT_RAW =
  process.env.AZURE_OPENAI_ENDPOINT ||
  process.env.AZURE_AI_ENDPOINT ||
  process.env.AZURE_API_ENDPOINT ||
  '';
const API_KEY =
  process.env.AZURE_OPENAI_API_KEY ||
  process.env.AZURE_API_KEY ||
  process.env.AZURE_AI_KEY ||
  '';
const MODEL = flagVal(argv, '--model', process.env.AI_MODEL || 'gpt-5.4');

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'qa');
const TODAY = new Date().toISOString().slice(0, 10);
const client = createFoundryClient({ endpoint: chatEndpoint(ENDPOINT_RAW), apiKey: API_KEY, model: MODEL, dryRun: DRY_RUN });

// ------------------------------------------------------------- corpus loading ---
interface Post {
  id: string;
  date: string;
  title: string;
  description: string;
  wordCount: number;
  body: string;
}

function loadCorpus(): Post[] {
  // live posts with real bodies only — redirect_to stubs are frontmatter-only
  return loadPosts(ROOT, { skipEmpty: true }).map((p) => ({
    ...p,
    wordCount: p.body.split(/\s+/).length,
  }));
}

/** Popular posts first (in curated order), then everything else newest-first. */
function prioritize(posts: Post[]): Post[] {
  const byId = new Map(posts.map((p) => [p.id, p]));
  const seen = new Set<string>();
  const ordered: Post[] = [];
  for (const slug of popularPostSlugs) {
    const p = byId.get(slug);
    if (p && !seen.has(p.id)) {
      ordered.push(p);
      seen.add(p.id);
    }
  }
  const rest = posts
    .filter((p) => !seen.has(p.id))
    .sort((a, b) => b.date.localeCompare(a.date));
  return [...ordered, ...rest];
}

// ---------------------------------------------------------------- prompt data ---
const VOICE_GUIDE = fs.readFileSync(path.join(ROOT, 'src/content/CLAUDE.md'), 'utf-8');

const SYSTEM = `You are a meticulous copy editor and fact-checker doing a quality-assurance
pass on a published blog post by Ben Balter — engineering leader, ex-GitHub, ex-federal
government. Your job is to catch REAL problems the author would want to fix, and nothing else.
This is a production website with a conservative "minimal changes" policy, so a false positive
is worse than a near-miss: only surface things you are confident about.

===== THE AUTHOR'S VOICE (deliberate — do NOT flag these as errors) =====
${VOICE_GUIDE}

Key voice rules that override generic copy-editing instincts:
- Sentence fragments, one-line paragraphs, and "And"/"But" sentence openers are INTENTIONAL.
- Contractions, em-dashes with no surrounding spaces (—), and the Oxford comma are correct here.
- Conversational, opinionated, direct phrasing is the point. Do not neutralize it, do not make it
  sound like a press release, do not suggest hedges or corporate softening.

===== CATEGORY RULES =====
- spelling: the site has a curated technical dictionary and a deterministic spell-checker in CI, so
  do NOT flag proper nouns, product names, or plausible technical jargon. Only flag an unambiguous
  typo (transposed letters, obvious misspelling, repeated word, "teh").
- grammar: only genuine errors (subject/verb disagreement, broken sentence, wrong homophone,
  dangling modifier). NOT stylistic fragments or intentional informality.
- fact: these are CLAIMS TO VERIFY, not asserted errors. You cannot browse. Only list a claim if
  (a) you are highly confident it is wrong or internally inconsistent, OR (b) it is a specific,
  checkable assertion (a stat, date, name, quote, or attribution) worth the author double-checking.
  Be DATE-AWARE: judge a claim against when the post was written, not today. A 2012 post describing
  2012 tooling is not "wrong" because the tool changed since.
- accuracy: internal contradictions, mislabeled links, a number that doesn't add up, a claim the
  post itself later undercuts, a "see below" that has no below.
- completeness: a promised list/step/section that's missing, an unfinished thought, a broken or
  placeholder link, a dangling reference, a code block that can't work as shown.
- style: ONLY clarity wins that survive the voice rules above — a genuinely confusing sentence, a
  buried lede, an ambiguous pronoun. When in doubt, say nothing.

Reserve "high" severity for things that mislead a reader or make the author look wrong. Most
findings should be "low" or "medium". A clean post should return an empty issues array — do not
invent problems to seem thorough.`;

interface Issue {
  category: 'spelling' | 'grammar' | 'fact' | 'accuracy' | 'completeness' | 'style';
  severity: 'high' | 'medium' | 'low';
  quote: string;
  problem: string;
  suggestion: string;
}
interface Review {
  summary: string;
  issues: Issue[];
}

const SCHEMA = `Return ONLY JSON of this exact shape:
{"summary":"one or two sentences on the post's overall quality","issues":[{"category":"spelling|grammar|fact|accuracy|completeness|style","severity":"high|medium|low","quote":"the exact text from the post (short, verbatim, so it can be found)","problem":"what is wrong or worth verifying","suggestion":"the concrete fix, or for a fact: what to double-check"}]}
If the post is clean, return {"summary":"...","issues":[]}.`;

const STUB: Review = {
  summary: 'Dry-run stub — no API call was made.',
  issues: [
    {
      category: 'style',
      severity: 'low',
      quote: 'example sentence',
      problem: 'This is a stub finding produced by --dry-run.',
      suggestion: 'Run without --dry-run to get real findings.',
    },
  ],
};

async function reviewPost(post: Post): Promise<Review> {
  const user = `POST METADATA
- id: ${post.id}
- date written: ${post.date}
- title: ${post.title}
- description: ${post.description}

Review the full Markdown body below against the category rules. ${SCHEMA}

===== POST BODY =====
${post.body}`;
  const text = await client.chat(
    [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: user },
    ],
    { maxTokens: 16000, temperature: 0.2, json: true, failOnLength: true, stub: JSON.stringify(STUB) }
  );
  return parseJson<Review>(text);
}

// --------------------------------------------------------------- output/report ---
const SEV_RANK = { high: 0, medium: 1, low: 2 } as const;

function writePostReport(post: Post, review: Review): string {
  const file = path.join(OUT_DIR, `${post.id}.md`);
  const lines: string[] = [];
  lines.push(`# QA — ${post.title}`);
  lines.push('');
  lines.push(`- **Post:** \`src/content/posts/${post.id}\` (${post.date})`);
  lines.push(`- **Model:** ${MODEL}`);
  lines.push(`- **Findings:** ${review.issues.length}`);
  lines.push('');
  lines.push(`> ${review.summary}`);
  lines.push('');
  if (!review.issues.length) {
    lines.push('_No issues found._');
  } else {
    const sorted = [...review.issues].sort(
      (a, b) => (SEV_RANK[a.severity] ?? 3) - (SEV_RANK[b.severity] ?? 3)
    );
    for (const it of sorted) {
      const sev = it.severity === 'high' ? '🔴' : it.severity === 'medium' ? '🟡' : '⚪';
      lines.push(`### ${sev} [${it.category}] ${it.problem}`);
      lines.push('');
      lines.push(`> ${(it.quote || '').replace(/\n/g, ' ').trim()}`);
      lines.push('');
      lines.push(`**Fix:** ${it.suggestion}`);
      lines.push('');
    }
  }
  fs.writeFileSync(file, lines.join('\n'));
  return file;
}

interface RunRow {
  id: string;
  title: string;
  date: string;
  popular: boolean;
  counts: { high: number; medium: number; low: number; total: number };
  summary: string;
  error?: string;
}

function writeIndex(rows: RunRow[]) {
  const lines: string[] = [];
  lines.push('# QA report');
  lines.push('');
  lines.push(
    `Generated by \`script/foundry-qa.ts\` on ${TODAY} using \`${MODEL}\`. Report-only — no posts were edited. ` +
      `"fact" findings are **claims to verify**, not confirmed errors (the model can't browse). ` +
      `Char-level spelling stays the job of the CI spell-checker; this pass targets completeness, ` +
      `accuracy, and clarity that linters can't judge.`
  );
  lines.push('');
  lines.push(`- Posts reviewed: ${rows.filter((r) => !r.error).length}`);
  lines.push(`- Total findings: ${rows.reduce((n, r) => n + r.counts.total, 0)}`);
  lines.push(
    `- API calls: ${client.usage.apiCalls} · tokens: ${client.usage.promptTokens.toLocaleString()} in / ${client.usage.completionTokens.toLocaleString()} out · ${estCost(client.usage, 1.25, 10)}`
  );
  lines.push('');
  lines.push('| Post | Pop | 🔴 | 🟡 | ⚪ | Summary |');
  lines.push('|------|-----|----|----|----|---------|');
  for (const r of rows) {
    if (r.error) {
      lines.push(`| \`${r.id}\` | ${r.popular ? '★' : ''} | — | — | — | ⚠️ ${r.error} |`);
      continue;
    }
    const s = r.summary.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    lines.push(
      `| [${r.title}](./${r.id}.md) | ${r.popular ? '★' : ''} | ${r.counts.high} | ${r.counts.medium} | ${r.counts.low} | ${s} |`
    );
  }
  fs.writeFileSync(path.join(OUT_DIR, 'REPORT.md'), lines.join('\n'));
  fs.writeFileSync(path.join(OUT_DIR, 'issues.json'), JSON.stringify(rows, null, 2));
}

// ----------------------------------------------------------------------- main ---
function requireCreds() {
  if (DRY_RUN) return;
  const missing = [
    !ENDPOINT_RAW && 'AZURE_API_ENDPOINT (or AZURE_OPENAI_ENDPOINT)',
    !API_KEY && 'AZURE_API_KEY (or AZURE_OPENAI_API_KEY)',
  ].filter(Boolean);
  if (missing.length) {
    console.error(`\n❌ Missing env vars: ${missing.join(', ')}`);
    console.error('   e.g. `set -a; . ~/projects/book/.env; set +a` then re-run.\n');
    process.exit(1);
  }
}

async function main() {
  console.log(`\n🔎 foundry-qa ${DRY_RUN ? '(DRY RUN — no API calls)' : ''} · model=${MODEL}\n`);
  requireCreds();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const all = loadCorpus();
  const ordered = prioritize(all);
  const targets = ALL ? ordered : ordered.slice(0, TOP);
  const popSet = new Set(popularPostSlugs);
  console.log(
    `📚 ${all.length} live posts; reviewing ${targets.length} (${ALL ? 'whole archive, newest-first' : `top ${TOP}: ${popSet.size} popular + recent`})`
  );
  console.log(`🎙️  Voice guide: ${VOICE_GUIDE.length} chars from src/content/CLAUDE.md`);
  console.log(`⚙️  Concurrency ${CONCURRENCY}\n`);

  let done = 0;
  const rows = await pool<Post, RunRow>(targets, CONCURRENCY, async (post) => {
    const popular = popSet.has(post.id);
    try {
      const review = await reviewPost(post);
      const counts = { high: 0, medium: 0, low: 0, total: review.issues.length };
      for (const it of review.issues) counts[it.severity] = (counts[it.severity] ?? 0) + 1;
      writePostReport(post, review); // incremental: land results as they arrive
      done++;
      console.log(
        `  ✓ [${done}/${targets.length}] ${post.id} — ${counts.total} findings (${counts.high}🔴 ${counts.medium}🟡 ${counts.low}⚪)`
      );
      return { id: post.id, title: post.title, date: post.date, popular, counts, summary: review.summary };
    } catch (e) {
      done++;
      const error = (e as Error).message;
      console.warn(`  ✗ [${done}/${targets.length}] ${post.id} — ${error}`);
      return {
        id: post.id,
        title: post.title,
        date: post.date,
        popular,
        counts: { high: 0, medium: 0, low: 0, total: 0 },
        summary: '',
        error,
      };
    }
  });

  // Keep the index in priority order (targets order), not completion order.
  writeIndex(rows);

  const totalFindings = rows.reduce((n, r) => n + r.counts.total, 0);
  const failed = rows.filter((r) => r.error).length;
  console.log(`\n✅ Done. ${rows.length - failed}/${rows.length} posts reviewed, ${totalFindings} findings.`);
  console.log(`   Tokens: ${client.usage.promptTokens.toLocaleString()} in / ${client.usage.completionTokens.toLocaleString()} out · ${estCost(client.usage, 1.25, 10)}`);
  console.log(`   Report: qa/REPORT.md (per-post details in qa/<id>.md)\n`);
}

main().catch((e) => {
  console.error('\n❌ Failed:', e.message);
  process.exit(1);
});
