import { motion } from "framer-motion";

interface FloatingEmojiMagicoProps {
  emoji: string;
  x: string;
  delay: number;
  duration: number;
}

export function FloatingEmojiMagico({ emoji, x, delay, duration }: FloatingEmojiMagicoProps) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{
        left: x,
        top: `${Math.random() * 80}%`,
        fontSize: '2rem'
      }}
      initial={{ opacity: 0, scale: 0, y: 100 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
        y: [100, -20, -40, -100],
        rotate: [0, Math.random() * 360]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2
      }}
    >
      {emoji}
    </motion.div>
  );
}

