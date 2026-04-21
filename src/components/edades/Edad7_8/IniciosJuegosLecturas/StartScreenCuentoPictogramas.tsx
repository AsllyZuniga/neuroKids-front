import { motion } from "framer-motion";
import { Sparkles, BookOpen, Play, ArrowLeft } from "lucide-react";
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import { FloatingItem } from "@/components/ui/FloatingItem";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { startScreenMobileComenzarButton, startScreenMobilePlayIcon } from "@/components/edades/IniciosJuegosLecturas/startScreenMobileClasses";
import { cn } from "@/components/ui/utils";
import fondo from "@/assets/7_8/cuentospictogramas/fondo.svg";
import fondoTelefono from "@/assets/7_8/cuentospictogramas/fondo_telefono.svg";


interface StartScreenCuentoPictogramasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenCuentoPictogramas({
  onStart,
  onBack,
}: StartScreenCuentoPictogramasProps) {
  const floatingEmojis = [
    "📚", "✨", "🌟", "📖", "🎨", "🌈", "⭐", "💫",
    "🎭", "🎪", "🌸", "🦋", "🌺", "🍀",
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

      {/* CAPA DE FONDO (imágenes + emojis flotantes) */}
      <div className="absolute inset-0 z-0 opacity-80">
        {/* Emojis flotantes */}
        {floatingEmojis.map((emoji, index) => (
          <FloatingItem
            key={index}
            x={`${Math.random() * 100}%`}
            y={`${Math.random() * 80}%`}
            delay={index * 0.3}
            duration={8 + Math.random() * 4}
            size="text-2xl md:text-3xl"
            floatY={100}
            floatX={80}
            rotate
          >
            {emoji}
          </FloatingItem>
        ))}



      </div>

      {/* CAPA DE CONTENIDO PRINCIPAL (centrada, encima de todo) */}
      <div className="relative z-20 flex min-h-[100dvh] min-h-screen flex-col items-center justify-center px-4 pb-10 pt-20 sm:px-6 sm:pt-24">
        {/* Botón Volver */}
        <div className="absolute top-4 left-4 z-[100] pointer-events-auto">
          <ButtonWithAudio
            onClick={onBack}
            playOnHover
            playOnClick
            variant="outline"
            className="bg-black/80 text-white border-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </ButtonWithAudio>
        </div>

        {/* Ícono principal */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 p-5 shadow-xl sm:p-8"
            >
              <BookOpen className="h-14 w-14 text-orange-600 sm:h-20 sm:w-20" />
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="h-10 w-10 text-yellow-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Título */}
        <div className="mb-12 md:mb-14">
          <div className="max-[480px]:text-2xl text-3xl sm:text-4xl md:text-5xl text-[#FF6B9D]">
            <AnimatedText text="Cuentos con pictogramas" />
          </div>
        </div>

        {/* Botón principal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          <ButtonWithAudio
            onClick={onStart}
            playOnHover
            playOnClick
            size="lg"
            className={cn(
              "rounded-full px-8 py-6 text-xl shadow-lg dyslexia-friendly",
              startScreenMobileComenzarButton
            )}
            style={{ backgroundColor: "#FFB7D5", color: "#8B5CF6" }}
          >
            <Play className={cn("mr-3 h-8 w-8 fill-white", startScreenMobilePlayIcon)} />
            ¡Comenzar a Jugar!
          </ButtonWithAudio>
        </motion.div>

      </div>
    </div>
  );
}