import { motion } from "framer-motion";
import { Brain, Lightbulb, HelpCircle, Sparkles, Star, Heart, Zap, ArrowLeft } from "lucide-react";
import { Button } from "../../../../ui/button";
import { AnimatedLetter } from "./AnimatedLetter";
import { FloatingElement } from "./FloatingElement";

interface StartScreenPreguntasInferencialesProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenPreguntasInferenciales({ onStart, onBack }: StartScreenPreguntasInferencialesProps) {
  const title = "Preguntas Inferenciales";
  const letters = title.split('');

  const bubbles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 40,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 4,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 overflow-hidden relative flex items-center justify-center p-4">
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>


      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full opacity-20"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            background: `radial-gradient(circle at 30% 30%, rgba(255, 192, 203, 0.8), rgba(147, 112, 219, 0.6))`,
          }}
          animate={{
            y: ['100vh', '-20vh'],
            x: [0, Math.random() * 100 - 50],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}


      <FloatingElement delay={0.2} duration={3} xOffset={15} yOffset={25} style={{ top: '10%', left: '5%' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="w-16 h-16 text-purple-400 drop-shadow-lg" />
        </motion.div>
      </FloatingElement>

      <FloatingElement delay={0.4} duration={3.5} xOffset={-20} yOffset={30} style={{ top: '8%', right: '10%' }}>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <Lightbulb className="w-20 h-20 text-yellow-400 drop-shadow-lg fill-yellow-200" />
        </motion.div>
      </FloatingElement>

      <FloatingElement delay={0.6} duration={4} xOffset={10} yOffset={-20} style={{ top: '65%', left: '3%' }}>
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <HelpCircle className="w-14 h-14 text-blue-400 drop-shadow-lg" />
        </motion.div>
      </FloatingElement>

      <FloatingElement delay={0.3} duration={3.2} xOffset={-15} yOffset={20} style={{ bottom: '10%', right: '5%' }}>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-16 h-16 text-pink-400 drop-shadow-lg" />
        </motion.div>
      </FloatingElement>

      <FloatingElement delay={0.5} duration={2.8} xOffset={20} yOffset={-15} style={{ top: '35%', right: '15%' }}>
        <motion.div
          animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Star className="w-16 h-16 text-yellow-300 drop-shadow-lg fill-yellow-300" />
        </motion.div>
      </FloatingElement>

      <FloatingElement delay={0.7} duration={3.6} xOffset={-10} yOffset={25} style={{ bottom: '35%', left: '8%' }}>
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Heart className="w-14 h-14 text-pink-400 drop-shadow-lg fill-pink-400" />
        </motion.div>
      </FloatingElement>

      <FloatingElement delay={0.9} duration={3.3} xOffset={-15} yOffset={20} style={{ top: '20%', left: '20%' }}>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-14 h-14 text-purple-400 drop-shadow-lg fill-purple-300" />
        </motion.div>
      </FloatingElement>

      <FloatingElement delay={1.1} duration={3.1} xOffset={18} yOffset={-18} style={{ bottom: '20%', right: '20%' }}>
        <Brain className="w-12 h-12 text-blue-300 drop-shadow-lg" />
      </FloatingElement>

  
      <FloatingElement delay={0.2} duration={3.5} xOffset={12} yOffset={-18} style={{ top: '5%', left: '12%' }}>
        <div className="text-5xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            🤔
          </motion.div>
        </div>
      </FloatingElement>

      <FloatingElement delay={0.5} duration={4} xOffset={-15} yOffset={22} style={{ top: '15%', right: '8%' }}>
        <div className="text-5xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
            💭
          </motion.div>
        </div>
      </FloatingElement>

      <FloatingElement delay={0.8} duration={3.2} xOffset={18} yOffset={-20} style={{ top: '75%', left: '15%' }}>
        <div className="text-5xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
            🧠
          </motion.div>
        </div>
      </FloatingElement>

      <FloatingElement delay={1.1} duration={3.8} xOffset={-12} yOffset={18} style={{ bottom: '18%', right: '12%' }}>
        <div className="text-5xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
            💡
          </motion.div>
        </div>
      </FloatingElement>

      <FloatingElement delay={0.4} duration={3.6} xOffset={15} yOffset={-22} style={{ top: '45%', left: '5%' }}>
        <div className="text-5xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}>
            ❓
          </motion.div>
        </div>
      </FloatingElement>

      <FloatingElement delay={1.3} duration={3.4} xOffset={-18} yOffset={20} style={{ bottom: '55%', right: '6%' }}>
        <div className="text-4xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}>
            ✨
          </motion.div>
        </div>
      </FloatingElement>

      <FloatingElement delay={0.6} duration={4.2} xOffset={20} yOffset={-15} style={{ top: '28%', left: '25%' }}>
        <div className="text-4xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
            🌟
          </motion.div>
        </div>
      </FloatingElement>

      <FloatingElement delay={1.5} duration={3.3} xOffset={-14} yOffset={24} style={{ bottom: '8%', left: '35%' }}>
        <div className="text-4xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut" }}>
            🎯
          </motion.div>
        </div>
      </FloatingElement>

      <FloatingElement delay={0.9} duration={3.9} xOffset={16} yOffset={-19} style={{ top: '62%', right: '28%' }}>
        <div className="text-4xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
            🎨
          </motion.div>
        </div>
      </FloatingElement>

      <FloatingElement delay={1.7} duration={3.7} xOffset={-20} yOffset={16} style={{ top: '82%', right: '35%' }}>
        <div className="text-4xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut" }}>
            🌈
          </motion.div>
        </div>
      </FloatingElement>

      <FloatingElement delay={1.2} duration={4.1} xOffset={14} yOffset={-21} style={{ bottom: '42%', left: '22%' }}>
        <div className="text-4xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}>
            💫
          </motion.div>
        </div>
      </FloatingElement>

      <FloatingElement delay={0.7} duration={3.5} xOffset={-16} yOffset={23} style={{ top: '38%', right: '22%' }}>
        <div className="text-4xl drop-shadow-lg">
          <motion.div animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
            ⭐
          </motion.div>
        </div>
      </FloatingElement>

   
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 3,
            repeat: Infinity,
          }}
        />
      ))}

     
      <div className="relative z-10 max-w-5xl w-full">
    
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: 1,
            rotate: 0,
          }}
          transition={{
            type: "spring" as const,
            stiffness: 100,
            delay: 0.5
          }}
          className="mb-8 flex justify-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
              y: [0, -10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 p-8 rounded-full shadow-2xl relative"
          >
            <Brain className="w-24 h-24 text-white drop-shadow-lg" />
      
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <motion.div
                key={angle}
                className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '0 0',
                }}
                animate={{
                  x: [0, Math.cos(angle * Math.PI / 180) * 60],
                  y: [0, Math.sin(angle * Math.PI / 180) * 60],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: angle / 100,
                  repeat: Infinity,
                }}
              />
            ))}
          </motion.div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-12 relative"
        >

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-300/40 via-pink-300/40 to-blue-300/40 blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          <h1 className="relative text-center flex flex-wrap justify-center gap-x-3 gap-y-4 px-4 py-6">
            {letters.map((letter, index) => (
              <AnimatedLetter
                key={index}
                letter={letter === ' ' ? '\u00A0' : letter}
                index={index}
              />
            ))}
          </h1>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="mb-12 relative max-w-2xl mx-auto"
        >
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-xl border-2 border-white/40">
            <p className="text-gray-700 text-center dyslexia-friendly">
              ¡Lee textos, piensa y razona para encontrar las respuestas correctas basándote en pistas e inferencias! 🧠✨
            </p>
          </div>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.6 }}
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
              className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white px-16 py-8 rounded-full shadow-2xl text-xl border-4 border-white/50 dyslexia-friendly"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-7 h-7 mr-3" />
              </motion.div>
              Comenzar Juego
              <motion.div
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Star className="w-7 h-7 ml-3" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>

       
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 0.8 }}
          className="mt-12 flex justify-center gap-8 text-5xl"
        >
          <motion.span
            animate={{
              rotate: [0, 20, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌟
          </motion.span>
          <motion.span
            animate={{
              rotate: [0, -20, 0],
              y: [0, -15, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            🎯
          </motion.span>
          <motion.span
            animate={{
              rotate: [0, 20, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          >
            🎨
          </motion.span>
          <motion.span
            animate={{
              rotate: [0, -20, 0],
              y: [0, -12, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
          >
            🌈
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}


