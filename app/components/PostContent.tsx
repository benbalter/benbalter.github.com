interface PostContentProps {
  contentHtml: string;
}

export default function PostContent({ contentHtml }: PostContentProps) {
  return (
    <div className="entrybody" dangerouslySetInnerHTML={{ __html: contentHtml }} />
  );
}
