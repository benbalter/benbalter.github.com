/**
 * version.txt - the commit this build came from
 *
 * The deploy workflow polls this after `wrangler deploy` until it serves the
 * commit it just shipped (script/smoke-deploy), so a green deploy means the
 * live site is serving the new build, not just that the upload ran.
 *
 * GITHUB_SHA is set in Actions; local builds fall back to `git rev-parse`.
 */

import { execFileSync } from 'node:child_process';

function commit(): string {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

export function GET() {
  return new Response(`${commit()}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
