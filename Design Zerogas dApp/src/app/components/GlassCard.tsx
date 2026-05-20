import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <motion.div
      className={`relative backdrop-blur-[20px] rounded-2xl border overflow-hidden ${
        hover ? 'transition-all duration-300 hover:-translate-y-1' : ''
      } ${className}`}
      style={{
        background: 'var(--card)',
        borderColor: 'rgba(255, 255, 255, 0.06)',
      }}
      whileHover={
        hover
          ? {
              borderColor: 'rgba(124, 58, 237, 0.25)',
              boxShadow: '0 0 40px rgba(124, 58, 237, 0.2)',
            }
          : {}
      }
    >
      {/* Top gradient line on hover */}
      {hover && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(90deg, #7C3AED 0%, #06B6D4 100%)',
          }}
        />
      )}
      {children}
    </motion.div>
  );
}
