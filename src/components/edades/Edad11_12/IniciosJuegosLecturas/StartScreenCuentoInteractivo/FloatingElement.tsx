import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}

export function FloatingElement({ children, delay = 0, duration = 3, x = 0, y = 20 }: FloatingElementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.5, 1, 0.7, 0.5],
        scale: [0, 1, 1.1, 1],
        x: [0, x * 2, x, 0],
        y: [0, y, y * 2, y * 3],
        rotate: [0, Math.random() * 360],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
        ease: "easeInOut"
      }}
      style={{ position: 'absolute' }}
    >
      {children}
    </motion.div>
  );
}


