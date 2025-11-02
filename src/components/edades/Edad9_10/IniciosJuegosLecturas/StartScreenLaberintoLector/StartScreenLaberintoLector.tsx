import { motion } from "framer-motion";
import { Book, Sparkles, Gem, ArrowLeft } from "lucide-react";
import { Button } from "../../../../ui/button";

interface StartScreenLaberintoLectorProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenLaberintoLector({ onStart, onBack }: StartScreenLaberintoLectorProps) {
  const title = "LABERINTO LECTOR";
  const letters = title.split('');

  const floatingElements = [
    { type: 'book', delay: 0, x: '10%', y: '15%' },
    { type: 'book', delay: 0.5, x: '85%', y: '20%' },
    { type: 'book', delay: 1, x: '15%', y: '70%' },
    { type: 'diamond', delay: 0.3, x: '75%', y: '65%' },
    { type: 'diamond', delay: 0.8, x: '90%', y: '50%' },
    { type: 'emoji', emoji: '📚', delay: 0.2, x: '20%', y: '40%' },
    { type: 'emoji', emoji: '🎯', delay: 0.6, x: '80%', y: '35%' },
    { type: 'emoji', emoji: '⭐', delay: 0.9, x: '25%', y: '85%' },
    { type: 'emoji', emoji: '🧩', delay: 0.4, x: '70%', y: '80%' },
    { type: 'maze', delay: 0.7, x: '5%', y: '55%' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: element.x, top: element.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.6, 
            scale: 1,
            y: [0, -20, 0],
          }}
          transition={{
            opacity: { delay: element.delay, duration: 0.8 },
            scale: { delay: element.delay, duration: 0.8 },
            y: {
              delay: element.delay + 0.8,
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          {element.type === 'book' && (
            <Book className="w-12 h-12 text-indigo-300" strokeWidth={1.5} />
          )}
          {element.type === 'diamond' && (
            <Gem className="w-10 h-10 text-pink-300" strokeWidth={1.5} />
          )}
          {element.type === 'emoji' && (
            <span className="text-4xl">{element.emoji}</span>
          )}
          {element.type === 'maze' && (
            <div className="w-16 h-16 border-4 border-purple-300 rounded-lg relative">
              <div className="absolute top-0 left-0 w-full h-1/2 border-r-4 border-purple-300"></div>
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 border-t-4 border-purple-300"></div>
            </div>
          )}
        </motion.div>
      ))}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" as const, bounce: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-pink-200 rounded-full blur-2xl opacity-50"></div>
            <Book className="relative w-24 h-24 text-indigo-400" strokeWidth={1.5} />
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-4xl">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 dyslexia-friendly"
              style={{ 
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
              initial={{ opacity: 0, y: -50, rotate: -10 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring" as const,
                bounce: 0.4
              }}
              whileHover={{
                scale: 1.2,
                rotate: 5,
                transition: { duration: 0.2 }
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-xl md:text-2xl text-purple-600 mb-12 text-center dyslexia-friendly"
        >
          ¡Navega por el laberinto y responde preguntas de lectura para avanzar! 🧩
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onStart}
            className="px-12 py-6 text-2xl bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 text-purple-800 shadow-2xl rounded-full border-4 border-white dyslexia-friendly"
          >
            <Sparkles className="mr-2 w-6 h-6" />
            Comenzar Juego
          </Button>
        </motion.div>

        <motion.div
          className="mt-16 flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
        >
          {['🌟', '📚', '🎨', '🧠', '🎮'].map((emoji, index) => (
            <motion.span
              key={index}
              className="text-4xl"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                delay: index * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}

