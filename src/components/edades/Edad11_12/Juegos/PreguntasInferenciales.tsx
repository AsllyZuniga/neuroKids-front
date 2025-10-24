import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Star, Brain, Lightbulb, Clock, Target, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';

interface PreguntasInferencialesProps {
  onBack: () => void;
  level: number;
}

interface InferenceChallenge {
  id: number;
  type: 'emotion' | 'cause' | 'prediction' | 'character' | 'theme';
  text: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  hint: string;
  difficulty: number;
  timeLimit: number;
}

const challenges: InferenceChallenge[] = [
  {
    id: 1,
    type: 'emotion',
    text: "María cerró la puerta de su habitación suavemente. Se sentó en su cama y miró por la ventana hacia el jardín donde solía jugar con su perro Toby. Suspiró profundamente mientras acariciaba la correa que aún estaba sobre su escritorio.",
    question: "¿Cómo se siente María y por qué?",
    options: [
      "Está feliz porque va a pasear a Toby",
      "Está triste porque Toby ya no está con ella",
      "Está enojada porque Toby se portó mal",
      "Está aburrida porque no tiene nada que hacer"
    ],
    correct: 1,
    explanation: "Las pistas son que cerró la puerta suavemente (tristeza), suspiró profundamente (melancolía), y la correa está sobre el escritorio sin usarse, sugiriendo que Toby ya no está.",
    hint: "Observa las acciones sutiles: cerrar suavemente, suspirar, y qué significa que la correa esté sin usar.",
    difficulty: 2,
    timeLimit: 45
  },
  {
    id: 2,
    type: 'cause',
    text: "El maestro encontró a todos los estudiantes de pie aplaudiendo cuando entró al aula. En el escritorio había un pastel con velitas encendidas y un cartel que decía 'Gracias por todo'. Los ojos del maestro se llenaron de lágrimas mientras sonreía.",
    question: "¿Por qué organizaron esta sorpresa los estudiantes?",
    options: [
      "Es el cumpleaños del maestro",
      "El maestro se va a retirar o cambiar de escuela",
      "Los estudiantes sacaron buenas calificaciones",
      "Es el día del maestro"
    ],
    correct: 1,
    explanation: "El cartel 'Gracias por todo' y las lágrimas del maestro sugieren una despedida. No es solo un día especial, sino algo más significativo como una jubilación o cambio.",
    hint: "El mensaje 'Gracias por todo' es muy específico. ¿Cuándo se le agradece así a alguien?",
    difficulty: 3,
    timeLimit: 50
  },
  {
    id: 3,
    type: 'prediction',
    text: "Ana había estado estudiando durante semanas para la competencia de ciencias. Esa mañana repasó sus notas una vez más, respiró profundamente y se dirigió hacia el auditorio. Al ver a los otros concursantes, notó que algunos parecían muy nerviosos, mientras que otros se veían muy confiados.",
    question: "¿Qué es lo más probable que suceda durante la competencia?",
    options: [
      "Ana ganará porque estudió más que todos",
      "La competencia será muy reñida entre varios participantes preparados",
      "Los estudiantes nerviosos abandonarán la competencia",
      "Solo participarán los estudiantes más confiados"
    ],
    correct: 1,
    explanation: "El texto muestra que Ana se preparó bien, pero también que hay otros participantes confiados. Esto sugiere que varios están preparados, haciendo la competencia más reñida.",
    hint: "Considera que el texto menciona diferentes niveles de preparación y confianza entre los participantes.",
    difficulty: 2,
    timeLimit: 40
  },
  {
    id: 4,
    type: 'character',
    text: "Durante el recreo, Luis vio que un estudiante más pequeño había tropezado y sus libros estaban esparcidos por el suelo. Mientras otros niños simplemente pasaban de largo, Luis se acercó inmediatamente, ayudó al niño a levantarse y recogió todos sus libros. Luego se aseguró de que no estuviera lastimado antes de continuar con su propio juego.",
    question: "¿Qué puedes inferir sobre la personalidad de Luis?",
    options: [
      "Es popular y quiere que todos lo vean ayudando",
      "Es empático y genuinamente se preocupa por otros",
      "Solo ayuda porque conoce al niño pequeño",
      "Ayuda porque un maestro lo está viendo"
    ],
    correct: 1,
    explanation: "Luis actúa inmediatamente sin buscar reconocimiento, se asegura del bienestar del niño, y lo hace mientras otros ignoran la situación. Esto muestra empatía genuina.",
    hint: "Observa que Luis actúa de forma diferente a los demás y sin buscar atención.",
    difficulty: 2,
    timeLimit: 35
  },
  {
    id: 5,
    type: 'theme',
    text: "En el pequeño pueblo, cada familia donaba lo que podía para ayudar a los vecinos necesitados. La familia García compartía verduras de su huerto, los López ofrecían reparaciones gratuitas, y la señora Martínez enseñaba a leer a quien lo necesitara. Cuando llegó la época de las lluvias y algunas casas se inundaron, todo el pueblo trabajó junto para ayudar a reconstruir.",
    question: "¿Cuál es el tema principal que se puede inferir de esta historia?",
    options: [
      "La importancia de tener habilidades útiles",
      "El valor de la solidaridad y comunidad",
      "Los problemas que causan las lluvias",
      "La necesidad de tener buenos vecinos"
    ],
    correct: 1,
    explanation: "El texto describe múltiples ejemplos de personas ayudándose mutuamente de diferentes maneras, culminando en una respuesta colectiva a la crisis. El tema central es la solidaridad comunitaria.",
    hint: "Observa el patrón de comportamiento que se repite en toda la historia.",
    difficulty: 3,
    timeLimit: 55
  },
  {
    id: 6,
    type: 'emotion',
    text: "Roberto había practicado su presentación docenas de veces frente al espejo. Conocía cada palabra de memoria. Sin embargo, cuando llegó su turno de presentar frente a la clase, sus manos comenzaron a temblar ligeramente y su voz se escuchaba más aguda de lo normal. A pesar de esto, siguió adelante y completó toda su presentación.",
    question: "¿Qué emociones experimenta Roberto y qué revela esto sobre él?",
    options: [
      "Solo está nervioso y no está bien preparado",
      "Está confiado porque se preparó muy bien",
      "Está nervioso pero es valiente y perseverante",
      "Está confundido porque olvidó su presentación"
    ],
    correct: 2,
    explanation: "Roberto muestra signos físicos de nerviosismo (temblor, voz aguda) a pesar de estar bien preparado, pero continúa adelante, demostrando valentía y perseverancia.",
    hint: "Considera tanto los signos físicos como las acciones de Roberto.",
    difficulty: 3,
    timeLimit: 45
  }
];

export function PreguntasInferenciales({ onBack, level }: PreguntasInferencialesProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const challenge = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / challenges.length) * 100;

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
      setShowHint(false);
    }
  }, [currentChallenge, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(challenge.timeLimit);
  };

  const handleTimeUp = () => {
    setSelectedAnswer(-1);
    setStreak(0);
    setShowResult(true);
    
    setTimeout(() => {
      nextChallenge();
    }, 4000);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === challenge.correct) {
      let points = challenge.difficulty * 15;
      const timeBonus = Math.floor(timeLeft / 5) * 2;
      const streakBonus = streak * 5;
      const hintPenalty = showHint ? -5 : 0;
      
      const totalPoints = Math.max(points + timeBonus + streakBonus + hintPenalty, 5);
      setScore(score + totalPoints);
      setStreak(streak + 1);
      setShowReward(true);
    } else {
      setStreak(0);
    }
    
    setTimeout(() => {
      setShowReward(false);
      nextChallenge();
    }, 4000);
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
    } else {
      setGameComplete(true);
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const restartGame = () => {
    setCurrentChallenge(0);
    setScore(0);
    setStreak(0);
    setGameComplete(false);
    setGameStarted(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
    setShowReward(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emotion': return 'bg-pink-100 text-pink-700 border-pink-300';
      case 'cause': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'prediction': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'character': return 'bg-green-100 text-green-700 border-green-300';
      case 'theme': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'emotion': return 'Emociones';
      case 'cause': return 'Causa y Efecto';
      case 'prediction': return 'Predicción';
      case 'character': return 'Personalidad';
      case 'theme': return 'Tema Principal';
      default: return 'Inferencia';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emotion': return '😊';
      case 'cause': return '🔗';
      case 'prediction': return '🔮';
      case 'character': return '👤';
      case 'theme': return '📚';
      default: return '🧠';
    }
  };

  if (gameComplete) {
    const accuracy = Math.round((score / challenges.reduce((sum, c) => sum + c.difficulty * 15, 0)) * 100);
    
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
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
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🧠</div>
              
              <h2 className="text-3xl mb-4 text-gray-800">
                ¡Detective de Inferencias Completado!
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="text-2xl text-indigo-600 mb-1">{score}</div>
                  <div className="text-sm text-indigo-700">Puntos Totales</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl text-purple-600 mb-1">{accuracy}%</div>
                  <div className="text-sm text-purple-700">Precisión</div>
                </div>
              </div>

              <div className="text-gray-600 mb-6">
                ¡Excelente trabajo leyendo entre líneas! Has demostrado gran habilidad para hacer inferencias y comprender los textos profundamente.
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={restartGame}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3"
                >
                  Nuevas Inferencias
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

  if (!gameStarted) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-4 bg-white/80 backdrop-blur-sm border-2 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-6">🧠</div>
            <h1 className="text-3xl mb-4 text-gray-800 dyslexia-friendly">
              Preguntas Inferenciales
            </h1>
            
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 mb-6">
              <CardContent className="p-8">
                <h2 className="text-xl mb-4 text-gray-800">¡Lee entre líneas!</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</div>
                    <p className="text-gray-700">Lee cada texto cuidadosamente y busca pistas ocultas</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</div>
                    <p className="text-gray-700">Haz inferencias sobre emociones, causas, personajes y temas</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</div>
                    <p className="text-gray-700">Usa pistas del contexto para llegar a conclusiones</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">4</div>
                    <p className="text-gray-700">Responde antes de que se agote el tiempo para bonificaciones</p>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                    <div className="text-2xl mb-1">😊</div>
                    <div className="text-pink-600 mb-1">Emociones</div>
                    <div className="text-sm text-pink-700">¿Cómo se sienten?</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="text-2xl mb-1">🔗</div>
                    <div className="text-blue-600 mb-1">Causa y Efecto</div>
                    <div className="text-sm text-blue-700">¿Por qué pasó?</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="text-2xl mb-1">👤</div>
                    <div className="text-green-600 mb-1">Personalidad</div>
                    <div className="text-sm text-green-700">¿Cómo son?</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={startGame}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 text-lg"
            >
              <Brain className="w-5 h-5 mr-2" />
              Comenzar a Inferir
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
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
              🧠 Preguntas Inferenciales
            </h1>
            <div className="flex items-center gap-4 justify-center mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">Puntos: {score}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Racha: {streak}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-red-500" />
                <span className={`${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Pregunta {currentChallenge + 1} de {challenges.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-3 bg-white/50" />
        </div>

        {/* Animal Guide */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <AnimalGuide
            animal="monkey"
            message="¡Sé un detective curioso! Lee el texto y busca pistas ocultas para entender lo que no se dice directamente. ¡Usa tu imaginación y lógica!"
          />
        </motion.div>

        {/* Challenge Content */}
        <motion.div
          key={currentChallenge}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          {/* Challenge Info */}
          <div className="flex items-center gap-3 mb-6">
            <Badge className={`${getTypeColor(challenge.type)} border text-lg px-3 py-1`}>
              <span className="mr-2">{getTypeIcon(challenge.type)}</span>
              {getTypeLabel(challenge.type)}
            </Badge>
            <div className="flex gap-1">
              {[...Array(challenge.difficulty)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Story Text */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 mb-6">
            <CardContent className="p-8">
              <div className="mb-4">
                <AudioPlayer
                  text="Reproduciendo texto..."
                  duration={4000}
                />
              </div>
              
              <div className="text-lg leading-relaxed text-gray-800 dyslexia-friendly bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-2 border-indigo-200">
                {challenge.text}
              </div>
            </CardContent>
          </Card>

          {/* Question */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-gray-800 dyslexia-friendly">
                  {challenge.question}
                </h3>
                
                <Button
                  onClick={toggleHint}
                  variant="outline"
                  className="bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Pista
                </Button>
              </div>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200"
                >
                  <p className="text-yellow-800">{challenge.hint}</p>
                </motion.div>
              )}

              <div className="grid gap-3">
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
                          ? 'bg-white/80 hover:bg-white border-gray-200 hover:border-purple-300'
                          : selectedAnswer === index
                          ? index === challenge.correct
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-red-100 border-red-400 text-red-800'
                          : index === challenge.correct && showResult
                          ? 'bg-green-100 border-green-400 text-green-800'
                          : 'bg-gray-100 border-gray-300 text-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg dyslexia-friendly flex-1">{option}</span>
                        {showResult && (
                          <span>
                            {index === challenge.correct ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : selectedAnswer === index ? (
                              <XCircle className="w-5 h-5 text-red-600" />
                            ) : null}
                          </span>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Explanation */}
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-blue-50 border-2 border-blue-200">
                <CardContent className="p-6">
                  <h4 className="text-lg mb-3 text-blue-800 flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Explicación de la Inferencia:
                  </h4>
                  <p className="text-blue-700 leading-relaxed">{challenge.explanation}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Reward Animation */}
        {showReward && (
          <RewardAnimation
            type="star"
            show={showReward}
            message="¡Inferencia correcta!"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </div>
  );
}