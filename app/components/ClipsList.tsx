import { getClips, type Clip } from '@/lib/data';

export default function ClipsList() {
  const clips = getClips().sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <ul className="list-unstyled">
      {clips.map((clip, index) => (
        <li key={index} className="mb-3">
          <a 
            href={clip.url} 
            className="title"
          >
            {clip.title}
          </a>
          <br />
          <span className="small">
            {clip.publication} | <em>{new Date(clip.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</em>
          </span>
        </li>
      ))}
    </ul>
  );
}
