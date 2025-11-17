import readingTime from 'reading-time';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

interface ReadingTimeProps {
  content: string;
}

/**
 * ReadingTime component (Server Component)
 * Displays estimated reading time using the open source 'reading-time' library
 * Works with SSG - no client-side JavaScript needed
 */
export default function ReadingTime({ content }: ReadingTimeProps) {
  const stats = readingTime(content);
  
  return (
    <div className="mb-2 text-muted small">
      <FontAwesomeIcon icon={faClock} /> {stats.text}
    </div>
  );
}
