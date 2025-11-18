interface HeroHeaderProps {
  imageUrl: string;
  height?: string;
  alt?: string;
}

/**
 * Hero header component
 * Server component for static site generation
 * Displays a large header image with background styling
 */
export default function HeroHeader({ 
  imageUrl, 
  height = '400px',
  alt = 'Header image' 
}: HeroHeaderProps) {
  return (
    <div 
      className="hero-unit rounded-top position-relative mb-3" 
      style={{ 
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top left',
        height
      }}
      role="img"
      aria-label={alt}
    >
      &nbsp;
    </div>
  );
}
