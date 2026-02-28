import { useState } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import fondo from '../../../../assets/11_12/detective_palabras/fondo.svg';

interface StartScreenDetectivePalabrasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenDetectivePalabras({ onStart, onBack }: StartScreenDetectivePalabrasProps) {
  const [isHovered, setIsHovered] = useState(false);

  const title = ["DETECTIVE", "DE PALABRAS"];


  return (

    <div className="min-h-screen overflow-hidden relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${fondo})` }}>

      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>


      <div className="max-w-4xl w-full text-center relative z-10 mx-auto">
        <motion.div
          className="flex justify-center gap-8 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
        </motion.div>


        <div className="mb-4 px-4">
          <div className="flex flex-col items-center gap-2 mb-2">
            {title.map((word, wordIndex) => (
              <div key={wordIndex} className="flex justify-center gap-1 sm:gap-2">
                {word.split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    className="inline-block text-4xl sm:text-5xl md:text-7xl text-purple-600"
                    initial={{ opacity: 0, y: -100, rotate: -180 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotate: 0,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 0.5,
                      delay: (wordIndex * 8 + index) * 0.05,
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse" as const,
                        delay: (wordIndex * 8 + index) * 0.05 + 1,
                      }
                    }}
                    whileHover={{
                      scale: 1.3,
                      rotate: [0, -10, 10, 0],
                      color: "#ec4899",
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      textShadow: '3px 3px 6px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>

        </div>


        <motion.div
          className="mb-12 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >


        </motion.div>


        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <Button
            onClick={onStart}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-12 py-8 rounded-full shadow-2xl text-2xl relative overflow-hidden dyslexia-friendly"
            size="lg"
          >
            <motion.span
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex items-center gap-3"
            >
              <Play className="w-8 h-8 mr-3 fill-white" />
              ¡Comenzar a Jugar!
            </motion.span>


            <motion.div
              className="absolute inset-0 bg-white opacity-0"
              animate={{
                opacity: isHovered ? 0.2 : 0,
              }}
              transition={{ duration: 0.3 }}
            />


            {isHovered && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 0.5,
                    }}
                    animate={{
                      x: Math.cos((i * Math.PI * 2) / 6) * 60,
                      y: Math.sin((i * Math.PI * 2) / 6) * 60,
                      opacity: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: 0.2,
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </>
            )}
          </Button>
        </motion.div>

      </div>
    </div>
  );
}


