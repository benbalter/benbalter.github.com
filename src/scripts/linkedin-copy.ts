import { copyToClipboard } from '../utils/copy-to-clipboard';
import { onPageLoad } from './on-page-load';

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      let textToCopy = '';

      if (btn.classList.contains('copy-description')) {
        const descriptionElement = btn.parentElement?.querySelector('[data-description]') as HTMLElement | null;
        textToCopy = descriptionElement?.innerText?.trim() || '';
      } else {
        textToCopy = btn.getAttribute('data-copy') || '';
      }

      // No awaits before this call: the copy must run inside the click gesture.
      const success = await copyToClipboard(textToCopy, btn);

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

// Re-initialize after navigation. Without ClientRouter every navigation is a
// full page load, so `DOMContentLoaded` (or immediate if ready) is sufficient.
onPageLoad(initCopyButtons);
