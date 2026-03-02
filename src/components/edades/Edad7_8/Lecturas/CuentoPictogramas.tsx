import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import { Card, CardContent } from "@/components/ui/card";
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from "@/components/others/RewardAnimation";
import { GameHeader } from "@/components/others/GameHeader";
import { ProgressBar } from "@/components/others/ProgressBar";
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { StartScreenCuentoPictogramas } from "../IniciosJuegosLecturas/StartScreenCuentoPictogramas";
import { LevelLock } from '../../../others/LevelLock';
import { useLevelLock } from '../../../../hooks/useLevelLock';
import { speakText } from '../../../../utils/textToSpeech';
import { useProgress } from "@/hooks/useProgress";
import { getActivityByDbId } from "@/config/activities";
import image1 from "@/assets/7_8/cuentospictogramas/nivel1/1.png";
import image2 from "@/assets/7_8/cuentospictogramas/nivel1/2.png";
import image3 from "@/assets/7_8/cuentospictogramas/nivel1/3.png";  
import image4 from "@/assets/7_8/cuentospictogramas/nivel1/4.png";
import image5 from "@/assets/7_8/cuentospictogramas/nivel1/5.png";
import image6 from "@/assets/7_8/cuentospictogramas/nivel1/6.png";
import img1 from "@/assets/7_8/cuentospictogramas/nivel2/1.png";
import img2 from "@/assets/7_8/cuentospictogramas/nivel2/2.png";
import img3 from "@/assets/7_8/cuentospictogramas/nivel2/3.png";
import img4 from "@/assets/7_8/cuentospictogramas/nivel2/4.png";
import imag1 from "@/assets/7_8/cuentospictogramas/nivel3/1.png";
import imag2 from "@/assets/7_8/cuentospictogramas/nivel3/2.png";
import imag3 from "@/assets/7_8/cuentospictogramas/nivel3/3.png";
import img5 from "@/assets/7_8/cuentospictogramas/nivel3/4.png";

interface CuentoPictogramas {
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
    image: image1,
    audio: "/audio/page1.mp3"
  },
  {
    id: 2,
    text: "Cada mañana, el {gato} salía a jugar bajo el {sol} brillante.",
    pictograms: [
      { word: "gato", emoji: "🐱" },
      { word: "sol", emoji: "☀️" }
    ],
    image: image2,
    audio: "/audio/page2.mp3"
  },
  {
    id: 3,
    text: "Un día encontró una hermosa {flor} junto a un gran {árbol}.",
    pictograms: [
      { word: "flor", emoji: "🌸" },
      { word: "árbol", emoji: "🌳" }
    ],
    image: image3,
    audio: "/audio/page3.mp3"
  },
  {
    id: 4,
    text: "El {gato} bebió {agua} fresca de un pequeño arroyo.",
    pictograms: [
      { word: "gato", emoji: "🐱" },
      { word: "agua", emoji: "💧" }
    ],
    image: image4,
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
    image: image5,
    audio: "/audio/page5.mp3"
  },
  {
    id: 6,
    text: "Y así, el pequeño {gato} vivía feliz en su {casa} llena de amor.",
    pictograms: [
      { word: "gato", emoji: "🐱" },
      { word: "casa", emoji: "🏠" }
    ],
    image: image6,
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
    image: img1,
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
    image: img2,
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
    image: img3,
    audio: "/audio/lv2_page3.mp3"
  },
  {
    id: 4,
    text: "Ambos jugaron juntos hasta que cayó la {noche}.",
    pictograms: [
      { word: "noche", emoji: "🌙" }
    ],
    image: img4,
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
    image: imag1,
    audio: "/audio/lv3_page1.mp3"
  },
  {
    id: 2,
    text: "Con {valentía}, se acercó y encontró un pequeño {búho} herido.",
    pictograms: [
      { word: "valentía", emoji: "💪" },
      { word: "búho", emoji: "🦉" }
    ],
    image: imag2,
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
    image: imag3,
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
    image: img5,
    audio: "/audio/lv3_page4.mp3"
  }
];

export function CuentoPictogramas({ onBack }: { onBack: () => void }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const isLevelLocked = useLevelLock(level);
  const [currentPage, setCurrentPage] = useState(0);
  const [score, setScore] = useState(0);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickedPictograms, setClickedPictograms] = useState<Set<string>>(new Set());
  const [showWarning, setShowWarning] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0); // Estado para progreso incremental
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  // 💾 Simple: Solo guardar al iniciar nivel como dashboard
  const { saveProgress } = useProgress();
  const activityConfig = getActivityByDbId(1); // ID 1 = Cuento con Pictogramas

  // 💾 Guardar progreso CADA vez que se entra a la actividad
  useEffect(() => {
    if (activityConfig) {
      const guardarInicioNivel = async () => {
        try {
          await saveProgress({
            activityId: activityConfig.dbId,
            activityName: activityConfig.name,
            activityType: activityConfig.type,
            ageGroup: '7-8',
            level: level,
            score: 0,
            maxScore: 100,
            completed: false,
            timeSpent: 0
          });
          console.log(`📚 Cuento Nivel ${level} iniciado`);
        } catch (error) {
          console.error('Error guardando progreso:', error);
        }
      };
      guardarInicioNivel();
    }
  }, [level, activityConfig, saveProgress]); // Se ejecuta cada vez que cambia el nivel

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


  const updateProgress = () => {
    const newProgress = baseProgress + (clickedPictograms.size * incrementPerPictogram);
    setCurrentProgress(Math.min(newProgress, baseProgress + maxPageProgress)); // Limita al progreso máximo de la página
  };


  const playPageAudio = () => {
    if (isPlaying || !hasEnoughClicks) return;
    setIsPlaying(true);
    let finalText = currentStoryPage.text;
    currentStoryPage.pictograms.forEach(({ word }) => {
      if (clickedPictograms.has(word) && hasEnoughClicks) {
        finalText = finalText.replace(`{${word}}`, word);
      }
    });
    speakText(finalText, { voiceType: 'child' });
    const words = finalText.split(/\s+/).filter(Boolean).length;
    const duration = Math.max(words * 350, 1800);
    setTimeout(() => setIsPlaying(false), duration);
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
    speakText(word, { voiceType: 'child' });
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
        setShowReward(true);

        // Secuencia: Recompensa → motivacional → modal
        setTimeout(() => {
          setShowReward(false);
          setShowMotivational(true);
        }, 1500);

        setTimeout(() => {
          setShowMotivational(false);
          setShowLevelComplete(true);
        }, 4500);
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
    setShowMotivational(false);
    setShowLevelComplete(false);
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
      setShowMotivational(false);
      setShowLevelComplete(false);
    }
  };

  if (!gameStarted) {
    return (
      <LevelLock level={level} isLocked={isLevelLocked}>
        <StartScreenCuentoPictogramas onStart={() => setGameStarted(true)} onBack={onBack} />
      </LevelLock>
    );
  }

  return (
    <LevelLock level={level} isLocked={isLevelLocked}>
    <div
      className="min-h-screen p-6"
      style={{
        background: 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 100%)'
      }}
    >
      <RewardAnimation type="star" show={showReward} />

      {/* HEADER */}
      <GameHeader
        title="Cuento con Pictogramas"
        level={level}
        score={score}
        onBack={onBack}
        onRestart={restartReading}
      />

      {/* PROGRESS BAR */}
      <ProgressBar
        current={currentPage + 1}
        total={totalPages}
        progress={currentProgress}
        className="mb-6"
      />

      {/* ANIMAL GUIDE */}
      <div>
        <AnimalGuide
          animal="fish"
          message="¡Lee la historia y haz clic en los pictogramas para descubrir su significado! Cada emoji te da puntos."
        />
      </div>

      {/* JUEGO */}
      {!readingComplete && !showMotivational && !showLevelComplete && (
        <motion.div
          key={currentPage}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 mb-6">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* IMAGEN + AUDIO */}
                <div className="text-center">
                  <img
  src={currentStoryPage.image}
  alt="Ilustración del cuento"
  className="mx-auto mb-4 max-h-80 object-contain rounded-xl"
/>

                  <ButtonWithAudio
                    onClick={playPageAudio}
                    playOnClick
                    playOnHover
                    disabled={isPlaying || !hasEnoughClicks}
                    audioText={isPlaying ? 'Narrando' : 'Escuchar Historia'}
                    className={`w-full transition-all ${isPlaying
                      ? 'bg-green-500 text-white animate-pulse'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}>
                    <Volume2 className={`w-5 h-5 mr-2 ${isPlaying ? 'animate-bounce' : ''}`} />
                    {isPlaying ? 'Narrando...' : 'Escuchar Historia'}
                  </ButtonWithAudio>
                </div>

                {/* TEXTO CON PICTOGRAMAS */}
                <div className="text-center md:text-left">
                  <div className="text-xl leading-relaxed text-gray-800 ">
                    {renderTextWithPictograms(currentStoryPage.text, currentStoryPage.pictograms)}
                  </div>

                  <div className="mt-8 p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <h4 className="text-sm text-gray-600 mb-3">Pictogramas en esta página:</h4>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {currentStoryPage.pictograms.map(({ word, emoji }) => (
                        <div
                          key={word}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm  transition-all
                          ${clickedPictograms.has(word)
                              ? 'bg-green-100 text-green-700 border-2 border-green-300'
                              : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                            }`}
                        >
                          <span className="text-xl">{emoji}</span>
                          {clickedPictograms.has(word) && <span className="ml-1">{word}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NAVEGACIÓN */}
          <div className="flex justify-between items-center mt-6">
            <ButtonWithAudio
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              playOnHover
              playOnClick
              variant="outline"
              className="bg-green-500"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Anterior
            </ButtonWithAudio>

            <div className="flex gap-2">
              {storyPages.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all
                  ${index === currentPage ? 'bg-blue-500 w-8' : index < currentPage ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>

            <ButtonWithAudio
              onClick={goToNextPage}
              playOnHover
              playOnClick
              className="bg-blue-500 hover:bg-blue-600 text-white"
              disabled={!hasEnoughClicks}
              audioText={currentPage === storyPages.length - 1 ? 'Finalizar' : 'Siguiente'}
            >
              {currentPage === storyPages.length - 1 ? 'Finalizar' : 'Siguiente'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </ButtonWithAudio>
          </div>

          {/* ADVERTENCIA */}
          {showWarning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-2 border-yellow-300 p-4 rounded-xl shadow-lg text-center text-yellow-800"
            >
              ¡Haz clic en al menos {requiredClicks} pictogramas para continuar!
            </motion.div>
          )}
        </motion.div>
      )}

      {/* MENSAJE MOTIVACIONAL */}
      {showMotivational && (
        <MotivationalMessage
          score={score}
          total={totalPages * 10}
          customMessage="¡Eres un lector increíble!"
          customSubtitle="Descubriste todos los pictogramas del cuento"
          celebrationText="¡Eres genial!"
          onComplete={() => {
            setShowMotivational(false);
            setShowLevelComplete(true);
          }}
        />
      )}

      {/* MODAL FINAL */}
      {showLevelComplete && (
        <LevelCompleteModal
          score={score}
          total={totalPages * 10}
          level={level}
          isLastLevel={level >= 3}
          onNextLevel={goToNextLevel}
          onRestart={restartReading}
          onExit={onBack}
        />
      )}
    </div>
    </LevelLock>
  );
}