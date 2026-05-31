import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { copyToClipboard } from './copy-to-clipboard';

// Intentional legacy fallback for browsers without Clipboard API.
// Cast `document` through a structural type without the @deprecated
// marker so tests that read/write/delete execCommand don't trip
// ts(6385) deprecation hints. Runtime behavior is unchanged.
type LegacyDocument = {
  execCommand?: (commandId: string) => boolean;
};
const legacyDocument = document as unknown as LegacyDocument;

describe('copyToClipboard', () => {
  const originalClipboard = navigator.clipboard;
  let originalExecCommand: LegacyDocument['execCommand'];

  beforeEach(() => {
    // happy-dom doesn't implement execCommand; define it for mocking
    originalExecCommand = legacyDocument.execCommand;
    legacyDocument.execCommand = vi.fn().mockReturnValue(true);
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
      writable: true,
    });
    if (originalExecCommand !== undefined) {
      legacyDocument.execCommand = originalExecCommand;
    } else {
      delete legacyDocument.execCommand;
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
    expect(legacyDocument.execCommand).toHaveBeenCalledWith('copy');
  });

  it('returns false when execCommand also fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    vi.mocked(legacyDocument.execCommand!).mockReturnValue(false);

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
    expect(legacyDocument.execCommand).toHaveBeenCalled();
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
