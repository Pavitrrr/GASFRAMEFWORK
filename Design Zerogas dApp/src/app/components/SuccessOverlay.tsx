import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SuccessOverlayProps {
  show: boolean;
  onClose: () => void;
  title?: string;
}

export function SuccessOverlay({ show, onClose, title = 'Badge Claimed! 🎉' }: SuccessOverlayProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const confettiColors = [
    '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899',
  ];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Dark blurred overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Success content */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center pointer-events-auto"
            >
              {/* Animated SVG checkmark */}
              <div className="relative inline-block mb-6">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  {/* Circle that draws itself */}
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="url(#successGradient)"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                  {/* Check mark that draws itself */}
                  <motion.path
                    d="M 35 60 L 52 77 L 85 44"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Confetti burst */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: confettiColors[i % confettiColors.length],
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos((i / 12) * Math.PI * 2) * 100,
                      y: Math.sin((i / 12) * Math.PI * 2) * 100,
                      opacity: 0,
                      scale: 0,
                      rotate: 360,
                    }}
                    transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                  />
                ))}
              </div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1 }}
                className="text-4xl mb-2"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
              >
                {title}
              </motion.h2>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
