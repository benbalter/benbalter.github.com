/**
 * Ben's GitHub tenure, derived from the résumé positions so the dates live in
 * one place. Used by the "Written while I was at GitHub" label, the GitHub
 * years page, and the content test that keeps the label honest.
 */

export interface TenurePosition {
  employer: string;
  start_date: string | Date;
  end_date?: string | Date | null;
}

export interface GitHubTenure {
  start: Date;
  end: Date;
  startYear: number;
  endYear: number;
}

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(`${value}T00:00:00Z`);
}

/**
 * Earliest start and latest end across every GitHub position.
 * @throws when there are no GitHub positions, or one has no end date (the
 *   label and page describe a finished tenure)
 */
export function getGitHubTenure(positions: TenurePosition[]): GitHubTenure {
  const github = positions.filter((position) => position.employer === 'GitHub');
  if (github.length === 0) {
    throw new Error('No GitHub positions found in resume-positions');
  }
  const open = github.find((position) => !position.end_date);
  if (open) {
    throw new Error('A GitHub position has no end_date; the tenure is still open');
  }
  const start = new Date(Math.min(...github.map((position) => toDate(position.start_date).getTime())));
  const end = new Date(Math.max(...github.map((position) => toDate(position.end_date!).getTime())));
  return { start, end, startYear: start.getUTCFullYear(), endYear: end.getUTCFullYear() };
}

/** Hover text for the "Written while I was at GitHub" label. */
export function writtenAtGitHubExplainer(tenure: GitHubTenure): string {
  return `I worked at GitHub from ${tenure.startYear} to ${tenure.endYear}. How GitHub works may have changed since I wrote this.`;
}
