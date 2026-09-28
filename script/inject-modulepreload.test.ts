// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT = resolve(import.meta.dirname, 'inject-modulepreload');

describe('script/inject-modulepreload', () => {
  let dist: string;

  beforeEach(() => {
    dist = mkdtempSync(join(tmpdir(), 'modulepreload-'));
    mkdirSync(join(dist, '_astro', 'nested'), { recursive: true });
  });

  afterEach(() => {
    rmSync(dist, { recursive: true, force: true });
  });

  function run(entryCode: string): string {
    writeFileSync(join(dist, '_astro', 'entry.js'), entryCode);
    writeFileSync(
      join(dist, 'index.html'),
      '<html><head><meta charset="UTF-8"><script type="module" src="/_astro/entry.js"></script></head></html>',
    );
    execFileSync(process.execPath, [SCRIPT, dist], { stdio: 'pipe' });
    return readFileSync(join(dist, 'index.html'), 'utf8');
  }

  it('preloads side-effect imports without a from clause', () => {
    const html = run('import"./side.js";import{a}from"./named.js";console.log(a);');
    expect(html).toContain('<link rel="modulepreload" href="/_astro/side.js">');
    expect(html).toContain('<link rel="modulepreload" href="/_astro/named.js">');
  });

  it('resolves parent-relative imports and re-exports', () => {
    const html = run('export*from"./nested/../shared.js";import"../root.js";');
    expect(html).toContain('<link rel="modulepreload" href="/_astro/shared.js">');
    expect(html).toContain('<link rel="modulepreload" href="/root.js">');
  });

  it('skips dynamic imports', () => {
    const html = run('import("./lazy.js");');
    expect(html).not.toContain('modulepreload');
  });
});
