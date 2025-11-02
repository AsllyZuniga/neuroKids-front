import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Trophy } from "lucide-react";

interface MotivationalMessageProps {
  score: number;
  total: number;
  customMessage?: string;           
  customSubtitle?: string;         
  onComplete: () => void;
}

export function MotivationalMessage({ 
  score, 
  total, 
  customMessage,
  customSubtitle,
  onComplete 
}: MotivationalMessageProps) {
  const percentage = (score / total) * 100;

  const defaultMessage = () => {
    if (percentage === 100) return "¡Perfecto! ¡Eres increíble!";
    if (percentage >= 80) return "¡Excelente trabajo! ¡Casi perfecto!";
    if (percentage >= 60) return "¡Muy bien! ¡Sigue así!";
    return "¡Buen intento! ¡Puedes hacerlo mejor!";
  };

  const defaultSubtitle = `Respondiste ${score} de ${total} preguntas correctamente`;

  React.useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
    >
      <Card className="bg-white/95 backdrop-blur-sm max-w-md mx-auto shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl mb-4 text-gray-800 font-bold">¡Nivel Completado!</h2>
          <p className="text-lg mb-4 text-purple-600 font-medium">
            {customMessage || defaultMessage()}
          </p>
          <p className="text-gray-600 mb-4">
            {customSubtitle || defaultSubtitle}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-yellow-600">+{score * 10} XP ganados</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}