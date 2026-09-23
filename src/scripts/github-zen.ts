/**
 * Fill any `[data-zen]` element with a random line of GitHub Zen from the
 * public API (used by the Zen of GitHub post).
 *
 * This lives in a bundled script, not an inline <script> in the post, because
 * the CSP (security.csp in astro.config.mjs) only allows scripts Astro hashes,
 * and inline scripts in MDX content aren't hashed. No-op on pages without a
 * `[data-zen]` element, so it costs nothing on other posts.
 */

const ZEN_URL = 'https://api.github.com/zen';

export async function fillZen(el: HTMLElement, fetchImpl: typeof fetch = fetch): Promise<void> {
  try {
    const response = await fetchImpl(ZEN_URL);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    el.innerText = (await response.text()).replace(/^\n/, '');
  } catch (error) {
    console.log(`Zen failed with ${error}`);
  }
}

document.querySelectorAll<HTMLElement>('[data-zen]').forEach((el) => void fillZen(el));
