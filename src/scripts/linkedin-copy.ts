/**
 * Copy text to clipboard with fallback for Safari/iPad OS.
 * Safari silently resolves navigator.clipboard.writeText() without actually
 * writing to the clipboard (the promise succeeds but content is blank), so we
 * cannot use the modern Clipboard API with a catch fallback. Instead, we use
 * textarea + execCommand('copy') which works reliably across all browsers.
 */
export function copyToClipboard(text: string, triggerElement?: Element): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);

  // iOS/iPad Safari requires both selection methods
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch {
    success = false;
  }
  document.body.removeChild(textarea);

  // Restore focus to the trigger element after textarea removal
  if (triggerElement instanceof HTMLElement) {
    triggerElement.focus();
  }

  return success;
}

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      let textToCopy = '';

      if (btn.classList.contains('copy-description')) {
        const descriptionElement = btn.parentElement?.querySelector('[data-description]') as HTMLElement | null;
        textToCopy = descriptionElement?.innerText?.trim() || '';
      } else {
        textToCopy = btn.getAttribute('data-copy') || '';
      }

      const success = copyToClipboard(textToCopy, btn);

      if (success) {
        const original = btn.textContent;
        btn.textContent = '✓';
        btn.classList.add('!bg-green-600');

        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove('!bg-green-600');
        }, 1500);
      } else {
        const original = btn.textContent;
        btn.textContent = '✗';
        setTimeout(() => {
          btn.textContent = original;
        }, 1500);
      }
    });
  });
}

// Re-initialize after Astro view transitions
document.addEventListener('astro:page-load', initCopyButtons);
