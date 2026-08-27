#!/usr/bin/env tsx
/**
 * foundry-drafts.ts — mine the archive, draft high-potential posts in Ben's voice.
 *
 * Burns Azure AI Foundry (Azure OpenAI) inference to turn 16 years of posts into
 * (1) a ranked idea backlog and (2) voice-checked drafts, each run back through
 * Vale (the CI anti-AI-pattern gate) and revised until clean.
 *
 * Output goes to ./drafts/ (gitignored, OUTSIDE src/content/posts so nothing can
 * accidentally publish). Move the keepers into src/content/posts/ and edit before
 * shipping — these are strong drafts, not finished posts.
 *
 * Mirrors script/validate-seo.ts: glob + gray-matter, run via tsx, minimal deps,
 * native fetch (no SDK).
 *
 * Transport: Azure AI Foundry's v1 (OpenAI-compatible) surface — POST to
 * {endpoint}/chat/completions with header `api-key`, model-in-body, and
 * `max_completion_tokens` (mirrors ~/projects/book/script/lib/ai-client.js).
 *
 * Usage (env var names match the book project so `. ~/projects/book/.env` just works):
 *   export AZURE_API_ENDPOINT=https://<res>.openai.azure.com/openai/v1
 *   export AZURE_API_KEY=<key>
 *   export AI_MODEL=gpt-4.1            # or gpt-5.4 for higher quality; default gpt-4.1
 *   npx tsx script/foundry-drafts.ts --dry-run       # no API: prove wiring + lint plumbing
 *   npx tsx script/foundry-drafts.ts --ideas-only    # Stage 1 only (cheap): writes drafts/IDEAS.md
 *   npx tsx script/foundry-drafts.ts --top 6         # full run: draft the top 6 ideas
 */

import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import {
  hasFlag,
  intFlag,
  chatEndpoint,
  createFoundryClient,
  parseJson,
  loadPosts,
  estCost,
  type Msg,
} from './lib/foundry';

// ---------------------------------------------------------------- CLI args ---
const argv = process.argv.slice(2);
const DRY_RUN = hasFlag(argv, '--dry-run');
const IDEAS_ONLY = hasFlag(argv, '--ideas-only');
const REUSE_IDEAS = hasFlag(argv, '--reuse-ideas'); // draft from an existing drafts/ideas.json
const TOP = intFlag(argv, '--top', 6);
const CANDIDATES_PER_LENS = intFlag(argv, '--candidates', 8);
const MAX_LINT_ITERS = intFlag(argv, '--max-iters', 3);
const EXEMPLAR_COUNT = 3;

// -------------------------------------------------------------- Azure config ---
// Accept both the AZURE_OPENAI_* names and the book project's AZURE_API_* aliases,
// so sourcing ~/projects/book/.env works directly.
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
const MODEL =
  process.env.AZURE_OPENAI_DEPLOYMENT || process.env.AI_MODEL || 'gpt-4.1';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'drafts');
const TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const client = createFoundryClient({ endpoint: chatEndpoint(ENDPOINT_RAW), apiKey: API_KEY, model: MODEL, dryRun: DRY_RUN });

// ------------------------------------------------------------- corpus loading ---
interface Post {
  id: string;
  date: string;
  title: string;
  description: string;
  excerpt: string;
  wordCount: number;
  body: string;
}

function toPlain(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function loadCorpus(): Post[] {
  return loadPosts(ROOT)
    .map((p) => {
      const plain = toPlain(p.body);
      return {
        ...p,
        excerpt: plain.split(' ').slice(0, 180).join(' '),
        wordCount: plain.split(' ').length,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Pick voice exemplars: prefer the cornerstone posts, backfill with longer recent ones. */
function pickExemplars(posts: Post[]): Post[] {
  const cornerstones = ['why-async', 'leaders-show-their-work', 'rules-of-communicating'];
  const chosen: Post[] = [];
  for (const slug of cornerstones) {
    const hit = posts.find((p) => p.id.includes(slug));
    if (hit) chosen.push(hit);
  }
  const substantial = [...posts]
    .filter((p) => !chosen.includes(p) && p.wordCount > 800 && p.wordCount < 2200)
    .sort((a, b) => b.date.localeCompare(a.date));
  while (chosen.length < EXEMPLAR_COUNT && substantial.length) chosen.push(substantial.shift()!);
  return chosen.slice(0, EXEMPLAR_COUNT);
}

// ---------------------------------------------------------------- prompt data ---
const VOICE_GUIDE = fs.readFileSync(
  path.join(ROOT, 'src/content/CLAUDE.md'),
  'utf-8'
);

const BOOK_CONTEXT = `The author recently launched a book, "Open & Async" (open-and-async.com):
"The collaborative software development playbook for remote and distributed teams."
Core themes to draw on where they fit naturally: working in the open, defaulting to async,
"showing your work", "communications debt", "caremad", and "Why async". A subtle, earned
tie-in to these themes is a plus — never a forced advertisement.`;

const MOST_READ_FRAMEWORK = `The author's most-read posts tend to share MOST of these traits
(a lens, not a checklist):
1. Personal, data-backed sourcing — a number, a spreadsheet, a lived count, not just opinion.
2. A named professional pain — a specific anxiety a reader can name (reorgs, getting promoted
   remotely, interviewing, on-call).
3. A copy-pasteable playbook — an actionable checklist, template, or steps to bookmark.
4. One punchy, contrarian-but-true thesis — a single clear claim, not a survey.
Distribution leans on sharing over search, so shareability matters more than SEO. The AI angle
lands best tied to firsthand management/GitHub experience, not a generic tooling take.`;

// -------------------------------------------------------------- Stage 1: mine ---
interface Idea {
  slug: string;
  title: string;
  thesis: string;
  pain: string;
  hook: string; // the personal/data hook the author would supply
  playbook: string; // the copy-pasteable artifact
  bookTieIn: string;
  traitScores: { sourcing: number; pain: number; playbook: number; thesis: number };
  score: number;
  why: string;
}

const LENSES: { key: string; instruction: string }[] = [
  {
    key: 'gap',
    instruction:
      'GAP ANALYSIS. Propose posts on topics ADJACENT to what the author covers well but has not written, or that the book raises but the blog never expanded. Avoid duplicating existing titles.',
  },
  {
    key: 'trait',
    instruction:
      'MOST-READ TRAITS. Propose posts engineered to hit all four most-read traits at once. Be specific about the named pain and the copy-pasteable playbook.',
  },
  {
    key: 'contrarian',
    instruction:
      'CONTRARIAN THESIS. Each idea must center on a single, defensible, counterintuitive claim the author could actually defend from experience — not clickbait.',
  },
  {
    key: 'book',
    instruction:
      'BOOK TIE-IN. Propose posts that pull Open & Async themes (async, showing your work, communications debt) toward a shareable, standalone post that earns the book mention rather than advertising it.',
  },
];

function corpusIndex(posts: Post[]): string {
  return posts.map((p) => `- ${p.date} — ${p.title}`).join('\n');
}

async function mineIdeas(posts: Post[]): Promise<Idea[]> {
  const index = corpusIndex(posts);
  const ideaSchema = `Return JSON: {"ideas":[{"slug":"kebab-case","title":"50-60 chars, no markdown","thesis":"one sentence","pain":"the named professional pain","hook":"the personal/data-backed hook the author would supply","playbook":"the copy-pasteable artifact","bookTieIn":"how it connects to Open & Async, or empty","traitScores":{"sourcing":0-5,"pain":0-5,"playbook":0-5,"thesis":0-5},"why":"one line on why this would resonate"}]}`;

  const candidates: Idea[] = [];
  for (const lens of LENSES) {
    const stub = JSON.stringify({
      ideas: [
        {
          slug: `dry-run-${lens.key}-idea`,
          title: `Dry-run idea from the ${lens.key} lens`,
          thesis: 'A stub thesis produced without calling the API.',
          pain: 'Validating the pipeline without spending credits.',
          hook: 'A lived count from wiring up the script.',
          playbook: 'Run --dry-run, then --ideas-only, then the full run.',
          bookTieIn: '',
          traitScores: { sourcing: 3, pain: 3, playbook: 4, thesis: 3 },
          why: 'Confirms Stage 1 parsing end to end.',
        },
      ],
    });
    const text = await client.chat(
      [
        {
          role: 'system',
          content: `You generate blog post ideas for a specific author. Study the author's voice and standards below and propose ideas ONLY that author would write — firsthand, opinionated, engineering-leadership-flavored.\n\n===== VOICE & STANDARDS =====\n${VOICE_GUIDE}\n\n===== MOST-READ FRAMEWORK =====\n${MOST_READ_FRAMEWORK}\n\n===== BOOK =====\n${BOOK_CONTEXT}`,
        },
        {
          role: 'user',
          content: `Here is the author's full archive (${posts.length} posts, ${posts[0].date}–${posts[posts.length - 1].date}), by date and title. Do NOT repeat these; find white space.\n\n${index}\n\nTASK — ${lens.instruction}\n\nPropose ${CANDIDATES_PER_LENS} distinct ideas. ${ideaSchema}`,
        },
      ],
      { json: true, maxTokens: 2600, temperature: 0.9, stub }
    );
    try {
      const parsed = parseJson<{ ideas: Idea[] }>(text);
      for (const idea of parsed.ideas ?? []) candidates.push(idea);
      console.log(`  lens:${lens.key} → ${parsed.ideas?.length ?? 0} ideas`);
    } catch (e) {
      console.warn(`  lens:${lens.key} → parse failed: ${(e as Error).message}`);
    }
  }

  // Synthesis: dedupe, rank, and score across all lenses.
  const rankStub = JSON.stringify({
    ideas: candidates.map((c, i) => ({
      ...c,
      score: 90 - i,
    })),
  });
  const rankText = await client.chat(
    [
      {
        role: 'system',
        content: `You are a ruthless editor for this author. Given a pool of candidate ideas, deduplicate near-identical ones, drop weak or off-voice ideas, and rank the rest by likely resonance using the most-read framework.\n\n${MOST_READ_FRAMEWORK}`,
      },
      {
        role: 'user',
        content: `Candidate pool (JSON):\n${JSON.stringify(candidates)}\n\nReturn the merged, ranked list. Add an integer "score" (0-100) to each and sort descending. Keep the best ${Math.max(TOP + 8, 16)}. Same JSON shape as input, wrapped as {"ideas":[...]}.`,
      },
    ],
    { json: true, maxTokens: 4000, temperature: 0.4, stub: rankStub }
  );
  const ranked = parseJson<{ ideas: Idea[] }>(rankText).ideas ?? [];
  return ranked;
}

function writeIdeasDoc(ideas: Idea[]) {
  const lines: string[] = [];
  lines.push('# Post idea backlog');
  lines.push('');
  lines.push(
    `Generated by \`script/foundry-drafts.ts\` on ${TODAY}. Ranked by likely resonance against the most-read framework. Scores are the model's estimate, not gospel — use as a starting point.`
  );
  lines.push('');
  ideas.forEach((idea, i) => {
    const t = idea.traitScores ?? { sourcing: 0, pain: 0, playbook: 0, thesis: 0 };
    lines.push(`## ${i + 1}. ${idea.title}  ·  score ${idea.score ?? '—'}`);
    lines.push('');
    lines.push(`- **Thesis:** ${idea.thesis}`);
    lines.push(`- **Named pain:** ${idea.pain}`);
    lines.push(`- **Hook you'd supply:** ${idea.hook}`);
    lines.push(`- **Playbook:** ${idea.playbook}`);
    if (idea.bookTieIn) lines.push(`- **Book tie-in:** ${idea.bookTieIn}`);
    lines.push(
      `- **Trait scores:** sourcing ${t.sourcing}/5 · pain ${t.pain}/5 · playbook ${t.playbook}/5 · thesis ${t.thesis}/5`
    );
    if (idea.why) lines.push(`- **Why it resonates:** ${idea.why}`);
    lines.push(`- **Draft slug:** \`${idea.slug}\``);
    lines.push('');
  });
  fs.writeFileSync(path.join(OUT_DIR, 'IDEAS.md'), lines.join('\n'));
  // Machine-readable sidecar so a later run can --reuse-ideas without re-mining.
  fs.writeFileSync(path.join(OUT_DIR, 'ideas.json'), JSON.stringify(ideas, null, 2));
}

// ------------------------------------------------------ Stage 2: draft + gate ---
interface DraftResult {
  slug: string;
  title: string;
  file: string;
  iters: number;
  valeClean: boolean;
  valeReport: string;
}

/** Run Vale (the hard gate) plus advisory linters; return combined report + clean flag. */
function lint(file: string): { clean: boolean; report: string } {
  // Capture exit code, not stdout regex: vale exits non-zero IFF it finds
  // alerts at/above --minAlertLevel, which here is `error`. That's the CI gate,
  // and it's immune to ANSI color codes in the human-readable output.
  const capture = (cmd: string, args: string[]): { code: number; out: string } => {
    try {
      const out = execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
      return { code: 0, out };
    } catch (e: any) {
      return { code: typeof e.status === 'number' ? e.status : 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
    }
  };
  const vale = capture('vale', [file, '--minAlertLevel=error']);
  const textlint = capture('npx', ['--no-install', 'textlint', file, '--dry-run']);
  return {
    clean: vale.code === 0,
    report: `----- vale (--minAlertLevel=error, the CI gate) -----\n${vale.out.trim() || '(clean)'}\n\n----- textlint (advisory) -----\n${textlint.out.trim() || '(clean)'}`,
  };
}

/** Strip any leading YAML front matter the model echoed into the body. In the
 *  revise pass we show it the current file (which has front matter), and it
 *  sometimes copies that block into `body` — which would double-wrap it. */
function stripEchoedFrontmatter(body: string): string {
  let b = body.trimStart();
  while (/^---\r?\n[\s\S]*?\r?\n---\r?\n?/.test(b)) {
    b = b.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trimStart();
  }
  return b;
}

function assembleMarkdown(title: string, description: string, body: string): string {
  body = stripEchoedFrontmatter(body);
  // Deterministic, valid front matter — the model supplies prose, not YAML.
  // Escape backslashes before quotes so a literal `\` in the prose can't
  // combine with the following char to break out of the quoted YAML string.
  const esc = (s: string) =>
    `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  const fm = [
    '---',
    `title: ${esc(title)}`,
    `description: ${esc(description)}`,
    'published: false',
    `date: ${TODAY}`,
    '---',
    '',
  ].join('\n');
  return fm + body.trim() + '\n';
}

async function draftIdea(idea: Idea, exemplars: Post[]): Promise<DraftResult> {
  const slug = idea.slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  const file = path.join(OUT_DIR, `${TODAY}-${slug}.md`);
  const relFile = path.relative(ROOT, file);

  const exemplarBlock = exemplars
    .map((p, i) => `### Exemplar ${i + 1}: ${p.title}\n\n${p.body.slice(0, 6000)}`)
    .join('\n\n');

  const system: Msg = {
    role: 'system',
    content: `You are ghost-writing a blog post in the exact voice of a specific author. Absorb the author's standards and imitate the CADENCE of the exemplars, not just the rules. This will be checked by an automated anti-AI-pattern linter (Vale) — any of the listed patterns will fail it.\n\n===== VOICE & STANDARDS (non-negotiable) =====\n${VOICE_GUIDE}\n\n===== BOOK =====\n${BOOK_CONTEXT}\n\n===== VOICE EXEMPLARS (imitate this rhythm) =====\n${exemplarBlock}`,
  };

  const draftStub = JSON.stringify({
    title: idea.title.slice(0, 60),
    description:
      'A dry-run description written to exceed seventy characters so the front-matter validity check has something real to measure against.',
    body: `Picture this: you open the repo and the answer is already there, written down, waiting.\n\nThat is the whole game. When you write things down, you stop paying the same tax twice. You stop answering the same question in five different Slack threads, and you start answering it once, in a place people can find.\n\nHere is what I do. I keep a running doc. I link to it instead of retyping. I let the doc get better every time someone asks. Small habit, compounding return.\n\nThe work speaks. Let it.`,
  });

  let text = await client.chat(
    [
      system,
      {
        role: 'user',
        content: `Write a complete blog post (~900-1300 words) for this idea:\n\nTitle: ${idea.title}\nThesis: ${idea.thesis}\nNamed pain: ${idea.pain}\nHook to build from: ${idea.hook}\nPlaybook to include: ${idea.playbook}\nBook tie-in (optional, earned): ${idea.bookTieIn}\n\nRules: open with a hook (no throat-clearing), include the copy-pasteable playbook, take one clear stance, vary paragraph length, use "I" for experience and "you" for the reader. Where the hook needs a specific number or anecdote the author must supply, write a clearly bracketed placeholder like [NUMBER: e.g., "answered the same question 40 times"] so it's obvious what to fill in.\n\nReturn JSON: {"title":"final title, 50-60 chars, no markdown","description":"70-160 chars, plain text, compelling","body":"the full post in Markdown, starting at an H2 or prose (NO H1, NO front matter)"}`,
      },
    ],
    { json: true, maxTokens: 3000, temperature: 0.85, stub: draftStub }
  );

  let draft = parseJson<{ title: string; description: string; body: string }>(text);
  fs.writeFileSync(file, assembleMarkdown(draft.title, draft.description, draft.body));

  let iters = 1;
  let result = lint(file);
  while (!result.clean && iters < MAX_LINT_ITERS) {
    iters++;
    const reviseStub = draftStub; // dry-run: unchanged
    text = await client.chat(
      [
        system,
        {
          role: 'user',
          content: `Your draft below tripped the anti-AI-pattern linter. Fix ONLY the flagged issues; keep the argument, structure, and voice intact. Do not introduce new AI tells.\n\n===== CURRENT DRAFT =====\n${fs.readFileSync(file, 'utf-8')}\n\n===== LINTER OUTPUT =====\n${result.report}\n\nReturn the same JSON shape: {"title","description","body"}.`,
        },
      ],
      { json: true, maxTokens: 3000, temperature: 0.5, stub: reviseStub }
    );
    draft = parseJson(text);
    fs.writeFileSync(file, assembleMarkdown(draft.title, draft.description, draft.body));
    result = lint(file);
  }

  return {
    slug,
    title: draft.title,
    file: relFile,
    iters,
    valeClean: result.clean,
    valeReport: result.report,
  };
}

// ------------------------------------------------------------------- run log ---
function writeRunLog(results: DraftResult[]) {
  const lines: string[] = [];
  lines.push('# Draft run log');
  lines.push('');
  lines.push(`- Date: ${TODAY}`);
  lines.push(`- API calls: ${client.usage.apiCalls}`);
  lines.push(`- Tokens: ${client.usage.promptTokens.toLocaleString()} in / ${client.usage.completionTokens.toLocaleString()} out`);
  lines.push(`- Estimated spend: ${estCost(client.usage, 2.5, 10)}`);
  lines.push('');
  lines.push('| Draft | Lint iters | Vale clean | File |');
  lines.push('|-------|-----------|-----------|------|');
  for (const r of results) {
    lines.push(`| ${r.title} | ${r.iters} | ${r.valeClean ? '✅' : '⚠️ flagged'} | \`${r.file}\` |`);
  }
  lines.push('');
  for (const r of results) {
    if (!r.valeClean) {
      lines.push(`## ⚠️ ${r.title} — still flagged after ${r.iters} passes`);
      lines.push('');
      lines.push('```');
      lines.push(r.valeReport);
      lines.push('```');
      lines.push('');
    }
  }
  fs.writeFileSync(path.join(OUT_DIR, 'RUN-LOG.md'), lines.join('\n'));
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
    console.error('   e.g. `set -a; . ~/projects/book/.env; set +a` then re-run.');
    console.error('   Or use --dry-run to validate wiring without calling the API.\n');
    process.exit(1);
  }
}

async function authSmokeTest() {
  if (DRY_RUN) return;
  process.stdout.write(`🔌 Auth smoke test (model=${MODEL})... `);
  const reply = await client.chat([{ role: 'user', content: 'Reply with the single word: ok' }], {
    maxTokens: 16,
    temperature: 0,
  });
  console.log(`got "${reply.trim()}" ✅`);
}

async function main() {
  console.log(`\n🏭 foundry-drafts ${DRY_RUN ? '(DRY RUN — no API calls)' : ''}\n`);
  requireCreds();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const posts = loadCorpus();
  console.log(`📚 Loaded ${posts.length} live posts (${posts[0].date}–${posts[posts.length - 1].date})`);
  const exemplars = pickExemplars(posts);
  console.log(`🎙️  Voice exemplars: ${exemplars.map((p) => p.id).join(', ')}`);
  console.log(`📏 Voice guide: ${VOICE_GUIDE.length} chars loaded from src/content/CLAUDE.md`);

  await authSmokeTest();

  let ideas: Idea[];
  if (REUSE_IDEAS) {
    const sidecar = path.join(OUT_DIR, 'ideas.json');
    if (!fs.existsSync(sidecar)) {
      console.error(`\n❌ --reuse-ideas but ${path.relative(ROOT, sidecar)} not found. Run Stage 1 first (--ideas-only).\n`);
      process.exit(1);
    }
    ideas = JSON.parse(fs.readFileSync(sidecar, 'utf-8'));
    console.log(`\n♻️  Reusing ${ideas.length} ideas from drafts/ideas.json (skipping Stage 1)`);
  } else {
    console.log('\n⛏️  Stage 1 — mining ideas across lenses...');
    ideas = await mineIdeas(posts);
    writeIdeasDoc(ideas);
    console.log(`✍️  Wrote drafts/IDEAS.md (${ideas.length} ranked ideas)`);
  }

  if (IDEAS_ONLY) {
    console.log('\n✅ --ideas-only: stopping after Stage 1. Review drafts/IDEAS.md before drafting.');
    console.log(`   Tokens: ${client.usage.promptTokens} in / ${client.usage.completionTokens} out · ${estCost(client.usage, 2.5, 10)}\n`);
    return;
  }

  console.log(`\n📝 Stage 2 — drafting top ${TOP} ideas (Vale-gated, up to ${MAX_LINT_ITERS} passes each)...`);
  const results: DraftResult[] = [];
  for (const idea of ideas.slice(0, TOP)) {
    process.stdout.write(`  • ${idea.slug} ... `);
    try {
      const r = await draftIdea(idea, exemplars);
      console.log(`${r.valeClean ? 'clean' : 'FLAGGED'} after ${r.iters} pass(es) → ${r.file}`);
      results.push(r);
    } catch (e) {
      console.log(`✗ errored (${(e as Error).message}) — skipping, continuing batch`);
    }
  }
  writeRunLog(results);

  const clean = results.filter((r) => r.valeClean).length;
  console.log(`\n✅ Done. ${clean}/${results.length} drafts pass the Vale gate. See drafts/RUN-LOG.md`);
  console.log(`   Tokens: ${client.usage.promptTokens.toLocaleString()} in / ${client.usage.completionTokens.toLocaleString()} out · ${estCost(client.usage, 2.5, 10)}`);
  console.log('   Drafts are in drafts/ (gitignored). Edit + move keepers into src/content/posts/.\n');
}

main().catch((e) => {
  console.error('\n❌ Failed:', e.message);
  process.exit(1);
});
