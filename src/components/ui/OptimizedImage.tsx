import React from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  objectFit = 'cover',
  quality = 75,
  sizes,
  onLoad,
  onError
}) => {
  // Função para gerar tamanhos responsivos automaticamente
  const generateSizes = () => {
    if (sizes) return sizes;
    
    return `(max-width: 640px) 100vw,
            (max-width: 768px) 80vw,
            (max-width: 1024px) 60vw,
            50vw`;
  };

  // Função para determinar se deve usar fill mode
  const shouldUseFill = !width || !height;

  const imageProps = {
    src,
    alt,
    priority,
    quality,
    sizes: generateSizes(),
    onLoad,
    onError,
    className: `${shouldUseFill ? '' : className}`,
    style: {
      objectFit
    }
  };

  if (shouldUseFill) {
    return (
      <div className={`relative ${className}`}>
        <Image
          {...imageProps}
          fill
        />
      </div>
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
    />
  );
};

export default OptimizedImage;