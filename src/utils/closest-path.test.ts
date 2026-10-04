import { describe, it, expect } from 'vitest';
import { closestPath } from './closest-path';

const paths = [
  '/',
  '/about/',
  '/2011/09/01/why-wordpress/',
  '/2014/11/06/rules-of-communicating-at-github/',
  '/2015/11/23/why-open-source/',
  '/2022/03/17/why-async/',
];

describe('closestPath', () => {
  it('matches a truncated slug even when the date is wrong', () => {
    expect(closestPath('/2021/02/01/rules-of-communicat/', paths)).toBe(
      '/2014/11/06/rules-of-communicating-at-github/',
    );
  });

  it('matches a typo in the slug', () => {
    expect(closestPath('/2015/11/23/why-opn-source/', paths)).toBe('/2015/11/23/why-open-source/');
  });

  it('ignores case', () => {
    expect(closestPath('/ABOUT/', paths)).toBe('/about/');
  });

  it('breaks slug ties on the full path', () => {
    expect(closestPath('/2022/03/17/why/', ['/2011/09/01/why-x/', '/2022/03/17/why-y/'])).toBe(
      '/2022/03/17/why-y/',
    );
  });

  it('returns null with no candidates', () => {
    expect(closestPath('/anything/', [])).toBeNull();
  });
});
