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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-6"
    >
      <Card className="mx-auto max-h-[min(92dvh,36rem)] w-full max-w-md overflow-y-auto overscroll-contain shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4 text-center sm:p-8">
          <div className="mb-3 text-5xl sm:mb-4 sm:text-6xl">
            {passed ? "🎉" : "🎊"}
          </div>
          <h2 className="mb-3 text-xl font-bold text-gray-800 sm:mb-4 sm:text-2xl">
            {passed ? "¡Bien hecho!" : "¡Inténtalo de nuevo!"}
          </h2>
          <p className="mb-4 text-sm text-gray-600 sm:text-base">
            {passed
              ? isLastLevel
                ? `¡Completaste todos los niveles con ${score} puntos!`
                : `¡Has completado el nivel ${level}!`
              : `Has terminado el nivel con ${score} puntos.`}
          </p>
          <div className="mb-5 flex items-center justify-center gap-2 text-sm sm:mb-6 sm:text-base">
            <Trophy className="h-5 w-5 shrink-0 text-yellow-500" />
            <span className="text-yellow-600">+{score} XP ganados</span>
          </div>

          <div className="flex flex-col gap-3">
            {passed && (
              <Button
                onClick={handlePrimaryAction}
                disabled={isSubmitting}
                className="min-h-12 w-full bg-green-500 text-base text-black hover:bg-green-600 sm:text-lg"
              >
                <ArrowRight className="mr-2 h-5 w-5 shrink-0" />
                {isLastLevel ? "Finalizar" : `Siguiente Nivel (${level + 1})`}
              </Button>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
              <Button
                onClick={onRestart}
                disabled={isSubmitting}
                className="min-h-12 flex-1 bg-purple-500 text-base text-black hover:bg-purple-600 sm:text-lg"
              >
                {passed ? "Repetir Nivel" : "Intentar de nuevo"}
              </Button>
              <Button
                onClick={handleExit}
                disabled={isSubmitting}
                variant="outline"
                className="min-h-12 flex-1 bg-blue-400 text-base text-black sm:text-lg"
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