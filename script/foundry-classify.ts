#!/usr/bin/env tsx
/**
 * foundry-classify.ts — adversarial second opinion on the edits foundry-fix.ts
 * actually applied. For each applied edit, decide: was this a genuine OBJECTIVE
 * error fix, or a STYLISTIC / register / preference call that should have been
 * left to the author's voice? Surfaces the debatable cluster so it can be
 * reviewed (or reverted) deliberately rather than caught by hand.
 *
 * Reads the applied (✅) edits out of qa/FIXES.md, classifies in batches, writes
 * qa/REVIEW-THESE.md.
 *
 *   set -a; . ~/projects/book/.env; set +a
 *   npx tsx script/foundry-classify.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const argv = process.argv.slice(2);
const flagVal = (f: string, d: string) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const ENDPOINT_RAW = process.env.AZURE_API_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT || '';
const API_KEY = process.env.AZURE_API_KEY || process.env.AZURE_OPENAI_API_KEY || '';
const MODEL = flagVal('--model', process.env.AI_MODEL || 'gpt-5.4');
const ENDPOINT = (() => { const t = ENDPOINT_RAW.replace(/\/$/, ''); const [p, q] = t.split('?'); const wp = p.endsWith('/chat/completions') ? p : `${p}/chat/completions`; return q ? `${wp}?${q}` : wp; })();
const isReasoning = /^(o\d|gpt-5)/i.test(MODEL);
const ROOT = process.cwd();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let promptTokens = 0, completionTokens = 0;

async function chat(messages: any[]): Promise<string> {
  const body: Record<string, unknown> = { model: MODEL, messages, response_format: { type: 'json_object' } };
  if (isReasoning) body.max_completion_tokens = 16000; else { body.max_tokens = 8000; body.temperature = 0; }
  for (let a = 0; a < 5; a++) {
    let res: Response;
    try { res = await fetch(ENDPOINT, { method: 'POST', headers: { 'api-key': API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); }
    catch { await sleep(1000 * 2 ** a); continue; }
    if (res.status === 429 || res.status >= 500) { await sleep(1500 * 2 ** a); continue; }
    if (!res.ok) throw new Error(`Azure ${res.status}: ${await res.text()}`);
    const data: any = await res.json();
    if (data.usage) { promptTokens += data.usage.prompt_tokens ?? 0; completionTokens += data.usage.completion_tokens ?? 0; }
    const c = data.choices?.[0];
    if (c?.finish_reason === 'length') throw new Error('truncated');
    return c?.message?.content ?? '';
  }
  throw new Error('gave up');
}
/** Tolerant JSON parse. With response_format=json_object the content is already
 *  pure JSON, so try that first — do NOT run a fenced-code regex over the whole
 *  string, or a ```code``` block echoed in an edit gets mis-extracted. */
function parseJson<T = any>(text: string): T {
  const t = (text ?? '').trim();
  if (!t) throw new Error('model returned empty content (no JSON to parse)');
  try {
    return JSON.parse(t) as T;
  } catch {
    /* fall through to recovery */
  }
  const fence = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) {
    try {
      return JSON.parse(fence[1]) as T;
    } catch {
      /* fall through */
    }
  }
  const start = t.search(/[[{]/);
  const end = Math.max(t.lastIndexOf(']'), t.lastIndexOf('}'));
  if (start >= 0 && end > start) return JSON.parse(t.slice(start, end + 1)) as T;
  throw new Error(`could not parse JSON from model output: ${t.slice(0, 200)}…`);
}

interface Applied { pid: string; find: string; replace: string; reason: string; }

function loadApplied(): Applied[] {
  const txt = fs.readFileSync(path.join(ROOT, 'qa/FIXES.md'), 'utf-8');
  const out: Applied[] = [];
  let pid = '';
  for (const line of txt.split('\n')) {
    const h = line.match(/^## (.+)$/); if (h) { pid = h[1].trim(); continue; }
    const m = line.match(/^- ✅ «(.*?)» → «(.*?)»\s+_\((.*?)\)_/s);
    if (m) out.push({ pid, find: m[1], replace: m[2], reason: m[3] });
  }
  return out;
}

const SYSTEM = `You are a skeptical editor auditing edits already applied to a blog by Ben Balter,
whose voice deliberately uses fragments, contractions, "And/But" openers, and a spoken, informal
register (the "coffee test": would he say it aloud to a colleague?). For EACH edit, classify:
- "objective": a genuine error any editor would fix — misspelling, typo, wrong homophone, broken/
  garbled phrase, clear subject-verb/number disagreement, missing/duplicated word.
- "stylistic": a register/preference/formal-convention call, NOT an error — e.g. comma→semicolon on
  a comma splice, "there's two"→"there are", "Here's a few"→"Here are", changing conversational
  singular "they"/"the contractor" to formal plural, tightening that alters cadence. These are
  defensible either way and arguably belong to the author's voice.
Be strict: if reasonable editors would disagree, or if the original passes the coffee test, it is
"stylistic". When unsure, lean "stylistic" (safer to surface for human review).`;

async function main() {
  const applied = loadApplied();
  console.log(`\n🔬 Classifying ${applied.length} applied edits (model=${MODEL})\n`);
  const BATCH = 30;
  const flagged: (Applied & { verdict: string; note: string })[] = [];
  const keep: (Applied & { verdict: string })[] = [];
  for (let i = 0; i < applied.length; i += BATCH) {
    const batch = applied.slice(i, i + BATCH);
    const list = batch.map((e, j) => `${j}. [${e.pid}] "${e.find}" → "${e.replace}"  (fixer's reason: ${e.reason})`).join('\n');
    const text = await chat([
      { role: 'system', content: SYSTEM },
      { role: 'user', content: `Classify each edit. Return ONLY JSON: {"results":[{"i":0,"verdict":"objective|stylistic","note":"short reason if stylistic, else empty"}]}\n\n${list}` },
    ]);
    const res = parseJson<{ results: { i: number; verdict: string; note: string }[] }>(text).results ?? [];
    for (const r of res) {
      const e = batch[r.i]; if (!e) continue;
      if (r.verdict === 'stylistic') flagged.push({ ...e, verdict: r.verdict, note: r.note });
      else keep.push({ ...e, verdict: r.verdict });
    }
    console.log(`  batch ${i / BATCH + 1} — ${res.filter((r) => r.verdict === 'stylistic').length} flagged`);
  }

  const lines: string[] = ['# Review these edits (possibly stylistic, not errors)', '',
    `An adversarial ${MODEL} pass over the ${applied.length} applied edits flagged **${flagged.length}** as register/preference calls rather than objective errors. These are already applied — review each and \`git checkout\` any you want to keep in your voice.`, ''];
  const byPost = new Map<string, typeof flagged>();
  for (const f of flagged) (byPost.get(f.pid) ?? byPost.set(f.pid, []).get(f.pid)!).push(f);
  for (const [pid, es] of byPost) {
    lines.push(`## ${pid}`);
    for (const e of es) lines.push(`- «${e.find}» → «${e.replace}»\n  _${e.note}_`);
    lines.push('');
  }
  fs.writeFileSync(path.join(ROOT, 'qa/REVIEW-THESE.md'), lines.join('\n'));
  console.log(`\n✅ ${keep.length} confirmed objective, ${flagged.length} flagged stylistic → qa/REVIEW-THESE.md`);
  console.log(`   Tokens: ${promptTokens.toLocaleString()} in / ${completionTokens.toLocaleString()} out\n`);
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
