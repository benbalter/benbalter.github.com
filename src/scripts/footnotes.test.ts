import { describe, it, expect, beforeEach } from 'vitest';
import { initFootnotes, revealTarget } from './footnotes';

const PAGE = `
  <div class="post-content">
    <h2 id="a-section">A section</h2>
    <p>Text<sup><a href="#user-content-fn-1" id="user-content-fnref-1" data-footnote-ref>1</a></sup>
      and <a id="section-link" href="#a-section">a section link</a>.</p>
    <section data-footnotes class="footnotes" aria-label="Footnotes">
      <h2 id="footnote-label" class="sr-only">Footnotes</h2>
      <details class="footnotes-toggle">
        <summary>Footnotes · 1</summary>
        <ol><li id="user-content-fn-1"><p>The note. <a href="#user-content-fnref-1" data-footnote-backref>↩</a></p></li></ol>
      </details>
    </section>
  </div>
  <a id="card-jump" href="#user-content-fn-1">Go to footnote</a>
`;

const toggle = () => document.querySelector<HTMLDetailsElement>('details.footnotes-toggle')!;

describe('footnotes toggle', () => {
  beforeEach(() => {
    // Clicking a fragment link sets location.hash, which would carry into the
    // next test and open the list on init
    history.replaceState(null, '', location.pathname);
    document.body.innerHTML = PAGE;
    initFootnotes();
  });

  it('opens on init when the URL already points at a footnote', () => {
    history.replaceState(null, '', '#user-content-fn-1');
    document.body.innerHTML = PAGE;
    initFootnotes();
    expect(toggle().open).toBe(true);
  });

  it('starts closed', () => {
    expect(toggle().open).toBe(false);
  });

  it('opens for a hash inside the list and returns the target', () => {
    const target = revealTarget('#user-content-fn-1');
    expect(target?.id).toBe('user-content-fn-1');
    expect(toggle().open).toBe(true);
  });

  it('returns null when the list is already open', () => {
    toggle().open = true;
    expect(revealTarget('#user-content-fn-1')).toBeNull();
  });

  it('ignores hashes outside the list, empty hashes, and unknown ids', () => {
    expect(revealTarget('#a-section')).toBeNull();
    expect(revealTarget('')).toBeNull();
    expect(revealTarget('#nope')).toBeNull();
    expect(revealTarget('#%E0%A4%A')).toBeNull();
    expect(toggle().open).toBe(false);
  });

  it('opens when a footnote number is clicked', () => {
    document.getElementById('user-content-fnref-1')!.click();
    expect(toggle().open).toBe(true);
  });

  it('opens for a link outside the post body, like the touch card’s', () => {
    document.getElementById('card-jump')!.click();
    expect(toggle().open).toBe(true);
  });

  it('stays closed when another handler cancels the click (the touch card)', () => {
    const ref = document.getElementById('user-content-fnref-1')!;
    ref.addEventListener('click', (e) => e.preventDefault());
    ref.click();
    expect(toggle().open).toBe(false);
  });

  it('stays closed for other same-page links', () => {
    document.getElementById('section-link')!.click();
    expect(toggle().open).toBe(false);
  });

  it('opens before printing', () => {
    window.dispatchEvent(new Event('beforeprint'));
    expect(toggle().open).toBe(true);
  });
});
