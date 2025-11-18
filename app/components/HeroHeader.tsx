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
    <div
      className="hero-unit rounded-top position-relative mb-3"
      style={{
        width: '100%',
        maxHeight: '400px',
        height: '379px', // Use default height or pass as prop
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Image
        src={imageUrl}
        alt={alt}
        priority
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'top left',
        }}
      />
    </div>
  );
}
