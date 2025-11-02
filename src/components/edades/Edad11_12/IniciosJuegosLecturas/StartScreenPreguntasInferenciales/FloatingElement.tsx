import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  style?: CSSProperties;
}

export function FloatingElement({ children, delay = 0, duration = 3, yOffset = 20, xOffset = 0, style }: FloatingElementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, x: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, yOffset, yOffset * 2, yOffset * 3],
        x: [0, xOffset, xOffset * 1.5, xOffset * 2],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
        ease: "easeInOut"
      }}
      style={{ position: 'absolute', ...style }}
    >
      {children}
    </motion.div>
  );
}


