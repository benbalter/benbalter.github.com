import { ReactNode } from 'react';

interface CalloutProps {
  children: ReactNode;
}

/**
 * Callout component (Server Component)
 * Displays an alert/callout box, matching Jekyll's callout.html include
 */
export default function Callout({ children }: CalloutProps) {
  return (
    <div className="alert alert-primary text-center" role="alert">
      {children}
    </div>
  );
}
