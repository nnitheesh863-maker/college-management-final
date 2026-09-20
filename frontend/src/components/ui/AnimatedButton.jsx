import { motion } from 'framer-motion';

export default function AnimatedButton({ children, onClick, className, variant = 'primary', type = 'button', disabled }) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500',
    danger: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white hover:from-rose-500 hover:to-pink-500',
    ghost: 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg text-sm disabled:opacity-50 ${variants[variant]} ${className || ''}`}
    >
      {children}
    </motion.button>
  );
}
