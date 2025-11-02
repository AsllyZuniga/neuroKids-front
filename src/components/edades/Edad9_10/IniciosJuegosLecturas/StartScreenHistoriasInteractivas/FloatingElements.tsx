import { motion } from "framer-motion";

export function FloatingElements() {
  const elements = [
    { emoji: '📚', delay: 0, x: '10%', duration: 20 },
    { emoji: '✨', delay: 2, x: '80%', duration: 18 },
    { emoji: '🎭', delay: 4, x: '20%', duration: 22 },
    { emoji: '🏰', delay: 1, x: '70%', duration: 25 },
    { emoji: '🚀', delay: 3, x: '15%', duration: 19 },
    { emoji: '🎪', delay: 5, x: '85%', duration: 21 },
    { emoji: '🎨', delay: 2.5, x: '40%', duration: 23 },
    { emoji: '🎯', delay: 1.5, x: '60%', duration: 20 },
    { emoji: '🌈', delay: 4.5, x: '30%', duration: 24 },
    { emoji: '🎵', delay: 3.5, x: '75%', duration: 18 },
    { emoji: '🦄', delay: 0.5, x: '50%', duration: 22 },
    { emoji: '🎁', delay: 2.8, x: '90%', duration: 19 },
    { emoji: '🌟', delay: 1.8, x: '25%', duration: 21 },
    { emoji: '🎈', delay: 4.2, x: '65%', duration: 20 },
    { emoji: '🧩', delay: 3.2, x: '45%', duration: 23 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl sm:text-5xl opacity-30"
          style={{
            left: element.x,
            top: '-10%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 360],
            x: [0, Math.sin(index) * 50, 0],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {element.emoji}
        </motion.div>
      ))}
    </div>
  );
}


