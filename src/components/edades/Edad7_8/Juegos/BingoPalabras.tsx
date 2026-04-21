import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
//import { Button } from "@/components/ui/button";
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import { Card } from "@/components/ui/card";
import { AnimalGuide } from '../../../others/AnimalGuide';
import { GameHeader } from "@/components/others/GameHeader";
import { ProgressBar } from "@/components/others/ProgressBar";
import { RewardAnimation } from "@/components/others/RewardAnimation";
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { ConfettiExplosion } from "@/components/others/ConfettiExplosion";
import { LevelLock } from "@/components/others/LevelLock";
import { StartScreenBingo } from "../IniciosJuegosLecturas/StartScreenBingo";
import { speakText, canSpeakOnHover } from "@/utils/textToSpeech";
import { useLevelLock } from "@/hooks/useLevelLock";
import { useProgress } from "@/hooks/useProgress";
import { useActivityTimer } from "@/hooks/useActivityTimer";
import { getActivityByDbId } from "@/config/activities";
import {
  baseFromActivityConfig,
  gameLevelFinished,
  gameLevelStart
} from "@/utils/activityProgressPayloads";
import { AccessibilitySettingsWrapper } from "@/components/others/AccessibilitySettingsWrapper";

interface WordItem {
  word: string;
  emoji: string;
  matched: boolean;
}
interface LevelData {
  words: WordItem[];
  calledWords: string[];
  gridSize: number;
  rows?: number;
}

const gameData: Record<number, LevelData> = {
  1: {
    words: [
      { word: "SOL", emoji: "☀️", matched: false },
      { word: "MAR", emoji: "🌊", matched: false },
      { word: "PEZ", emoji: "🐟", matched: false },
      { word: "OSO", emoji: "🐻", matched: false },
      { word: "PAN", emoji: "🍞", matched: false },
      { word: "OJO", emoji: "👁️", matched: false },
      { word: "PIE", emoji: "🦶", matched: false },
      { word: "UVA", emoji: "🍇", matched: false },
      { word: "ALA", emoji: "🪶", matched: false },
    ],
    calledWords: ["SOL", "LUZ", "MAR", "PEZ", "SAL", "OSO", "DAR", "PAN"],
    gridSize: 3,
  },
  2: {
    words: [
      { word: "GATO", emoji: "🐱", matched: false },
      { word: "CASA", emoji: "🏠", matched: false },
      { word: "AGUA", emoji: "💧", matched: false },
      { word: "FLOR", emoji: "🌸", matched: false },
      { word: "LUNA", emoji: "🌙", matched: false },
      { word: "BOCA", emoji: "👄", matched: false },
      { word: "LIBRO", emoji: "📚", matched: false },
      { word: "ARBOL", emoji: "🌳", matched: false },
      { word: "MESA", emoji: "🪑", matched: false },
      { word: "PLATO", emoji: "🍽️", matched: false },
      { word: "RELOJ", emoji: "⌚", matched: false },
      { word: "MANO", emoji: "✋", matched: false },
    ],
    calledWords: ["GATO", "PERRO", "VACA", "CASA", "FLOR", "CARRO", "OLLA", "LUNA", "PLATO", "LÁPIZ", "BOTE", "LIBRO"],
    gridSize: 4,
  },
  3: {
    words: [
      { word: "MARIPOSA", emoji: "🦋", matched: false },
      { word: "ELEFANTE", emoji: "🐘", matched: false },
      { word: "CORAZON", emoji: "❤️", matched: false },
      { word: "PLANETA", emoji: "🪐", matched: false },
      { word: "BICICLETA", emoji: "🚲", matched: false },
      { word: "DINOSAURIO", emoji: "🦕", matched: false },
      { word: "VENTANA", emoji: "🪟", matched: false },
      { word: "CARAMELO", emoji: "🍬", matched: false },
      { word: "TELEFONO", emoji: "📱", matched: false },
      { word: "MONTAÑA", emoji: "🏔️", matched: false },
      { word: "AVION", emoji: "✈️", matched: false },
      { word: "ESTRELLA", emoji: "⭐", matched: false },
    ],
    calledWords: ["MARIPOSA", "KOALA", "CAZADOR", "PLANETA", "ELEFANTE", "AVESTRUZ", "PATINES", "BICICLETA", "ESTRELLA"],
    gridSize: 4,
    rows: 3,
  },
};

export function BingoPalabras({ onBack }: { onBack: () => void }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const isLevelLocked = useLevelLock(level);
  const data = gameData[level];
  const [grid, setGrid] = useState<WordItem[]>([]);
  const [calledList, setCalledList] = useState<string[]>([]);
  const [calledIndex, setCalledIndex] = useState(0);
  const [bingoAchieved, setBingoAchieved] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showBingo, setShowBingo] = useState(false);

  const { saveProgress } = useProgress();
  const activityConfig = getActivityByDbId(10); // ID 10 = Bingo de Palabras
  const { getElapsedSeconds } = useActivityTimer([level]);

  const guardarInicioNivel = () => {
    if (activityConfig) {
      saveProgress(gameLevelStart(baseFromActivityConfig(activityConfig), level));
    }
  };

  useEffect(() => {
    // Registrar CADA vez que se inicia el juego, sin importar si ya jugó antes
    console.log('🔄 BingoPalabras - Ejecutando useEffect, nivel:', level);
    guardarInicioNivel();
  }, [level, activityConfig, saveProgress]); // Se ejecuta cada vez que cambia el nivel

  const currentWord = calledList[calledIndex] || "";
  const isWordOnCard = grid.some((c) => c.word === currentWord);


  useEffect(() => {
    const shuffled = [...data.words].sort(() => Math.random() - 0.5);
    const gridSize = data.rows ? data.gridSize * data.rows : data.gridSize * data.gridSize;
    setGrid(shuffled.slice(0, gridSize));
    setCalledList([...data.calledWords]);
    setCalledIndex(0);
    setBingoAchieved(false);
    setShowReward(false);
    setShowMotivational(false);
    setShowLevelComplete(false);
    setShowBingo(false);
  }, [level, data]);

  const speakCurrentWord = () => {
    speakText(currentWord, { voiceType: 'child' });
  };

  useEffect(() => {
    if (currentWord && !bingoAchieved) {
      speakCurrentWord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calledIndex, bingoAchieved, currentWord]);

  const handleCellClick = (word: string) => {
    if (word === currentWord && !bingoAchieved) {
      setGrid((prevGrid) =>
        prevGrid.map((cell) =>
          cell.word === word ? { ...cell, matched: true } : cell
        )
      );

      new Audio("/sounds/correct.mp3").play();

      setShowReward(true);
      setTimeout(() => setShowReward(false), 1000);

      setTimeout(() => goToNextWord(), 800);
    }
  };

  const goToNextWord = () => {
    if (calledIndex + 1 < calledList.length) {
      setCalledIndex(calledIndex + 1);
    } else {
      setBingoAchieved(true);
      setShowBingo(true); // ¡BINGO!
      new Audio("/sounds/bingo.mp3").play().catch(() => { });

      setShowReward(true);

      setTimeout(() => {
        setShowBingo(false);
        setShowReward(false);
        setShowMotivational(true);
      }, 3000);
    }
  };

  const restartLevel = () => {
    setCalledIndex(0);
    setGrid(grid.map(cell => ({ ...cell, matched: false })));
    setBingoAchieved(false);
    setShowReward(false);
    setShowMotivational(false);
    setShowLevelComplete(false);
    setShowBingo(false);
  };

  const handleNextLevel = async () => {
    if (activityConfig) {
      const correctCount = data.calledWords.length;
      await saveProgress(
        gameLevelFinished(baseFromActivityConfig(activityConfig), {
          level,
          score: correctCount * 5,
          maxScore: activityConfig.maxScore,
          timeSpent: getElapsedSeconds(),
          correctAnswers: correctCount
        })
      );
    }
    if (level < 3) {
      setLevel(level + 1);
    } else {
      onBack();
    }
    setShowLevelComplete(false);
  };
  if (!gameStarted) {
    return <StartScreenBingo onStart={() => setGameStarted(true)} onBack={onBack} />;
  }

  // Envolver el juego con LevelLock
  return (
    <LevelLock level={level} isLocked={isLevelLocked}>
      <AccessibilitySettingsWrapper defaultBackground="linear-gradient(135deg, #FFB6C1 0%, #87CEEB 100%)">
      <div className="relative min-h-screen min-h-[100dvh] overflow-x-hidden p-3 sm:p-5 lg:p-8">
        <ConfettiExplosion show={showBingo} />
        <RewardAnimation type="star" show={showReward} />
        {showBingo && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4 pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
          >
            <div
              className="max-w-[min(100%,20ch)] text-center font-extrabold leading-none text-yellow-400 drop-shadow-2xl animate-pulse"
              style={{ fontSize: "clamp(2.75rem, 14vw, 6rem)" }}
            >
              ¡BINGO!
            </div>
          </motion.div>
        )}

        {/* HEADER */}
        <GameHeader
          title="Bingo de Palabras"
          level={level}
          score={calledIndex * 5}
          onBack={onBack}
          onRestart={restartLevel}
        />

        {/* PROGRESS BAR */}
        <ProgressBar
          current={calledIndex}
          total={calledList.length}
          className="mb-6"
        />

        {/* ANIMAL GUIDE */}
        <div className="mb-6">
          <AnimalGuide
            animal="owl"
            message="¡Escucha la palabra y búscala en tu cartón! ¡Marca si la tienes!"
          />
        </div>

        {/* JUEGO */}
        {!bingoAchieved && !showMotivational && !showLevelComplete && (
          <div className="mx-auto grid w-full min-w-0 max-w-7xl grid-cols-1 gap-3 sm:gap-5 md:grid-cols-3">
            <motion.div
              key={currentWord}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center bg-white/90 p-5 rounded-2xl shadow-lg"
            >
              <h2 className="text-lg  text-gray-700 mb-3">Palabra actual</h2>
              <div className="text-4xl  text-indigo-700 mb-4">{currentWord}</div>

              {!isWordOnCard && (
                <div className="text-yellow-700 text-sm text-center bg-yellow-50 rounded-md p-2 mb-3">
                </div>
              )}

          <ButtonWithAudio
                onClick={goToNextWord}
                disabled={isWordOnCard}
                className={`w-full ${isWordOnCard
                  ? "bg-blue-600 cursor-not-allowed text-black"
                  : "bg-green-500 hover:bg-green-400 text-black"
                  }`}
              >
                Siguiente palabra
              </ButtonWithAudio>

              <ButtonWithAudio
                onClick={speakCurrentWord}
                variant="outline"
                size="sm"

                className="mt-3 w-full bg-purple-500 text-black"
              >
                <Volume2 className="w-4 h-4 mr-2 text-black" />
                Repetir
              </ButtonWithAudio>
            </motion.div>

            <div className="md:col-span-2 bg-white/90 p-2 sm:p-4 rounded-2xl shadow-lg w-full min-w-0">
              <div
                className="grid gap-1.5 sm:gap-3 w-full min-w-0"
                style={{
                  gridTemplateColumns: `repeat(${data.gridSize}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${data.rows || data.gridSize}, minmax(0, auto))`,
                }}
              >
                {grid.map((cell, i) => (
                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    initial={{ scale: 1 }}
                    animate={cell.matched ? {
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0],
                      transition: { duration: 0.6 }
                    } : {}}
                    onMouseEnter={() => {
                      // Reproducir el audio de la palabra al hacer hover
                      if (!cell.matched && canSpeakOnHover()) {
                        speakText(cell.word, { voiceType: 'child' });
                      }
                    }}
                  >
                    <Card
                      onClick={() => handleCellClick(cell.word)}
                      className={`cursor-pointer text-center p-1.5 sm:p-3 border-2 rounded-lg sm:rounded-xl transition-all h-full min-h-[4.5rem] sm:min-h-[5.5rem] flex flex-col justify-center min-w-0
                      ${cell.matched
                          ? "border-green-500 bg-green-100 shadow-2xl scale-110"
                          : "border-blue-200 hover:bg-blue-50"
                        }`}
                    >
                      <motion.div
                        animate={cell.matched ? {
                          scale: [1, 1.5, 1],
                          rotate: [0, 360],
                        } : {}}
                        transition={{ duration: 0.8 }}
                        className="text-2xl sm:text-4xl md:text-5xl mb-0.5 sm:mb-1 leading-none"
                      >
                        {cell.emoji}
                      </motion.div>
                      <div className="text-[0.65rem] sm:text-xs md:text-sm lg:text-lg font-semibold text-gray-800 break-words leading-tight">{cell.word}</div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MENSAJE MOTIVACIONAL */}
        {showMotivational && (
          <MotivationalMessage
            score={(calledIndex + 1) * 5}
            total={calledList.length * 5}
            customMessage="¡Hiciste BINGO! ¡Increíble!"
            customSubtitle="Encontraste todas las palabras del cartón"
            celebrationText="Felicitaciones"
            onComplete={() => {
              setShowMotivational(false);
              setShowLevelComplete(true);
            }}
          />
        )}

        {/* MODAL FINAL */}
        {showLevelComplete && (
          <LevelCompleteModal
            score={(calledIndex + 1) * 5}
            total={calledList.length * 5}
            level={level}
            isLastLevel={level >= 3}
            onNextLevel={handleNextLevel}
            onRestart={restartLevel}
            onExit={onBack}
          />
        )}
      </div>
      </AccessibilitySettingsWrapper>
    </LevelLock>
  );
}