import { format, parseISO } from 'date-fns';

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    return dateString;
  }
}
