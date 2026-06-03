import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiUser, FiShield } from 'react-icons/fi';

const DEMO_CREDENTIALS = [
  { role: 'Student', email: 'alice@demo.edu', password: 'password123' },
  { role: 'Teacher', email: 'sarah@demo.edu', password: 'password123' },
  { role: 'Principal', email: 'james@demo.edu', password: 'password123' },
  { role: 'Parent', email: 'parent@demo.edu', password: 'password123' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      const paths = { student: '/student-dashboard', teacher: '/teacher-dashboard', principal: '/principal-dashboard', parent: '/parent-dashboard' };
      navigate(paths[data.user.role] || '/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-surface-950 p-4 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.08)_0%,transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="relative rounded-2xl border border-white/[0.08] bg-surface-900/80 backdrop-blur-2xl shadow-[0_0_60px_rgba(168,85,247,0.12)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-500 via-purple-500 to-pink-500" />

          <div className="p-8 sm:p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-accent-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.35)]"
            >
              <FiShield className="w-6 h-6 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-center gradient-text">Welcome Back</h1>
            <p className="text-white/40 text-sm text-center mt-1 mb-7">Sign in to your College ERP account</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    placeholder="you@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glass pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-glass pl-10"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiLogIn className="w-4 h-4" />
                    Sign In
                  </span>
                )}
              </motion.button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20"
              >
                <p className="text-rose-300 text-sm font-medium text-center">{error}</p>
              </motion.div>
            )}

            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <p className="text-xs text-white/30 text-center mb-3">Demo credentials</p>
              <div className="grid grid-cols-4 gap-2">
                {DEMO_CREDENTIALS.map((cred, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => { setEmail(cred.email); setPassword(cred.password); }}
                    className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all text-center group"
                  >
                    <FiUser className="w-3 h-3 mx-auto mb-1 text-white/30 group-hover:text-accent-400 transition-colors" />
                    <p className="text-[10px] text-white/40 group-hover:text-white/70 transition-colors font-medium">{cred.role}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <Link to="/register" className="text-sm text-white/40 hover:text-accent-400 transition-colors">
                Don't have an account? <span className="font-medium">Register</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
