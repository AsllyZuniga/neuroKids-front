import { motion } from "framer-motion";
import { Compass, Map, Gem, Star, ArrowLeft, Play } from "lucide-react";
import { Button } from "../../../../ui/button";
import { FloatingElement } from "./FloatingElement";
import { AnimatedTitle } from "./AnimatedTitle";

interface StartScreenMiniAventurasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenMiniAventuras({ onStart, onBack }: StartScreenMiniAventurasProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement delay={0} duration={3.5} yOffset={25}>
          <div className="absolute top-20 left-16 text-6xl opacity-80">
            💎
          </div>
        </FloatingElement>

        <FloatingElement delay={0.5} duration={4} yOffset={30}>
          <div className="absolute top-32 right-24 text-7xl opacity-90">
            🏆
          </div>
        </FloatingElement>

  
        <FloatingElement delay={1} duration={3.8} yOffset={20}>
          <div className="absolute top-1/3 left-12 text-6xl opacity-75">
            🗺️
          </div>
        </FloatingElement>

    
        <FloatingElement delay={1.5} duration={3.2} yOffset={22}>
          <div className="absolute top-1/2 right-16 text-6xl opacity-80">
            👑
          </div>
        </FloatingElement>

  
        <FloatingElement delay={0.8} duration={3.6} yOffset={28}>
          <div className="absolute bottom-32 left-20 text-7xl opacity-85">
            📦
          </div>
        </FloatingElement>


        <FloatingElement delay={0.3} duration={4.2} yOffset={18}>
          <div className="absolute top-24 left-1/3">
            <Compass className="w-16 h-16 text-amber-300 opacity-70" />
          </div>
        </FloatingElement>

 
        <FloatingElement delay={1.2} duration={3.4} yOffset={24}>
          <div className="absolute top-1/4 right-1/4">
            <Map className="w-14 h-14 text-teal-300 opacity-60" />
          </div>
        </FloatingElement>

        <FloatingElement delay={0.6} duration={3.9} yOffset={26}>
          <div className="absolute bottom-1/4 right-12">
            <Gem className="w-16 h-16 text-purple-300 opacity-70" />
          </div>
        </FloatingElement>


        <FloatingElement delay={1.8} duration={3.3} yOffset={20}>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <Star className="w-14 h-14 text-yellow-300 opacity-65 fill-yellow-200" />
          </div>
        </FloatingElement>


        <FloatingElement delay={2} duration={3.7} yOffset={23}>
          <div className="absolute top-2/3 left-1/4 text-5xl opacity-70">
            ⭐
          </div>
        </FloatingElement>

        <FloatingElement delay={1.4} duration={3.5} yOffset={27}>
          <div className="absolute top-1/2 left-2/3 text-6xl opacity-75">
            🎁
          </div>
        </FloatingElement>

        <FloatingElement delay={0.9} duration={4.1} yOffset={21}>
          <div className="absolute bottom-1/3 right-1/3 text-5xl opacity-80">
            🌟
          </div>
        </FloatingElement>
      </div>


      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-7xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 drop-shadow-lg">
            <AnimatedTitle text="MiniAventuras" />
          </h1>
        </motion.div>

        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-purple-600 text-xl md:text-2xl mb-12 text-center max-w-lg dyslexia-friendly"
        >
          ¡Lee aventuras emocionantes y responde preguntas para avanzar! 🏴‍☠️✨
        </motion.p>

      
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5, type: "spring" as const }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white text-xl px-12 py-6 rounded-full shadow-2xl transform transition-all dyslexia-friendly"
          >
            <Play className="w-5 h-5 mr-2" />
            Comenzar Juego
          </Button>
        </motion.div>


        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-16 flex gap-4 text-4xl"
        >
          {['🎯', '🏅', '🎨', '🎪'].map((emoji, index) => (
            <motion.span
              key={index}
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </div>

      
      {Array.from({ length: 15 }).map((_, i) => (
        <FloatingElement 
          key={i} 
          delay={i * 0.3} 
          duration={3 + Math.random() * 2} 
          yOffset={15 + Math.random() * 15}
        >
          <div
            className="absolute text-yellow-300 opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${1 + Math.random() * 1.5}rem`,
            }}
          >
            ✨
          </div>
        </FloatingElement>
      ))}
    </div>
  );
}

