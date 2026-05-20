import { motion, AnimatePresence } from "motion/react";

export default function ErrorOverlay({ show, onClose, title = "Transaction Failed", message, type = "error" }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }} className="text-center pointer-events-auto max-w-md">
              <div className="relative inline-block mb-6">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <motion.circle cx="60" cy="60" r="54" fill="none" stroke="#EF4444" strokeWidth="4"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
                  <motion.path d="M 40 40 L 80 80" fill="none" stroke="#EF4444" strokeWidth="6" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.6 }} />
                  <motion.path d="M 80 40 L 40 80" fill="none" stroke="#EF4444" strokeWidth="6" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.6 }} />
                </svg>
              </div>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="text-3xl text-destructive mb-3" style={{ fontFamily: "var(--font-heading)", fontWeight: 800 }}>
                {title}
              </motion.h2>
              {message && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  className="text-muted-foreground mb-6">{message}</motion.p>
              )}
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 font-bold transition-all text-foreground">
                Close
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
