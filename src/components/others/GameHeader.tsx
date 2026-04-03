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
    <header className="mb-6 w-full">
      <div className="flex w-full items-start justify-between gap-2 sm:gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 shrink-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2 shrink-0" />
          Volver
        </Button>
        <Button
          onClick={onRestart}
          variant="outline"
          className="bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 shrink-0"
        >
          <RotateCcw className="w-4 h-4 mr-2 shrink-0" />
          Reiniciar
        </Button>
      </div>

      <div className="mx-auto mt-4 sm:mt-5 max-w-full text-center px-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-black mb-2 leading-tight break-words">
          {title}
          {level !== undefined && (
            <span className="block sm:inline sm:ml-2 text-xl sm:text-3xl md:text-4xl">
              {" "}
              - Nivel {level}
            </span>
          )}
        </h1>
        <motion.div
          key={score}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-center gap-2 text-black"
        >
          <Star className="w-5 h-5 text-yellow-400 fill-current shrink-0" />
          <span>Puntos: {score}</span>
        </motion.div>
      </div>
    </header>
  );
}