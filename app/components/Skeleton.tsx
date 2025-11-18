interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

/**
 * Skeleton component for loading states
 * Server component for static site generation
 * Uses Bootstrap's placeholder utilities for consistent styling
 */
export default function Skeleton({ 
  width = '100%', 
  height = '1rem',
  className = '' 
}: SkeletonProps) {
  return (
    <div 
      className={`placeholder-glow ${className}`}
      style={{ 
        backgroundColor: '#e9ecef', 
        height, 
        width,
        borderRadius: '0.25rem' 
      }}
    />
  );
}
