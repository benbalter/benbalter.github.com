/**
 * Copy text to the clipboard. The one clipboard helper for the whole site.
 *
 * Order matters, and it is deliberate:
 *
 * 1. Textarea + `execCommand('copy')`, run synchronously before any `await`.
 *    Browsers only allow clipboard writes during a user gesture (transient
 *    activation), so this must happen in the same tick as the click/keydown.
 *    Unlike the async Clipboard API, it reports failure honestly: it returns
 *    false instead of resolving without writing. That matters because of
 *    #1683: on iPadOS Safari, `navigator.clipboard.writeText()` was reported to
 *    resolve but leave the clipboard blank, which a writeText-first-then-
 *    fallback helper can't detect. The issue was closed by switching the
 *    LinkedIn page to this path.
 * 2. `navigator.clipboard.writeText()`, only if the legacy path failed (e.g. a
 *    browser that removed `execCommand`). This is also called synchronously
 *    within the gesture, so no awaits may be added ahead of it.
 *
 * Returns a promise so every caller shares one API, but callers must invoke it
 * directly from the event handler, not after their own `await`.
 *
 * @param text Text to copy.
 * @param triggerElement Element to refocus afterward. Pass the clicked button:
 *   Safari doesn't focus buttons on click, so `document.activeElement` alone
 *   isn't enough to restore focus there.
 */
export function copyToClipboard(text: string, triggerElement?: Element): Promise<boolean> {
  if (legacyCopy(text, triggerElement)) return Promise.resolve(true);

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      return navigator.clipboard.writeText(text).then(
        () => true,
        () => false,
      );
    } catch {
      return Promise.resolve(false);
    }
  }

  return Promise.resolve(false);
}

/** Textarea + execCommand('copy'). Synchronous; restores focus and selection. */
function legacyCopy(text: string, triggerElement?: Element): boolean {
  if (typeof document === 'undefined' || !document.body) return false;

  const previousFocus = document.activeElement;
  const selection = document.getSelection();
  const previousRanges: Range[] = [];
  if (selection) {
    for (let i = 0; i < selection.rangeCount; i++) previousRanges.push(selection.getRangeAt(i));
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  // readonly keeps the iOS keyboard from popping up
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);

  let ok = false;
  try {
    // iOS/iPadOS Safari needs both selection calls
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    // execCommand is deprecated but still the only copy API that reports
    // failure synchronously. Cast through a structural type to silence
    // ts(6387) without removing the runtime call.
    const legacyDocument = document as unknown as {
      execCommand?: (commandId: string) => boolean;
    };
    ok = typeof legacyDocument.execCommand === 'function' && legacyDocument.execCommand('copy');
  } catch {
    ok = false;
  } finally {
    textarea.remove();
  }

  // Restore the selection before focus: in WebKit, setting a selection moves
  // focus away from a button that was just refocused.
  if (selection && previousRanges.length > 0) {
    selection.removeAllRanges();
    previousRanges.forEach((range) => selection.addRange(range));
  }
  const refocus = triggerElement ?? previousFocus;
  if (refocus instanceof HTMLElement && refocus !== document.body) refocus.focus();

  return ok;
}
