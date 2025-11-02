import { useState } from 'react';
import { motion } from "framer-motion";
import { Search, Sparkles, BookOpen, Brain, Star, ArrowLeft } from "lucide-react";
import { Button } from "../../../../ui/button";

interface StartScreenDetectivePalabrasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenDetectivePalabras({ onStart, onBack }: StartScreenDetectivePalabrasProps) {
  const [isHovered, setIsHovered] = useState(false);

  const title = "DETECTIVE DE PALABRAS".split("");


  const floatingElements = [
    { icon: "🔍", delay: 0, x: 20, y: -30 },
    { icon: "🕵️", delay: 0.2, x: -40, y: 20 },
    { icon: "📚", delay: 0.4, x: 50, y: 40 },
    { icon: "💡", delay: 0.6, x: -30, y: -20 },
    { icon: "🎯", delay: 0.8, x: 60, y: -40 },
    { icon: "⭐", delay: 1, x: -50, y: 30 },
    { icon: "🔎", delay: 1.2, x: 40, y: -10 },
    { icon: "✨", delay: 1.4, x: -20, y: 50 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4 overflow-hidden relative">

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
          className="absolute text-6xl opacity-40"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
            x: [element.x, element.x + 20, element.x],
            y: [element.y, element.y - 20, element.y],
          }}
          transition={{
            duration: 4,
            delay: element.delay,
            repeat: Infinity,
            repeatType: "reverse" as const,
          }}
          style={{
            left: `${15 + index * 10}%`,
            top: `${10 + (index % 4) * 20}%`,
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      <div className="max-w-4xl w-full text-center relative z-10">
        <motion.div
          className="flex justify-center gap-8 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse" as const,
            }}
          >
            <Search className="w-16 h-16 text-purple-400" strokeWidth={2.5} />
          </motion.div>

          <motion.div
            animate={{
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse" as const,
              delay: 0.5,
            }}
          >
            <BookOpen className="w-16 h-16 text-pink-400" strokeWidth={2.5} />
          </motion.div>

          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse" as const,
              delay: 1,
            }}
          >
            <Brain className="w-16 h-16 text-blue-400" strokeWidth={2.5} />
          </motion.div>
        </motion.div>


        <div className="mb-4 px-4">
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-2">
            {title.map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block text-4xl sm:text-5xl md:text-7xl text-purple-600 dyslexia-friendly"
                initial={{ opacity: 0, y: -100, rotate: -180 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: 0,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse" as const,
                    delay: index * 0.05 + 1,
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
        </div>

    
        <motion.div
          className="mb-12 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>

          <p className="text-lg sm:text-xl text-purple-500 dyslexia-friendly">
            ¡Busca, analiza y descubre el significado de las palabras!
          </p>

          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Star className="w-6 h-6 text-pink-400" />
          </motion.div>
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
              🎮 ¡COMENZAR JUEGO! 🎮
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

   
        <motion.div
          className="mt-16 flex justify-center gap-4 text-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          {["🔍", "📖", "🧩", "🎨", "🌟"].map((emoji, index) => (
            <motion.span
              key={index}
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
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


