/**
 * Shared reading-progress tracker.
 *
 * A single rAF-throttled scroll listener computes how far the reader has moved
 * through the article body (`.post-content`) as a ratio in [0, 1], and notifies
 * every subscriber. Both the top progress bar (ReadingProgress) and the reading
 * island subscribe to this one source, so there's exactly one scroll listener
 * and one layout read per frame — better for INP than each feature tracking
 * scroll independently.
 *
 * The ratio matches the original ReadingProgress behavior: 0 when the top of the
 * body reaches the top of the viewport, 1 when its bottom reaches the bottom.
 */
type ProgressCallback = (ratio: number) => void;

const subscribers = new Set<ProgressCallback>();
let initialized = false;
let ticking = false;
let bodyTop = 0;
let scrollRange = 0;
let lastRatio = 0;

function cacheBodyMetrics(): void {
  const body = document.querySelector<HTMLElement>('.post-content');
  if (!body) {
    // Fallback: track full-page scroll if the post body isn't present.
    bodyTop = 0;
    scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    return;
  }
  const rect = body.getBoundingClientRect();
  bodyTop = rect.top + window.scrollY;
  scrollRange = Math.max(body.offsetHeight - window.innerHeight, 1);
}

function computeRatio(): number {
  const offset = window.scrollY - bodyTop;
  return scrollRange > 0 ? Math.min(Math.max(offset / scrollRange, 0), 1) : 0;
}

function notify(): void {
  lastRatio = computeRatio();
  for (const cb of subscribers) cb(lastRatio);
  ticking = false;
}

function onScroll(): void {
  if (!ticking) {
    requestAnimationFrame(notify);
    ticking = true;
  }
}

function ensureInitialized(): void {
  if (initialized) return;
  initialized = true;
  cacheBodyMetrics();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener(
    'resize',
    () => {
      cacheBodyMetrics();
      notify();
    },
    { passive: true }
  );
  // Recompute once images/fonts have settled and shifted the layout.
  window.addEventListener('load', () => {
    cacheBodyMetrics();
    notify();
  });
}

/**
 * Subscribe to reading-progress updates. The callback fires immediately with the
 * current ratio, then on every throttled scroll/resize. Returns an unsubscribe
 * function.
 */
export function subscribeReadingProgress(callback: ProgressCallback): () => void {
  ensureInitialized();
  subscribers.add(callback);
  callback(lastRatio);
  return () => subscribers.delete(callback);
}
