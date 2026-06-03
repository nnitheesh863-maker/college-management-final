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
import api from '../services/api';
import AdminFeeAnalytics from '../components/dashboard/admin/AdminFeeAnalytics';
import { FiTrendingUp, FiDollarSign, FiUsers, FiAlertTriangle } from 'react-icons/fi';

const COLORS = ['#f59e0b', '#a855f7', '#3b82f6', '#06b6d4', '#10b981'];

const navItems = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'students', icon: '👥', label: 'Students' },
  { id: 'teachers', icon: '👨‍🏫', label: 'Teachers' },
  { id: 'revenue', icon: '💰', label: 'Revenue' },
  { id: 'expenses', icon: '📉', label: 'Expenses' },
  { id: 'departments', icon: '🏛️', label: 'Departments' },
  { id: 'attendance', icon: '📅', label: 'Attendance' },
  { id: 'performance', icon: '📈', label: 'Performance' },
  { id: 'leaves', icon: '✈️', label: 'Leave Mgmt' },
  { id: 'announcements', icon: '📢', label: 'Broadcast' },
  { id: 'ai', icon: '🤖', label: 'AI Predictions' },
];

const mockData = {
  stats: { totalStudents: 520, totalTeachers: 45, totalUsers: 580, totalRevenue: 4500000, pendingFees: 12, avgPerformance: 76, attendanceRate: 88 },
  revenueByMonth: [
    { month: 'Jan', revenue: 850000 }, { month: 'Feb', revenue: 820000 },
    { month: 'Mar', revenue: 900000 }, { month: 'Apr', revenue: 780000 },
    { month: 'May', revenue: 880000 }, { month: 'Jun', revenue: 920000 },
  ],
  expenses: [
    { category: 'Salaries', amount: 500000 }, { category: 'Infrastructure', amount: 200000 },
    { category: 'Utilities', amount: 80000 }, { category: 'Events', amount: 50000 },
    { category: 'Equipment', amount: 120000 }, { category: 'Misc', amount: 30000 },
  ],
  departments: [
    { name: 'Science', teachers: 12, students: 180, avgMarks: 78 },
    { name: 'Math', teachers: 8, students: 150, avgMarks: 82 },
    { name: 'CS', teachers: 6, students: 120, avgMarks: 85 },
    { name: 'English', teachers: 10, students: 160, avgMarks: 76 },
    { name: 'Arts', teachers: 5, students: 90, avgMarks: 80 },
  ],
  leaveRequests: [
    { userId: { name: 'Dr. Sarah Wilson' }, role: 'teacher', startDate: '2026-06-10', endDate: '2026-06-12', reason: 'Conference', status: 'pending' },
    { userId: { name: 'Alice Johnson' }, role: 'student', startDate: '2026-06-15', endDate: '2026-06-16', reason: 'Family event', status: 'pending' },
  ],
  announcements: [
    { title: 'Exam Schedule Published', targetRole: 'all' },
    { title: 'Parent-Teacher Meeting', targetRole: 'teacher' },
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
    contentStyle: { background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: 'rgba(255,255,255,0.6)' },
  },
};

export default function PrincipalDashboard() {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    api.get('/principal/dashboard').then(({ data }) => {
      if (data) setData(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

  const { stats } = data;

  const renderSection = (s) => {
    if (s === 'overview') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold gradient-text-gold">Principal Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">Institution Overview</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: '👥', label: 'Total Students', value: stats.totalStudents, color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30' },
            { icon: '👨‍🏫', label: 'Total Teachers', value: stats.totalTeachers, color: 'from-purple-500/20 to-pink-500/10', border: 'border-purple-500/30' },
            { icon: '💰', label: 'Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
            { icon: '📊', label: 'Avg Performance', value: `${stats.avgPerformance}%`, color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: '📈', label: 'Attendance Rate', value: `${stats.attendanceRate}%`, color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
            { icon: '⏳', label: 'Pending Fees', value: stats.pendingFees, color: 'from-rose-500/20 to-pink-500/10', border: 'border-rose-500/30' },
            { icon: '📚', label: 'Total Users', value: stats.totalUsers, color: 'from-accent-500/20 to-pink-500/10', border: 'border-accent-500/30' },
            { icon: '🏛️', label: 'Departments', value: data.departments.length, color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
          ].map((c, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`rounded-xl p-4 border bg-gradient-to-br ${c.color} ${c.border}`}
            >
              <div className="text-lg mb-1">{c.icon}</div>
              <p className="text-white/40 text-[11px] font-semibold uppercase tracking-wider">{c.label}</p>
              <p className="text-xl font-bold text-white mt-0.5">
                {typeof c.value === 'number' ? <AnimatedCounter value={c.value} /> : c.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="rounded-xl p-5 border bg-gradient-to-r from-amber-500/10 to-purple-500/10 border-amber-500/20">
          <h3 className="text-sm font-semibold gradient-text-gold flex items-center gap-2 mb-4">🤖 AI Predictive Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: '🎓 Predicted Dropouts', value: '3 students', severity: 'critical', desc: 'Based on attendance & marks' },
              { label: '💰 Fee Default Risk', value: '8 students', severity: 'warning', desc: 'Payment patterns indicate risk' },
              { label: '📈 Performance Trend', value: '+5.2%', severity: 'success', desc: 'Overall improvement expected' },
            ].map((p, i) => (
              <div key={i} className={`p-3.5 rounded-lg border ${p.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/25' : p.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/25' : 'bg-emerald-500/10 border-emerald-500/25'}`}>
                <p className="text-xs text-white/60">{p.label}</p>
                <p className={`text-lg font-bold mt-0.5 ${p.severity === 'critical' ? 'text-rose-300' : p.severity === 'warning' ? 'text-amber-300' : 'text-emerald-300'}`}>{p.value}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2"><FiDollarSign className="w-4 h-4 text-amber-400" /> Revenue Trend</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueByMonth}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray="3 3" />
                  <XAxis dataKey="month" {...chartTheme.axis} />
                  <YAxis {...chartTheme.axis} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                  <Tooltip {...chartTheme.tooltip} formatter={(v) => [`₹${(v / 100000).toFixed(1)}L`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2"><FiTrendingUp className="w-4 h-4 text-purple-400" /> Department Performance</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.departments} layout="vertical">
                  <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} {...chartTheme.axis} />
                  <YAxis type="category" dataKey="name" {...chartTheme.axis} width={60} />
                  <Tooltip {...chartTheme.tooltip} />
                  <Bar dataKey="avgMarks" radius={[0, 4, 4, 0]}>
                    {data.departments.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    );

    if (s === 'students') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-gold">👥 Student Management</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: 'Total', v: stats.totalStudents, c: 'from-blue-500/20 to-cyan-500/10', b: 'border-blue-500/30' },
            { l: 'Avg Marks', v: `${stats.avgPerformance}%`, c: 'from-emerald-500/20 to-teal-500/10', b: 'border-emerald-500/30' },
            { l: 'Attendance', v: `${stats.attendanceRate}%`, c: 'from-purple-500/20 to-pink-500/10', b: 'border-purple-500/30' },
            { l: 'Pending Fees', v: stats.pendingFees, c: 'from-rose-500/20 to-pink-500/10', b: 'border-rose-500/30' },
          ].map((c, i) => (
            <div key={i} className={`rounded-xl p-4 border bg-gradient-to-br ${c.c} ${c.b}`}>
              <p className="text-white/40 text-[11px] uppercase tracking-wider">{c.l}</p>
              <p className="text-xl font-bold text-white mt-0.5">{c.v}</p>
            </div>
          ))}
        </div>
        <GlassCard>
          <h3 className="text-sm font-semibold text-white/80 mb-4">📋 All Students</h3>
          <input placeholder="Search students..." className="input-glass mb-4" />
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
                {[
                  { name: 'Alice Johnson', roll: 'STU101', grade: '10-A', status: 'active' },
                  { name: 'Bob Smith', roll: 'STU102', grade: '10-A', status: 'active' },
                ].map((s, i) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white font-medium">{s.name}</td>
                    <td className="px-5 py-3 text-white/50">{s.roll}</td>
                    <td className="px-5 py-3 text-white/50">Class {s.grade}</td>
                    <td className="px-5 py-3"><StatusBadge status={s.status}>{s.status}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    );

    if (s === 'teachers') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-gold">👨‍🏫 Teacher Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.departments.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-xl p-4 border bg-white/[0.03] border-white/[0.06] hover:border-amber-500/30 transition-all"
            >
              <h4 className="font-medium text-white text-sm">{d.name}</h4>
              <p className="text-white/40 text-xs">{d.teachers} Teachers • {d.students} Students</p>
              <div className="mt-2.5 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${d.avgMarks}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-500" />
              </div>
              <button className="mt-2.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">View Details →</button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );

    if (s === 'revenue') return <AdminFeeAnalytics />;

    if (s === 'expenses') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-gold">📉 Expense Tracking</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4">📊 Expense Breakdown</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.expenses} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="amount" nameKey="category">
                    {data.expenses.map((_, i) => (
                      <Cell key={i} fill={['#f59e0b', '#a855f7', '#3b82f6', '#06b6d4', '#10b981', '#ec4899'][i]} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTheme.tooltip} formatter={(v) => [`₹${(v / 1000).toFixed(0)}K`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {data.expenses.map((e, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#f59e0b', '#a855f7', '#3b82f6', '#06b6d4', '#10b981', '#ec4899'][i] }} />
                  <span className="text-[11px] text-white/50">{e.category}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="text-sm font-semibold text-white/80 mb-4">📋 Expense List</h3>
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Category</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {data.expenses.map((e, i) => (
                    <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                      <td className="px-5 py-3 text-white">{e.category}</td>
                      <td className="px-5 py-3 text-white/70">₹{e.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    );

    if (s === 'departments') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-gold">🏛️ Department Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4">Department Performance</h3>
            <div className="space-y-3">
              {data.departments.map((d, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="font-medium text-white text-sm">{d.name}</h4>
                    <span className="text-amber-400 font-bold text-xs">{d.avgMarks}%</span>
                  </div>
                  <p className="text-white/40 text-[11px]">{d.teachers} Teachers • {d.students} Students</p>
                  <div className="h-1.5 bg-white/[0.08] rounded-full mt-2 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${d.avgMarks}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-500" />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard glow>
            <h3 className="text-sm font-semibold text-white/80 mb-4">📊 Student Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.departments}>
                  <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray="3 3" />
                  <XAxis dataKey="name" {...chartTheme.axis} />
                  <YAxis {...chartTheme.axis} />
                  <Tooltip {...chartTheme.tooltip} />
                  <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                    {data.departments.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    );

    if (s === 'attendance') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-gold">📅 Attendance Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { l: 'Overall Rate', v: `${stats.attendanceRate}%`, c: 'from-emerald-500/20 to-teal-500/10', b: 'border-emerald-500/30' },
            { l: 'This Week', v: '92%', c: 'from-blue-500/20 to-cyan-500/10', b: 'border-blue-500/30' },
            { l: 'Low Attendance', v: '12 students', c: 'from-rose-500/20 to-pink-500/10', b: 'border-rose-500/30' },
          ].map((c, i) => (
            <div key={i} className={`rounded-xl p-4 text-center border bg-gradient-to-br ${c.c} ${c.b}`}>
              <p className="text-white/40 text-[11px] uppercase">{c.l}</p>
              <p className="text-xl font-bold text-white mt-0.5">{c.v}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );

    if (s === 'performance') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-gold">📈 School Performance</h2>
        <GlassCard glow>
          <h3 className="text-sm font-semibold text-white/80 mb-4">Average Marks Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Sem 1', marks: 72 }, { name: 'Sem 2', marks: 74 },
                { name: 'Sem 3', marks: 78 }, { name: 'Sem 4', marks: 76 },
                { name: 'Sem 5', marks: 80 }, { name: 'Sem 6', marks: 82 },
              ]}>
                <defs>
                  <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray="3 3" />
                <XAxis dataKey="name" {...chartTheme.axis} />
                <YAxis domain={[60, 100]} {...chartTheme.axis} />
                <Tooltip {...chartTheme.tooltip} />
                <Area type="monotone" dataKey="marks" stroke="#f59e0b" strokeWidth={2} fill="url(#perfGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>
    );

    if (s === 'leaves') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-gold">✈️ Leave Management</h2>
        <div className="space-y-3">
          {data.leaveRequests.map((l, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-medium text-white text-sm">{l.userId.name}</h4>
                  <p className="text-white/40 text-xs mt-0.5">{l.reason} • {l.startDate} to {l.endDate}</p>
                  <div className="mt-1.5"><StatusBadge status={l.status}>{l.status}</StatusBadge></div>
                </div>
                {l.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 transition-all">✓ Approve</button>
                    <button className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition-all">✗ Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );

    if (s === 'announcements') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-gold">📢 Broadcast</h2>
        <GlassCard>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <input placeholder="Announcement Title" className="input-glass" />
            <textarea placeholder="Message content..." className="input-glass h-32 resize-none" />
            <select className="input-glass"><option>Send to: All</option><option>Students</option><option>Teachers</option></select>
            <button type="submit" className="btn-primary w-full">📢 Broadcast</button>
          </form>
        </GlassCard>
        <div className="space-y-2">
          {data.announcements.map((a, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] border-l-4 border-l-amber-500">
              <h4 className="font-medium text-white text-sm">{a.title}</h4>
              <p className="text-white/40 text-xs">Target: {a.targetRole}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );

    if (s === 'ai') return (
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-6">
        <h2 className="text-lg font-bold gradient-text-gold">🤖 AI Predictive Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: '🎓', title: 'Dropout Prediction', value: '3 at risk', severity: 'critical', detail: 'Students with <60% attendance and <35% marks' },
            { icon: '💰', title: 'Fee Default Prediction', value: '8 at risk', severity: 'warning', detail: 'Based on payment history patterns' },
            { icon: '📈', title: 'Performance Forecast', value: '+5.2%', severity: 'success', detail: 'Expected improvement next semester' },
          ].map((p, i) => (
            <div key={i} className={`rounded-xl p-5 border ${p.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/25' : p.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/25' : 'bg-emerald-500/10 border-emerald-500/25'}`}>
              <div className="text-2xl mb-2">{p.icon}</div>
              <h3 className="font-medium text-white text-sm">{p.title}</h3>
              <p className={`text-lg font-bold mt-1 ${p.severity === 'critical' ? 'text-rose-300' : p.severity === 'warning' ? 'text-amber-300' : 'text-emerald-300'}`}>{p.value}</p>
              <p className="text-white/40 text-xs mt-1">{p.detail}</p>
            </div>
          ))}
        </div>
        <GlassCard>
          <h3 className="text-sm font-semibold text-white/80 mb-4">📊 AI Recommendations</h3>
          <div className="space-y-2">
            {[
              { action: 'Extra tutoring for low performers', impact: 'critical', students: 3 },
              { action: 'Parent meetings for attendance', impact: 'warning', students: 8 },
              { action: 'Fee reminder campaign', impact: 'critical', students: 12 },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="text-base">{['🎯', '📅', '💰'][i]}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{r.action}</p>
                    <p className="text-[11px] text-white/40">{r.students} students affected</p>
                  </div>
                </div>
                <StatusBadge status={r.impact}>{r.impact === 'critical' ? 'High' : 'Medium'}</StatusBadge>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    );

    return null;
  };

  return (
    <DashboardWrapper role="principal" navItems={navItems}>
      {(section) => renderSection(section)}
    </DashboardWrapper>
  );
}
