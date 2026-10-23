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
  /** The network's bio length limit, where it publishes one. */
  limit?: number;
  /** How the network counts toward `limit`. */
  unit: 'characters' | 'graphemes';
  /** Where to edit it by hand. */
  editUrl: string;
  /** True when `script/update-social-bios` can set it through an API. */
  automated: boolean;
}

// Every bio opens with the same lead clause so the profiles read as one
// person; the proof and the voice vary with who reads each network.
const lead = 'Product leader for developer platforms and open source.';

const bios = {
  github: `${lead} 10 years at GitHub, rewrote Pages, wrote Licensee. Lawyer who ships code. Author of Open and Async.`,
  twitter: `${lead} 10 years at GitHub. Lawyer who ships code. Author of Open and Async. Writes about working in the open.`,
  bluesky: `${lead} 10 years at GitHub: trust and safety PM, rewrote GitHub Pages, wrote Licensee. Author of Open and Async. Lawyer who ships code, former Presidential Innovation Fellow. ben.balter.com`,
  mastodon: "I'm a product leader for developer platforms and open source. I spent 10 years at GitHub, where I was a product manager for trust and safety, rewrote GitHub Pages, and wrote Licensee, the library behind GitHub's license detection. I wrote Open and Async, the playbook for remote and distributed teams. Also a lawyer who ships code and a former Presidential Innovation Fellow. Here for open source, async work, and building for agents.",
  gravatar: `${lead} I spent a decade at GitHub: five years as a product manager for trust and safety, shipping 500+ features and the github.com API endpoints behind them; a bottom-up rewrite of GitHub Pages; and Licensee, the open source library behind GitHub's license detection. Author of Open and Async, lawyer who ships code, and former Presidential Innovation Fellow. More at https://ben.balter.com`,
  // HN discounts self-descriptions, so this one leads with what Ben built.
  hackerNews: "I wrote Licensee, the open source library behind GitHub's license detection, and led a bottom-up rewrite of GitHub Pages. Over 10 years at GitHub I was also a product manager for trust and safety, shipping 500+ features and the github.com API endpoints behind them. Today I'm a product leader for developer platforms and open source. Author of Open and Async. Also a lawyer (DC Bar) and former Presidential Innovation Fellow. https://ben.balter.com",
};

export const socialBios: readonly SocialBio[] = [
  {
    network: 'GitHub',
    bio: bios.github,
    limit: 160,
    unit: 'characters',
    editUrl: 'https://github.com/settings/profile',
    automated: true,
  },
  {
    network: 'Bluesky',
    bio: bios.bluesky,
    limit: 256,
    unit: 'graphemes',
    editUrl: 'https://bsky.app/profile/ben.balter.com',
    automated: true,
  },
  {
    network: 'Mastodon',
    bio: bios.mastodon,
    limit: 500,
    unit: 'characters',
    editUrl: 'https://mastodon.social/settings/profile',
    automated: true,
  },
  {
    // X's API doesn't offer profile edits on the free tier, so this one is
    // copy-paste only.
    network: 'Twitter',
    bio: bios.twitter,
    limit: 160,
    unit: 'characters',
    editUrl: 'https://x.com/settings/profile',
    automated: false,
  },
  {
    // Feeds author boxes on WordPress and other sites that look up a Gravatar
    // by email. Gravatar publishes no limit for the about field.
    network: 'Gravatar',
    bio: bios.gravatar,
    unit: 'characters',
    editUrl: 'https://gravatar.com/profile',
    automated: true,
  },
  {
    // No write API, and no published limit for the about field.
    network: 'Hacker News',
    bio: bios.hackerNews,
    unit: 'characters',
    editUrl: 'https://news.ycombinator.com/user?id=benbalter',
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
