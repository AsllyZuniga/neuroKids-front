import { motion } from "framer-motion";
import { Rocket, Star, Sparkles, ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingItem } from "@/components/ui/FloatingItem";
import fondo from "@/assets/11_12/cohete_lector/fondo.svg";

interface StartScreenCoheteLectorProps {
  onStart: () => void;
  onBack: () => void;
}


const title = "Cohete Lector";
const letters = title.split("");

export function StartScreenCoheteLector({ onStart, onBack }: StartScreenCoheteLectorProps) {
  return (
<div
      className="min-h-screen overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${fondo})` }}
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
              fill="#ffeb7c" 
              color="#f8e475"
              style={{ filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))' }}
            />
          </motion.div>
        ))}
      </div>


      <div className="absolute top-10 left-10">
        <FloatingItem delay={0} duration={4} floatY={-30} floatX={10}>
          <Rocket size={60} color="#FFB3D9" style={{ filter: 'drop-shadow(0 4px 10px rgba(255, 179, 217, 0.5))' }} />
        </FloatingItem>
      </div>

      <div className="absolute top-1/3 left-1/4">
        <FloatingItem delay={0.8} duration={3.5} floatY={-15} floatX={8}>
          <Sparkles size={40} color="#fce8b6" fill="#ffebb9" style={{ filter: 'drop-shadow(0 4px 10px rgba(255, 229, 163, 0.5))' }} />
        </FloatingItem>
      </div>

      <div className="absolute top-1/2 right-1/4">
        <FloatingItem delay={1.2} duration={4} floatY={-20} floatX={-12}>
          <Rocket size={45} color="#C5B3FF" style={{ filter: 'drop-shadow(0 4px 10px rgba(197, 179, 255, 0.5))' }} />
        </FloatingItem>
      </div>


    
  <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex justify-center gap-2">
            
                      {letters.map((letter, index) => (
                        <motion.span
                          key={index}
                          className="inline-block text-7xl md:text-7xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"
                          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.15)" }}
                          initial={{ opacity: 0, y: -40, rotate: -10 }}
                          animate={{ opacity: 1, y: 0, rotate: 0 }}
                          transition={{
                            duration: 0.45,
          
                            delay: index * 0.08,
                            type: "spring",
                            bounce: 0.4,
                          }}
                          whileHover={{
                            scale: 1.2,
                            rotate: 5,
                            transition: { duration: 0.2 },
                          }}
                        >
                          {letter === " " ? "\u00A0" : letter}
                        </motion.span>
                      ))}
                    </div>
          
        </motion.div>

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
           <Play className="w-8 h-8 mr-3 fill-white" />
          ¡Comenzar a Jugar!
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


