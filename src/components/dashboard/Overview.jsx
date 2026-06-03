import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useClock } from '../../hooks/useClock';
import StatCard from './StatCard';
import GlassCard, { GlassCardContent } from '../ui/GlassCard';
import ProgressRing from '../ui/ProgressRing';
import ScrollReveal from '../animations/ScrollReveal';
import { TOP_PERFORMERS, NEEDS_ATTENTION, STAT_CARDS } from '../../data/mockData';

export default function Overview({ onNavigate, onShowAddStudent }) {
  const { analytics, presentPercent } = useApp();
  const { formattedDate, formattedTime } = useClock();

  const statCards = STAT_CARDS.map((card) => ({
    ...card,
    value: card.key === 'percent' ? presentPercent
      : card.key === 'pending' ? 3
      : card.key === 'attention' ? 2
      : analytics[card.key] ?? 0,
  }));

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="glow-card rounded-3xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10" />
          <h1 className="text-5xl font-extrabold glow-text mb-3 relative">
            👩‍🏫 Teacher Dashboard
          </h1>
          <p className="text-purple-200/70 text-lg mb-2 relative">{formattedDate}</p>
          <motion.p
            key={formattedTime}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/50 relative"
          >
            {formattedTime} • {analytics.total_students} Students
          </motion.p>
        </motion.div>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ScrollReveal delay={0.1}>
          <GlassCard hoverable glow>
            <GlassCardContent className="flex flex-col items-center py-6">
              <ProgressRing percent={presentPercent} />
              <div className="flex gap-6 mt-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Present {analytics.present_today}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  Absent {analytics.absent_today}
                </span>
              </div>
            </GlassCardContent>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <GlassCard hoverable glow>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-white/80 font-semibold flex items-center gap-2">⚡ Quick Actions</h3>
            </div>
            <GlassCardContent className="space-y-2">
              {[
                { label: '📅 Mark Attendance', action: () => onNavigate('attendance'), color: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500' },
                { label: '➕ Add Student', action: onShowAddStudent, color: 'from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500' },
                { label: '🚨 View Alerts', action: () => onNavigate('alerts'), color: 'from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500' },
              ].map((btn, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={btn.action}
                  className={`w-full p-3 rounded-xl bg-gradient-to-r ${btn.color} text-white font-semibold text-sm transition-all shadow-lg`}
                >
                  {btn.label}
                </motion.button>
              ))}
            </GlassCardContent>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <GlassCard hoverable glow>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-white/80 font-semibold flex items-center gap-2">📋 Status</h3>
            </div>
            <GlassCardContent className="space-y-3">
              {[
                { label: '✅ Present', value: analytics.present_today, color: 'text-emerald-400' },
                { label: '❌ Absent', value: analytics.absent_today, color: 'text-rose-400' },
                { label: '👥 Total', value: analytics.total_students, color: 'text-purple-400' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <span className="text-white/70 font-medium text-sm">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </motion.div>
              ))}
            </GlassCardContent>
          </GlassCard>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ScrollReveal delay={0.1} direction="left">
          <GlassCard hoverable glow>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-white/80 font-semibold flex items-center gap-2">⭐ Top Performers</h3>
            </div>
            <GlassCardContent className="space-y-2">
              {TOP_PERFORMERS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                >
                  <span className="text-white/80 font-medium text-sm">{p.name}</span>
                  <span className="text-emerald-300 text-xs font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full">{p.score}%</span>
                </motion.div>
              ))}
            </GlassCardContent>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="right">
          <GlassCard hoverable glow>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="text-white/80 font-semibold flex items-center gap-2">⚠️ Needs Attention</h3>
            </div>
            <GlassCardContent className="space-y-2">
              {NEEDS_ATTENTION.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex justify-between items-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                >
                  <span className="text-white/80 font-medium text-sm">{p.name}</span>
                  <span className="text-rose-300 text-xs font-bold bg-rose-500/20 px-2.5 py-0.5 rounded-full">{p.score}%</span>
                </motion.div>
              ))}
            </GlassCardContent>
          </GlassCard>
        </ScrollReveal>
      </div>
    </div>
  );
}
