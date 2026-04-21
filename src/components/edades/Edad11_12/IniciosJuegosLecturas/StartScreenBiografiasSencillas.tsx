import { motion } from "framer-motion";
import { Play, ArrowLeft } from "lucide-react";
import { startScreenMobileComenzarButton, startScreenMobilePlayIcon } from "@/components/edades/IniciosJuegosLecturas/startScreenMobileClasses";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { AnimatedText } from "@/components/ui/AnimatedText";
import fondo from "@/assets/11_12/biografias_sencillas/fondo.svg";
import fondoTelefono from "@/assets/11_12/biografias_sencillas/fondo_telefono.svg";

interface StartScreenBiografiasSencillasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenBiografiasSencillas({ onStart, onBack }: StartScreenBiografiasSencillasProps) {
    const title = ["Biografias", "Sencillas"];


  return (
    <div className="relative isolate flex min-h-screen min-h-[100dvh] items-center justify-center overflow-x-hidden overflow-y-auto p-4 pb-10 pt-16 sm:pt-20">
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




      <div className="relative z-20 w-full max-w-4xl px-2 text-center sm:px-4">


        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12 relative"
        >

          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30 blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <h1 className="relative text-center flex flex-wrap justify-center gap-x-3 gap-y-4 px-4 py-6">
            {title.map((letter, index) => (
              <AnimatedText
                key={index}
                text={letter}
                hoverScale={1.3}
                delay={index * 0.1}
                className="inline-block max-[480px]:text-2xl text-3xl text-purple-600 sm:text-5xl md:text-7xl"
                
              />
            ))}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="text-center relative"
        >

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              delay: 1,
              repeat: Infinity,
            }}
          />

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onStart}
              size="lg"
              className={cn(
                "relative rounded-full border-2 border-white/50 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 px-8 py-6 text-xl font-bold text-white shadow-lg hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 dyslexia-friendly",
                startScreenMobileComenzarButton
              )}
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              
        <Play className={cn("mr-3 h-8 w-8 fill-white", startScreenMobilePlayIcon)} />
          ¡Comenzar a Jugar!
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>

        
      </div>
    </div>
  );
}


