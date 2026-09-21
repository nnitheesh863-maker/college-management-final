import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { KprcasLogo, KPRCAS_LOGO_URL, KPRCAS_CAMPUS_BG_URL } from '../components/landing/UnipixLogo';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaUserTie, 
  FaLock, 
  FaEnvelope, 
  FaEye, 
  FaEyeSlash, 
  FaArrowRight, 
  FaArrowLeft,
  FaHome,
  FaShieldAlt,
  FaCheckCircle 
} from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('alice@demo.edu');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithDemo } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'student') {
      setEmail('alice@demo.edu');
      setPassword('password123');
    } else if (role === 'teacher') {
      setEmail('sarah@demo.edu');
      setPassword('password123');
    } else if (role === 'principal') {
      setEmail('james@demo.edu');
      setPassword('password123');
    }
  };

  const handleDemoDirect = (role = selectedRole) => {
    if (loginWithDemo) loginWithDemo(role);
    const paths = { student: '/student-dashboard', teacher: '/teacher-dashboard', principal: '/principal-dashboard' };
    navigate(paths[role] || '/student-dashboard');
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);

    if (email.endsWith('@demo.edu')) {
      const role = email.startsWith('alice') ? 'student' : email.startsWith('sarah') ? 'teacher' : 'principal';
      handleDemoDirect(role);
      setLoading(false);
      return;
    }

    try {
      const data = await login(email, password);
      const paths = { student: '/student-dashboard', teacher: '/teacher-dashboard', principal: '/principal-dashboard' };
      navigate(paths[data.user.role] || '/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login credentials invalid or server unreachable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#050814] p-4 sm:p-6 overflow-hidden">
      {/* Background Campus Photo with Cinematic Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src={KPRCAS_CAMPUS_BG_URL}
          alt="KPRCAS Campus"
          className="w-full h-full object-cover object-center opacity-15 filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/85 to-[#050814]/90" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[140px] float" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[140px] float-delayed" />
      </div>

      {/* Prominent Back to Landing Page Bar */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold tracking-wide backdrop-blur-md shadow-lg transition-all transform hover:-translate-x-1"
        >
          <FaArrowLeft className="text-emerald-400" />
          <span>← Back to Landing Page</span>
        </Link>

        <Link
          to="/"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <FaHome className="text-blue-400" />
          <span className="hidden sm:inline">KPRCAS Main Portal</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg z-10"
      >
        <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.6)] bg-[#0d1322]/95 backdrop-blur-2xl">
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1e3a8a] via-emerald-500 to-[#1e3a8a]" />

          <div className="p-6 sm:p-10">
            {/* Header with KPRCAS Official Logo */}
            <div className="flex flex-col items-center text-center mb-6">
              <Link to="/" className="group mb-3 transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-xl border border-white/20 flex items-center justify-center">
                  <img
                    src={KPRCAS_LOGO_URL}
                    alt="KPRCAS - Learn Beyond Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
              
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-1.5">
                KPR<span className="text-blue-500">CAS</span>
                <span className="text-emerald-400 font-serif text-lg font-normal italic ml-1">ERP Portal</span>
              </h1>
              <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">
                Learn Beyond • College Management System
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="mb-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-center">
                Select Your Role
              </div>
              <div className="grid grid-cols-3 gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('student')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    selectedRole === 'student'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FaUserGraduate className="w-4 h-4" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('teacher')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    selectedRole === 'teacher'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FaChalkboardTeacher className="w-4 h-4" />
                  <span>Faculty</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('principal')}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    selectedRole === 'principal'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FaUserTie className="w-4 h-4" />
                  <span>Principal</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-slate-300 text-xs font-semibold mb-1.5 flex items-center gap-1.5">
                  <FaEnvelope className="text-blue-400 w-3 h-3" /> Institutional Email
                </label>
                <input
                  type="email"
                  placeholder="name@kprcas.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 text-xs font-semibold mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FaLock className="text-emerald-400 w-3 h-3" /> Password
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white text-[11px] flex items-center gap-1"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white font-bold text-xs uppercase tracking-widest shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
                    <FaArrowRight className="w-3 h-3" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Error Banner */}
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

            {/* Quick Demo One-Click Access Button */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col items-center gap-3">
              <button
                type="button"
                data-testid="demo-login-btn"
                onClick={() => handleDemoDirect(selectedRole)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FaCheckCircle className="text-emerald-400" />
                <span>One-Click Instant Demo Access ({selectedRole})</span>
              </button>

              <div className="flex items-center justify-between w-full text-xs text-slate-400">
                <Link to="/register" className="hover:text-blue-400 transition-colors">
                  New student/faculty? <strong>Register</strong>
                </Link>
                <Link to="/" className="hover:text-white transition-colors font-bold text-emerald-400">
                  ← Back to Landing Page
                </Link>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
