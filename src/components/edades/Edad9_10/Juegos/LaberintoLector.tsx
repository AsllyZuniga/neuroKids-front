import { useState, useEffect, type JSX } from 'react';
import { motion } from "framer-motion";
import { Navigation, Flag, Book } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { GameHeader } from '../../../others/GameHeader';
import { ProgressBar } from '../../../others/ProgressBar';
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { StartScreenLaberintoLector } from "../IniciosJuegosLecturas/StartScreenLaberintoLector";

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
  { text: "Lee: 'El perro corre en el parque'. ¿Qué hace el perro?", options: ["Duerme", "Corre", "Come", "Salta"], correct: 1, explanation: "El texto dice que el perro corre.", points: 30 },
  { text: "Lee: 'Ana tiene un globo rojo'. ¿De qué color es el globo?", options: ["Azul", "Verde", "Rojo", "Amarillo"], correct: 2, explanation: "El texto dice que el globo es rojo.", points: 30 },
  { text: "Lee: 'Juan está en la escuela'. ¿Dónde está Juan?", options: ["En casa", "En la escuela", "En el parque", "En la playa"], correct: 1, explanation: "La frase dice que Juan está en la escuela.", points: 30 },
  { text: "¿Cuántas vocales tiene la palabra 'mariposa'?", options: ["3", "4", "5", "6"], correct: 1, explanation: "'mariposa' tiene 4 vocales: a-i-o-a.", points: 30 },
  { text: "Si tienes frío, ¿qué es mejor hacer?", options: ["Ponerte una chaqueta", "Comer helado", "Dormir en el suelo", "Mojarte"], correct: 0, explanation: "Cuando hace frío, usamos ropa para calentarnos.", points: 30 },
  { text: "El pez vive en el ____.", options: ["cielo", "agua", "árbol", "fuego"], correct: 1, explanation: "Los peces viven en el agua.", points: 30, },
  { text: "¿Cuál es el sinónimo de 'alegre'?", options: ["Triste", "Feliz", "Cansado", "Enojado"], correct: 1, explanation: "'Feliz' es sinónimo de 'alegre'.", points: 30 },
  { text: "Si ganas un juego, ¿cómo te sientes?", options: ["Triste", "Feliz", "Enojado", "Asustado"], correct: 1, explanation: "Cuando ganamos, nos sentimos felices.", points: 30 },
  { text: "¿Cuál es el antónimo de 'alto'?", options: ["Grande", "Bajo", "Ancho", "Largo"], correct: 1, explanation: "'Bajo' es el antónimo de 'alto'.", points: 30 },
  { text: "¿Cuál NO es un animal?", options: ["Perro", "Gato", "Mesa", "Pájaro"], correct: 2, explanation: "La mesa no es un animal.", points: 30 },
  { text: "¿Cuántas sílabas tiene la palabra 'elefante'?", options: ["2", "3", "4", "5"], correct: 2, explanation: "'Elefante' tiene 4 sílabas.", points: 30 },
  { text: "¿Qué función cumple el punto en una oración?", options: ["Separar palabras", "Terminar oraciones", "Unir ideas", "Hacer pausas"], correct: 1, explanation: "El punto termina oraciones.", points: 30 },
  { text: "Lee: 'Pedro tiene tres lápices'. ¿Cuántos lápices tiene Pedro?", options: ["Uno", "Dos", "Tres", "Cuatro"], correct: 2, explanation: "Pedro tiene tres lápices.", points: 30, },
  { text: "Antes de dormir, ¿qué haces?", options: ["Desayunar", "Ponerte pijama", "Ir a clases", "Jugar fútbol"], correct: 1, explanation: "Antes de dormir usamos pijama.", points: 30 },
  { text: "El sol sirve para dar ____.", options: ["ruido", "calor", "miedo", "sombra"], correct: 1, explanation: "El sol nos da calor y luz.", points: 30 },
  { text: "¿Qué cosa NO se puede comer?", options: ["Pan", "Manzana", "Piedra", "Arroz"], correct: 2, explanation: "La piedra no se puede comer.", points: 30 }
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
  const [questionsAnsweredCount, setQuestionsAnsweredCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const totalObjectives = totalTreasures + totalQuestions;
  const completedObjectives = treasuresFound + questionsAnsweredCount;
  const [showFinishWarning, setShowFinishWarning] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState([...questions]);

  const progressValue =
    totalObjectives > 0
      ? (completedObjectives / totalObjectives) * 100
      : 0;


  useEffect(() => {
    initializeMaze();
  }, [currentLevel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showQuestion || gameComplete || showMotivational || showLevelComplete) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          movePlayer("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          movePlayer("down");
          break;
        case "ArrowLeft":
          e.preventDefault();
          movePlayer("left");
          break;
        case "ArrowRight":
          e.preventDefault();
          movePlayer("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPosition, showQuestion, gameComplete, showMotivational, showLevelComplete]);


  const initializeMaze = () => {
    const config = mazeConfigs[currentLevel as keyof typeof mazeConfigs];
    let pool = [...availableQuestions];
    const newMaze: MazeCell[][] = config.data.map((row) =>
      row.map((cell) => {
        const cellData: MazeCell = { type: cell as any, visited: false };
        if (cell === 'question' && pool.length > 0) {
          const index = Math.floor(Math.random() * pool.length);
          cellData.question = pool[index];
          pool.splice(index, 1);
        } else if (cell === 'treasure') {
          const treasureType = treasureTypes[Math.floor(Math.random() * treasureTypes.length)];
          cellData.reward = treasureType.points;
          cellData.treasureInfo = treasureType;
        }
        return cellData;
      })
    );

    let treasureCount = 0;
    let questionCount = 0;


    newMaze.forEach(row => row.forEach(cell => { if (cell.type === 'treasure') treasureCount++; if (cell.type === 'question') questionCount++; }));
    setMaze(newMaze);
    setTotalTreasures(treasureCount);
    setPlayerPosition({ row: 1, col: 1 });
    setScore(0);
    setTreasuresFound(0);
    setGameComplete(false);
    setTotalQuestions(questionCount);
    setQuestionsAnsweredCount(0);
    setAvailableQuestions(pool);


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
        if (completedObjectives >= totalObjectives) {
          setGameComplete(true);
          if (window.navigator.vibrate)
            window.navigator.vibrate([200, 100, 200]);
        } else {
          setShowFinishWarning(true);
          setTimeout(() => setShowFinishWarning(false), 2500);
        }
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
      setQuestionsAnsweredCount(q => q + 1);
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
    if (availableQuestions.length === 0) {
      setAvailableQuestions([...questions]);
    }
  }, [availableQuestions]);

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
          current={completedObjectives}
          total={totalObjectives}
          progress={progressValue}
          className="mb-6"
        />

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <AnimalGuide
            animal="koala"
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
                  <Button onClick={() => movePlayer('up')} variant="outline" className="h-12 border-2 border-gray-200 bg-white/80  text-black" disabled={showQuestion}>↑</Button>
                  <div></div>
                  <Button onClick={() => movePlayer('left')} variant="outline" className="h-12 border-2 border-gray-200 bg-white/80 text-black" disabled={showQuestion}>←</Button>
                  <div className="h-12 bg-gray-100 rounded border-2 border-gray-200 flex items-center justify-center text-2xl">🧭</div>
                  <Button onClick={() => movePlayer('right')} variant="outline" className="h-12 border-2 border-gray-200  bg-white/80 text-black" disabled={showQuestion}>→</Button>
                  <div></div>
                  <Button onClick={() => movePlayer('down')} variant="outline" className="h-12 border-2 border-gray-200 bg-white/80 text-black" disabled={showQuestion}>↓</Button>
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
                <div className={`grid gap-1 mx-auto`} style={{ gridTemplateColumns: `repeat(${maze[0]?.length || 8}, minmax(0, 1fr))`, maxWidth: maze[0]?.length > 8 ? '800px' : '100%' }}>
                  {maze.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const isPlayer = playerPosition.row === rowIndex && playerPosition.col === colIndex;
                      let cellClass = `${maze[0]?.length > 8 ? 'w-6 h-6' : 'w-8 h-8'} flex items-center justify-center text-xs transition-all duration-200 border rounded`;
                      let content: string | JSX.Element = "";
                      switch (cell.type) {
                        case 'wall':
                          cellClass += " bg-gray-800 border-gray-700 shadow-inner relative overflow-hidden";
                          content = (
                            <motion.div
                              initial={{ y: -4 }}
                              animate={{ y: [0, -2, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="w-full h-full bg-gray-900"
                            />
                          );
                          break;

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
            celebrationText="¡Eres lo máximo!"
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
        {showFinishWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-xl text-center text-lg font-bold text-purple-700">
              🧭 ¡Aún no terminamos!
              <br />
              Recorre todo el camino y encuentra los tesoros y preguntas.
            </div>
          </motion.div>
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
