import { motion } from "framer-motion";
import { Compass, Map, Gem, ArrowLeft, Play } from "lucide-react";
import { Button } from "../../../ui/button";
import { FloatingItem } from "../../../ui/FloatingItem";
import fondo from "../../../../assets/9_10/mini_aventuras/fondo.svg";

interface StartScreenMiniAventurasProps {
  onStart: () => void;
  onBack: () => void;

}

const title = "MiniAventuras";
const letters = title.split("");


const floatingItems = [
  { el: "💎", x: "8%", y: "12%" },
  { el: "🏆", x: "85%", y: "18%" },
  { el: "🗺️", x: "6%", y: "38%" },
  { el: "👑", x: "88%", y: "50%" },
  { el: "📦", x: "15%", y: "75%" },

  { el: <Compass className="w-16 h-16 text-amber-300 opacity-80" />, x: "32%", y: "18%" },
  { el: <Map className="w-14 h-14 text-teal-300 opacity-80" />, x: "68%", y: "26%" },
  { el: <Gem className="w-16 h-16 text-purple-300 opacity-80" />, x: "82%", y: "70%" },


];


export function StartScreenMiniAventuras({ onStart, onBack }: StartScreenMiniAventurasProps) {
  return (

    <div
      className="min-h-screen overflow-hidden relative bg-cover bg-center bg-no-repeat"
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
            duration={4}
            style={{ top: item.y, left: item.x }}
          >
            {typeof item.el === "string" ? (
              <div className="text-6xl opacity-80">{item.el}</div>
            ) : (
              item.el
            )}
          </FloatingItem>
        ))}
      </div>



      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 -translate-y-24">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex justify-center gap-2">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block text-7xl md:text-7xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"
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

        </motion.div>



        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5, type: "spring" as const }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white text-xl px-12 py-6 rounded-full shadow-2xl transform transition-all dyslexia-friendly"
          >
           <Play className="w-8 h-8 mr-3 fill-white" />
          ¡Comenzar a Jugar!
          </Button>
        </motion.div>

      </div>


    </div>
  );
}

