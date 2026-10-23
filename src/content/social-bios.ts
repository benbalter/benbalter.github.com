/**
 * Social profile bios.
 *
 * Source of truth for the bio on each social network, shown with copy buttons
 * on src/pages/resume/social.astro. `script/update-social-bios` pushes the
 * ones with an API (`automated: true`) so they don't drift; the rest are
 * copy-paste. Kept in step with the LinkedIn headline in linkedin-bio.ts.
 */

export interface SocialBio {
  /** Network name, matching `socialLinks` in src/config.ts. */
  network: string;
  /** The bio text, exactly as it should appear. */
  bio: string;
  /** The network's bio length limit. */
  limit: number;
  /** How the network counts toward `limit`. */
  unit: 'characters' | 'graphemes';
  /** Where to edit it by hand. */
  editUrl: string;
  /** True when `script/update-social-bios` can set it through an API. */
  automated: boolean;
}

const shortBio = 'Product leader for developer platforms, APIs, and open source. 10 years at GitHub. Author of Open and Async. Attorney.';

const longBio = 'Product leader for developer platforms, APIs, and open source | 10 years at GitHub | Author of Open and Async | Presidential Innovation Fellow, attorney';

export const socialBios: readonly SocialBio[] = [
  {
    network: 'GitHub',
    bio: shortBio,
    limit: 160,
    unit: 'characters',
    editUrl: 'https://github.com/settings/profile',
    automated: true,
  },
  {
    network: 'Bluesky',
    bio: longBio,
    limit: 256,
    unit: 'graphemes',
    editUrl: 'https://bsky.app/profile/ben.balter.com',
    automated: true,
  },
  {
    network: 'Mastodon',
    bio: longBio,
    limit: 500,
    unit: 'characters',
    editUrl: 'https://mastodon.social/settings/profile',
    automated: true,
  },
  {
    // X's API doesn't offer profile edits on the free tier, so this one is
    // copy-paste only.
    network: 'Twitter',
    bio: shortBio,
    limit: 160,
    unit: 'characters',
    editUrl: 'https://x.com/settings/profile',
    automated: false,
  },
];

/** Length as the network counts it. */
export function bioLength(bio: SocialBio): number {
  if (bio.unit === 'graphemes') {
    return [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(bio.bio)].length;
  }
  return bio.bio.length;
}
