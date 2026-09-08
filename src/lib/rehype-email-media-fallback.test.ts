/**
 * Tests for rehype-email-media-fallback plugin
 *
 * Verifies that web-only media (<style>, <video>, <audio>) is degraded to
 * email-safe fallbacks with absolute asset URLs, so Kit accepts the broadcast.
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { rehypeEmailMediaFallback } from './rehype-email-media-fallback';

const SITE = 'https://ben.balter.com';

// Mirror the real email pipeline: raw HTML in markdown → hast (rehypeRaw) → plugin.
function render(markdown: string, siteUrl = SITE) {
  return unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeEmailMediaFallback, { siteUrl })
    .use(rehypeStringify)
    .process(markdown)
    .then(String);
}

describe('rehypeEmailMediaFallback', () => {
  it('drops <style> blocks entirely', async () => {
    const html = await render(`<style>.x { color: red }</style>\n\nHi`);
    expect(html).not.toContain('<style');
    expect(html).not.toContain('color: red');
  });

  it('replaces <video> with its poster image linking to the mp4 source', async () => {
    const html = await render(
      `<video poster="/video/x.jpg" aria-label="A cat"><source src="/video/x.webm" type="video/webm" /><source src="/video/x.mp4" type="video/mp4" /></video>`
    );
    expect(html).not.toContain('<video');
    expect(html).not.toContain('<source');
    expect(html).toContain(`<img src="${SITE}/video/x.jpg"`);
    expect(html).toContain(`alt="A cat"`);
    expect(html).toContain(`href="${SITE}/video/x.mp4"`);
  });

  it('replaces a poster-less <video> with a "▶ label" link', async () => {
    const html = await render(
      `<video aria-label="The clip"><source src="/video/y.mp4" type="video/mp4" /></video>`
    );
    expect(html).not.toContain('<video');
    expect(html).toContain(`href="${SITE}/video/y.mp4"`);
    expect(html).toContain('▶ The clip');
  });

  it('replaces <audio> with a "🔊 label" link to the mp3', async () => {
    const html = await render(
      `<audio controls aria-label="Sample line"><source src="/audio/z.mp3" type="audio/mpeg" /></audio>`
    );
    expect(html).not.toContain('<audio');
    expect(html).not.toContain('<source');
    expect(html).toContain(`href="${SITE}/audio/z.mp3"`);
    expect(html).toContain('🔊 Sample line');
  });

  it('leaves already-absolute URLs untouched', async () => {
    const html = await render(
      `<audio aria-label="X"><source src="https://cdn.example.com/z.mp3" type="audio/mpeg" /></audio>`
    );
    expect(html).toContain('href="https://cdn.example.com/z.mp3"');
    expect(html).not.toContain(`${SITE}/https`);
  });

  it('strips a trailing slash on siteUrl when absolutizing', async () => {
    const html = await render(
      `<audio aria-label="X"><source src="/audio/z.mp3" type="audio/mpeg" /></audio>`,
      'https://ben.balter.com/'
    );
    expect(html).toContain(`href="${SITE}/audio/z.mp3"`);
    expect(html).not.toContain('.com//audio');
  });

  it('leaves ordinary content alone', async () => {
    const html = await render(`A paragraph with a [link](/foo) and *emphasis*.`);
    expect(html).toContain('<p>');
    expect(html).toContain('href="/foo"');
    expect(html).toContain('<em>emphasis</em>');
  });
});
