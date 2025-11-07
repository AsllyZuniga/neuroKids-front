import { motion } from "framer-motion";
import { Sparkles, BookOpen, Play, ArrowLeft } from "lucide-react";
import { ButtonWithAudio } from "../../../../ui/ButtonWithAudio";
import { speakText } from "../../../../../utils/textToSpeech";
import { FloatingEmoji } from "./FloatingEmoji";
import { AnimatedTitle } from "./AnimatedTitle";

interface StartScreenCuentoPictogramasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenCuentoPictogramas({ onStart, onBack }: StartScreenCuentoPictogramasProps) {
  const floatingEmojis = ['📚', '✨', '🌟', '📖', '🎨', '🌈', '⭐', '💫', '🎭', '🎪', '🎨', '🌸', '🦋', '🌺', '🍀'];
  const instructions = `Bienvenido a Cuento con pictogramas. Haz clic en los pictogramas para descubrir sus palabras. Cuando hayas descubierto suficientes, podrás escuchar la historia narrada. ¡Vamos a leer y aprender juntos!`;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Back Button */}
      <ButtonWithAudio
        onClick={onBack}
        playOnHover
        playOnClick
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </ButtonWithAudio>

      <div className="absolute inset-0 overflow-hidden">
        {floatingEmojis.map((emoji, index) => (
          <FloatingEmoji 
            key={index} 
            emoji={emoji} 
            delay={index * 0.3}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.8, 
            type: "spring" as const,
            bounce: 0.6
          }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse" as const
              }}
              className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full p-8 shadow-xl"
            >
              <BookOpen className="w-20 h-20 text-orange-600" />
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-10 h-10 text-yellow-500" />
            </motion.div>
          </div>
        </motion.div>

        <div className="mb-12 text-center">
          <div className="text-6xl md:text-7xl mb-4" style={{ color: '#FF6B9D' }}>
            <AnimatedTitle text="Cuento con pictogramas" />
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="text-xl md:text-2xl mt-6 dyslexia-friendly"
            style={{ color: '#9B87F5' }}
          >
            ¡Lee cuentos con pictogramas que te ayudan a entender mejor!
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full max-w-md">
            <ButtonWithAudio
              onClick={() => speakText(instructions, { voiceType: 'child' })}
              playOnClick
              playOnHover={false}
              variant="outline"
              className="w-full text-xl px-8 py-4 rounded-full shadow-lg dyslexia-friendly bg-orange-500/90 text-white"
            >
              Escuchar instrucciones
            </ButtonWithAudio>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ButtonWithAudio 
              onClick={onStart}
              playOnHover
              playOnClick
              size="lg"
              className="text-xl px-8 py-6 rounded-full shadow-lg dyslexia-friendly"
              style={{ 
                backgroundColor: '#FFB7D5',
                color: '#8B5CF6'
              }}
            >
              <Play className="mr-2 h-6 w-6" />
              Comenzar a Jugar
            </ButtonWithAudio>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="mt-16 flex gap-8 text-5xl"
        >
          {['🎈', '🎁', '🎨'].map((emoji, index) => (
            <motion.span
              key={index}
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                delay: index * 0.2,
                repeat: Infinity,
                repeatType: "reverse" as const
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" className="w-full h-24 md:h-32">
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 1 }}
            fill="#C4B5FD"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </div>
  );
}

