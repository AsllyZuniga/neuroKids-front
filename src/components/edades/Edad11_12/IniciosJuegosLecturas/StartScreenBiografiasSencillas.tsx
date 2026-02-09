import { motion } from "framer-motion";
import { Play, ArrowLeft } from "lucide-react";
import { Button } from "../../../ui/button";
import { AnimatedText } from "../../../ui/AnimatedText";
import fondo from '../../../../assets/11_12/biografias_sencillas/fondo.svg';

interface StartScreenBiografiasSencillasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenBiografiasSencillas({ onStart, onBack }: StartScreenBiografiasSencillasProps) {
    const title = ["Biografias", "Sencillas"];


  return (
    
<div className="min-h-screen overflow-hidden relative bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" style={{ backgroundImage: `url(${fondo})` }}>
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>




      <div className="relative z-10 text-center max-w-4xl w-full px-4 -translate-y-24">


        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12 relative"
        >

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-blue-400/30 blur-xl"
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
                className="inline-block text-4xl sm:text-5xl md:text-7xl text-purple-600 "
                
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
              className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-16 py-8 rounded-full shadow-2xl text-xl border-4 border-white/50 dyslexia-friendly font-bold"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              
        <Play className="w-8 h-8 mr-3 fill-white" />
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


