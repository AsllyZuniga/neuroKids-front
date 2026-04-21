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
    <div
      className={`mx-auto mb-8 flex max-w-4xl items-center gap-4 rounded-2xl border-2 border-orange-200 bg-white/90 p-4 shadow-lg max-[480px]:min-w-0 max-[480px]:flex-col max-[480px]:items-stretch max-[480px]:overflow-hidden ${className}`}
    >
      <div className="relative flex shrink-0 max-[480px]:justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-orange-300 bg-orange-100">
          <img
            src={animalImages[animal]}
            alt={animalNames[animal]}
            className="h-20 w-20 object-contain"
          />
        </div>
      </div>

      <div className="min-w-0 flex-1 max-[480px]:w-full">
        <h4 className="mb-1 text-orange-600 max-[480px]:text-center">{animalNames[animal]}</h4>
        <p className="break-words text-gray-700 max-[480px]:text-center">{message}</p>
      </div>

      <div className="flex shrink-0 flex-col gap-2 max-[480px]:w-full max-[480px]:flex-row max-[480px]:justify-center">
        <Button
          onClick={handleSpeak}
          size="sm"
          variant="outline"
          className="rounded-full border-orange-300 p-2 hover:bg-orange-50"
        >
          <Volume2 className="h-4 w-4 text-orange-600" />
        </Button>
        {onRepeat && (
          <Button
            onClick={onRepeat}
            size="sm"
            variant="outline"
            className="rounded-full border-blue-300 p-2 hover:bg-blue-50"
          >
            <RotateCcw className="h-4 w-4 text-blue-600" />
          </Button>
        )}
      </div>
    </div>
  );
}