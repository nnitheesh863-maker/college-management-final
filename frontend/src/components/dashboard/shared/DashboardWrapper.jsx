import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';

const roleConfig = {
  student: {
    gradient: 'from-blue-600 via-cyan-500 to-purple-600',
    icon: '🧑‍🎓',
    label: 'Student Portal',
    accent: 'border-blue-500/40',
    sidebarAccent: 'bg-gradient-to-r from-blue-600/30 to-cyan-600/20',
    glowColor: 'rgba(59,130,246,0.3)',
    theme: {
      label: 'border-blue-500/40',
      activeBg: 'from-blue-600/30 to-cyan-600/20',
      avatar: 'from-blue-600 to-cyan-600',
      navActive: 'border-blue-500/30',
    },
  },
  teacher: {
    gradient: 'from-purple-600 via-fuchsia-500 to-pink-600',
    icon: '👩‍🏫',
    label: 'Teacher Portal',
    accent: 'border-purple-500/40',
    sidebarAccent: 'bg-gradient-to-r from-purple-600/30 to-pink-600/20',
    glowColor: 'rgba(168,85,247,0.3)',
    theme: {
      label: 'border-purple-500/40',
      activeBg: 'from-purple-600/30 to-pink-600/20',
      avatar: 'from-purple-600 to-pink-600',
      navActive: 'border-purple-500/30',
    },
  },
  principal: {
    gradient: 'from-amber-500 via-yellow-500 to-purple-600',
    icon: '🏫',
    label: 'Principal Portal',
    accent: 'border-amber-500/40',
    sidebarAccent: 'bg-gradient-to-r from-amber-600/30 to-purple-600/20',
    glowColor: 'rgba(251,191,36,0.3)',
    theme: {
      label: 'border-amber-500/40',
      activeBg: 'from-amber-600/30 to-purple-600/20',
      avatar: 'from-amber-600 to-purple-600',
      navActive: 'border-amber-500/30',
    },
  },
};

export default function DashboardWrapper({ role, navItems, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState(navItems[0]?.id || 'overview');
  const config = roleConfig[role] || roleConfig.student;
  const theme = config.theme;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#020617] relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 float"
          style={{ background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 float-delayed"
          style={{ background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <motion.aside
          animate={{ width: sidebarOpen ? 240 : 72 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-0 top-0 h-full z-30 flex flex-col overflow-hidden border-r border-white/5"
          style={{ background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(24px)' }}
        >
          <div className="p-4 border-b border-white/10 flex items-center gap-3 flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.avatar} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}
            >
              {role === 'student' ? 'S' : role === 'teacher' ? 'T' : 'P'}
            </div>
            {sidebarOpen && <span className="font-bold text-white text-lg whitespace-nowrap">{config.label}</span>}
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: sidebarOpen ? 4 : 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm relative cursor-pointer
                  ${
                    activeSection === item.id
                      ? `${theme.activeBg} text-white border ${theme.navActive} shadow-[0_0_20px_rgba(168,85,247,0.15)]`
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId={`${role}ActiveTab`}
                    className={`absolute left-0 w-1 h-7 rounded-r-full bg-gradient-to-b ${theme.avatar}`}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              </motion.button>
            ))}
          </nav>

          <div className="p-3 border-t border-white/10 flex-shrink-0 space-y-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <span className={`transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`}>
                {sidebarOpen ? '◀' : '▶'}
              </span>
            </button>
            <button
              onClick={handleLogout}
              data-testid="logout-btn"
              title="Logout"
              aria-label="Logout"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              <span className="text-lg flex-shrink-0">🚪</span>
              {sidebarOpen ? (
                <span className="text-sm whitespace-nowrap">Logout</span>
              ) : (
                <span className="sr-only">Logout</span>
              )}
            </button>
          </div>
        </motion.aside>

        <main className={`flex-1 transition-all duration-300 min-h-screen ${sidebarOpen ? 'ml-60' : 'ml-[72px]'}`}>
          <header
            className="sticky top-0 z-20 px-6 py-3 flex items-center justify-between border-b border-white/5"
            style={{ background: 'rgba(2,6,23,0.8)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-500 hover:text-white transition-colors text-xl cursor-pointer"
              >
                ☰
              </button>
              <h2 className="text-slate-400 text-sm hidden md:block capitalize">{activeSection}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-slate-400 text-xs hidden sm:block">{user?.name || 'User'}</div>
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.avatar} flex items-center justify-center text-white text-sm font-bold shadow-lg`}
              >
                {(user?.name || 'U')[0]}
              </div>
              <button
                onClick={handleLogout}
                data-testid="logout-btn-header"
                className="px-2.5 py-1 text-xs rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer font-medium"
              >
                Sign Out
              </button>
            </div>
          </header>

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {children(activeSection, setActiveSection)}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
