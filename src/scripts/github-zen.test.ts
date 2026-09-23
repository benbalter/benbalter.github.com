import { describe, it, expect, vi } from 'vitest';
import { fillZen, dedent, OCTOCAT_URL } from './github-zen';

const respond = (body: string, init: ResponseInit = { status: 200 }) =>
  vi.fn().mockResolvedValue(new Response(body, init)) as unknown as typeof fetch;

const hiddenPre = () => {
  const el = document.createElement('pre');
  el.hidden = true;
  return el;
};

describe('dedent', () => {
  it('removes the indentation shared by every non-blank line', () => {
    expect(dedent('\n      MMM.\n    MMMMM  | Zen |\n\n      ~~\n')).toBe('  MMM.\nMMMMM  | Zen |\n\n  ~~');
  });

  it('leaves unindented text alone', () => {
    expect(dedent('a\n b')).toBe('a\n b');
  });
});

describe('fillZen', () => {
  it('fetches the Octocat endpoint, fills the element, and reveals it', async () => {
    const el = hiddenPre();
    const fetchImpl = respond('\n  MMM.  | Design for failure. |\n');
    await fillZen(el, fetchImpl);
    expect(fetchImpl).toHaveBeenCalledWith(OCTOCAT_URL);
    expect(el.textContent).toBe('MMM.  | Design for failure. |');
    expect(el.hidden).toBe(false);
  });

  it('stays hidden and logs when the API errors', async () => {
    const el = hiddenPre();
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await fillZen(el, respond('rate limited', { status: 403, statusText: 'Forbidden' }));
    expect(el.hidden).toBe(true);
    expect(el.textContent).toBe('');
    expect(log).toHaveBeenCalledWith(expect.stringContaining('403'));
    log.mockRestore();
  });

  it('stays hidden on a network failure', async () => {
    const el = hiddenPre();
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await fillZen(el, vi.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch);
    expect(el.hidden).toBe(true);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch'));
    log.mockRestore();
  });
});
