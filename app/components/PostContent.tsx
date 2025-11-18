import HtmlContent from './HtmlContent';

interface PostContentProps {
  contentHtml: string;
}

export default function PostContent({ contentHtml }: PostContentProps) {
  return (
    <HtmlContent html={contentHtml} className="entrybody" />
  );
}
