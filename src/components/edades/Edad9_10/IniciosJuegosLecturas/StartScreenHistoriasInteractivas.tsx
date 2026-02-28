import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingItem } from "@/components/ui/FloatingItem";
import fondo from "@/assets/9_10/historias_interactivas/fondo.svg";


interface StartScreenHistoriasInteractivasProps {
  onStart: () => void;
  onBack: () => void;
}
const title1 = "Historias ";
const title2 = "Interactivas";
const letters1 = title1.split("");
const letters2 = title2.split("");


const floatingItems = [
  { el: "📚", x: "8%", y: "12%" },
  { el: "✨", x: "85%", y: "15%" },
  { el: "🎭", x: "12%", y: "35%" },
  { el: "🏰", x: "78%", y: "32%" },
  { el: "🚀", x: "10%", y: "70%" },
  { el: "🎪", x: "88%", y: "65%" },
  { el: "🎨", x: "30%", y: "55%" },
  { el: "🎯", x: "60%", y: "45%" },
  { el: "🌈", x: "22%", y: "80%" },
  { el: "🎵", x: "72%", y: "78%" },
  { el: "🦄", x: "50%", y: "18%" },
  { el: "🎁", x: "90%", y: "48%" },
  { el: "🌟", x: "18%", y: "25%" },
  { el: "🎈", x: "65%", y: "22%" },
  { el: "🧩", x: "42%", y: "88%" },
];

export function StartScreenHistoriasInteractivas({ onStart, onBack }: StartScreenHistoriasInteractivasProps) {
  return (
    
<div
  className="min-h-screen overflow-hidden relative bg-cover bg-center bg-no-repeat flex items-center justify-center bg-white"
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

      <div className="absolute inset-0 pointer-events-none">
        {floatingItems.map((item, i) => (
          <FloatingItem
            key={i}
            delay={i * 0.15}
            duration={6}
            style={{ top: item.y, left: item.x }}
          >
            <div className="text-4xl sm:text-5xl opacity-20">
              {item.el}
            </div>
          </FloatingItem>
        ))}
      </div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto "
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
            
         
          </div>
        </motion.div>

        <div className="mb-8 text-center">
          <div className="flex flex-col items-center gap-2 -translate-y-24">

            {/* LINEA 1 */}
            <div className="flex justify-center gap-2">
              {letters1.map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block text-5xl md:text-7xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.15)" }}
                  initial={{ opacity: 0, y: -40, rotate: -10 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                    type: "spring",
                    bounce: 0.4,
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: 5,
                    transition: { duration: 0.2 },
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>

            {/* LINEA 2 */}
            <div className="flex justify-center gap-2">
              {letters2.map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block text-5xl md:text-7xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.15)" }}
                  initial={{ opacity: 0, y: -40, rotate: -10 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08 + letters1.length * 0.08,
                    type: "spring",
                    bounce: 0.4,
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: 5,
                    transition: { duration: 0.2 },
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </div>

          </div>
        </div>


 

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 3 }}
        >
          <Button
            onClick={onStart}
            className=" -translate-y-24 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transition-all duration-300 "
          >
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-8 h-8 mr-3 fill-white" />
              ¡Comenzar a Jugar!

            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

