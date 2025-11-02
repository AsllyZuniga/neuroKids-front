import { motion } from "framer-motion";

interface FloatingLetterProps {
  letter: string;
  color: string;
  delay: number;
  initialX: number;
  initialY: number;
}

export function FloatingLetter({ letter, color, delay, initialX, initialY }: FloatingLetterProps) {
  return (
    <motion.div
      className="absolute select-none cursor-pointer"
      style={{
        left: `${initialX}%`,
        top: `${initialY}%`,
        color: color,
        fontSize: '4rem',
        fontWeight: 'bold',
        pointerEvents: 'auto',
      }}
      initial={{ opacity: 0, scale: 0, y: 100 }}
      animate={{
        opacity: [0, 1, 1, 0.8],
        scale: [0, 1.2, 1, 0.9],
        y: [100, initialY * 5, initialY * 3, initialY * 7],
        rotate: [0, Math.random() * 360 - 180],
        x: [0, Math.random() * 50 - 25],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
        ease: "easeInOut"
      }}
      whileHover={{
        scale: 1.3,
        rotate: [0, 10, -10, 0],
      }}
    >
      {letter}
    </motion.div>
  );
}

