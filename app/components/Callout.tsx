/**
 * Callout component
 * Displays a Bootstrap alert with custom content
 * Replaces {% include callout.html content=... %}
 */

interface CalloutProps {
  content: string;
}

export default function Callout({ content }: CalloutProps) {
  return (
    <div className="alert alert-primary text-center" role="alert">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
