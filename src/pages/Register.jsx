import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiUserPlus, FiBookOpen, FiChevronDown } from 'react-icons/fi';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', rollNo: '', grade: '10' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(form);
      const paths = { student: '/student-dashboard', teacher: '/teacher-dashboard', principal: '/principal-dashboard' };
      navigate(paths[data.user.role] || '/student-dashboard');
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.code === 'ERR_NETWORK' ? 'Cannot reach the server — is it running?' : err.message)
        || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-surface-950 p-4 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-accent-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-cyan-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]" />
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
              <FiUserPlus className="w-6 h-6 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-center gradient-text">Create Account</h1>
            <p className="text-white/40 text-sm text-center mt-1 mb-7">Join the College ERP platform</p>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} className="input-glass pl-10" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input name="email" type="email" placeholder="you@college.edu" value={form.email} onChange={handleChange} className="input-glass pl-10" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input name="password" type="password" placeholder="Create a strong password" value={form.password} onChange={handleChange} className="input-glass pl-10" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Role</label>
                  <div className="relative">
                    <FiBookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <select name="role" value={form.role} onChange={handleChange} className="input-glass pl-10 appearance-none">
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="principal">Principal</option>
                    </select>
                    <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  </div>
                </div>
                {form.role === 'student' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Roll No</label>
                    <input name="rollNo" placeholder="STU101" value={form.rollNo} onChange={handleChange} className="input-glass" />
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiUserPlus className="w-4 h-4" />
                    Register
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

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-white/40 hover:text-accent-400 transition-colors">
                Already have an account? <span className="font-medium">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
