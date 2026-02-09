import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Target } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';
import { GameHeader } from '../../../others/GameHeader';
import { ProgressBar } from '../../../others/ProgressBar';
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { StartScreenCoheteLector } from '../IniciosJuegosLecturas/StartScreenCoheteLector';


interface CoheteLectorProps {
  onBack: () => void;
  onNextLevel?: () => void;
  level: number;
}

interface Challenge {
  id: number;
  type: 'comprehension' | 'vocabulary' | 'grammar';
  question: string;
  text?: string;
  options: string[];
  correct: number;
  explanation: string;
  points: number;

}

const allChallenges: Challenge[] = [
  {
    id: 1,
    type: 'comprehension',
    text: "Lucas encontró un perro perdido en el parque. El perro estaba cansado y tenía hambre. Lucas lo llevó a su casa y le dio agua y comida.",
    question: "¿Qué hizo Lucas con el perro?",
    options: [
      "Lo dejó solo en el parque",
      "Lo llevó a su casa y lo ayudó",
      "Lo vendió",
      "Se fue a jugar"
    ],
    correct: 1,
    explanation: "Lucas llevó al perro a su casa y le dio agua y comida.",
    points: 100,
  },
  {
    id: 2,
    type: 'vocabulary',
    question: "¿Qué significa la palabra 'cansado'?",
    options: [
      "Con mucha energía",
      "Con sueño o sin fuerzas",
      "Muy rápido",
      "Muy feliz"
    ],
    correct: 1,
    explanation: "'Cansado' es cuando una persona o animal tiene sueño o pocas fuerzas.",
    points: 80
  },
  {
    id: 3,
    type: 'comprehension',
    text: "María preparó su mochila. Guardó sus cuadernos y su merienda porque iba a la escuela.",
    question: "¿Por qué María preparó la mochila?",
    options: [
      "Para ir a dormir",
      "Para ir a la escuela",
      "Para jugar videojuegos",
      "Para ir al parque"
    ],
    correct: 1,
    explanation: "María preparó la mochila porque iba a la escuela.",
    points: 100
  },
  {
    id: 4,
    type: 'vocabulary',
    question: "¿Cuál es un sinónimo de 'feliz'?",
    options: [
      "triste",
      "contento",
      "enojado",
      "asustado"
    ],
    correct: 1,
    explanation: "'Contento' significa feliz.",
    points: 80
  },
  {
    id: 5,
    type: 'comprehension',
    text: "Carlos practicó fútbol toda la semana. El sábado jugó un partido y metió un gol.",
    question: "¿Qué pasó el sábado?",
    options: [
      "Carlos durmió",
      "Carlos metió un gol",
      "Carlos faltó",
      "Pedro perdió su balón"
    ],
    correct: 1,
    explanation: "El sábado Carlos jugó y metió un gol.",
    points: 100
  },
  {
    id: 6,
    type: 'vocabulary',
    question: "¿Qué significa 'rápido'?",
    options: [
      "Muy lento",
      "Que va deprisa",
      "Que no se mueve",
      "Que duerme"
    ],
    correct: 1,
    explanation: "'Rápido' es algo que va deprisa.",
    points: 80
  },
  {
    id: 7,
    type: 'comprehension',
    text: "Laura regó las plantas todos los días. Gracias a eso, crecieron verdes y bonitas.",
    question: "¿Por qué crecieron las plantas?",
    options: [
      "Porque nadie las tocó",
      "Porque Laura las regó",
      "Porque llovió mucho",
      "Porque eran mágicas"
    ],
    correct: 1,
    explanation: "Las plantas crecieron porque Laura las regó todos los días.",
    points: 100
  },
  {
    id: 8,
    type: "comprehension",
    text: "Luis llevó una sombrilla porque el cielo estaba oscuro y empezó a llover.",
    question: "¿Por qué Luis llevó sombrilla?",
    options: [
      "Porque hacía calor",
      "Porque iba a correr",
      "Porque empezó a llover",
      "Porque era de noche"
    ],
    correct: 2,
    explanation: "Luis llevó sombrilla porque comenzó a llover.",
    points: 100
  },
  {
    id: 9,
    type: "comprehension",
    text: "Pedro olvidó su cuaderno en casa. En clase no pudo hacer la actividad.",
    question: "¿Qué le pasó a Pedro?",
    options: [
      "Perdió el lápiz",
      "Olvidó su cuaderno",
      "Llegó tarde",
      "No quiso trabajar"
    ],
    correct: 1,
    explanation: "Pedro no pudo trabajar porque olvidó su cuaderno.",
    points: 100
  },
  {
    id: 10,
    type: 'comprehension',
    text: "Los arrecifes de coral son ecosistemas marinos muy diversos que albergan miles de especies. Sin embargo, están amenazados por el calentamiento global, la contaminación y la pesca excesiva.",
    question: "¿Cuáles son las amenazas a los arrecifes de coral mencionadas en el texto?",
    options: [
      "Terremotos y huracanes",
      "Calentamiento global, contaminación y pesca excesiva",
      "Construcción de puertos y turismo",
      "Cambio de corrientes marinas"
    ],
    correct: 1,
    explanation: "El texto menciona específicamente el calentamiento global, la contaminación y la pesca excesiva como amenazas.",
    points: 100,

  },
  {
    id: 11,
    type: "comprehension",
    text: "Sofía tenía hambre. Abrió la nevera y tomó una fruta.",
    question: "¿Qué hizo Sofía?",
    options: [
      "Salió a jugar",
      "Tomó una fruta",
      "Se fue a dormir",
      "Leyó un libro"
    ],
    correct: 1,
    explanation: "Sofía tomó una fruta porque tenía hambre.",
    points: 100
  },
  {
    id: 12,
    type: "comprehension",
    text: "Carla se puso la chaqueta porque hacía mucho frío afuera.",
    question: "¿Por qué Carla se puso la chaqueta?",
    options: [
      "Porque tenía sueño",
      "Porque hacía frío",
      "Porque iba a correr",
      "Porque estaba mojada"
    ],
    correct: 1,
    explanation: "Carla se puso la chaqueta porque hacía frío.",
    points: 100
  }
];

const CHALLENGES_PER_LEVEL = 4;
const MAX_LEVEL = 3;

function getChallengesForLevel(level: number): Challenge[] {
  const start = (level - 1) * CHALLENGES_PER_LEVEL;
  return allChallenges.slice(start, start + CHALLENGES_PER_LEVEL);
}

export function CoheteLector({ onBack, level }: CoheteLectorProps) {
  const [currentLevel, setCurrentLevel] = useState(level);
  const [currentChallenges, setCurrentChallenges] = useState(getChallengesForLevel(level));
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [rocketHeight, setRocketHeight] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const challenge = currentChallenges[currentChallenge];
  const maxHeight = 100;
  const heightPerQuestion = maxHeight / currentChallenges.length;
  const progress = (currentChallenge / currentChallenges.length) * 100;

  useEffect(() => {
    setCurrentLevel(level);
    setCurrentChallenges(getChallengesForLevel(level));
    setCurrentChallenge(0);
    setRocketHeight(0);
    setScore(0);
    setStreak(0);
    setLevelComplete(false);
    setShowMotivational(false);
    setShowLevelComplete(false);

  }, [level]);




  useEffect(() => {
    if (!gameStarted) return;

    setSelectedAnswer(null);
    setShowResult(false);
  }, [currentChallenge]);


  const startGame = () => {
    setGameStarted(true);
  };






  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === challenge.correct) {
      let points = challenge.points;

      const streakBonus = streak * 10;
      const totalPoints = points + streakBonus;

      setScore(score + totalPoints);
      setStreak(streak + 1);
      const newHeight = Math.min(rocketHeight + heightPerQuestion, maxHeight);
      setRocketHeight(newHeight);
      setShowReward(true);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setShowReward(false);
      nextChallenge();
    }, 3000);
  };

  const nextChallenge = () => {
    if (currentChallenge < currentChallenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
    } else {
      setShowMotivational(true);
    }
  };

  const restartLevel = () => {
    setCurrentChallenge(0);
    setRocketHeight(0);
    setScore(0);
    setStreak(0);
    setLevelComplete(false);
    setShowMotivational(false);
    setShowLevelComplete(false);
    setGameStarted(true);
  };

  const loadNextLevel = () => {
    setShowLevelComplete(false);
    if (currentLevel < MAX_LEVEL) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
      setCurrentChallenges(getChallengesForLevel(nextLevel));
      setCurrentChallenge(0);
      setRocketHeight(0);
      setScore(0);
      setStreak(0);
      setLevelComplete(false);
      setShowMotivational(false);
      setShowLevelComplete(false);
      setGameStarted(true);
    } else {

      setLevelComplete(false);
      setShowLevelComplete(false);
      setGameStarted(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'comprehension': return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'vocabulary': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'grammar': return 'bg-violet-100 text-violet-800 border-violet-300';

      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'comprehension': return 'Comprensión';
      case 'vocabulary': return 'Vocabulario';
      case 'grammar': return 'Gramática';
      default: return 'Pregunta';
    }
  };

  const maxPoints = currentChallenges.reduce((sum, c) => sum + c.points, 0);

  if (!gameStarted) {
    return <StartScreenCoheteLector onStart={startGame} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-200 via-sky-200 to-blue-100 text-slate-800">


      <div className="max-w-7xl mx-auto">
        <GameHeader
          title={`Cohete Lector`}
          level={currentLevel}
          score={score}
          onBack={onBack}
          onRestart={restartLevel}
        />

        <ProgressBar
          current={currentChallenge + 1}
          total={currentChallenges.length}
          progress={progress}
        />

        <AnimalGuide
          animal="owl"
          message="¡Responde rápido para elevar el cohete!"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-5">
            <Card className="bg-purple-300 border border-slate-200 shadow-sm">
              <CardContent className="p-8">
                <h3 className="text-lg mb-6 text-center">Progreso del Cohete</h3>
                <div className="relative h-96 bg-gradient-to-t from-blue-800 to-black rounded-lg border border-white/20 overflow-hidden">
                  <motion.div
                    animate={{ bottom: `${rocketHeight}%` }}
                    className="absolute left-1/2 transform -translate-x-1/2 text-5xl"
                    style={{ bottom: `${rocketHeight}%` }}
                  >
                    🚀
                  </motion.div>
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-yellow-400">
                    <div className="text-xs text-yellow-400 absolute right-0 -top-4">ESPACIO</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-sm">Altura: {Math.round(rocketHeight)}%</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              key={currentChallenge}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <Card className="bg-blue-100 backdrop-blur-sm border-2 border-blue-400">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className={`${getTypeColor(challenge.type)} border`}>
                      {getTypeLabel(challenge.type)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-amber-500" />

                      <span>{challenge.points} puntos</span>
                    </div>
                  </div>

                  {challenge.text && (
                    <div className="mb-6 p-5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="mb-3">
                        <AudioPlayer text={challenge.text || ""} />
                      </div>
                      <p className="text-slate-700 leading-relaxed tracking-wide">{challenge.text}</p>
                    </div>
                  )}

                  <h3 className="text-xl mb-6 text-slate-800">{challenge.question}</h3>


                  <div className="grid gap-4">
                    {challenge.options.map((option, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => handleAnswerSelect(index)}
                          disabled={selectedAnswer !== null}
                          variant="outline"
                          className={`w-full justify-start text-left p-6 h-auto transition-all ${selectedAnswer === null
                            ? 'bg-white hover:bg-sky-50 border-slate-300'
                            : selectedAnswer === index
                              ? index === challenge.correct
                                ? 'bg-green-200 border-green-400 text-green-800'
                                : 'bg-red-200 border-red-400 text-red-800'
                              : showResult && selectedAnswer !== null && index === challenge.correct
                                ? 'bg-green-200 border-green-400 text-green-800'
                                : 'bg-slate-100 border-slate-200'

                            }`}
                        >
                          <span>{option}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-5 bg-blue-100 rounded-lg border border-blue-300"

                    >
                      <h4 className="text-lg mb-2 text-blue-800">Explicación:</h4>
                      <p className="text-blue-700">{challenge.explanation}</p>

                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <RewardAnimation
          type="star"
          show={showReward}
          message="¡El cohete sube!"
          onComplete={() => setShowReward(false)}
        />

        {/* MENSAJE MOTIVACIONAL */}
        {showMotivational && (
          <MotivationalMessage
            score={score}
            total={currentChallenges.reduce((sum, c) => sum + c.points, 0)}
            customMessage="¡Has completado el nivel!"
            customSubtitle="Resolviste todos los desafíos del cohete"
            celebrationText="¡Increíble trabajo!"
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
            total={maxPoints}
            level={currentLevel}
            isLastLevel={currentLevel >= MAX_LEVEL}
            onNextLevel={loadNextLevel}
            onRestart={restartLevel}
            onExit={onBack}
          />
        )}
      </div>
    </div>
  );
}

