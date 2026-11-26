/**
 * Kit (ConvertKit) broadcast lookups shared by script/email-broadcast.mjs and
 * its tests. Kept apart from the script so tests can import it without the
 * Astro Markdown pipeline the script loads.
 */

export const KIT_API_URL = 'https://api.kit.com/v4/broadcasts';

interface KitBroadcast {
  subject?: string;
  status?: string;
}

/**
 * Subjects of broadcasts that have ALREADY BEEN SENT. Throws if Kit can't be
 * read: an empty set would read as "nothing sent yet", so a re-run after a
 * partial failure would re-send posts that already went out.
 *
 * Drafts are deliberately excluded: Kit "saves as draft" when a POST fails
 * (transient/capacity/rate-limit 422s), so a failed attempt leaves a draft with
 * this subject behind. Counting drafts here would make the very next run skip
 * the post as "already broadcast" and it would never actually send.
 */
export async function getExistingBroadcastSubjects(apiKey: string): Promise<Set<string>> {
  const response = await fetch(KIT_API_URL, {
    headers: { 'X-Kit-Api-Key': apiKey },
  });
  if (!response.ok) {
    throw new Error(`Kit returned HTTP ${response.status} listing broadcasts`);
  }
  const data = (await response.json()) as { broadcasts?: KitBroadcast[] };
  const subjects = new Set<string>();
  for (const broadcast of data.broadcasts ?? []) {
    if (broadcast.subject && broadcast.status && broadcast.status !== 'draft') {
      subjects.add(broadcast.subject);
    }
  }
  return subjects;
}
