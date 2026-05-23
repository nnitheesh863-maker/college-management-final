import { motion } from 'framer-motion';
import AnimatedCounter from '../animations/AnimatedCounter';
import { fadeUp } from '../../constants/animations';

export default function StatCard({ icon, label, value, index, color, border }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-2xl p-4 text-center border backdrop-blur-sm bg-gradient-to-br ${color} ${border} transition-all duration-300 cursor-default shadow-lg`}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: index * 0.5 }}
        className="text-3xl mb-2 flex justify-center"
      >
        {icon}
      </motion.div>
      <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">
        {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
      </p>
    </motion.div>
  );
}
