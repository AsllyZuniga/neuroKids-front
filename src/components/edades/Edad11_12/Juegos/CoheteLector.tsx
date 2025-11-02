import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Target, Clock } from 'lucide-react';
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
import { StartScreenCoheteLector } from '../IniciosJuegosLecturas/StartScreenCoheteLector/StartScreenCoheteLector';


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
  timeLimit: number;
}

const allChallenges: Challenge[] = [
  {
    id: 1,
    type: 'comprehension',
    text: "El cambio climático es uno de los mayores desafíos de nuestro tiempo. Los científicos han observado que la temperatura promedio de la Tierra ha aumentado significativamente en las últimas décadas, principalmente debido a las actividades humanas como la quema de combustibles fósiles.",
    question: "Según el texto, ¿cuál es la principal causa del cambio climático?",
    options: [
      "Los cambios naturales del planeta",
      "Las actividades humanas como la quema de combustibles fósiles",
      "Los volcanes y terremotos",
      "La radiación solar"
    ],
    correct: 1,
    explanation: "El texto claramente indica que el aumento de temperatura es 'principalmente debido a las actividades humanas como la quema de combustibles fósiles'.",
    points: 100,
    timeLimit: 30
  },
  {
    id: 2,
    type: 'vocabulary',
    question: "¿Qué significa la palabra 'perspicaz'?",
    options: [
      "Que ve con dificultad",
      "Que tiene gran capacidad para entender",
      "Que es muy alto",
      "Que habla mucho"
    ],
    correct: 1,
    explanation: "'Perspicaz' significa que tiene gran agudeza mental, que comprende y entiende las cosas con facilidad.",
    points: 80,
    timeLimit: 20
  },
  {
    id: 3,
    type: 'grammar',
    question: "En la oración 'Los estudiantes estudian diligentemente', ¿qué función cumple la palabra 'diligentemente'?",
    options: [
      "Sustantivo",
      "Adjetivo",
      "Adverbio",
      "Verbo"
    ],
    correct: 2,
    explanation: "'Diligentemente' es un adverbio que modifica al verbo 'estudian', indicando la manera en que realizan la acción.",
    points: 90,
    timeLimit: 25
  },
  {
    id: 4,
    type: 'comprehension',
    text: "La biodiversidad se refiere a la variedad de vida en la Tierra, incluyendo la diversidad de especies, ecosistemas y genes. Es fundamental para el equilibrio de los ecosistemas y proporciona servicios esenciales como la polinización, la purificación del agua y la regulación del clima.",
    question: "¿Por qué es importante la biodiversidad según el texto?",
    options: [
      "Solo para tener más animales",
      "Para el equilibrio de ecosistemas y servicios esenciales",
      "Para hacer parques más bonitos",
      "No es importante"
    ],
    correct: 1,
    explanation: "El texto explica que la biodiversidad es fundamental para el equilibrio de los ecosistemas y proporciona servicios esenciales.",
    points: 100,
    timeLimit: 35
  },
  {
    id: 5,
    type: 'vocabulary',
    question: "¿Cuál es el sinónimo más apropiado para 'elocuente'?",
    options: [
      "Silencioso",
      "Expresivo y convincente al hablar",
      "Muy rápido",
      "Confuso"
    ],
    correct: 1,
    explanation: "'Elocuente' se refiere a alguien que habla de manera expresiva, clara y convincente.",
    points: 85,
    timeLimit: 20
  },
  {
    id: 6,
    type: 'grammar',
    question: "Identifica el sujeto en la oración: 'Durante la tormenta, los árboles del parque se movían violentamente'",
    options: [
      "Durante la tormenta",
      "los árboles del parque",
      "se movían",
      "violentamente"
    ],
    correct: 1,
    explanation: "El sujeto es 'los árboles del parque', ya que es quien realiza la acción de moverse.",
    points: 95,
    timeLimit: 30
  },
  {
    id: 7,
    type: 'comprehension',
    text: "La energía renovable, como la solar y la eólica, se está utilizando cada vez más para reducir la dependencia de los combustibles fósiles. Estas fuentes de energía son sostenibles porque no se agotan y generan menos contaminación.",
    question: "¿Qué ventaja principal de las energías renovables menciona el texto?",
    options: [
      "Son más baratas que los combustibles fósiles",
      "No se agotan y generan menos contaminación",
      "Producen más energía que las fuentes tradicionales",
      "No necesitan mantenimiento"
    ],
    correct: 1,
    explanation: "El texto destaca que las energías renovables son sostenibles porque no se agotan y generan menos contaminación.",
    points: 100,
    timeLimit: 30
  },
  {
    id: 8,
    type: 'vocabulary',
    question: "¿Qué significa la palabra 'efímero'?",
    options: [
      "Que dura poco tiempo",
      "Que es muy fuerte",
      "Que ocurre con frecuencia",
      "Que es invisible"
    ],
    correct: 0,
    explanation: "'Efímero' se refiere a algo que tiene una duración breve o pasajera.",
    points: 80,
    timeLimit: 20
  },
  {
    id: 9,
    type: 'grammar',
    question: "En la oración 'María y Juan corrieron al parque rápidamente', ¿cuál es el complemento circunstancial?",
    options: [
      "María y Juan",
      "corrieron",
      "al parque rápidamente",
      "rápidamente"
    ],
    correct: 2,
    explanation: "El complemento circunstancial indica las circunstancias de la acción (lugar y manera), en este caso 'al parque rápidamente'.",
    points: 90,
    timeLimit: 25
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
    timeLimit: 35
  },
  {
    id: 11,
    type: 'vocabulary',
    question: "¿Cuál es el antónimo más adecuado para 'meticuloso'?",
    options: [
      "Cuidadoso",
      "Descuidadoso",
      "Rápido",
      "Eficiente"
    ],
    correct: 1,
    explanation: "'Meticuloso' significa cuidadoso o detallista, por lo que su antónimo es 'descuidadoso'.",
    points: 85,
    timeLimit: 20
  },
  {
    id: 12,
    type: 'grammar',
    question: "En la oración 'El libro que leí ayer era fascinante', ¿qué tipo de oración es 'que leí ayer'?",
    options: [
      "Oración principal",
      "Oración subordinada adjetiva",
      "Oración subordinada sustantiva",
      "Oración coordinada"
    ],
    correct: 1,
    explanation: "'Que leí ayer' es una oración subordinada adjetiva porque describe al sustantivo 'libro'.",
    points: 95,
    timeLimit: 30
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
  const [timeLeft, setTimeLeft] = useState(0);
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

  // Timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted, showResult]);

  useEffect(() => {
    if (gameStarted && challenge) {
      setTimeLeft(challenge.timeLimit);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentChallenge, gameStarted, challenge]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(challenge.timeLimit);
  };

  const handleTimeUp = () => {
    setSelectedAnswer(-1);
    setStreak(0);
    setShowResult(true);
    setTimeout(nextChallenge, 3000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === challenge.correct) {
      let points = challenge.points;
      const timeBonus = Math.floor(timeLeft / 2) * 5;
      const streakBonus = streak * 10;
      const totalPoints = points + timeBonus + streakBonus;

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
    setGameStarted(false);
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
      setGameStarted(false); 
    } else {

      setLevelComplete(false);
      setShowLevelComplete(false);
      setGameStarted(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'comprehension': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'vocabulary': return 'bg-green-100 text-green-700 border-green-300';
      case 'grammar': return 'bg-purple-100 text-purple-700 border-purple-300';
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-200 via-purple-400 text-white"> 
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
          animal="turtle"
          message="¡Responde rápido para elevar el cohete!"
        />

        <div className="grid lg:grid-cols-4 gap-8 mt-6">
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-center">Progreso del Cohete</h3>
                <div className="relative h-64 bg-gradient-to-t from-blue-900 to-black rounded-lg border border-white/20 overflow-hidden">
                  <motion.div
                    animate={{ bottom: `${rocketHeight}%` }}
                    className="absolute left-1/2 transform -translate-x-1/2 text-2xl"
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

          <div className="lg:col-span-3">
            <motion.div
              key={currentChallenge}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className={`${getTypeColor(challenge.type)} border`}>
                      {getTypeLabel(challenge.type)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-yellow-400" />
                      <span>{challenge.points} puntos</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <Clock className="w-4 h-4 text-red-400" />
                      <span className={timeLeft <= 10 ? 'text-red-400' : ''}>{timeLeft}s</span>
                    </div>
                  </div>

                  {challenge.text && (
                    <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="mb-3">
                        <AudioPlayer text="Reproduciendo texto..." duration={3000} />
                      </div>
                      <p className="text-gray-200 leading-relaxed">{challenge.text}</p>
                    </div>
                  )}

                  <h3 className="text-xl mb-6">{challenge.question}</h3>

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
                          className={`w-full justify-start text-left p-6 h-auto transition-all ${
                            selectedAnswer === null
                              ? 'bg-white/10 hover:bg-white/20 border-white/30'
                              : selectedAnswer === index
                              ? index === challenge.correct
                                ? 'bg-green-500/30 border-green-400'
                                : 'bg-red-500/30 border-red-400'
                              : index === challenge.correct && showResult
                              ? 'bg-green-500/30 border-green-400'
                              : 'bg-white/5 border-white/20'
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
                      className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30"
                    >
                      <h4 className="text-lg mb-2 text-blue-200">Explicación:</h4>
                      <p className="text-blue-100">{challenge.explanation}</p>
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

