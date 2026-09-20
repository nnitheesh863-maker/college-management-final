import { motion } from 'framer-motion';
import GlassCard, { GlassCardContent } from '../ui/GlassCard';
import ScrollReveal from '../animations/ScrollReveal';
import StaggerContainer from '../animations/StaggerContainer';
import { EVENTS_DATA } from '../../data/mockData';

const TYPE_COLORS = {
  academic: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-300',
  sports: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
  meeting: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
  cultural: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-300',
};

const TYPE_ICONS = {
  academic: '📚',
  sports: '🏆',
  meeting: '🤝',
  cultural: '🎭',
};

export default function Events() {
  return (
    <div className="space-y-6">
      <ScrollReveal>
        <h2 className="text-2xl font-bold glow-text">🎉 Events</h2>
      </ScrollReveal>

      <StaggerContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EVENTS_DATA.map((event, i) => {
            const colors = TYPE_COLORS[event.type] || TYPE_COLORS.academic;
            const icon = TYPE_ICONS[event.type] || '📅';
            return (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`rounded-2xl p-5 border bg-gradient-to-br ${colors} backdrop-blur-sm hover:shadow-lg transition-all`}
              >
                <div className="flex items-start gap-3">
                  <motion.span
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-2xl"
                  >
                    {icon}
                  </motion.span>
                  <div className="flex-1">
                    <h4 className="font-bold text-white/90 text-sm">{event.title}</h4>
                    <p className="text-white/50 text-xs mt-1">{event.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-white/40 text-xs">📅 {event.date}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${colors}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </StaggerContainer>
    </div>
  );
}
