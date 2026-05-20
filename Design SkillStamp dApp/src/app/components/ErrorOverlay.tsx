import { motion, AnimatePresence } from 'motion/react';

interface ErrorOverlayProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: 'error' | 'network';
}

export function ErrorOverlay({
  show,
  onClose,
  title = 'Transaction Failed',
  message,
  type = 'error',
}: ErrorOverlayProps) {
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

          {/* Error content */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center pointer-events-auto max-w-md"
            >
              {type === 'error' ? (
                <div className="relative inline-block mb-6">
                  {/* Animated red X */}
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    {/* Circle */}
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                    {/* X mark - first line */}
                    <motion.path
                      d="M 40 40 L 80 80"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="6"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    />
                    {/* X mark - second line */}
                    <motion.path
                      d="M 80 40 L 40 80"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="6"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    />
                    {/* Glow effect */}
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                  </svg>
                </div>
              ) : (
                <div className="relative inline-block mb-6">
                  {/* Animated wifi bars with X */}
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    {/* Wifi bars */}
                    <motion.path
                      d="M 35 65 Q 60 40 85 65"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="4"
                      strokeLinecap="round"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.path
                      d="M 45 75 Q 60 60 75 75"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="4"
                      strokeLinecap="round"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <circle cx="60" cy="85" r="4" fill="#EF4444" />
                    {/* Red X below */}
                    <motion.path
                      d="M 50 100 L 70 115"
                      stroke="#EF4444"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    />
                    <motion.path
                      d="M 70 100 L 50 115"
                      stroke="#EF4444"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    />
                  </svg>
                </div>
              )}

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="text-3xl mb-3 text-destructive"
                style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}
              >
                {title}
              </motion.h2>

              {message && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1 }}
                  className="text-muted-foreground mb-6"
                >
                  {message}
                </motion.p>
              )}

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                className="flex gap-3 justify-center"
              >
                {type === 'network' && (
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold"
                  >
                    Retry
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 font-bold transition-all"
                >
                  {type === 'network' ? 'Cancel' : 'Close'}
                </button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
