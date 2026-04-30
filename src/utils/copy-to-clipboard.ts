/**
 * Copy text to the clipboard with a graceful fallback for browsers
 * that don't expose navigator.clipboard (or block it in insecure contexts).
 *
 * Returns true on success, false on failure. Callers should surface
 * user feedback either way.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Preferred path: async Clipboard API (requires secure context)
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy path
    }
  }

  // Legacy fallback: temporary textarea + document.execCommand.
  // execCommand is deprecated but still broadly supported and the
  // only option in insecure contexts / older Safari. Guard for SSR.
  if (typeof document === 'undefined') return false;

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);

  try {
    textarea.select();
    // Intentional legacy fallback for browsers without Clipboard API.
    // Cast through a structural type to silence ts(6387) without removing
    // the deprecated runtime call, which we still need.
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const legacyDocument = document as unknown as {
      execCommand(commandId: string): boolean;
    };
    const ok = legacyDocument.execCommand('copy');
    return ok;
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}
