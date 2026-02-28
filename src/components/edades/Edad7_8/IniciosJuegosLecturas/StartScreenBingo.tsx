import { motion } from "framer-motion";
import { Sparkles, Play, ArrowLeft } from "lucide-react";
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import fondo from "@/assets/7_8/bingopalabras/fondo.svg"

interface StartScreenProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenBingo({ onStart, onBack }: StartScreenProps) {
  const titleLine1 = "BINGO";
  const titleLine2 = "DE PALABRAS";


  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.5,
        type: "spring" as const,
        damping: 10,
        stiffness: 100,
      },
    },
  };

  return (
    <div
      className="min-h-screen overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      {/* Botón volver */}
      <ButtonWithAudio
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </ButtonWithAudio>

      {/* Decoraciones */}
      <motion.div
        className="absolute top-20 left-20 text-pink-500"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles size={50} />
      </motion.div>

      <motion.div
        className="absolute top-40 right-32 text-yellow-500"
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Sparkles size={40} />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-40 text-red-500"
        animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Sparkles size={42} />
      </motion.div>

      <motion.div
        className="absolute bottom-40 right-20 text-green-500"
        animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <Sparkles size={60} />
      </motion.div>





      {/* Contenido central */}
      <div className="z-20 flex flex-col items-center justify-center gap-12 px-6 w-full text-center translate-y-32">

        {/* Línea 1 */}
        <div className="flex flex-wrap justify-center gap-2">
          {titleLine1.split("").map((letter, index) => (
            <motion.span
              key={`line1-${index}`}
              animate={{ y: [-6, 6, -6] }}
              transition={{
                duration: 3 + index * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.25 }}
              className="inline-block"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6rem)",

                color:
                  index % 5 === 0
                    ? "#FF6B9D"
                    : index % 5 === 1
                      ? "#C06BE0"
                      : index % 5 === 2
                        ? "#6B9DFF"
                        : index % 5 === 3
                          ? "#FFD93D"
                          : "#67E6B8",
                textShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Línea 2 */}
        <div className="flex flex-wrap justify-center gap-2">
          {titleLine2.split("").map((letter, index) => (
            <motion.span
              key={`line2-${index}`}

              className="inline-block"
              animate={{ y: [-6, 6, -6] }}
              transition={{
                duration: 3 + index * 0.15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.25 }}
              style={{
                fontSize: "clamp(4rem, 7vw, 6rem)",
                color:
                  index % 5 === 0
                    ? "#FF6B9D"
                    : index % 5 === 1
                      ? "#C06BE0"
                      : index % 5 === 2
                        ? "#6B9DFF"
                        : index % 5 === 3
                          ? "#FFD93D"
                          : "#67E6B8",
                textShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>



      {/* Botón Jugar */}
      <motion.div
        className="z-20 mt-6 flex justify-center w-full"
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
      >
        <ButtonWithAudio
          onClick={onStart}
          className="px-50 py-25 text-4xl rounded-3xl bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-2xl hover:shadow-3xl flex gap-4 translate-y-32"
        >
          <Play className="w-8 h-8 mr-3 fill-white" />
          ¡Comenzar a Jugar!
        </ButtonWithAudio>
      </motion.div>


    </div>
  );
}
