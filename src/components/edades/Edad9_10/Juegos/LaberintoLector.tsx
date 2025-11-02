import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Navigation, Flag, Book } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';
import { GameHeader } from '../../../others/GameHeader';
import { ProgressBar } from '../../../others/ProgressBar';
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { StartScreenLaberintoLector } from "../IniciosJuegosLecturas/StartScreenLaberintoLector/StartScreenLaberintoLector";

interface LaberintoLectorProps {
  onBack: () => void;
  level: number;
}

interface MazeCell {
  type: 'wall' | 'path' | 'start' | 'question' | 'treasure' | 'finish';
  visited: boolean;
  question?: {
    text: string;
    options: string[];
    correct: number;
    explanation: string;
    points: number;
  };
  reward?: number;
  treasureInfo?: {
    name: string;
    emoji: string;
    points: number;
  };
}

interface Position {
  row: number;
  col: number;
}

const mazeConfigs = {
  1: {
    name: "Laberinto del Aprendiz",
    data: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'start', 'path', 'question', 'path', 'path', 'wall', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'wall', 'path', 'wall', 'wall'],
      ['wall', 'path', 'path', 'treasure', 'wall', 'path', 'path', 'wall'],
      ['wall', 'wall', 'path', 'wall', 'wall', 'question', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
      ['wall', 'path', 'wall', 'treasure', 'wall', 'wall', 'finish', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
    ],
    questions: 2,
    treasures: 2
  },
  2: {
    name: "Laberinto del Explorador",
    data: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'start', 'path', 'question', 'path', 'treasure', 'path', 'wall', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall'],
      ['wall', 'path', 'path', 'treasure', 'wall', 'path', 'path', 'question', 'wall'],
      ['wall', 'wall', 'path', 'wall', 'wall', 'question', 'path', 'wall', 'wall'],
      ['wall', 'treasure', 'path', 'path', 'path', 'path', 'path', 'path', 'wall'],
      ['wall', 'path', 'wall', 'question', 'wall', 'wall', 'treasure', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'finish', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
    ],
    questions: 4,
    treasures: 4
  },
  3: {
    name: "Laberinto del Maestro",
    data: [
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
      ['wall', 'start', 'path', 'question', 'path', 'treasure', 'path', 'question', 'wall', 'wall'],
      ['wall', 'path', 'wall', 'wall', 'wall', 'path', 'wall', 'path', 'wall', 'wall'],
      ['wall', 'treasure', 'path', 'treasure', 'wall', 'path', 'path', 'question', 'path', 'wall'],
      ['wall', 'wall', 'path', 'wall', 'wall', 'question', 'path', 'wall', 'path', 'wall'],
      ['wall', 'question', 'path', 'path', 'path', 'path', 'path', 'path', 'treasure', 'wall'],
      ['wall', 'path', 'wall', 'treasure', 'wall', 'wall', 'question', 'path', 'path', 'wall'],
      ['wall', 'path', 'path', 'path', 'path', 'path', 'path', 'treasure', 'path', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'path', 'path', 'finish', 'wall'],
      ['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall']
    ],
    questions: 6,
    treasures: 6
  }
};

const questions = [
  { text: "¿Cuál es la función principal de los adjetivos?", options: ["Expresar acciones", "Describir sustantivos", "Unir palabras", "Indicar tiempo"], correct: 1, explanation: "Los adjetivos describen o califican a los sustantivos.", points: 40 },
  { text: "En la oración 'El perro corre rápido', ¿cuál es el verbo?", options: ["El", "perro", "corre", "rápido"], correct: 2, explanation: "El verbo 'corre' expresa la acción.", points: 30 },
  { text: "¿Qué tipo de palabra es 'hermoso'?", options: ["Sustantivo", "Verbo", "Adjetivo", "Artículo"], correct: 2, explanation: "'Hermoso' es un adjetivo.", points: 40 },
  { text: "¿Cuántas vocales tiene la palabra 'mariposa'?", options: ["3", "4", "5", "6"], correct: 1, explanation: "'mariposa' tiene 4 vocales: a-i-o-a.", points: 30 },
  { text: "¿Cuál de estas palabras es un sustantivo?", options: ["Correr", "Azul", "Mesa", "Rápidamente"], correct: 2, explanation: "'Mesa' es un sustantivo.", points: 30 },
  { text: "¿Qué figura retórica se usa en 'Sus ojos son dos estrellas'?", options: ["Comparación", "Metáfora", "Personificación", "Hipérbole"], correct: 1, explanation: "Es una metáfora.", points: 50 },
  { text: "¿Cuál es el sinónimo de 'alegre'?", options: ["Triste", "Feliz", "Cansado", "Enojado"], correct: 1, explanation: "'Feliz' es sinónimo de 'alegre'.", points: 30 },
  { text: "¿Qué tiempo verbal es 'corrimos'?", options: ["Presente", "Futuro", "Pretérito", "Condicional"], correct: 2, explanation: "'Corrimos' está en pretérito.", points: 40 },
  { text: "¿Cuál es el antónimo de 'alto'?", options: ["Grande", "Bajo", "Ancho", "Largo"], correct: 1, explanation: "'Bajo' es el antónimo de 'alto'.", points: 30 },
  { text: "¿Qué tipo de palabra es 'y' en la oración 'Juan y María'?", options: ["Sustantivo", "Conjunción", "Adjetivo", "Verbo"], correct: 1, explanation: "'Y' es una conjunción.", points: 40 },
  { text: "¿Cuántas sílabas tiene la palabra 'elefante'?", options: ["2", "3", "4", "5"], correct: 2, explanation: "'Elefante' tiene 4 sílabas.", points: 30 },
  { text: "¿Qué función cumple el punto en una oración?", options: ["Separar palabras", "Terminar oraciones", "Unir ideas", "Hacer pausas"], correct: 1, explanation: "El punto termina oraciones.", points: 30 },
  { text: "¿Cuál de estas palabras está bien escrita?", options: ["Sivuela", "Escuela", "Escuella", "Ezcuela"], correct: 1, explanation: "La forma correcta es 'escuela'.", points: 40 },
  { text: "¿Qué tipo de texto es una receta de cocina?", options: ["Narrativo", "Instructivo", "Descriptivo", "Argumentativo"], correct: 1, explanation: "Una receta es instructiva.", points: 40 },
  { text: "¿Cuál es el aumentativo de 'casa'?", options: ["Casita", "Casón", "Casilla", "Caseta"], correct: 1, explanation: "'Casón' es el aumentativo.", points: 50 },
  { text: "¿Qué significa la palabra 'transparente'?", options: ["Que se rompe fácil", "Que se ve a través", "Que es muy claro", "Que brilla mucho"], correct: 1, explanation: "'Transparente' permite ver a través.", points: 30 }
];

const treasureTypes = [
  { name: "Diamante Brillante", emoji: "💎", points: 50 },
  { name: "Cofre Dorado", emoji: "🏆", points: 60 },
  { name: "Gema Mágica", emoji: "✨", points: 55 },
  { name: "Moneda Antigua", emoji: "🪙", points: 45 },
  { name: "Cristal Especial", emoji: "🔮", points: 70 }
];

export function LaberintoLector({ onBack, level }: LaberintoLectorProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const MAX_LEVEL = 3;
  const [currentLevel, setCurrentLevel] = useState(Math.min(Math.max(level, 1), MAX_LEVEL));
  const [maze, setMaze] = useState<MazeCell[][]>([]);
  const [playerPosition, setPlayerPosition] = useState<Position>({ row: 1, col: 1 });
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [treasuresFound, setTreasuresFound] = useState(0);
  const [totalTreasures, setTotalTreasures] = useState(0);
  const [currentTreasure, setCurrentTreasure] = useState<any>(null);
  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  useEffect(() => {
    initializeMaze();
  }, [currentLevel]);

  const initializeMaze = () => {
    const config = mazeConfigs[currentLevel as keyof typeof mazeConfigs];
    const newMaze: MazeCell[][] = config.data.map((row) =>
      row.map((cell) => {
        const cellData: MazeCell = { type: cell as any, visited: false };
        if (cell === 'question') {
          cellData.question = questions[Math.floor(Math.random() * questions.length)];
        } else if (cell === 'treasure') {
          const treasureType = treasureTypes[Math.floor(Math.random() * treasureTypes.length)];
          cellData.reward = treasureType.points;
          cellData.treasureInfo = treasureType;
        }
        return cellData;
      })
    );

    let treasureCount = 0;
    newMaze.forEach(row => row.forEach(cell => { if (cell.type === 'treasure') treasureCount++; }));
    setMaze(newMaze);
    setTotalTreasures(treasureCount);
    setPlayerPosition({ row: 1, col: 1 });
    setScore(0);
    setTreasuresFound(0);
    setGameComplete(false);
  };

  const canMoveTo = (newRow: number, newCol: number): boolean => {
    if (newRow < 0 || newRow >= maze.length || newCol < 0 || newCol >= maze[0].length) return false;
    return maze[newRow][newCol].type !== 'wall';
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (showQuestion || gameComplete || showMotivational || showLevelComplete) return;

    const { row, col } = playerPosition;
    let newRow = row, newCol = col;

    switch (direction) {
      case 'up': newRow = row - 1; break;
      case 'down': newRow = row + 1; break;
      case 'left': newCol = col - 1; break;
      case 'right': newCol = col + 1; break;
    }

    if (canMoveTo(newRow, newCol)) {
      setPlayerPosition({ row: newRow, col: newCol });
      const cell = maze[newRow][newCol];
      const wasVisited = cell.visited;

      if (cell.type === 'question' && !wasVisited) {
        setCurrentQuestion(cell.question);
        setShowQuestion(true);
        setQuestionAnswered(false);
      } else if (cell.type === 'treasure' && !wasVisited) {
        const treasureInfo = cell.treasureInfo!;
        const points = cell.reward!;
        setScore(s => s + points);
        setTreasuresFound(t => t + 1);
        setCurrentTreasure(treasureInfo);
        setShowTreasureModal(true);
        setShowReward(true);
        setTimeout(() => { setShowTreasureModal(false); setShowReward(false); }, 3000);
        if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100, 50, 200]);
      } else if (cell.type === 'finish') {
        setGameComplete(true);
        if (window.navigator.vibrate) window.navigator.vibrate([200, 100, 200, 100, 200]);
      }

      const newMaze = [...maze];
      newMaze[newRow][newCol].visited = true;
      setMaze(newMaze);
    }
  };

  const handleQuestionAnswer = (answerIndex: number) => {
    if (!currentQuestion || questionAnswered) return;
    setQuestionAnswered(true);
    const isCorrect = answerIndex === currentQuestion.correct;
    if (isCorrect) {
      const points = currentQuestion.points || 30;
      setScore(s => s + points);
      setShowReward(true);
      setTimeout(() => { setShowReward(false); }, 2500);
      if (window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);
    } else {
      if (window.navigator.vibrate) window.navigator.vibrate([100]);
    }
    setTimeout(() => {
      setShowQuestion(false);
      setCurrentQuestion(null);
      setQuestionAnswered(false);
    }, 3000);
  };

  const handleNextLevel = () => {
    const nextLevel = currentLevel < MAX_LEVEL ? currentLevel + 1 : 1;
    setCurrentLevel(nextLevel);
    setShowMotivational(false);
    setShowLevelComplete(false);
  };

  const handleRepeatLevel = () => {
    initializeMaze();
    setShowMotivational(false);
    setShowLevelComplete(false);
  };

  useEffect(() => {
    if (gameComplete) {
      setShowMotivational(true);
    }
  }, [gameComplete]);

  const completionBonus = gameComplete && treasuresFound === totalTreasures ? 100 : 0;
  const finalScore = score + completionBonus;

  if (!gameStarted) {
    return <StartScreenLaberintoLector onStart={() => setGameStarted(true)} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-emerald-100 via-teal-100 to-blue-100">
      <div className="max-w-7xl mx-auto">
        <GameHeader
          title={`Laberinto Lector`}
          level={currentLevel}
          score={score}
          onBack={onBack}
          onRestart={handleRepeatLevel}
        />

        <ProgressBar
          current={treasuresFound}
          total={totalTreasures}
          progress={(treasuresFound / totalTreasures) * 100}
          className="mb-6"
        />

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <AnimalGuide
            animal="turtle"
            message={
              currentLevel === 1
                ? "¡Bienvenido al Laberinto del Aprendiz! Encuentra tesoros, responde preguntas y llega a la meta. Usa las flechas para moverte."
                : currentLevel === 2
                  ? "¡Ahora en el Laberinto del Explorador! Más tesoros y preguntas te esperan. ¡Tu sabiduría está creciendo!"
                  : "¡Has llegado al Laberinto del Maestro! Este es el desafío final. ¡Demuestra todo lo que has aprendido!"
            }
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-teal-200 mb-4">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-black flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-teal-500" />
                  Controles
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div></div>
                  <Button onClick={() => movePlayer('up')} variant="outline" className="h-12 bg-white/80 text-black" disabled={showQuestion}>↑</Button>
                  <div></div>
                  <Button onClick={() => movePlayer('left')} variant="outline" className="h-12 bg-white/80 text-black" disabled={showQuestion}>←</Button>
                  <div className="h-12 bg-gray-100 rounded border-2 border-gray-200 flex items-center justify-center text-2xl">🧭</div>
                  <Button onClick={() => movePlayer('right')} variant="outline" className="h-12 bg-white/80 text-black" disabled={showQuestion}>→</Button>
                  <div></div>
                  <Button onClick={() => movePlayer('down')} variant="outline" className="h-12 bg-white/80 text-black" disabled={showQuestion}>↓</Button>
                  <div></div>
                </div>
                <div className="text-sm text-black space-y-2">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-400 rounded"></div><span>Camino</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-blue-400 rounded"></div><span>Pregunta</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-yellow-400 rounded"></div><span>Tesoro</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-400 rounded"></div><span>Meta</span></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Flag className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg text-black">Laberinto</h3>
                </div>
                <div className={`grid gap-1 mx-auto`} style={{ gridTemplateColumns: `repeat(${maze[0]?.length || 8}, minmax(0, 1fr))`, maxWidth: maze[0]?.length > 8 ? '600px' : '400px' }}>
                  {maze.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const isPlayer = playerPosition.row === rowIndex && playerPosition.col === colIndex;
                      let cellClass = `${maze[0]?.length > 8 ? 'w-6 h-6' : 'w-8 h-8'} flex items-center justify-center text-xs transition-all duration-200 border rounded`;
                      let content = "";
                      switch (cell.type) {
                        case 'wall': cellClass += " bg-gray-800 border-gray-700"; break;
                        case 'path': case 'start': cellClass += cell.visited ? " bg-green-200 border-green-300" : " bg-green-100 border-green-200"; break;
                        case 'question': cellClass += cell.visited ? " bg-blue-200 border-blue-300" : " bg-blue-100 border-blue-200"; content = "❓"; break;
                        case 'treasure': cellClass += cell.visited ? " bg-yellow-200 border-yellow-300" : " bg-yellow-100 border-yellow-200"; content = cell.visited ? "✔️" : (cell.treasureInfo?.emoji || "💎"); break;
                        case 'finish': cellClass += " bg-red-100 border-red-200"; content = "🏁"; break;
                      }
                      return (
                        <motion.div key={`${rowIndex}-${colIndex}`} className={cellClass} animate={isPlayer ? { scale: [1, 1.2, 1] } : {}}>
                          {isPlayer ? "🚶" : content}
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showQuestion && currentQuestion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} className="max-w-lg w-full">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-4 border-blue-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity }}><Book className="w-6 h-6 text-blue-500" /></motion.div>
                      <h3 className="text-xl text-black"> 🤔 Pregunta del Laberinto</h3>
                    </div>
                    <motion.div animate={{ scale: [1, 1.1, 1] }} className="bg-blue-500 text-white px-3 py-1 rounded-full">
                      <span className="text-sm">+{currentQuestion.points} pts</span>
                    </motion.div>
                  </div>
                  <div className="mb-4"><AudioPlayer text="Reproduciendo pregunta..." duration={2000} className="mb-4" /></div>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6 p-4 bg-white/80 rounded-lg border-2 border-blue-200">
                    <p className="text-black text-lg">{currentQuestion.text}</p>
                  </motion.div>
                  <div className="space-y-3">
                    {currentQuestion.options.map((option: string, index: number) => (
                      <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                        <Button onClick={() => handleQuestionAnswer(index)} disabled={questionAnswered} variant={questionAnswered ? (index === currentQuestion.correct ? "default" : "outline") : "outline"}
                          className={`w-full justify-start p-4 text-left text-black ${questionAnswered ? (index === currentQuestion.correct ? "bg-green-500 text-white" : "opacity-50") : "bg-white/90 hover:bg-white"}`}>
                          <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>{option}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  {questionAnswered && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-blue-100 rounded-lg border-2 border-blue-300">
                      <div className="flex items-start gap-2">
                        <div className="text-2xl">💡</div>
                        <div>
                          <div className="text-black font-semibold mb-1">Explicación:</div>
                          <p className="text-black">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        <RewardAnimation type="star" show={showReward} />
        
        {/* MENSAJE MOTIVACIONAL */}
        {showMotivational && (
          <MotivationalMessage
            score={finalScore}
            total={1000}
            customMessage="¡Eres un explorador increíble!"
            customSubtitle="¡Completaste el laberinto!"
            onComplete={() => {
              setShowMotivational(false);
              setShowLevelComplete(true);
            }}
          />
        )}

        {/* MODAL FINAL */}
        {showLevelComplete && (
          <LevelCompleteModal
            score={finalScore}
            total={1000}
            level={currentLevel}
            isLastLevel={currentLevel >= 3}
            onNextLevel={handleNextLevel}
            onRestart={handleRepeatLevel}
            onExit={onBack}
          />
        )}

        {showTreasureModal && currentTreasure && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }} className="max-w-sm w-full">
              <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-400">
                <CardContent className="p-8 text-center">
                  <motion.div animate={{ scale: [1, 1.2, 1, 1.1, 1], rotate: [0, 10, -10, 5, 0] }} className="text-6xl mb-4">{currentTreasure.emoji}</motion.div>
                  <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-2xl mb-2 text-black">¡Tesoro Encontrado!</motion.h3>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-xl text-black mb-1">{currentTreasure.name}</div>
                    <div className="text-lg text-black">+{currentTreasure.points} puntos</div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
                    <Button onClick={() => setShowTreasureModal(false)} className="bg-yellow-500 hover:bg-yellow-600 text-white mt-4">¡Continuar!</Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
