/**
 * CodeQL-safe HTML stripping helpers.
 *
 * A single-pass regex `.replace()` can be defeated by nested or overlapping
 * patterns — e.g. `<!--<!---->` leaves a stray `<!--`, and `<scr<script>ipt>`
 * reassembles into `<script>`. These helpers re-apply the replacement until the
 * string stops changing so no injectable fragment can survive one pass.
 */

/** Apply `pattern` repeatedly until the string no longer changes. */
function replaceUntilStable(input: string, pattern: RegExp, replacement = ''): string {
  let current = input;
  let previous: string;
  do {
    previous = current;
    current = current.replace(pattern, replacement);
  } while (current !== previous);
  return current;
}

/** Remove HTML comments (`<!-- ... -->`), including multiline and nested ones. */
export function stripHtmlComments(input: string): string {
  return replaceUntilStable(input, /<!--[\s\S]*?-->/g);
}

/** Remove HTML tags (`<...>`), including overlapping/nested fragments. */
export function stripHtmlTags(input: string, replacement = ''): string {
  return replaceUntilStable(input, /<[^>]+>/g, replacement);
}

const NAMED_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/**
 * Decode the character references HTML serializers emit: the named XML ones
 * plus `&nbsp;`, and numeric `&#39;` / `&#x27;`. Unknown names are left as is.
 * One pass with a callback, so `&amp;lt;` becomes `&lt;` and is not decoded a
 * second time into `<`.
 */
function decodeHtmlEntities(input: string): string {
  return input.replace(/&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi, (match, dec?: string, hex?: string, name?: string) => {
    if (name) return NAMED_ENTITIES[name.toLowerCase()] ?? match;
    const codePoint = dec ? Number.parseInt(dec, 10) : Number.parseInt(hex ?? '', 16);
    return codePoint <= 0x10_FF_FF ? String.fromCodePoint(codePoint) : match;
  });
}

/**
 * Turn a fragment of HTML (e.g. a Mastodon profile note) into plain text for
 * display or comparison: strip every tag until none can reassemble, then
 * decode entities. The result is text, not markup; don't put it back into HTML
 * unescaped.
 */
export function htmlToPlainText(input: string): string {
  return decodeHtmlEntities(stripHtmlTags(input)).trim();
}
