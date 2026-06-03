import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import DashboardWrapper from '../components/dashboard/shared/DashboardWrapper';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import StatusBadge from '../components/ui/StatusBadge';
import TeacherAssignments from '../components/dashboard/teacher/TeacherAssignments';
import TeacherExams from '../components/dashboard/teacher/TeacherExams';
import api from '../services/api';
import { FiUsers, FiTrendingUp, FiAlertTriangle, FiCalendar } from 'react-icons/fi';

const COLORS = ['#a855f7', '#ec4899', '#3b82f6', '#06b6d4', '#f59e0b'];

const navItems = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'attendance', icon: '📅', label: 'Attendance' },
  { id: 'marks', icon: '📝', label: 'Marks Entry' },
  { id: 'exams', icon: '📝', label: 'Exams' },
  { id: 'assignments', icon: '📚', label: 'Assignments' },
  { id: 'analytics', icon: '📈', label: 'Analytics' },
  { id: 'weak', icon: '⚠️', label: 'Weak Students' },
  { id: 'timetable', icon: '⏰', label: 'Timetable' },
  { id: 'students', icon: '👥', label: 'Students' },
  { id: 'reports', icon: '📄', label: 'Reports' },
];

const mockData = {
  teacher: { name: 'Dr. Sarah Wilson', subject: 'Mathematics' },
  studentCount: 45,
  subjectAverages: [
    { subject: 'Math', average: 78 }, { subject: 'Physics', average: 72 },
    { subject: 'Chemistry', average: 68 }, { subject: 'CS', average: 82 }, { subject: 'English', average: 75 },
  ],
  weakStudents: [
    { student: { userId: { name: 'Charlie Brown' }, rollNo: 'STU103', grade: '10' }, subject: 'Math', marks: 34, total: 100, percent: 34 },
    { student: { userId: { name: 'Ivy Chen' }, rollNo: 'STU106', grade: '10' }, subject: 'Chemistry', marks: 28, total: 100, percent: 28 },
    { student: { userId: { name: 'Frank Miller' }, rollNo: 'STU107', grade: '10' }, subject: 'Physics', marks: 30, total: 100, percent: 30 },
  ],
  lowAttendance: [
    { student: { userId: { name: 'Charlie Brown' } }, percent: 65 },
    { student: { userId: { name: 'Ivy Chen' } }, percent: 58 },
  ],
  allStudents: [
    { userId: { name: 'Alice Johnson' }, rollNo: 'STU101', grade: '10' },
    { userId: { name: 'Bob Smith' }, rollNo: 'STU102', grade: '10' },
    { userId: { name: 'Charlie Brown' }, rollNo: 'STU103', grade: '10' },
    { userId: { name: 'Diana Prince' }, rollNo: 'STU104', grade: '10' },
    { userId: { name: 'Grace Lee' }, rollNo: 'STU105', grade: '10' },
  ],
  assignments: [{ title: 'Calculus Homework', subject: 'Math', dueDate: '2026-06-01', grade: '10' }],
  timetable: [
    { day: 'Monday', period: 1, subject: 'Math' },
    { day: 'Wednesday', period: 3, subject: 'Math' },
    { day: 'Friday', period: 2, subject: 'Math' },
  ],
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const chartTheme = {
  axis: { stroke: 'rgba(255,255,255,0.1)', fontSize: 11 },
  grid: { stroke: 'rgba(255,255,255,0.04)' },
  tooltip: {
    contentStyle: { background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: 'rgba(255,255,255,0.6)' },
  },
};

export default function TeacherDashboard() {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    api.get('/teacher/dashboard').then(({ data }) => {
      if (data) setData(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

  const lowMarksAlert = data.weakStudents.filter(w => w.percent < 35);
  const lowAttAlert = data.lowAttendance.filter(a => a.percent < 75);

  const renderSection = (s) => {
    if (s === 'overview') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Teacher Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">{data.teacher?.name} • {data.teacher?.subject}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: '👥', label: 'Total Students', value: data.studentCount, color: 'from-purple-500/20 to-pink-500/10', border: 'border-purple-500/30' },
            { icon: '📊', label: 'Class Average', value: '76%', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
            { icon: '⚠️', label: 'Weak Students', value: lowMarksAlert.length, color: 'from-rose-500/20 to-pink-500/10', border: 'border-rose-500/30' },
            { icon: '📅', label: 'Low Attendance', value: lowAttAlert.length, color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
          ].map((c, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`rounded-xl p-4 border bg-gradient-to-br ${c.color} ${c.border}`}
            >
              <div className="text-lg mb-1">{c.icon}</div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">{c.label}</p>
              <p className="text-2xl font-bold text-white mt-0.5">
                {typeof c.value === 'number' ? <AnimatedCounter value={c.value} /> : c.value}
              </p>
            </motion.div>
          ))}
        </div>

        {lowMarksAlert.length > 0 && (
          <div className="rounded-xl p-4 border bg-rose-500/10 border-rose-500/25">
            <h3 className="text-sm font-semibold text-rose-300 mb-3 flex items-center gap-2"><FiAlertTriangle className="w-4 h-4" /> Immediate Attention Required</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lowMarksAlert.map((w, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <span className="text-lg">⚠️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{w.student?.userId?.name || 'Student'}</p>
                    <p className="text-rose-200/70 text-xs">{w.subject}: {w.marks}/{w.total} ({w.percent}%)</p>
                  </div>
                  <StatusBadge status="critical">Alert</StatusBadge>
                </div>
              ))}
              {lowAttAlert.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <span className="text-lg">⚡</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{a.student?.userId?.name || 'Student'}</p>
                    <p className="text-amber-200/70 text-xs">Attendance: {a.percent}%</p>
                  </div>
                  <StatusBadge status="warning">Warning</StatusBadge>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition-all">Send Parent Alert</button>
              <button className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-semibold hover:bg-blue-500/30 transition-all">Schedule Meeting</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2"><FiTrendingUp className="w-4 h-4 text-purple-400" /> Subject Averages</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.subjectAverages} layout="vertical">
                  <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} {...chartTheme.axis} />
                  <YAxis type="category" dataKey="subject" {...chartTheme.axis} width={70} />
                  <Tooltip {...chartTheme.tooltip} />
                  <Bar dataKey="average" radius={[0, 4, 4, 0]}>
                    {data.subjectAverages.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">🤖 AI Performance Insights</h3>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 h-full">
              <p className="text-purple-300 text-xs font-semibold mb-2">📊 Trend Analysis</p>
              <p className="text-white/60 text-sm">Class performance is <span className="text-emerald-400 font-medium">improving</span> overall. Mathematics shows a 5% increase this term.</p>
              <div className="mt-3 space-y-1.5 text-sm text-white/50">
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> <span className="text-rose-300">Focus needed</span>: Charlie Brown (34% Math)</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> <span className="text-emerald-300">Top performer</span>: Grace Lee (93% avg)</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> <span className="text-amber-300">Recommendation</span>: Extra tutorials for low scorers</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    );

    if (s === 'attendance') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text"><FiCalendar className="inline w-5 h-5 mr-2" />Attendance Management</h2>
        <GlassCard>
          <form className="space-y-4 max-w-lg" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" className="input-glass" />
              <select className="input-glass"><option>Class 10 - A</option><option>Class 10 - B</option></select>
            </div>
            <div className="space-y-2">
              {data.allStudents.slice(0, 5).map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-sm text-white">{s.userId?.name || 'Student'}</span>
                  <div className="flex gap-3">
                    {['present', 'absent', 'leave'].map(st => (
                      <label key={st} className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name={`att-${i}`} value={st} className="accent-purple-500" />
                        <span className={`text-[11px] font-semibold ${st === 'present' ? 'text-emerald-400' : st === 'absent' ? 'text-rose-400' : 'text-amber-400'}`}>{st}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" className="btn-primary w-full">Save Attendance</button>
          </form>
        </GlassCard>
      </motion.div>
    );

    if (s === 'marks') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text">📝 Marks Entry</h2>
        <GlassCard>
          <form className="space-y-4 max-w-lg" onSubmit={e => e.preventDefault()}>
            <select className="input-glass"><option>Math</option><option>Physics</option><option>Chemistry</option></select>
            <select className="input-glass">{data.allStudents.map((s, i) => <option key={i}>{s.userId?.name}</option>)}</select>
            <input type="number" placeholder="Marks Obtained" className="input-glass" />
            <input type="number" placeholder="Total Marks" value="100" className="input-glass" />
            <button type="submit" className="btn-primary w-full">Save Marks</button>
          </form>
        </GlassCard>
      </motion.div>
    );

    if (s === 'weak') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text">⚠️ Weak Students (&lt;35%)</h2>
        {lowMarksAlert.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-400 font-medium">🎉 No weak students detected!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lowMarksAlert.map((w, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">⚠️</span>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm">{w.student?.userId?.name || 'Student'}</h4>
                    <p className="text-rose-200/70 text-xs">{w.subject} • Score: {w.marks}/{w.total} ({w.percent}%)</p>
                    <div className="h-1.5 bg-white/[0.08] rounded-full mt-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${w.percent}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30">Send Warning</button>
                  <button className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-semibold hover:bg-blue-500/30">Counseling</button>
                  <button className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold hover:bg-amber-500/30">Call Parent</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );

    if (s === 'exams') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <TeacherExams />
      </motion.div>
    );

    if (s === 'assignments') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <TeacherAssignments />
      </motion.div>
    );

    if (s === 'analytics') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text">📈 Student Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Class Performance</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.subjectAverages}>
                  <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray="3 3" />
                  <XAxis dataKey="subject" {...chartTheme.axis} />
                  <YAxis domain={[0, 100]} {...chartTheme.axis} />
                  <Tooltip {...chartTheme.tooltip} />
                  <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                    {data.subjectAverages.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4">🏆 Top Performers</h3>
            <div className="space-y-2">
              {['Grace Lee', 'Alice Johnson', 'Diana Prince'].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-sm font-medium text-white flex items-center gap-2">
                    <span>{['🥇', '🥈', '🥉'][i]}</span> {n}
                  </span>
                  <span className="text-xs font-bold text-emerald-300">{93 - i * 5}%</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </motion.div>
    );

    if (s === 'timetable') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text">⏰ My Timetable</h2>
        <GlassCard>
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Day</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Period</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Subject</th>
                </tr>
              </thead>
              <tbody>
                {data.timetable.map((t, i) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white font-medium">{t.day}</td>
                    <td className="px-5 py-3 text-white/50">Period {t.period}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded bg-accent-500/10 text-accent-300 text-xs font-medium">{t.subject}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    );

    if (s === 'students') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text">👥 Student Directory</h2>
        <GlassCard>
          <input placeholder="Search by name or roll number..." className="input-glass mb-4" />
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Name</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Roll</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Class</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.allStudents.map((s, i) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white font-medium">{s.userId?.name || 'Student'}</td>
                    <td className="px-5 py-3 text-white/50">{s.rollNo}</td>
                    <td className="px-5 py-3 text-white/50">Class {s.grade}</td>
                    <td className="px-5 py-3"><StatusBadge status="active">Active</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    );

    if (s === 'reports') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text">📄 Reports & Exports</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: 'Class Report', desc: 'Overall class performance', icon: '📊' },
            { title: 'Attendance Report', desc: 'Monthly attendance sheet', icon: '📅' },
            { title: 'Marks Sheet', desc: 'Subject-wise marks export', icon: '📝' },
          ].map((r, i) => (
            <motion.div key={i} whileHover={{ y: -2 }} className="rounded-xl p-5 text-center border bg-white/[0.03] border-white/[0.06] hover:border-accent-500/30 transition-all cursor-pointer">
              <div className="text-3xl mb-2">{r.icon}</div>
              <h4 className="font-medium text-white text-sm">{r.title}</h4>
              <p className="text-white/40 text-xs mb-3">{r.desc}</p>
              <button className="px-4 py-2 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-semibold hover:bg-accent-500/20 transition-all">Export PDF</button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );

    return null;
  };

  return (
    <DashboardWrapper role="teacher" navItems={navItems}>
      {(section) => renderSection(section)}
    </DashboardWrapper>
  );
}
