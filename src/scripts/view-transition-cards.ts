/**
 * Card → article "magic move" for cross-document View Transitions.
 *
 * Baseline MPA view transitions are enabled globally in CSS (`@view-transition`
 * in global.css). This progressive enhancement adds the shared-element morph:
 * during a navigation from a post card to its article, the card's title flies up
 * and becomes the article `<h1>`.
 *
 * The article headline carries a static `view-transition-name` (unique per
 * article page). Cards are named *only* during the outgoing navigation, and only
 * the single card matching the destination URL — so a page that lists the same
 * post twice (e.g. Popular Posts + its year section) never has duplicate names,
 * which would otherwise abort the whole transition.
 *
 * With JS disabled, nothing here runs and the baseline crossfade remains.
 */

import { viewTransitionName } from '../utils/view-transition-name';

/** Minimal shape of the PageSwapEvent (not yet in the DOM lib types). */
interface PageSwapEventLike extends Event {
  viewTransition: unknown | null;
  activation: { entry?: { url?: string } | null } | null;
}

window.addEventListener('pageswap', (event) => {
  const e = event as PageSwapEventLike;
  // Only participate when the browser is actually running a view transition.
  if (!e.viewTransition) return;

  const destUrl = e.activation?.entry?.url;
  if (!destUrl) return;
  const destPath = new URL(destUrl, location.href).pathname;

  // Name only the card whose link points at the destination, so exactly one
  // element bears the name in the outgoing snapshot.
  for (const title of document.querySelectorAll<HTMLElement>('[data-vt-card-title]')) {
    const link = title.querySelector<HTMLAnchorElement>('a[href]');
    if (link && new URL(link.href, location.href).pathname === destPath) {
      title.style.viewTransitionName = viewTransitionName(destPath);
      break;
    }
  }
});
