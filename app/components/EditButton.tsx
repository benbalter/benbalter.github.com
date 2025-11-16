import Link from 'next/link';

interface EditButtonProps {
  editUrl: string;
  postSlug: string;
}

export default function EditButton({ editUrl, postSlug }: EditButtonProps) {
  return (
    <div className="col-lg-2 text-center pb-3">
      <p>
        <small>This page is open source. Please help improve it.</small>
      </p>
      <Link 
        className="btn btn-outline-primary btn-lg btn-sm"
        href={editUrl}
        title={`Help improve article ${postSlug}.md`}
      >
        Edit
      </Link>
    </div>
  );
}
