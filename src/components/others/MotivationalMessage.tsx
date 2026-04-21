import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Trophy } from "lucide-react";
import { ConfettiExplosion } from "./ConfettiExplosion";
import successMp3 from "@/assets/sounds/correcto.mp3";

interface MotivationalMessageProps {
  score: number;
  total: number;
  customMessage?: string;
  customSubtitle?: string;
  onComplete: () => void;
  celebrationText?: string;
}

const MS_BEFORE_MOTIVATIONAL_CARD = 4000;
const MS_AFTER_XP_CARD_BEFORE_LEVEL_MODAL = 5000;

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
  const [showMotivationalCard, setShowMotivationalCard] = useState(false);

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

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(celebrationMsg);
      utterance.lang = "es-ES";
      utterance.rate = 0.9;
      utterance.pitch = 1.3;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      const childVoice = voices.find(
        (v) =>
          v.name.includes("child") ||
          v.name.includes("niño") ||
          (v.name.includes("Google español") && v.name.includes("Female"))
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

  useEffect(() => {
    const t = setTimeout(
      () => setShowMotivationalCard(true),
      MS_BEFORE_MOTIVATIONAL_CARD
    );
    return () => clearTimeout(t);
  }, []);

  const defaultMessage = () => {
    if (percentage === 100) return "¡Perfecto! ¡Eres increíble!";
    if (percentage >= 80) return "¡Excelente trabajo! ¡Casi perfecto!";
    if (percentage >= 60) return "¡Muy bien! ¡Sigue así!";
    return "¡Buen intento! ¡Puedes hacerlo mejor!";
  };

  const defaultSubtitle = `Respondiste ${score} de ${total} preguntas correctamente`;

  useEffect(() => {
    if (!showMotivationalCard) return;
    const timer = setTimeout(onComplete, MS_AFTER_XP_CARD_BEFORE_LEVEL_MODAL);
    return () => clearTimeout(timer);
  }, [showMotivationalCard, onComplete]);

  return (
    <>
      <ConfettiExplosion show={showCelebration} />

      {!showMotivationalCard && (
        <motion.div
          initial={{ scale: 0, rotate: -180, y: 200 }}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none px-3 sm:px-6"
        >
          <div
            className="max-w-[min(100%,18ch)] text-center font-extrabold leading-tight drop-shadow-2xl animate-pulse break-words hyphens-auto"
            style={{
              fontSize: "clamp(1.75rem, 9vw, 5.5rem)",
              background: "linear-gradient(45deg, #FFD700, #FF6B6B, #4ECDC4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 30px rgba(255,215,0,0.8)",
            }}
          >
            {celebrationMsg}
          </div>
        </motion.div>
      )}

      {showMotivationalCard && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6"
        >
          <Card className="mx-auto max-h-[min(90dvh,32rem)] w-full max-w-md overflow-y-auto overscroll-contain shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardContent className="p-4 text-center sm:p-8">
              <div className="mb-3 text-5xl sm:mb-4 sm:text-6xl">⭐</div>
              <h2 className="mb-3 text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl">
                ¡Nivel Completado!
              </h2>
              <p className="mb-3 text-base text-purple-600 sm:mb-4 sm:text-lg">
                {customMessage || defaultMessage()}
              </p>
              <p className="mb-3 text-sm text-gray-600 sm:mb-4 sm:text-base">
                {customSubtitle || defaultSubtitle}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
                <Trophy className="h-5 w-5 shrink-0 text-yellow-500" />
                <span className="text-yellow-600">+{score} XP ganados</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  );
}
