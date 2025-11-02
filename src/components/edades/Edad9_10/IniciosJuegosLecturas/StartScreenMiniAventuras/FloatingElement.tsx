import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export function FloatingElement({ children, delay = 0, duration = 3, yOffset = 20 }: FloatingElementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -yOffset, -yOffset * 2, -yOffset * 3],
        x: [0, Math.sin(Math.random() * Math.PI * 2) * 20, Math.sin(Math.random() * Math.PI * 2) * 20, Math.sin(Math.random() * Math.PI * 2) * 20],
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

