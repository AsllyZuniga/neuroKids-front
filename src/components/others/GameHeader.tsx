import { Button } from "../ui/button";
import { ArrowLeft, RotateCcw, Star } from "lucide-react";
import { motion } from "framer-motion";


interface GameHeaderProps {
  title: string;
  level?: number;
  score: number;
  onBack: () => void;
  onRestart: () => void;
}

export function GameHeader({ 
  title, 
  level, 
  score, 
  onBack, 
  onRestart 
}: GameHeaderProps) {


  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">

        <Button
          onClick={onBack}
          variant="outline"
          className="bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-4xl text-black mb-2 ">
          {title}
          {level !== undefined && <span className="ml-2"> - Nivel {level}</span>}
        </h1>
        <motion.div 
          key={score}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 text-black "
        >
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span>Puntos: {score}</span>
        </motion.div>
      </div>

      <Button
        onClick={onRestart}
        variant="outline"
        className="bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reiniciar
      </Button>
    </div>
  );
}