/**
 * Fill any `[data-zen]` element with the Octocat reciting a random line of
 * GitHub Zen: ASCII art with a speech bubble, from the public API's
 * /octocat endpoint (used by the Zen of GitHub post). The element starts
 * `hidden` and is revealed only once it has content, so a failed or blocked
 * request leaves no empty box behind.
 *
 * This lives in a bundled script, not an inline <script> in the post, because
 * the CSP (security.csp in astro.config.mjs) only allows scripts Astro hashes,
 * and inline scripts in MDX content aren't hashed. No-op on pages without a
 * `[data-zen]` element, so it costs nothing on other posts.
 */

export const OCTOCAT_URL = 'https://api.github.com/octocat';

/**
 * Strip the leading newline and the indentation every line shares. The API
 * pads the art with ~8 columns of spaces, which pushes the speech bubble out
 * of a half-width column.
 */
export function dedent(text: string): string {
  const lines = text.replace(/^\n/, '').replace(/\s+$/, '').split('\n');
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length);
  const common = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(common)).join('\n');
}

export async function fillZen(el: HTMLElement, fetchImpl: typeof fetch = fetch): Promise<void> {
  try {
    const response = await fetchImpl(OCTOCAT_URL);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    el.textContent = dedent(await response.text());
    el.hidden = false;
  } catch (error) {
    console.log(`Zen failed with ${error}`);
  }
}

document.querySelectorAll<HTMLElement>('[data-zen]').forEach((el) => void fillZen(el));
