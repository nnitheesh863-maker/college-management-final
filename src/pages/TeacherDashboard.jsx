import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardWrapper from '../components/dashboard/shared/DashboardWrapper';
import GlassCard, { GlassCardContent } from '../components/ui/GlassCard';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import StatusBadge from '../components/ui/StatusBadge';
import api from '../services/api';

const navItems = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'attendance', icon: '📅', label: 'Attendance' },
  { id: 'marks', icon: '📝', label: 'Marks Entry' },
  { id: 'assignments', icon: '📚', label: 'Assignments' },
  { id: 'analytics', icon: '📈', label: 'Analytics' },
  { id: 'weak', icon: '⚠️', label: 'Weak Students' },
  { id: 'alerts', icon: '🚨', label: 'Alerts' },
  { id: 'timetable', icon: '⏰', label: 'Timetable' },
  { id: 'quizzes', icon: '❓', label: 'Quizzes' },
  { id: 'chat', icon: '💬', label: 'Messages' },
  { id: 'students', icon: '👥', label: 'Students' },
  { id: 'reports', icon: '📄', label: 'Reports' },
];

const mockData = {
  teacher: { name: 'Dr. Sarah Wilson', subject: 'Mathematics' },
  studentCount: 45,
  subjectAverages: [{ subject: 'Math', average: 78 }, { subject: 'Physics', average: 72 }, { subject: 'Chemistry', average: 68 }, { subject: 'CS', average: 82 }, { subject: 'English', average: 75 }],
  weakStudents: [
    { student: { userId: { name: 'Charlie Brown' }, rollNo: 'STU103', grade: '10' }, subject: 'Math', marks: 34, percent: 34 },
    { student: { userId: { name: 'Ivy Chen' }, rollNo: 'STU106', grade: '10' }, subject: 'Chemistry', marks: 28, percent: 28 },
    { student: { userId: { name: 'Frank Miller' }, rollNo: 'STU107', grade: '10' }, subject: 'Physics', marks: 30, percent: 30 },
  ],
  lowAttendance: [{ student: { userId: { name: 'Charlie Brown' } }, percent: 65 }, { student: { userId: { name: 'Ivy Chen' } }, percent: 58 }],
  allStudents: [
    { userId: { name: 'Alice Johnson' }, rollNo: 'STU101', grade: '10' },
    { userId: { name: 'Bob Smith' }, rollNo: 'STU102', grade: '10' },
    { userId: { name: 'Charlie Brown' }, rollNo: 'STU103', grade: '10' },
    { userId: { name: 'Diana Prince' }, rollNo: 'STU104', grade: '10' },
  ],
  assignments: [{ title: 'Calculus Homework', subject: 'Math', dueDate: '2026-06-01', grade: '10' }],
  timetable: [{ day: 'Monday', period: 1, subject: 'Math' }, { day: 'Wednesday', period: 3, subject: 'Math' }],
};

export default function TeacherDashboard() {
  const [data, setData] = useState(mockData);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    api.get('/teacher/dashboard').then(({ data }) => {
      if (data) setData(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

  const lowMarksAlert = data.weakStudents.filter(w => w.percent < 35);
  const lowAttAlert = data.lowAttendance.filter(a => a.percent < 75);

  return (
    <DashboardWrapper role="teacher" navItems={navItems}>
      {(section) => {
        const s = section;

        if (s === 'overview') return (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glow-card rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10" />
              <h1 className="text-4xl font-extrabold glow-text mb-2 relative">👩‍🏫 Teacher Dashboard</h1>
              <p className="text-slate-400 relative">{data.teacher?.name} • {data.teacher?.subject}</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '👥', label: 'Total Students', value: data.studentCount, color: 'from-purple-600/30 to-fuchsia-600/20', border: 'border-purple-500/40' },
                { icon: '📊', label: 'Class Average', value: '76%', color: 'from-emerald-600/30 to-teal-600/20', border: 'border-emerald-500/40' },
                { icon: '⚠️', label: 'Weak Students', value: lowMarksAlert.length, color: 'from-rose-600/30 to-pink-600/20', border: 'border-rose-500/40' },
                { icon: '📅', label: 'Low Attendance', value: lowAttAlert.length, color: 'from-amber-600/30 to-orange-600/20', border: 'border-amber-500/40' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -4 }} className={`rounded-2xl p-4 text-center border bg-gradient-to-br ${c.color} ${c.border} backdrop-blur-sm shadow-lg`}>
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{c.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{typeof c.value === 'number' ? <AnimatedCounter value={c.value} /> : c.value}</p>
                </motion.div>
              ))}
            </div>

            {/* LOW MARKS ALERT POPUP */}
            <AnimatePresence>
              {showAlert && (lowMarksAlert.length > 0 || lowAttAlert.length > 0) && (
                <motion.div initial={{ opacity: 0, y: -40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.9 }}
                  className="rounded-2xl p-6 border-2 border-rose-500/50 bg-rose-500/10 alert-pulse relative overflow-hidden">
                  <button onClick={() => setShowAlert(false)} className="absolute top-3 right-3 text-rose-300 hover:text-rose-200">&times;</button>
                  <h3 className="text-xl font-bold text-rose-300 mb-3 flex items-center gap-2">🚨 Immediate Attention Required</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lowMarksAlert.length > 0 && (
                      <div>
                        <p className="text-rose-200 font-semibold mb-2">📉 Low Marks (&lt;35%)</p>
                        {lowMarksAlert.map((w, i) => (
                          <motion.div key={i} initial={{ x: -20 }} animate={{ x: 0 }} transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 mb-1">
                            <span className="text-lg">⚠️</span>
                            <div className="flex-1"><p className="text-white text-sm font-medium">{w.student?.userId?.name || 'Student'}</p><p className="text-rose-200 text-xs">{w.subject}: {w.marks}/{w.total || 100} ({w.percent}%)</p></div>
                            <span className="text-rose-300 text-xs font-bold bg-rose-500/20 px-2 py-1 rounded-full">Alert</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {lowAttAlert.length > 0 && (
                      <div>
                        <p className="text-amber-200 font-semibold mb-2">📅 Low Attendance (&lt;75%)</p>
                        {lowAttAlert.map((a, i) => (
                          <motion.div key={i} initial={{ x: 20 }} animate={{ x: 0 }} transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-1">
                            <span className="text-lg">⚡</span>
                            <div className="flex-1"><p className="text-white text-sm font-medium">{a.student?.userId?.name || 'Student'}</p><p className="text-amber-200 text-xs">Attendance: {a.percent}%</p></div>
                            <span className="text-amber-300 text-xs font-bold bg-amber-500/20 px-2 py-1 rounded-full">Warning</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-300 text-sm font-semibold hover:bg-rose-500/30 transition-all">Send Parent Alert</button>
                    <button className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 text-sm font-semibold hover:bg-blue-500/30 transition-all">Schedule Meeting</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4">📈 Subject Averages</h3>
                <div className="space-y-3">
                  {data.subjectAverages.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">{s.subject}</span><span className="text-white font-bold">{s.average}%</span></div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${s.average}%` }} transition={{ delay: i * 0.1, duration: 1 }}
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCardContent></GlassCard>

              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4">🤖 AI Performance Insights</h3>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <p className="text-purple-300 text-sm font-semibold mb-2">📊 Trend Analysis</p>
                  <p className="text-slate-300 text-sm">Class performance is <span className="text-emerald-400 font-semibold">improving</span> overall. Mathematics shows a 5% increase this term.</p>
                  <div className="mt-3 space-y-1 text-sm text-slate-400">
                    <p>• <span className="text-rose-400">Focus needed</span>: Charlie Brown (34% Math)</p>
                    <p>• <span className="text-emerald-400">Top performer</span>: Grace Lee (93% avg)</p>
                    <p>• <span className="text-amber-400">Recommendation</span>: Extra tutorials for low scorers</p>
                  </div>
                </div>
              </GlassCardContent></GlassCard>
            </div>
          </div>
        );

        if (s === 'attendance') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text">📅 Attendance Management</h2>
            <GlassCard hoverable glow><GlassCardContent>
              <form className="space-y-4 max-w-lg" onSubmit={e => e.preventDefault()}>
                <input type="date" className="input-glass" />
                <select className="input-glass"><option>Select Class</option><option>10 - A</option><option>10 - B</option></select>
                <div className="space-y-2">
                  {data.allStudents.slice(0, 5).map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-white text-sm">{s.userId?.name || 'Student'}</span>
                      <div className="flex gap-3">
                        {['present', 'absent', 'leave'].map(st => (
                          <label key={st} className="flex items-center gap-1 cursor-pointer">
                            <input type="radio" name={`att-${i}`} value={st} className="accent-purple-500" />
                            <span className={`text-xs font-semibold ${st === 'present' ? 'text-emerald-400' : st === 'absent' ? 'text-rose-400' : 'text-amber-400'}`}>{st}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg">Save Attendance</motion.button>
              </form>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'marks') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text">📝 Marks Entry</h2>
            <GlassCard hoverable glow><GlassCardContent>
              <form className="space-y-4 max-w-lg" onSubmit={e => e.preventDefault()}>
                <select className="input-glass"><option>Select Subject</option><option>Math</option><option>Physics</option><option>Chemistry</option></select>
                <select className="input-glass"><option>Select Student</option>{data.allStudents.map((s, i) => <option key={i}>{s.userId?.name}</option>)}</select>
                <input type="number" placeholder="Marks Obtained" className="input-glass" />
                <input type="number" placeholder="Total Marks" value="100" className="input-glass" />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg">Save Marks</motion.button>
              </form>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'weak') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text">⚠️ Weak Students (&lt;35%)</h2>
            {lowMarksAlert.length === 0 ? (
              <div className="p-8 text-center text-emerald-400 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
                🎉 No weak students detected!
              </div>
            ) : (
              <div className="space-y-3">
                {lowMarksAlert.map((w, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="p-5 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40">
                    <div className="flex items-start gap-3">
                      <motion.span animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-2xl">⚠️</motion.span>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{w.student?.userId?.name || 'Student'}</h4>
                        <p className="text-rose-200 text-sm">Subject: {w.subject} • Score: {w.marks}/{w.total || 100} ({w.percent}%)</p>
                        <div className="w-full bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${w.percent}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500" />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30">Send Warning</button>
                      <button className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-semibold hover:bg-blue-500/30">Counseling</button>
                      <button className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/30">Call Parent</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

        if (s === 'alerts') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text">🚨 Alerts Center</h2>
            <div className="space-y-3">
              {[...lowMarksAlert.map(w => ({ ...w, type: 'marks' })), ...lowAttAlert.map(a => ({ ...a, type: 'attendance' }))].map((alert, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className={`p-5 rounded-2xl border ${alert.type === 'marks' ? 'bg-rose-500/10 border-rose-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{alert.type === 'marks' ? '⚠️' : '⚡'}</span>
                    <div className="flex-1">
                      <p className="font-bold text-white">{alert.student?.userId?.name || 'Student'}</p>
                      <p className="text-white/60 text-sm">{alert.type === 'marks' ? `${alert.subject}: ${alert.marks}/${alert.total || 100} (${alert.percent}%)` : `Attendance: ${alert.percent}%`}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold">Alert Parent</button>
                    <button className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-semibold">Schedule Meeting</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

        if (s === 'assignments') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text">📚 Assignment Management</h2>
            <GlassCard hoverable glow><GlassCardContent>
              <form className="space-y-4 max-w-lg" onSubmit={e => e.preventDefault()}>
                <input placeholder="Assignment Title" className="input-glass" />
                <textarea placeholder="Description" className="input-glass h-24 resize-none" />
                <select className="input-glass"><option>Select Subject</option><option>Math</option><option>Physics</option></select>
                <input type="date" className="input-glass" />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg">Create Assignment</motion.button>
              </form>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'analytics') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text">📈 Student Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4">Class Performance</h3>
                <div className="space-y-3">
                  {data.subjectAverages.map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">{s.subject}</span><span className="text-white font-bold">{s.average}%</span></div>
                      <div className="w-full bg-white/10 rounded-full h-2"><motion.div initial={{ width: 0 }} animate={{ width: `${s.average}%` }} transition={{ delay: i * 0.1, duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" /></div>
                    </div>
                  ))}
                </div>
              </GlassCardContent></GlassCard>
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4">🏆 Top Performers</h3>
                <div className="space-y-2">
                  {['Grace Lee', 'Alice Johnson', 'Diana Prince'].map((n, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-white font-medium text-sm">{['🥇', '🥈', '🥉'][i]} {n}</span>
                      <span className="text-emerald-300 text-xs font-bold">{93 - i * 5}%</span>
                    </div>
                  ))}
                </div>
              </GlassCardContent></GlassCard>
            </div>
          </div>
        );

        if (s === 'timetable') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text">⏰ My Timetable</h2>
            <GlassCard hoverable glow><GlassCardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10 text-slate-500 uppercase text-xs tracking-wider">
                    <th className="p-3 text-left">Day</th><th className="p-3 text-left">Period</th><th className="p-3 text-left">Subject</th>
                  </tr></thead>
                  <tbody>
                    {data.timetable.map((t, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5"><td className="p-3 text-white">{t.day}</td><td className="p-3 text-slate-400">Period {t.period}</td><td className="p-3 text-white font-medium">{t.subject}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'quizzes') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text">❓ Quiz Management</h2>
            <GlassCard hoverable glow><GlassCardContent>
              <form className="space-y-4 max-w-lg" onSubmit={e => e.preventDefault()}>
                <input placeholder="Quiz Title" className="input-glass" />
                <select className="input-glass"><option>Select Subject</option><option>Math</option><option>Physics</option></select>
                <textarea placeholder="Questions (one per line)" className="input-glass h-32 resize-none" />
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg">Create Quiz</motion.button>
              </form>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'chat') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text">💬 Messages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard><GlassCardContent>
                <h3 className="text-white font-semibold mb-3">Contacts</h3>
                <div className="space-y-1">
                  {['Alice Johnson', 'Bob Smith', 'Diana Prince', 'Dr. James (Principal)'].map((n, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">{n[0]}</div>
                      <span className="text-white text-sm">{n}</span>
                    </div>
                  ))}
                </div>
              </GlassCardContent></GlassCard>
              <div className="md:col-span-2">
                <GlassCard><GlassCardContent>
                  <div className="h-64 overflow-y-auto space-y-3 mb-3">
                    {[{ from: 'Alice Johnson', text: 'Good morning, ma\'am! Could you explain the calculus problem?', time: '10:30 AM' }].map((m, i) => (
                      <div key={i} className="flex justify-start"><div className="max-w-[75%] p-3 rounded-2xl bg-white/10 text-slate-200 text-sm rounded-bl-md"><p className="text-[10px] font-semibold text-purple-300 mb-1">{m.from}</p>{m.text}</div></div>
                    ))}
                  </div>
                  <div className="flex gap-2"><input placeholder="Type a message..." className="input-glass flex-1" /><button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">➤</button></div>
                </GlassCardContent></GlassCard>
              </div>
            </div>
          </div>
        );

        if (s === 'students') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text">👥 Student Directory</h2>
            <GlassCard hoverable glow><GlassCardContent>
              <input placeholder="🔍 Search by name or roll number..." className="input-glass mb-4" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10 text-slate-500 uppercase text-xs tracking-wider">
                    <th className="p-3 text-left">Name</th><th className="p-3 text-left">Roll</th><th className="p-3 text-left">Class</th><th className="p-3 text-left">Status</th>
                  </tr></thead>
                  <tbody>
                    {data.allStudents.map((s, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-3 text-white font-medium">{s.userId?.name || 'Student'}</td>
                        <td className="p-3 text-slate-400">{s.rollNo}</td>
                        <td className="p-3 text-slate-400">Class {s.grade}</td>
                        <td className="p-3"><StatusBadge status="present">Active</StatusBadge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'reports') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text">📄 Reports & Exports</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Class Report', desc: 'Overall class performance summary', icon: '📊' },
                { title: 'Attendance Report', desc: 'Monthly attendance sheet', icon: '📅' },
                { title: 'Marks Sheet', desc: 'Subject-wise marks export', icon: '📝' },
              ].map((r, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03, y: -4 }} className="rounded-2xl p-5 border bg-white/5 border-white/10 cursor-pointer text-center">
                  <div className="text-4xl mb-3">{r.icon}</div>
                  <h4 className="font-bold text-white">{r.title}</h4>
                  <p className="text-slate-400 text-sm mb-3">{r.desc}</p>
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold">📄 Export PDF</button>
                </motion.div>
              ))}
            </div>
          </div>
        );

        return <div className="text-slate-400 text-center py-12">Section coming soon</div>;
      }}
    </DashboardWrapper>
  );
}
