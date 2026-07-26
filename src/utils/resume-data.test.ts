/**
 * Tests for getResumePositions — loads, sorts, groups, and renders positions.
 *
 * astro:content is mocked so we control the collection and the rendered Content
 * component. Assertions cover most-recent-first sorting, employer grouping,
 * group ordering by most-recent role, and Content attachment.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
  render: vi.fn(),
}));

import { getCollection, render } from 'astro:content';
import { getResumePositions } from './resume-data';

const mockGetCollection = vi.mocked(getCollection);
const mockRender = vi.mocked(render);

function makePosition(id: string, employer: string, start_date: string) {
  return {
    id,
    collection: 'resume-positions' as const,
    data: { employer, title: `${employer} role`, start_date },
    body: '',
  } as any;
}

describe('getResumePositions', () => {
  beforeEach(() => {
    mockGetCollection.mockReset();
    mockRender.mockReset();
    // Tag each rendered Content with its source id so we can assert attachment.
    mockRender.mockImplementation(async (entry: { id: string }) => ({
      Content: `Content:${entry.id}` as any,
    }));
  });

  it('sorts all positions most-recent-first', async () => {
    mockGetCollection.mockResolvedValue([
      makePosition('a', 'Acme', '2018-01-01'),
      makePosition('c', 'Corp', '2023-01-01'),
      makePosition('b', 'Beta', '2020-01-01'),
    ] as any);

    const { sorted } = await getResumePositions();

    expect(sorted.map((p) => p.id)).toEqual(['c', 'b', 'a']);
  });

  it('groups roles by employer with groups ordered by most-recent role', async () => {
    mockGetCollection.mockResolvedValue([
      makePosition('gh-old', 'GitHub', '2020-01-01'),
      makePosition('acme', 'Acme', '2018-01-01'),
      makePosition('gh-new', 'GitHub', '2023-01-01'),
    ] as any);

    const { grouped } = await getResumePositions();

    // GitHub's most-recent role (2023) beats Acme's (2018), so GitHub leads.
    expect(grouped.map((g) => g.employer)).toEqual(['GitHub', 'Acme']);
    // Roles within an employer are also most-recent-first.
    expect(grouped[0].positions.map((p) => p.id)).toEqual(['gh-new', 'gh-old']);
  });

  it('attaches a rendered Content component to each grouped position', async () => {
    mockGetCollection.mockResolvedValue([
      makePosition('gh', 'GitHub', '2023-01-01'),
    ] as any);

    const { grouped } = await getResumePositions();

    expect(grouped[0].positions[0].Content).toBe('Content:gh');
  });

  it('returns empty sorted and grouped for an empty collection', async () => {
    mockGetCollection.mockResolvedValue([] as any);

    const { sorted, grouped } = await getResumePositions();

    expect(sorted).toEqual([]);
    expect(grouped).toEqual([]);
  });
});
