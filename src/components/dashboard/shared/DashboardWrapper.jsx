import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import NotificationDropdown from '../../ui/NotificationDropdown';
import ToastContainer from '../../ui/ToastContainer';
import {
  FiMenu, FiX, FiLogOut, FiChevronLeft, FiChevronRight,
  FiMessageCircle
} from 'react-icons/fi';

const THEMES = {
  student: {
    avatar: 'from-blue-500 to-cyan-500',
    sidebarActive: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30',
    indicator: 'from-blue-500 to-cyan-500',
    glowColor: 'rgba(59,130,246,0.25)',
    label: 'Student Portal',
    initial: 'S',
  },
  teacher: {
    avatar: 'from-accent-500 to-pink-500',
    sidebarActive: 'from-accent-500/20 to-pink-500/10 border-accent-500/30',
    indicator: 'from-accent-500 to-pink-500',
    glowColor: 'rgba(168,85,247,0.25)',
    label: 'Teacher Portal',
    initial: 'T',
  },
  principal: {
    avatar: 'from-amber-500 to-orange-500',
    sidebarActive: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
    indicator: 'from-amber-500 to-orange-500',
    glowColor: 'rgba(251,191,36,0.25)',
    label: 'Principal Portal',
    initial: 'P',
  },
  parent: {
    avatar: 'from-emerald-500 to-teal-500',
    sidebarActive: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
    indicator: 'from-emerald-500 to-teal-500',
    glowColor: 'rgba(16,185,129,0.25)',
    label: 'Parent Portal',
    initial: 'G',
  },
};

export default function DashboardWrapper({ role, navItems, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(navItems[0]?.id || 'overview');
  const theme = THEMES[role] || THEMES.student;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-surface-950 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] animate-float opacity-40"
          style={{ background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[120px] animate-float opacity-40"
          style={{ background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)`, animationDelay: '3s' }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <motion.aside
          animate={{ width: sidebarOpen ? 256 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-0 top-0 h-full z-30 flex flex-col overflow-hidden border-r border-white/[0.06] bg-surface-950/90 backdrop-blur-2xl lg:relative"
        >
          <div className={`flex-shrink-0 flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${theme.avatar} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {theme.initial}
                </div>
                <span className="font-semibold text-white text-sm">{theme.label}</span>
              </motion.div>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/30 hover:text-white transition-colors p-1 hidden lg:block"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: sidebarOpen ? 3 : 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm relative
                  ${activeSection === item.id
                    ? `bg-gradient-to-r ${theme.sidebarActive} text-white shadow-[0_0_15px_rgba(168,85,247,0.08)]`
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                  }`}
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId={`active-${role}`}
                    className={`absolute left-0 w-0.5 h-6 rounded-r-full bg-gradient-to-b ${theme.indicator}`}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>

          <div className="flex-shrink-0 p-2 border-t border-white/[0.06] space-y-0.5">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-full flex items-center justify-center p-2.5 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-all ${sidebarOpen ? '' : 'justify-center'}`}
            >
              <FiLogOut className="w-4 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm whitespace-nowrap">Sign Out</span>}
            </button>
          </div>
        </motion.aside>

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed left-3 top-3 z-20 p-2.5 rounded-xl bg-surface-900 border border-white/[0.08] text-white/50 hover:text-white shadow-lg lg:hidden"
          >
            <FiMenu className="w-4 h-4" />
          </button>
        )}

        <main className="flex-1 min-h-screen min-w-0">
          <header className="sticky top-0 z-20 h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/[0.06] bg-surface-950/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all hidden lg:block"
                >
                  <FiMenu className="w-4 h-4" />
                </button>
              )}
              <div>
                <h1 className="text-sm font-medium text-white capitalize">{activeSection}</h1>
                <p className="text-[11px] text-white/30 hidden sm:block">{theme.label}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <NotificationDropdown />
              <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
                <FiMessageCircle className="w-4 h-4" />
              </button>
              <div className="h-6 w-px bg-white/[0.06] mx-1" />
              <div className="flex items-center gap-2.5 pl-1">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium text-white">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-white/30 capitalize">{user?.role || '—'}</p>
                </div>
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.avatar} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                  {(user?.name || 'U')[0]}
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {children(activeSection, setActiveSection)}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <ToastContainer />
      </div>
    </div>
  );
}
