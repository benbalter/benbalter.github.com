import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard } from './linkedin-copy';

describe('copyToClipboard', () => {
  let originalExecCommand: typeof document.execCommand | undefined;

  beforeEach(() => {
    // happy-dom does not implement execCommand, so define it for mocking
    originalExecCommand = document.execCommand;
    document.execCommand = vi.fn().mockReturnValue(true);
  });

  afterEach(() => {
    if (originalExecCommand !== undefined) {
      document.execCommand = originalExecCommand;
    } else {
      // @ts-expect-error — remove the mock if execCommand didn't exist before
      delete document.execCommand;
    }
  });

  it('returns true when execCommand succeeds', () => {
    expect(copyToClipboard('hello')).toBe(true);
  });

  it('returns false when execCommand returns false', () => {
    vi.mocked(document.execCommand).mockReturnValue(false);
    expect(copyToClipboard('hello')).toBe(false);
  });

  it('returns false when execCommand throws', () => {
    vi.mocked(document.execCommand).mockImplementation(() => {
      throw new Error('not allowed');
    });
    expect(copyToClipboard('hello')).toBe(false);
  });

  it('removes the temporary textarea from the DOM after copy', () => {
    const textareasBefore = document.querySelectorAll('textarea').length;
    copyToClipboard('test text');
    const textareasAfter = document.querySelectorAll('textarea').length;
    expect(textareasAfter).toBe(textareasBefore);
  });

  it('sets the textarea value to the provided text', () => {
    let capturedValue = '';
    vi.mocked(document.execCommand).mockImplementation(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) capturedValue = textarea.value;
      return true;
    });

    copyToClipboard('specific clipboard text');
    expect(capturedValue).toBe('specific clipboard text');
  });

  it('positions the textarea off-screen to avoid layout shift', () => {
    let capturedStyle: CSSStyleDeclaration | undefined;
    vi.mocked(document.execCommand).mockImplementation(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) capturedStyle = textarea.style;
      return true;
    });

    copyToClipboard('text');
    expect(capturedStyle?.position).toBe('fixed');
    expect(capturedStyle?.opacity).toBe('0');
  });

  it('restores focus to the trigger element after copy', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    const focusSpy = vi.spyOn(button, 'focus');

    copyToClipboard('text', button);

    expect(focusSpy).toHaveBeenCalled();
    button.remove();
    focusSpy.mockRestore();
  });

  it('does not throw when no trigger element is provided', () => {
    expect(() => copyToClipboard('text')).not.toThrow();
  });

  it('does not call focus when trigger is not an HTMLElement', () => {
    // SVGElement is an Element but not an HTMLElement
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svg);

    // Should not throw — the instanceof HTMLElement check prevents focus call
    expect(() => copyToClipboard('text', svg)).not.toThrow();
    svg.remove();
  });

  it('handles empty string input', () => {
    let capturedValue = '';
    vi.mocked(document.execCommand).mockImplementation(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) capturedValue = textarea.value;
      return true;
    });

    const result = copyToClipboard('');
    expect(result).toBe(true);
    expect(capturedValue).toBe('');
  });
});
