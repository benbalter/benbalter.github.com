/**
 * Push the social bios in src/content/social-bios.ts to the networks that
 * have an API for it (GitHub, Bluesky, Mastodon, Gravatar). Anything else is
 * copy-paste from /resume/social/.
 *
 * Dry run by default: prints each current bio next to the new one. Pass
 * --apply to write. Name networks to limit the run (e.g. `-- github`).
 *
 * Usage:
 *   npm run social-bios                      # dry run, all networks
 *   npm run social-bios -- --apply           # write all
 *   npm run social-bios -- --apply bluesky   # write one
 *
 * Credentials:
 *   GitHub    `gh` CLI auth. Writing needs the `user` scope: `gh auth refresh -s user`.
 *   Bluesky   ATPROTO_APP_PASSWORD (an app password, never the main one), as
 *             for the standard-site scripts.
 *   Mastodon  MASTODON_TOKEN, an access token with the write:accounts scope
 *             (mastodon.social → Preferences → Development → New application).
 *   Gravatar  GRAVATAR_TOKEN, a WordPress.com OAuth token. Register an app at
 *             https://developer.wordpress.com/apps/ and use its implicit-flow
 *             token (https://docs.gravatar.com/rest/getting-started/).
 *
 * Pass secrets through 1Password rather than the shell history, e.g.
 *   op run --env-file=.env.social -- npm run social-bios -- --apply
 * with .env.social holding op:// references only.
 */

import { execFileSync } from 'node:child_process';
import { socialBios, bioLength, type SocialBio } from '../src/content/social-bios';
import { siteConfig } from '../src/config';
import { login } from './standard-site/auth';

const MASTODON_INSTANCE = new URL(siteConfig.mastodonUrl).origin;
const MASTODON_ACCT = siteConfig.mastodonHandle.replace(/^@/, '');
const BLUESKY_HANDLE = new URL(siteConfig.blueskyUrl).pathname.split('/').pop() ?? '';
const GRAVATAR_USERNAME = siteConfig.socialUsername;

interface Updater {
  current(): Promise<string>;
  write(bio: string): Promise<void>;
}

const updaters: Record<string, Updater> = {
  github: {
    async current() {
      return execFileSync('gh', ['api', 'user', '--jq', '.bio'], { encoding: 'utf8' }).trim();
    },
    async write(bio) {
      try {
        execFileSync('gh', ['api', '-X', 'PATCH', 'user', '-f', `bio=${bio}`], { stdio: 'pipe' });
      } catch (error) {
        throw new Error(`gh api PATCH /user failed. If it's a scope error, run \`gh auth refresh -s user\`.\n${String(error)}`);
      }
    },
  },
  bluesky: {
    async current() {
      // Public read, so a dry run needs no credentials.
      const url = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(BLUESKY_HANDLE)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Bluesky profile lookup failed: ${response.status}`);
      const profile = (await response.json()) as { description?: string };
      return profile.description ?? '';
    },
    async write(bio) {
      const { agent } = await login();
      // upsertProfile keeps the display name, avatar, banner, and pinned post.
      await agent.upsertProfile((existing) => ({ ...existing, description: bio }));
    },
  },
  mastodon: {
    async current() {
      const response = await fetch(`${MASTODON_INSTANCE}/api/v1/accounts/lookup?acct=${encodeURIComponent(MASTODON_ACCT)}`);
      if (!response.ok) throw new Error(`Mastodon account lookup failed: ${response.status}`);
      const account = (await response.json()) as { note?: string };
      // Public lookups return the note as HTML; strip it for the comparison.
      return (account.note ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
    },
    async write(bio) {
      const token = process.env.MASTODON_TOKEN;
      if (!token) throw new Error('MASTODON_TOKEN environment variable is required (write:accounts scope)');
      // Only `note` is sent, so profile fields and the display name are untouched.
      const response = await fetch(`${MASTODON_INSTANCE}/api/v1/accounts/update_credentials`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: new URLSearchParams({ note: bio }),
      });
      if (!response.ok) throw new Error(`Mastodon update failed: ${response.status} ${await response.text()}`);
    },
  },
  gravatar: {
    async current() {
      // The legacy public profile JSON needs no API key.
      const response = await fetch(`https://en.gravatar.com/${encodeURIComponent(GRAVATAR_USERNAME)}.json`);
      if (!response.ok) throw new Error(`Gravatar profile lookup failed: ${response.status}`);
      const profile = (await response.json()) as { entry?: { aboutMe?: string }[] };
      return profile.entry?.[0]?.aboutMe ?? '';
    },
    async write(bio) {
      const token = process.env.GRAVATAR_TOKEN;
      if (!token) throw new Error('GRAVATAR_TOKEN environment variable is required (WordPress.com OAuth token)');
      // Only `description` is sent; the API leaves every other field as is.
      const response = await fetch('https://api.gravatar.com/v3/me/profile', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: bio }),
      });
      if (!response.ok) throw new Error(`Gravatar update failed: ${response.status} ${await response.text()}`);
    },
  },
};

async function run(entry: SocialBio, apply: boolean): Promise<boolean> {
  const key = entry.network.toLowerCase();
  const updater = updaters[key];
  if (!updater) throw new Error(`${entry.network} is marked automated but has no updater`);

  const length = bioLength(entry);
  if (entry.limit !== undefined && length > entry.limit) {
    console.error(`✗ ${entry.network}: ${length} ${entry.unit}, over the ${entry.limit} limit`);
    return false;
  }

  const current = await updater.current();
  if (current === entry.bio) {
    console.log(`= ${entry.network}: already up to date`);
    return true;
  }

  console.log(`~ ${entry.network}\n  current: ${current || '(empty)'}\n  new:     ${entry.bio}`);
  if (apply) {
    await updater.write(entry.bio);
    console.log(`✓ ${entry.network}: updated`);
  }
  return true;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const only = args.filter((arg) => !arg.startsWith('--')).map((arg) => arg.toLowerCase());

  const targets = socialBios.filter((entry) => entry.automated && (only.length === 0 || only.includes(entry.network.toLowerCase())));
  if (targets.length === 0) {
    console.error(`No automated network matches ${only.join(', ')}`);
    process.exit(1);
  }

  let ok = true;
  for (const entry of targets) {
    try {
      ok = (await run(entry, apply)) && ok;
    } catch (error) {
      console.error(`✗ ${entry.network}: ${error instanceof Error ? error.message : String(error)}`);
      ok = false;
    }
  }

  const manual = socialBios.filter((entry) => !entry.automated).map((entry) => entry.network);
  if (manual.length > 0) {
    console.log(`\nCopy-paste only: ${manual.join(', ')}. See ${siteConfig.url}/resume/social/`);
  }
  if (!apply) console.log('\nDry run. Pass --apply to write.');
  if (!ok) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
