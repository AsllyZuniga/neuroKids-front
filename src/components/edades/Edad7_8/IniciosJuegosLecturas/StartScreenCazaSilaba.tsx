import { ArrowLeft, Play } from "lucide-react";
import { startScreenMobileComenzarButton, startScreenMobilePlayIcon } from "@/components/edades/IniciosJuegosLecturas/startScreenMobileClasses";
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import { cn } from "@/components/ui/utils";
import { motion } from "framer-motion";

import fondo from "@/assets/7_8/cazasilaba/fondo.svg";
import fondoTelefono from "@/assets/7_8/cazasilaba/fondo_telefono.svg";
import silabasRight from "@/assets/Iniciosimages/Silabas.svg";

interface StartScreenCazaSilabaProps {
  onStart: () => void;
  onBack: () => void;
}

/* Animación de flotación */
const float = (delay: number) => ({
  animate: {
    y: [0, -8, 0],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

/* Componente reutilizable para cada letra */
function FloatingLetter({
  letter,
  bg,
  delay,
}: {
  letter: string;
  bg: string;
  delay: number;
}) {
  const { animate, transition } = float(delay);
  return (
    <motion.span
      animate={animate}
      transition={transition}
      className={`inline-block ${bg} text-white max-[480px]:text-xl text-2xl font-bold sm:text-4xl md:text-5xl lg:text-6xl px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md sm:rounded-lg shadow-lg mx-0.5 sm:mx-1`}
    >
      {letter}
    </motion.span>
  );
}

export function StartScreenCazaSilaba({
  onStart,
  onBack,
}: StartScreenCazaSilabaProps) {
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
      {/* Botón volver */}
      <ButtonWithAudio
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white border-white/20 z-[100] pointer-events-auto"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </ButtonWithAudio>

      {/*imagen izquierda*/}
      <motion.img
        src={silabasRight}
        alt="Sílabas"
        className="hidden md:block absolute left-6 bottom-6 w-72 lg:w-[26rem] z-10"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0, y: [0, -12, 0] }}
        transition={{
          x: { type: "spring", stiffness: 120 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      />



      <div className="relative z-20 flex min-h-[100dvh] min-h-screen flex-col items-center justify-center px-3 pb-10 pt-20 text-center sm:px-6 sm:pt-24">
          {/* CAZA */}
          <h1 className="mb-2 flex flex-wrap justify-center sm:mb-4">
            <FloatingLetter letter="C" bg="bg-rose-300" delay={0} />
            <FloatingLetter letter="a" bg="bg-purple-300" delay={0.2} />
            <FloatingLetter letter="z" bg="bg-blue-300" delay={0.4} />
            <FloatingLetter letter="a" bg="bg-teal-300" delay={0.6} />
          </h1>

          {/* LA */}
          <h1 className="mb-2 flex flex-wrap justify-center sm:mb-4">
            <FloatingLetter letter="l" bg="bg-emerald-300" delay={0.8} />
            <FloatingLetter letter="a" bg="bg-amber-300" delay={1} />
          </h1>

          {/* SÍLABA */}
          <h1 className="mb-4 flex flex-wrap justify-center sm:mb-6">
            <FloatingLetter letter="S" bg="bg-pink-300" delay={1.2} />
            <FloatingLetter letter="í" bg="bg-violet-300" delay={1.4} />
            <FloatingLetter letter="l" bg="bg-sky-300" delay={1.6} />
            <FloatingLetter letter="a" bg="bg-cyan-300" delay={1.8} />
            <FloatingLetter letter="b" bg="bg-lime-300" delay={2} />
            <FloatingLetter letter="a" bg="bg-orange-300" delay={2.2} />
          </h1>

          {/* Botón jugar */}
          <ButtonWithAudio
            onClick={onStart}
            size="lg"
            className={cn(
              "rounded-full border-2 border-teal-400/80 bg-gradient-to-br from-teal-300 to-green-400 px-8 py-6 text-xl uppercase tracking-wide text-white shadow-lg transition-transform hover:scale-110",
              startScreenMobileComenzarButton
            )}
          >
            <Play className={cn("mr-3 h-8 w-8 fill-white", startScreenMobilePlayIcon)} />
            ¡Comenzar a Jugar!
          </ButtonWithAudio>
      </div>
    </div>
  );
}
