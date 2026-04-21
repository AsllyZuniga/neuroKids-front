import { motion } from "framer-motion";
import { Play, ArrowLeft } from "lucide-react";
import { startScreenMobileComenzarButton, startScreenMobilePlayIcon } from "@/components/edades/IniciosJuegosLecturas/startScreenMobileClasses";
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import { cn } from "@/components/ui/utils";
import escuchaLeft from "@/assets/Iniciosimages/escuchaelige.svg";
import fondo from "@/assets/7_8/escuchaelige/fondo.svg";
import fondoTelefono from "@/assets/7_8/escuchaelige/fondo_telefono.svg";

interface StartScreenEscuchaEligeProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenEscuchaElige({ onStart, onBack }: StartScreenEscuchaEligeProps) {
  const title = "ESCUCHA Y ELIGE";
  const letters = title.split('');


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.5,
      rotate: -10
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200
      }
    }
  };

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
        playOnClick
        playOnHover
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-[100] pointer-events-auto"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </ButtonWithAudio>

      {/*imagen izquierda*/}
      <motion.img
        src={escuchaLeft}
        alt="Sílabas"
        className="hidden md:block absolute left-6 bottom-6 w-72 lg:w-[26rem] z-10"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0, y: [0, -12, 0] }}
        transition={{
          x: { type: "spring", stiffness: 120 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-pink-300/30 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300/30 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-300/30 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] min-h-screen max-w-4xl flex-col px-4 pb-10 pt-20 text-center sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4 mb-6"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            >

            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-wrap justify-center gap-1 px-2 sm:gap-2 sm:px-4">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className={cn(
                  "inline-block text-[clamp(2rem,8vw,5rem)] max-[480px]:text-[clamp(1.35rem,6vw,2.75rem)]",
                  letter === " " ? "w-4" : ""
                )}
                style={{
                  color: letter === ' ' ? 'transparent' :
                    index % 5 === 0 ? '#FF6B9D' :
                      index % 5 === 1 ? '#C06BE0' :
                        index % 5 === 2 ? '#6B9DFF' :
                          index % 5 === 3 ? '#FFD93D' :
                            '#67E6B8',
                  textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-purple-600 mb-12 text-xl md:text-2xl "
        >
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8 }}
          
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex justify-center mb-6"
          >

          </motion.div>


          <div className="flex flex-col items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >

            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >



              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3"
              >
                {[
                  { emoji: '🎵', text: 'Aprende sonidos' },
                  { emoji: '🎯', text: 'Diviértete jugando' },
                  { emoji: '⭐', text: 'Gana puntos' },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg sm:p-6"
                  >

                    <div className="text-4xl mb-2">{feature.emoji}</div>
                    <p className="text-purple-600">{feature.text}</p>
                  </motion.div>



                ))}
              </motion.div>
              <div className="mt-8 flex justify-center sm:mt-12">
                <ButtonWithAudio
                  onClick={onStart}
                  playOnHover
                  playOnClick
                  size="lg"
                  className={cn(
                    "rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 px-8 py-6 text-xl text-white shadow-lg hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 dyslexia-friendly",
                    startScreenMobileComenzarButton
                  )}
                >
                  <Play className={cn("mr-3 h-8 w-8 fill-white", startScreenMobilePlayIcon)} />
                  ¡Comenzar a Jugar!
                </ButtonWithAudio>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

