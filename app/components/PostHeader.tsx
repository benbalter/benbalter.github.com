interface PostHeaderProps {
  title: string;
}

export default function PostHeader({ title }: PostHeaderProps) {
  return (
    <h1 className="display-4 text-primary">{title}</h1>
  );
}
