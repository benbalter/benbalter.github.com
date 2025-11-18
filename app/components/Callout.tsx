interface CalloutProps {
  children: React.ReactNode;
}

/**
 * Callout component (Server Component)
 * Displays alert-style callouts for important information
 * Replaces Jekyll's {% include callout.html %} pattern
 */
export default function Callout({ children }: CalloutProps) {
  return (
    <div className="alert alert-primary text-center" role="alert">
      {children}
    </div>
  );
}
