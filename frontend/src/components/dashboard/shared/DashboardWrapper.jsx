import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { KprcasLogo, KPRCAS_LOGO_URL } from '../../landing/UnipixLogo';
import { FaHome, FaSignOutAlt, FaBars, FaChevronLeft, FaChevronRight, FaBell } from 'react-icons/fa';

const roleConfig = {
  student: {
    gradient: 'from-blue-600 via-cyan-500 to-purple-600',
    icon: '🧑‍🎓',
    label: 'Student Console',
    accent: 'border-blue-500/40',
    sidebarAccent: 'bg-gradient-to-r from-blue-600/30 to-cyan-600/20',
    glowColor: 'rgba(59,130,246,0.25)',
    theme: {
      label: 'border-blue-500/40',
      activeBg: 'from-blue-600/30 to-cyan-600/20',
      avatar: 'from-blue-600 to-cyan-600',
      navActive: 'border-blue-500/30',
    },
  },
  teacher: {
    gradient: 'from-emerald-600 via-teal-500 to-cyan-600',
    icon: '👩‍🏫',
    label: 'Faculty Portal',
    accent: 'border-emerald-500/40',
    sidebarAccent: 'bg-gradient-to-r from-emerald-600/30 to-teal-600/20',
    glowColor: 'rgba(16,185,129,0.25)',
    theme: {
      label: 'border-emerald-500/40',
      activeBg: 'from-emerald-600/30 to-teal-600/20',
      avatar: 'from-emerald-600 to-teal-600',
      navActive: 'border-emerald-500/30',
    },
  },
  principal: {
    gradient: 'from-purple-600 via-pink-500 to-amber-500',
    icon: '🏛️',
    label: 'Executive Dean',
    accent: 'border-purple-500/40',
    sidebarAccent: 'bg-gradient-to-r from-purple-600/30 to-pink-600/20',
    glowColor: 'rgba(168,85,247,0.25)',
    theme: {
      label: 'border-purple-500/40',
      activeBg: 'from-purple-600/30 to-pink-600/20',
      avatar: 'from-purple-600 to-pink-600',
      navActive: 'border-purple-500/30',
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
    <div className="min-h-screen bg-[#070a13] text-slate-100 relative overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 float"
          style={{ background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 float-delayed"
          style={{ background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <motion.aside
          animate={{ width: sidebarOpen ? 250 : 76 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-0 top-0 h-full z-30 flex flex-col overflow-hidden border-r border-white/10"
          style={{ background: 'rgba(10, 14, 26, 0.95)', backdropFilter: 'blur(24px)' }}
        >
          {/* Brand Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-white p-1 flex-shrink-0 shadow border border-slate-200">
                <img
                  src={KPRCAS_LOGO_URL}
                  alt="KPRCAS"
                  className="w-full h-full object-contain"
                />
              </div>
              {sidebarOpen && (
                <div className="flex flex-col text-left truncate">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-white text-base tracking-wide">KPR<span className="text-blue-400">CAS</span></span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                    {config.label}
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: sidebarOpen ? 4 : 0 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-xs font-semibold relative cursor-pointer
                  ${
                    activeSection === item.id
                      ? `${theme.activeBg} text-white border ${theme.navActive} shadow-[0_0_20px_rgba(59,130,246,0.2)]`
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
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="whitespace-nowrap tracking-wide">{item.label}</span>}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-white/10 flex-shrink-0 space-y-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer text-xs"
              title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {sidebarOpen ? <FaChevronLeft className="w-3.5 h-3.5" /> : <FaChevronRight className="w-3.5 h-3.5" />}
            </button>
            
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-xs"
            >
              <FaHome className="w-4 h-4 flex-shrink-0 text-blue-400" />
              {sidebarOpen && <span>Public Portal</span>}
            </Link>

            <button
              onClick={handleLogout}
              data-testid="logout-btn"
              title="Logout"
              aria-label="Logout"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer text-xs"
            >
              <FaSignOutAlt className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className={`flex-1 transition-all duration-300 min-h-screen ${sidebarOpen ? 'ml-[250px]' : 'ml-[76px]'}`}>
          {/* Top Bar */}
          <header
            className="sticky top-0 z-20 px-6 py-3.5 flex items-center justify-between border-b border-white/10"
            style={{ background: 'rgba(7, 10, 19, 0.85)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <FaBars className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 capitalize hidden sm:inline">KPRCAS ERP</span>
                <span className="text-slate-600 hidden sm:inline">/</span>
                <h2 className="text-white text-xs sm:text-sm font-bold capitalize">{activeSection}</h2>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* User Profile Pill */}
              <div 
                onClick={() => setActiveSection('profile')} 
                className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 p-1.5 pr-3 rounded-full border border-white/10 cursor-pointer transition-colors"
                title="Open Profile Settings"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                  />
                ) : (
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${theme.avatar} flex items-center justify-center text-white text-xs font-bold shadow`}>
                    {(user?.name || 'U')[0]}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-none">{user?.name || 'Authorized User'}</div>
                  <div className="text-[10px] text-slate-400 capitalize mt-0.5">{role}</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                data-testid="logout-btn-header"
                className="px-3 py-1.5 text-xs rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/25 transition-all font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </header>

          {/* Page View Body */}
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
