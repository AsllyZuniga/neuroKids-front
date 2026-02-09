import { motion } from "framer-motion";
import { BookOpen, Newspaper, FileText, Star, ArrowLeft, Play } from "lucide-react";
import { Button } from "../../../ui/button";
import { FloatingItem } from "../../../ui/FloatingItem";
import fondo from "../../../../assets/9_10/revista_infantil/fondo.svg";

interface StartScreenRevistaInfantilProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenRevistaInfantil({ onStart, onBack }: StartScreenRevistaInfantilProps) {
  const title = "Revista infantil";
  const letters = title.split('');


  const floatingElements = [
    { icon: BookOpen, emoji: '📚', x: '10%', y: '15%', delay: 0, duration: 3 },
    { icon: Newspaper, emoji: '📰', x: '85%', y: '20%', delay: 0.5, duration: 4 },
    { icon: FileText, emoji: '📖', x: '15%', y: '70%', delay: 1, duration: 3.5 },
    { icon: Star, emoji: '🗒️', x: '80%', y: '65%', delay: 0.3, duration: 4.5 },
    { icon: Star, emoji: '📕', x: '30%', y: '25%', delay: 0.2, duration: 3.6 },
    { icon: BookOpen, emoji: '📓', x: '95%', y: '40%', delay: 0.4, duration: 4.1 },
  ];

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


      {floatingElements.map((element, index) => (
        <FloatingItem
          key={index}
          x={element.x}
          y={element.y}
          delay={element.delay}
          duration={element.duration}
          size="text-4xl md:text-5xl transparent 90%"
          floatY={120}
          floatX={40}
          rotate
        >
          {element.emoji}
        </FloatingItem>
      ))}


      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 ">

        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-6 -translate-y-16">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block text-5xl md:text-7xl lg:text-8xl"
                style={{
                  color: index % 2 === 0 ? '#FF6B9D' : '#C084FC',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                }}
                initial={{ opacity: 0, y: -50, rotate: -180 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring" as const,
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: [0, -10, 10, -10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </div>


        </motion.div>


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
            className="-translate-y-16 text-xl px-10 py-6 bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-full shadow-lg"
          >
            <motion.span
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Play className="w-8 h-8 mr-3 fill-white" />
              ¡Comenzar a Jugar!
            </motion.span>
          </Button>
        </motion.div>

      </div>

      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-white opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

