import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell, FiBookOpen, FiDollarSign, FiVolume2,
  FiCalendar, FiAlertTriangle, FiX,
} from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';

const TOAST_CONFIG = {
  assignment:    { icon: FiBookOpen,      border: 'border-blue-500/40', glow: 'rgba(59,130,246,0.2)' },
  fee:           { icon: FiDollarSign,    border: 'border-amber-500/40', glow: 'rgba(245,158,11,0.2)' },
  announcement:  { icon: FiVolume2,       border: 'border-purple-500/40',glow: 'rgba(168,85,247,0.2)' },
  leave:         { icon: FiCalendar,      border: 'border-emerald-500/40',glow: 'rgba(16,185,129,0.2)' },
  disciplinary:  { icon: FiAlertTriangle, border: 'border-rose-500/40', glow: 'rgba(239,68,68,0.2)' },
  system:        { icon: FiBell,          border: 'border-accent-500/40', glow: 'rgba(168,85,247,0.2)' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useNotifications();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = TOAST_CONFIG[toast.category] || TOAST_CONFIG.system;
          const Icon = config.icon;
          return (
            <motion.div
              key={toast._toastId}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${config.border} bg-surface-900/95 backdrop-blur-2xl shadow-2xl w-[360px]`}
              style={{ boxShadow: `0 8px 32px ${config.glow}` }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.06]">
                <Icon className="w-4 h-4 text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/80 leading-relaxed line-clamp-2">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast._toastId)}
                className="flex-shrink-0 p-1 rounded-md text-white/20 hover:text-white/60 hover:bg-white/[0.06] transition-all"
              >
                <FiX className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
