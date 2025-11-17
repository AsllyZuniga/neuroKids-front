import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Trophy } from "lucide-react";
import { ConfettiExplosion } from "./ConfettiExplosion";
import successMp3 from "../../assets/sounds/correcto.mp3"; 

interface MotivationalMessageProps {
  score: number;
  total: number;
  customMessage?: string;
  customSubtitle?: string;
  onComplete: () => void;
  celebrationText?: string; 
}

export function MotivationalMessage({ 
  celebrationText,
  score, 
  total, 
  customMessage,
  customSubtitle,
  onComplete,
  
}: MotivationalMessageProps) {
  const percentage = (score / total) * 100;
  const [showCelebration, setShowCelebration] = useState(false);


  const getCelebrationText = () => {
    if (celebrationText) return celebrationText;
    if (percentage === 100) return "¡PERFECTO!";
    if (percentage >= 80) return "¡EXCELENTE!";
    if (percentage >= 60) return "¡MUY BIEN!";
    return "¡GENIAL!";
  };

  const celebrationMsg = getCelebrationText();

  useEffect(() => {
    setShowCelebration(true);


    const bgAudio = new Audio(successMp3);
    bgAudio.volume = 0.6;
    bgAudio.play().catch(() => {});


    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(celebrationMsg);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1.3;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      const childVoice = voices.find(v => 
        v.name.includes('child') || 
        v.name.includes('niño') || 
        v.name.includes('Google español') && v.name.includes('Female')
      );
      if (childVoice) utterance.voice = childVoice;

      speechSynthesis.speak(utterance);
    }

    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 60000);

    return () => {
      clearTimeout(timer);
      speechSynthesis.cancel(); 
    };
  }, [celebrationMsg]);

  const defaultMessage = () => {
    if (percentage === 100) return "¡Perfecto! ¡Eres increíble!";
    if (percentage >= 80) return "¡Excelente trabajo! ¡Casi perfecto!";
    if (percentage >= 60) return "¡Muy bien! ¡Sigue así!";
    return "¡Buen intento! ¡Puedes hacerlo mejor!";
  };

  const defaultSubtitle = `Respondiste ${score} de ${total} preguntas correctamente`;

  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      <ConfettiExplosion show={showCelebration} />

      <motion.div
        initial={{ scale: 0, rotate: -180, y: 200 }}
        animate={{ scale: 1.4, rotate: 0, y: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]"
      >
        <div 
          className="text-6xl md:text-8xl drop-shadow-2xl animate-pulse"
          style={{ 
            background: "linear-gradient(45deg, #FFD700, #FF6B6B, #4ECDC4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 30px rgba(255,215,0,0.8)",
          }}
        >
          {celebrationMsg}
        </div>
      </motion.div>


      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
      >
        <Card className="bg-white/95 backdrop-blur-sm max-w-md mx-auto shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h2 className="text-2xl mb-4 text-gray-800 ">¡Nivel Completado!</h2>
            <p className="text-lg mb-4 text-purple-600 ">
              {customMessage || defaultMessage()}
            </p>
            <p className="text-gray-600 mb-4">
              {customSubtitle || defaultSubtitle}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-yellow-600">+{score * 10} XP ganados</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}