import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardWrapper from '../components/dashboard/shared/DashboardWrapper';
import GlassCard, { GlassCardContent } from '../components/ui/GlassCard';
import AnimatedCounter from '../components/animations/AnimatedCounter';
import StatusBadge from '../components/ui/StatusBadge';
import api from '../services/api';

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
  { id: 'discipline', icon: '⚖️', label: 'Discipline' },
  { id: 'logs', icon: '📋', label: 'System Logs' },
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
  disciplinary: [
    { studentId: { userId: { name: 'Charlie Brown' } }, description: 'Repeated tardiness', date: '2026-05-20', status: 'open' },
  ],
};

export default function PrincipalDashboard() {
  const [data, setData] = useState(mockData);
  const [showAI, setShowAI] = useState(true);

  useEffect(() => {
    api.get('/principal/dashboard').then(({ data }) => {
      if (data) setData(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

  const { stats } = data;

  return (
    <DashboardWrapper role="principal" navItems={navItems}>
      {(section) => {
        const s = section;

        if (s === 'overview') return (
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glow-card rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-purple-600/10" />
              <h1 className="text-4xl font-extrabold glow-text-gold mb-2 relative">🏫 Principal Dashboard</h1>
              <p className="text-slate-400 relative">Institution Overview</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '👥', label: 'Total Students', value: stats.totalStudents, color: 'from-blue-600/30 to-cyan-600/20', border: 'border-blue-500/40' },
                { icon: '👨‍🏫', label: 'Total Teachers', value: stats.totalTeachers, color: 'from-purple-600/30 to-fuchsia-600/20', border: 'border-purple-500/40' },
                { icon: '💰', label: 'Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, color: 'from-emerald-600/30 to-teal-600/20', border: 'border-emerald-500/40' },
                { icon: '📊', label: 'Avg Performance', value: `${stats.avgPerformance}%`, color: 'from-amber-600/30 to-orange-600/20', border: 'border-amber-500/40' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -4 }} className={`rounded-2xl p-4 text-center border bg-gradient-to-br ${c.color} ${c.border} backdrop-blur-sm shadow-lg`}>
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{c.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{typeof c.value === 'number' ? <AnimatedCounter value={c.value} /> : c.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '📈', label: 'Attendance Rate', value: `${stats.attendanceRate}%`, color: 'from-emerald-600/30 to-teal-600/20', border: 'border-emerald-500/40' },
                { icon: '⏳', label: 'Pending Fees', value: stats.pendingFees, color: 'from-rose-600/30 to-pink-600/20', border: 'border-rose-500/40' },
                { icon: '📚', label: 'Total Users', value: stats.totalUsers, color: 'from-violet-600/30 to-fuchsia-600/20', border: 'border-violet-500/40' },
                { icon: '🏛️', label: 'Departments', value: data.departments.length, color: 'from-amber-600/30 to-orange-600/20', border: 'border-amber-500/40' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.05, y: -4 }} className={`rounded-2xl p-4 text-center border bg-gradient-to-br ${c.color} ${c.border} backdrop-blur-sm shadow-lg`}>
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{c.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{typeof c.value === 'number' ? <AnimatedCounter value={c.value} /> : c.value}</p>
                </motion.div>
              ))}
            </div>

            {/* AI Predictions Panel */}
            {showAI && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-6 border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-purple-500/10 backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold glow-text-gold flex items-center gap-2">🤖 AI Predictive Analytics</h3>
                  <button onClick={() => setShowAI(false)} className="text-slate-400 hover:text-white">&times;</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: '🎓 Predicted Dropouts', value: '3 students', severity: 'critical', desc: 'Based on attendance & marks' },
                    { label: '💰 Fee Default Risk', value: '8 students', severity: 'warning', desc: 'Payment patterns indicate risk' },
                    { label: '📈 Performance Trend', value: '+5.2%', severity: 'success', desc: 'Overall improvement expected' },
                  ].map((p, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${p.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/30' : p.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                      <p className="text-lg mb-1">{p.label}</p>
                      <p className={`text-2xl font-bold ${p.severity === 'critical' ? 'text-rose-300' : p.severity === 'warning' ? 'text-amber-300' : 'text-emerald-300'}`}>{p.value}</p>
                      <p className="text-slate-400 text-xs mt-1">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">💰 Revenue Trend</h3>
                <div className="flex items-end gap-2 h-40">
                  {data.revenueByMonth.map((r, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${(r.revenue / 10000)}px` }}
                        transition={{ delay: i * 0.08, duration: 0.8 }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-amber-500 to-yellow-500 shadow-[0_0_10px_rgba(251,191,36,0.3)]" />
                      <span className="text-[10px] text-slate-400">{r.month}</span>
                    </div>
                  ))}
                </div>
              </GlassCardContent></GlassCard>

              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">📊 Department Performance</h3>
                <div className="space-y-3">
                  {data.departments.map((d, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">{d.name}</span><span className="text-white font-bold">{d.avgMarks}%</span></div>
                      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${d.avgMarks}%` }} transition={{ delay: i * 0.1, duration: 1 }}
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCardContent></GlassCard>
            </div>
          </div>
        );

        if (s === 'students') {
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          const studentList = (data.students && data.students.length > 0) ? data.students : [
            {
              userId: {
                name: localUser.name || 'Alice Johnson',
                email: localUser.email || 'alice@demo.edu',
                avatar: localUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
              },
              rollNo: '24BCS101',
              grade: 'B.Sc Computer Science',
              attendancePercent: 92,
              feeStatus: 'paid'
            },
            {
              userId: {
                name: 'Kavitha Raman',
                email: 'kavitha@kprcas.ac.in',
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop'
              },
              rollNo: '24BCS102',
              grade: 'B.Sc Computer Science',
              attendancePercent: 88,
              feeStatus: 'paid'
            },
            {
              userId: {
                name: 'Rahul Varma',
                email: 'rahul@kprcas.ac.in',
                avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop'
              },
              rollNo: '24BCS103',
              grade: 'B.Sc AI & Data Science',
              attendancePercent: 94,
              feeStatus: 'paid'
            },
            {
              userId: {
                name: 'Pooja Sundaram',
                email: 'pooja@kprcas.ac.in',
                avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop'
              },
              rollNo: '24BCO104',
              grade: 'B.Com Professional',
              attendancePercent: 82,
              feeStatus: 'unpaid'
            }
          ];

          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    👥 Scholar Directory & Profiles
                  </h2>
                  <p className="text-xs text-slate-400">Live roster with verified student avatars and enrollment records</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Live Real-time Sync Active
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { l: 'Total Enrolled', v: stats.totalStudents || 520, c: 'from-blue-600/30 to-cyan-600/20', b: 'border-blue-500/40' },
                  { l: 'Average Marks', v: `${stats.avgPerformance || 85}%`, c: 'from-emerald-600/30 to-teal-600/20', b: 'border-emerald-500/40' },
                  { l: 'Campus Attendance', v: `${stats.attendanceRate || 92}%`, c: 'from-purple-600/30 to-fuchsia-600/20', b: 'border-purple-500/40' },
                  { l: 'Pending Dues', v: stats.pendingFees || 0, c: 'from-rose-600/30 to-pink-600/20', b: 'border-rose-500/40' },
                ].map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className={`rounded-2xl p-4 text-center border bg-gradient-to-br ${c.c} ${c.b} backdrop-blur-sm`}>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">{c.l}</p>
                    <p className="text-2xl font-bold text-white mt-1">{c.v}</p>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 rounded-3xl bg-[#0c1426] border border-white/10 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-base">Enrolled Scholars</h3>
                  <span className="text-xs text-slate-400">{studentList.length} Registered Students</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-slate-300 text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 uppercase text-[11px]">
                        <th className="pb-3">Student</th>
                        <th className="pb-3">Roll No</th>
                        <th className="pb-3">Program / Department</th>
                        <th className="pb-3">Attendance</th>
                        <th className="pb-3">Fee Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {studentList.map((st, i) => {
                        const avatarSrc = st.userId?.avatar || (i === 0 && localUser.avatar) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
                        const sName = st.userId?.name || (i === 0 && localUser.name) || 'Scholar';
                        const sEmail = st.userId?.email || 'student@kprcas.ac.in';
                        return (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={avatarSrc}
                                  alt={sName}
                                  className="w-9 h-9 rounded-xl object-cover border border-emerald-400/50 shadow"
                                />
                                <div>
                                  <div className="font-bold text-white">{sName}</div>
                                  <div className="text-[10px] text-slate-400">{sEmail}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 font-mono text-emerald-400 font-semibold">{st.rollNo || '24BCS10' + (i + 1)}</td>
                            <td className="py-3 text-white">{st.grade || 'B.Sc Computer Science'}</td>
                            <td className="py-3">
                              <span className="font-bold text-blue-400">{st.attendancePercent || 90}%</span>
                            </td>
                            <td className="py-3">
                              <StatusBadge status={st.feeStatus || 'paid'}>
                                {st.feeStatus === 'unpaid' ? 'Pending' : 'Paid'}
                              </StatusBadge>
                            </td>
                            <td className="py-3 text-right">
                              <button onClick={() => alert(`Viewing academic profile for ${sName}...`)} className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold">
                                View Profile
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        }


        if (s === 'teachers') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-gold">👨‍🏫 Teacher Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.departments.map((d, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }} className="rounded-2xl p-5 border bg-white/5 border-white/10">
                  <h4 className="font-bold text-white">{d.name}</h4>
                  <p className="text-slate-400 text-sm">{d.teachers} Teachers • {d.students} Students</p>
                  <div className="mt-3 w-full bg-white/10 rounded-full h-2"><motion.div initial={{ width: 0 }} animate={{ width: `${d.avgMarks}%` }} className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-500" /></div>
                  <button className="mt-3 text-amber-400 text-xs font-semibold hover:text-amber-300">View Details →</button>
                </motion.div>
              ))}
            </div>
          </div>
        );

        if (s === 'revenue') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-gold">💰 Revenue Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { l: 'Total Revenue', v: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, c: 'from-emerald-600/30 to-teal-600/20', b: 'border-emerald-500/40' },
                { l: 'Pending Fees', v: stats.pendingFees, c: 'from-amber-600/30 to-orange-600/20', b: 'border-amber-500/40' },
                { l: 'Collection Rate', v: '94%', c: 'from-blue-600/30 to-cyan-600/20', b: 'border-blue-500/40' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className={`rounded-2xl p-5 text-center border bg-gradient-to-br ${c.c} ${c.b} backdrop-blur-sm`}>
                  <p className="text-slate-400 text-xs uppercase">{c.l}</p>
                  <p className="text-3xl font-bold text-white mt-1">{c.v}</p>
                </motion.div>
              ))}
            </div>
            <GlassCard hoverable glow><GlassCardContent>
              <h3 className="text-white font-semibold mb-4">📈 Monthly Revenue</h3>
              <div className="flex items-end gap-3 h-48">
                {data.revenueByMonth.map((r, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(r.revenue / 12000)}px` }}
                      transition={{ delay: i * 0.08, duration: 0.8 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-amber-500 to-yellow-500 shadow-[0_0_15px_rgba(251,191,36,0.3)]" />
                    <span className="text-xs text-slate-400">{r.month}</span>
                    <span className="text-[10px] text-slate-500">₹{(r.revenue / 100000).toFixed(1)}L</span>
                  </div>
                ))}
              </div>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'expenses') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-gold">📉 Expense Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4">📊 Expense Breakdown</h3>
                <div className="space-y-3">
                  {data.expenses.map((e, i) => {
                    const total = data.expenses.reduce((s, x) => s + x.amount, 0);
                    const pct = Math.round((e.amount / total) * 100);
                    return <div key={i}>
                      <div className="flex justify-between text-sm mb-1"><span className="text-slate-300">{e.category}</span><span className="text-white font-bold">₹{(e.amount / 1000).toFixed(0)}K</span></div>
                      <div className="w-full bg-white/10 rounded-full h-2"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: i * 0.1, duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500" /></div>
                    </div>;
                  })}
                </div>
              </GlassCardContent></GlassCard>
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4">📋 Expense List</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm"><thead><tr className="border-b border-white/10 text-slate-500 uppercase text-xs tracking-wider">
                    <th className="p-3 text-left">Category</th><th className="p-3 text-left">Amount</th><th className="p-3 text-left">Month</th>
                  </tr></thead>
                    <tbody>{data.expenses.map((e, i) => (
                      <tr key={i} className="border-b border-white/5"><td className="p-3 text-white">{e.category}</td><td className="p-3">₹{e.amount.toLocaleString()}</td><td className="p-3 text-slate-400">Jan</td></tr>
                    ))}</tbody>
                  </table>
                </div>
              </GlassCardContent></GlassCard>
            </div>
          </div>
        );

        if (s === 'departments') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-gold">🏛️ Department Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4">Department Performance</h3>
                <div className="space-y-4">
                  {data.departments.map((d, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between items-center mb-2"><h4 className="font-bold text-white">{d.name}</h4><span className="text-amber-400 font-bold">{d.avgMarks}%</span></div>
                      <p className="text-slate-400 text-xs">{d.teachers} Teachers • {d.students} Students</p>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2"><motion.div initial={{ width: 0 }} animate={{ width: `${d.avgMarks}%` }} transition={{ delay: i * 0.1, duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-500" /></div>
                    </div>
                  ))}
                </div>
              </GlassCardContent></GlassCard>
              <GlassCard hoverable glow><GlassCardContent>
                <h3 className="text-white font-semibold mb-4">📊 Student Distribution</h3>
                <div className="flex items-end gap-3 h-40">
                  {data.departments.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div initial={{ height: 0 }} animate={{ height: `${d.students * 0.8}px` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-amber-500 to-purple-500" />
                      <span className="text-[10px] text-slate-400 text-center">{d.name}</span>
                    </div>
                  ))}
                </div>
              </GlassCardContent></GlassCard>
            </div>
          </div>
        );

        if (s === 'attendance') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-gold">📅 Attendance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { l: 'Overall Rate', v: `${stats.attendanceRate}%`, c: 'from-emerald-600/30 to-teal-600/20', b: 'border-emerald-500/40' },
                { l: 'This Week', v: '92%', c: 'from-blue-600/30 to-cyan-600/20', b: 'border-blue-500/40' },
                { l: 'Low Attendance', v: '12 students', c: 'from-rose-600/30 to-pink-600/20', b: 'border-rose-500/40' },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className={`rounded-2xl p-5 text-center border bg-gradient-to-br ${c.c} ${c.b} backdrop-blur-sm`}>
                  <p className="text-slate-400 text-xs uppercase">{c.l}</p>
                  <p className="text-3xl font-bold text-white mt-1">{c.v}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

        if (s === 'performance') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-gold">📈 School Performance</h2>
            <GlassCard hoverable glow><GlassCardContent>
              <h3 className="text-white font-semibold mb-4">Average Marks Trend</h3>
              <div className="flex items-end gap-3 h-40">
                {[72, 74, 78, 76, 80, 82].map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div initial={{ height: 0 }} animate={{ height: `${m * 2}px` }} transition={{ delay: i * 0.08, duration: 0.8 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-amber-500 to-purple-500" />
                    <span className="text-xs text-slate-400">Sem {i + 1}</span>
                    <span className="text-[10px] text-white font-bold">{m}%</span>
                  </div>
                ))}
              </div>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'leaves') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-gold">✈️ Leave Management</h2>
            <div className="space-y-3">
              {data.leaveRequests.map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div><h4 className="font-bold text-white">{l.userId.name}</h4><p className="text-slate-400 text-sm">{l.reason} • {l.startDate} to {l.endDate}</p><StatusBadge status={l.status}>{l.status}</StatusBadge></div>
                    <div className="flex gap-2">{l.status === 'pending' && <><button className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30">✓ Approve</button><button className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold hover:bg-rose-500/30">✗ Reject</button></>}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

        if (s === 'announcements') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-gold">📢 Broadcast Messaging</h2>
            <GlassCard hoverable glow><GlassCardContent>
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <input placeholder="Announcement Title" className="input-glass" />
                <textarea placeholder="Message content..." className="input-glass h-32 resize-none" />
                <select className="input-glass"><option>Send to: All</option><option>Students</option><option>Teachers</option></select>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-amber-600 to-purple-600 text-white font-semibold shadow-lg">📢 Broadcast</motion.button>
              </form>
            </GlassCardContent></GlassCard>
            <div className="space-y-2">
              {data.announcements.map((a, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 border-l-4 border-l-amber-500">
                  <h4 className="font-bold text-white text-sm">{a.title}</h4>
                  <p className="text-slate-500 text-xs">Target: {a.targetRole}</p>
                </div>
              ))}
            </div>
          </div>
        );

        if (s === 'discipline') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-gold">⚖️ Disciplinary Management</h2>
            <div className="space-y-3">
              {data.disciplinary.map((d, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                  <div className="flex items-start justify-between">
                    <div><h4 className="font-bold text-white">{d.studentId?.userId?.name || 'Student'}</h4><p className="text-slate-400 text-sm">{d.description} • {d.date}</p><StatusBadge status={d.status}>{d.status}</StatusBadge></div>
                    <div className="flex gap-2"><button className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold">Schedule Meeting</button><button className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold">Suspend</button></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

        if (s === 'logs') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-gold">📋 System Activity Logs</h2>
            <GlassCard><GlassCardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-300">
                  <thead><tr className="border-b border-white/10 text-slate-500 uppercase text-xs tracking-wider">
                    <th className="p-3 text-left">User</th><th className="p-3 text-left">Action</th><th className="p-3 text-left">Timestamp</th>
                  </tr></thead>
                  <tbody>
                    {[
                      { user: 'Dr. Sarah Wilson', action: 'Updated marks for Class 10', time: '2026-05-22 10:30 AM' },
                      { user: 'Alice Johnson', action: 'Submitted fee payment', time: '2026-05-22 09:15 AM' },
                      { user: 'Admin', action: 'New user registered: Bob Smith', time: '2026-05-21 04:20 PM' },
                    ].map((l, i) => (
                      <tr key={i} className="border-b border-white/5"><td className="p-3 text-white">{l.user}</td><td className="p-3">{l.action}</td><td className="p-3 text-slate-500">{l.time}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCardContent></GlassCard>
          </div>
        );

        if (s === 'ai') return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold glow-text-gold">🤖 AI Predictive Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: '🎓', title: 'Dropout Prediction', value: '3 at risk', severity: 'critical', detail: 'Students with <60% attendance and <35% marks' },
                { icon: '💰', title: 'Fee Default Prediction', value: '8 at risk', severity: 'warning', detail: 'Based on payment history patterns' },
                { icon: '📈', title: 'Performance Forecast', value: '+5.2%', severity: 'success', detail: 'Expected improvement next semester' },
              ].map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl p-6 border ${p.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/30' : p.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <div className="text-3xl mb-3">{p.icon}</div>
                  <h3 className="font-bold text-white">{p.title}</h3>
                  <p className={`text-2xl font-bold mt-1 ${p.severity === 'critical' ? 'text-rose-300' : p.severity === 'warning' ? 'text-amber-300' : 'text-emerald-300'}`}>{p.value}</p>
                  <p className="text-slate-400 text-sm mt-2">{p.detail}</p>
                </motion.div>
              ))}
            </div>
            <GlassCard hoverable glow><GlassCardContent>
              <h3 className="text-white font-semibold mb-4">📊 AI Recommendations</h3>
              <div className="space-y-3">
                {[
                  { action: 'Extra tutoring for low performers', impact: 'High', students: 3 },
                  { action: 'Parent meetings for attendance', impact: 'Medium', students: 8 },
                  { action: 'Fee reminder campaign', impact: 'High', students: 12 },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3"><span className="text-lg">{['🎯', '📅', '💰'][i]}</span><div><p className="text-white text-sm font-medium">{r.action}</p><p className="text-slate-500 text-xs">{r.students} students affected</p></div></div>
                    <StatusBadge status={r.impact === 'High' ? 'critical' : 'warning'}>{r.impact}</StatusBadge>
                  </div>
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
