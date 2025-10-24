import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Star, Rocket, Target, Zap, Clock } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';

interface CoheteLectorProps {
  onBack: () => void;
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

const challenges: Challenge[] = [
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
  }
];

export function CoheteLector({ onBack, level }: CoheteLectorProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [rocketHeight, setRocketHeight] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const challenge = challenges[currentChallenge];
  const maxHeight = 100;
  const heightPerQuestion = maxHeight / challenges.length;

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !showResult) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted, showResult]);

  useEffect(() => {
    if (gameStarted) {
      setTimeLeft(challenge.timeLimit);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentChallenge, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(challenge.timeLimit);
  };

  const handleTimeUp = () => {
    setSelectedAnswer(-1); // Marca como tiempo agotado
    setStreak(0);
    setShowResult(true);
    
    setTimeout(() => {
      nextChallenge();
    }, 3000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === challenge.correct) {
      // Cálculo de puntos con bonificaciones
      let points = challenge.points;
      const timeBonus = Math.floor(timeLeft / 2) * 5;
      const streakBonus = streak * 10;
      const totalPoints = points + timeBonus + streakBonus;
      
      setScore(score + totalPoints);
      setStreak(streak + 1);
      
      // Subir el cohete
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
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
    } else {
      setGameComplete(true);
    }
  };

  const restartGame = () => {
    setCurrentChallenge(0);
    setRocketHeight(0);
    setScore(0);
    setStreak(0);
    setGameComplete(false);
    setGameStarted(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowReward(false);
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

  if (gameComplete) {
    const reachedSpace = rocketHeight >= maxHeight;
    const accuracy = Math.round((score / challenges.reduce((sum, c) => sum + c.points, 0)) * 100);
    
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al dashboard
        </Button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">
                {reachedSpace ? '🚀🌟' : '🚀'}
              </div>
              
              <h2 className="text-3xl mb-4 text-white">
                {reachedSpace ? '¡Has Llegado al Espacio!' : '¡Misión Completada!'}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-500/20 p-4 rounded-lg">
                  <div className="text-2xl text-blue-200 mb-1">{score}</div>
                  <div className="text-sm text-blue-300">Puntos Totales</div>
                </div>
                <div className="bg-purple-500/20 p-4 rounded-lg">
                  <div className="text-2xl text-purple-200 mb-1">{Math.round(rocketHeight)}%</div>
                  <div className="text-sm text-purple-300">Altura Alcanzada</div>
                </div>
                <div className="bg-green-500/20 p-4 rounded-lg">
                  <div className="text-2xl text-green-200 mb-1">{accuracy}%</div>
                  <div className="text-sm text-green-300">Precisión</div>
                </div>
              </div>

              {reachedSpace && (
                <div className="bg-yellow-500/20 p-4 rounded-lg mb-6 border border-yellow-400/30">
                  <div className="text-yellow-200">¡Bonus Espacial: +500 puntos por llegar al espacio!</div>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={restartGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                >
                  Nueva Misión
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="px-6 py-3 border-white/30 text-white hover:bg-white/10"
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

  if (!gameStarted) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">🚀</div>
            <h1 className="text-3xl mb-4 text-white dyslexia-friendly">
              El Cohete Lector
            </h1>
            
            <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20 mb-6">
              <CardContent className="p-8">
                <h2 className="text-xl mb-4 text-white">Misión: ¡Llegar al Espacio!</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</div>
                    <p className="text-gray-300">Responde preguntas de comprensión, vocabulario y gramática</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</div>
                    <p className="text-gray-300">Cada respuesta correcta eleva tu cohete hacia el espacio</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</div>
                    <p className="text-gray-300">Responde rápido para obtener bonificaciones de tiempo</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">4</div>
                    <p className="text-gray-300">Mantén una racha de respuestas correctas para bonificaciones extra</p>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg border border-blue-400/30">
                    <div className="text-blue-200 mb-1">Comprensión</div>
                    <div className="text-sm text-blue-300">Lee y analiza textos</div>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-lg border border-green-400/30">
                    <div className="text-green-200 mb-1">Vocabulario</div>
                    <div className="text-sm text-green-300">Significados y sinónimos</div>
                  </div>
                  <div className="bg-purple-500/20 p-3 rounded-lg border border-purple-400/30">
                    <div className="text-purple-200 mb-1">Gramática</div>
                    <div className="text-sm text-purple-300">Estructura del lenguaje</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              ¡Iniciar Despegue!
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl text-white dyslexia-friendly">
              🚀 El Cohete Lector
            </h1>
            <div className="flex items-center gap-4 justify-center mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300">Puntos: {score}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">Racha: {streak}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-red-400" />
                <span className={`${timeLeft <= 10 ? 'text-red-400' : 'text-gray-300'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-300">
              Pregunta {currentChallenge + 1} de {challenges.length}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Rocket Display */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-white text-center">Progreso del Cohete</h3>
                
                <div className="relative h-64 bg-gradient-to-t from-blue-900 to-black rounded-lg border border-white/20 overflow-hidden">
                  {/* Stars background */}
                  <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Rocket */}
                  <motion.div
                    animate={{ bottom: `${rocketHeight}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute left-1/2 transform -translate-x-1/2 text-2xl"
                    style={{ bottom: `${rocketHeight}%` }}
                  >
                    🚀
                  </motion.div>
                  
                  {/* Space line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-yellow-400">
                    <div className="text-xs text-yellow-400 absolute right-0 -top-4">ESPACIO</div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-300">Altura: {Math.round(rocketHeight)}%</div>
                  <Progress value={rocketHeight} className="h-2 mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Area */}
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
                      <span className="text-gray-300">{challenge.points} puntos</span>
                    </div>
                  </div>

                  {challenge.text && (
                    <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="mb-3">
                        <AudioPlayer
                          text="Reproduciendo texto..."
                          duration={3000}
                        />
                      </div>
                      <p className="text-gray-200 leading-relaxed dyslexia-friendly">
                        {challenge.text}
                      </p>
                    </div>
                  )}

                  <h3 className="text-xl mb-6 text-white dyslexia-friendly">
                    {challenge.question}
                  </h3>

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
                              ? 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
                              : selectedAnswer === index
                              ? index === challenge.correct
                                ? 'bg-green-500/30 border-green-400 text-green-100'
                                : 'bg-red-500/30 border-red-400 text-red-100'
                              : index === challenge.correct && showResult
                              ? 'bg-green-500/30 border-green-400 text-green-100'
                              : 'bg-white/5 border-white/20 text-gray-400'
                          }`}
                        >
                          <span className="text-lg dyslexia-friendly">{option}</span>
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

        {/* Reward Animation */}
        {showReward && (
          <RewardAnimation
            type="star"
            show={showReward}
            message="¡El cohete sube!"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </div>
  );
}