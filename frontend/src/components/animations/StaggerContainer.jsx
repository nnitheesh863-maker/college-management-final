import { motion } from 'framer-motion';
import { stagger } from '../../constants/animations';

export default function StaggerContainer({ children, className, delay = 0.1 }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}
