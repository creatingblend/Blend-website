import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedLogo } from './AnimatedLogo';

interface TransitionPopupProps {
  isOpen: boolean;
  lines: string[];
  lineDelay?: number; // Delay between lines in ms
  onComplete: () => void;
  showConfetti?: boolean;
  autoCloseDuration?: number; // Total duration before auto-closing
}

export function TransitionPopup({ 
  isOpen, 
  lines, 
  lineDelay = 1000,
  onComplete,
  showConfetti = false,
  autoCloseDuration = 4000
}: TransitionPopupProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    if (!isOpen) {
      setVisibleLines(0);
      return;
    }

    // Show first line immediately
    setVisibleLines(1);

    // Show subsequent lines with delay
    const timeouts: NodeJS.Timeout[] = [];
    for (let i = 1; i < lines.length; i++) {
      const timeout = setTimeout(() => {
        setVisibleLines(i + 1);
      }, i * lineDelay);
      timeouts.push(timeout);
    }

    // Generate confetti if needed
    if (showConfetti) {
      const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5
      }));
      setConfetti(confettiPieces);
    }

    // Auto-close after duration
    const closeTimeout = setTimeout(() => {
      onComplete();
    }, autoCloseDuration);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(closeTimeout);
    };
  }, [isOpen, lines, lineDelay, autoCloseDuration, onComplete, showConfetti]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl p-8 max-w-lg w-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confetti */}
            {showConfetti && confetti.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{ y: -20, opacity: 1 }}
                animate={{ y: 500, opacity: 0 }}
                transition={{
                  duration: 3,
                  delay: piece.delay,
                  ease: "easeIn"
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${piece.left}%`,
                  backgroundColor: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}

            {/* Content */}
            <div className="space-y-4 text-center relative z-10">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  duration: 0.8,
                  delay: 0.2
                }}
                className="flex justify-center mb-6"
              >
                <AnimatedLogo size="small" autoPlay={true} />
              </motion.div>

              {/* Text Lines */}
              {lines.map((line, index) => (
                <AnimatePresence key={index}>
                  {visibleLines > index && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className={index === 0 ? "text-2xl text-purple-600" : "text-lg text-gray-700"}
                    >
                      {line}
                    </motion.p>
                  )}
                </AnimatePresence>
              ))}
            </div>

            {/* Tap to continue hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 2 }}
              className="text-center text-gray-400 text-sm mt-6"
            >
              Tap anywhere to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}