/**
 * Resume — Positions data
 *
 * Loads the `resume-positions` collection, sorts it most-recent-first, and groups
 * roles by employer (so multiple roles at one company render under a single
 * heading). Shared by every surface that renders experience — the web resume
 * (`/resume/`), the print-optimized PDF source, and the Markdown, docx, and
 * LinkedIn exports — so they can never drift. `getResumePositions` also
 * pre-renders each position to its `Content` component; the pure
 * `sortPositions` / `groupPositionsByEmployer` helpers skip that for endpoints
 * that only need the raw Markdown body.
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

/**
 * Role kicker under the name on every résumé surface (web, print/PDF, Markdown,
 * and docx), so the four can't drift.
 */
export const RESUME_HEADLINE = 'Product Leader: Trust & Safety, Platform Security, Developer Platforms';

type PositionLike = { data: { start_date: string; employer: string } };

const byStartDateDesc = (a: PositionLike, b: PositionLike) =>
  new Date(b.data.start_date).getTime() - new Date(a.data.start_date).getTime();

/** Sort positions most-recent-first (returns a new array). */
export function sortPositions<T extends PositionLike>(positions: T[]): T[] {
  return [...positions].sort(byStartDateDesc);
}

/**
 * Group already-sorted positions by employer. Groups are ordered by their
 * most-recent role; roles within a group keep the input (most-recent-first) order.
 */
export function groupPositionsByEmployer<T extends PositionLike>(
  sorted: T[],
): Array<{ employer: string; positions: T[] }> {
  const groups = new Map<string, T[]>();
  for (const position of sorted) {
    const group = groups.get(position.data.employer) ?? [];
    group.push(position);
    groups.set(position.data.employer, group);
  }
  return Array.from(groups, ([employer, positions]) => ({ employer, positions }));
}

/**
 * Load, sort, group, and render the resume positions once. Employer groups are
 * ordered by their most-recent role; roles within a group are also most-recent
 * first.
 */
export async function getResumePositions(): Promise<ResumePositions> {
  const sorted = sortPositions(await getCollection('resume-positions'));

  const rendered: PositionEntry[] = [];
  for (const position of sorted) {
    const { Content } = await render(position);
    rendered.push({ ...position, Content });
  }

  return { sorted, grouped: groupPositionsByEmployer(rendered) };
}
