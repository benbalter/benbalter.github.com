/**
 * Pause/play control for autoplaying, looping `<video>` GIF stand-ins in posts.
 *
 * WCAG 2.2.2 (Pause, Stop, Hide) requires a way to stop motion that lasts
 * longer than five seconds, and a looping clip never ends. Each matching
 * video gets a small toggle button overlaid on its corner. Visitors who ask
 * for reduced motion start paused and can opt in with the same button.
 *
 * Added at runtime (not in the post's Markdown) so the email, feed, and .md
 * renderings don't carry a button that does nothing. No-op on pages without
 * such a video.
 */

export const GIF_VIDEO_SELECTOR = 'video[autoplay][loop]:not([controls])';

function sync(video: HTMLVideoElement, button: HTMLButtonElement): void {
  const paused = video.paused;
  button.textContent = paused ? 'Play' : 'Pause';
  button.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
}

export function enhanceGifVideo(video: HTMLVideoElement, reduceMotion: boolean): HTMLButtonElement {
  const wrap = document.createElement('div');
  wrap.className = 'gif-video';
  video.replaceWith(wrap);
  wrap.append(video);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'gif-video-toggle';
  wrap.append(button);

  if (reduceMotion) {
    video.removeAttribute('autoplay');
    video.pause();
  }

  button.addEventListener('click', () => {
    if (video.paused) void video.play();
    else video.pause();
  });
  video.addEventListener('play', () => sync(video, button));
  video.addEventListener('pause', () => sync(video, button));
  sync(video, button);

  return button;
}

const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
document
  .querySelectorAll<HTMLVideoElement>(GIF_VIDEO_SELECTOR)
  .forEach((video) => enhanceGifVideo(video, reduceMotion));
