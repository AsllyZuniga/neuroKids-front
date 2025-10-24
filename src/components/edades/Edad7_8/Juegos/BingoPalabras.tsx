import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, Trophy, ArrowRight } from "lucide-react";
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { RewardAnimation } from "../../../others/RewardAnimation";


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
  const [level, setLevel] = useState(1);
  const data = gameData[level];
  const [grid, setGrid] = useState<WordItem[]>([]);
  const [calledList, setCalledList] = useState<string[]>([]);
  const [calledIndex, setCalledIndex] = useState(0);
  const [bingoAchieved, setBingoAchieved] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const currentWord = calledList[calledIndex] || "";


  const progress = (calledIndex / calledList.length) * 100;

  useEffect(() => {
    const shuffled = [...data.words].sort(() => Math.random() - 0.5);
    const gridSize = data.rows ? data.gridSize * data.rows : data.gridSize * data.gridSize;
    setGrid(shuffled.slice(0, gridSize));
    setCalledList([...data.calledWords]);
    setCalledIndex(0);
    setBingoAchieved(false);
    setShowReward(false);
  }, [level, data]);

  useEffect(() => {
    if (currentWord && !bingoAchieved) {
      speakCurrentWord();
    }
  }, [calledIndex, bingoAchieved]);

  const speakCurrentWord = () => {
    if ("speechSynthesis" in window) {
      const msg = new SpeechSynthesisUtterance(currentWord);
      msg.lang = "es-ES";
      msg.rate = 0.6;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(msg);
    }
  };


  const isWordOnCard = grid.some((c) => c.word === currentWord);


  const handleCellClick = (word: string) => {
    if (word === currentWord && !bingoAchieved) {
      setGrid((prevGrid) =>
        prevGrid.map((cell) =>
          cell.word === word ? { ...cell, matched: true } : cell
        )
      );
      new Audio("/sounds/correct.mp3").play();
      setTimeout(() => goToNextWord(), 800);
    }
  };


  const goToNextWord = () => {
    if (calledIndex + 1 < calledList.length) {
      setCalledIndex(calledIndex + 1);
    } else {
      setBingoAchieved(true);
      setShowReward(true);
    }
  };


  const handleNextLevel = () => {
    if (level < 3) {
      setLevel(level + 1);
      setBingoAchieved(false);
    } else {
      onBack();
    }
  };

  const restartLevel = () => {
    setCalledIndex(0);
    setGrid(grid.map(cell => ({ ...cell, matched: false })));
    setBingoAchieved(false);
    setShowReward(false);
  };

  /*pantalla final*/
  if (bingoAchieved) {
    const isLastLevel = level === 3;

    return (
      <div
        className="min-h-screen p-4 sm:p-6"
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
          <Card className="bg-white/95 backdrop-blur-sm w-full max-w-md mx-4">
            <CardContent className="p-6 sm:p-8 text-center">
              <div className="text-5xl sm:text-6xl mb-4">🎉</div>
              <h2 className="text-xl sm:text-2xl mb-4 text-gray-800">
                ¡Bien hecho!
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {isLastLevel
                  ? `¡Has completado todos los niveles!`
                  : `¡Has completado el nivel ${level}!`}
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-yellow-600 text-sm sm:text-base">Nivel completado</span>
              </div>
              <div className="flex flex-col gap-2">
                {!isLastLevel && (
                  <Button
                    onClick={handleNextLevel}
                    className="bg-green-500 hover:bg-green-600 w-full text-sm sm:text-base"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Siguiente Nivel ({level + 1})
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button onClick={restartLevel} className="bg-purple-500 hover:bg-purple-600 flex-1 text-sm sm:text-base">
                    Repetir Nivel
                  </Button>
                  <Button onClick={onBack} variant="outline" className="flex-1 text-sm sm:text-base">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-pink-200 flex flex-col items-center p-4 sm:p-6 font-[OpenDyslexic]">
      <div className="w-full">
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-6">
          <Button onClick={onBack} variant="outline" className="bg-black/80 text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
          <h1 className="text-lg sm:text-xl font-semibold text-black">
            🎯 Bingo de Palabras — Nivel {level}
          </h1>
          <div className="text-xs sm:text-sm text-gray-600">
            Palabra {calledIndex + 1} de {calledList.length}
          </div>
        </div>

        {/* Progreso */}
        <div className="mb-6">
          <div className="h-4 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-yellow-400 to-green-500 rounded-full"
            />
          </div>
          <div className="text-center text-gray-600 mt-2 text-sm sm:text-base">
            Progreso: {progress.toFixed(1)}%
          </div>
        </div>


        <Card className="bg-white/90 border mb-4 rounded-xl">
          <CardContent className="flex justify-between items-center p-3">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🦉</div>
              <div>
                <div className="font-semibold text-gray-800 text-sm sm:text-base">Búho Lector</div>
                <div className="text-xs sm:text-sm text-gray-600">
                  ¡Escucha y elige la palabra correcta!
                </div>
              </div>
            </div>
            <Button onClick={speakCurrentWord} variant="outline" className="text-sm sm:text-base">
              <Volume2 className="w-4 h-4 mr-2" /> Repetir
            </Button>
          </CardContent>
        </Card>


        <div className="grid md:grid-cols-3 gap-5">
          {/* Izquierda */}
          <div className="flex flex-col items-center bg-white/90 p-5 rounded-2xl shadow-sm">
            <h2 className="text-base sm:text-lg font-medium text-gray-700 mb-2">Palabra actual</h2>
            <div className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-3">{currentWord}</div>

            {!isWordOnCard && (
              <div className="text-yellow-700 text-xs sm:text-sm text-center bg-yellow-50 rounded-md p-2 mb-2">

              </div>
            )}

            <Button
              onClick={goToNextWord}
              disabled={isWordOnCard}
              className={`w-full text-sm sm:text-base ${isWordOnCard
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
            >
              Siguiente palabra
            </Button>
          </div>


          <div className="md:col-span-2 bg-white/90 p-3 sm:p-4 rounded-2xl shadow-sm max-w-full">
            <div
              className="grid gap-2 sm:gap-3"
              style={{
                gridTemplateColumns: `repeat(${data.gridSize}, minmax(100px, 1fr))`,
                gridTemplateRows: `repeat(${data.rows || data.gridSize}, minmax(100px, 1fr))`,
              }}
            >
              {grid.map((cell, i) => (
                <motion.div key={i} whileTap={{ scale: 0.95 }}>
                  <Card
                    onClick={() => handleCellClick(cell.word)}
                    className={`cursor-pointer text-center p-2 border-2 rounded-xl transition-all 
                      ${cell.matched
                        ? "border-blue-500 bg-blue-100 shadow-md"
                        : "border-blue-200 hover:bg-blue-100"
                      }`}
                  >
                    <CardContent className="flex flex-col items-center">
                      <div className="text-3xl sm:text-4xl mb-1">{cell.emoji}</div>
                      <div className="text-base sm:text-lg text-gray-800">{cell.word}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showReward && (
        <RewardAnimation
          type="star"
          show={showReward}
          message="¡Muy bien!"
          onComplete={() => setShowReward(false)}
        />
      )}
    </div>
  );
}