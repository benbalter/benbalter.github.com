/**
 * binoculars.ts — score a post's prose for machine-generated cadence with a
 * locally-hosted Binoculars detector (ICML 2024, zero-shot, perplexity-ratio).
 *
 * This is the "statistical detector" layer. Unlike the denylists (AIPatterns,
 * which match enumerated phrases) it reasons about how *predictable* the text is
 * to two language models, so it generalizes to novel phrasings the regexes can't
 * catch. It is ADVISORY — a signal for a human, never a CI gate — because
 * perplexity detectors have real false-positive rates on clean human prose.
 *
 * IMPORTANT scope: Binoculars answers "does this read as machine-generated in
 * general," NOT "has this drifted from Ben's voice." It has never seen the
 * archive; author-conditioned drift is corpus-drift.ts's job. Use them together.
 *
 * Requires the detector running locally (DonnieCourtney/binoculars-detector):
 *   ./run.sh        # GPU
 *   ./run.sh cpu    # CPU-only
 * It serves POST http://localhost:8111/api/detect  {"text": "..."}.
 * Score bands (lower = more AI-like), per the detector's README:
 *   < 0.8536  high-confidence AI
 *   < 0.9015  likely AI
 *   > 0.9015  likely human
 *
 * Scores PER PARAGRAPH (Binoculars is tuned for passages; a whole-post number
 * averages the signal away) and surfaces the paragraphs that read most machine-
 * like, so a human can reread exactly those.
 *
 * Usage:
 *   npm run binoculars -- src/content/posts/2026-08-17-how-i-over-engineered-my-book.mdx
 *   BINOCULARS_URL=http://host:8111 npm run binoculars -- <post>
 */

import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const ENDPOINT = `${process.env.BINOCULARS_URL ?? 'http://localhost:8111'}/api/detect`;
const HIGH_AI = 0.8536;
const LIKELY_AI = 0.9015;
const MIN_WORDS = 25; // Binoculars is unreliable on very short passages

/** Strip a post to plain paragraphs of human prose (drops frontmatter, code, markup). */
function paragraphs(raw: string): string[] {
  let s = raw.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/```[\s\S]*?```/g, '\n\n');
  return s
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .replace(/^import .*$/gm, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/:{1,3}\w+\[([^\]]*)\]\{[^}]*\}/g, '$1')
        .replace(/`[^`]*`/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/\[\^[^\]]+\]:?/g, ' ')
        .replace(/^[-*#>|]+\s*/gm, '')
        .replace(/[*_`]/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter((p) => p.split(' ').length >= MIN_WORDS);
}

/** Pull a numeric score out of whatever field the detector returns. */
function extractScore(body: unknown): number | null {
  if (typeof body === 'number') return body;
  if (body && typeof body === 'object') {
    for (const key of ['score', 'binoculars_score', 'binocularsScore', 'value', 'result']) {
      const v = (body as Record<string, unknown>)[key];
      if (typeof v === 'number') return v;
      if (v && typeof v === 'object') {
        const nested = extractScore(v);
        if (nested !== null) return nested;
      }
    }
  }
  return null;
}

function band(score: number): string {
  if (score < HIGH_AI) return 'HIGH-CONFIDENCE AI';
  if (score < LIKELY_AI) return 'likely AI';
  return 'likely human';
}

async function scoreOne(text: string): Promise<number | null> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`detector returned HTTP ${res.status}`);
  return extractScore(await res.json());
}

async function main() {
  const target = process.argv.slice(2).find((a) => !a.startsWith('--'));
  if (!target) {
    console.error('Usage: npm run binoculars -- <post.md>');
    process.exit(2);
  }
  const path = resolve(target);
  const paras = paragraphs(readFileSync(path, 'utf8'));

  // Fail friendly if the detector isn't running — this is a local, optional tool.
  try {
    await fetch(`${process.env.BINOCULARS_URL ?? 'http://localhost:8111'}/api/health`);
  } catch {
    console.error(
      `\nBinoculars detector not reachable at ${ENDPOINT}.\n` +
        'Start it first (DonnieCourtney/binoculars-detector):  ./run.sh   (or ./run.sh cpu)\n' +
        'Then re-run. This tool is advisory and never part of CI.\n',
    );
    process.exit(0);
  }

  const scored: { score: number; text: string }[] = [];
  for (const text of paras) {
    try {
      const score = await scoreOne(text);
      if (score !== null) scored.push({ score, text });
    } catch (err) {
      console.error(`  (skipped a paragraph: ${(err as Error).message})`);
    }
  }

  if (scored.length === 0) {
    console.error('No scores returned — check the detector response shape (see extractScore()).');
    process.exit(0);
  }

  const mean = scored.reduce((a, b) => a + b.score, 0) / scored.length;
  const flagged = scored.filter((s) => s.score < LIKELY_AI).sort((a, b) => a.score - b.score);

  console.log(`\nbinoculars — ${basename(path)}`);
  console.log(`paragraphs scored: ${scored.length}  |  mean score: ${mean.toFixed(4)} (${band(mean)})`);
  console.log(`bands: <${HIGH_AI} high-AI, <${LIKELY_AI} likely-AI, else human\n`);
  console.log(`Most machine-like paragraphs (${flagged.length} below the likely-AI line):`);
  if (flagged.length === 0) console.log('  (none — every paragraph reads human)');
  for (const { score, text } of flagged.slice(0, 15)) {
    console.log(`  • ${score.toFixed(4)} [${band(score)}]  ${text.slice(0, 90)}…`);
  }
  console.log('\nAdvisory only. Reread the flagged paragraphs; Binoculars measures general');
  console.log('machine-cadence, not drift from your voice (that is corpus-drift.ts).\n');
}

main();
