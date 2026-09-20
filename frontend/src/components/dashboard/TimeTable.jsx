import { motion } from 'framer-motion';
import GlassCard, { GlassCardContent } from '../ui/GlassCard';
import ScrollReveal from '../animations/ScrollReveal';
import StaggerContainer from '../animations/StaggerContainer';
import { TIMETABLE_DATA, SUBJECT_COLORS } from '../../data/mockData';

export default function TimeTable() {
  const days = TIMETABLE_DATA;

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <h2 className="text-2xl font-bold glow-text">⏰ Time Table</h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <GlassCard hoverable glow>
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h3 className="text-white/80 font-semibold flex items-center gap-2">📅 Weekly Schedule</h3>
            <span className="text-white/40 text-xs">Periods 1-6</span>
          </div>
          <GlassCardContent>
            <StaggerContainer>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {days.map((day, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="rounded-xl border bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/20 p-3 text-center border-b border-white/10">
                      <p className="font-bold text-white glow-text text-sm">{day.day}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      {day.periods.map((subject, j) => (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.05 }}
                          className={`p-2 rounded-lg text-xs font-medium text-center border ${
                            subject === 'Lunch'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                              : 'bg-white/5 border-white/10 text-white/70'
                          }`}
                          style={subject !== 'Lunch' ? { borderLeftColor: SUBJECT_COLORS[subject] || '#a855f7', borderLeftWidth: 3 } : {}}
                        >
                          {j + 1}. {subject}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </StaggerContainer>
          </GlassCardContent>
        </GlassCard>
      </ScrollReveal>
    </div>
  );
}
