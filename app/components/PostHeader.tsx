import PageTitle from './PageTitle';

interface PostHeaderProps {
  title: string;
}

export default function PostHeader({ title }: PostHeaderProps) {
  return <PageTitle title={title} />;
}
