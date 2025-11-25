interface CalloutProps {
  children: React.ReactNode;
}

/**
 * A Bootstrap-styled alert callout component.
 * Equivalent to Jekyll's _includes/callout.html
 */
export default function Callout({ children }: CalloutProps) {
  return (
    <div className="alert alert-primary text-center" role="alert">
      {children}
    </div>
  );
}
