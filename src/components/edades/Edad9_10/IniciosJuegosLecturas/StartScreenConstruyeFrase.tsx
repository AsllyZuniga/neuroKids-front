import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "../../../ui/button";
import { FloatingItem } from "../../../ui/FloatingItem";
import fondo from "../../../../assets/9_10/construye_frase/background_construye_frase.svg";

interface StartScreenConstruyeFraseProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenConstruyeFrase({
  onStart,
  onBack,
}: StartScreenConstruyeFraseProps) {
  const syllables = [
    { text: "bonito", color: "#FFB5E8", x: 10, y: 20 },
    { text: "luna", color: "#B5DEFF", x: 75, y: 15 },
    { text: "montaña", color: "#BFFCC6", x: 80, y: 65 },
    { text: "jardin", color: "#E0BBE4", x: 5, y: 45 },
    { text: "sol", color: "#FFB5C2", x: 45, y: 10 },
  ];

  const titleWords = [
    { word: "Construye", color: "#9333ea" },
    { word: "la", color: "#ec4899" },
    { word: "frase", color: "#3b82f6" },
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

      {/* 🌟 Floating syllables */}
      <div className="absolute inset-0">
        {syllables.map((s, index) => (
          <FloatingItem
            key={index}
            x={`${s.x}%`}
            y={`${s.y}%`}
            color={s.color}
            delay={index * 0.3}
            size="text-5xl md:text-6xl"
            floatY={120}
            floatX={40}
            rotate
            hover
            pointer
            style={{ fontWeight: "bold" }}
          >
            {s.text}
          </FloatingItem>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="mb-12 text-center">
          <h1 className="flex flex-wrap justify-center gap-4 mb-4 text-6xl md:text-7xl lg:text-8xl dyslexia-friendly">
            {titleWords.map((wordObj, wordIndex) => {
              let letterCount = 0;
              if (wordIndex > 0) {
                for (let i = 0; i < wordIndex; i++) {
                  letterCount += titleWords[i].word.length;
                }
              }

              return (
                <span key={wordIndex} className="inline-block">
                  {wordObj.word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={letterIndex}
                      className="inline-block"
                      style={{ color: wordObj.color }}
                      initial={{ opacity: 0, y: -50, rotate: -10 }}
                      animate={{ opacity: 1, y: 0, rotate: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: (letterCount + letterIndex) * 0.05,
                        type: "spring",
                        stiffness: 200,
                      }}
                      whileHover={{
                        scale: 1.2,
                        y: -10,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 },
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              );
            })}
          </h1>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: "spring" }}
        >
          <Button
            onClick={onStart}
            className="px-12 py-6 text-4xl rounded-3xl bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-2xl flex items-center gap-4"
          >
            <Play className="w-8 h-8 mr-3 fill-white" />
            ¡Comenzar a Jugar!
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
