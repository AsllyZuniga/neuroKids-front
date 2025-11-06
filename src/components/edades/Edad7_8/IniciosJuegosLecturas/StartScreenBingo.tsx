import { motion } from "framer-motion";
import { Sparkles, Play, ArrowLeft, Volume2 } from "lucide-react";
import { ButtonWithAudio } from "../../../ui/ButtonWithAudio";
import { speakText } from "../../../../utils/textToSpeech";

interface StartScreenProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenBingo({ onStart, onBack }: StartScreenProps) {
  const title = "BINGO DE PALABRAS";
  const letters = title.split('');
  const instructions = "¡Escucha palabras y marca tu cartón de bingo!";
  const howToPlay = "Completa el tablero de bingo encontrando las palabras correctas. ¡Haz clic en las letras para formar palabras!";

  // Leer instrucciones al cargar
  const handleReadInstructions = () => {
    speakText(instructions + ". " + howToPlay);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.5,
      rotate: -10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 1.5,
        type: "spring" as const,
        damping: 10,
        stiffness: 100
      }
    },
    hover: { 
      scale: 1.1,
      transition: {
        type: "spring" as const,
        damping: 10,
        stiffness: 400
      }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 100%)'
      }}
    >

      <ButtonWithAudio
        onClick={onBack}
        variant="outline"
        audioText="Volver"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </ButtonWithAudio>


      <motion.div
        className="absolute top-20 left-20 text-yellow-300"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles size={48} />
      </motion.div>

      <motion.div
        className="absolute top-40 right-32 text-pink-300"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <Sparkles size={36} />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-40 text-blue-300"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 15, 0]
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Sparkles size={42} />
      </motion.div>

      <motion.div
        className="absolute bottom-40 right-20 text-purple-300"
        animate={{
          y: [0, 25, 0],
          rotate: [0, -15, 0]
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      >
        <Sparkles size={40} />
      </motion.div>


      <motion.div
        className="text-center z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >

        <div className="mb-12 flex flex-wrap justify-center gap-2 px-4">
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className={`inline-block ${
                letter === ' ' ? 'w-4' : ''
              }`}
              style={{
                fontSize: 'clamp(2rem, 8vw, 5rem)',
                fontWeight: 'bold',
                color: letter === ' ' ? 'transparent' : 
                  index % 5 === 0 ? '#FF6B9D' : 
                  index % 5 === 1 ? '#C06BE0' : 
                  index % 5 === 2 ? '#6B9DFF' : 
                  index % 5 === 3 ? '#FFD93D' : 
                  '#67E6B8',
                textShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
              whileHover={{
                scale: 1.2,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.3 }
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>


        <motion.p
          className="text-purple-600 mb-12 text-xl md:text-2xl dyslexia-friendly"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {instructions} 🎯
        </motion.p>

        {/* Botón para escuchar instrucciones */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mb-8"
        >
          <ButtonWithAudio
            onClick={handleReadInstructions}
            variant="outline"
            audioText="Escuchar instrucciones"
            playOnHover={false}
            playOnClick={true}
            className="bg-white/80 text-purple-600 hover:bg-white border-2 border-purple-300"
          >
            <Volume2 className="w-5 h-5 mr-2" />
            Escuchar instrucciones
          </ButtonWithAudio>
        </motion.div>


        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
        >
          <ButtonWithAudio
            onClick={onStart}
            size="lg"
            audioText="Jugar"
            playOnHover={true}
            playOnClick={true}
            className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white px-12 py-6 rounded-full shadow-lg text-2xl dyslexia-friendly"
          >
            <Play className="mr-3" size={32} />
            ¡Jugar!
          </ButtonWithAudio>
        </motion.div>


        <motion.div
          className="mt-12 bg-white/60 backdrop-blur-sm rounded-3xl p-6 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <h3 className="text-purple-600 mb-3 dyslexia-friendly">¿Cómo jugar?</h3>
          <p className="text-purple-800 text-sm md:text-base dyslexia-friendly">
            {howToPlay}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

