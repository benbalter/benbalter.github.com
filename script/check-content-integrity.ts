/**
 * Content integrity gate for bulk edits to posts.
 *
 * Compares every post changed between a base ref and HEAD and reports word
 * loss and edits to non-prose regions (code, scripts, URLs, quotations). See
 * src/lib/content-integrity.ts for what counts as a finding and why.
 *
 * Usage:
 *   npm run check-content-integrity -- [--base=<ref>] [--head=<ref>]
 *
 * Base defaults to CONTENT_INTEGRITY_BASE, else origin/main; head to
 * CONTENT_INTEGRITY_HEAD, else HEAD. The comparison starts at the merge-base
 * of the two, so commits that landed on main after a branch forked don't
 * count. Findings always print. The check fails (exit 1) only when:
 *   - the range touches BULK_POST_THRESHOLD or more existing posts, and
 *   - no commit in the range carries the trailer `Content-Integrity: reviewed`
 *     (CONTENT_INTEGRITY_REVIEWED=true does the same for a manual run).
 * A trailer rather than a PR label: labels don't retrigger CI, and re-runs
 * replay the original event, so a label added after the failure never counts.
 * Smaller diffs are deliberate editing; their findings are warnings only.
 */

import { execFileSync } from 'node:child_process';
import {
  BULK_POST_THRESHOLD,
  comparePost,
  firstDifference,
  hasReviewTrailer,
  isBulk,
  type Finding,
} from '../src/lib/content-integrity';

// _posts/ is the pre-Astro location; kept so the check can audit old history.
const POST_DIRS = ['src/content/posts/', '_posts/'];
const POST_EXT = /\.(md|mdx|markdown)$/;

const git = (...args: string[]): string =>
  execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });

const showOrNull = (ref: string, path: string): string | null => {
  try {
    return git('show', `${ref}:${path}`);
  } catch {
    return null;
  }
};

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((a) => a.startsWith(prefix))?.slice(prefix.length);
}

const isPost = (path: string) => POST_DIRS.some((d) => path.startsWith(d)) && POST_EXT.test(path);

interface Change {
  status: string;
  oldPath: string;
  newPath: string;
}

function changedPosts(base: string, head: string): Change[] {
  const out = git('diff', '--name-status', '-M', base, head, '--', ...POST_DIRS);
  const changes: Change[] = [];
  for (const line of out.split('\n')) {
    if (!line.trim()) continue;
    const [status, first, second] = line.split('\t');
    const change = { status: status[0], oldPath: first, newPath: second ?? first };
    // New posts can't lose anything; skip them.
    if (change.status === 'A') continue;
    if (isPost(change.oldPath) || isPost(change.newPath)) changes.push(change);
  }
  return changes;
}

function describe(finding: Finding): string[] {
  switch (finding.kind) {
    case 'deleted':
      return ['post deleted'];
    case 'word loss': {
      const pct = Math.round(((finding.before - finding.after) / finding.before) * 100);
      return [`word loss: ${finding.before} → ${finding.after} prose words (-${pct}%)`];
    }
    default: {
      const diff = firstDifference(finding.before, finding.after);
      return [
        `${finding.kind} ${finding.after === null ? 'removed' : 'changed'}:`,
        `  - ${diff.before}`,
        `  + ${diff.after}`,
      ];
    }
  }
}

function main(): void {
  const head = arg('head') ?? (process.env.CONTENT_INTEGRITY_HEAD || 'HEAD');
  const baseRef = arg('base') ?? (process.env.CONTENT_INTEGRITY_BASE || 'origin/main');
  // GitHub sends an all-zero `before` SHA on a branch's first push.
  if (/^0+$/.test(baseRef)) {
    console.log('Content integrity: no base commit (new branch); skipping.');
    return;
  }
  const base = git('merge-base', baseRef, head).trim();

  const changes = changedPosts(base, head);
  const bulk = isBulk(changes.length);
  const messages = git('log', '--format=%B', `${base}..${head}`);
  const reviewed = hasReviewTrailer(messages) || process.env.CONTENT_INTEGRITY_REVIEWED === 'true';

  console.log(
    `Content integrity: ${changes.length} existing post(s) changed in ${base.slice(0, 10)}..${head.slice(0, 10)} ` +
      `(bulk threshold ${BULK_POST_THRESHOLD}; ${bulk ? 'gating' : 'warnings only'}${reviewed ? '; reviewed' : ''})`,
  );

  let total = 0;
  for (const change of changes) {
    const before = showOrNull(base, change.oldPath);
    if (before === null) continue;
    const after = change.status === 'D' ? null : showOrNull(head, change.newPath);
    const findings = comparePost(before, after, {
      before: change.oldPath.endsWith('.mdx'),
      after: change.newPath.endsWith('.mdx'),
    });
    if (findings.length === 0) continue;

    total += findings.length;
    console.log(`\n✗ ${change.newPath}`);
    for (const finding of findings) {
      const lines = describe(finding);
      for (const line of lines) console.log(`    ${line}`);
      if (process.env.GITHUB_ACTIONS && bulk && !reviewed) {
        console.log(`::error file=${change.newPath}::${lines.join(' ').replace(/\n/g, ' ')}`);
      }
    }
  }

  if (total === 0) {
    console.log('No findings.');
    return;
  }

  console.log(`\n${total} finding(s).`);
  if (!bulk || reviewed) {
    console.log(
      reviewed
        ? 'Acknowledged via Content-Integrity: reviewed; not failing.'
        : `Fewer than ${BULK_POST_THRESHOLD} posts changed, so these are warnings only.`,
    );
    return;
  }
  console.log(
    '\nThis looks like a bulk pass that changed more than prose. Review each finding. If every change is\n' +
      'deliberate, add the trailer `Content-Integrity: reviewed` to a commit message in the range\n' +
      '(for example, an empty commit: git commit --allow-empty -m "Review content changes" \\\n' +
      '  -m "Content-Integrity: reviewed") and push.',
  );
  process.exitCode = 1;
}

main();
