import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { KprcasLogo, KPRCAS_LOGO_URL } from '../components/landing/UnipixLogo';
import { FaUser, FaEnvelope, FaLock, FaUserGraduate, FaChalkboardTeacher, FaUserTie, FaArrowRight, FaIdCard, FaBuilding } from 'react-icons/fa';

export default function Register() {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'student', 
    rollNo: '24BCS' + Math.floor(100 + Math.random() * 900), 
    grade: 'B.Sc Computer Science' 
  });
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
      const msg = err.response?.data?.message || (err.code === 'ERR_NETWORK' ? 'Cannot reach backend server. Running in interactive demo mode.' : err.message) || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#070a13] p-4 sm:p-6 overflow-hidden">
      {/* Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#1e3a8a]/25 rounded-full blur-[140px] float" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[140px] float-delayed" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg z-10"
      >
        <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.6)] bg-[#0d1322]/95 backdrop-blur-2xl">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600" />

          <div className="p-6 sm:p-10">
            {/* Logo & Heading */}
            <div className="flex flex-col items-center text-center mb-6">
              <Link to="/" className="group mb-3 transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-200 flex items-center justify-center">
                  <img
                    src={KPRCAS_LOGO_URL}
                    alt="KPRCAS - Learn Beyond"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
              
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Create KPR<span className="text-blue-500">CAS</span> Account
              </h1>
              <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">
                Join KPR College of Arts Science & Research ERP
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-300 mb-2 block text-center">
                Select Your Institutional Role
              </label>
              <div className="grid grid-cols-3 gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'student' })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    form.role === 'student'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FaUserGraduate className="w-4 h-4" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'teacher' })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    form.role === 'teacher'
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FaChalkboardTeacher className="w-4 h-4" />
                  <span>Faculty</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'principal' })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    form.role === 'principal'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FaUserTie className="w-4 h-4" />
                  <span>Principal</span>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-slate-300 text-xs font-semibold mb-1 block">Full Name *</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3.5 text-slate-500"><FaUser className="w-3.5 h-3.5" /></div>
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="e.g. Nitheesh Kumar"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-xs font-semibold mb-1 block">Institutional Email *</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3.5 text-slate-500"><FaEnvelope className="w-3.5 h-3.5" /></div>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="nitheesh@kprcas.ac.in"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-xs font-semibold mb-1 block">Password *</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-3.5 text-slate-500"><FaLock className="w-3.5 h-3.5" /></div>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {form.role === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 text-xs font-semibold mb-1 block">Roll Number</label>
                    <input
                      name="rollNo"
                      placeholder="24BCS101"
                      value={form.rollNo}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 text-xs font-semibold mb-1 block">Department / Program</label>
                    <select
                      name="grade"
                      value={form.grade}
                      onChange={handleChange}
                      className="w-full px-3 py-3 rounded-xl bg-[#0b0f19] border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                      <option value="B.Sc AI & Data Science">B.Sc AI & Data Science</option>
                      <option value="B.Com Professional">B.Com Professional</option>
                      <option value="BBA Digital Marketing">BBA Digital Marketing</option>
                      <option value="M.Sc Cyber Security">M.Sc Cyber Security</option>
                    </select>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white font-bold text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? 'Registering...' : (
                  <>
                    <span>Complete Registration</span>
                    <FaArrowRight className="w-3 h-3" />
                  </>
                )}
              </motion.button>
            </form>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-3 rounded-xl text-center font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <Link to="/login" className="text-slate-400 hover:text-blue-400 text-xs transition-colors">
                Already registered? <strong className="text-white">Sign In to ERP</strong>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
