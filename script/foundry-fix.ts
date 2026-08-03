#!/usr/bin/env tsx
/**
 * foundry-fix.ts — apply ONLY unambiguous, objective fixes from the foundry-qa
 * pass to the actual post files. Typos, misspellings, clear grammar breaks,
 * truncations, broken examples, wrong citations. NOT style, NOT voice, NOT
 * unverifiable "facts."
 *
 * How it stays safe on a production site:
 *  - A second gpt-5.4 pass per post turns findings into EXACT verbatim
 *    {find, replace} pairs. The model is told to skip anything subjective,
 *    stylistic, uncertain, or fact-check-requiring — when in doubt, drop it.
 *  - Every edit is applied only if `find` occurs EXACTLY ONCE in the file
 *    (unique-match guard). Zero or multiple matches → skipped and logged, never
 *    a blind global replace.
 *  - `replace` must equal `find` with the minimal correction — the model is told
 *    not to rewrite surrounding prose.
 *  - Dry-run by default is off, but every applied/skipped edit is logged to
 *    qa/FIXES.md for review against `git diff` before you commit.
 *
 * Usage:
 *   set -a; . ~/projects/book/.env; set +a
 *   npx tsx script/foundry-fix.ts --dry-run   # show proposed edits, write nothing
 *   npx tsx script/foundry-fix.ts             # apply objective edits to posts
 */

import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes('--dry-run');
const flagVal = (f: string, d: string) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const CONCURRENCY = parseInt(flagVal('--concurrency', '5'), 10);

const ENDPOINT_RAW = process.env.AZURE_API_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT || '';
const API_KEY = process.env.AZURE_API_KEY || process.env.AZURE_OPENAI_API_KEY || '';
const MODEL = flagVal('--model', process.env.AI_MODEL || 'gpt-5.4');
const ENDPOINT = (() => {
  const t = ENDPOINT_RAW.replace(/\/$/, '');
  const [p, q] = t.split('?');
  const wp = p.endsWith('/chat/completions') ? p : `${p}/chat/completions`;
  return q ? `${wp}?${q}` : wp;
})();
const isReasoning = /^(o\d|gpt-5)/i.test(MODEL);

const ROOT = process.cwd();
const POSTS = path.join(ROOT, 'src/content/posts');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let promptTokens = 0, completionTokens = 0;

async function chat(messages: any[], maxTokens = 16000): Promise<string> {
  const body: Record<string, unknown> = { model: MODEL, messages, response_format: { type: 'json_object' } };
  if (isReasoning) body.max_completion_tokens = Math.max(maxTokens, 16000);
  else { body.max_tokens = maxTokens; body.temperature = 0; }
  for (let a = 0; a < 5; a++) {
    let res: Response;
    try {
      res = await fetch(ENDPOINT, { method: 'POST', headers: { 'api-key': API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    } catch (e) { await sleep(1000 * 2 ** a); continue; }
    if (res.status === 429 || res.status >= 500) { await sleep(1500 * 2 ** a); continue; }
    if (!res.ok) throw new Error(`Azure ${res.status}: ${await res.text()}`);
    const data: any = await res.json();
    if (data.usage) { promptTokens += data.usage.prompt_tokens ?? 0; completionTokens += data.usage.completion_tokens ?? 0; }
    const c = data.choices?.[0];
    if (c?.finish_reason === 'length') throw new Error('truncated (finish_reason=length)');
    return c?.message?.content ?? '';
  }
  throw new Error('gave up after retries');
}

/** Tolerant JSON parse. With response_format=json_object the content is already
 *  pure JSON, so try that first — critically, do NOT run a fenced-code regex over
 *  the whole string, or a ```code``` block echoed in a find/replace pair gets
 *  mis-extracted and truncates the JSON. */
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

interface Finding { pid: string; cat: string; sev: string; quote: string; problem: string; fix: string; }
interface Edit { find: string; replace: string; reason: string; }

const OBJECTIVE = new Set(['spelling', 'grammar', 'completeness', 'accuracy']);

const SYSTEM = `You are applying copy-fixes to a published blog post. You will be given the post's
Markdown and a list of QA findings. Convert ONLY the unambiguous, objective errors into exact
find/replace edits. This is a production site with a strict minimal-change policy.

INCLUDE only:
- Clear typos and misspellings (transposed letters, wrong homophone, doubled words, "teh").
- Unambiguous grammar breaks (subject/verb disagreement, broken/garbled phrase, wrong correlative
  like "both...or", a word obviously missing or duplicated).
- Objective structural fixes (a truncated sentence to complete ONLY if the intended text is
  unambiguous, a citation that is verifiably wrong to correct ONLY if you are certain of the right
  value, a code example broken by an obvious mechanical error).

EXCLUDE (do not emit an edit):
- Anything stylistic, tonal, or a matter of preference. The author's voice — fragments, "And/But"
  openers, contractions, em-dashes, informality — is deliberate and correct.
- Any "fact" claim requiring outside verification.
- Any fix where you are not certain of the exact intended replacement, or where reasonable editors
  would disagree. When in doubt, DROP IT. A missed fix is fine; a wrong edit is not.
- US spellings that are already valid (e.g. "dialog", "gray"), brand-styling nitpicks unless clearly
  wrong, and possible intentional puns.

RULES for each edit:
- "find" MUST be an exact, verbatim substring copied from the post body, long enough to be UNIQUE in
  the document (include surrounding words if needed for uniqueness). Copy it character-for-character.
- "replace" MUST be "find" with only the minimal correction applied. Do NOT rewrite surrounding
  prose, do NOT change punctuation/casing beyond the fix, do NOT add or remove sentences.
- "reason" is a short justification (the error class).`;

const SCHEMA = `Return ONLY JSON: {"edits":[{"find":"exact unique verbatim substring","replace":"same string, minimally corrected","reason":"why"}]}. Empty array if nothing qualifies.`;

async function fixPost(pid: string, findings: Finding[]): Promise<{ pid: string; applied: Edit[]; skipped: { edit: Edit; why: string }[]; error?: string }> {
  const file = fs.existsSync(path.join(POSTS, `${pid}.md`)) ? path.join(POSTS, `${pid}.md`) : path.join(POSTS, `${pid}.mdx`);
  const raw = fs.readFileSync(file, 'utf-8');
  const parsed = matter(raw);
  const body = parsed.content;

  const findingList = findings
    .map((f) => `- [${f.cat}] ${f.problem}\n  near: «${f.quote}»\n  suggested: ${f.fix}`)
    .join('\n');

  let edits: Edit[];
  try {
    const text = await chat([
      { role: 'system', content: SYSTEM },
      { role: 'user', content: `POST (id ${pid}):\n\n===== BODY =====\n${body}\n\n===== QA FINDINGS (objective categories only) =====\n${findingList}\n\n${SCHEMA}` },
    ]);
    edits = parseJson<{ edits: Edit[] }>(text).edits ?? [];
  } catch (e) {
    return { pid, applied: [], skipped: [], error: (e as Error).message };
  }

  // Apply with a unique-match guard, sequentially against the evolving body.
  let current = fs.readFileSync(file, 'utf-8');
  const applied: Edit[] = [];
  const skipped: { edit: Edit; why: string }[] = [];
  for (const ed of edits) {
    if (!ed.find || ed.find === ed.replace) { skipped.push({ edit: ed, why: 'no-op or empty find' }); continue; }
    const count = current.split(ed.find).length - 1;
    if (count === 0) { skipped.push({ edit: ed, why: 'find not present (not verbatim)' }); continue; }
    if (count > 1) { skipped.push({ edit: ed, why: `find ambiguous (${count} matches)` }); continue; }
    if (!DRY_RUN) current = current.replace(ed.find, ed.replace);
    applied.push(ed);
  }
  if (!DRY_RUN && applied.length) fs.writeFileSync(file, current);
  return { pid, applied, skipped };
}

async function pool<T, R>(items: T[], size: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let n = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (n < items.length) { const i = n++; out[i] = await fn(items[i]); }
  }));
  return out;
}

async function main() {
  console.log(`\n🔧 foundry-fix ${DRY_RUN ? '(DRY RUN — no writes)' : ''} · model=${MODEL}\n`);
  const all: Finding[] = JSON.parse(fs.readFileSync(path.join(ROOT, 'qa/all-findings.json'), 'utf-8'));
  const objective = all.filter((f) => OBJECTIVE.has(f.cat));
  const byPost = new Map<string, Finding[]>();
  for (const f of objective) { (byPost.get(f.pid) ?? byPost.set(f.pid, []).get(f.pid)!).push(f); }
  console.log(`📋 ${objective.length} objective findings across ${byPost.size} posts (excluded ${all.length - objective.length} style/fact)\n`);

  const posts = [...byPost.entries()];
  let done = 0;
  const results = await pool(posts, CONCURRENCY, async ([pid, fs_]) => {
    const r = await fixPost(pid, fs_);
    done++;
    const tag = r.error ? `⚠️ ${r.error}` : `${r.applied.length} applied, ${r.skipped.length} skipped`;
    console.log(`  [${done}/${posts.length}] ${pid} — ${tag}`);
    return r;
  });

  // Write review log.
  const lines: string[] = ['# Objective fixes applied', '', `Model: ${MODEL} · ${DRY_RUN ? 'DRY RUN' : 'APPLIED'} · review against \`git diff\`.`, ''];
  let totalApplied = 0, totalSkipped = 0;
  for (const r of results.sort((a, b) => b.applied.length - a.applied.length)) {
    if (!r.applied.length && !r.skipped.length && !r.error) continue;
    lines.push(`## ${r.pid}`);
    if (r.error) lines.push(`- ⚠️ ${r.error}`);
    for (const e of r.applied) { totalApplied++; lines.push(`- ✅ «${e.find}» → «${e.replace}»  _(${e.reason})_`); }
    for (const s of r.skipped) { totalSkipped++; lines.push(`- ⏭️ skipped «${s.edit.find}» → «${s.edit.replace}» — ${s.why}`); }
    lines.push('');
  }
  lines.splice(3, 0, `**${totalApplied} edits ${DRY_RUN ? 'proposed' : 'applied'}, ${totalSkipped} skipped.** Tokens: ${promptTokens.toLocaleString()} in / ${completionTokens.toLocaleString()} out.\n`);
  fs.writeFileSync(path.join(ROOT, 'qa/FIXES.md'), lines.join('\n'));

  console.log(`\n✅ ${totalApplied} edits ${DRY_RUN ? 'proposed' : 'applied'}, ${totalSkipped} skipped. See qa/FIXES.md, then \`git diff src/content/posts\`.`);
  console.log(`   Tokens: ${promptTokens.toLocaleString()} in / ${completionTokens.toLocaleString()} out\n`);
}

main().catch((e) => { console.error('\n❌ Failed:', e.message); process.exit(1); });
