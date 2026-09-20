import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardWrapper from '../components/dashboard/shared/DashboardWrapper';
import GlassCard, { GlassCardContent } from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import StatusBadge from '../components/ui/StatusBadge';
import api from '../services/api';

const COLORS = { math: '#3b82f6', physics: '#06b6d4', chemistry: '#8b5cf6', cs: '#10b981', english: '#f59e0b' };

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
    { title: 'Calculus Homework', subject: 'Math', dueDate: '2026-06-01', status: 'pending' },
    { title: 'Physics Lab Report', subject: 'Physics', dueDate: '2026-05-28', status: 'submitted' },
  ],
  timetable: [
    { day: 'Monday', periods: ['Math', 'Physics', 'Chemistry', 'Lunch', 'CS', 'English'] },
    { day: 'Tuesday', periods: ['Physics', 'Math', 'English', 'Lunch', 'Chemistry', 'CS'] },
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
  const [chatMsg, setChatMsg] = useState('');
  const [chatMsgs, setChatMsgs] = useState([
    { from: 'Dr. Sarah', text: 'Hello class! How is everyone doing?' },
    { from: 'Alice', text: 'Good morning, ma\'am!' },
  ]);

  useEffect(() => {
    api.get('/student/dashboard').then(({ data }) => {
      if (data) setData(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

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
            <h2 className="text-2xl font-bold glow-text-blue">📝 Exam Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {data.marks.map((m, i) => {
                const color = Object.values(COLORS)[i];
                return <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -4 }} className="rounded-xl p-4 text-center border bg-white/5 backdrop-blur-sm border-white/10">
                  <p className="text-slate-400 text-xs font-medium mb-1">{m.subject}</p>
                  <p className="text-3xl font-bold" style={{ color }}>{m.marksObtained}</p>
                  <p className="text-slate-500 text-xs">/ {m.totalMarks}</p>
                  <StatusBadge status={m.marksObtained >= 75 ? 'high' : m.marksObtained >= 50 ? 'medium' : 'low'}>{m.grade}</StatusBadge>
                </motion.div>;
              })}
            </div>
            <GlassCard hoverable glow><GlassCardContent>
              <h3 className="text-white font-semibold mb-4">📊 GPA Trend</h3>
              <div className="flex items-end gap-3 h-40">
                {gpaData.map((g, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${g * 40}px` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-500" />
                    <span className="text-xs text-slate-400">Sem {i + 1}</span>
                  </div>
                ))}
              </div>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'assignments') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-blue">📚 Homework & Assignments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.assignments.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02 }} className="rounded-2xl p-5 border bg-white/5 backdrop-blur-sm border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white">{a.title}</h4>
                    <StatusBadge status={a.status}>{a.status}</StatusBadge>
                  </div>
                  <p className="text-slate-400 text-sm">{a.subject}</p>
                  <p className="text-slate-500 text-xs">Due: {a.dueDate}</p>
                  {a.status === 'pending' && (
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                      className="mt-3 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold">
                      📤 Upload Submission
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );

        if (s === 'timetable') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-blue">⏰ Timetable</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {data.timetable.map((day, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="rounded-xl border bg-white/5 border-white/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600/30 to-cyan-600/20 p-3 text-center border-b border-white/10">
                    <p className="font-bold text-white text-sm glow-text-blue">{day.day}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    {day.periods.map((sub, j) => (
                      <div key={j} className={`p-2 rounded-lg text-xs font-medium text-center border ${sub === 'Lunch' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-white/5 border-white/10 text-slate-300'}`}
                        style={sub !== 'Lunch' ? { borderLeftColor: Object.values(COLORS)[j % 5], borderLeftWidth: 3 } : {}}>
                        {j + 1}. {sub}
                      </div>
                    ))}
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
