import { motion } from 'motion/react';
import { Heart, EyeOff } from 'lucide-react';

interface AnimatedLogoProps {
  size?: 'small' | 'large';
  autoPlay?: boolean;
}

export function AnimatedLogo({ size = 'large', autoPlay = true }: AnimatedLogoProps) {
  const isLarge = size === 'large';
  const containerHeight = isLarge ? 120 : 48;
  const containerWidth = isLarge ? 240 : 96;
  const heartSize = isLarge ? 64 : 24;
  const iconSize = isLarge ? 32 : 12;
  const personSize = isLarge ? 48 : 20;

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ height: `${containerHeight}px`, width: `${containerWidth}px` }}
    >
      {/* Boy silhouette - coming from left */}
      <motion.div
        className="absolute"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: isLarge ? -60 : -24, opacity: 1 }}
        transition={{
          duration: 1.2,
          delay: 0.2,
          ease: "easeOut"
        }}
        style={{ top: '0px' }}
      >
        <svg 
          width={personSize} 
          height={personSize * 1.5} 
          viewBox="0 0 24 36" 
          fill="none"
          className="text-purple-600"
        >
          {/* Head */}
          <circle cx="12" cy="6" r="4" fill="currentColor" />
          {/* Body */}
          <rect x="10" y="11" width="4" height="10" rx="1" fill="currentColor" />
          {/* Right arm extending for handshake */}
          <motion.path
            d="M14 14 L22 14"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          />
          {/* Left arm */}
          <path d="M10 14 L6 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Legs */}
          <path d="M11 21 L8 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M13 21 L16 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Girl silhouette - coming from right */}
      <motion.div
        className="absolute"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: isLarge ? 60 : 24, opacity: 1 }}
        transition={{
          duration: 1.2,
          delay: 0.2,
          ease: "easeOut"
        }}
        style={{ top: '0px' }}
      >
        <svg 
          width={personSize} 
          height={personSize * 1.5} 
          viewBox="0 0 24 36" 
          fill="none"
          className="text-pink-600"
        >
          {/* Head */}
          <circle cx="12" cy="6" r="4" fill="currentColor" />
          {/* Body */}
          <rect x="10" y="11" width="4" height="8" rx="1" fill="currentColor" />
          {/* Dress/skirt */}
          <path d="M10 19 L7 28 L17 28 L14 19 Z" fill="currentColor" />
          {/* Left arm extending for handshake */}
          <motion.path
            d="M10 14 L2 14"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          />
          {/* Right arm */}
          <path d="M14 14 L18 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          {/* Legs */}
          <path d="M10 28 L8 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 28 L16 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Handshake sparkle effect */}
      <motion.div
        className="absolute"
        style={{ top: `${isLarge ? 14 : 6}px` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.4,
          delay: 1.9,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2
        }}
      >
        <div className={`${isLarge ? 'text-2xl' : 'text-sm'}`}>🤝</div>
      </motion.div>

      {/* Heart with blind symbol - fades in */}
      <motion.div
        className="absolute"
        style={{ bottom: '0px' }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: "backOut"
        }}
      >
        <div className="relative">
          <Heart 
            className="text-purple-600 fill-purple-600" 
            style={{ width: heartSize, height: heartSize }}
          />
          {/* Blind symbol (eye with slash) inside heart */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.6,
              delay: 1.3,
              ease: "backOut"
            }}
          >
            <EyeOff 
              className="text-white drop-shadow-lg" 
              style={{ width: iconSize, height: iconSize, strokeWidth: 2.5 }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Connection lines - fade in after characters arrive */}
      <motion.svg
        className="absolute"
        width={containerWidth}
        height={containerHeight}
        style={{ top: 0, left: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.5, delay: 1.9 }}
      >
        {/* Line from boy's hand to heart */}
        <motion.line
          x1={isLarge ? 80 : 32}
          y1={isLarge ? 14 : 6}
          x2={isLarge ? 120 : 48}
          y2={isLarge ? 85 : 34}
          stroke="url(#gradient1)"
          strokeWidth="2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
        />
        {/* Line from girl's hand to heart */}
        <motion.line
          x1={isLarge ? 160 : 64}
          y1={isLarge ? 14 : 6}
          x2={isLarge ? 120 : 48}
          y2={isLarge ? 85 : 34}
          stroke="url(#gradient2)"
          strokeWidth="2"
          strokeDasharray="4 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  );
}
