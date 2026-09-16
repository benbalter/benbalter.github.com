import { describe, it, expect } from 'vitest';
import { isTypingTarget } from './is-typing-target';

/** Build a keydown event dispatched from `target`. */
function keydown(target: Element, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: '/', bubbles: true, ...init });
  Object.defineProperty(event, 'target', { value: target, configurable: true });
  return event;
}

describe('isTypingTarget', () => {
  it('is false for ordinary elements', () => {
    const div = document.createElement('div');
    expect(isTypingTarget(keydown(div))).toBe(false);
  });

  it.each(['INPUT', 'TEXTAREA', 'SELECT'])('is true for <%s>', (tag) => {
    const el = document.createElement(tag.toLowerCase());
    expect(isTypingTarget(keydown(el))).toBe(true);
  });

  it('is true inside a contenteditable region', () => {
    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', '');
    const nested = document.createElement('span');
    editable.appendChild(nested);
    document.body.appendChild(editable);

    expect(isTypingTarget(keydown(nested))).toBe(true);
    editable.remove();
  });

  it('is false for contenteditable="false"', () => {
    const el = document.createElement('div');
    el.setAttribute('contenteditable', 'false');
    document.body.appendChild(el);

    expect(isTypingTarget(keydown(el))).toBe(false);
    el.remove();
  });

  it('is true while an IME is composing, whatever the target', () => {
    const div = document.createElement('div');
    const event = keydown(div);
    Object.defineProperty(event, 'isComposing', { value: true });
    expect(isTypingTarget(event)).toBe(true);
  });

  it('ignores modifiers — callers decide those', () => {
    const div = document.createElement('div');
    expect(isTypingTarget(keydown(div, { metaKey: true }))).toBe(false);
  });
});
