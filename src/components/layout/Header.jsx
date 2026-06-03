import { motion } from 'framer-motion';

export default function Header({ activeSection, onToggleSidebar, onToggleChat, notificationCount = 0 }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 px-6 py-3 flex items-center justify-between"
      style={{ background: 'rgba(15,10,26,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleSidebar}
          className="text-white/50 hover:text-white transition-colors text-xl"
        >
          ☰
        </motion.button>
        <motion.h2
          key={activeSection}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/60 text-sm hidden md:block capitalize"
        >
          {activeSection}
        </motion.h2>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleChat}
          className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600/40 to-pink-600/40 text-white hover:from-purple-500 hover:to-pink-500 transition-all"
        >
          💬
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all"
        >
          🔔
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            >
              {notificationCount}
            </motion.span>
          )}
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold shadow-lg cursor-pointer"
        >
          T
        </motion.div>
      </div>
    </header>
  );
}
