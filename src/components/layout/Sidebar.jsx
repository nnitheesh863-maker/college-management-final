import { motion } from 'framer-motion';
import { SIDEBAR_ITEMS } from '../../data/mockData';

export default function Sidebar({ open, onToggle, active, onSelect, onLogout }) {
  return (
    <motion.aside
      initial={{ width: 240 }}
      animate={{ width: open ? 240 : 72 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 h-full z-30 flex flex-col overflow-hidden border-r border-white/5"
      style={{ background: 'rgba(15,10,26,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
    >
      <div className="p-4 border-b border-white/10 flex items-center gap-3 flex-shrink-0">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg"
        >
          T
        </motion.div>
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="font-bold text-white glow-text text-lg whitespace-nowrap"
          >
            Teacher Hub
          </motion.span>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {SIDEBAR_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: open ? 4 : 0 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm
              ${active === item.id
                ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/20 text-white border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
              }`}
          >
            <motion.span
              animate={{ rotate: active === item.id ? [0, -10, 10, -5, 0] : 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl flex-shrink-0"
            >
              {item.icon}
            </motion.span>
            {open && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-medium whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
            {active === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 w-1 h-8 rounded-r-full bg-gradient-to-b from-purple-500 to-pink-500"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 flex-shrink-0 space-y-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
        >
          <motion.span
            animate={{ rotate: open ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {open ? '◀' : '▶'}
          </motion.span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
        >
          <span className="text-xl flex-shrink-0">🚪</span>
          {open && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm whitespace-nowrap"
            >
              Logout
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
