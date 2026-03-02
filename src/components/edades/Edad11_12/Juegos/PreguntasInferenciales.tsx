import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Star, Brain, Lightbulb } from 'lucide-react';
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
import { StartScreenPreguntasInferenciales } from '../IniciosJuegosLecturas/StartScreenPreguntasInferenciales';import { useProgress } from "@/hooks/useProgress";
import { getActivityByDbId } from "@/config/activities";
interface PreguntasInferencialesProps {
  onBack: () => void;
  level?: number;
}

interface InferenceChallenge {
  id: number;
  type: 'emotion' | 'cause' | 'prediction' | 'character' | 'theme';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  hint: string;
  difficulty: number;
}

interface Level {
  text: string;
  challenges: InferenceChallenge[];
}

const allLevels: Level[] = [
  // Nivel 1
  {
    text: "María cerró la puerta de su habitación suavemente. Se sentó en su cama y miró por la ventana hacia el jardín donde solía jugar con su perro Toby. Suspiró profundamente mientras acariciaba la correa que aún estaba sobre su escritorio. Luego, tomó un cuaderno y comenzó a escribir algo con lágrimas en los ojos.",
    challenges: [
      {
        id: 1,
        type: 'emotion',
        question: "¿Cómo se siente María y por qué?",
        options: [
          "Está feliz porque va a pasear a Toby",
          "Está triste porque Toby ya no está con ella",
          "Está enojada porque Toby se portó mal",
          "Está aburrida porque no tiene nada que hacer"
        ],
        correct: 1,
        explanation: "Las pistas son que cerró la puerta suavemente, suspiró profundamente, y tiene lágrimas en los ojos, lo que sugiere tristeza. La correa sin usar implica que Toby ya no está.",
        hint: "Observa las acciones sutiles: cerrar suavemente, suspirar, y qué significa la correa sin usar.",
        difficulty: 2,

      },
      {
        id: 2,
        type: 'cause',
        question: "¿Por qué María está escribiendo en su cuaderno con lágrimas en los ojos?",
        options: [
          "Está escribiendo una carta de despedida a Toby",
          "Está haciendo tarea y está frustrada",
          "Está escribiendo una lista de tareas diarias",
          "Está escribiendo una historia feliz sobre Toby"
        ],
        correct: 0,
        explanation: "Las lágrimas y el contexto de tristeza (suspirar, correa sin usar) sugieren que María está escribiendo algo emocional, probablemente una despedida a Toby, quien ya no está.",
        hint: "Piensa en por qué alguien escribiría con lágrimas, considerando el contexto del texto.",
        difficulty: 2,

      },
      {
        id: 3,
        type: 'prediction',
        question: "¿Qué es lo más probable que María haga después de escribir en su cuaderno?",
        options: [
          "Saldrá a pasear con otro perro",
          "Guardará el cuaderno y seguirá llorando",
          "Irá al jardín a jugar",
          "Llamará a un amigo para contarle sobre Toby"
        ],
        correct: 1,
        explanation: "Dado su estado emocional (tristeza, lágrimas), es probable que María continúe procesando su pérdida, posiblemente guardando el cuaderno y siguiendo con su tristeza.",
        hint: "Considera el estado emocional de María y qué acción encaja con ese sentimiento.",
        difficulty: 3,

      },
      {
        id: 4,
        type: 'theme',
        question: "¿Cuál es el tema principal que se puede inferir de la situación de María?",
        options: [
          "La importancia de tener una rutina diaria",
          "El dolor de perder a una mascota querida",
          "La alegría de los recuerdos con animales",
          "La necesidad de mantener el cuarto ordenado"
        ],
        correct: 1,
        explanation: "El texto se centra en las acciones y emociones de María, que reflejan tristeza por la pérdida de Toby, lo que apunta al tema del duelo por una mascota.",
        hint: "Piensa en la emoción principal que transmite el texto y cómo se relaciona con las acciones de María.",
        difficulty: 3,

      }
    ]
  },
  // Nivel 2
  {
    text: "Ana había estado estudiando durante semanas para la competencia de ciencias. Esa mañana repasó sus notas una vez más, respiró profundamente y se dirigió hacia el auditorio. Al llegar, vio a los otros concursantes: algunos parecían muy nerviosos, moviendo las manos inquietos, mientras que otros se veían confiados, charlando tranquilamente. Ana se sentó en una esquina, revisando su proyecto con una mezcla de ansiedad y determinación.",
    challenges: [
      {
        id: 5,
        type: 'emotion',
        question: "¿Cómo se siente Ana antes de la competencia?",
        options: [
          "Está aburrida porque ya sabe todo",
          "Está nerviosa pero decidida a hacerlo bien",
          "Está confiada porque está mejor preparada que todos",
          "Está enojada porque los otros concursantes son ruidosos"
        ],
        correct: 1,
        explanation: "El texto menciona que Ana respira profundamente y siente una mezcla de ansiedad y determinación, lo que indica nerviosismo combinado con resolución.",
        hint: "Fíjate en las palabras que describen cómo actúa Ana y lo que siente al llegar al auditorio.",
        difficulty: 2,

      },
      {
        id: 6,
        type: 'prediction',
        question: "¿Qué es lo más probable que suceda durante la competencia?",
        options: [
          "Ana ganará porque estudió más que todos",
          "La competencia será muy reñida entre varios participantes preparados",
          "Los estudiantes nerviosos abandonarán la competencia",
          "Solo participarán los estudiantes más confiados"
        ],
        correct: 1,
        explanation: "El texto muestra que Ana se preparó bien, pero también que hay otros participantes confiados, sugiriendo que varios están preparados, lo que hará la competencia reñida.",
        hint: "Considera que el texto menciona diferentes niveles de preparación y confianza entre los concursantes.",
        difficulty: 2,

      },
      {
        id: 7,
        type: 'character',
        question: "¿Qué puedes inferir sobre la personalidad de Ana?",
        options: [
          "Es insegura y no confía en su preparación",
          "Es dedicada y perseverante en sus objetivos",
          "Es arrogante y cree que es mejor que los demás",
          "Es indiferente y no le importa la competencia"
        ],
        correct: 1,
        explanation: "Ana estudió durante semanas y revisa su proyecto con determinación, lo que muestra que es dedicada y perseverante.",
        hint: "Piensa en cómo Ana se prepara y actúa antes de la competencia.",
        difficulty: 2,

      },
      {
        id: 8,
        type: 'cause',
        question: "¿Por qué Ana se sienta en una esquina revisando su proyecto?",
        options: [
          "Quiere evitar a los otros concursantes",
          "Está buscando un lugar tranquilo para concentrarse",
          "No tiene confianza en su proyecto",
          "Quiere presumir su trabajo a los demás"
        ],
        correct: 1,
        explanation: "El texto indica que Ana está ansiosa pero determinada, y sentarse en una esquina revisando su proyecto sugiere que busca concentrarse antes de la competencia.",
        hint: "Considera el estado emocional de Ana y qué la motiva a actuar así.",
        difficulty: 3,

      }
    ]
  },
  // Nivel 3
  {
    text: "En el pequeño pueblo, cada familia donaba lo que podía para ayudar a los vecinos necesitados. La familia García compartía verduras de su huerto, los López ofrecían reparaciones gratuitas, y la señora Martínez enseñaba a leer a quien lo necesitara. Cuando llegó la época de las lluvias y algunas casas se inundaron, todo el pueblo trabajó junto para reconstruir, compartiendo herramientas, comida y palabras de aliento.",
    challenges: [
      {
        id: 9,
        type: 'theme',
        question: "¿Cuál es el tema principal que se puede inferir de esta historia?",
        options: [
          "La importancia de tener habilidades útiles",
          "El valor de la solidaridad y comunidad",
          "Los problemas que causan las lluvias",
          "La necesidad de tener buenos vecinos"
        ],
        correct: 1,
        explanation: "El texto describe múltiples ejemplos de personas ayudándose mutuamente, culminando en una respuesta colectiva a la crisis, destacando la solidaridad comunitaria.",
        hint: "Observa el patrón de comportamiento que se repite en toda la historia.",
        difficulty: 3,

      },
      {
        id: 10,
        type: 'character',
        question: "¿Qué puedes inferir sobre la personalidad de la señora Martínez?",
        options: [
          "Es egoísta y solo ayuda por reconocimiento",
          "Es generosa y comprometida con ayudar a otros",
          "Es indiferente a las necesidades del pueblo",
          "Solo ayuda a sus amigos cercanos"
        ],
        correct: 1,
        explanation: "La señora Martínez enseña a leer a quien lo necesite, lo que indica que es generosa y está comprometida con el bienestar de la comunidad.",
        hint: "Piensa en qué revela el acto de enseñar a leer a cualquiera que lo necesite.",
        difficulty: 2,

      },
      {
        id: 11,
        type: 'cause',
        question: "¿Por qué el pueblo trabajó junto para reconstruir después de las lluvias?",
        options: [
          "Porque querían terminar rápido para descansar",
          "Porque ya tenían un hábito de ayudarse mutuamente",
          "Porque las autoridades del pueblo lo ordenaron",
          "Porque solo algunas familias necesitaban ayuda"
        ],
        correct: 1,
        explanation: "El texto muestra que el pueblo ya tenía una cultura de ayuda mutua (donaciones, reparaciones, enseñanza), lo que llevó a una respuesta colectiva ante la crisis.",
        hint: "Fíjate en cómo el pueblo actuaba antes de las lluvias.",
        difficulty: 3,

      },
      {
        id: 12,
        type: 'prediction',
        question: "¿Qué es lo más probable que ocurra si otra crisis afecta al pueblo?",
        options: [
          "Cada familia trabajará por su cuenta",
          "El pueblo se unirá nuevamente para ayudarse",
          "Nadie ayudará porque estarán cansados",
          "Solo los más ricos ayudarán a los demás"
        ],
        correct: 1,
        explanation: "Dado el historial de solidaridad del pueblo, es probable que se unan nuevamente para enfrentar otra crisis, como lo hicieron con las inundaciones.",
        hint: "Considera cómo el pueblo ha respondido a desafíos previos según el texto.",
        difficulty: 3,

      }
    ]
  }
];

const MAX_LEVEL = 3;

export function PreguntasInferenciales({ onBack, level: initialLevel = 1 }: PreguntasInferencialesProps) {
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { saveProgress } = useProgress();

  const activityConfig = getActivityByDbId(18); // Preguntas Inferenciales

  const guardarInicioNivel = () => {
    if (activityConfig) {
      saveProgress({
        activityId: activityConfig.dbId,
        activityName: activityConfig.name,
        activityType: activityConfig.type,
        ageGroup: '11-12',
        level: currentLevel,
        score: 0,
        maxScore: 100,
        completed: false,
        timeSpent: 0
      });
    }
  };

  useEffect(() => {
    // Registrar CADA vez que se inicia el juego, sin importar si ya jugó antes
    guardarInicioNivel();
  }, [currentLevel]); // Se ejecuta cada vez que cambia el nivel o al montar el componente

  const currentLevelData = allLevels[currentLevel - 1] || allLevels[0];
  const challenges = currentLevelData.challenges;
  const challenge = challenges[currentChallenge];

  const progress = ((currentChallenge + 1) / challenges.length) * 100;


  // Reset al cambiar nivel
  useEffect(() => {
    setCurrentLevel(initialLevel);
    setCurrentChallenge(0);
    setScore(0);
    setStreak(0);
    setShowMotivational(false);
    setShowLevelComplete(false);

  }, [initialLevel]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult && selectedAnswer === null && !isSpeaking) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 100);
      return () => clearTimeout(timer);
    }
    else if (timeLeft === 0 && gameStarted && !showResult && selectedAnswer === null && !isSpeaking) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted, showResult, selectedAnswer, isSpeaking]);


  useEffect(() => {
    if (gameStarted && challenge) {
      setTimeLeft(45); // ✅ tiempo base
      setSelectedAnswer(null);
      setShowResult(false);
      setShowHint(false);
    }
  }, [currentChallenge, currentLevel, gameStarted, challenge]);


  const startGame = () => {
    setGameStarted(true);

  };

  const handleTimeUp = () => {
    if (selectedAnswer === null && !showResult) {
      setSelectedAnswer(-1);
      setStreak(0);
      setShowResult(true);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === challenge.correct) {
      let basePoints = challenge.difficulty * 10; // antes 15
      const timeBonus = Math.floor(timeLeft / 10) * 2;
      const streakBonus = Math.min(streak * 3, 15);
      const hintPenalty = showHint ? -5 : 0;

      const totalPoints = Math.max(
        basePoints + timeBonus + streakBonus + hintPenalty,
        5
      );

      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      setShowReward(true);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setShowReward(false);
    }, 3000);
  };


  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
    } else {
      setShowMotivational(true);
    }
  };

  const restartLevel = () => {
    setCurrentChallenge(0);
    setScore(0);
    setStreak(0);
    setShowMotivational(false);
    setShowLevelComplete(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
    setTimeLeft(45);
    setGameStarted(true);
  };

  const loadNextLevel = () => {
    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel(currentLevel + 1);
      setCurrentChallenge(0);
      setScore(0);
      setStreak(0);
      setShowMotivational(false);
      setShowLevelComplete(false);
      setGameStarted(true);
    } else {
      setShowLevelComplete(false);
      setGameStarted(false);
    }
  };

  const toggleHint = () => setShowHint(!showHint);

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
      case 'emotion': return 'Emoción';
      case 'cause': return 'Causa';
      case 'prediction': return 'Predicción';
      case 'character': return 'Personaje';
      case 'theme': return 'Tema';
      default: return 'Cerebro';
    }
  };


  if (!gameStarted) {
    return <StartScreenPreguntasInferenciales onStart={startGame} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="max-w-6xl mx-auto">

        <GameHeader
          title={`Preguntas Inferenciales`}
          level={currentLevel}
          score={score}
          onBack={onBack}
          onRestart={restartLevel}
        />

        <ProgressBar
          current={currentChallenge + 1}
          total={challenges.length}
          progress={progress}
        />

        <AnimalGuide
          animal="monkey"
          message="¡Lee entre líneas! Busca pistas ocultas para entender lo que no se dice directamente."
        />

        <motion.div
          key={currentChallenge}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mt-6"
        >
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 mb-6">
              <CardContent className="p-8">
                <div className="mb-4">
                  <AudioPlayer text={currentLevelData.text} onSpeakingChange={setIsSpeaking} />
                </div>
                <div className="text-lg leading-relaxed text-black bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-2 border-indigo-200">
                  {currentLevelData.text}
                </div>

                <Button
                  onClick={toggleHint}
                  variant="outline"
                  className="bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200 mt-4"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Pista
                </Button>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200 mt-4"
                  >
                    <p className="text-yellow-800">{challenge.hint}</p>
                  </motion.div>
                )}

              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 mb-8 w-[800px]">

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-black">{challenge.question}</h3>

                </div>



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
                        className={`w-full justify-start text-left p-6 h-auto transition-all ${selectedAnswer === null
                          ? 'bg-white/80 hover:bg-white border-gray-200 hover:border-purple-300'
                          : selectedAnswer === index
                            ? 'bg-indigo-200 border-indigo-400 text-indigo-800'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                          }`}
                      >
                        <div className="flex items-start gap-3 text-left w-full">

                          <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-lg text-black flex-1">{option}</span>

                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={nextChallenge}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl"
                  >
                    Siguiente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >




              <Card className="bg-blue-50 border-2 border-blue-200 mt-4">
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

        <RewardAnimation
          type="star"
          show={showReward}
          message="¡Inferencia correcta!"
          onComplete={() => setShowReward(false)}
        />

        {/* MENSAJE MOTIVACIONAL */}
        {showMotivational && (
          <MotivationalMessage
            score={score}
            total={challenges.reduce((sum, c) => sum + c.difficulty * 15, 0)}
            customMessage="¡Has completado el nivel!"
            customSubtitle="Resolviste todas las preguntas inferenciales"
            celebrationText="¡Eres lo mejor!"
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
            total={challenges.reduce((sum, c) => sum + c.difficulty * 15, 0)}
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