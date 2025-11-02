import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FloatingRevistaElementProps {
  icon: LucideIcon;
  emoji: string;
  x: string;
  y: string;
  delay: number;
  duration: number;
}

export function FloatingRevistaElement({ icon: Icon, emoji, x, y, delay, duration }: FloatingRevistaElementProps) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.5, duration: 0.5 }}
        className="relative"
      >
  
        <Icon className="w-12 h-12 text-purple-300 opacity-40 absolute" />
    
        <span className="text-4xl relative z-10 block">{emoji}</span>
      </motion.div>
    </motion.div>
  );
}

