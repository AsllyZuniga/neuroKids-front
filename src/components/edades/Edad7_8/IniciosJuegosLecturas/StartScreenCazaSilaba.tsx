import { ArrowLeft, Play } from "lucide-react";
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import { motion } from "framer-motion";

import fondo from "@/assets/7_8/cazasilaba/fondo.svg"
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
    ease: "easeInOut",
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
  return (
    <motion.span
      animate={float(delay).animate}
      className={`inline-block ${bg} text-white px-4 py-2 rounded-lg shadow-lg mx-1`}
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



      {/* Contenedor principal */}
      <div className="text-center mb-20 translate-y-32">


          {/* CAZA */}
          <h1 className="text-8xl mb-4">
            <FloatingLetter letter="C" bg="bg-rose-300" delay={0} />
            <FloatingLetter letter="a" bg="bg-purple-300" delay={0.2} />
            <FloatingLetter letter="z" bg="bg-blue-300" delay={0.4} />
            <FloatingLetter letter="a" bg="bg-teal-300" delay={0.6} />
            <motion.span
            />
          </h1>

          {/* LA */}
          <h1 className="text-8xl mb-4">
            <FloatingLetter letter="l" bg="bg-emerald-300" delay={0.8} />
            <FloatingLetter letter="a" bg="bg-amber-300" delay={1} />
          </h1>

          {/* SÍLABA */}
          <h1 className="text-8xl mb-6">
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
            className="bg-gradient-to-br from-teal-300 to-green-400 text-white px-16 py-6 rounded-full text-4xl shadow-2xl border-4 border-teal-400 hover:scale-110 transition-transform uppercase tracking-wide"
          >
            <Play className="w-8 h-8 mr-3 fill-white" />
            ¡Comenzar a Jugar!
          </ButtonWithAudio>
        </div>
      </div>

  );
}
