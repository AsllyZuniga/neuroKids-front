import { motion } from "framer-motion";
import { Button } from "../../../../ui/button";
import { AnimatedLetter } from "./AnimatedLetter";
import { FloatingElement } from "./FloatingElement";
import { Sparkles, ArrowLeft } from "lucide-react";

interface StartScreenCuentoInteractivoProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenCuentoInteractivo({ onStart, onBack }: StartScreenCuentoInteractivoProps) {
  const title = "Cuento Interactivo";

  const colors = [
    '#FF8FA3', 
    '#C89BFF', 
    '#89CFF0', 
    '#FFB3D9', 
    '#B4A7D6', 
    '#A8E6CF', 
    '#FFD89B', 
    '#D4A5FF', 
    '#87CEEB', 
    '#FFB6D9', 
    '#B6E2FF', 
    '#FFE5B4',
    '#E0BBE4', 
    '#A7D7C5', 
    '#FFDAC1', 
    '#C7CEEA', 
    '#FFD5E5', 
    '#B5EAD7', 
  ];

  const floatingEmojis = [
    { emoji: '📚', top: '3%', left: '5%', delay: 0, duration: 4.2, x: 8, y: 20 },
    { emoji: '✨', top: '8%', left: '92%', delay: 0.3, duration: 3.8, x: -6, y: 18 },
    { emoji: '🌟', top: '12%', left: '15%', delay: 0.6, duration: 4.5, x: -10, y: 22 },
    { emoji: '💭', top: '6%', left: '75%', delay: 0.9, duration: 3.6, x: 7, y: 16 },
    { emoji: '🎨', top: '20%', left: '3%', delay: 1.2, duration: 4.0, x: -8, y: 24 },
    { emoji: '🦋', top: '25%', left: '88%', delay: 0.4, duration: 4.8, x: 9, y: 19 },
    { emoji: '🌈', top: '35%', left: '12%', delay: 0.7, duration: 3.9, x: -7, y: 21 },
    { emoji: '📖', top: '40%', left: '95%', delay: 1.0, duration: 4.3, x: 11, y: 17 },
    { emoji: '🎭', top: '55%', left: '2%', delay: 0.2, duration: 3.7, x: -9, y: 23 },
    { emoji: '⭐', top: '60%', left: '90%', delay: 0.5, duration: 4.1, x: 8, y: 20 },
    { emoji: '🎪', top: '72%', left: '5%', delay: 0.8, duration: 4.4, x: -10, y: 18 },
    { emoji: '🎵', top: '78%', left: '93%', delay: 1.1, duration: 3.5, x: 7, y: 22 },
    { emoji: '✏️', top: '85%', left: '10%', delay: 0.35, duration: 4.6, x: -8, y: 19 },
    { emoji: '🎁', top: '90%', left: '85%', delay: 0.65, duration: 3.8, x: 9, y: 21 },
    { emoji: '🌙', top: '15%', left: '45%', delay: 0.95, duration: 4.2, x: -11, y: 17 },
    { emoji: '☁️', top: '30%', left: '55%', delay: 1.25, duration: 4.7, x: 10, y: 23 },
    { emoji: '🎈', top: '45%', left: '35%', delay: 0.15, duration: 3.9, x: -7, y: 20 },
    { emoji: '🌻', top: '65%', left: '60%', delay: 0.45, duration: 4.1, x: 8, y: 18 },
    { emoji: '🧸', top: '80%', left: '40%', delay: 0.75, duration: 4.5, x: -9, y: 22 },
    { emoji: '🎡', top: '50%', left: '70%', delay: 1.05, duration: 3.6, x: 11, y: 19 },
    { emoji: '🌸', top: '70%', left: '25%', delay: 0.25, duration: 4.3, x: -8, y: 21 },
    { emoji: '🦄', top: '18%', left: '28%', delay: 0.55, duration: 3.7, x: 7, y: 17 },
    { emoji: '🎀', top: '88%', left: '65%', delay: 0.85, duration: 4.0, x: -10, y: 23 },
    { emoji: '🌺', top: '10%', left: '50%', delay: 1.15, duration: 4.4, x: 9, y: 20 },
    { emoji: '🎯', top: '95%', left: '30%', delay: 0.4, duration: 3.8, x: -7, y: 18 },
    { emoji: '🌼', top: '38%', left: '48%', delay: 0.7, duration: 4.6, x: 8, y: 22 },
    { emoji: '🍀', top: '58%', left: '62%', delay: 1.0, duration: 3.5, x: -11, y: 19 },
    { emoji: '🎸', top: '82%', left: '75%', delay: 0.3, duration: 4.2, x: 10, y: 21 },
    { emoji: '🎶', top: '5%', left: '65%', delay: 0.5, duration: 4.0, x: -8, y: 19 },
    { emoji: '🌠', top: '22%', left: '38%', delay: 0.8, duration: 3.7, x: 9, y: 21 },
    { emoji: '🪁', top: '48%', left: '18%', delay: 0.2, duration: 3.9, x: 8, y: 20 },
    { emoji: '🎨', top: '68%', left: '82%', delay: 0.6, duration: 4.3, x: -7, y: 22 },
    { emoji: '🦋', top: '42%', left: '52%', delay: 0.9, duration: 3.6, x: 10, y: 17 },
    { emoji: '📚', top: '92%', left: '55%', delay: 1.2, duration: 4.1, x: -9, y: 23 },
    { emoji: '🎭', top: '28%', left: '72%', delay: 0.35, duration: 4.4, x: 7, y: 19 },
    { emoji: '🌈', top: '75%', left: '45%', delay: 0.65, duration: 3.8, x: -11, y: 21 },
    { emoji: '⭐', top: '52%', left: '22%', delay: 0.95, duration: 4.0, x: 8, y: 18 },
    { emoji: '🎁', top: '32%', left: '95%', delay: 0.15, duration: 4.2, x: -8, y: 22 },
    { emoji: '🌙', top: '62%', left: '48%', delay: 0.45, duration: 3.9, x: 9, y: 20 },
    { emoji: '🎵', top: '88%', left: '28%', delay: 0.75, duration: 4.4, x: -10, y: 19 },
    { emoji: '💭', top: '75%', left: '68%', delay: 1.05, duration: 3.7, x: 7, y: 23 },
    { emoji: '🦄', top: '14%', left: '58%', delay: 0.3, duration: 4.1, x: -9, y: 17 },
    { emoji: '🎀', top: '86%', left: '50%', delay: 0.55, duration: 4.5, x: 8, y: 21 },
    { emoji: '🌸', top: '33%', left: '8%', delay: 0.85, duration: 3.6, x: -11, y: 18 },
    { emoji: '🎡', top: '55%', left: '78%', delay: 1.15, duration: 4.3, x: 10, y: 22 },
    { emoji: '🧸', top: '48%', left: '42%', delay: 0.25, duration: 3.8, x: -8, y: 19 },
    { emoji: '✏️', top: '67%', left: '88%', delay: 0.6, duration: 4.0, x: 9, y: 21 },
    { emoji: '🌼', top: '38%', left: '65%', delay: 0.9, duration: 4.4, x: -7, y: 20 },
    { emoji: '🎈', top: '83%', left: '35%', delay: 1.2, duration: 3.7, x: 11, y: 23 },
  ];

  return (
    <div className="size-full min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center overflow-hidden relative">
  
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

    
      {floatingEmojis.map((item, index) => (
        <FloatingElement key={index} delay={item.delay} duration={item.duration} x={item.x} y={item.y}>
          <div
            className="absolute text-3xl md:text-4xl opacity-60"
            style={{ top: item.top, left: item.left }}
          >
            {item.emoji}
          </div>
        </FloatingElement>
      ))}

 
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 flex flex-col items-center justify-center gap-16 px-8 max-w-6xl"
      >

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex items-center gap-4"
        >
          <Sparkles className="w-7 h-7 text-pink-400" />
          <span className="text-2xl text-purple-600/80 dyslexia-friendly font-semibold">¿Qué aventura viviremos hoy?</span>
          <Sparkles className="w-7 h-7 text-purple-400" />
        </motion.div>

    
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {title.split('').map((letter, index) => (
              <AnimatedLetter
                key={index}
                letter={letter}
                delay={0.5 + index * 0.08}
                color={colors[index % colors.length]}
              />
            ))}
          </div>
        </div>

   
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.5 }}
          className="flex flex-col gap-3 w-full max-w-xl"
        >
          <motion.div
            className="bg-gradient-to-r from-pink-100/60 to-purple-100/60 backdrop-blur-sm rounded-xl p-3 shadow-md"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <p className="text-center text-purple-700 dyslexia-friendly font-semibold">
              ✨ Cada historia tiene su propia magia
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-purple-100/60 to-blue-100/60 backdrop-blur-sm rounded-xl p-3 shadow-md"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <p className="text-center text-blue-700 dyslexia-friendly font-semibold">
              🎭 ¿Qué sucederá después? ¡Tú decides!
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-blue-100/60 to-pink-100/60 backdrop-blur-sm rounded-xl p-3 shadow-md"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <p className="text-center text-pink-700 dyslexia-friendly font-semibold">
              🌟 Aprende, imagina y diviértete
            </p>
          </motion.div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 3.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onStart}
              className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 text-white px-14 py-8 rounded-full shadow-xl dyslexia-friendly text-xl font-bold"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              <motion.span
                animate={{
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center gap-3"
              >
                ¡Comenzar Juego! 🎮
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>


        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.8 }}
          className="text-lg text-purple-500/70 text-center dyslexia-friendly"
        >
          Pasa el cursor sobre las letras del título 🎵
        </motion.p>
      </motion.div>


      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-200/20 to-transparent rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1.15, 1, 1.15],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-pink-200/20 to-transparent rounded-full blur-3xl pointer-events-none"
      />
    </div>
  );
}


