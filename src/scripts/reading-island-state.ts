/**
 * Pure state machine for the reading "Dynamic Island" pill.
 *
 * The island morphs between a few states as the reader moves through a post.
 * Keeping the selection logic pure (no DOM) makes the priority ordering easy to
 * reason about and unit-test; the controller (reading-island.ts) feeds it live
 * inputs and applies the resulting state to the DOM.
 *
 *  - hidden   — before the reader has entered the article body (avoid showing at
 *               the very top) and after there's nothing useful to offer.
 *  - progress — default while reading: "N min left".
 *  - share    — the reader has selected text: offer to share the selection.
 *  - cta      — near the end / the subscribe card is in view: nudge to subscribe.
 *
 * Priority: an active text selection is the most immediate intent, so share
 * wins; otherwise the end-of-post CTA; otherwise plain progress.
 */
export type ReadingIslandState = 'hidden' | 'progress' | 'share' | 'cta';

export interface ReadingIslandInputs {
  /** Scroll progress through the article body, 0–1. */
  ratio: number;
  /** Whether the reader currently has a non-empty selection in the post body. */
  hasSelection: boolean;
  /** Whether the subscribe CTA (end of post) is in the viewport. */
  ctaVisible: boolean;
  /**
   * Fraction of the body scrolled past which the island may appear at all.
   * Below this the island stays hidden so it never shows at the very top.
   */
  revealAfter?: number;
}

export function selectReadingIslandState({
  ratio,
  hasSelection,
  ctaVisible,
  revealAfter = 0.05,
}: ReadingIslandInputs): ReadingIslandState {
  // A selection is immediate intent — surface Share even at the very top.
  if (hasSelection) return 'share';

  // Don't show plain progress/CTA until the reader is actually into the body.
  if (!Number.isFinite(ratio) || ratio < revealAfter) return 'hidden';

  if (ctaVisible) return 'cta';
  return 'progress';
}
