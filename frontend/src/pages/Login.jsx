import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemo = (role = 'teacher') => {
    if (loginWithDemo) loginWithDemo(role);
    const paths = { student: '/student-dashboard', teacher: '/teacher-dashboard', principal: '/principal-dashboard' };
    navigate(paths[role] || '/teacher-dashboard');
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);

    if (email.endsWith('@demo.edu')) {
      const role = email.startsWith('alice') ? 'student' : email.startsWith('sarah') ? 'teacher' : 'principal';
      handleDemo(role);
      setLoading(false);
      return;
    }

    try {
      const data = await login(email, password);
      const paths = { student: '/student-dashboard', teacher: '/teacher-dashboard', principal: '/principal-dashboard' };
      navigate(paths[data.user.role] || '/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#020617] p-6 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[150px] float" />
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-cyan-600/20 rounded-full blur-[150px] float-delayed" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[180px] float-fast" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/25 shadow-[0_0_80px_rgba(139,92,246,0.2)] bg-[#0f172a]/90 backdrop-blur-2xl">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500" />

          <div className="p-8 md:p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-18 h-18 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              C
            </motion.div>
            <h2 className="text-3xl font-extrabold text-center mb-1 glow-text">Welcome Back</h2>
            <p className="text-slate-400 text-sm text-center mb-8">Sign in to your College ERP portal</p>

            <form onSubmit={handleSubmit} action="javascript:void(0);" className="space-y-5">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Email</label>
                <input
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white font-semibold text-lg shadow-lg hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? 'Signing in...' : '🔐 Sign In'}
              </motion.button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-3 rounded-xl text-center font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="mt-6 flex flex-col items-center gap-3">
              <Link to="/register" className="text-slate-400 hover:text-purple-300 font-medium text-sm transition-colors">
                Don't have an account? Register
              </Link>
              <button
                type="button"
                data-testid="demo-login-btn"
                onClick={() => handleDemo('teacher')}
                className="text-xs text-slate-500 hover:text-purple-400 transition-colors cursor-pointer bg-transparent border-0 underline"
              >
                ⚡ Skip to Demo Dashboard
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
