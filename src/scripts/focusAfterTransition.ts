/**
 * Focus Management After View Transitions
 *
 * Moves focus to the main content area (`#content`) after Astro view
 * transitions so keyboard and screen-reader users can continue navigating
 * from the new page's content instead of being stranded at the top of the
 * DOM.
 *
 * Skips the initial page load — only activates after a client-side
 * navigation handled by `<ClientRouter />`.
 */

let isInitialLoad = true;

document.addEventListener('astro:page-load', () => {
  if (isInitialLoad) {
    isInitialLoad = false;
    return;
  }

  const main = document.getElementById('content');
  if (main) {
    main.focus({ preventScroll: true });
  }
});
