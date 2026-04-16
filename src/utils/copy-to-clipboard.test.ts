import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { copyToClipboard } from './copy-to-clipboard';

describe('copyToClipboard', () => {
  const originalClipboard = navigator.clipboard;
  let originalExecCommand: typeof document.execCommand | undefined;

  beforeEach(() => {
    // happy-dom doesn't implement execCommand; define it for mocking
    originalExecCommand = document.execCommand;
    document.execCommand = vi.fn().mockReturnValue(true);
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
      writable: true,
    });
    if (originalExecCommand !== undefined) {
      document.execCommand = originalExecCommand;
    } else {
      // @ts-expect-error — remove mock if it didn't exist before
      delete document.execCommand;
    }
    vi.restoreAllMocks();
  });

  it('uses navigator.clipboard when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    const result = await copyToClipboard('hello');
    expect(result).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to execCommand when navigator.clipboard rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    const result = await copyToClipboard('hello');
    expect(result).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('returns false when execCommand also fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    vi.mocked(document.execCommand).mockReturnValue(false);

    const result = await copyToClipboard('hello');
    expect(result).toBe(false);
  });

  it('uses execCommand when navigator.clipboard is missing entirely', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
      writable: true,
    });

    const result = await copyToClipboard('hello');
    expect(result).toBe(true);
    expect(document.execCommand).toHaveBeenCalled();
  });

  it('removes the temporary textarea after fallback', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    const before = document.querySelectorAll('textarea').length;

    await copyToClipboard('hello');
    const after = document.querySelectorAll('textarea').length;
    expect(after).toBe(before);
  });
});
