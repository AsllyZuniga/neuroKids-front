import { motion } from "framer-motion";

interface AnimatedLetterProps {
  letter: string;
  index: number;
}

export function AnimatedLetter({ letter, index }: AnimatedLetterProps) {
  return (
    <motion.span
      className="inline-block text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dyslexia-friendly"
      initial={{ opacity: 0, y: -50, rotate: -180 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        scale: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse" as const,
          delay: index * 0.05 + 1,
        }
      }}
      whileHover={{
        scale: 1.3,
        rotate: [0, -10, 10, 0],
        transition: { duration: 0.3 }
      }}
      style={{
        textShadow: '3px 3px 6px rgba(0,0,0,0.1)',
        cursor: 'pointer',
      }}
    >
      {letter}
    </motion.span>
  );
}


