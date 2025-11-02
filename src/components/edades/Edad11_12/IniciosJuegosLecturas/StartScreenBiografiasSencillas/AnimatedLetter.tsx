import { motion } from "framer-motion";

interface AnimatedLetterProps {
  letter: string;
  index: number;
}

export function AnimatedLetter({ letter, index }: AnimatedLetterProps) {
  return (
    <motion.span
      className="inline-block text-5xl sm:text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dyslexia-friendly"
      style={{
        textShadow: '4px 4px 8px rgba(147, 51, 234, 0.5), -2px -2px 4px rgba(236, 72, 153, 0.3)',
        WebkitTextStroke: '1px rgba(147, 51, 234, 0.3)',
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
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}


