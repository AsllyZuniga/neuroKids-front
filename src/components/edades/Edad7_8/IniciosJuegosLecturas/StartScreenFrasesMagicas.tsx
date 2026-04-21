import { motion } from "framer-motion";
import { Play, ArrowLeft } from "lucide-react";
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import { startScreenMobileComenzarButton, startScreenMobilePlayIcon } from "@/components/edades/IniciosJuegosLecturas/startScreenMobileClasses";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { cn } from "@/components/ui/utils";
import { FloatingItem } from "@/components/ui/FloatingItem";
import fondo from "@/assets/7_8/frasesmagicas/fondo.svg";
import fondoTelefono from "@/assets/7_8/frasesmagicas/fondo_telefono.svg";

interface StartScreenFrasesMagicasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenFrasesMagicas({ onStart, onBack }: StartScreenFrasesMagicasProps) {
  const title = "Frases Mágicas";

  const floatingEmojis = [
    { emoji: '🪄', x: '10%', delay: 0, duration: 8 },
    { emoji: '✨', x: '20%', delay: 1, duration: 7 },
    { emoji: '⭐', x: '30%', delay: 2, duration: 9 },
    { emoji: '💫', x: '70%', delay: 1.5, duration: 7.5 },
    { emoji: '🪄', x: '80%', delay: 2.5, duration: 8 },
    { emoji: '🌟', x: '90%', delay: 4, duration: 8 },
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
        playOnHover
        playOnClick
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-[100] pointer-events-auto"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </ButtonWithAudio>

      {floatingEmojis.map((item, index) => (
        <FloatingItem
          key={index}
          x={item.x}
          y={`${Math.random() * 80}%`}
          delay={item.delay}
          duration={item.duration}
          size="text-3xl md:text-4xl opacity-90"
          floatY={140}
          floatX={40}
          rotate
        >
          {item.emoji}
        </FloatingItem>
      ))}


      <div className="relative z-10 flex min-h-[100dvh] min-h-screen flex-col items-center justify-center px-4 pb-10 pt-20 sm:pt-24">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring" as const, stiffness: 200, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex gap-6 items-center">
            
          
          </div>
        </motion.div>

        <div className="text-center mb-12">
          <h1 className="mb-4 max-[480px]:text-3xl text-4xl leading-tight text-purple-600 sm:text-5xl md:text-7xl">
            {title.replace(/ /g, '\u00A0').split('').map((letter, index) => (
              <span key={index} className="inline-block align-middle">
                <AnimatedText text={letter} />
              </span>
            ))}
          </h1>



        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, type: "spring" as const, stiffness: 200 }}
          className="flex flex-col items-center gap-4"
        >

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ButtonWithAudio
              onClick={onStart}
              playOnHover
              playOnClick
              size="lg"
              className={cn(
                "rounded-full bg-gradient-to-r from-purple-400 to-pink-400 px-8 py-6 text-xl text-white shadow-lg hover:from-purple-500 hover:to-pink-500 dyslexia-friendly",
                startScreenMobileComenzarButton
              )}
            >
              <Play className={cn("mr-3 h-8 w-8 fill-white", startScreenMobilePlayIcon)} />
              ¡Comenzar a Jugar!
            </ButtonWithAudio>
          </motion.div>
        </motion.div>

   
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              repeatDelay: Math.random() * 3,
            }}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

