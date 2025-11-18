import MarkdownContent from './MarkdownContent';

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <MarkdownContent markdown={content} className="entrybody" />
  );
}
