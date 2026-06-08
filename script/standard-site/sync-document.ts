/**
 * Sync blog posts to AT Protocol as site.standard.document records.
 *
 * Used by the standard-site-sync CI workflow (and runnable locally). For each
 * selected post that qualifies (published on/after siteConfig.standardSite.since),
 * upserts a site.standard.document record at a deterministic rkey derived from
 * the post — so the record key matches the AT-URI the site renders in its link
 * tag, with no stored mapping. Idempotent: re-running updates in place.
 *
 * Usage:
 *   # Sync specific posts (CI passes newly added files):
 *   ATPROTO_APP_PASSWORD=xxxx npx tsx script/standard-site/sync-document.ts \
 *     src/content/posts/2026-06-15-my-post.md [more…] [--dry-run]
 *
 *   # Backfill every post (ignores the `since` cutoff with --force):
 *   ATPROTO_APP_PASSWORD=xxxx npx tsx script/standard-site/sync-document.ts --all --force
 *
 *   # Delete records (full undo of a backfill):
 *   ATPROTO_APP_PASSWORD=xxxx npx tsx script/standard-site/sync-document.ts --delete --all
 *   ATPROTO_APP_PASSWORD=xxxx npx tsx script/standard-site/sync-document.ts --delete <files…>
 *
 * Flags:
 *   --dry-run  Preview without writing to the PDS.
 *   --all      Operate on every post in src/content/posts (instead of file args).
 *   --force    Upsert even posts before the `since` cutoff (for backfilling).
 *   --delete   Remove records instead of upserting. With --all, enumerates and
 *              deletes the entire site.standard.document collection.
 *
 * Note: --force/--all create records, but the site only renders link tags for
 * posts on/after siteConfig.standardSite.since. To surface backfilled posts, set
 * `since` to an early date and redeploy.
 *
 * Reference: https://standard.site/docs/lexicons/document/
 */

import { readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import matter from 'gray-matter';
import { siteConfig } from '../../src/config';
import { getPostUrl, getDateFromSlug } from '../../src/utils/post-urls';
import { getDocumentRkey, qualifiesForStandardSite } from '../../src/utils/standard-site';
import { login, type Session } from './auth';

const COLLECTION = 'site.standard.document';
const POSTS_DIR = 'src/content/posts';

// Keep textContent well under atproto's per-record size ceiling (~64KB for the
// whole record); truncate very long posts rather than failing the putRecord.
const MAX_TEXT_CONTENT = 50_000;

/** Reduce markdown to a plaintext approximation for the document's textContent. */
function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // headings
    .replace(/^\s{0,3}>\s?/gm, '') // blockquotes
    .replace(/[*_~]{1,3}/g, '') // emphasis markers
    .replace(/<[^>]+>/g, ' ') // raw HTML tags
    .replace(/\s+/g, ' ')
    .trim();
}

interface DocumentRecord {
  $type: 'site.standard.document';
  site: string;
  title: string;
  publishedAt: string;
  path: string;
  description?: string;
  tags?: string[];
  textContent?: string;
}

function buildRecord(postId: string, pubDate: Date, data: Record<string, unknown>, body: string): DocumentRecord {
  const record: DocumentRecord = {
    $type: 'site.standard.document',
    site: siteConfig.standardSite.publicationUri || siteConfig.url,
    title: String(data.title ?? ''),
    publishedAt: pubDate.toISOString(),
    path: getPostUrl(postId),
  };
  if (typeof data.description === 'string' && data.description) {
    record.description = data.description;
  }
  if (Array.isArray(data.categories) && data.categories.length > 0) {
    record.tags = data.categories.map((c) => String(c));
  }
  let textContent = stripMarkdown(body);
  if (textContent.length > MAX_TEXT_CONTENT) {
    console.warn(`⚠️  ${postId}: textContent truncated from ${textContent.length} to ${MAX_TEXT_CONTENT} chars`);
    textContent = textContent.slice(0, MAX_TEXT_CONTENT);
  }
  if (textContent) {
    record.textContent = textContent;
  }
  return record;
}

/** Every dated post file under POSTS_DIR (recursively). Non-dated files (e.g. a
 * README) are skipped so --all never pushes a bogus record to the PDS. */
function allPostFiles(): string[] {
  return readdirSync(POSTS_DIR, { recursive: true })
    .map((f) => String(f))
    .filter((f) => /(^|\/)\d{4}-\d{2}-\d{2}-.+\.mdx?$/.test(f))
    .map((f) => join(POSTS_DIR, f));
}

/** Enumerate and delete every record in the collection — the full backfill undo. */
async function deleteEntireCollection(session: Session | null, dryRun: boolean): Promise<void> {
  if (dryRun) {
    console.log(`🔎 Would delete every record in ${COLLECTION} (dry run)`);
    return;
  }
  let cursor: string | undefined;
  let count = 0;
  do {
    const res = await session!.agent.com.atproto.repo.listRecords({
      repo: session!.did,
      collection: COLLECTION,
      limit: 100,
      cursor,
    });
    for (const rec of res.data.records) {
      const rkey = rec.uri.split('/').pop()!;
      await session!.agent.com.atproto.repo.deleteRecord({ repo: session!.did, collection: COLLECTION, rkey });
      count++;
    }
    cursor = res.data.cursor;
  } while (cursor);
  console.log(`🗑️  Deleted ${count} record(s) from ${COLLECTION}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const all = args.includes('--all');
  const force = args.includes('--force');
  const del = args.includes('--delete');
  const fileArgs = args.filter((a: string) => !a.startsWith('--'));

  const session = dryRun ? null : await login();

  // Full-collection wipe (true undo) — independent of source files / keys.
  if (del && all) {
    await deleteEntireCollection(session, dryRun);
    return;
  }

  const files = all ? allPostFiles() : fileArgs;
  if (files.length === 0) {
    console.error('Usage: sync-document.ts <post-file…> | --all  [--delete] [--force] [--dry-run]');
    process.exit(1);
  }

  for (const file of files) {
    const postId = basename(file).replace(/\.mdx?$/, '');
    const pubDate = getDateFromSlug(postId);
    const rkey = getDocumentRkey(postId, pubDate);

    if (del) {
      if (dryRun) {
        console.log(`🔎 ${postId} → would delete site.standard.document/${rkey}`);
        continue;
      }
      try {
        await session!.agent.com.atproto.repo.deleteRecord({ repo: session!.did, collection: COLLECTION, rkey });
        console.log(`🗑️  ${postId} → deleted site.standard.document/${rkey}`);
      } catch (err) {
        console.warn(`⚠️  ${postId}: delete failed (record may not exist): ${(err as Error).message}`);
      }
      continue;
    }

    const raw = readFileSync(file, 'utf-8');
    const { data, content } = matter(raw);

    if (data.published === false) {
      console.log(`⏭️  ${postId}: unpublished, skipping`);
      continue;
    }
    if (!force && !qualifiesForStandardSite(pubDate)) {
      console.log(`⏭️  ${postId}: before since=${siteConfig.standardSite.since}, skipping (use --force to override)`);
      continue;
    }

    const record = buildRecord(postId, pubDate, data, content);

    if (dryRun) {
      console.log(`📄 ${postId} → site.standard.document/${rkey}`);
      console.log(JSON.stringify(record, null, 2));
      continue;
    }

    await session!.agent.com.atproto.repo.putRecord({
      repo: session!.did,
      collection: COLLECTION,
      rkey,
      record,
    });
    console.log(`✅ ${postId} → at://${session!.did}/site.standard.document/${rkey}`);
  }
}

main().catch((err) => {
  console.error('❌ sync-document failed:', err);
  process.exit(1);
});
