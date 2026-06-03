import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import ParticleBackground from '../animations/ParticleBackground';
import AIChatBot from '../dashboard/AIChatBot';

export default function DashboardLayout({ activeSection, setActiveSection, children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  const handleLogout = () => navigate('/login');

  return (
    <div className="min-h-screen bg-[#0f0a1a] relative overflow-hidden">
      <ParticleBackground />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] float" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] float-delayed" />
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[150px] float-fast" />
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[120px] float-slow" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          active={activeSection}
          onSelect={setActiveSection}
          onLogout={handleLogout}
        />

        <main className={`flex-1 transition-all duration-300 min-h-screen ${sidebarOpen ? 'ml-60' : 'ml-[72px]'}`}>
          <Header
            activeSection={activeSection}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onToggleChat={() => setChatOpen(!chatOpen)}
            notificationCount={3}
          />

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AIChatBot open={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  );
}
