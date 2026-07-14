/**
 * Resume — Positions data
 *
 * Loads the `resume-positions` collection, sorts it most-recent-first, and groups
 * roles by employer (so multiple roles at one company render under a single
 * heading). Shared by every surface that renders experience — the web resume
 * (`/resume/`) and the print-optimized PDF source (`/resume-print/`) — so the two
 * can never drift. Positions are pre-rendered to their `Content` component here.
 */

import { getCollection, render, type CollectionEntry } from 'astro:content';

export type PositionEntry = CollectionEntry<'resume-positions'> & {
  Content: Awaited<ReturnType<typeof render>>['Content'];
};

export interface GroupedPositions {
  employer: string;
  positions: PositionEntry[];
}

export interface ResumePositions {
  /** All positions, most-recent-first. */
  sorted: CollectionEntry<'resume-positions'>[];
  /** Positions grouped by employer, most-recent-first, each with a rendered `Content`. */
  grouped: GroupedPositions[];
}

const byStartDateDesc = (
  a: { data: { start_date: string } },
  b: { data: { start_date: string } },
) => new Date(b.data.start_date).getTime() - new Date(a.data.start_date).getTime();

/**
 * Load, sort, group, and render the resume positions once. Employer groups are
 * ordered by their most-recent role; roles within a group are also most-recent
 * first.
 */
export async function getResumePositions(): Promise<ResumePositions> {
  const sorted = (await getCollection('resume-positions')).sort(byStartDateDesc);

  const employerGroups = new Map<string, PositionEntry[]>();
  for (const position of sorted) {
    const { Content } = await render(position);
    if (!employerGroups.has(position.data.employer)) {
      employerGroups.set(position.data.employer, []);
    }
    employerGroups.get(position.data.employer)!.push({ ...position, Content });
  }

  const grouped: GroupedPositions[] = Array.from(employerGroups.entries()).map(
    ([employer, positions]) => ({
      employer,
      positions: positions.sort(byStartDateDesc),
    }),
  );

  return { sorted, grouped };
}
