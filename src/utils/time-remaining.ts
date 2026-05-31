/**
 * Format "time remaining" for a reading progress indicator.
 *
 * Given the total reading time (minutes) and a progress value in [0, 1],
 * returns a short human label like "3 min left". Returns an empty string
 * when under half a minute remains to avoid noisy updates near the end.
 */
export function formatTimeRemaining(totalMinutes: number, progress: number): string {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return '';
  if (!Number.isFinite(progress)) return '';

  const clamped = Math.min(Math.max(progress, 0), 1);
  const remaining = totalMinutes * (1 - clamped);

  if (remaining < 0.5) return '';

  const rounded = Math.max(1, Math.round(remaining));
  return `${rounded} min left`;
}
