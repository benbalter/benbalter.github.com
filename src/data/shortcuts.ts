/**
 * Keyboard shortcuts, in the order they appear in the `?` cheatsheet.
 *
 * Single source of truth for the visible help and for the `aria-label` on the
 * navigation search button. The handlers live in `src/scripts/search-modal.ts`
 * (modal-scoped) and `src/scripts/shortcuts.ts` (site-wide).
 */

export interface Shortcut {
  /** Key groups. Each inner array is a set of alternatives, joined with "or". */
  keys: string[][];
  /** Press the groups in sequence rather than as interchangeable options. */
  chord?: true;
  label: string;
}

export interface ShortcutGroup {
  title: string;
  shortcuts: Shortcut[];
}

export const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Search',
    shortcuts: [
      { keys: [['/', '⌘ K']], label: 'Open search' },
      { keys: [['↓', 'j'], ['↑', 'k']], label: 'Move through results' },
      { keys: [['Enter']], label: 'Open the selected result' },
      { keys: [['Esc']], label: 'Close search' },
    ],
  },
  {
    title: 'Go to',
    shortcuts: [
      { keys: [['g'], ['h']], chord: true, label: 'Home' },
      { keys: [['g'], ['p']], chord: true, label: 'All posts' },
    ],
  },
  {
    title: 'This page',
    shortcuts: [
      { keys: [['y']], label: 'Copy link to this page' },
      { keys: [['?']], label: 'Show this list' },
    ],
  },
];
