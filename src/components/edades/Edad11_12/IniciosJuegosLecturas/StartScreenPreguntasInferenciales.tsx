import { motion } from "framer-motion";
import { Brain, ArrowLeft, Play } from "lucide-react";
import { Button } from "../../../ui/button";

import fondo from "../../../../assets/11_12/preguntas_inferenciales/fondo.svg";

interface StartScreenPreguntasInferencialesProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenPreguntasInferenciales({ onStart, onBack }: StartScreenPreguntasInferencialesProps) {
  const title = ["Preguntas", "Inferenciales"];


  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 40,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 4,
  }));




  return (
    <div
      className="min-h-screen overflow-hidden relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${fondo})` }}
    >

      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>


      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full opacity-10"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            background: `radial-gradient(circle at 30% 30%, rgba(255, 192, 203, 0.8), rgba(147, 112, 219, 0.6))`,
          }}
          animate={{
            y: ['100vh', '-20vh'],
            x: [0, Math.random() * 100 - 50],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}




      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 3,
            repeat: Infinity,
          }}
        />
      ))}


      <div className="relative z-10 max-w-5xl w-full -translate-y-24">

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: 0,
          }}
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
            className="bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 p-8 rounded-full shadow-2xl relative"
          >
            <Brain className="w-24 h-24 text-white drop-shadow-lg " />

            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <motion.div
                key={angle}
                className="absolute w-3 h-3 bg-yellow-300 rounded-full "
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                }}
                animate={{
                  x: [0, Math.cos(angle * Math.PI / 180) * 60],
                  y: [0, Math.sin(angle * Math.PI / 180) * 60],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: angle / 100,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12 relative"
        >

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-300/40 via-pink-300/40 to-blue-300/40 blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <div className="mb-4 px-4">
            <div className="flex flex-col items-center gap-2 mb-2">
              {title.map((word, wordIndex) => (
                <div key={wordIndex} className="flex justify-center gap-1 sm:gap-2 ">
                  {word.split("").map((letter, index) => (
                    <motion.span
                      key={index}
                      className="inline-block text-4xl sm:text-5xl md:text-7xl text-purple-600 "
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.6 }}
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
              className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white px-8 py-6 rounded-full shadow-2xl text-xl border-4 border-white/50 "
            >
              <Play className="w-8 h-8 mr-3 fill-white" />
              ¡Comenzar a Jugar!

            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}


