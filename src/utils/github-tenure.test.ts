import { describe, it, expect } from 'vitest';
import { getGitHubTenure, writtenAtGitHubExplainer } from './github-tenure';

describe('getGitHubTenure', () => {
  const positions = [
    { employer: 'GitHub', start_date: '2016-02-01', end_date: '2021-03-01' },
    { employer: 'GitHub', start_date: '2013-03-01', end_date: '2016-02-01' },
    { employer: 'GitHub', start_date: '2024-07-08', end_date: '2026-07-03' },
    { employer: 'Federal Communications Commission', start_date: '2010-05-01', end_date: '2012-01-01' },
  ];

  it('spans the earliest GitHub start to the latest GitHub end', () => {
    const tenure = getGitHubTenure(positions);
    expect(tenure.start.toISOString().slice(0, 10)).toBe('2013-03-01');
    expect(tenure.end.toISOString().slice(0, 10)).toBe('2026-07-03');
    expect(tenure.startYear).toBe(2013);
    expect(tenure.endYear).toBe(2026);
  });

  it('accepts Date values as parsed by the content collection', () => {
    const tenure = getGitHubTenure([
      { employer: 'GitHub', start_date: new Date('2013-03-01T00:00:00Z'), end_date: new Date('2026-07-03T00:00:00Z') },
    ]);
    expect(tenure.endYear).toBe(2026);
  });

  it('throws when there are no GitHub positions', () => {
    expect(() => getGitHubTenure([positions[3]])).toThrow(/No GitHub positions/);
  });

  it('throws when a GitHub position is still open', () => {
    expect(() => getGitHubTenure([{ employer: 'GitHub', start_date: '2024-07-08', end_date: null }])).toThrow(/still open/);
  });
});

describe('writtenAtGitHubExplainer', () => {
  it('names the years and that GitHub may have changed', () => {
    const text = writtenAtGitHubExplainer(getGitHubTenure([
      { employer: 'GitHub', start_date: '2013-03-01', end_date: '2026-07-03' },
    ]));
    expect(text).toContain('2013 to 2026');
    expect(text).toContain('may have changed');
    expect(text).not.toContain('—');
  });
});
