import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#1a1035] border border-purple-500/30 rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.2)] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-bold text-white glow-text">{title}</h3>
              <button onClick={onClose} className="text-white/40 hover:text-white text-xl transition-colors">&times;</button>
            </div>
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
