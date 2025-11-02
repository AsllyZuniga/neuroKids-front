import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, Sparkles, Star } from "lucide-react";
import { Button } from "../../../../ui/button";
import { FloatingElements } from "./FloatingElements";
import { AnimatedLetter } from "./AnimatedLetter";

interface StartScreenBiografiasSencillasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenBiografiasSencillas({ onStart, onBack }: StartScreenBiografiasSencillasProps) {
  const title = "Biografías Sencillas";
  const letters = title.split('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 overflow-hidden relative flex items-center justify-center p-4">

      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>


      <FloatingElements />


      <div className="relative z-10 text-center max-w-4xl w-full px-4">
  
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring" as const,
            stiffness: 100,
            delay: 0.5
          }}
          className="mb-8 flex justify-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-8 rounded-full shadow-2xl"
          >
            <BookOpen className="w-24 h-24 text-white drop-shadow-lg" />
          </motion.div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12 relative"
        >

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30 blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <h1 className="relative text-center flex flex-wrap justify-center gap-x-3 gap-y-4 px-4 py-6">
            {letters.map((letter, index) => (
              <AnimatedLetter
                key={index}
                letter={letter === ' ' ? '\u00A0' : letter}
                index={index}
              />
            ))}
          </h1>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="mb-12 relative max-w-2xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border-2 border-purple-300/50">
            <p className="text-purple-700 text-center text-lg md:text-xl font-semibold dyslexia-friendly" style={{
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
            }}>
              ¡Descubre las vidas de personas importantes y aprende sobre sus logros! 📚✨
            </p>
          </div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="text-center relative"
        >

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              delay: 1,
              repeat: Infinity,
            }}
          />

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onStart}
              size="lg"
              className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-16 py-8 rounded-full shadow-2xl text-xl border-4 border-white/50 dyslexia-friendly font-bold"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-7 h-7 mr-3" />
              </motion.div>
              Comenzar Lectura
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Star className="w-7 h-7 ml-3" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="mt-12 flex justify-center gap-8 text-5xl"
        >
          <motion.span
            animate={{
              rotate: [0, 20, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌟
          </motion.span>
          <motion.span
            animate={{
              rotate: [0, -20, 0],
              y: [0, -15, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            🏆
          </motion.span>
          <motion.span
            animate={{
              rotate: [0, 20, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            🎨
          </motion.span>
          <motion.span
            animate={{
              rotate: [0, -20, 0],
              y: [0, -12, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
          >
            📚
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}


