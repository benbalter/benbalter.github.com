import { describe, it, expect, vi, afterEach } from 'vitest';
import { siteConfig } from '../config';

// bookTitleHtml is computed when the module loads, so each case mocks the
// config with a different title and re-imports the module.
async function titleHtmlFor(bookTitle: string): Promise<string> {
  vi.resetModules();
  vi.doMock('../config', () => ({ siteConfig: { ...siteConfig, bookTitle } }));
  const { bookTitleHtml } = await import('./book-cta');
  return bookTitleHtml;
}

describe('bookTitleHtml', () => {
  afterEach(() => {
    vi.doUnmock('../config');
  });

  it('wraps the word "and" and consumes the surrounding spaces', async () => {
    expect(await titleHtmlFor('Open and Async')).toBe('Open<span class="oa-amp mx-1">and</span>Async');
  });

  it('wraps an ampersand and escapes it', async () => {
    expect(await titleHtmlFor('Open & Async')).toBe('Open<span class="oa-amp mx-1">&amp;</span>Async');
  });

  it('keeps the original casing of the conjunction', async () => {
    expect(await titleHtmlFor('Open AND Async')).toBe('Open<span class="oa-amp mx-1">AND</span>Async');
  });

  it('styles only the first conjunction', async () => {
    expect(await titleHtmlFor('Bread and Butter and Jam')).toBe(
      'Bread<span class="oa-amp mx-1">and</span>Butter and Jam',
    );
  });

  it('does not match "and" inside another word', async () => {
    expect(await titleHtmlFor('Standards Handbook')).toBe('Standards Handbook');
  });
});
