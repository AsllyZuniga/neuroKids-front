import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "../../../../ui/button";
import { FloatingElements } from "./FloatingElements";
import { AnimatedTitle } from "./AnimatedTitle";

interface StartScreenHistoriasInteractivasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenHistoriasInteractivas({ onStart, onBack }: StartScreenHistoriasInteractivasProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <FloatingElements />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 1, 
            delay: 0.5,
            type: "spring" as const,
            stiffness: 200
          }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl md:text-8xl"
            >
              📚
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-2 -right-2 text-3xl"
            >
              ✨
            </motion.div>
          </div>
        </motion.div>

        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 drop-shadow-lg">
            <AnimatedTitle text="Historias Interactivas" />
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.5 }}
          className="mt-8 mb-12 space-y-3"
        >
          <p className="text-purple-600 text-lg md:text-xl mb-6 dyslexia-friendly">
            ¡Toma decisiones y descubre cómo tu historia se desarrolla de forma única!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-2xl md:text-3xl">
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              title="Descubrimiento"
            >
              🌟
            </motion.span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
              title="Amistad"
            >
              ❤️
            </motion.span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              title="Aventura"
            >
              🚀
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 3 }}
        >
          <Button
            onClick={onStart}
            className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 dyslexia-friendly"
          >
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-6 h-6" />
              <span>Comenzar Juego</span>
              <span className="text-2xl">🎮</span>
            </motion.div>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 3.5 }}
          className="mt-6 text-purple-400 text-sm dyslexia-friendly"
        >
          ¡Cada historia es una nueva aventura de aprendizaje! 🚀
        </motion.p>
      </motion.div>
    </div>
  );
}

