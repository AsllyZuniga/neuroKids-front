import { motion } from "framer-motion";
import { startScreenMobileComenzarButton, startScreenMobilePlayIcon } from "@/components/edades/IniciosJuegosLecturas/startScreenMobileClasses";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { ArrowLeft, Play } from "lucide-react";
import fondo from "@/assets/11_12/cuentos_interactivos/fondo.svg";
import fondoTelefono from "@/assets/11_12/cuentos_interactivos/fondo_telefono.svg";

interface StartScreenCuentoInteractivoProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenCuentoInteractivo({ onStart, onBack }: StartScreenCuentoInteractivoProps) {
  const title = "Cuentos Interactivos";

  

  return (
    <div className="relative isolate flex min-h-screen min-h-[100dvh] items-center justify-center overflow-x-hidden overflow-y-auto">
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

      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-[100] pointer-events-auto"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

 
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-20 mx-auto flex max-w-6xl flex-col items-center justify-center gap-8 px-4 pb-10 pt-20 sm:gap-12 sm:px-6 sm:pt-24 md:gap-16"
      >

    
        <div className="mb-4 px-4 -translate-y-20">
          <div className="flex flex-row flex-wrap items-center gap-4 mb-2 ">
            {title.split("").map((word, wordIndex) => (
              <div key={wordIndex} className="flex justify-center gap-1 sm:gap-2">
                {word.split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    className="inline-block max-[480px]:text-2xl text-3xl text-purple-600 sm:text-5xl md:text-6xl"
                    initial={{ opacity: 0, y: -100, rotate: -180 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotate: 0,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 0.5,
                      delay: (wordIndex * 8 + index) * 0.05,
                      scale: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse" as const,
                        delay: (wordIndex * 8 + index) * 0.05 + 1,
                      }
                    }}
                    whileHover={{
                      scale: 1.3,
                      rotate: [0, -10, 10, 0],
                      color: "#ec4899",
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      textShadow: '3px 3px 6px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>

        </div>


        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 3.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onStart}
              size="lg"
              className={cn(
                "max-w-[calc(100vw-2rem)] rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 px-8 py-6 text-xl text-white shadow-lg hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 dyslexia-friendly",
                startScreenMobileComenzarButton
              )}
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              <motion.span
                animate={{
                  scale: [1, 1.03, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center gap-3 max-[480px]:gap-2"
              >
                <Play className={cn("mr-3 h-8 w-8 fill-white", startScreenMobilePlayIcon)} />
                ¡Comenzar a Jugar!
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>


      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(90vw,600px)] w-[min(90vw,600px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-purple-200/20 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1.15, 1, 1.15],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/3 top-1/3 h-[min(85vw,500px)] w-[min(85vw,500px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-pink-200/20 to-transparent blur-3xl"
      />
    </div>
  );
}


