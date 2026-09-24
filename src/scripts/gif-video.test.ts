import { describe, it, expect, vi } from 'vitest';
import { enhanceGifVideo, GIF_VIDEO_SELECTOR } from './gif-video';

const gifVideo = () => {
  const figure = document.createElement('figure');
  figure.innerHTML = '<video autoplay muted loop playsinline></video><figcaption>Caption</figcaption>';
  const video = figure.querySelector('video')!;
  let paused = true;
  Object.defineProperty(video, 'paused', { get: () => paused });
  video.play = vi.fn(async () => {
    paused = false;
    video.dispatchEvent(new Event('play'));
  });
  video.pause = vi.fn(() => {
    paused = true;
    video.dispatchEvent(new Event('pause'));
  });
  return { figure, video };
};

describe('GIF_VIDEO_SELECTOR', () => {
  it('matches autoplaying loops but not videos with native controls', () => {
    const el = document.createElement('div');
    el.innerHTML = '<video autoplay loop></video><video autoplay loop controls></video><video loop></video>';
    expect(el.querySelectorAll(GIF_VIDEO_SELECTOR)).toHaveLength(1);
  });
});

describe('enhanceGifVideo', () => {
  it('wraps the video and adds a toggle before the caption', () => {
    const { figure, video } = gifVideo();
    enhanceGifVideo(video, false);
    const wrap = figure.firstElementChild!;
    expect(wrap.className).toBe('gif-video');
    expect(wrap.querySelector('video')).toBe(video);
    expect(wrap.querySelector('button')?.type).toBe('button');
    expect(figure.lastElementChild?.tagName).toBe('FIGCAPTION');
  });

  it('toggles playback and keeps the label in sync', async () => {
    const { video } = gifVideo();
    await video.play();
    const button = enhanceGifVideo(video, false);
    expect(button.textContent).toBe('Pause');
    expect(button.getAttribute('aria-label')).toBe('Pause animation');

    button.click();
    expect(video.pause).toHaveBeenCalled();
    expect(button.textContent).toBe('Play');
    expect(button.getAttribute('aria-label')).toBe('Play animation');

    button.click();
    await Promise.resolve();
    expect(button.textContent).toBe('Pause');
  });

  it('starts paused for reduced motion', () => {
    const { video } = gifVideo();
    const button = enhanceGifVideo(video, true);
    expect(video.hasAttribute('autoplay')).toBe(false);
    expect(video.pause).toHaveBeenCalled();
    expect(button.textContent).toBe('Play');
  });
});
