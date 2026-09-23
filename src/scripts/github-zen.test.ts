import { describe, it, expect, vi } from 'vitest';
import { fillZen } from './github-zen';

const respond = (body: string, init: ResponseInit = { status: 200 }) =>
  vi.fn().mockResolvedValue(new Response(body, init)) as unknown as typeof fetch;

describe('fillZen', () => {
  it('fills the element with the Zen line, trimming a leading newline', async () => {
    const el = document.createElement('pre');
    await fillZen(el, respond('\nDesign for failure.'));
    expect(el.innerText).toBe('Design for failure.');
  });

  it('leaves the element empty and logs when the API errors', async () => {
    const el = document.createElement('pre');
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await fillZen(el, respond('rate limited', { status: 403, statusText: 'Forbidden' }));
    expect(el.innerText ?? '').toBe('');
    expect(log).toHaveBeenCalledWith(expect.stringContaining('403'));
    log.mockRestore();
  });

  it('survives a network failure', async () => {
    const el = document.createElement('pre');
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    await fillZen(el, vi.fn().mockRejectedValue(new TypeError('Failed to fetch')) as unknown as typeof fetch);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Failed to fetch'));
    log.mockRestore();
  });
});
