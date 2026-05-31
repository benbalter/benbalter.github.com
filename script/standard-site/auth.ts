/**
 * Shared AT Protocol authentication for standard.site scripts.
 *
 * Logs in with an app password (never a main password) and returns an
 * authenticated agent plus the resolved DID.
 *
 * Environment variables:
 *   ATPROTO_APP_PASSWORD  – Bluesky app password (required)
 *   ATPROTO_HANDLE        – account handle (default: ben.balter.com)
 *   ATPROTO_SERVICE       – PDS / entryway URL (default: https://bsky.social)
 */

import { AtpAgent } from '@atproto/api';

export interface Session {
  agent: AtpAgent;
  did: string;
}

export async function login(): Promise<Session> {
  const password = process.env.ATPROTO_APP_PASSWORD;
  if (!password) {
    throw new Error('ATPROTO_APP_PASSWORD environment variable is required');
  }
  const identifier = process.env.ATPROTO_HANDLE || 'ben.balter.com';
  const service = process.env.ATPROTO_SERVICE || 'https://bsky.social';

  const agent = new AtpAgent({ service });
  await agent.login({ identifier, password });

  const did = agent.session?.did;
  if (!did) {
    throw new Error('Login succeeded but no DID was returned');
  }
  return { agent, did };
}
