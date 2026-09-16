/**
 * Guard for bare-key keyboard shortcuts (`/`, `?`, `g`, `y`, `j`/`k`).
 *
 * Returns true when the keystroke belongs to whatever the user is typing
 * into, so a shortcut never eats a character. Covers form fields,
 * contenteditable regions, and IME composition — during composition `e.key`
 * can report a character the user never meant to send as a command.
 *
 * Deliberately says nothing about modifier keys: callers decide whether
 * ⌘/Ctrl/Alt combinations should pass through to the browser.
 */
export function isTypingTarget(event: KeyboardEvent): boolean {
  if (event.isComposing) return true;

  const target = event.target as HTMLElement | null;
  if (!target || typeof target.closest !== 'function') return false;

  if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return true;

  return target.closest('[contenteditable]:not([contenteditable="false"])') !== null;
}
