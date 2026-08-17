/**
 * corpus-drift.ts — flag prose that has drifted from the author's own voice.
 *
 * The premise (operationalizing the defense that "this is how I've always
 * written"): denylist linters catch phrases someone thought to enumerate; they
 * can't catch a novel tic you absorbed from reading too much generated text.
 * But your own 15-year archive IS a fingerprint. Anything in a new draft that
 * has *never* appeared in your prior corpus — especially at sentence openings,
 * where signpost tells live — is a candidate for drift.
 *
 * This does NOT police uniformity, cadence, em-dash density, or antithesis:
 * consistent voice is the goal, not the target. It flags only NOVELTY relative
 * to the author's own baseline. A construction you've used for years (e.g.
 * "and that's the point") won't flag; one you've never used ("here's the irony")
 * will.
 *
 * Usage:
 *   tsx script/corpus-drift.ts src/content/posts/2026-08-17-how-i-over-engineered-my-book.mdx
 *   tsx script/corpus-drift.ts <target> --since=2011   # baseline = posts before target's year
 *   tsx script/corpus-drift.ts <target> --json
 *
 * Baseline = every post OLDER than the target (by date in the filename), so the
 * draft is judged against the voice that predates it. Exit code is always 0;
 * this is an advisory signal for a human, not a CI gate.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const POSTS_DIR = resolve('src/content/posts');
const OPENER_N = 2; // sentence-opener width: leading bigram (3-grams are too sparse to signal)
const NOVEL_NGRAM_N = 4; // width for the "novel phrasing" pass

interface Args {
  target: string;
  json: boolean;
}

function parseArgs(argv: string[]): Args {
  const positional = argv.filter((a) => !a.startsWith('--'));
  const flags = new Set(argv.filter((a) => a.startsWith('--')));
  if (positional.length === 0) {
    console.error('Usage: tsx script/corpus-drift.ts <post.md> [--json]');
    process.exit(2);
  }
  return { target: resolve(positional[0]), json: flags.has('--json') };
}

/** Date prefix (YYYY-MM-DD) from a post filename, or '' if none. */
function dateOf(file: string): string {
  const m = basename(file).match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : '';
}

/**
 * Strip a post down to human prose: drop frontmatter, code, MDX imports, HTML,
 * markdown link/emphasis syntax, and the site's custom directives. We keep the
 * visible words and normalize smart quotes so the corpus and target compare
 * apples to apples.
 */
function toProse(raw: string): string {
  let s = raw;
  s = s.replace(/^---\n[\s\S]*?\n---\n/, ''); // YAML frontmatter
  s = s.replace(/```[\s\S]*?```/g, ' '); // fenced code
  s = s.replace(/`[^`]*`/g, ' '); // inline code
  s = s.replace(/^import .*$/gm, ''); // MDX imports
  s = s.replace(/<[^>]+>/g, ' '); // HTML/JSX tags
  s = s.replace(/:{1,3}\w+\[([^\]]*)\]\{[^}]*\}/g, '$1'); // :quote[text]{#id} -> text
  s = s.replace(/\[\^[^\]]+\]:?/g, ' '); // footnote refs/defs
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, ' '); // images
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1'); // links -> anchor text
  s = s.replace(/^#{1,6} +(.+)$/gm, '$1. '); // headings -> sentence boundary (so they don't glue to the next line)
  s = s.replace(/[*_#>|]/g, ' '); // markdown punctuation
  s = s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"'); // smart quotes
  return s;
}

/** Split prose into sentences (naive but good enough for openers). */
function sentences(prose: string): string[] {
  return prose
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z"'])/)
    .map((s) => s.trim())
    .filter((s) => s.split(' ').length >= 3);
}

/** Normalized word tokens: lowercase, letters/digits/apostrophes only. */
function words(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter(Boolean);
}

function ngrams(tokens: string[], n: number): string[] {
  const out: string[] = [];
  for (let i = 0; i + n <= tokens.length; i++) out.push(tokens.slice(i, i + n).join(' '));
  return out;
}

/** Words that make an n-gram "topical" rather than "stylistic" — skip those. */
function isTopical(gram: string, rareWords: Set<string>): boolean {
  return gram.split(' ').some((w) => rareWords.has(w));
}

function main() {
  const { target, json } = parseArgs(process.argv.slice(2));
  const targetDate = dateOf(target);

  const corpusFiles = readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => join(POSTS_DIR, f))
    .filter((f) => f !== target && (!targetDate || dateOf(f) < targetDate));

  // Build the author's baseline fingerprint from prior posts.
  const corpusBigrams = new Set<string>();
  const corpusNgrams = new Set<string>();
  const corpusWordFreq = new Map<string, number>();
  for (const file of corpusFiles) {
    const w = words(toProse(readFileSync(file, 'utf8')));
    for (const t of w) corpusWordFreq.set(t, (corpusWordFreq.get(t) ?? 0) + 1);
    for (const g of ngrams(w, OPENER_N)) corpusBigrams.add(g); // every bigram anywhere, not just openers
    for (const g of ngrams(w, NOVEL_NGRAM_N)) corpusNgrams.add(g);
  }
  // "Rare" = appears in the target's topic but seldom in the baseline; used to
  // discount novelty that is merely a new subject rather than a new style.
  const rareWords = new Set<string>();

  // Analyze the target.
  const prose = toProse(readFileSync(target, 'utf8'));
  const targetSentences = sentences(prose);
  for (const w of words(prose)) {
    if ((corpusWordFreq.get(w) ?? 0) < 2) rareWords.add(w);
  }

  // A "novel opener" is a sentence whose leading bigram appears NOWHERE in the
  // author's prior prose — a construction they've genuinely never opened with.
  const novelOpeners: { opener: string; sentence: string }[] = [];
  const seenOpeners = new Set<string>();
  for (const sent of targetSentences) {
    const opener = words(sent).slice(0, OPENER_N).join(' ');
    if (opener && !corpusBigrams.has(opener) && !isTopical(opener, rareWords) && !seenOpeners.has(opener)) {
      seenOpeners.add(opener);
      novelOpeners.push({ opener, sentence: sent.slice(0, 100) });
    }
  }

  const seen = new Set<string>();
  const novelPhrasings: string[] = [];
  for (const g of ngrams(words(prose), NOVEL_NGRAM_N)) {
    if (!corpusNgrams.has(g) && !isTopical(g, rareWords) && !seen.has(g)) {
      seen.add(g);
      novelPhrasings.push(g);
    }
  }

  const openerDrift = targetSentences.length
    ? novelOpeners.length / targetSentences.length
    : 0;

  if (json) {
    console.log(
      JSON.stringify(
        { target: basename(target), baselinePosts: corpusFiles.length, openerDrift, novelOpeners, novelPhrasings },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`\ncorpus-drift — ${basename(target)}`);
  console.log(`baseline: ${corpusFiles.length} posts predating ${targetDate || '(undated)'}`);
  console.log(`sentences analyzed: ${targetSentences.length}`);
  console.log(
    `sentence-opener drift: ${(openerDrift * 100).toFixed(1)}% (${novelOpeners.length} openers never used before)\n`,
  );
  console.log('Novel sentence openers (style-only; topical ones filtered out):');
  if (novelOpeners.length === 0) console.log('  (none)');
  for (const { opener, sentence } of novelOpeners) {
    console.log(`  • "${opener}…"  —  ${sentence}${sentence.length >= 100 ? '…' : ''}`);
  }
  console.log(`\nNovel ${NOVEL_NGRAM_N}-grams never seen in prior prose (top 25, style-only):`);
  const top = novelPhrasings.slice(0, 25);
  if (top.length === 0) console.log('  (none)');
  for (const g of top) console.log(`  • ${g}`);
  console.log(
    '\nNote: novelty ≠ AI. This flags phrasings absent from your own back catalog,\n' +
      'so a human reviewer (or the LLM AI-tells lens) can decide which are drift\n' +
      'vs. simply new. Consistent voice is never penalized — only novelty is.\n',
  );
}

main();
