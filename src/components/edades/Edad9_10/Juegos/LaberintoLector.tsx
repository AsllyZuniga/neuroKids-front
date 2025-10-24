import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Star, Navigation, MapPin, Flag, Book } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';
import { s } from 'framer-motion/client';

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
  {
    text: "¿Cuál es la función principal de los adjetivos?",
    options: ["Expresar acciones", "Describir sustantivos", "Unir palabras", "Indicar tiempo"],
    correct: 1,
    explanation: "Los adjetivos describen o califican a los sustantivos, añadiendo información sobre sus características.",
    difficulty: "medium",
    points: 40
  },
  {
    text: "En la oración 'El perro corre rápido', ¿cuál es el verbo?",
    options: ["El", "perro", "corre", "rápido"],
    correct: 2,
    explanation: "El verbo 'corre' expresa la acción que realiza el sujeto (el perro).",
    difficulty: "easy",
    points: 30
  },
  {
    text: "¿Qué tipo de palabra es 'hermoso'?",
    options: ["Sustantivo", "Verbo", "Adjetivo", "Artículo"],
    correct: 2,
    explanation: "'Hermoso' es un adjetivo que describe una cualidad o característica.",
    difficulty: "medium",
    points: 40
  },
  {
    text: "¿Cuántas vocales tiene la palabra 'mariposa'?",
    options: ["3", "4", "5", "6"],
    correct: 1,
    explanation: "La palabra 'mariposa' tiene 4 vocales: a-i-o-a.",
    difficulty: "easy",
    points: 30
  },
  {
    text: "¿Cuál de estas palabras es un sustantivo?",
    options: ["Correr", "Azul", "Mesa", "Rápidamente"],
    correct: 2,
    explanation: "'Mesa' es un sustantivo porque nombra un objeto o cosa.",
    difficulty: "easy",
    points: 30
  },
  {
    text: "¿Qué figura retórica se usa en 'Sus ojos son dos estrellas'?",
    options: ["Comparación", "Metáfora", "Personificación", "Hipérbole"],
    correct: 1,
    explanation: "Es una metáfora porque compara directamente los ojos con estrellas sin usar 'como'.",
    difficulty: "hard",
    points: 50
  },
  {
    text: "¿Cuál es el sinónimo de 'alegre'?",
    options: ["Triste", "Feliz", "Cansado", "Enojado"],
    correct: 1,
    explanation: "'Feliz' es sinónimo de 'alegre' porque ambas expresan un estado de ánimo positivo.",
    difficulty: "easy",
    points: 30
  },
  {
    text: "¿Qué tiempo verbal es 'corrimos'?",
    options: ["Presente", "Futuro", "Pretérito", "Condicional"],
    correct: 2,
    explanation: "'Corrimos' está en tiempo pretérito porque indica una acción del pasado.",
    difficulty: "medium",
    points: 40
  },
  {
    text: "¿Cuál es el antónimo de 'alto'?",
    options: ["Grande", "Bajo", "Ancho", "Largo"],
    correct: 1,
    explanation: "'Bajo' es el antónimo de 'alto' porque expresan ideas opuestas de altura.",
    difficulty: "easy",
    points: 30
  },
  {
    text: "¿Qué tipo de palabra es 'y' en la oración 'Juan y María'?",
    options: ["Sustantivo", "Conjunción", "Adjetivo", "Verbo"],
    correct: 1,
    explanation: "'Y' es una conjunción que une palabras o frases.",
    difficulty: "medium",
    points: 40
  },
  {
    text: "¿Cuántas sílabas tiene la palabra 'elefante'?",
    options: ["2", "3", "4", "5"],
    correct: 2,
    explanation: "'Elefante' tiene 4 sílabas: e-le-fan-te.",
    difficulty: "easy",
    points: 30
  },
  {
    text: "¿Qué función cumple el punto en una oración?",
    options: ["Separar palabras", "Terminar oraciones", "Unir ideas", "Hacer pausas"],
    correct: 1,
    explanation: "El punto se usa para terminar oraciones declarativas.",
    difficulty: "easy",
    points: 30
  },
  {
    text: "¿Cuál de estas palabras está bien escrita?",
    options: ["Sivuela", "Escuela", "Escuella", "Ezcuela"],
    correct: 1,
    explanation: "La forma correcta es 'escuela' con 'c' y sin doble 'l'.",
    difficulty: "medium",
    points: 40
  },
  {
    text: "¿Qué tipo de texto es una receta de cocina?",
    options: ["Narrativo", "Instructivo", "Descriptivo", "Argumentativo"],
    correct: 1,
    explanation: "Una receta es un texto instructivo porque da pasos para hacer algo.",
    difficulty: "medium",
    points: 40
  },
  {
    text: "¿Cuál es el aumentativo de 'casa'?",
    options: ["Casita", "Casón", "Casilla", "Caseta"],
    correct: 1,
    explanation: "'Casón' es el aumentativo de 'casa', indica mayor tamaño.",
    difficulty: "hard",
    points: 50
  },
  {
    text: "¿Qué significa la palabra 'transparente'?",
    options: ["Que se rompe fácil", "Que se ve a través", "Que es muy claro", "Que brilla mucho"],
    correct: 1,
    explanation: "'Transparente' significa que permite ver a través de él.",
    difficulty: "easy",
    points: 30
  }
];

const treasureTypes = [
  { name: "Diamante Brillante", emoji: "💎", points: 50 },
  { name: "Cofre Dorado", emoji: "🏆", points: 60 },
  { name: "Gema Mágica", emoji: "✨", points: 55 },
  { name: "Moneda Antigua", emoji: "🪙", points: 45 },
  { name: "Cristal Especial", emoji: "🔮", points: 70 }
];

export function LaberintoLector({ onBack, level }: LaberintoLectorProps) {
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
  const [showQuestionReward, setShowQuestionReward] = useState(false);
  const [questionPoints, setQuestionPoints] = useState(0);
  const [currentMazeLevel, setCurrentMazeLevel] = useState(1);

  useEffect(() => {
    initializeMaze();
  }, [currentMazeLevel]);

  const initializeMaze = () => {
    const config = mazeConfigs[currentMazeLevel as keyof typeof mazeConfigs];
    const newMaze: MazeCell[][] = config.data.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const cellData: MazeCell = {
          type: cell as any,
          visited: false
        };

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

    // Count treasures
    let treasureCount = 0;
    newMaze.forEach(row => {
      row.forEach(cell => {
        if (cell.type === 'treasure') treasureCount++;
      });
    });

    setMaze(newMaze);
    setTotalTreasures(treasureCount);
    setPlayerPosition({ row: 1, col: 1 });
  };

  const canMoveTo = (newRow: number, newCol: number): boolean => {
    if (newRow < 0 || newRow >= maze.length || newCol < 0 || newCol >= maze[0].length) {
      return false;
    }

    const cell = maze[newRow][newCol];
    return cell.type !== 'wall';
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (showQuestion) return;

    const { row, col } = playerPosition;
    let newRow = row;
    let newCol = col;

    switch (direction) {
      case 'up':
        newRow = row - 1;
        break;
      case 'down':
        newRow = row + 1;
        break;
      case 'left':
        newCol = col - 1;
        break;
      case 'right':
        newCol = col + 1;
        break;
    }

    if (canMoveTo(newRow, newCol)) {
      setPlayerPosition({ row: newRow, col: newCol });
      
      const cell = maze[newRow][newCol];
      const wasVisited = cell.visited;
      
      // Handle different cell types BEFORE marking as visited
      if (cell.type === 'question' && !wasVisited) {
        setCurrentQuestion(cell.question);
        setShowQuestion(true);
        setQuestionAnswered(false);
      } else if (cell.type === 'treasure' && !wasVisited) {
        const treasureInfo = cell.treasureInfo || treasureTypes[0];
        const treasurePoints = cell.reward || treasureInfo.points;
        
        setScore(prevScore => prevScore + treasurePoints);
        setTreasuresFound(prevCount => prevCount + 1);
        setCurrentTreasure(treasureInfo);
        setShowTreasureModal(true);
        setShowReward(true);
        
        // Auto-cerrar el modal del tesoro después de 3 segundos
        setTimeout(() => {
          setShowTreasureModal(false);
          setShowReward(false);
        }, 3000);
        
        // Simular vibración de tesoro
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate([100, 50, 100, 50, 200]);
        }
      } else if (cell.type === 'finish') {
        setGameComplete(true);
        
        // Simular vibración de victoria
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate([200, 100, 200, 100, 200]);
        }
      }

      // Mark cell as visited AFTER handling the cell type
      const newMaze = [...maze];
      newMaze[newRow][newCol].visited = true;
      setMaze(newMaze);
    }
  };

  const handleQuestionAnswer = (answerIndex: number) => {
    if (!currentQuestion || questionAnswered) return;

    setQuestionAnswered(true);
    
    if (answerIndex === currentQuestion.correct) {
      const points = currentQuestion.points || 30;
      setScore(prevScore => prevScore + points);
      setQuestionPoints(points);
      setShowQuestionReward(true);
      setShowReward(true);
      
      // Auto-cerrar la notificación de puntos después de 2.5 segundos
      setTimeout(() => {
        setShowQuestionReward(false);
        setShowReward(false);
      }, 2500);
      
      // Simular vibración de respuesta correcta
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }
    } else {
      // Vibración suave para respuesta incorrecta
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate([100]);
      }
    }

    setTimeout(() => {
      setShowQuestion(false);
      setCurrentQuestion(null);
      setQuestionAnswered(false);
    }, 3000);
  };

  const restartGame = () => {
    setScore(0);
    setGameComplete(false);
    setShowQuestion(false);
    setCurrentQuestion(null);
    setQuestionAnswered(false);
    setShowReward(false);
    setTreasuresFound(0);
    setCurrentTreasure(null);
    setShowTreasureModal(false);
    setShowQuestionReward(false);
    setQuestionPoints(0);
    setCurrentMazeLevel(1);
    initializeMaze();
  };

  const nextLevel = () => {
    if (currentMazeLevel < 3) {
      setCurrentMazeLevel(currentMazeLevel + 1);
      setScore(0);
      setGameComplete(false);
      setShowQuestion(false);
      setCurrentQuestion(null);
      setQuestionAnswered(false);
      setShowReward(false);
      setTreasuresFound(0);
      setCurrentTreasure(null);
      setShowTreasureModal(false);
      setShowQuestionReward(false);
      setQuestionPoints(0);
      // initializeMaze se llamará automáticamente por el useEffect
    }
  };

  if (gameComplete) {
    const completionBonus = treasuresFound === totalTreasures ? 100 : 0;
    const finalScore = score + completionBonus;

    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-emerald-100 via-teal-100 to-blue-100">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-4 bg-white/80 backdrop-blur-sm border-2 hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al dashboard
        </Button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-emerald-200">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🎯</div>
              
              <h2 className="text-3xl mb-4 text-gray-800">
                ¡{mazeConfigs[currentMazeLevel as keyof typeof mazeConfigs].name} Completado!
              </h2>
              
              <div className="bg-purple-50 p-3 rounded-lg mb-6 border-2 border-purple-300">
                <div className="text-purple-800 dyslexia-friendly">
                  🏆 Nivel {currentMazeLevel} superado con éxito
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="text-2xl text-emerald-600 mb-1">{finalScore}</div>
                  <div className="text-sm text-emerald-700">Puntuación Final</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl text-yellow-600 mb-1">{treasuresFound}/{totalTreasures}</div>
                  <div className="text-sm text-yellow-700">Tesoros Encontrados</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl text-blue-600 mb-1">🧠</div>
                  <div className="text-sm text-blue-700">Sabiduría Ganada</div>
                </div>
              </div>

              {completionBonus > 0 && (
                <div className="bg-gold-50 p-3 rounded-lg mb-6 border-2 border-yellow-300">
                  <div className="text-yellow-800">¡Bonus por encontrar todos los tesoros: +100 puntos!</div>
                </div>
              )}
              
              <div className="flex justify-center gap-4 flex-wrap">
                {currentMazeLevel < 3 ? (
                  <Button
                    onClick={nextLevel}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3"
                  >
                    🚀 Siguiente Nivel
                  </Button>
                ) : (
                  <div className="bg-gold-50 p-3 rounded-lg mb-4 border-2 border-yellow-300">
                    <div className="text-yellow-800 dyslexia-friendly">
                      🏆 ¡Has completado todos los niveles del Laberinto Lector!
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={restartGame}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3"
                >
                  🔄 Reiniciar Nivel 1
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Volver al dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-emerald-100 via-teal-100 to-blue-100">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl text-gray-800 dyslexia-friendly">
              🌀 {mazeConfigs[currentMazeLevel as keyof typeof mazeConfigs].name}
            </h1>
            <div className="bg-purple-100 px-3 py-1 rounded-full mb-2">
              <span className="text-purple-700 dyslexia-friendly">Nivel {currentMazeLevel}/3</span>
            </div>
            <div className="flex items-center gap-4 justify-center mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">Puntos: {score}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-gray-600">Tesoros: {treasuresFound}/{totalTreasures}</span>
              </div>
            </div>
          </div>
          
          <div className="w-32"></div>
        </div>

        {/* Animal Guide */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <AnimalGuide
            animal="turtle"
            message={
              currentMazeLevel === 1 
                ? "¡Bienvenido al Laberinto del Aprendiz! Encuentra tesoros, responde preguntas y llega a la meta. Usa las flechas para moverte."
                : currentMazeLevel === 2
                ? "¡Ahora en el Laberinto del Explorador! Más tesoros y preguntas te esperan. ¡Tu sabiduría está creciendo!"
                : "¡Has llegado al Laberinto del Maestro! Este es el desafío final. ¡Demuestra todo lo que has aprendido!"
            }
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-teal-200 mb-4">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-teal-500" />
                  Controles
                </h3>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div></div>
                  <Button
                    onClick={() => movePlayer('up')}
                    variant="outline"
                    className="h-12 bg-white/80"
                    disabled={showQuestion}
                  >
                    ↑
                  </Button>
                  <div></div>
                  
                  <Button
                    onClick={() => movePlayer('left')}
                    variant="outline"
                    className="h-12 bg-white/80"
                    disabled={showQuestion}
                  >
                    ←
                  </Button>
                  <div className="h-12 bg-gray-100 rounded border-2 border-gray-200 flex items-center justify-center text-2xl">
                    🧭
                  </div>
                  <Button
                    onClick={() => movePlayer('right')}
                    variant="outline"
                    className="h-12 bg-white/80"
                    disabled={showQuestion}
                  >
                    →
                  </Button>
                  
                  <div></div>
                  <Button
                    onClick={() => movePlayer('down')}
                    variant="outline"
                    className="h-12 bg-white/80"
                    disabled={showQuestion}
                  >
                    ↓
                  </Button>
                  <div></div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded"></div>
                    <span>Camino</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <span>Pregunta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span>Tesoro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-400 rounded"></div>
                    <span>Meta</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Maze */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Flag className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg text-gray-800">Laberinto</h3>
                </div>
                
                <div 
                  className={`grid gap-1 mx-auto`}
                  style={{
                    gridTemplateColumns: `repeat(${maze[0]?.length || 8}, minmax(0, 1fr))`,
                    maxWidth: maze[0]?.length > 8 ? '600px' : '400px'
                  }}
                >
                  {maze.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const isPlayer = playerPosition.row === rowIndex && playerPosition.col === colIndex;
                      
                      let cellClass = `${maze[0]?.length > 8 ? 'w-6 h-6' : 'w-8 h-8'} flex items-center justify-center text-xs transition-all duration-200 border rounded`;
                      let content = "";
                      
                      switch (cell.type) {
                        case 'wall':
                          cellClass += " bg-gray-800 border-gray-700";
                          break;
                        case 'path':
                        case 'start':
                          cellClass += cell.visited ? " bg-green-200 border-green-300" : " bg-green-100 border-green-200";
                          break;
                        case 'question':
                          cellClass += cell.visited ? " bg-blue-200 border-blue-300" : " bg-blue-100 border-blue-200";
                          content = "?";
                          break;
                        case 'treasure':
                          cellClass += cell.visited ? " bg-yellow-200 border-yellow-300" : " bg-yellow-100 border-yellow-200";
                          content = cell.visited ? "✓" : (cell.treasureInfo?.emoji || "💎");
                          break;
                        case 'finish':
                          cellClass += " bg-red-100 border-red-200";
                          content = "🏁";
                          break;
                      }

                      return (
                        <motion.div
                          key={`${rowIndex}-${colIndex}`}
                          className={cellClass}
                          animate={isPlayer ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
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

        {/* Question Modal */}
        {showQuestion && currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="max-w-lg w-full"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-4 border-blue-400 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Book className="w-6 h-6 text-blue-500" />
                      </motion.div>
                      <h3 className="text-xl text-blue-800 dyslexia-friendly">🤔 Pregunta del Laberinto</h3>
                    </div>
                    
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full"
                    >
                      <span className="text-sm dyslexia-friendly">+{currentQuestion.points || 30} pts</span>
                    </motion.div>
                  </div>
                  
                  <div className="mb-4">
                    <AudioPlayer
                      text="Reproduciendo pregunta..."
                      duration={2000}
                      className="mb-4"
                    />
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6 p-4 bg-white/80 rounded-lg border-2 border-blue-200"
                  >
                    <p className="text-gray-800 text-lg dyslexia-friendly">
                      {currentQuestion.text}
                    </p>
                  </motion.div>
                  
                  <div className="space-y-3">
                    {currentQuestion.options.map((option: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          onClick={() => handleQuestionAnswer(index)}
                          disabled={questionAnswered}
                          variant={
                            questionAnswered
                              ? index === currentQuestion.correct
                                ? "default"
                                : "outline"
                              : "outline"
                          }
                          className={`w-full justify-start p-4 text-left dyslexia-friendly ${
                            questionAnswered
                              ? index === currentQuestion.correct
                                ? "bg-green-500 hover:bg-green-600 text-white border-green-400"
                                : "opacity-50 bg-gray-100"
                              : "bg-white/90 hover:bg-white border-blue-300 hover:border-blue-400 text-gray-800"
                          }`}
                        >
                          <span className="mr-3 font-bold">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  
                  {questionAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 p-4 bg-blue-100 rounded-lg border-2 border-blue-300"
                    >
                      <div className="flex items-start gap-2">
                        <div className="text-2xl">💡</div>
                        <div>
                          <div className="text-blue-800 font-semibold mb-1">Explicación:</div>
                          <p className="text-blue-700 dyslexia-friendly">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Reward Animation */}
        {showReward && (
          <RewardAnimation
            type="star"
            show={showReward}
            message={treasuresFound > 0 ? "¡Tesoro encontrado!" : "¡Excelente!"}
            onComplete={() => setShowReward(false)}
          />
        )}

        {/* Treasure Found Modal */}
        {showTreasureModal && currentTreasure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="max-w-sm w-full"
            >
              <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-400 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1, 1.1, 1],
                      rotate: [0, 10, -10, 5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="text-6xl mb-4"
                  >
                    {currentTreasure.emoji}
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl mb-2 text-yellow-800 dyslexia-friendly"
                  >
                    ¡Tesoro Encontrado!
                  </motion.h3>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-3"
                  >
                    <div className="text-xl text-yellow-700 mb-1 dyslexia-friendly">
                      {currentTreasure.name}
                    </div>
                    <div className="text-lg text-yellow-600">
                      +{currentTreasure.points} puntos
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-center"
                  >
                    <Button
                      onClick={() => setShowTreasureModal(false)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2"
                    >
                      ¡Continuar!
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Question Reward Modal */}
        {showQuestionReward && questionPoints > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="max-w-sm w-full"
            >
              <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-400 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1, 1.1, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: 1.5,
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" }
                    }}
                    className="text-6xl mb-4"
                  >
                    🧠
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl mb-2 text-green-800 dyslexia-friendly"
                  >
                    ¡Respuesta Correcta!
                  </motion.h3>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-3"
                  >
                    <div className="text-xl text-green-700 mb-1 dyslexia-friendly">
                      ¡Muy bien pensado!
                    </div>
                    <div className="text-lg text-green-600">
                      +{questionPoints} puntos de conocimiento
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-center"
                  >
                    <Button
                      onClick={() => setShowQuestionReward(false)}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
                    >
                      ¡Continuar!
                    </Button>
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