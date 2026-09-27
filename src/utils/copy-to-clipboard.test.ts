import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { copyToClipboard } from './copy-to-clipboard';

// execCommand is the helper's primary path (see copy-to-clipboard.ts).
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

  function mockClipboard(writeText: ReturnType<typeof vi.fn>) {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
      writable: true,
    });
  }

  /** Capture the temporary textarea's value at the moment execCommand runs. */
  function captureTextarea(): { value?: string | undefined; style?: CSSStyleDeclaration | undefined } {
    const captured: { value?: string | undefined; style?: CSSStyleDeclaration | undefined } = {};
    vi.mocked(legacyDocument.execCommand!).mockImplementation(() => {
      const textarea = document.querySelector('textarea');
      captured.value = textarea?.value;
      captured.style = textarea?.style;
      return true;
    });
    return captured;
  }

  describe('execCommand path (primary)', () => {
    it('copies synchronously, before returning, without touching the Clipboard API', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      mockClipboard(writeText);

      // Deliberately not awaited: the copy must happen in the same tick as the
      // user gesture. If someone adds an `await` ahead of it, this fails.
      const pending = copyToClipboard('hello');
      expect(legacyDocument.execCommand).toHaveBeenCalledWith('copy');

      await expect(pending).resolves.toBe(true);
      expect(writeText).not.toHaveBeenCalled();
    });

    it('puts the exact text, including empty strings, in the textarea', async () => {
      const captured = captureTextarea();
      await copyToClipboard('specific clipboard text');
      expect(captured.value).toBe('specific clipboard text');

      await expect(copyToClipboard('')).resolves.toBe(true);
      expect(captured.value).toBe('');
    });

    it('positions the textarea off-screen and invisible', async () => {
      const captured = captureTextarea();
      await copyToClipboard('text');
      expect(captured.style?.position).toBe('fixed');
      expect(captured.style?.opacity).toBe('0');
    });

    it('removes the temporary textarea afterward', async () => {
      const before = document.querySelectorAll('textarea').length;
      await copyToClipboard('hello');
      expect(document.querySelectorAll('textarea').length).toBe(before);
    });

    it('removes the textarea even when execCommand throws', async () => {
      mockClipboard(vi.fn().mockRejectedValue(new Error('denied')));
      vi.mocked(legacyDocument.execCommand!).mockImplementation(() => {
        throw new Error('not allowed');
      });
      const before = document.querySelectorAll('textarea').length;
      await expect(copyToClipboard('hello')).resolves.toBe(false);
      expect(document.querySelectorAll('textarea').length).toBe(before);
    });

    it('restores focus to the trigger element', async () => {
      const button = document.createElement('button');
      document.body.appendChild(button);
      const focusSpy = vi.spyOn(button, 'focus');

      await copyToClipboard('text', button);

      expect(focusSpy).toHaveBeenCalled();
      button.remove();
    });

    it('restores focus to the previously focused element when no trigger is given', async () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      await copyToClipboard('text');

      expect(document.activeElement).toBe(input);
      input.remove();
    });

    it('ignores a trigger that is not an HTMLElement', async () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      document.body.appendChild(svg);
      await expect(copyToClipboard('text', svg)).resolves.toBe(true);
      svg.remove();
    });
  });

  describe('Clipboard API fallback', () => {
    it('uses writeText synchronously when execCommand returns false', async () => {
      vi.mocked(legacyDocument.execCommand!).mockReturnValue(false);
      const writeText = vi.fn().mockResolvedValue(undefined);
      mockClipboard(writeText);

      const pending = copyToClipboard('hello');
      // Called in the same tick, so it still has transient user activation
      expect(writeText).toHaveBeenCalledWith('hello');
      await expect(pending).resolves.toBe(true);
    });

    it('uses writeText when execCommand is missing entirely', async () => {
      delete legacyDocument.execCommand;
      const writeText = vi.fn().mockResolvedValue(undefined);
      mockClipboard(writeText);

      await expect(copyToClipboard('hello')).resolves.toBe(true);
      expect(writeText).toHaveBeenCalledWith('hello');
    });

    it('returns false when both paths fail', async () => {
      vi.mocked(legacyDocument.execCommand!).mockReturnValue(false);
      mockClipboard(vi.fn().mockRejectedValue(new Error('denied')));

      await expect(copyToClipboard('hello')).resolves.toBe(false);
    });

    it('returns false when writeText throws synchronously', async () => {
      vi.mocked(legacyDocument.execCommand!).mockReturnValue(false);
      mockClipboard(
        vi.fn().mockImplementation(() => {
          throw new Error('boom');
        }),
      );

      await expect(copyToClipboard('hello')).resolves.toBe(false);
    });

    it('returns false when execCommand fails and there is no Clipboard API', async () => {
      vi.mocked(legacyDocument.execCommand!).mockReturnValue(false);
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true,
        writable: true,
      });

      await expect(copyToClipboard('hello')).resolves.toBe(false);
    });
  });
});
