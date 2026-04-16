import { describe, it, expect } from 'vitest';
import { getShareUrls } from './share-urls';

describe('getShareUrls', () => {
  const title = 'Hello, world! & friends';
  const url = 'https://ben.balter.com/2024/01/02/my-post/';

  it('encodes the title and URL', () => {
    const shares = getShareUrls(title, url);
    expect(shares.encodedTitle).toBe(encodeURIComponent(title));
    expect(shares.encodedUrl).toBe(encodeURIComponent(url));
  });

  it('generates a Bluesky compose URL with title and URL in the text body', () => {
    const { bluesky } = getShareUrls(title, url);
    expect(bluesky).toContain('https://bsky.app/intent/compose?text=');
    expect(bluesky).toContain(encodeURIComponent(title));
    expect(bluesky).toContain(encodeURIComponent(url));
  });

  it('generates a Twitter intent URL with separate text and url params', () => {
    const { twitter } = getShareUrls(title, url);
    expect(twitter).toContain('https://twitter.com/intent/tweet?');
    expect(twitter).toContain(`text=${encodeURIComponent(title)}`);
    expect(twitter).toContain(`url=${encodeURIComponent(url)}`);
  });

  it('generates a LinkedIn share URL with only the URL', () => {
    const { linkedin } = getShareUrls(title, url);
    expect(linkedin).toBe(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    );
    // LinkedIn ignores title/summary params since 2022; URL must stand alone.
    expect(linkedin).not.toContain('title=');
  });

  it('generates a mailto link with subject and body', () => {
    const { email } = getShareUrls(title, url);
    expect(email.startsWith('mailto:?')).toBe(true);
    expect(email).toContain(`subject=${encodeURIComponent(title)}`);
    expect(email).toContain(`body=${encodeURIComponent(url)}`);
  });

  it('safely encodes reserved URL characters', () => {
    const trickyTitle = 'a&b=c?d#e';
    const trickyUrl = 'https://example.com/x?y=1&z=2#frag';
    const { twitter, email, linkedin } = getShareUrls(trickyTitle, trickyUrl);
    // None of the raw reserved chars should appear un-encoded in the query.
    for (const href of [twitter, email, linkedin]) {
      const afterScheme = href.replace(/^[a-z]+:/, '');
      expect(afterScheme.includes('&b=c?d#e')).toBe(false);
    }
  });

  it('returns the same structure for empty inputs', () => {
    const shares = getShareUrls('', '');
    expect(shares.encodedTitle).toBe('');
    expect(shares.encodedUrl).toBe('');
    expect(shares.bluesky).toContain('text=%20');
    expect(shares.twitter).toContain('text=&url=');
    expect(shares.email).toBe('mailto:?subject=&body=');
  });
});
