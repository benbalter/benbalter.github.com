// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getExistingBroadcastSubjects } from './kit';

describe('getExistingBroadcastSubjects', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns sent subjects and ignores drafts', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({
      broadcasts: [
        { subject: 'Sent post', status: 'completed' },
        { subject: 'Failed attempt', status: 'draft' },
      ],
    })));

    await expect(getExistingBroadcastSubjects('key')).resolves.toEqual(new Set(['Sent post']));
  });

  // An empty set here would read as "nothing sent yet" and re-send every post.
  it('throws instead of returning an empty set when Kit errors', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('slow down', { status: 429 })));

    await expect(getExistingBroadcastSubjects('key')).rejects.toThrow('HTTP 429');
  });

  it('throws when the request itself fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError('fetch failed');
    }));

    await expect(getExistingBroadcastSubjects('key')).rejects.toThrow('fetch failed');
  });
});
