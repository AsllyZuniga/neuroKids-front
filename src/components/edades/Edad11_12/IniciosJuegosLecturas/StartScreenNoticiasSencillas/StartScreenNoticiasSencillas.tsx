import { FloatingElements } from "./FloatingElements";
import { AnimatedTitle } from "./AnimatedTitle";
import { Button } from "../../../../ui/button";
import { ArrowLeft } from "lucide-react";

interface StartScreenNoticiasSencillasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenNoticiasSencillas({ onStart, onBack }: StartScreenNoticiasSencillasProps) {
  const handleStartGame = () => {
    console.log("¡Iniciando juego!");
    onStart();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      <FloatingElements />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <AnimatedTitle />

        <Button
          onClick={handleStartGame}
          size="lg"
          className="mt-12 bg-gradient-to-r from-pink-300 to-purple-300 px-12 py-6 text-purple-900 shadow-lg transition-all hover:scale-110 hover:from-pink-400 hover:to-purple-400 hover:shadow-xl"
        >
          🎮 Comenzar Juego
        </Button>
      </div>
    </div>
  );
}

