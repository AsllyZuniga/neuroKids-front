import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Star, ChevronLeft, ChevronRight, Trophy, ArrowRight } from 'lucide-react';
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { Progress } from '../../../ui/progress';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from "../../../others/RewardAnimation";

interface CuentoPictogramasProps {
  onBack: () => void;
  level: number;
  onNextLevel: () => void;
}

interface StoryPage {
  id: number;
  text: string;
  pictograms: { word: string; emoji: string }[];
  image: string;
  audio: string;
}

/* nivel1 */
const storyPagesLevel1: StoryPage[] = [
  {
    id: 1,
    text: "Había una vez un pequeño {gato} que vivía en una {casa} amarilla.",
    pictograms: [
      { word: "gato", emoji: "🐱" },
      { word: "casa", emoji: "🏠" }
    ],
    image: "🏡",
    audio: "/audio/page1.mp3"
  },
  {
    id: 2,
    text: "Cada mañana, el {gato} salía a jugar bajo el {sol} brillante.",
    pictograms: [
      { word: "gato", emoji: "🐱" },
      { word: "sol", emoji: "☀️" }
    ],
    image: "🌞",
    audio: "/audio/page2.mp3"
  },
  {
    id: 3,
    text: "Un día encontró una hermosa {flor} junto a un gran {árbol}.",
    pictograms: [
      { word: "flor", emoji: "🌸" },
      { word: "árbol", emoji: "🌳" }
    ],
    image: "🌺",
    audio: "/audio/page3.mp3"
  },
  {
    id: 4,
    text: "El {gato} bebió {agua} fresca de un pequeño arroyo.",
    pictograms: [
      { word: "gato", emoji: "🐱" },
      { word: "agua", emoji: "💧" }
    ],
    image: "🏞️",
    audio: "/audio/page4.mp3"
  },
  {
    id: 5,
    text: "Por la noche, el {gato} miraba la {luna} y las {estrellas}.",
    pictograms: [
      { word: "gato", emoji: "🐱" },
      { word: "luna", emoji: "🌙" },
      { word: "estrellas", emoji: "⭐" }
    ],
    image: "🌃",
    audio: "/audio/page5.mp3"
  },
  {
    id: 6,
    text: "Y así, el pequeño {gato} vivía feliz en su {casa} llena de amor.",
    pictograms: [
      { word: "gato", emoji: "🐱" },
      { word: "casa", emoji: "🏠" }
    ],
    image: "❤️",
    audio: "/audio/page6.mp3"
  }
];

const storyPagesLevel2: StoryPage[] = [
  {
    id: 1,
    text: "El {niño} fue al {parque} a jugar con su {pelota}.",
    pictograms: [
      { word: "niño", emoji: "🧒" },
      { word: "parque", emoji: "🌳" },
      { word: "pelota", emoji: "⚽" }
    ],
    image: "🏞️",
    audio: "/audio/lv2_page1.mp3"
  },
  {
    id: 2,
    text: "En el {parque}, el {niño} vio un {perro} que corría feliz.",
    pictograms: [
      { word: "parque", emoji: "🌳" },
      { word: "niño", emoji: "🧒" },
      { word: "perro", emoji: "🐶" }
    ],
    image: "🐾",
    audio: "/audio/lv2_page2.mp3"
  },
  {
    id: 3,
    text: "El {perro} tomó la {pelota} y la llevó al {niño}.",
    pictograms: [
      { word: "perro", emoji: "🐶" },
      { word: "pelota", emoji: "⚽" },
      { word: "niño", emoji: "🧒" }
    ],
    image: "⚽",
    audio: "/audio/lv2_page3.mp3"
  },
  {
    id: 4,
    text: "Ambos jugaron juntos hasta que cayó la {noche}.",
    pictograms: [
      { word: "noche", emoji: "🌙" }
    ],
    image: "🌃",
    audio: "/audio/lv2_page4.mp3"
  }
];

const storyPagesLevel3: StoryPage[] = [
  {
    id: 1,
    text: "La {niña} caminaba por el {bosque} y escuchó un {ruido} extraño detrás del {árbol}.",
    pictograms: [
      { word: "niña", emoji: "👧" },
      { word: "bosque", emoji: "🌲" },
      { word: "ruido", emoji: "🔊" },
      { word: "árbol", emoji: "🌳" }
    ],
    image: "🌲",
    audio: "/audio/lv3_page1.mp3"
  },
  {
    id: 2,
    text: "Con {valentía}, se acercó y encontró un pequeño {búho} herido.",
    pictograms: [
      { word: "valentía", emoji: "💪" },
      { word: "búho", emoji: "🦉" }
    ],
    image: "🦉",
    audio: "/audio/lv3_page2.mp3"
  },
  {
    id: 3,
    text: "La {niña} cuidó al {búho} y lo llevó a su {casa}.",
    pictograms: [
      { word: "niña", emoji: "👧" },
      { word: "búho", emoji: "🦉" },
      { word: "casa", emoji: "🏠" }
    ],
    image: "🏡",
    audio: "/audio/lv3_page3.mp3"
  },
  {
    id: 4,
    text: "Cuando el {búho} sanó, voló al {cielo} bajo la {luna} brillante.",
    pictograms: [
      { word: "búho", emoji: "🦉" },
      { word: "cielo", emoji: "☁️" },
      { word: "luna", emoji: "🌙" }
    ],
    image: "🌕",
    audio: "/audio/lv3_page4.mp3"
  }
];

export function CuentoPictogramas({ onBack }: { onBack: () => void }) {
  const [level, setLevel] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [score, setScore] = useState(0);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickedPictograms, setClickedPictograms] = useState<Set<string>>(new Set());
  const [showWarning, setShowWarning] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0); // Estado para progreso incremental


  let storyPages: StoryPage[] = [];
  switch (level) {
    case 1:
      storyPages = storyPagesLevel1;
      break;
    case 2:
      storyPages = storyPagesLevel2;
      break;
    case 3:
      storyPages = storyPagesLevel3;
      break;
    default:
      storyPages = storyPagesLevel1;
  }

  const currentStoryPage = storyPages[currentPage];
  const totalPages = storyPages.length;
  const baseProgress = (currentPage / totalPages) * 100; // Progreso base por páginas
  const incrementPerPictogram = 100 / (totalPages * currentStoryPage.pictograms.length); // Incremento por pictograma
  const maxPageProgress = 100 / totalPages; // Máximo progreso por página

  const requiredClicks = Math.ceil(currentStoryPage.pictograms.length * 0.75);
  const hasEnoughClicks = clickedPictograms.size >= requiredClicks;

  // progreso incremental
  const updateProgress = () => {
    const newProgress = baseProgress + (clickedPictograms.size * incrementPerPictogram);
    setCurrentProgress(Math.min(newProgress, baseProgress + maxPageProgress)); // Limita al progreso máximo de la página
  };


  const playPageAudio = () => {
    setIsPlaying(true);
    let finalText = currentStoryPage.text;

    // Reemplazar los pictogramas descubiertos con sus nombres
    currentStoryPage.pictograms.forEach(({ word }) => {
      if (clickedPictograms.has(word) && hasEnoughClicks) {
        finalText = finalText.replace(`{${word}}`, word);
      }
    });

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(finalText);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }

    const words = finalText.split(' ').length;
    const duration = Math.max(words * 400, 2000);
    console.log(`🔊 Leyendo: ${finalText}`);

    setTimeout(() => {
      setIsPlaying(false);
    }, duration);
  };

  const handlePictogramClick = (word: string) => {
    if (!clickedPictograms.has(word)) {
      setClickedPictograms(prev => {
        const newSet = new Set(prev).add(word);
        updateProgress();
        return newSet;
      });
      setScore(score + 5);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1000);
    }
  };

  const renderTextWithPictograms = (text: string, pictograms: { word: string; emoji: string }[]) => {
    let result = text;
    pictograms.forEach(({ word }) => {
      result = result.replace(`{${word}}`, `<pictogram>${word}</pictogram>`);
    });

    const parts = result.split(/<pictogram>([^<]+)<\/pictogram>/);

    return parts.map((part, index) => {
      if (index % 2 === 0) return <span key={index}>{part}</span>;
      const pictogram = pictograms.find(p => p.word === part);
      return pictogram ? (
        <span
          key={index}
          className={`inline-flex items-center mx-1 cursor-pointer transform hover:scale-110 transition-transform rounded-lg px-2 py-1 ${clickedPictograms.has(part)
            ? 'bg-green-100 border-2 border-green-300'
            : 'bg-yellow-100 border-2 border-yellow-300'
            }`}
          onClick={() => handlePictogramClick(part)}
        >
          <span className="text-3xl">{pictogram.emoji}</span>
          {clickedPictograms.has(part) && <span className="ml-2 text-lg">{pictogram.word}</span>}
        </span>
      ) : (
        <span key={index}>{part}</span>
      );
    });
  };

  const goToNextPage = () => {
    if (hasEnoughClicks) {
      if (currentPage < storyPages.length - 1) {
        setCurrentPage(currentPage + 1);
        setClickedPictograms(new Set());
        setCurrentProgress((currentPage + 1) / totalPages * 100);
        setShowWarning(false);
      } else {
        setReadingComplete(true);
      }
    } else {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setClickedPictograms(new Set());
      setCurrentProgress(currentPage / totalPages * 100);
      setShowWarning(false);
    }
  };

  const restartReading = () => {
    setCurrentPage(0);
    setScore(0);
    setReadingComplete(false);
    setShowReward(false);
    setClickedPictograms(new Set());
    setCurrentProgress(0);
  };

  const goToNextLevel = () => {
    if (level < 3) {
      setLevel(level + 1);
      setCurrentPage(0);
      setScore(0);
      setReadingComplete(false);
      setShowReward(false);
      setClickedPictograms(new Set());
      setCurrentProgress(0);
    }
  };

  /* pantalla final*/
  if (readingComplete) {
    const isLastLevel = level === 3;

    return (
      <div
        className="min-h-screen p-6"
        style={{
          background: 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 100%)'
        }}
      >
        <RewardAnimation type="star" show={showReward} />

        {/* Level Complete Message */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        >
          <Card className="bg-white/95 backdrop-blur-sm max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl mb-4 text-gray-800">
                ¡Bien hecho!
              </h2>
              <p className="text-gray-600 mb-4">
                {isLastLevel
                  ? `¡Has completado todos los niveles con ${score} puntos!`
                  : `¡Has completado el nivel ${level}!`}
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-yellow-600">+{score} XP ganados</span>
              </div>
              <div className="flex flex-col gap-2">
                {!isLastLevel && (
                  <Button
                    onClick={goToNextLevel}
                    className="bg-green-500 hover:bg-green-600 w-full"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Siguiente Nivel ({level + 1})
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button onClick={restartReading} className="bg-purple-500 hover:bg-purple-600 flex-1">
                    Repetir Nivel
                  </Button>
                  <Button onClick={onBack} variant="outline" className="flex-1">
                    Salir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  /* pantalla principal*/
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-green-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <Button onClick={onBack} variant="outline" className="bg-black/80 backdrop-blur-sm border-2 hover:bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="text-center">
            <h1 className="text-2xl text-gray-800 dyslexia-friendly">🖼️ Cuento con Pictogramas Nivel - {level}</h1>
            <div className="flex items-center gap-2 justify-center mt-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Puntos: {score}</span>
            </div>
          </div>

          <div className="text-right text-sm text-gray-600">
            Página {currentPage + 1} de {storyPages.length}
          </div>
        </div>

        {/* Progreso*/}
        <div className="mb-6">
          <div className="h-4 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress > 100 ? 100 : currentProgress}%` }}
              transition={{ duration: 0.3 }} // Animación suave
              className="h-full bg-gradient-to-r from-yellow-400 to-green-500 rounded-full"
            />
          </div>
          <div className="text-center text-gray-600 mt-2">
            Progreso: {currentProgress.toFixed(1)}%
          </div>
        </div>

        {/* animalguide*/}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <AnimalGuide
            animal="owl"
            message="¡Lee la historia y haz clic en los pictogramas para descubrir su significado! Cada emoji te da puntos."
          />
        </motion.div>

        {/* Contenido */}
        <motion.div
          key={currentPage}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 mb-6">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center">
                  <div className="text-9xl mb-4">{currentStoryPage.image}</div>
                  <Button
                    onClick={playPageAudio}
                    disabled={isPlaying || !hasEnoughClicks}
                    className={`transition-all ${isPlaying
                      ? 'bg-green-500 text-white animate-pulse'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                  >
                    <Volume2 className={`w-4 h-4 mr-2 ${isPlaying ? 'animate-bounce' : ''}`} />
                    {isPlaying ? '🔊 Narrando...' : 'Escuchar Historia'}
                  </Button>
                </div>

                <div className="text-center md:text-left">
                  <div className="text-xl leading-relaxed text-gray-800 dyslexia-friendly">
                    {renderTextWithPictograms(currentStoryPage.text, currentStoryPage.pictograms)}
                  </div>

                  <div className="mt-8 p-8 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <h4 className="text-sm text-gray-600 mb-2">Pictogramas en esta página:</h4>
                    <div className="flex flex-wrap gap-3">
                      {currentStoryPage.pictograms.map(({ word, emoji }) => (
                        <div
                          key={word}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${clickedPictograms.has(word)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          <span>{emoji}</span>
                          {clickedPictograms.has(word) && <span>{word}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navegación */}
        <div className="flex justify-between items-center">
          <Button onClick={goToPreviousPage} disabled={currentPage === 0} variant="outline" className="bg-white/80">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {storyPages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentPage ? 'bg-blue-500' : index < currentPage ? 'bg-green-400' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>

          <Button onClick={goToNextPage} className="bg-blue-500 hover:bg-blue-600 text-white" disabled={!hasEnoughClicks}>
            {currentPage === storyPages.length - 1 ? 'Finalizar' : 'Siguiente'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {showReward && (
          <RewardAnimation
            type="star"
            show={showReward}
            message="¡Muy bien!"
            onComplete={() => setShowReward(false)}
          />
        )}

        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-2 border-yellow-300 p-4 rounded-lg shadow-lg text-center text-gray-700"
          >

          </motion.div>
        )}
      </div>
    </div>
  );
}