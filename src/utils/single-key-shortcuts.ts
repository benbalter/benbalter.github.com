/**
 * The off switch for single-key shortcuts (`/`, `?`, `g h`, `g p`, `y`).
 *
 * WCAG 2.1.4 (Character Key Shortcuts, Level A) requires a way to turn off
 * shortcuts that fire on a bare printable key: speech-input users can trigger
 * them by accident just by talking. ⌘K / Ctrl+K and the keys inside the open
 * search dialog aren't affected, since they need a modifier or focus.
 *
 * The choice is a per-browser convenience, so it lives in localStorage and
 * every read and write tolerates storage being unavailable (shortcuts stay on).
 */

const STORAGE_KEY = 'single-key-shortcuts';

export function singleKeyShortcutsEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSingleKeyShortcutsEnabled(enabled: boolean): void {
  try {
    if (enabled) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, 'off');
    }
  } catch {
    // Storage blocked (private mode, site data cleared): nothing to persist.
  }
}
