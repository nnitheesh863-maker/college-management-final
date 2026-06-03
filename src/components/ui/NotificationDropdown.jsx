import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell, FiBookOpen, FiDollarSign, FiVolume2,
  FiCalendar, FiAlertTriangle, FiCheck, FiCheckCircle,
} from 'react-icons/fi';
import { useNotifications } from '../../context/NotificationContext';

const CATEGORY_CONFIG = {
  assignment:    { icon: FiBookOpen,      color: 'text-blue-400',  bg: 'bg-blue-500/20',   border: 'border-blue-500/30' },
  fee:           { icon: FiDollarSign,    color: 'text-amber-400', bg: 'bg-amber-500/20',   border: 'border-amber-500/30' },
  announcement:  { icon: FiVolume2,       color: 'text-purple-400',bg: 'bg-purple-500/20',  border: 'border-purple-500/30' },
  leave:         { icon: FiCalendar,      color: 'text-emerald-400',bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
  disciplinary:  { icon: FiAlertTriangle, color: 'text-rose-400',  bg: 'bg-rose-500/20',   border: 'border-rose-500/30' },
  system:        { icon: FiBell,          color: 'text-accent-400',bg: 'bg-accent-500/20',  border: 'border-accent-500/30' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
      >
        <FiBell className="w-4 h-4" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white shadow-[0_0_6px_rgba(239,68,68,0.5)] px-[3px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-2 w-[380px] sm:w-[420px] max-h-[520px] flex flex-col rounded-2xl border border-white/[0.08] bg-surface-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 text-[11px] text-accent-400 hover:text-accent-300 transition-colors"
                >
                  <FiCheckCircle className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-white/30">
                  <FiBell className="w-8 h-8 mb-3" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const config = CATEGORY_CONFIG[n.category] || CATEGORY_CONFIG.system;
                  const Icon = config.icon;
                  return (
                    <button
                      key={n._id}
                      onClick={() => { if (!n.read) markAsRead(n._id); }}
                      className={`w-full text-left flex items-start gap-3 px-5 py-3.5 transition-all duration-200 border-b border-white/[0.03] last:border-0
                        ${n.read ? 'opacity-50 hover:opacity-70' : 'hover:bg-white/[0.04]'}`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${config.bg} ${config.border} border`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-relaxed ${n.read ? 'text-white/50' : 'text-white/80'}`}>
                          {n.message}
                        </p>
                        <p className="text-[10px] text-white/20 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.read && (
                        <span className="flex-shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full bg-accent-500 shadow-[0_0_6px_rgba(168,85,247,0.5)]" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
