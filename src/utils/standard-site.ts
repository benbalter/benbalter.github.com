/**
 * standard.site (https://standard.site/) helpers.
 *
 * standard.site links blog posts to AT Protocol records so indexers can verify
 * authorship. Each post maps to a `site.standard.document` record keyed by a TID
 * (a timestamp-ordered AT Protocol record key). We *derive* that key
 * deterministically from the post — timestamp bits from the publish date (for
 * sortability), clock-id bits from a hash of the post id (for uniqueness among
 * same-day posts) — so the document's AT-URI is computable at build time with no
 * stored state. The sync script generates the same key, making `putRecord`
 * idempotent.
 *
 * See the lexicon: https://standard.site/docs/lexicons/document/
 */

import { TID } from '@atproto/common-web';
import { siteConfig } from '../config';

const TID_CLOCKID_MAX = 1024; // 10 bits

/**
 * Stable, deterministic 32-bit string hash (FNV-1a). Used to derive a TID
 * clock identifier from the post id so same-day posts get distinct keys.
 */
function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // FNV prime, kept in 32-bit range via Math.imul.
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Microseconds since the UNIX epoch for a post's publish date. Derived from the
 * `YYYY-MM-DD` prefix of the post id at UTC midnight so the value is independent
 * of the machine's timezone (the build and the CI sync must agree on the rkey,
 * and they may run in different zones). Falls back to `pubDate` for ids without a
 * date prefix.
 */
function postTimestampMicros(postId: string, pubDate: Date): number {
  const match = postId.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const millis = match
    ? Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : pubDate.getTime();
  return millis * 1000;
}

/**
 * Build a valid AT Protocol TID for a post's `site.standard.document` record.
 *
 * The TID is 13 base32-sortable chars: an 11-char timestamp prefix (microseconds
 * since the UNIX epoch, from the post's publish date) plus a 2-char clock
 * identifier derived from `postId`. Deterministic and timezone-independent: the
 * same inputs always yield the same key on any machine.
 *
 * @param postId - Post id/slug (e.g. "2026-06-15-my-post")
 * @param pubDate - Publish date (fallback when `postId` has no date prefix)
 */
export function getDocumentRkey(postId: string, pubDate: Date): string {
  const timestampMicros = postTimestampMicros(postId, pubDate);
  const clockid = hashString(postId) % TID_CLOCKID_MAX;
  // fromTime base32-sortable-encodes both parts. Timestamps from Sept 2005 to
  // the year 3111 fill the 11-char prefix exactly; outside that range it throws
  // rather than emitting a malformed key.
  return TID.fromTime(timestampMicros, clockid).toString();
}

/**
 * Whether a post qualifies for standard.site (published on/after the configured
 * `since` cutoff). Going-forward scope: existing posts before the cutoff are not
 * synced. Returns false when no cutoff is configured.
 */
export function qualifiesForStandardSite(pubDate: Date): boolean {
  const since = siteConfig.standardSite.since;
  if (!since) return false;
  return pubDate.getTime() >= new Date(since).getTime();
}

/**
 * Full AT-URI of a post's `site.standard.document` record, or null when the post
 * doesn't qualify or no DID is configured. Used to render the document link tag.
 */
export function getDocumentUri(postId: string, pubDate: Date): string | null {
  const { did } = siteConfig.standardSite;
  if (!did || !qualifiesForStandardSite(pubDate)) return null;
  return `at://${did}/site.standard.document/${getDocumentRkey(postId, pubDate)}`;
}
