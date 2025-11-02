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
  total,
  level,
  isLastLevel,
  onNextLevel,
  onRestart,
  onExit
}: LevelCompleteModalProps) {
  const passed = score >= 4;
  const required = 4;

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
          <h2 className="text-2xl mb-4 text-gray-800 font-bold">
            {passed ? '¡Bien hecho!' : '¡Inténtalo de nuevo!'}
          </h2>
          <p className="text-gray-600 mb-4">
            {passed
              ? isLastLevel
                ? `¡Completaste todos los niveles con ${score} puntos!`
                : `¡Has completado el nivel ${level}!`
              : `Respondiste ${score} de ${total}. Necesitas ${required} para pasar.`}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-yellow-600">+{score * 10} XP ganados</span>
          </div>

          <div className="flex flex-col gap-3">
            {passed && !isLastLevel && (
              <Button 
                onClick={onNextLevel} 
                className="bg-green-500 hover:bg-green-600 w-full text-lg text.black"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Siguiente Nivel ({level + 1})
              </Button>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={onRestart} 
                className="bg-purple-500 hover:bg-purple-600 flex-01 text-black"
              >
                {passed ? 'Repetir Nivel' : 'Intentar de nuevo'}
              </Button>
              <Button 
                onClick={onExit} 
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