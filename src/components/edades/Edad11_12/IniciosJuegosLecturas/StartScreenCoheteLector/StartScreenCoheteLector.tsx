import { motion } from "framer-motion";
import { Rocket, Star, Plane, Sparkles, Moon, Circle, ArrowLeft } from "lucide-react";
import { Button } from "../../../../ui/button";
import { FloatingElement } from "./FloatingElement";
import { AnimatedTitle } from "./AnimatedTitle";

interface StartScreenCoheteLectorProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenCoheteLector({ onStart, onBack }: StartScreenCoheteLectorProps) {
  return (
    <div 
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #E6E6FA 0%, #FFE4F0 30%, #E0F4FF 60%, #F0E6FF 100%)'
      }}
    >

      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>


      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            <Star 
              size={8 + Math.random() * 12} 
              fill="#FFD700" 
              color="#FFD700"
              style={{ filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))' }}
            />
          </motion.div>
        ))}
      </div>


      <div className="absolute top-10 left-10">
        <FloatingElement delay={0} duration={4} yOffset={-30} xOffset={10}>
          <Rocket size={60} color="#FFB3D9" style={{ filter: 'drop-shadow(0 4px 10px rgba(255, 179, 217, 0.5))' }} />
        </FloatingElement>
      </div>

      <div className="absolute top-20 right-20">
        <FloatingElement delay={0.5} duration={5} yOffset={-25} xOffset={-15}>
          <Plane size={50} color="#B8A3FF" style={{ filter: 'drop-shadow(0 4px 10px rgba(184, 163, 255, 0.5))' }} />
        </FloatingElement>
      </div>

      <div className="absolute bottom-32 left-20">
        <FloatingElement delay={1} duration={4.5} yOffset={-20} xOffset={15}>
          <Moon size={55} color="#A3D5FF" fill="#A3D5FF" style={{ filter: 'drop-shadow(0 4px 10px rgba(163, 213, 255, 0.5))' }} />
        </FloatingElement>
      </div>

      <div className="absolute bottom-40 right-32">
        <FloatingElement delay={1.5} duration={5} yOffset={-35} xOffset={-10}>
          <Circle size={65} color="#FFCCE5" fill="#FFCCE5" style={{ filter: 'drop-shadow(0 4px 10px rgba(255, 204, 229, 0.5))' }} />
        </FloatingElement>
      </div>

      <div className="absolute top-1/3 left-1/4">
        <FloatingElement delay={0.8} duration={3.5} yOffset={-15} xOffset={8}>
          <Sparkles size={40} color="#FFE5A3" fill="#FFE5A3" style={{ filter: 'drop-shadow(0 4px 10px rgba(255, 229, 163, 0.5))' }} />
        </FloatingElement>
      </div>

      <div className="absolute top-1/2 right-1/4">
        <FloatingElement delay={1.2} duration={4} yOffset={-20} xOffset={-12}>
          <Rocket size={45} color="#C5B3FF" style={{ filter: 'drop-shadow(0 4px 10px rgba(197, 179, 255, 0.5))' }} />
        </FloatingElement>
      </div>


      <div className="absolute top-1/4 right-1/3">
        <FloatingElement delay={0.3} duration={3} yOffset={-18} xOffset={5}>
          <span className="text-5xl">🚀</span>
        </FloatingElement>
      </div>

      <div className="absolute bottom-1/4 left-1/3">
        <FloatingElement delay={0.6} duration={3.5} yOffset={-22} xOffset={-8}>
          <span className="text-4xl">⭐</span>
        </FloatingElement>
      </div>

      <div className="absolute top-1/2 left-1/5">
        <FloatingElement delay={1.8} duration={4} yOffset={-25} xOffset={10}>
          <span className="text-5xl">🌟</span>
        </FloatingElement>
      </div>

      <div className="absolute top-2/3 right-1/5">
        <FloatingElement delay={2} duration={3.8} yOffset={-20} xOffset={-7}>
          <span className="text-4xl">✨</span>
        </FloatingElement>
      </div>

      <div className="absolute top-1/3 right-1/2">
        <FloatingElement delay={1.4} duration={4.2} yOffset={-28} xOffset={12}>
          <span className="text-5xl">🪐</span>
        </FloatingElement>
      </div>

      <div className="absolute bottom-1/3 right-2/3">
        <FloatingElement delay={0.9} duration={3.6} yOffset={-16} xOffset={-5}>
          <span className="text-4xl">✈️</span>
        </FloatingElement>
      </div>

      <div className="absolute top-3/4 left-2/3">
        <FloatingElement delay={2.2} duration={4.5} yOffset={-24} xOffset={8}>
          <span className="text-5xl">🌙</span>
        </FloatingElement>
      </div>

    
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-7xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4 drop-shadow-lg">
            <AnimatedTitle text="Cohete Lector" />
          </h1>
        </motion.div>


        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-purple-600 text-xl md:text-2xl mb-8 text-center max-w-lg mx-auto dyslexia-friendly"
        >
          ¡Lee textos y responde preguntas para hacer despegar tu cohete! 🚀
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-16"
        >
          <Button
            onClick={onStart}
            size="lg"
            className="px-12 py-8 text-2xl rounded-full shadow-2xl transform transition-all hover:scale-110 dyslexia-friendly"
            style={{
              background: 'linear-gradient(135deg, #FFB3D9 0%, #B8A3FF 100%)',
              border: 'none',
              color: 'white'
            }}
          >
            <Rocket className="mr-3" size={32} />
            Comenzar Juego
          </Button>
        </motion.div>

    
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          <Sparkles size={30} color="#FFD700" fill="#FFD700" />
        </motion.div>
      </div>

 
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 opacity-30"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.5) 100%)'
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity
        }}
      />
    </div>
  );
}


