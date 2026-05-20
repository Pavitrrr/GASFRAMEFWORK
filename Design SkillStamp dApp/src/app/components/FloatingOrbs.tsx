import { motion } from 'motion/react';

export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated floating orb 1 */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -80, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ top: '20%', left: '10%' }}
      />

      {/* Animated floating orb 2 */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ bottom: '10%', right: '15%' }}
      />

      {/* Animated floating orb 3 */}
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{
          background: 'radial-gradient(circle, #A855F7 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        initial={{ top: '50%', right: '30%' }}
      />
    </div>
  );
}
