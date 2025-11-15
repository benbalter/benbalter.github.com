interface ReadingTimeProps {
  content: string;
}

export default function ReadingTime({ content }: ReadingTimeProps) {
  // Calculate reading time (average 200 words per minute)
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  
  return (
    <div className="mb-2 text-muted small">
      <i className="far fa-clock"></i> {minutes} minute read
    </div>
  );
}
