import { motion } from "framer-motion";
import { Sparkles, Play, ArrowLeft } from "lucide-react";
import { Button } from "../../../../ui/button";
import { FloatingLetter } from "./FloatingLetter";

interface StartScreenPrimeraPalabraProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenPrimeraPalabra({ onStart, onBack }: StartScreenPrimeraPalabraProps) {
  const letters = [
    { letter: 'A', color: '#FFB5E8', x: 10, y: 20 },
    { letter: 'B', color: '#B5DEFF', x: 75, y: 15 },
    { letter: 'C', color: '#FFFFD1', x: 20, y: 60 },
    { letter: 'D', color: '#C4FAF8', x: 80, y: 55 },
    { letter: 'E', color: '#FFD4B5', x: 15, y: 40 },
    { letter: 'F', color: '#E7C6FF', x: 70, y: 35 },
    { letter: 'G', color: '#B5FFB9', x: 45, y: 70 },
    { letter: 'H', color: '#FFC9DE', x: 85, y: 75 },
    { letter: 'I', color: '#C9E4FF', x: 30, y: 25 },
    { letter: 'J', color: '#FFE4B5', x: 60, y: 50 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 overflow-hidden relative">
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <motion.div 
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="text-center">
          <motion.div
            className="flex items-center justify-center gap-4 sm:gap-6 mb-4"
            animate={{ 
              scale: [1, 1.03, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-pink-400" />
            <h1 className="text-6xl sm:text-8xl text-pink-400 drop-shadow-lg dyslexia-friendly">
              Mi Primera Palabra
            </h1>
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400" />
          </motion.div>
          
          <motion.p 
            className="text-2xl sm:text-3xl text-purple-600 drop-shadow-md mb-8 dyslexia-friendly"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ¡Escucha palabras, repítelas y responde preguntas sobre ellas!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pointer-events-auto"
          >
            <Button 
              onClick={onStart}
              size="lg"
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-full px-12 py-8 text-3xl shadow-2xl border-4 border-white transform hover:scale-105 transition-transform dyslexia-friendly"
            >
              <Play className="w-8 h-8 mr-3" />
              Comenzar Juego
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="relative h-screen max-w-6xl mx-auto px-4">
        {letters.map((item, index) => (
          <FloatingLetter
            key={item.letter}
            letter={item.letter}
            color={item.color}
            delay={index * 0.1}
            initialX={item.x}
            initialY={item.y}
          />
        ))}
      </div>

      <div className="fixed top-20 right-10 pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-16 h-16 bg-pink-200 rounded-full opacity-50" />
        </motion.div>
      </div>
      
      <div className="fixed bottom-20 left-10 pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <div className="w-20 h-20 bg-blue-200 rounded-full opacity-50" />
        </motion.div>
      </div>
      <div className="fixed top-1/2 left-5 pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-12 h-12 bg-purple-200 rounded-full" />
        </motion.div>
      </div>
    </div>
  );
}

