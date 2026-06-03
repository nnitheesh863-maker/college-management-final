import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiChevronLeft, FiBarChart2 } from 'react-icons/fi';
import { getExamAnalytics } from '../../../services/exams';
import GlassCard from '../../ui/GlassCard';
import AnimatedCounter from '../../animations/AnimatedCounter';
import StatusBadge from '../../ui/StatusBadge';

const COLORS = ['#a855f7', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

const chartTheme = {
  axis: { stroke: 'rgba(255,255,255,0.1)', fontSize: 11 },
  grid: { stroke: 'rgba(255,255,255,0.04)' },
  tooltip: {
    contentStyle: { background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8, fontSize: 12 },
    labelStyle: { color: 'rgba(255,255,255,0.6)' },
  },
};

export default function ExamAnalytics({ onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExamAnalytics().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" /></div>;

  if (!data) return <div className="text-center py-16 text-white/30"><p className="text-sm">Failed to load analytics</p></div>;

  const pieData = [
    { name: 'Passed', value: data.passRate },
    { name: 'Failed', value: 100 - data.passRate },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
          <FiChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-lg font-bold gradient-text"><FiBarChart2 className="inline w-5 h-5 mr-2" />Exam Analytics</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Exams', value: data.totalExams, icon: '📝', color: 'from-purple-500/20 to-pink-500/10', border: 'border-purple-500/30' },
          { label: 'Submissions', value: data.totalSubmissions, icon: '👥', color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30' },
          { label: 'Avg Score', value: `${data.avgScore}%`, icon: '📊', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
          { label: 'Pass Rate', value: `${data.passRate}%`, icon: '🎯', color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
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
          <h3 className="text-sm font-semibold text-white/80 mb-4">Exam Performance</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.examStats}>
                <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray="3 3" />
                <XAxis dataKey="title" tick={false} />
                <YAxis domain={[0, 100]} {...chartTheme.axis} />
                <Tooltip {...chartTheme.tooltip} />
                <Bar dataKey="averageScore" name="Avg Score" radius={[4, 4, 0, 0]}>
                  {data.examStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard glow>
          <h3 className="text-sm font-semibold text-white/80 mb-4">Pass/Fail Ratio</h3>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={i === 0 ? '#10b981' : '#f43f5e'} />)}
                </Pie>
                <Tooltip {...chartTheme.tooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 -mt-4">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[11px] text-white/50">Passed ({data.passRate}%)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /><span className="text-[11px] text-white/50">Failed ({100 - data.passRate}%)</span></div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-sm font-semibold text-white/80 mb-4">Per-Exam Breakdown</h3>
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Exam</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Subject</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Students</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Avg Score</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-white/30 uppercase">Max</th>
              </tr>
            </thead>
            <tbody>
              {data.examStats.map((e, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-white font-medium">{e.title}</td>
                  <td className="px-5 py-3 text-white/50">{e.subject}</td>
                  <td className="px-5 py-3 text-white/50">{e.totalStudents}</td>
                  <td className="px-5 py-3"><StatusBadge status={e.averageScore >= 50 ? 'submitted' : 'warning'}>{e.averageScore}%</StatusBadge></td>
                  <td className="px-5 py-3 text-white/70">{e.maxScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
