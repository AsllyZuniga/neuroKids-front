import { motion } from "framer-motion";

interface AnimatedLetterProps {
  letter: string;
  index: number;
}

export function AnimatedLetter({ letter, index }: AnimatedLetterProps) {
  return (
    <motion.span
      initial={{ y: -50, opacity: 0, rotate: -10 }}
      animate={{ 
        y: 0, 
        opacity: 1, 
        rotate: 0,
        transition: {
          delay: index * 0.1,
          duration: 0.6,
          type: "spring" as const,
          bounce: 0.5
        }
      }}
      whileHover={{ 
        scale: 1.2, 
        rotate: [0, -5, 5, -5, 0],
        transition: { duration: 0.3 }
      }}
      className="inline-block cursor-pointer"
      style={{
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {letter}
    </motion.span>
  );
}

