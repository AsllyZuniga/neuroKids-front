import { motion } from "framer-motion";

export function FloatingElements() {

  const elements = [
    { emoji: '🏛️', x: '10%', delay: 0 },
    { emoji: '🗽', x: '20%', delay: 0.5 },
    { emoji: '🗼', x: '80%', delay: 1 },
    { emoji: '🎨', x: '15%', delay: 1.5 },
    { emoji: '🔬', x: '85%', delay: 2 },
    { emoji: '⚗️', x: '25%', delay: 2.5 },
    { emoji: '🏆', x: '75%', delay: 3 },
    { emoji: '🎭', x: '90%', delay: 3.5 },
    { emoji: '📚', x: '5%', delay: 4 },
    { emoji: '🌍', x: '70%', delay: 4.5 },
    { emoji: '🗿', x: '30%', delay: 5 },
    { emoji: '🎪', x: '60%', delay: 5.5 },
    { emoji: '🏰', x: '40%', delay: 6 },
    { emoji: '🚀', x: '50%', delay: 6.5 },
    { emoji: '🧪', x: '95%', delay: 7 },
    { emoji: '🎨', x: '35%', delay: 7.5 },
    { emoji: '🌟', x: '65%', delay: 8 },
    { emoji: '🏅', x: '45%', delay: 8.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl md:text-5xl lg:text-6xl opacity-30"
          style={{
            left: element.x,
            top: '-10%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            delay: element.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {element.emoji}
        </motion.div>
      ))}


      {['🇪🇸', '🇫🇷', '🇮🇹', '🇬🇧', '🇺🇸', '🇯🇵', '🇧🇷', '🇲🇽'].map((flag, index) => (
        <motion.div
          key={`flag-${index}`}
          className="absolute text-3xl md:text-4xl opacity-40"
          style={{
            left: `${(index * 12) + 5}%`,
            top: '-5%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.sin(index) * 50, 0],
          }}
          transition={{
            duration: 20 + Math.random() * 5,
            delay: index * 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {flag}
        </motion.div>
      ))}

  
      {['🥇', '🥈', '🥉', '🏅', '🎖️'].map((medal, index) => (
        <motion.div
          key={`medal-${index}`}
          className="absolute text-3xl md:text-4xl opacity-35"
          style={{
            right: `${(index * 15) + 10}%`,
            top: '-5%',
          }}
          animate={{
            y: ['0vh', '110vh'],
            rotate: [-10, 10, -10],
          }}
          transition={{
            duration: 18 + Math.random() * 7,
            delay: index * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {medal}
        </motion.div>
      ))}
    </div>
  );
}


