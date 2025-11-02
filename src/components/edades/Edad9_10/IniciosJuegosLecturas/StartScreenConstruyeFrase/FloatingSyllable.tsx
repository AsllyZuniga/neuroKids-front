import { motion } from "framer-motion";

interface FloatingSyllableProps {
  syllable: string;
  delay: number;
  color: string;
  x: number;
  y: number;
}

export function FloatingSyllable({ syllable, delay, color, x, y }: FloatingSyllableProps) {
  return (
    <motion.div
      className="absolute pointer-events-auto select-none cursor-pointer dyslexia-friendly"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        color: color,
        fontSize: '3rem',
        fontWeight: 'bold',
      }}
      initial={{ opacity: 0, scale: 0, y: 100 }}
      animate={{
        opacity: [0, 1, 1, 0.8],
        scale: [0, 1.2, 1, 0.9],
        y: [100, y * 5, y * 3, y * 7],
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
      {syllable}
    </motion.div>
  );
}

