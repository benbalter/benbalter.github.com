import MarkdownContent from './MarkdownContent';

interface PostContentProps {
  content: string;
  context?: Record<string, any>;
}

export default function PostContent({ content, context }: PostContentProps) {
  return (
    <MarkdownContent markdown={content} className="entrybody" context={context} />
  );
}
