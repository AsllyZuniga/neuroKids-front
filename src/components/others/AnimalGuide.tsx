import { Volume2, RotateCcw } from 'lucide-react';
import { Button } from "../ui/button";

interface AnimalGuideProps {
  animal: 'owl' | 'turtle' | 'monkey';
  message: string;
  onRepeat?: () => void;
  className?: string;
}

const animalEmojis = {
  owl: '🦉',
  turtle: '🐢', 
  monkey: '🐵'
};

const animalNames = {
  owl: 'Búho Lector',
  turtle: 'Tortuga Sabia', 
  monkey: 'Mono Curioso'
};

export function AnimalGuide({ animal, message, onRepeat, className = '' }: AnimalGuideProps) {
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
    onRepeat?.();
  };

  return (
    <div className={` w-900 flex items-center gap-4 p-4 bg-white/90 rounded-2xl shadow-lg border-2 border-orange-200 ${className}`}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center text-3xl">
          {animalEmojis[animal]}
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
          💡
        </div>
      </div>
      
      <div className="flex-1">
        <h4 className="text-orange-600 mb-1 font-semibold">{animalNames[animal]}</h4>
        <p className="text-gray-700">{message}</p>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSpeak}
          size="sm"
          variant="outline"
          className="rounded-full p-2 border-orange-300 hover:bg-orange-50"
        >
          <Volume2 className="w-4 h-4 text-orange-600" />
        </Button>
        {onRepeat && (
          <Button
            onClick={onRepeat}
            size="sm"
            variant="outline"
            className="rounded-full p-2 border-blue-300 hover:bg-blue-50"
          >
            <RotateCcw className="w-4 h-4 text-blue-600" />
          </Button>
        )}
      </div>
    </div>
  );
}