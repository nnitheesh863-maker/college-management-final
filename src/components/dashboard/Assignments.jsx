import { motion } from 'framer-motion';
import GlassCard, { GlassCardContent } from '../ui/GlassCard';
import ScrollReveal from '../animations/ScrollReveal';
import StaggerContainer from '../animations/StaggerContainer';
import StatusBadge from '../ui/StatusBadge';
import { ASSIGNMENTS_DATA } from '../../data/mockData';

export default function Assignments() {
  return (
    <div className="space-y-6">
      <ScrollReveal>
        <h2 className="text-2xl font-bold glow-text">📝 Assignments</h2>
      </ScrollReveal>

      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASSIGNMENTS_DATA.map((a, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="rounded-2xl p-5 border bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all border-white/10 cursor-default"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-white/90 text-sm">{a.title}</h4>
                <StatusBadge status={a.status}>{a.status}</StatusBadge>
              </div>
              <p className="text-white/50 text-sm mb-1">{a.subject}</p>
              <p className="text-white/40 text-xs">Due: {a.due}</p>
              <motion.div
                className="mt-3 w-full bg-white/10 rounded-full h-1"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.random() * 60 + 20}%` }}
                  transition={{ delay: i * 0.2, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </StaggerContainer>
    </div>
  );
}
