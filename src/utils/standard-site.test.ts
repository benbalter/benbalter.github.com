/**
 * Tests for standard.site deterministic record-key helpers.
 */

import { describe, it, expect } from 'vitest';
import { getDocumentRkey, getDocumentUri, qualifiesForStandardSite } from './standard-site';
import { siteConfig } from '../config';

// AT Protocol TID: 13 base32-sortable chars; first char restricted (top bit 0).
const TID_REGEX = /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/;

describe('getDocumentRkey', () => {
  it('produces a valid 13-char AT Protocol TID', () => {
    const rkey = getDocumentRkey('2026-06-15-my-post', new Date('2026-06-15'));
    expect(rkey).toHaveLength(13);
    expect(rkey).toMatch(TID_REGEX);
  });

  it('is deterministic — same inputs yield the same key', () => {
    const a = getDocumentRkey('2026-06-15-my-post', new Date('2026-06-15'));
    const b = getDocumentRkey('2026-06-15-my-post', new Date('2026-06-15'));
    expect(a).toBe(b);
  });

  it('gives distinct same-day posts distinct keys', () => {
    const date = new Date('2026-06-15');
    const a = getDocumentRkey('2026-06-15-first-post', date);
    const b = getDocumentRkey('2026-06-15-second-post', date);
    expect(a).not.toBe(b);
  });

  it('derives the key from the slug date, independent of the Date arg time/zone', () => {
    // Same slug, different Date instants → same key (rkey comes from the slug prefix).
    const a = getDocumentRkey('2026-06-15-post', new Date('2026-06-15T00:00:00Z'));
    const b = getDocumentRkey('2026-06-15-post', new Date('2026-06-15T23:59:59-08:00'));
    expect(a).toBe(b);
  });

  // Golden values produced by the original hand-rolled encoder. Published
  // records (and the AT-URIs in every built page) use these keys, so any
  // encoder change must reproduce them byte-for-byte.
  it.each([
    ['2010-09-12-wordpress-resume-plugin', '2010-09-12', '36k2mong222bc'],
    ['2026-06-15-my-post', '2026-06-15', '3moby2z4c22gr'],
    ['2026-06-15-second-post', '2026-06-15', '3moby2z4c22ep'],
    ['2020-02-29-leap-day', '2020-02-29', '3gzpildus22du'],
    ['post-id', '2026-07-20T12:34:56Z', '3mr3cl5ur22j5'],
    ['2099-12-31-far-future', '2099-12-31', '5on4ezmss227e'],
  ])('keeps the published key for %s', (postId, date, expected) => {
    expect(getDocumentRkey(postId, new Date(date))).toBe(expected);
  });

  it('sorts lexicographically by publish time', () => {
    const earlier = getDocumentRkey('post', new Date('2026-06-15'));
    const later = getDocumentRkey('post', new Date('2026-07-20'));
    expect(earlier < later).toBe(true);
  });
});

describe('qualifiesForStandardSite', () => {
  const since = new Date(siteConfig.standardSite.since);

  it('returns true on/after the since cutoff', () => {
    expect(qualifiesForStandardSite(since)).toBe(true);
    expect(qualifiesForStandardSite(new Date(since.getTime() + 86_400_000))).toBe(true);
  });

  it('returns false before the since cutoff', () => {
    expect(qualifiesForStandardSite(new Date(since.getTime() - 86_400_000))).toBe(false);
  });
});

describe('getDocumentUri', () => {
  const since = new Date(siteConfig.standardSite.since);

  it('returns a full AT-URI for a qualifying post', () => {
    const after = new Date(since.getTime() + 86_400_000);
    const uri = getDocumentUri('post-id', after);
    expect(uri).toBe(
      `at://${siteConfig.standardSite.did}/site.standard.document/${getDocumentRkey('post-id', after)}`
    );
  });

  it('returns null for a post before the cutoff', () => {
    expect(getDocumentUri('post-id', new Date(since.getTime() - 86_400_000))).toBeNull();
  });
});
