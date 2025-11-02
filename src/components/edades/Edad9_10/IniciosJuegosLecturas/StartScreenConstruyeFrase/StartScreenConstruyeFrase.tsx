import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "../../../../ui/button";
import { FloatingSyllable } from "./FloatingSyllable";

interface StartScreenConstruyeFraseProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenConstruyeFrase({ onStart, onBack }: StartScreenConstruyeFraseProps) {
  const syllables = [
    { text: 'cons', color: '#FFB5E8', x: 10, y: 20 },
    { text: 'tru', color: '#B5DEFF', x: 75, y: 15 },
    { text: 'ye', color: '#FFF9B5', x: 15, y: 70 },
    { text: 'la', color: '#BFFCC6', x: 80, y: 65 },
    { text: 'fra', color: '#E0BBE4', x: 5, y: 45 },
    { text: 'se', color: '#FFD9B5', x: 85, y: 40 },
    { text: 'pa', color: '#B5FFE9', x: 45, y: 10 },
    { text: 'ra', color: '#FFB5C2', x: 50, y: 75 },
  ];

  const titleWords = [
    { word: "Construye", color: "#9333ea" }, 
    { word: "la", color: "#ec4899" }, 
    { word: "frase", color: "#3b82f6" }, 
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 overflow-hidden relative">
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <div className="absolute inset-0">
        {syllables.map((syllable, index) => (
          <FloatingSyllable
            key={index}
            syllable={syllable.text}
            delay={index * 0.2}
            color={syllable.color}
            x={syllable.x}
            y={syllable.y}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" as const }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-full p-6 shadow-xl">
            <Sparkles className="w-16 h-16 text-purple-400" />
          </div>
        </motion.div>

        <div className="mb-12 text-center">
          <h1 className="flex flex-wrap justify-center gap-4 mb-4 text-6xl md:text-7xl lg:text-8xl dyslexia-friendly">
            {titleWords.map((wordObj, wordIndex) => {
              let letterCount = 0;
              if (wordIndex > 0) {
                for (let i = 0; i < wordIndex; i++) {
                  letterCount += titleWords[i].word.length;
                }
              }
              
              return (
                <span key={wordIndex} className="inline-block">
                  {wordObj.word.split('').map((letter, letterIndex) => (
                    <motion.span
                      key={letterIndex}
                      className="inline-block"
                      style={{ color: wordObj.color }}
                      initial={{ opacity: 0, y: -50, rotate: -10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        rotate: 0,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: (letterCount + letterIndex) * 0.05,
                        type: "spring" as const,
                        stiffness: 200,
                      }}
                      whileHover={{
                        scale: 1.2,
                        y: -10,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 },
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              );
            })}
          </h1>
          <motion.p
            className="text-purple-400 max-w-md mx-auto dyslexia-friendly"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            ¡Combina las sílabas correctamente para construir frases completas!
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" as const }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-12 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-0 dyslexia-friendly"
          >
            <motion.span
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ¡Comenzar a jugar!
            </motion.span>
          </Button>
        </motion.div>

        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-20 w-24 h-24 bg-blue-200/30 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}

