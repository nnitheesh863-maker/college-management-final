import { useSpring, useTransform, useInView, useMotionValueEvent } from 'framer-motion';
import { useRef, useState } from 'react';

export default function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => `${prefix}${Number(v).toFixed(decimals)}${suffix}`);
  const [text, setText] = useState(`${prefix}${(0).toFixed(decimals)}${suffix}`);

  useMotionValueEvent(display, 'change', setText);
  if (isInView) spring.set(value);

  return <span ref={ref}>{text}</span>;
}
