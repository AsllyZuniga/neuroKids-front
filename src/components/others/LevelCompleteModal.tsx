import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Trophy, ArrowRight } from "lucide-react";

interface LevelCompleteModalProps {
  score: number;
  total: number;
  level: number;
  isLastLevel: boolean;
  onNextLevel?: () => void;
  onRestart: () => void;
  onExit: () => void;
}

export function LevelCompleteModal({
  score,
  level,
  isLastLevel,
  onNextLevel,
  onRestart,
  onExit
}: LevelCompleteModalProps) {
 const passed = true;
 const [isSubmitting, setIsSubmitting] = useState(false);

 const runOnce = async (action: () => void | Promise<void>) => {
   if (isSubmitting) return;
   setIsSubmitting(true);
   try {
     await Promise.resolve(action());
   } catch {
     // Si falla algo inesperado, re-habilitamos botones para reintentar.
     setIsSubmitting(false);
   }
 };

 const handlePrimaryAction = () => {
   runOnce(() => {
     if (isLastLevel) {
       if (onNextLevel) onNextLevel();
       return onExit();
     }
     if (onNextLevel) {
       return onNextLevel();
     }
     return onExit();
   });
 };

 const handleExit = () => {
   runOnce(() => {
     // En el último nivel, primero persistimos y luego salimos sí o sí.
     if (isLastLevel && onNextLevel) {
       onNextLevel();
       return onExit();
     }
     return onExit();
   });
 };


  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
    >
      <Card className="bg-white/95 backdrop-blur-sm max-w-md mx-auto shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">
            {passed ? "🎉" : "🎊"}
          </div>
          <h2 className="text-2xl mb-4 text-gray-800">
            {passed ? '¡Bien hecho!' : '¡Inténtalo de nuevo!'}
          </h2>
          <p className="text-gray-600 mb-4">
            {passed
              ? isLastLevel
                ? `¡Completaste todos los niveles con ${score} puntos!`
                : `¡Has completado el nivel ${level}!`
              : `Has terminado el nivel con ${score} puntos.`
              }

          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-600">+{score} XP ganados</span>
          </div>

          <div className="flex flex-col gap-3">
            {passed && (
              <Button 
                onClick={handlePrimaryAction} 
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 w-full text-lg text.black"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                {isLastLevel ? "Finalizar" : `Siguiente Nivel (${level + 1})`}
              </Button>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={onRestart} 
                disabled={isSubmitting}
                className="bg-purple-500 hover:bg-purple-600 flex-01 text-black"
              >
                {passed ? 'Repetir Nivel' : 'Intentar de nuevo'}
              </Button>
              <Button 
                onClick={handleExit} 
                disabled={isSubmitting}
                variant="outline" 
                className=" bg-blue-400 flex-1 text-black"
              >
                Salir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}