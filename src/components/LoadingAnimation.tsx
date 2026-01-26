import { motion } from 'motion/react';
import { AnimatedLogo } from './AnimatedLogo';

interface LoadingAnimationProps {
  message?: string;
}

export function LoadingAnimation({ message = "Finding your perfect match..." }: LoadingAnimationProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center justify-center z-50">
      <AnimatedLogo size="large" autoPlay={true} />
      
      <motion.div
        className="mt-8 space-y-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-gray-900">{message}</h2>
        
        {/* Animated dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-purple-600 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
