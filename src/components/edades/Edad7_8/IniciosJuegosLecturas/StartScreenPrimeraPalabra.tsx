import { motion } from "framer-motion";
import { Play, ArrowLeft } from "lucide-react";
import { startScreenMobileComenzarButton, startScreenMobilePlayIcon } from "@/components/edades/IniciosJuegosLecturas/startScreenMobileClasses";
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import { cn } from "@/components/ui/utils";
import { FloatingItem } from "@/components/ui/FloatingItem";
import fondo from "@/assets/7_8/primerapalabra/fondo.svg";
import fondoTelefono from "@/assets/7_8/primerapalabra/fondo_telefono.svg";

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
    <div className="relative isolate min-h-screen min-h-[100dvh] overflow-x-hidden overflow-y-auto">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 block min-h-full bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${fondoTelefono})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden min-h-full bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: `url(${fondo})` }}
      />
      <ButtonWithAudio
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-[100] pointer-events-auto"
        playOnHover
        playOnClick
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </ButtonWithAudio>

      {/* 🌟 Floating words */}
      <div className="absolute inset-0 pointer-events-none">
        {letters.map((item, index) => (
          <FloatingItem
            key={item.letter}
            x={`${item.x}%`}
            y={`${item.y}%`}
            color={item.color}
            delay={index * 0.15}
            size="text-2xl sm:text-3xl md:text-4xl"
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
        className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-4 py-24 sm:py-28"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="max-w-[min(100%,24rem)] text-center sm:max-w-none">
          <motion.div
            className="mb-4 flex items-center justify-center gap-4 sm:mb-6 sm:gap-6"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <h1 className="max-[480px]:text-2xl text-3xl leading-tight text-red-500 drop-shadow-lg sm:text-5xl md:text-7xl">
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
              className={cn(
                "max-w-full transform rounded-full border-2 border-white/90 bg-gradient-to-r from-pink-400 to-purple-400 px-8 py-6 text-xl text-white shadow-lg transition-transform hover:scale-105 hover:from-pink-400 hover:to-purple-500 dyslexia-friendly",
                startScreenMobileComenzarButton
              )}
              playOnHover
              playOnClick
            >
              <Play className={cn("mr-3 h-8 w-8 fill-white", startScreenMobilePlayIcon)} />
              ¡Comenzar a Jugar!
            </ButtonWithAudio>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
