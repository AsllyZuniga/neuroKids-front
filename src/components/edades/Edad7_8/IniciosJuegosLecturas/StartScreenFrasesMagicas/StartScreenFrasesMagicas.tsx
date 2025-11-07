import { motion } from "framer-motion";
import { Sparkles, Wand2, ArrowLeft } from "lucide-react";
import { ButtonWithAudio } from "../../../../ui/ButtonWithAudio";
import { speakText } from "../../../../../utils/textToSpeech";
import { AnimatedLetter } from "../StartScreenCuentoPictogramas/AnimatedLetter";
import { FloatingEmojiMagico } from "./FloatingEmojiMagico";

interface StartScreenFrasesMagicasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenFrasesMagicas({ onStart, onBack }: StartScreenFrasesMagicasProps) {
  const title = "Frases Mágicas";
  const instructions = `Bienvenido a Frases Mágicas. Escucha la frase completa y luego activa el micrófono. Di la palabra mágica con voz clara para activar la magia. ¡Vamos a practicar tu pronunciación!`;
  
  const floatingEmojis = [
    { emoji: '🪄', x: '10%', delay: 0, duration: 8 },
    { emoji: '✨', x: '20%', delay: 1, duration: 7 },
    { emoji: '⭐', x: '30%', delay: 2, duration: 9 },
    { emoji: '🌟', x: '50%', delay: 0.5, duration: 8.5 },
    { emoji: '💫', x: '70%', delay: 1.5, duration: 7.5 },
    { emoji: '🪄', x: '80%', delay: 2.5, duration: 8 },
    { emoji: '✨', x: '90%', delay: 3, duration: 9 },
    { emoji: '⭐', x: '15%', delay: 3.5, duration: 7 },
    { emoji: '🌟', x: '60%', delay: 4, duration: 8 },
    { emoji: '💫', x: '40%', delay: 2, duration: 7.5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 overflow-hidden relative">
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

      {floatingEmojis.map((item, index) => (
        <FloatingEmojiMagico
          key={index}
          emoji={item.emoji}
          x={item.x}
          delay={item.delay}
          duration={item.duration}
        />
      ))}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring" as const, stiffness: 200, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex gap-6 items-center">
            <motion.div
              animate={{ 
                rotate: [0, -15, 0, 15, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <Wand2 className="w-16 h-16 text-purple-400" strokeWidth={1.5} />
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-20 h-20 text-yellow-300" fill="currentColor" />
            </motion.div>
            <motion.div
              animate={{ 
                rotate: [0, 15, 0, -15, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <Wand2 className="w-16 h-16 text-pink-400" strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>

        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl text-purple-600 mb-4 dyslexia-friendly">
            {title.split('').map((letter, index) => (
              <AnimatedLetter key={index} letter={letter} index={index} />
            ))}
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-xl md:text-2xl text-purple-500 mt-4 dyslexia-friendly"
          >
            ¡Repite las frases mágicas y practica tu pronunciación!
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, type: "spring" as const, stiffness: 200 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full max-w-md">
            <ButtonWithAudio
              onClick={() => speakText(instructions, { voiceType: 'child' })}
              playOnClick
              playOnHover={false}
              variant="outline"
              className="w-full bg-orange-500/90 text-white text-xl px-8 py-4 rounded-full shadow-lg dyslexia-friendly"
            >
              Escuchar instrucciones
            </ButtonWithAudio>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ButtonWithAudio 
              onClick={onStart}
              playOnHover
              playOnClick
              size="lg"
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white text-xl px-8 py-6 rounded-full shadow-lg dyslexia-friendly"
            >
              <Sparkles className="mr-2 w-6 h-6" />
              ¡Empezar a Jugar!
            </ButtonWithAudio>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-16 flex gap-8 text-5xl"
        >
          {['🎨', '📚', '🎯', '🎪'].map((emoji, index) => (
            <motion.span
              key={index}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
              className="inline-block"
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ 
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              repeatDelay: Math.random() * 3,
            }}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

