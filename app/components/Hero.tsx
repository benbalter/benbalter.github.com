interface HeroProps {
  imageUrl: string;
  alt?: string;
  height?: string;
}

/**
 * Hero component (Server Component)
 * Displays a hero header image
 * Works with SSG - no client-side JavaScript needed
 */
export default function Hero({ imageUrl, alt = '', height = '400px' }: HeroProps) {
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
