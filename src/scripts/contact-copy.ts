import { copyToClipboard } from '../utils/copy-to-clipboard';
import { onPageLoad } from './on-page-load';

const RESET_MS = 2000;

/**
 * The "Copy address" button on /contact/. It ships hidden and is revealed
 * here, so readers without JavaScript never see a button that can't work;
 * the address itself is always visible text.
 */
function initContactCopy() {
  const button = document.querySelector<HTMLButtonElement>('.contact-copy');
  const status = document.querySelector<HTMLElement>('[data-contact-copy-status]');
  if (!button) return;

  const label = button.querySelector<HTMLElement>('.contact-copy-label');
  const copyIcon = button.querySelector('.contact-copy-icon');
  const doneIcon = button.querySelector('.contact-copy-done');
  const originalLabel = label?.textContent ?? '';
  let timer: ReturnType<typeof setTimeout> | undefined;

  button.classList.remove('hidden');
  button.classList.add('inline-flex');

  button.addEventListener('click', async () => {
    // No awaits before this call: the copy must run inside the click gesture.
    const ok = await copyToClipboard(button.dataset.copy ?? '', button);
    const message = ok ? 'Copied' : 'Copy failed. Select the address above instead.';

    if (label) label.textContent = ok ? 'Copied' : 'Couldn\'t copy';
    copyIcon?.classList.toggle('hidden', ok);
    copyIcon?.classList.toggle('inline-flex', !ok);
    doneIcon?.classList.toggle('hidden', !ok);
    doneIcon?.classList.toggle('inline-flex', ok);
    if (status) status.textContent = message;

    clearTimeout(timer);
    timer = setTimeout(() => {
      if (label) label.textContent = originalLabel;
      copyIcon?.classList.replace('hidden', 'inline-flex');
      doneIcon?.classList.replace('inline-flex', 'hidden');
      if (status) status.textContent = '';
    }, RESET_MS);
  });
}

onPageLoad(initContactCopy);
