import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import DashboardWrapper from '../components/dashboard/shared/DashboardWrapper';
import GlassCard from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import StatusBadge from '../components/ui/StatusBadge';
import api from '../services/api';
import {
  FiCalendar, FiTrendingUp, FiBookOpen, FiAlertTriangle,
  FiClock, FiUser, FiDollarSign, FiUsers,
} from 'react-icons/fi';

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

const navItems = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'attendance', icon: '📅', label: 'Attendance' },
  { id: 'marks', icon: '📝', label: 'Marks & Results' },
  { id: 'fees', icon: '💰', label: 'Fee Status' },
  { id: 'timetable', icon: '⏰', label: 'Timetable' },
  { id: 'disciplinary', icon: '⚠️', label: 'Disciplinary' },
  { id: 'announcements', icon: '📢', label: 'Announcements' },
];

const chartTheme = {
  axis: { stroke: 'rgba(255,255,255,0.1)', fontSize: 11 },
  grid: { stroke: 'rgba(255,255,255,0.04)' },
  tooltip: {
    contentStyle: { background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: 'rgba(255,255,255,0.6)' },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ParentDashboard() {
  const [data, setData] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const { data: res } = await api.get('/parent/dashboard');
      setData(res);
      if (res.children?.length > 0) setSelectedChild(res.children[0]);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const child = selectedChild;
  const gpaData = [
    { name: 'Sem 1', gpa: 3.2 }, { name: 'Sem 2', gpa: 3.5 },
    { name: 'Sem 3', gpa: 3.8 }, { name: 'Sem 4', gpa: 3.6 },
    { name: 'Sem 5', gpa: 3.9 },
  ];
  const attendanceWeekly = [
    { day: 'Mon', pct: 85 }, { day: 'Tue', pct: 92 },
    { day: 'Wed', pct: 78 }, { day: 'Thu', pct: 95 },
    { day: 'Fri', pct: 88 }, { day: 'Sat', pct: 70 },
  ];

  const renderSection = (s) => {
    if (!child) {
      if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" /></div>;
      return (
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="flex flex-col items-center py-20 text-white/30">
          <FiUsers className="w-10 h-10 mb-3" />
          <p className="text-sm">No linked students found</p>
        </motion.div>
      );
    }

    if (s === 'overview') return renderOverview();
    if (s === 'attendance') return renderAttendance();
    if (s === 'marks') return renderMarks();
    if (s === 'fees') return renderFees();
    if (s === 'timetable') return renderTimetable();
    if (s === 'disciplinary') return renderDisciplinary();
    if (s === 'announcements') return renderAnnouncements();
    return null;
  };

  function renderOverview() {
    const children = data?.children || [];
    return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Parent Dashboard</h1>
            <p className="text-white/40 text-sm mt-0.5">
              {children.length > 1 ? `${children.length} children enrolled` : child.student.name}
            </p>
          </div>
        </div>

        {/* Child selector */}
        {children.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {children.map((c) => (
              <button
                key={c.student._id}
                onClick={() => setSelectedChild(c)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedChild?.student._id === c.student._id
                    ? 'bg-accent-500/15 border-accent-500/30 text-accent-300'
                    : 'bg-white/[0.04] border-white/[0.06] text-white/40 hover:text-white/60'
                }`}
              >
                {c.student.name} · Class {c.student.grade}-{c.student.section}
              </button>
            ))}
          </div>
        )}

        {/* Student info */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {child.student.name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{child.student.name}</p>
            <p className="text-xs text-white/40">Roll: {child.student.rollNo} · Class {child.student.grade}-{child.student.section}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: '📅', label: 'Attendance', value: `${child.attendance.percent}%`, color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30' },
            { icon: '📊', label: 'Average Marks', value: `${child.avgMarks}%`, color: 'from-purple-500/20 to-pink-500/10', border: 'border-purple-500/30' },
            { icon: '💰', label: 'Fees', value: child.fees.length > 0 ? child.fees.filter(f => f.status === 'paid').length + '/' + child.fees.length : '0', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
            { icon: '⚠️', label: 'Disciplinary', value: child.disciplinary.length, color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
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
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4 text-blue-400" /> Academic Progress
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpaData}>
                  <defs>
                    <linearGradient id="parentGpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray="3 3" />
                  <XAxis dataKey="name" {...chartTheme.axis} />
                  <YAxis domain={[0, 4]} {...chartTheme.axis} />
                  <Tooltip {...chartTheme.tooltip} />
                  <Area type="monotone" dataKey="gpa" stroke="#3b82f6" strokeWidth={2} fill="url(#parentGpaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
              <FiCalendar className="w-4 h-4 text-blue-400" /> Attendance
            </h3>
            <div className="flex justify-center py-2">
              <ProgressRing percent={child.attendance.percent} color="#3b82f6" size={120} strokeWidth={12} />
            </div>
            {child.attendanceWarning && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <p className="text-rose-300 text-xs font-medium text-center">⚠ Below 75% minimum attendance</p>
              </div>
            )}
          </GlassCard>
        </div>
      </motion.div>
    );
  }

  function renderAttendance() {
    return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text"><FiCalendar className="inline w-5 h-5 mr-2" />Attendance</h2>
        <div className="flex items-center gap-3 mb-2 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <FiUser className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-white font-medium">{child.student.name}</span>
          <span className="text-xs text-white/40">Class {child.student.grade}-{child.student.section}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Weekly Overview</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceWeekly}>
                  <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray="3 3" />
                  <XAxis dataKey="day" {...chartTheme.axis} />
                  <YAxis domain={[0, 100]} {...chartTheme.axis} />
                  <Tooltip {...chartTheme.tooltip} />
                  <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                    {attendanceWeekly.map((_, i) => (
                      <Cell key={i} fill={[3, 4].includes(i) ? '#3b82f6' : '#06b6d4'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Overall Summary</h3>
            <div className="flex flex-col items-center justify-center py-6">
              <ProgressRing percent={child.attendance.percent} color="#3b82f6" size={160} strokeWidth={14} />
              <p className="text-white/50 text-sm mt-3">
                {child.attendance.present} / {child.attendance.total} days present
              </p>
            </div>
          </GlassCard>
        </div>
        {child.attendanceWarning && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
            <p className="text-rose-300 font-semibold">⚠ Attendance Warning — Below 75%</p>
          </div>
        )}
      </motion.div>
    );
  }

  function renderMarks() {
    const marksChartData = child.marks.map((m) => ({
      subject: m.subject, score: m.marksObtained,
      fill: COLORS[child.marks.indexOf(m) % COLORS.length],
    }));
    return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text"><FiBookOpen className="inline w-5 h-5 mr-2" />Marks & Results</h2>
        <div className="flex items-center gap-3 mb-2 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <FiUser className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-white font-medium">{child.student.name}</span>
          <span className="text-xs text-white/40">Avg: {child.avgMarks}%</span>
        </div>
        {marksChartData.length === 0 ? (
          <div className="p-8 text-center text-white/30 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <FiBookOpen className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No marks recorded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlassCard glow>
              <h3 className="text-sm font-semibold text-white/80 mb-4">Subject Scores</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marksChartData} layout="vertical">
                    <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} {...chartTheme.axis} />
                    <YAxis type="category" dataKey="subject" {...chartTheme.axis} width={70} />
                    <Tooltip {...chartTheme.tooltip} />
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
                      data={marksChartData}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      paddingAngle={3} dataKey="score"
                    >
                      {marksChartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip {...chartTheme.tooltip} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {marksChartData.map((m, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-[11px] text-white/50">{m.subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        )}
        {marksChartData.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
            {marksChartData.map((m, i) => (
              <div key={i} className="rounded-xl p-3.5 text-center bg-white/[0.03] border border-white/[0.06]">
                <p className="text-white/50 text-[11px] font-medium mb-1">{m.subject}</p>
                <p className="text-2xl font-bold" style={{ color: COLORS[i] }}>{m.score}</p>
                <p className="text-white/30 text-[10px]">/ 100</p>
                <div className="mt-1.5">
                  <StatusBadge status={m.score >= 75 ? 'high' : m.score >= 50 ? 'medium' : 'low'}>
                    {m.score >= 90 ? 'A+' : m.score >= 75 ? 'A' : m.score >= 50 ? 'B' : 'C'}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        )}
        {child.weakSubjects.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <h4 className="text-sm font-semibold text-rose-300 mb-2 flex items-center gap-2">
              <FiAlertTriangle className="w-4 h-4" /> Subjects Needing Improvement
            </h4>
            <ul className="space-y-1">
              {child.weakSubjects.map((w, i) => (
                <li key={i} className="text-xs text-rose-200/70 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  {w.subject}: {w.marksObtained}/{w.totalMarks} ({Math.round((w.marksObtained / w.totalMarks) * 100)}%)
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    );
  }

  function renderFees() {
    return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text"><FiDollarSign className="inline w-5 h-5 mr-2" />Fee Status</h2>
        <div className="flex items-center gap-3 mb-2 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <FiUser className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-white font-medium">{child.student.name}</span>
        </div>
        {child.fees.length === 0 ? (
          <div className="p-8 text-center text-white/30 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <FiDollarSign className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No fee records</p>
          </div>
        ) : (
          <div className="space-y-3">
            {child.fees.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl p-4 border bg-white/[0.03] border-white/[0.06]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Fee Due: {formatDate(f.dueDate)}</p>
                    <p className="text-xs text-white/40">Amount: ₹{f.amount?.toLocaleString()}</p>
                  </div>
                  <StatusBadge status={f.status}>{f.status}</StatusBadge>
                </div>
                <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((f.paidAmount || 0) / f.amount) * 100}%` }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className={`h-full rounded-full ${f.status === 'paid' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : f.status === 'partial' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-rose-500 to-pink-500'}`}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-white/40">
                  <span>Paid: ₹{(f.paidAmount || 0).toLocaleString()}</span>
                  <span>{Math.round(((f.paidAmount || 0) / f.amount) * 100)}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  function renderTimetable() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = [1, 2, 3, 4, 5, 6];
    return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text"><FiClock className="inline w-5 h-5 mr-2" />Timetable</h2>
        <div className="flex items-center gap-3 mb-2 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <FiUser className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-white font-medium">{child.student.name}</span>
          <span className="text-xs text-white/40">Grade {child.student.grade}</span>
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-5 gap-2 min-w-[600px]">
            {days.map((day) => (
              <div key={day} className="rounded-xl border bg-white/[0.03] border-white/[0.06] overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/10 px-3 py-2.5 text-center border-b border-white/[0.06]">
                  <p className="font-semibold text-white text-xs">{day.slice(0, 3)}</p>
                </div>
                <div className="p-2 space-y-1">
                  {periods.map((p) => {
                    const entry = child.timetable?.find((t) => t.day === day && t.period === p);
                    return (
                      <div key={p}
                        className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium text-center border
                          ${!entry ? 'bg-white/[0.02] border-white/[0.04] text-white/20'
                            : 'bg-white/[0.03] border-white/[0.06] text-white/60'}`}
                      >
                        {p}. {entry ? entry.subject : '—'}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  function renderDisciplinary() {
    return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text"><FiAlertTriangle className="inline w-5 h-5 mr-2" />Disciplinary Records</h2>
        <div className="flex items-center gap-3 mb-2 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <FiUser className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-white font-medium">{child.student.name}</span>
        </div>
        {child.disciplinary.length === 0 ? (
          <div className="p-8 text-center text-white/30 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <FiAlertTriangle className="w-8 h-8 mx-auto mb-2 text-emerald-400/50" />
            <p className="text-sm">No disciplinary records — all clear! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {child.disciplinary.map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl p-4 border bg-rose-500/10 border-rose-500/25"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5">⚠️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{d.description}</p>
                    <p className="text-xs text-rose-200/70 mt-0.5">{formatDate(d.date)}</p>
                    {d.actionTaken && (
                      <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                        <p className="text-xs text-rose-300"><span className="font-semibold">Action:</span> {d.actionTaken}</p>
                      </div>
                    )}
                    <div className="mt-1.5">
                      <StatusBadge status={d.status || 'open'}>{d.status || 'Open'}</StatusBadge>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  function renderAnnouncements() {
    const announcements = data?.announcements || [];
    return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text">📢 Announcements</h2>
        {announcements.length === 0 ? (
          <div className="p-8 text-center text-white/30 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <p className="text-sm">No announcements</p>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((a, i) => (
              <motion.div key={a._id || i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl p-4 border bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] transition-all"
              >
                <h4 className="font-medium text-white text-sm mb-1">{a.title}</h4>
                {a.description && <p className="text-white/50 text-xs mb-2">{a.description}</p>}
                <div className="flex items-center gap-3 text-[11px] text-white/30">
                  <span>{formatDate(a.createdAt)}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/[0.06] capitalize">{a.targetRole}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <DashboardWrapper role="parent" navItems={navItems}>
      {(section) => renderSection(section)}
    </DashboardWrapper>
  );
}
