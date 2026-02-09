import { motion } from "framer-motion";
import { Button } from "../../../ui/button";
import { ArrowLeft, Play } from "lucide-react";
import fondo from "../../../../assets/11_12/cuentos_interactivos/fondo.svg";

interface StartScreenCuentoInteractivoProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenCuentoInteractivo({ onStart, onBack }: StartScreenCuentoInteractivoProps) {
  const title = "Cuentos Interactivos";

  

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

 
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 flex flex-col items-center justify-center gap-16 px-8 max-w-6xl"
      >

    
        <div className="mb-4 px-4 -translate-y-20">
          <div className="flex flex-row flex-wrap items-center gap-4 mb-2 ">
            {title.split("").map((word, wordIndex) => (
              <div key={wordIndex} className="flex justify-center gap-1 sm:gap-2">
                {word.split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    className="inline-block text-4xl sm:text-5xl md:text-6xl text-purple-600"
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
              className="-translate-y-20 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 text-white px-8 py-8 rounded-full shadow-xl dyslexia-friendly text-xl"
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
                ¡<Play className="w-8 h-8 mr-3 fill-white" />
          ¡Comenzar a Jugar!
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
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


