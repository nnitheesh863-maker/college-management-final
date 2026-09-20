import { motion } from 'framer-motion';
import ScrollReveal from '../animations/ScrollReveal';
import StaggerContainer from '../animations/StaggerContainer';
import { ALERTS_DATA } from '../../data/mockData';

export default function Alerts() {
  return (
    <div className="space-y-6">
      <ScrollReveal>
        <h2 className="text-2xl font-bold glow-text">🚨 Alerts</h2>
      </ScrollReveal>

      <StaggerContainer>
        <div className="space-y-3">
          {ALERTS_DATA.map((alert, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { opacity: 1, x: 0 }
              }}
              whileHover={{ scale: 1.01, x: 4 }}
              className={`rounded-2xl p-5 border transition-all ${
                alert.severity === 'critical'
                  ? 'bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/15 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]'
                  : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]'
              }`}
            >
              <div className="flex items-start gap-3">
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: i * 0.5 }}
                  className="text-2xl"
                >
                  {alert.severity === 'critical' ? '⚠️' : '⚡'}
                </motion.span>
                <div className="flex-1">
                  <p className="font-bold text-white/90">{alert.student}</p>
                  <p className="text-sm text-white/60 mt-0.5">{alert.detail}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  alert.severity === 'critical'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {alert.severity}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                {[
                  { label: 'Send Warning', color: 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' },
                  { label: 'Counseling', color: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' },
                  { label: 'Call Parent', color: 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' },
                ].map((btn, j) => (
                  <motion.button
                    key={j}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${btn.color}`}
                  >
                    {btn.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </StaggerContainer>
    </div>
  );
}
