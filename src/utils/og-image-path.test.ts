import { describe, it, expect } from 'vitest';
import { ogImagePath, ogImageRoute } from './og-image-path';

describe('ogImageRoute', () => {
  it('maps a dated post id to the route param form', () => {
    expect(ogImageRoute('2014-11-06-rules-of-communicating-at-github')).toBe(
      '2014/11/06/rules-of-communicating-at-github.png',
    );
  });

  it('returns null for ids without a date prefix', () => {
    expect(ogImageRoute('about')).toBeNull();
    expect(ogImageRoute('2014-11-rules')).toBeNull();
  });
});

describe('ogImagePath', () => {
  it('prefixes the route with /og/', () => {
    expect(ogImagePath('2022-03-17-why-async')).toBe('/og/2022/03/17/why-async.png');
  });

  it('returns null when there is no route', () => {
    expect(ogImagePath('about')).toBeNull();
  });
});
