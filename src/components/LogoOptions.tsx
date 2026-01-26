import { Heart, Eye } from 'lucide-react';

interface LogoOptionsProps {
  variant?: 'heart-eye' | 'silhouettes';
  size?: 'small' | 'medium' | 'large';
}

export function LogoOptions({ variant = 'heart-eye', size = 'medium' }: LogoOptionsProps) {
  const sizeClasses = {
    small: { container: 'w-8 h-8', heart: 'w-8 h-8', eye: 'w-4 h-4', silhouette: 'w-10 h-14' },
    medium: { container: 'w-16 h-16', heart: 'w-16 h-16', eye: 'w-8 h-8', silhouette: 'w-20 h-28' },
    large: { container: 'w-20 h-20', heart: 'w-20 h-20', eye: 'w-10 h-10', silhouette: 'w-24 h-32' }
  };

  const sizes = sizeClasses[size];

  if (variant === 'silhouettes') {
    return (
      <div className="relative flex items-center justify-center gap-4">
        {/* Male silhouette (facing left) */}
        <svg className={sizes.silhouette} viewBox="0 0 40 56" fill="none">
          <g transform="scale(-1, 1) translate(-40, 0)">
            {/* Head */}
            <circle cx="20" cy="8" r="6" fill="currentColor" className="text-purple-600" />
            {/* Body */}
            <path d="M20 16 L20 32" stroke="currentColor" strokeWidth="3" className="text-purple-600" />
            {/* Arms - left arm extended */}
            <path d="M20 20 L28 24" stroke="currentColor" strokeWidth="2.5" className="text-purple-600" />
            <path d="M20 20 L14 22" stroke="currentColor" strokeWidth="2.5" className="text-purple-600" />
            {/* Legs */}
            <path d="M20 32 L16 48" stroke="currentColor" strokeWidth="3" className="text-purple-600" />
            <path d="M20 32 L24 48" stroke="currentColor" strokeWidth="3" className="text-purple-600" />
          </g>
        </svg>

        {/* Heart with Eye in center */}
        <div className="relative">
          <Heart className={`${sizes.heart} text-purple-600 fill-purple-600`} />
          <Eye 
            className={`${sizes.eye} text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} 
            style={{ strokeWidth: 2.5 }} 
          />
        </div>

        {/* Female silhouette (facing right) */}
        <svg className={sizes.silhouette} viewBox="0 0 40 56" fill="none">
          {/* Head */}
          <circle cx="20" cy="8" r="6" fill="currentColor" className="text-pink-600" />
          {/* Body */}
          <path d="M20 16 L20 28" stroke="currentColor" strokeWidth="2.5" className="text-pink-600" />
          {/* Dress/skirt */}
          <path d="M20 28 L14 38 L20 38 L26 38 Z" fill="currentColor" className="text-pink-600" />
          {/* Arms - right arm extended */}
          <path d="M20 20 L12 24" stroke="currentColor" strokeWidth="2.5" className="text-pink-600" />
          <path d="M20 20 L26 22" stroke="currentColor" strokeWidth="2.5" className="text-pink-600" />
          {/* Legs */}
          <path d="M17 38 L15 48" stroke="currentColor" strokeWidth="2.5" className="text-pink-600" />
          <path d="M23 38 L25 48" stroke="currentColor" strokeWidth="2.5" className="text-pink-600" />
        </svg>
      </div>
    );
  }

  // Default heart-eye variant
  return (
    <div className={`relative ${sizes.container}`}>
      <Heart className={`${sizes.heart} text-purple-600 fill-purple-600`} />
      <Eye 
        className={`${sizes.eye} text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} 
        style={{ strokeWidth: 2.5 }} 
      />
    </div>
  );
}
