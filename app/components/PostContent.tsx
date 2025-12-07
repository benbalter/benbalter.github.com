import MarkdownContent from './MarkdownContent';

interface PostContentProps {
  content: string;
}

export default async function PostContent({ content }: PostContentProps) {
  return (
    <MarkdownContent markdown={content} className="entrybody" />
  );
}
