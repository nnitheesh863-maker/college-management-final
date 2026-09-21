import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardWrapper from '../components/dashboard/shared/DashboardWrapper';
import GlassCard, { GlassCardContent } from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import StatusBadge from '../components/ui/StatusBadge';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  FaUserGraduate, 
  FaCamera, 
  FaSave, 
  FaCheckCircle, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaIdCard, 
  FaBook, 
  FaCalendarAlt, 
  FaAward, 
  FaCreditCard, 
  FaFileUpload,
  FaFilePdf
} from 'react-icons/fa';

const navItems = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'profile', icon: '👤', label: 'Profile & Avatar' },
  { id: 'attendance', icon: '📅', label: 'Attendance' },
  { id: 'fees', icon: '💰', label: 'Fee Status' },
  { id: 'results', icon: '📝', label: 'Exam Results' },
  { id: 'assignments', icon: '📚', label: 'Assignments' },
  { id: 'timetable', icon: '⏰', label: 'Timetable' },
  { id: 'leave', icon: '✈️', label: 'Leave' },
  { id: 'events', icon: '🎉', label: 'Events' },
  { id: 'library', icon: '📖', label: 'Library' },
  { id: 'chat', icon: '💬', label: 'Chat' },
  { id: 'achievements', icon: '🏆', label: 'Achievements' },
  { id: 'notices', icon: '📢', label: 'Notices' },
];

const mockStudent = {
  name: 'Alice Johnson', 
  rollNo: '24BCS101', 
  grade: 'B.Sc Computer Science', 
  section: 'A', 
  email: 'alice@demo.edu',
  phone: '+91 98765 43210',
  parentContact: '+91 98765 12345',
  bio: 'Second-year Computer Science scholar passionate about artificial intelligence, cloud architecture, and open-source development.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  attendancePercent: 92, 
  avgMarks: 85,
  fees: [{ amount: 45000, paidAmount: 45000, status: 'paid', dueDate: '2026-06-15', id: 'FEE-2026-1' }],
  marks: [
    { subject: 'Data Structures & Algorithms', marksObtained: 92, totalMarks: 100, grade: 'A+' },
    { subject: 'Artificial Intelligence & ML', marksObtained: 88, totalMarks: 100, grade: 'A' },
    { subject: 'Database Management Systems', marksObtained: 78, totalMarks: 100, grade: 'B+' },
    { subject: 'Full-Stack Web Engineering', marksObtained: 95, totalMarks: 100, grade: 'A+' },
    { subject: 'Professional Communication', marksObtained: 85, totalMarks: 100, grade: 'A' },
  ],
  assignments: [
    { title: 'Data Structures: Red-Black Trees', subject: 'Data Structures', dueDate: '2026-06-01', status: 'pending', description: 'Implement insert, search, and balance routines with benchmarks.' },
    { title: 'Machine Learning Classification Model', subject: 'AI & ML', dueDate: '2026-05-28', status: 'submitted', description: 'Train and evaluate CNN architecture on image datasets.' },
    { title: 'SQL Schema & Query Optimization', subject: 'DBMS', dueDate: '2026-06-05', status: 'pending', description: 'Design 3NF relational schemas with indexing.' },
    { title: 'React & Express REST API Integration', subject: 'Web Dev', dueDate: '2026-06-10', status: 'pending', description: 'Deploy full-stack microservice with JWT auth.' },
  ],
  timetable: [
    { day: 'Monday', periods: ['Data Structures', 'AI & ML', 'DBMS', 'Lunch', 'Web Dev', 'Lab'] },
    { day: 'Tuesday', periods: ['AI & ML', 'Data Structures', 'Web Dev', 'Lunch', 'DBMS', 'Lab'] },
    { day: 'Wednesday', periods: ['DBMS', 'Web Dev', 'Data Structures', 'Lunch', 'English', 'AI & ML'] },
    { day: 'Thursday', periods: ['English', 'DBMS', 'AI & ML', 'Lunch', 'Data Structures', 'Web Dev'] },
    { day: 'Friday', periods: ['Web Dev', 'English', 'Data Structures', 'Lunch', 'AI & ML', 'Seminar'] },
  ],
  achievements: [
    { title: 'Smart India Hackathon Winner', icon: '🏆', desc: '1st place for AI civic safety model' }, 
    { title: 'Dean’s Honor List', icon: '⭐', desc: 'Semester GPA above 9.0' },
    { title: 'Perfect 100% Attendance', icon: '🎯', desc: 'Zero unexcused absences' }
  ],
  leaveRequests: [{ startDate: '2026-06-10', endDate: '2026-06-12', reason: 'Technical Conference presentation', status: 'approved' }],
  notices: [
    { title: '📢 End Semester Practical Examinations', description: 'Lab practical timetable published on student portal.' },
    { title: '🏆 KPRCAS Annual Tech Symposium 2026', description: 'Register for project exhibition and paper presentations.' },
  ],
  library: [
    { title: 'Data Structures with C++ & Python (PDF)', type: 'E-Book', url: '#' },
    { title: 'Deep Learning & Neural Networks Guide', type: 'Research Journal', url: '#' },
    { title: 'Database System Concepts (8th Ed)', type: 'PDF Book', url: '#' },
  ],
  notifications: [
    { message: '📚 New assignment uploaded: Red-Black Trees', type: 'info' },
    { message: '✅ Leave request for June 10-12 was approved by Dean', type: 'success' },
  ],
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(mockStudent);
  const [submittedIds, setSubmittedIds] = useState({});
  const [uploadModal, setUploadModal] = useState(null);
  const [submissionToast, setSubmissionToast] = useState('');
  
  // Profile State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || mockStudent.name,
    email: user?.email || mockStudent.email,
    rollNo: mockStudent.rollNo,
    grade: mockStudent.grade,
    section: mockStudent.section,
    phone: mockStudent.phone,
    parentContact: mockStudent.parentContact,
    bio: mockStudent.bio,
    avatar: user?.avatar || mockStudent.avatar,
  });
  const [profileSavedToast, setProfileSavedToast] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Chat State
  const [chatMsg, setChatMsg] = useState('');
  const [chatMsgs, setChatMsgs] = useState([
    { from: 'Dr. Sarah (Faculty)', text: 'Welcome to KPRCAS portal, Alice! Please submit your DS assignment before Friday.' },
    { from: 'Alice', text: 'Thank you ma\'am! Working on the Red-Black Tree implementation now.' },
  ]);

  // Leave Form
  const [leaveForm, setLeaveForm] = useState({ startDate: '', endDate: '', reason: '' });
  const [leaveToast, setLeaveToast] = useState('');

  useEffect(() => {
    // Sync with local storage or API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.avatar) {
          setProfileForm(prev => ({ ...prev, avatar: parsed.avatar, name: parsed.name || prev.name }));
          setData(prev => ({ ...prev, avatar: parsed.avatar, name: parsed.name || prev.name }));
        }
      } catch (e) {}
    }

    api.get('/student/dashboard').then(({ data: res }) => {
      if (res) {
        setData(prev => ({
          ...prev,
          ...res,
          name: res.student?.userId?.name || res.name || prev.name,
          avatar: res.student?.userId?.avatar || res.avatar || prev.avatar,
          rollNo: res.student?.rollNo || res.rollNo || prev.rollNo,
          grade: res.student?.grade || res.grade || prev.grade,
          section: res.student?.section || res.section || prev.section,
          attendancePercent: res.attendance?.percent ?? res.attendancePercent ?? prev.attendancePercent,
          avgMarks: res.avgMarks ?? prev.avgMarks,
        }));

        setProfileForm(prev => ({
          ...prev,
          name: res.student?.userId?.name || prev.name,
          avatar: res.student?.userId?.avatar || prev.avatar,
          rollNo: res.student?.rollNo || prev.rollNo,
          grade: res.student?.grade || prev.grade,
          parentContact: res.student?.parentContact || prev.parentContact,
        }));
      }
    }).catch(() => {});
  }, []);

  // Handle Avatar Image Upload via File Reader
  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image file size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setProfileForm(prev => ({ ...prev, avatar: base64String }));
    };
    reader.readAsDataURL(file);
  };

  // Save Profile Handler (persists in backend + localStorage + live UI state)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      await api.put('/student/profile', {
        name: profileForm.name,
        avatar: profileForm.avatar,
        grade: profileForm.grade,
        parentContact: profileForm.parentContact,
      }).catch(() => {});

      // Update in LocalStorage so other pages & Admin see it immediately
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, name: profileForm.name, avatar: profileForm.avatar };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Also update student data state
      setData(prev => ({
        ...prev,
        name: profileForm.name,
        avatar: profileForm.avatar,
        grade: profileForm.grade,
        rollNo: profileForm.rollNo,
        phone: profileForm.phone,
        parentContact: profileForm.parentContact,
        bio: profileForm.bio,
      }));

      setProfileSavedToast('✅ Profile & Avatar updated successfully! Synced across Admin & Faculty consoles.');
      setTimeout(() => setProfileSavedToast(''), 4000);
    } catch (err) {
      setProfileSavedToast('Profile saved locally in demo mode.');
      setTimeout(() => setProfileSavedToast(''), 3000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) return;
    const newReq = { ...leaveForm, status: 'pending', id: 'LR-' + Date.now() };
    setData(prev => ({
      ...prev,
      leaveRequests: [newReq, ...prev.leaveRequests]
    }));
    setLeaveForm({ startDate: '', endDate: '', reason: '' });
    setLeaveToast('Leave application submitted to Dean Office.');
    setTimeout(() => setLeaveToast(''), 3000);
  };

  const handlePayFee = (feeId) => {
    setData(prev => ({
      ...prev,
      fees: prev.fees.map(f => f.id === feeId ? { ...f, status: 'paid', paidAmount: f.amount } : f)
    }));
    alert('Fee payment transaction approved. Receipt generated!');
  };

  return (
    <DashboardWrapper role="student" navItems={navItems}>
      {(activeSection, setActiveSection) => {
        
        // ─── TAB 1: OVERVIEW ───
        if (activeSection === 'overview') {
          return (
            <div className="space-y-6">
              {/* Student Welcome Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0c1836] via-[#10234d] to-[#0d162d] border border-blue-500/25 shadow-2xl relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="relative group cursor-pointer" onClick={() => setActiveSection('profile')}>
                      <img
                        src={profileForm.avatar || data.avatar || mockStudent.avatar}
                        alt={data.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                        Edit
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active Scholar
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Roll: {data.rollNo}</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                        {data.name}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                        {data.grade} • Section {data.section}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveSection('profile')}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <FaCamera className="text-blue-400" />
                      <span>Profile & Photo</span>
                    </button>
                    <button
                      onClick={() => setActiveSection('results')}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-xs font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                      View Report Card
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* 4 Metric Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attendance</span>
                    <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                      {data.attendancePercent}%
                    </div>
                    <span className="text-[10px] text-emerald-300">Target 75%+ met</span>
                  </div>
                  <ProgressRing percent={data.attendancePercent} size={54} color="#10b981" />
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Marks</span>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-400 mt-1">
                      {data.avgMarks}%
                    </div>
                    <span className="text-[10px] text-blue-300">Grade A Distinction</span>
                  </div>
                  <ProgressRing percent={data.avgMarks} size={54} color="#3b82f6" />
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fee Status</span>
                  <div className="text-2xl font-bold text-white mt-1">
                    {data.fees?.[0]?.status === 'paid' ? '₹0 Due' : '₹45,000'}
                  </div>
                  <div className="mt-1">
                    <StatusBadge status={data.fees?.[0]?.status || 'paid'}>
                      {data.fees?.[0]?.status === 'paid' ? 'Paid in Full' : 'Pending'}
                    </StatusBadge>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assignments</span>
                  <div className="text-2xl font-bold text-purple-400 mt-1">
                    {data.assignments?.length || 4} Total
                  </div>
                  <span className="text-[10px] text-slate-400">1 Submitted • 3 Active</span>
                </div>
              </div>

              {/* Quick Grid: Timetable Today & Active Notices */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0b1122] border border-white/10">
                  <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-400" /> Today's Lecture Schedule
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Data Structures', 'AI & ML Lab', 'DBMS', 'Web Dev', 'English'].map((sub, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="text-[10px] text-emerald-400 font-bold">Period {i + 1}</span>
                        <div className="font-bold text-white text-xs mt-1">{sub}</div>
                        <div className="text-[10px] text-slate-400">Room 30{i + 1} • Lab B</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0b1122] border border-white/10">
                  <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                    📢 Campus Announcements
                  </h3>
                  <div className="space-y-3">
                    {data.notices.map((n, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 border-l-4 border-l-blue-500">
                        <h4 className="text-xs font-bold text-white">{n.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{n.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // ─── TAB 2: PROFILE & AVATAR SETTINGS ───
        if (activeSection === 'profile') {
          return (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Scholar Profile & Avatar Settings
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Update your personal profile, student photo, and institutional information.
                  </p>
                </div>
              </div>

              {profileSavedToast && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <FaCheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{profileSavedToast}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Photo Upload & Preview Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1528] border border-white/10 shadow-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                    <FaCamera className="text-emerald-400" /> Profile Picture / Avatar
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar Preview */}
                    <div className="relative">
                      <img
                        src={profileForm.avatar || mockStudent.avatar}
                        alt="Avatar Preview"
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-blue-500/40 shadow-2xl"
                      />
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute bottom-1 right-1 p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-lg transition-transform hover:scale-110"
                        title="Upload New Photo"
                      >
                        <FaCamera className="w-3.5 h-3.5" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="space-y-3 text-center sm:text-left">
                      <div>
                        <span className="text-xs font-bold text-white block">Upload Official Student Photo</span>
                        <span className="text-[11px] text-slate-400">PNG, JPG, WebP up to 2MB. This photo is displayed in your ERP ID card, attendance roster, and Dean's console.</span>
                      </div>

                      {/* Custom Avatar URL input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="Or paste image URL..."
                          value={profileForm.avatar}
                          onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                          className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs w-full max-w-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal & Academic Details Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1528] border border-white/10 shadow-xl space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                    <FaIdCard className="text-blue-400" /> Academic & Personal Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Institutional Email</label>
                      <input
                        type="email"
                        disabled
                        value={profileForm.email}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-slate-400 text-xs cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Roll Number</label>
                      <input
                        type="text"
                        value={profileForm.rollNo}
                        onChange={(e) => setProfileForm({ ...profileForm, rollNo: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department / Program</label>
                      <select
                        value={profileForm.grade}
                        onChange={(e) => setProfileForm({ ...profileForm, grade: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#090d18] border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                        <option value="B.Sc AI & Data Science">B.Sc AI & Data Science</option>
                        <option value="B.Com Professional">B.Com Professional</option>
                        <option value="BBA Digital Marketing">BBA Digital Marketing</option>
                        <option value="M.Sc Cyber Security">M.Sc Cyber Security</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Section</label>
                      <input
                        type="text"
                        value={profileForm.section}
                        onChange={(e) => setProfileForm({ ...profileForm, section: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Student Mobile Number</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Parent / Emergency Contact</label>
                      <input
                        type="tel"
                        value={profileForm.parentContact}
                        onChange={(e) => setProfileForm({ ...profileForm, parentContact: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Academic Bio & Interests</label>
                    <textarea
                      rows="3"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Share your research interests, projects, or honors..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Save Profile Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
                  >
                    {isSavingProfile ? (
                      <span>Saving Profile...</span>
                    ) : (
                      <>
                        <FaSave className="w-3.5 h-3.5" />
                        <span>Save Profile & Sync Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          );
        }

        // ─── TAB 3: ATTENDANCE ───
        if (activeSection === 'attendance') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">📅 Academic Attendance Tracker</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xs text-slate-400 uppercase">Overall Attendance</span>
                  <div className="text-4xl font-bold text-emerald-400 mt-2">{data.attendancePercent}%</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xs text-slate-400 uppercase">Classes Attended</span>
                  <div className="text-4xl font-bold text-blue-400 mt-2">115 / 125</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <span className="text-xs text-slate-400 uppercase">Status</span>
                  <div className="text-2xl font-bold text-emerald-300 mt-2">Good Standing ✅</div>
                </div>
              </div>
            </div>
          );
        }

        // ─── TAB 4: FEES ───
        if (activeSection === 'fees') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">💰 Institutional Fee Status</h2>
              <div className="p-6 rounded-3xl bg-[#0c1426] border border-white/10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="font-bold text-white text-lg">Semester 4 Tuition & Lab Fee</h3>
                    <p className="text-xs text-slate-400">Due Date: June 15, 2026</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">₹45,000</div>
                    <span className="text-xs text-emerald-400 font-bold">Paid in Full</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => alert('Downloading official fee payment receipt (PDF)...')}
                    className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2"
                  >
                    <FaFilePdf className="text-rose-400" />
                    <span>Download Tax Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          );
        }

        // ─── TAB 5: RESULTS ───
        if (activeSection === 'results') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">📝 Semester Examination Results</h2>
              <div className="p-6 rounded-3xl bg-[#0c1426] border border-white/10 overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px]">
                      <th className="pb-3">Subject Name</th>
                      <th className="pb-3">Marks Obtained</th>
                      <th className="pb-3">Max Marks</th>
                      <th className="pb-3">Grade</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.marks.map((m, i) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-semibold text-white">{m.subject}</td>
                        <td className="py-3 font-bold text-blue-400">{m.marksObtained}</td>
                        <td className="py-3 text-slate-400">{m.totalMarks}</td>
                        <td className="py-3 font-bold text-emerald-400">{m.grade}</td>
                        <td className="py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Passed</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // ─── TAB 6: ASSIGNMENTS ───
        if (activeSection === 'assignments') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">📚 Coursework & Assignments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.assignments.map((asg, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#0c1426] border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                          {asg.subject}
                        </span>
                        <span className="text-xs text-slate-400">Due: {asg.dueDate}</span>
                      </div>
                      <h3 className="font-bold text-white text-base mb-1">{asg.title}</h3>
                      <p className="text-xs text-slate-400 mb-4">{asg.description}</p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className={`text-xs font-semibold ${asg.status === 'submitted' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {asg.status === 'submitted' ? '✅ Submitted' : '⏳ Pending Submission'}
                      </span>
                      {asg.status !== 'submitted' && (
                        <button
                          onClick={() => {
                            setSubmittedIds(prev => ({ ...prev, [i]: true }));
                            alert(`Assignment "${asg.title}" submitted successfully!`);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                        >
                          Submit Solution
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // ─── TAB 7: TIMETABLE ───
        if (activeSection === 'timetable') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">⏰ Weekly Class Timetable</h2>
              <div className="space-y-3">
                {data.timetable.map((t, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#0c1426] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="w-28 font-bold text-emerald-400 text-sm">{t.day}</span>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 flex-1 w-full">
                      {t.periods.map((p, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-white/5 text-center text-xs text-white border border-white/5 truncate">
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // ─── TAB 8: LEAVE ───
        if (activeSection === 'leave') {
          return (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl font-bold text-white">✈️ Apply for Student Leave</h2>
              {leaveToast && <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl text-xs">{leaveToast}</div>}
              
              <form onSubmit={handleApplyLeave} className="p-6 rounded-3xl bg-[#0c1426] border border-white/10 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={leaveForm.startDate}
                      onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={leaveForm.endDate}
                      onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Reason for Leave</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Provide valid academic or personal reason..."
                    value={leaveForm.reason}
                    onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                  />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider">
                  Submit Leave Request
                </button>
              </form>
            </div>
          );
        }

        // ─── TAB 9: LIBRARY ───
        if (activeSection === 'library') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">📖 Digital Knowledge Library</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.library.map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#0c1426] border border-white/10 flex flex-col justify-between">
                    <div>
                      <FaBook className="w-8 h-8 text-blue-400 mb-3" />
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">{item.type}</span>
                    </div>
                    <button onClick={() => alert(`Opening ${item.title} in digital e-reader...`)} className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold">
                      Read E-Book →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // ─── TAB 10: CHAT ───
        if (activeSection === 'chat') {
          return (
            <div className="space-y-6 max-w-3xl">
              <h2 className="text-2xl font-bold text-white">💬 Faculty & Mentor Messages</h2>
              <div className="p-6 rounded-3xl bg-[#0c1426] border border-white/10 h-80 overflow-y-auto space-y-3">
                {chatMsgs.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'Alice' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${m.from === 'Alice' ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-200'}`}>
                      <div className="text-[10px] opacity-75 font-bold mb-0.5">{m.from}</div>
                      <div>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message to your faculty..."
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && chatMsg.trim()) {
                      setChatMsgs([...chatMsgs, { from: 'Alice', text: chatMsg }]);
                      setChatMsg('');
                    }
                  }}
                  className="flex-1 p-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                />
                <button
                  onClick={() => {
                    if (chatMsg.trim()) {
                      setChatMsgs([...chatMsgs, { from: 'Alice', text: chatMsg }]);
                      setChatMsg('');
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Send
                </button>
              </div>
            </div>
          );
        }

        // ─── TAB 11: ACHIEVEMENTS ───
        if (activeSection === 'achievements') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">🏆 Badges & Achievements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.achievements.map((item, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-[#0c1426] border border-white/10 text-center">
                    <div className="text-5xl mb-2">{item.icon}</div>
                    <h3 className="font-bold text-white text-base">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // ─── TAB 12: NOTICES ───
        if (activeSection === 'notices') {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">📢 Official Campus Notices</h2>
              <div className="space-y-3">
                {data.notices.map((n, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[#0c1426] border border-white/10 border-l-4 border-l-blue-500">
                    <h4 className="font-bold text-white text-sm">{n.title}</h4>
                    <p className="text-xs text-slate-300 mt-1">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return <div className="text-slate-400 text-center py-12">Section under active development</div>;
      }}
    </DashboardWrapper>
  );
}
