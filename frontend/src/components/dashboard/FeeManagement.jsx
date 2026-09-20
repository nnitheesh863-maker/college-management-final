import { motion } from 'framer-motion';
import GlassCard, { GlassCardContent } from '../ui/GlassCard';
import AnimatedTable from '../ui/AnimatedTable';
import StatusBadge from '../ui/StatusBadge';
import ScrollReveal from '../animations/ScrollReveal';
import AnimatedCounter from '../animations/AnimatedCounter';
import { FEE_RECORDS } from '../../data/mockData';

export default function FeeManagement() {
  const totalCollected = FEE_RECORDS.reduce((s, r) => s + r.paid, 0);
  const totalDue = FEE_RECORDS.reduce((s, r) => s + r.amount, 0);
  const pending = totalDue - totalCollected;

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <h2 className="text-2xl font-bold glow-text">💰 Fee Management</h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Collected', value: totalCollected, icon: '💵', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30' },
          { label: 'Total Due', value: totalDue, icon: '📋', color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30' },
          { label: 'Pending', value: pending, icon: '⏳', color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            className={`rounded-2xl p-5 border bg-gradient-to-br ${item.color} ${item.border} backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{item.icon}</span>
            </div>
            <p className="text-white/50 text-xs uppercase tracking-wider">{item.label}</p>
            <p className="text-2xl font-bold text-white mt-1">
              ₹<AnimatedCounter value={item.value} />
            </p>
          </motion.div>
        ))}
      </div>

      <ScrollReveal delay={0.2}>
        <GlassCard hoverable glow>
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h3 className="text-white/80 font-semibold flex items-center gap-2">📋 Fee Records</h3>
          </div>
          <GlassCardContent>
            <AnimatedTable
              headers={['ID', 'Student', 'Amount', 'Paid', 'Due Date', 'Status']}
              rows={FEE_RECORDS}
              renderRow={(r) => (
                <>
                  <td className="p-3 font-mono text-xs text-white/50">{r.id}</td>
                  <td className="p-3 font-medium text-white/90">{r.student}</td>
                  <td className="p-3">₹{r.amount}</td>
                  <td className="p-3">₹{r.paid}</td>
                  <td className="p-3 text-white/50">{r.due}</td>
                  <td className="p-3">
                    <StatusBadge status={r.status}>{r.status}</StatusBadge>
                  </td>
                </>
              )}
              emptyMessage="No fee records."
            />
          </GlassCardContent>
        </GlassCard>
      </ScrollReveal>
    </div>
  );
}
