import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import DashboardWrapper from '../components/dashboard/shared/DashboardWrapper';
import GlassCard from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import StatusBadge from '../components/ui/StatusBadge';
import StudentAssignments from '../components/dashboard/student/StudentAssignments';
import StudentExams from '../components/dashboard/student/StudentExams';
import StudentFees from '../components/dashboard/student/StudentFees';
import api from '../services/api';
import { FiTrendingUp, FiCalendar, FiBookOpen, FiAward, FiSend, FiPaperclip } from 'react-icons/fi';

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

const navItems = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'attendance', icon: '📅', label: 'Attendance' },
  { id: 'fees', icon: '💰', label: 'Fee Status' },
  { id: 'results', icon: '📝', label: 'Exam Results' },
  { id: 'exams', icon: '📝', label: 'Exams' },
  { id: 'assignments', icon: '📚', label: 'Assignments' },
  { id: 'timetable', icon: '⏰', label: 'Timetable' },
  { id: 'events', icon: '🎉', label: 'Events' },
  { id: 'achievements', icon: '🏆', label: 'Achievements' },
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
    { title: 'CS Project', subject: 'CS', dueDate: '2026-06-10', status: 'pending' },
  ],
  timetable: [
    { day: 'Monday', periods: ['Math', 'Physics', 'Chemistry', 'Lunch', 'CS', 'English'] },
    { day: 'Tuesday', periods: ['Physics', 'Math', 'English', 'Lunch', 'Chemistry', 'CS'] },
    { day: 'Wednesday', periods: ['Chemistry', 'CS', 'Math', 'Lunch', 'English', 'Physics'] },
    { day: 'Thursday', periods: ['English', 'Chemistry', 'Physics', 'Lunch', 'Math', 'CS'] },
    { day: 'Friday', periods: ['CS', 'English', 'Math', 'Lunch', 'Physics', 'Chemistry'] },
  ],
  achievements: [
    { title: 'Math Olympiad Winner', icon: '🏆', desc: 'First place in math competition' },
    { title: 'Perfect Attendance', icon: '🎯', desc: '100% attendance for a month' },
  ],
  leaderboard: [
    { name: 'Grace Lee', score: 93 }, { name: 'Alice Johnson', score: 85 },
    { name: 'Diana Prince', score: 82 }, { name: 'Bob Smith', score: 72 },
  ],
};

const CHART_THEME = {
  axis: { stroke: 'rgba(255,255,255,0.1)', fontSize: 11 },
  grid: { stroke: 'rgba(255,255,255,0.04)' },
  tooltip: {
    contentStyle: { background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: 'rgba(255,255,255,0.6)' },
  },
};

export default function StudentDashboard() {
  const [data, setData] = useState(mockStudent);
  useEffect(() => {
    api.get('/student/dashboard').then(({ data }) => {
      if (data) setData(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

  const gpaData = [
    { name: 'Sem 1', gpa: 3.2 }, { name: 'Sem 2', gpa: 3.5 },
    { name: 'Sem 3', gpa: 3.8 }, { name: 'Sem 4', gpa: 3.6 },
    { name: 'Sem 5', gpa: 3.9 },
  ];

  const marksChartData = data.marks.map(m => ({
    subject: m.subject,
    score: m.marksObtained,
    fill: COLORS[data.marks.indexOf(m) % COLORS.length],
  }));

  const attendanceWeekly = [
    { day: 'Mon', pct: 85 }, { day: 'Tue', pct: 92 },
    { day: 'Wed', pct: 78 }, { day: 'Thu', pct: 95 },
    { day: 'Fri', pct: 88 }, { day: 'Sat', pct: 70 },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  const renderSection = (s) => {
    if (s === 'overview') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text-blue">Student Dashboard</h1>
            <p className="text-white/40 text-sm mt-0.5">{data.name} • Roll: {data.rollNo} • Class {data.grade}-{data.section}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            <FiCalendar className="w-3.5 h-3.5 text-white/30" />
            <span className="text-xs text-white/40">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: '📅', label: 'Attendance', value: `${data.attendancePercent}%`, color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30' },
            { icon: '📊', label: 'Average Marks', value: `${data.avgMarks}%`, color: 'from-purple-500/20 to-pink-500/10', border: 'border-purple-500/30' },
            { icon: '📚', label: 'Assignments', value: data.assignments.length, color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
            { icon: '🏆', label: 'Achievements', value: data.achievements.length, color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
          ].map((c, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`rounded-xl p-4 border bg-gradient-to-br ${c.color} ${c.border}`}
            >
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">{c.label}</p>
              <p className="text-2xl font-bold text-white mt-1">
                {typeof c.value === 'number' ? <AnimatedCounter value={c.value} /> : c.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2"><FiTrendingUp className="w-4 h-4 text-blue-400" /> GPA Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpaData}>
                  <defs>
                    <linearGradient id="gpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray="3 3" />
                  <XAxis dataKey="name" {...CHART_THEME.axis} />
                  <YAxis domain={[0, 4]} {...CHART_THEME.axis} />
                  <Tooltip {...CHART_THEME.tooltip} />
                  <Area type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={2} fill="url(#gpaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2"><FiAward className="w-4 h-4 text-amber-400" /> Leaderboard</h3>
            <div className="space-y-2">
              {data.leaderboard.map((l, i) => (
                <motion.div
                  key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-lg border ${i === 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/[0.03] border-white/[0.06]'}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{['🥇', '🥈', '🥉', '4️⃣'][i]}</span>
                    <span className="text-sm font-medium text-white">{l.name}</span>
                  </span>
                  <span className="text-sm font-bold text-white/70">{l.score}%</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2"><FiCalendar className="w-4 h-4 text-blue-400" /> Attendance</h3>
            <div className="flex justify-center py-2"><ProgressRing percent={data.attendancePercent} color="#3b82f6" size={120} strokeWidth={12} /></div>
            {data.attendancePercent < 75 && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <p className="text-rose-300 text-xs font-medium text-center">⚠ Below 75% minimum</p>
              </div>
            )}
          </GlassCard>

          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">💰 Fee Status</h3>
            {data.fees.map((f, i) => (
              <div key={i} className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Amount</span>
                  <span className="text-white font-semibold">₹{f.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Paid</span>
                  <span className="text-emerald-400 font-semibold">₹{f.paidAmount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(f.paidAmount / f.amount) * 100}%` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <StatusBadge status={f.status}>{f.status}</StatusBadge>
                  {f.status !== 'paid' && (
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >Pay Now →</motion.button>
                  )}
                </div>
              </div>
            ))}
          </GlassCard>

          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">🤖 AI Study Recommendation</h3>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-300 text-xs font-medium mb-2">Based on your performance:</p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-xs text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Focus on <span className="text-amber-300 font-medium">Chemistry</span> (78%)
                </li>
                <li className="flex items-center gap-2 text-xs text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Practice more <span className="text-amber-300 font-medium">Physics</span> numericals
                </li>
                <li className="flex items-center gap-2 text-xs text-white/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  You're excelling in <span className="text-emerald-300 font-medium">CS</span> 🎉
                </li>
              </ul>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    );

    if (s === 'attendance') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-blue"><FiCalendar className="inline w-5 h-5 mr-2" />Attendance Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Weekly Overview</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceWeekly}>
                  <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray="3 3" />
                  <XAxis dataKey="day" {...CHART_THEME.axis} />
                  <YAxis domain={[0, 100]} {...CHART_THEME.axis} />
                  <Tooltip {...CHART_THEME.tooltip} />
                  <Bar dataKey="pct" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {attendanceWeekly.map((_, i) => (
                      <Cell key={i} fill={[3, 4].includes(i) ? '#3b82f6' : '#06b6d4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Monthly Summary</h3>
            <div className="flex flex-col items-center justify-center py-6">
              <ProgressRing percent={data.attendancePercent} color="#3b82f6" size={160} strokeWidth={14} />
              <p className="text-white/50 text-sm mt-3">Overall Attendance</p>
            </div>
          </GlassCard>
        </div>
        {data.attendancePercent < 75 && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <p className="text-rose-300 font-semibold">⚠ Attendance Warning — Below 75% minimum</p>
            <p className="text-rose-200/60 text-sm mt-0.5">Please attend classes regularly to meet the requirement.</p>
          </div>
        )}
      </motion.div>
    );

    if (s === 'fees') return <StudentFees />;

    if (s === 'results') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-blue">📝 Exam Results</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Subject Scores</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marksChartData} layout="vertical">
                  <CartesianGrid stroke={CHART_THEME.grid.stroke} strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} {...CHART_THEME.axis} />
                  <YAxis type="category" dataKey="subject" {...CHART_THEME.axis} width={70} />
                  <Tooltip {...CHART_THEME.tooltip} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {marksChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Grade Distribution</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.marks.map(m => ({ name: m.subject, value: m.marksObtained }))}
                    cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    paddingAngle={3} dataKey="value"
                  >
                    {data.marks.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip {...CHART_THEME.tooltip} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {data.marks.map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[11px] text-white/50">{m.subject}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
          {data.marks.map((m, i) => (
            <div key={i} className="rounded-xl p-3.5 text-center bg-white/[0.03] border border-white/[0.06]">
              <p className="text-white/50 text-[11px] font-medium mb-1">{m.subject}</p>
              <p className="text-2xl font-bold" style={{ color: COLORS[i] }}>{m.marksObtained}</p>
              <p className="text-white/30 text-[10px]">/ {m.totalMarks}</p>
              <div className="mt-1.5">
                <StatusBadge status={m.marksObtained >= 75 ? 'high' : m.marksObtained >= 50 ? 'medium' : 'low'}>{m.grade}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );

    if (s === 'exams') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <StudentExams />
      </motion.div>
    );

    if (s === 'assignments') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <StudentAssignments />
      </motion.div>
    );

    if (s === 'timetable') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-blue">⏰ Timetable</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {data.timetable.map((day, i) => (
            <div key={i} className="rounded-xl border bg-white/[0.03] border-white/[0.06] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/10 px-3 py-2.5 text-center border-b border-white/[0.06]">
                <p className="font-semibold text-white text-xs">{day.day}</p>
              </div>
              <div className="p-2 space-y-1">
                {day.periods.map((sub, j) => (
                  <div
                    key={j}
                    className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium text-center border
                      ${sub === 'Lunch'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                        : 'bg-white/[0.03] border-white/[0.06] text-white/60'
                      }`}
                    style={sub !== 'Lunch' ? { borderLeftColor: COLORS[j % 5], borderLeftWidth: 2.5 } : {}}
                  >
                    {j + 1}. {sub}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );

    if (s === 'events') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-blue">🎉 Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: 'Science Fair', date: '2026-06-10', type: 'academic', desc: 'Annual science exhibition' },
            { title: 'Sports Day', date: '2026-06-20', type: 'sports', desc: 'Inter-house sports competition' },
            { title: 'Cultural Fest', date: '2026-07-05', type: 'cultural', desc: 'Annual cultural festival' },
            { title: 'Workshop: AI Basics', date: '2026-06-15', type: 'academic', desc: 'Intro to AI workshop' },
          ].map((e, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-xl p-4 border bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{e.type === 'academic' ? '📚' : e.type === 'sports' ? '🏆' : '🎭'}</span>
                <div>
                  <h4 className="font-medium text-white text-sm">{e.title}</h4>
                  <p className="text-white/40 text-xs">{e.desc}</p>
                  <p className="text-white/30 text-[11px] mt-0.5">{e.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );

    if (s === 'achievements') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-blue">🏆 Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { title: 'Math Olympiad Winner', icon: '🏆', desc: 'First place' },
            { title: 'Perfect Attendance', icon: '🎯', desc: '100% attendance' },
            { title: 'Star Performer', icon: '⭐', desc: 'Top scorer in CS' },
            { title: 'Science Fair Winner', icon: '🔬', desc: 'Best project' },
          ].map((b, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 150 }}
              className="rounded-xl p-5 text-center border bg-white/[0.03] border-white/[0.06] hover:border-accent-500/30 transition-all"
            >
              <div className="text-3xl mb-2">{b.icon}</div>
              <p className="font-medium text-white text-xs">{b.title}</p>
              <p className="text-white/30 text-[10px] mt-0.5">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );

    return null;
  };

  return (
    <DashboardWrapper role="student" navItems={navItems}>
      {(section) => renderSection(section)}
    </DashboardWrapper>
  );
}
