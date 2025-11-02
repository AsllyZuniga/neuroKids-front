import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, Play } from "lucide-react";
import { Button } from "../../../../ui/button";
import { FloatingElements } from "./FloatingElements";

interface StartScreenOrdenaHistoriaProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenOrdenaHistoria({ onStart, onBack }: StartScreenOrdenaHistoriaProps) {
  const title = "ORDENA LA HISTORIA";
  const letters = title.split('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden relative">
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      
      <FloatingElements />

  
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" as const, bounce: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-2xl opacity-50"></div>
            <BookOpen className="relative w-24 h-24 text-blue-400" strokeWidth={1.5} />
          </div>
        </motion.div>

    
        <div className="mb-8 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dyslexia-friendly"
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
        </div>

    
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-xl md:text-2xl text-purple-600 mb-12 text-center max-w-2xl dyslexia-friendly"
        >
          ¡Arrastra los fragmentos de la historia en el orden correcto para crear una narrativa coherente!
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
            size="lg"
            className="px-12 py-6 text-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-2xl rounded-full border-4 border-white dyslexia-friendly"
          >
            <Play className="mr-2 w-6 h-6" />
            Comenzar Juego
          </Button>
        </motion.div>

    
        <motion.div
          className="mt-16 flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }}
        >
          {['📖', '✏️', '📝', '🎨', '✨'].map((emoji, index) => (
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
    </div>
  );
}

