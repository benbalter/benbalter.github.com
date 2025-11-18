import Image from 'next/image';

interface HeroHeaderProps {
  imageUrl: string;
  width?: number;
  height?: number;
  alt?: string;
}

/**
 * Hero header component
 * Server component for static site generation
 * Displays a large header image with optimized loading
 * Uses Next.js Image component for better performance and semantics
 */
export default function HeroHeader({ 
  imageUrl, 
  width = 1000,
  height = 379,
  alt = 'Header image' 
}: HeroHeaderProps) {
  return (
    <div className="hero-unit rounded-top position-relative mb-3">
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        priority
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '400px',
          objectFit: 'cover',
          objectPosition: 'top left',
        }}
      />
    </div>
  );
}
