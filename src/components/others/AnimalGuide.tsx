import { Volume2, RotateCcw } from 'lucide-react';
import { Button } from "../ui/button";
import buho from '../../assets/Animalguia/buho.svg';
import rana from '../../assets/Animalguia/rana.svg';
import mono from '../../assets/Animalguia/mono.svg';
import pez from '../../assets/Animalguia/pez.svg';
import koala from '../../assets/Animalguia/koala.svg';
import oso from '../../assets/Animalguia/oso.svg';

interface AnimalGuideProps {
  animal: 'owl' | 'frog' | 'monkey' | 'fish' | 'koala' | 'bear';
  message: string;
  onRepeat?: () => void;
  className?: string;
}



const animalImages = {
  owl: buho,
  monkey: mono,
  frog: rana,
  fish: pez,
  koala: koala,
  bear : oso

}

const animalNames = {
  owl: 'Búho Lector',
  frog: 'Rana Sabia',
  monkey: 'Mono Curioso',
  fish: 'Pez Inteligente',
  koala: 'Koala Pensador',
  bear: 'Oso Aventurero'
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
    <div className={` max-w-4xl mx-auto mb-8 flex items-center gap-4 p-4 bg-white/90 rounded-2xl shadow-lg border-2 border-orange-200 ${className}`}>
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-orange-100 border-2 border-orange-300 flex items-center justify-center">
          <img
            src={animalImages[animal]}
            alt={animalNames[animal]}
            className="w-20 h-20 object-contain"
          />
        </div>
      </div>

      <div className="flex-1">
        <h4 className="text-orange-600 mb-1">{animalNames[animal]}</h4>
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