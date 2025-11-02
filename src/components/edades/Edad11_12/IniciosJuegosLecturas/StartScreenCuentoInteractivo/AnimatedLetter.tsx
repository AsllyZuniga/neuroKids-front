import { motion } from "framer-motion";

interface AnimatedLetterProps {
  letter: string;
  delay?: number;
  color?: string;
}

export function AnimatedLetter({ letter, delay = 0, color = '#C89BFF' }: AnimatedLetterProps) {
  return (
    <motion.span
      className="inline-block text-6xl sm:text-7xl md:text-8xl font-bold dyslexia-friendly"
      style={{
        color: color,
        textShadow: '4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 4px rgba(255, 255, 255, 0.2)',
        WebkitTextStroke: '1px rgba(0, 0, 0, 0.1)',
        filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2))',
      }}
      initial={{ opacity: 0, y: -50, rotate: -180 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 0.5,
        delay: delay,
        scale: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse" as const,
          delay: delay + 1,
        }
      }}
      whileHover={{
        scale: 1.3,
        rotate: [0, -10, 10, 0],
        transition: { duration: 0.3 }
      }}
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}


