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
import { flagVal, chatEndpoint, createFoundryClient, parseJson } from './lib/foundry';

const argv = process.argv.slice(2);
const ENDPOINT_RAW = process.env.AZURE_API_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT || '';
const API_KEY = process.env.AZURE_API_KEY || process.env.AZURE_OPENAI_API_KEY || '';
const MODEL = flagVal(argv, '--model', process.env.AI_MODEL || 'gpt-5.4');
const ROOT = process.cwd();
const client = createFoundryClient({ endpoint: chatEndpoint(ENDPOINT_RAW), apiKey: API_KEY, model: MODEL });

interface Applied { pid: string; find: string; replace: string; reason: string; }

function loadApplied(): Applied[] {
  const fixesPath = path.join(ROOT, 'qa/FIXES.md');
  if (!fs.existsSync(fixesPath)) {
    console.error(`\n❌ ${path.relative(ROOT, fixesPath)} not found. Run \`npx tsx script/foundry-fix.ts\` first.\n`);
    process.exit(1);
  }
  const txt = fs.readFileSync(fixesPath, 'utf-8');
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
    const text = await client.chat(
      [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: `Classify each edit. Return ONLY JSON: {"results":[{"i":0,"verdict":"objective|stylistic","note":"short reason if stylistic, else empty"}]}\n\n${list}` },
      ],
      { maxTokens: 8000, temperature: 0, json: true, failOnLength: true }
    );
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
  console.log(`   Tokens: ${client.usage.promptTokens.toLocaleString()} in / ${client.usage.completionTokens.toLocaleString()} out\n`);
}
main().catch((e) => { console.error('❌', e.message); process.exit(1); });
