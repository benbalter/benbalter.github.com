import { describe, it, expect, beforeEach } from 'vitest';
import {
  handleResultNavigation,
  moveSelection,
  noResultsMessage,
  renderResults,
  resultCountLabel,
} from './search-modal';

function mountModal() {
  document.body.innerHTML = `
    <dialog id="search-modal">
      <input id="search-input" type="search" />
      <div id="search-results"></div>
      <div id="search-status" role="status"></div>
    </dialog>
  `;
  return {
    input: document.getElementById('search-input') as HTMLInputElement,
    results: document.getElementById('search-results') as HTMLElement,
  };
}

const sample = [
  { url: '/one/', meta: { title: 'One' }, excerpt: 'first <mark>match</mark>' },
  { url: '/two/', meta: { title: 'Two' }, excerpt: 'second' },
  { url: '/three/', meta: { title: 'Three' }, excerpt: 'third' },
];

function key(target: HTMLElement, k: string) {
  const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true });
  target.dispatchEvent(e);
  return e;
}

describe('noResultsMessage', () => {
  it('escapes the query it echoes back', () => {
    const html = noResultsMessage('<script>x</script>');
    expect(html).toContain('&lt;script&gt;x&lt;/script&gt;');
    expect(html).not.toContain('<script>');
  });
});

describe('resultCountLabel', () => {
  it('announces a count, not the list', () => {
    expect(resultCountLabel(0)).toBe('No results');
    expect(resultCountLabel(1)).toBe('1 result');
    expect(resultCountLabel(5)).toBe('5 results');
  });
});

describe('renderResults', () => {
  it('renders one link per result with title and excerpt', () => {
    const { results } = mountModal();
    renderResults(results, sample);

    const links = results.querySelectorAll<HTMLAnchorElement>('a.search-result');
    expect(links).toHaveLength(3);
    expect(links[0].getAttribute('href')).toBe('/one/');
    expect(links[0].querySelector('.search-result-title')?.textContent).toBe('One');
    expect(links[0].querySelector('.search-result-excerpt mark')?.textContent).toBe('match');
  });

  it('treats titles as text, not HTML', () => {
    const { results } = mountModal();
    renderResults(results, [{ url: '/x/', meta: { title: '<b>bold</b>' }, excerpt: '' }]);

    const title = results.querySelector('.search-result-title');
    expect(title?.textContent).toBe('<b>bold</b>');
    expect(title?.querySelector('b')).toBeNull();
  });

  it('falls back to Untitled and replaces previous results', () => {
    const { results } = mountModal();
    renderResults(results, sample);
    renderResults(results, [{ url: '/y/', excerpt: '' }]);

    expect(results.querySelectorAll('.search-result')).toHaveLength(1);
    expect(results.querySelector('.search-result-title')?.textContent).toBe('Untitled');
  });
});

describe('result navigation', () => {
  let input: HTMLInputElement;
  let links: HTMLAnchorElement[];

  beforeEach(() => {
    const mounted = mountModal();
    input = mounted.input;
    renderResults(mounted.results, sample);
    links = [...mounted.results.querySelectorAll<HTMLAnchorElement>('.search-result')];
    input.focus();
  });

  it('ArrowDown from the input enters the list at the top', () => {
    moveSelection(1);
    expect(document.activeElement).toBe(links[0]);
  });

  it('ArrowUp from the input jumps to the last result', () => {
    moveSelection(-1);
    expect(document.activeElement).toBe(links[2]);
  });

  it('walks down, clamps at the end, and returns to the input above the top', () => {
    moveSelection(1);
    moveSelection(1);
    expect(document.activeElement).toBe(links[1]);
    moveSelection(1);
    moveSelection(1);
    expect(document.activeElement).toBe(links[2]);

    links[0].focus();
    moveSelection(-1);
    expect(document.activeElement).toBe(input);
  });

  it('handles arrow keys from the input and prevents scrolling', () => {
    const e = key(input, 'ArrowDown');
    handleResultNavigation(e);
    expect(e.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(links[0]);
  });

  it('keeps j and k literal while typing in the input', () => {
    const e = key(input, 'j');
    handleResultNavigation(e);
    expect(e.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(input);
  });

  it('uses j and k once focus is in the list', () => {
    links[0].focus();
    handleResultNavigation(key(links[0], 'j'));
    expect(document.activeElement).toBe(links[1]);
    handleResultNavigation(key(links[1], 'k'));
    expect(document.activeElement).toBe(links[0]);
  });

  it('ignores modified keys', () => {
    const e = new KeyboardEvent('keydown', { key: 'ArrowDown', ctrlKey: true, cancelable: true });
    Object.defineProperty(e, 'target', { value: input });
    handleResultNavigation(e);
    expect(document.activeElement).toBe(input);
  });
});
