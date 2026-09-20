import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

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
      const msg = err.response?.data?.message || (err.code === 'ERR_NETWORK' ? 'Cannot reach server at http://127.0.0.1:5001 — is it running?' : err.message) || 'Registration failed';
      setError(msg);
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#020617] p-6 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[150px] float" />
        <div className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-cyan-600/20 rounded-full blur-[150px] float-delayed" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-fuchsia-600/15 rounded-full blur-[180px] float-fast" />
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
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-18 h-18 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >C</motion.div>
            <h2 className="text-3xl font-extrabold text-center mb-1 glow-text">Create Account</h2>
            <p className="text-slate-400 text-sm text-center mb-8">Join the College ERP platform</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="input-glass" required />
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input-glass" required />
              <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="input-glass" required />
              <select name="role" value={form.role} onChange={handleChange} className="input-glass">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="principal">Principal</option>
              </select>
              {form.role === 'student' && (
                <input name="rollNo" placeholder="Roll Number" value={form.rollNo} onChange={handleChange} className="input-glass" />
              )}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-white font-semibold text-lg shadow-lg hover:shadow-[0_0_35px_rgba(168,85,247,0.35)] transition-all disabled:opacity-60"
              >{loading ? 'Creating...' : '🚀 Register'}</motion.button>
            </form>

            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-5 p-3 rounded-xl text-center font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30"
              >{error}</motion.div>
            )}

            <div className="mt-6 text-center">
              <Link to="/login" className="text-slate-400 hover:text-purple-300 font-medium text-sm transition-colors">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
