import { motion } from "framer-motion";
import { Play, ArrowLeft } from "lucide-react";
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import { FloatingItem } from "@/components/ui/FloatingItem";
import fondo from "@/assets/7_8/primerapalabra/fondo.svg"

interface StartScreenPrimeraPalabraProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenPrimeraPalabra({ onStart, onBack }: StartScreenPrimeraPalabraProps) {
  const letters = [
    { letter: "Angel", color: "#FFB5E8", x: 5, y: 20 },
    { letter: "Bote", color: "#B5DEFF", x: 80, y: 15 },
    { letter: "Coco", color: "#FFFFD1", x: 20, y: 90 },
    { letter: "Dedo", color: "#C4FAF8", x: 80, y: 55 },
    { letter: "Eso", color: "#FFD4B5", x: 5, y: 50 },
    { letter: "Faro", color: "#E7C6FF", x: 90, y: 35 },
    { letter: "Gota", color: "#B5FFB9", x: 45, y: 90 },
    { letter: "Helado", color: "#FFC9DE", x: 65, y: 90 },
    { letter: "Iglesia", color: "#C9E4FF", x: 10, y: 25 },
  ];

  return (
<div
      className="min-h-screen overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      <ButtonWithAudio
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
        playOnHover
        playOnClick
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </ButtonWithAudio>

      {/* 🌟 Floating words */}
      <div className="absolute inset-0">
        {letters.map((item, index) => (
          <FloatingItem
            key={item.letter}
            x={`${item.x}%`}
            y={`${item.y}%`}
            color={item.color}
            delay={index * 0.15}
            size="text-4xl md:text-3xl"
            floatY={140}
            floatX={50}
            rotate
            hover
            pointer
          >
            {item.letter}
          </FloatingItem>
        ))}
      </div>

      <motion.div
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >

        <div className="text-center">
          <motion.div
            className="flex items-center justify-center gap-4 sm:gap-6 mb-4"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <h1 className="text-5xl sm:text-7xl text-red-500 drop-shadow-lg -translate-y-32">
              Mi Primera Palabra
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pointer-events-auto"
          >
            <ButtonWithAudio
              onClick={onStart}
              size="lg"
              className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-400 hover:to-purple-500 text-white rounded-full px-12 py-8 text-3xl shadow-2xl border-4 border-white transform hover:scale-105 transition-transform -translate-y-24"
              playOnHover
              playOnClick
            >
              <Play className="w-8 h-8 mr-3 fill-white" />
              ¡Comenzar a Jugar!
            </ButtonWithAudio>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
