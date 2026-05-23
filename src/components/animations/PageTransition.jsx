import { motion } from 'framer-motion';
import { pageTransition } from '../../constants/animations';

export default function PageTransition({ children, className }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}
