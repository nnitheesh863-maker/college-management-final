import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardWrapper from '../components/dashboard/shared/DashboardWrapper';
import GlassCard, { GlassCardContent } from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import StatusBadge from '../components/ui/StatusBadge';
import api from '../services/api';

const COLORS = { math: '#3b82f6', physics: '#06b6d4', chemistry: '#8b5cf6', cs: '#10b981', english: '#f59e0b' };

const PERIOD_TIMES = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:15 - 12:15',
  '12:15 - 01:00',
  '01:00 - 02:00',
  '02:00 - 03:00'
];

const navItems = [
  { id: 'overview', icon: '📊', label: 'Overview' },
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
  name: 'Alice Johnson', rollNo: 'STU101', grade: '10', section: 'A', email: 'alice@demo.edu',
  attendancePercent: 92, avgMarks: 85,
  fees: [{ amount: 25000, paidAmount: 25000, status: 'paid', dueDate: '2026-06-15' }],
  marks: [
    { subject: 'Math', marksObtained: 92, totalMarks: 100, grade: 'A+' },
    { subject: 'Physics', marksObtained: 88, totalMarks: 100, grade: 'A' },
    { subject: 'Chemistry', marksObtained: 78, totalMarks: 100, grade: 'B+' },
    { subject: 'CS', marksObtained: 95, totalMarks: 100, grade: 'A+' },
    { subject: 'English', marksObtained: 85, totalMarks: 100, grade: 'A' },
  ],
  assignments: [
    { title: 'Calculus & Integration Problem Set', subject: 'Math', dueDate: '2026-06-01', status: 'pending', description: 'Complete exercises 4.1 through 4.5 on definite integrals.' },
    { title: 'Electromagnetism Lab Report', subject: 'Physics', dueDate: '2026-05-28', status: 'submitted', description: 'Submit the formal lab report for Experiment 3.' },
    { title: 'Data Structures: Binary Trees & BST', subject: 'CS', dueDate: '2026-06-05', status: 'pending', description: 'Implement insert, search, and in-order traversal.' },
    { title: 'Organic Chemistry Reactions Essay', subject: 'Chemistry', dueDate: '2026-06-10', status: 'pending', description: 'Analyze nucleophilic addition mechanisms with diagrams.' },
    { title: 'Shakespearean Literature Analysis', subject: 'English', dueDate: '2026-06-15', status: 'graded', score: '94/100', description: 'Critical review of Hamlet Act III.' },
  ],
  timetable: [
    { day: 'Monday', periods: ['Math', 'Physics', 'Chemistry', 'Lunch', 'CS', 'English'] },
    { day: 'Tuesday', periods: ['Physics', 'Math', 'English', 'Lunch', 'Chemistry', 'CS'] },
    { day: 'Wednesday', periods: ['Chemistry', 'CS', 'Math', 'Lunch', 'English', 'Physics'] },
    { day: 'Thursday', periods: ['English', 'Chemistry', 'Physics', 'Lunch', 'Math', 'CS'] },
    { day: 'Friday', periods: ['CS', 'English', 'Math', 'Lunch', 'Physics', 'Chemistry'] },
  ],
  achievements: [{ title: 'Math Olympiad Winner', icon: '🏆' }, { title: 'Perfect Attendance', icon: '🎯' }],
  leaveRequests: [{ startDate: '2026-06-10', endDate: '2026-06-12', reason: 'Family event', status: 'pending' }],
  notices: [
    { title: '📢 Exam Schedule Published', description: 'Final exams start June 1st' },
    { title: '🏆 Science Fair Next Week', description: 'Annual science exhibition on Friday' },
  ],
  library: [
    { title: 'Mathematics Textbook', type: 'PDF', url: '#' },
    { title: 'Physics Lab Manual', type: 'PDF', url: '#' },
  ],
  notifications: [
    { message: '📚 New assignment: Calculus Homework', type: 'info' },
    { message: '💰 Fee payment due soon', type: 'warning' },
  ],
  leaderboard: [
    { name: 'Grace Lee', score: 93 }, { name: 'Alice Johnson', score: 85 },
    { name: 'Diana Prince', score: 82 }, { name: 'Bob Smith', score: 72 },
  ],
};

export default function StudentDashboard() {
  const [data, setData] = useState(mockStudent);
  const [submittedIds, setSubmittedIds] = useState({});
  const [uploadModal, setUploadModal] = useState(null);
  const [submissionFile, setSubmissionFile] = useState('');
  const [submissionToast, setSubmissionToast] = useState('');
  const [chatMsg, setChatMsg] = useState('');
  const [chatMsgs, setChatMsgs] = useState([
    { from: 'Dr. Sarah', text: 'Hello class! How is everyone doing?' },
    { from: 'Alice', text: 'Good morning, ma\'am!' },
  ]);

  useEffect(() => {
    api.get('/student/dashboard').then(({ data: res }) => {
      if (res) {
        setData(prev => ({
          ...prev,
          ...res,
          name: res.student?.userId?.name || res.name || prev.name,
          rollNo: res.student?.rollNo || res.rollNo || prev.rollNo,
          grade: res.student?.grade || res.grade || prev.grade,
          section: res.student?.section || res.section || prev.section,
          attendancePercent: res.attendance?.percent ?? res.attendancePercent ?? prev.attendancePercent,
          avgMarks: res.avgMarks ?? prev.avgMarks,
        }));
      }
    }).catch(() => {});
  }, []);

  const timetableList = useMemo(() => {
    if (data.timetable && Array.isArray(data.timetable) && data.timetable.length > 0) {
      if (data.timetable[0]?.periods && Array.isArray(data.timetable[0].periods)) {
        return data.timetable;
      }
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const map = {};
      days.forEach(d => { map[d] = []; });
      data.timetable.forEach(t => {
        if (map[t.day]) {
          map[t.day].push(t.subject);
        }
      });
      return days.map(d => ({
        day: d,
        periods: map[d].length > 0 ? map[d] : ['Math', 'Physics', 'Chemistry', 'Lunch', 'CS', 'English']
      }));
    }
    return mockStudent.timetable;
  }, [data.timetable]);

  const assignmentsList = useMemo(() => {
    if (data.assignments && Array.isArray(data.assignments) && data.assignments.length > 0) {
      return data.assignments.map((a, idx) => ({
        id: a._id || `asg-${idx}`,
        title: a.title,
        subject: a.subject,
        dueDate: a.dueDate ? (typeof a.dueDate === 'string' ? a.dueDate.split('T')[0] : new Date(a.dueDate).toISOString().split('T')[0]) : '2026-06-01',
        status: submittedIds[a._id || `asg-${idx}`] ? 'submitted' : (a.status || 'pending'),
        description: a.description || 'Complete all questions and submit solution documentation.',
        score: a.score || null
      }));
    }
    return mockStudent.assignments.map((a, idx) => ({
      ...a,
      id: `mock-${idx}`,
      status: submittedIds[`mock-${idx}`] ? 'submitted' : a.status
    }));
  }, [data.assignments, submittedIds]);

  const marksList = useMemo(() => {
    if (data.marks && Array.isArray(data.marks) && data.marks.length > 0) {
      return data.marks;
    }
    return mockStudent.marks;
  }, [data.marks]);

  const handleUploadSubmission = (asg) => {
    setUploadModal(asg);
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!uploadModal) return;
    setSubmittedIds(prev => ({ ...prev, [uploadModal.id]: true }));
    setSubmissionToast(`✅ Successfully submitted "${uploadModal.title}"!`);
    setUploadModal(null);
    setSubmissionFile('');
    setTimeout(() => setSubmissionToast(''), 4000);
  };

  const subjects = Object.values(COLORS);
  const gpaData = [3.2, 3.5, 3.8, 3.6, 3.9];

  return (
    <DashboardWrapper role="student" navItems={navItems}>
      {(section) => {
        const s = section;

        if (s === 'overview') return (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glow-card rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-600/10" />
              <h1 className="text-4xl font-extrabold glow-text-blue mb-2 relative">🧑‍🎓 Student Dashboard</h1>
              <p className="text-slate-400 relative">{data.name} • Roll: {data.rollNo} • Class {data.grade}-{data.section}</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '📅', label: 'Attendance', value: `${data.attendancePercent}%`, color: 'from-blue-600/30 to-cyan-600/20', border: 'border-blue-500/40' },
                { icon: '📊', label: 'Average Marks', value: `${data.avgMarks}%`, color: 'from-purple-600/30 to-fuchsia-600/20', border: 'border-purple-500/40' },
                { icon: '📚', label: 'Assignments', value: data.assignments.length, color: 'from-emerald-600/30 to-teal-600/20', border: 'border-emerald-500/40' },
                { icon: '🏆', label: 'Achievements', value: data.achievements.length, color: 'from-amber-600/30 to-orange-600/20', border: 'border-amber-500/40' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -4 }} className={`rounded-2xl p-4 text-center border bg-gradient-to-br ${c.color} ${c.border} backdrop-blur-sm shadow-lg`}>
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{c.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{typeof c.value === 'number' ? <AnimatedCounter value={c.value} /> : c.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">📊 GPA Analytics</h3>
                <div className="flex items-end gap-3 h-32">
                  {gpaData.map((g, i) => (
                    <motion.div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${g * 25}px` }}
                        transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                      <span className="text-xs text-slate-400">Sem {i + 1}</span>
                      <span className="text-xs font-bold text-white">{g}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCardContent></GlassCard>

              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">🏆 Leaderboard</h3>
                <div className="space-y-2">
                  {data.leaderboard.map((l, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className={`flex justify-between items-center p-3 rounded-xl border ${i === 0 ? 'bg-amber-500/15 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
                      <span className="flex items-center gap-2"><span className="text-lg">{['🥇', '🥈', '🥉', '4️⃣'][i]}</span><span className="text-white font-medium">{l.name}</span></span>
                      <span className="text-white font-bold">{l.score}%</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCardContent></GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">📅 Attendance</h3>
                <div className="flex justify-center"><ProgressRing percent={data.attendancePercent} color="#3b82f6" /></div>
                {data.attendancePercent < 75 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-sm font-semibold text-center alert-pulse">
                    ⚠️ Warning: Attendance below 75%!
                  </motion.div>
                )}
              </GlassCardContent></GlassCard>

              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">💰 Fee Status</h3>
                {data.fees.map((f, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Amount</span><span className="text-white font-bold">₹{f.amount}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Paid</span><span className="text-emerald-400 font-bold">₹{f.paidAmount}</span></div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(f.paidAmount / f.amount) * 100}%` }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>
                    <StatusBadge status={f.status}>{f.status}</StatusBadge>
                    {f.status !== 'paid' && (
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                        className="w-full p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm shadow-lg">
                        💳 Pay Now
                      </motion.button>
                    )}
                  </div>
                ))}
              </GlassCardContent></GlassCard>

              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">🤖 AI Study Recommendation</h3>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <p className="text-blue-300 text-sm">Based on your performance:</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    <li>• Focus on <span className="text-amber-400 font-semibold">Chemistry</span> (78%)</li>
                    <li>• Practice more <span className="text-amber-400 font-semibold">Physics</span> numericals</li>
                    <li>• You're excelling in <span className="text-emerald-400 font-semibold">CS</span>! 🎉</li>
                  </ul>
                </div>
              </GlassCardContent></GlassCard>
            </div>
          </div>
        );

        if (s === 'attendance') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-blue">📅 Attendance Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4">Weekly Attendance</h3>
                <div className="flex items-end gap-2 h-40">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => {
                    const pct = [85, 92, 78, 95, 88, 70][i];
                    return <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${pct * 1.6}px` }}
                        transition={{ delay: i * 0.08, duration: 0.6 }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]" />
                      <span className="text-xs text-slate-400">{pct}%</span>
                      <span className="text-[10px] text-slate-500">{d}</span>
                    </div>;
                  })}
                </div>
              </GlassCardContent></GlassCard>
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4">Monthly Summary</h3>
                <ProgressRing percent={data.attendancePercent} color="#3b82f6" size={160} />
                <p className="text-center text-slate-400 mt-2">Overall Attendance</p>
              </GlassCardContent></GlassCard>
            </div>
            {data.attendancePercent < 75 && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-center alert-pulse">
                <h3 className="text-2xl font-bold text-rose-300 mb-2">⚠️ Attendance Warning</h3>
                <p className="text-rose-200">Your attendance is below the required 75% minimum. Please attend classes regularly.</p>
              </motion.div>
            )}
          </div>
        );

        if (s === 'fees') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-blue">💰 Fee Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ l: 'Total Fees', v: '₹25,000', c: 'from-blue-600/30 to-cyan-600/20', b: 'border-blue-500/40' },
                { l: 'Paid', v: '₹25,000', c: 'from-emerald-600/30 to-teal-600/20', b: 'border-emerald-500/40' },
                { l: 'Status', v: 'Paid ✓', c: 'from-amber-600/30 to-orange-600/20', b: 'border-amber-500/40' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className={`rounded-2xl p-5 border bg-gradient-to-br ${c.c} ${c.b} backdrop-blur-sm`}>
                  <p className="text-slate-400 text-xs uppercase tracking-wider">{c.l}</p>
                  <p className="text-2xl font-bold text-white mt-1">{c.v}</p>
                </motion.div>
              ))}
            </div>
            <GlassCard hoverable glow><GlassCardContent>
              <h3 className="text-white font-semibold mb-4">📋 Payment History</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-300">
                  <thead><tr className="border-b border-white/10 text-slate-500 uppercase text-xs tracking-wider">
                    <th className="p-3 text-left">Date</th><th className="p-3 text-left">Amount</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Receipt</th>
                  </tr></thead>
                  <tbody>
                    {[{ date: '2026-01-15', amount: 25000, status: 'paid' }].map((r, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3">{r.date}</td><td className="p-3">₹{r.amount}</td>
                        <td className="p-3"><StatusBadge status={r.status}>{r.status}</StatusBadge></td>
                        <td className="p-3"><button className="text-blue-400 hover:text-blue-300 text-xs font-semibold">📄 Download</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'results') return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-2xl font-bold glow-text-blue">📝 Exam Results & Performance</h2>
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-full font-medium">
                Academic Year 2025-2026 • Semester 2
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {marksList.map((m, i) => {
                const color = Object.values(COLORS)[i % Object.values(COLORS).length];
                const pct = m.totalMarks ? Math.round((m.marksObtained / m.totalMarks) * 100) : m.marksObtained;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className="rounded-2xl p-4 text-center border bg-white/5 backdrop-blur-sm border-white/10 shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{m.subject}</p>
                    <p className="text-3xl font-extrabold tracking-tight my-1" style={{ color }}>{m.marksObtained}</p>
                    <p className="text-slate-500 text-xs mb-2">/ {m.totalMarks || 100} ({pct}%)</p>
                    <StatusBadge status={pct >= 75 ? 'high' : pct >= 50 ? 'medium' : 'low'}>
                      {m.grade || (pct >= 90 ? 'A+' : pct >= 75 ? 'A' : pct >= 50 ? 'B' : 'C')}
                    </StatusBadge>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <GlassCard hoverable glow><GlassCardContent>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-semibold flex items-center gap-2">📊 Cumulative GPA Progression</h3>
                    <span className="text-xs text-slate-400">Current GPA: <strong className="text-cyan-400 font-bold">3.9 / 4.0</strong></span>
                  </div>
                  <div className="flex items-end gap-3 h-44 pt-4">
                    {gpaData.map((g, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(g / 4.0) * 120}px` }}
                          transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        />
                        <span className="text-xs text-slate-400 font-medium">Sem {i + 1}</span>
                        <span className="text-xs font-bold text-white">{g}</span>
                      </div>
                    ))}
                  </div>
                </GlassCardContent></GlassCard>
              </div>

              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">🎯 Grading Scale</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span>90% - 100%</span><strong>A+ (Outstanding)</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                    <span>75% - 89%</span><strong>A (Excellent)</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <span>50% - 74%</span><strong>B (Good)</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    <span>&lt; 50%</span><strong>F (Needs Review)</strong>
                  </div>
                </div>
              </GlassCardContent></GlassCard>
            </div>
          </div>
        );

        if (s === 'assignments') return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-2xl font-bold glow-text-blue">📚 Homework & Assignments</h2>
                <p className="text-slate-400 text-sm">Review, track deadlines, and submit your homework solutions</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full font-medium">
                  {assignmentsList.filter(a => a.status === 'submitted' || a.status === 'graded').length} Completed
                </span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-full font-medium">
                  {assignmentsList.filter(a => a.status === 'pending').length} Pending
                </span>
              </div>
            </div>

            {submissionToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm font-semibold flex items-center justify-between"
              >
                <span>{submissionToast}</span>
                <button onClick={() => setSubmissionToast('')} className="text-emerald-300 hover:text-white">&times;</button>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignmentsList.map((a, i) => (
                <motion.div
                  key={a.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="rounded-2xl p-5 border bg-white/5 backdrop-blur-sm border-white/10 flex flex-col justify-between shadow-lg hover:border-blue-500/40 transition-all relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h4 className="font-bold text-white text-base leading-snug">{a.title}</h4>
                      <StatusBadge status={a.status}>{a.status}</StatusBadge>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25 mb-2">
                      {a.subject}
                    </span>
                    <p className="text-slate-300 text-xs line-clamp-2 mb-3">{a.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                      <span>📅 Due Date:</span>
                      <span className="font-medium text-amber-300">{a.dueDate}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    {a.status === 'pending' ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleUploadSubmission(a)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2"
                      >
                        <span>📤</span> Upload Submission
                      </motion.button>
                    ) : (
                      <div className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
                        <span>✅</span> {a.status === 'graded' ? `Graded: ${a.score || '95/100'}` : 'Submitted for Grading'}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Submission Upload Modal */}
            <AnimatePresence>
              {uploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-blue-500/30 p-6 shadow-2xl overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>📤</span> Submit Assignment
                      </h3>
                      <button onClick={() => setUploadModal(null)} className="text-slate-400 hover:text-white text-lg">&times;</button>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-4">
                      <h4 className="text-white font-semibold text-sm">{uploadModal.title}</h4>
                      <p className="text-blue-300 text-xs">{uploadModal.subject} • Due: {uploadModal.dueDate}</p>
                    </div>

                    <form onSubmit={handleConfirmSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Attach Solution / Report File (PDF, DOCX, ZIP)
                        </label>
                        <input
                          type="file"
                          onChange={(e) => setSubmissionFile(e.target.files[0]?.name || '')}
                          className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer bg-white/5 p-2 rounded-xl border border-white/10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                          Student Comments / Notes (Optional)
                        </label>
                        <textarea
                          placeholder="Include any remarks for the teacher regarding your submission..."
                          className="input-glass h-20 resize-none text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setUploadModal(null)}
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold shadow-lg hover:shadow-cyan-500/25"
                        >
                          🚀 Submit Homework
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );

        if (s === 'timetable') return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-2xl font-bold glow-text-blue">⏰ Weekly Timetable & Schedule</h2>
                <p className="text-slate-400 text-sm">Class 10-A • 6 Periods Daily • Academic Schedule</p>
              </div>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-full font-semibold">
                🔔 09:00 AM — 03:00 PM
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {timetableList.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden shadow-lg hover:border-blue-500/30 transition-all flex flex-col"
                >
                  <div className="bg-gradient-to-r from-blue-600/30 to-cyan-600/20 p-3.5 text-center border-b border-white/10">
                    <p className="font-extrabold text-white text-sm glow-text-blue tracking-wide">{day.day}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">6 Scheduled Periods</p>
                  </div>
                  <div className="p-3 space-y-2 flex-1">
                    {day.periods.map((sub, j) => {
                      const isLunch = sub.toLowerCase().includes('lunch');
                      const periodColor = Object.values(COLORS)[j % Object.values(COLORS).length];
                      return (
                        <motion.div
                          key={j}
                          whileHover={{ scale: 1.02 }}
                          className={`p-2.5 rounded-xl text-xs font-medium border transition-all ${
                            isLunch
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 font-bold text-center'
                              : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                          }`}
                          style={!isLunch ? { borderLeftColor: periodColor, borderLeftWidth: 4 } : {}}
                        >
                          <div className="flex justify-between items-center mb-0.5">
                            <span className="text-[10px] font-bold uppercase text-slate-400">
                              {isLunch ? 'Break' : `Period ${j + 1}`}
                            </span>
                            <span className="text-[10px] text-slate-500">{PERIOD_TIMES[j] || '01 hr'}</span>
                          </div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{isLunch ? '🥪' : '📖'}</span>
                            <span>{sub}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

        if (s === 'leave') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-blue">✈️ Leave Application</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4">Apply for Leave</h3>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <input type="date" className="input-glass" />
                  <input type="date" className="input-glass" />
                  <textarea placeholder="Reason for leave" className="input-glass h-24 resize-none" />
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                    className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-lg">
                    Submit Request
                  </motion.button>
                </form>
              </GlassCardContent></GlassCard>
              <div>
                <h3 className="text-white font-semibold mb-3">Recent Requests</h3>
                <div className="space-y-2">
                  {data.leaveRequests.map((l, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between"><span className="text-slate-400 text-sm">{l.startDate} - {l.endDate}</span><StatusBadge status={l.status}>{l.status}</StatusBadge></div>
                      <p className="text-white text-sm mt-1">{l.reason}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

        if (s === 'events') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-blue">🎉 Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Science Fair', date: '2026-06-10', type: 'academic', desc: 'Annual science exhibition' },
                { title: 'Sports Day', date: '2026-06-20', type: 'sports', desc: 'Inter-house sports competition' },
                { title: 'Cultural Fest', date: '2026-07-05', type: 'cultural', desc: 'Annual cultural festival' },
                { title: 'Workshop: AI Basics', date: '2026-06-15', type: 'academic', desc: 'Intro to AI workshop' },
              ].map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="rounded-2xl p-5 border bg-white/5 backdrop-blur-sm border-white/10">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{e.type === 'academic' ? '📚' : e.type === 'sports' ? '🏆' : '🎭'}</span>
                    <div><h4 className="font-bold text-white">{e.title}</h4><p className="text-slate-400 text-sm">{e.desc}</p><p className="text-slate-500 text-xs mt-1">📅 {e.date}</p></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

        if (s === 'library') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-blue">📖 Digital Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Mathematics Textbook', type: 'PDF', size: '12 MB' },
                { title: 'Physics Lab Manual', type: 'PDF', size: '8 MB' },
                { title: 'Chemistry Guide', type: 'PDF', size: '15 MB' },
                { title: 'CS Fundamentals', type: 'PDF', size: '10 MB' },
                { title: 'English Literature', type: 'PDF', size: '6 MB' },
                { title: 'Advanced Mathematics', type: 'PDF', size: '20 MB' },
              ].map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.03, y: -4 }} className="rounded-2xl p-5 border bg-white/5 backdrop-blur-sm border-white/10 cursor-pointer">
                  <div className="text-3xl mb-2">📘</div>
                  <h4 className="font-bold text-white text-sm">{b.title}</h4>
                  <p className="text-slate-500 text-xs">{b.type} • {b.size}</p>
                  <button className="mt-3 text-blue-400 hover:text-blue-300 text-xs font-semibold">📥 Download</button>
                </motion.div>
              ))}
            </div>
          </div>
        );

        if (s === 'chat') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-blue">💬 Group Chat</h2>
            <GlassCard hoverable glow><GlassCardContent>
              <div className="h-80 overflow-y-auto space-y-3 mb-4 p-2">
                {chatMsgs.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.from === 'Alice' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${m.from === 'Alice' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-md' : 'bg-white/10 text-slate-200 rounded-bl-md'}`}>
                      <p className="text-[10px] font-semibold mb-1 opacity-60">{m.from}</p>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && chatMsg.trim()) { setChatMsgs([...chatMsgs, { from: 'Alice', text: chatMsg }]); setChatMsg(''); } }}
                  placeholder="Type a message..." className="input-glass flex-1" />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { if (chatMsg.trim()) { setChatMsgs([...chatMsgs, { from: 'Alice', text: chatMsg }]); setChatMsg(''); } }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">➤</motion.button>
              </div>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'achievements') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-blue">🏆 Achievements & Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'Math Olympiad Winner', icon: '🏆', desc: 'First place in math competition' },
                { title: 'Perfect Attendance', icon: '🎯', desc: '100% attendance for a month' },
                { title: 'Star Performer', icon: '⭐', desc: 'Top scorer in CS' },
                { title: 'Science Fair Winner', icon: '🔬', desc: 'Best project award' },
              ].map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }} className="rounded-2xl p-6 text-center border bg-white/5 backdrop-blur-sm border-white/10">
                  <div className="text-5xl mb-3">{b.icon}</div>
                  <p className="font-bold text-white text-sm">{b.title}</p>
                  <p className="text-slate-500 text-xs mt-1">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

        if (s === 'notices') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-blue">📢 Notice Board</h2>
            <div className="space-y-3">
              {data.notices.map((n, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4 }} className="p-5 rounded-2xl bg-white/5 border border-white/10 border-l-4 border-l-blue-500">
                  <h4 className="font-bold text-white">{n.title}</h4>
                  <p className="text-slate-400 text-sm">{n.description}</p>
                </motion.div>
              ))}
            </div>
            <GlassCard hoverable glow><GlassCardContent>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">🔔 Notifications</h3>
              <div className="space-y-2">
                {data.notifications.map((n, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className={`p-3 rounded-xl border text-sm ${n.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-blue-500/10 border-blue-500/20 text-blue-300'}`}>
                    {n.message}
                  </motion.div>
                ))}
              </div>
            </GlassCardContent></GlassCard>
          </div>
        );

        return <div className="text-slate-400 text-center py-12">Section coming soon</div>;
      }}
    </DashboardWrapper>
  );
}
