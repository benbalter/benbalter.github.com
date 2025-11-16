interface PostDescriptionProps {
  description: string;
}

export default function PostDescription({ description }: PostDescriptionProps) {
  return (
    <div className="alert alert-info" role="alert">
      <strong>TL;DR:</strong> {description}
    </div>
  );
}
