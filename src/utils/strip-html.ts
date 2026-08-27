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
