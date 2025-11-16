import readingTime from 'reading-time';

interface ReadingTimeProps {
  content: string;
}

export default function ReadingTime({ content }: ReadingTimeProps) {
  const stats = readingTime(content);
  
  return (
    <div className="mb-2 text-muted small">
      <i className="far fa-clock"></i> {stats.text}
    </div>
  );
}
