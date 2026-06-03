import { motion } from 'framer-motion';

export default function StaggerContainer({ children, className }) {
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
