'use client';

import readingTime from 'reading-time';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';

interface ReadingTimeProps {
  content: string;
}

export default function ReadingTime({ content }: ReadingTimeProps) {
  const stats = readingTime(content);
  
  return (
    <div className="mb-2 text-muted small">
      <FontAwesomeIcon icon={faClock} /> {stats.text}
    </div>
  );
}
