import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Search, CheckCircle, Clock, Crosshair } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';

interface DetectivePalabrasProps {
  onBack: () => void;
  level: number;
}

interface Challenge {
  id: number;
  text: string;
  task: string;
  targetWords: { word: string; type: 'sustantivo' | 'verbo' | 'adjetivo' }[];
  timeLimit: number;
}

const gameChallenges = {
  1: [ // Nivel 1: Palabras simples, solo sustantivos
    {
      id: 1,
      text: "El gato juega con la pelota en el jardín.",
      task: "Encuentra todos los SUSTANTIVOS",
      targetWords: [
        { word: "gato", type: "sustantivo" },
        { word: "pelota", type: "sustantivo" },
        { word: "jardín", type: "sustantivo" }
      ],
      timeLimit: 90
    },
    {
      id: 2,
      text: "La niña come una manzana roja.",
      task: "Encuentra todos los SUSTANTIVOS",
      targetWords: [
        { word: "niña", type: "sustantivo" },
        { word: "manzana", type: "sustantivo" }
      ],
      timeLimit: 60
    },
    {
      id: 3,
      text: "El perro corre por la casa.",
      task: "Encuentra todos los SUSTANTIVOS",
      targetWords: [
        { word: "perro", type: "sustantivo" },
        { word: "casa", type: "sustantivo" }
      ],
      timeLimit: 60
    }
  ],
  2: [ // Nivel 2: Sustantivos y verbos
    {
      id: 1,
      text: "El gato negro corre rápidamente por el jardín verde mientras persigue una mariposa.",
      task: "Encuentra SUSTANTIVOS y VERBOS",
      targetWords: [
        { word: "gato", type: "sustantivo" },
        { word: "jardín", type: "sustantivo" },
        { word: "mariposa", type: "sustantivo" },
        { word: "corre", type: "verbo" },
        { word: "persigue", type: "verbo" }
      ],
      timeLimit: 80
    },
    {
      id: 2,
      text: "María estudia en su habitación mientras escucha música.",
      task: "Encuentra SUSTANTIVOS y VERBOS",
      targetWords: [
        { word: "María", type: "sustantivo" },
        { word: "habitación", type: "sustantivo" },
        { word: "música", type: "sustantivo" },
        { word: "estudia", type: "verbo" },
        { word: "escucha", type: "verbo" }
      ],
      timeLimit: 70
    },
    {
      id: 3,
      text: "Los niños juegan en el parque durante la tarde.",
      task: "Encuentra SUSTANTIVOS y VERBOS",
      targetWords: [
        { word: "niños", type: "sustantivo" },
        { word: "parque", type: "sustantivo" },
        { word: "tarde", type: "sustantivo" },
        { word: "juegan", type: "verbo" }
      ],
      timeLimit: 75
    }
  ],
  3: [ // Nivel 3: Todos los tipos de palabras
    {
      id: 1,
      text: "El científico brillante investiga cuidadosamente los experimentos complejos en su laboratorio moderno.",
      task: "Encuentra SUSTANTIVOS, VERBOS y ADJETIVOS",
      targetWords: [
        { word: "científico", type: "sustantivo" },
        { word: "experimentos", type: "sustantivo" },
        { word: "laboratorio", type: "sustantivo" },
        { word: "investiga", type: "verbo" },
        { word: "brillante", type: "adjetivo" },
        { word: "complejos", type: "adjetivo" },
        { word: "moderno", type: "adjetivo" }
      ],
      timeLimit: 120
    },
    {
      id: 2,
      text: "La profesora inteligente explica pacientemente las lecciones difíciles a sus estudiantes atentos.",
      task: "Encuentra SUSTANTIVOS, VERBOS y ADJETIVOS",
      targetWords: [
        { word: "profesora", type: "sustantivo" },
        { word: "lecciones", type: "sustantivo" },
        { word: "estudiantes", type: "sustantivo" },
        { word: "explica", type: "verbo" },
        { word: "inteligente", type: "adjetivo" },
        { word: "difíciles", type: "adjetivo" },
        { word: "atentos", type: "adjetivo" }
      ],
      timeLimit: 110
    },
    {
      id: 3,
      text: "El libro interesante contiene historias emocionantes que cautivan a los lectores curiosos.",
      task: "Encuentra SUSTANTIVOS, VERBOS y ADJETIVOS",
      targetWords: [
        { word: "libro", type: "sustantivo" },
        { word: "historias", type: "sustantivo" },
        { word: "lectores", type: "sustantivo" },
        { word: "contiene", type: "verbo" },
        { word: "cautivan", type: "verbo" },
        { word: "interesante", type: "adjetivo" },
        { word: "emocionantes", type: "adjetivo" },
        { word: "curiosos", type: "adjetivo" }
      ],
      timeLimit: 130
    }
  ]
};

export function DetectivePalabras({ onBack, level }: DetectivePalabrasProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const challenges = gameChallenges[level as keyof typeof gameChallenges] || gameChallenges[1];
  const current = challenges[currentChallenge];

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !challengeComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !challengeComplete) {
      handleTimeUp();
    }
  }, [timeLeft, gameStarted, challengeComplete]);

  useEffect(() => {
    if (gameStarted) {
      setTimeLeft(current.timeLimit);
      setSelectedWords(new Set());
      setFoundWords(new Set());
      setChallengeComplete(false);
    }
  }, [currentChallenge, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(current.timeLimit);
  };

  const handleTimeUp = () => {
    setChallengeComplete(true);
    setTimeout(() => {
      nextChallenge();
    }, 3000);
  };

  const splitTextIntoWords = (text: string) => {
    return text.split(/\s+/).map((word, index) => ({
      word: word.replace(/[.,!?;:]/g, ''),
      originalWord: word,
      index
    }));
  };

  const textWords = useMemo(() => splitTextIntoWords(current.text), [current.text]);

  const handleWordClick = (word: string) => {
    if (challengeComplete) return;

    const targetWord = current.targetWords.find(tw => 
      tw.word.toLowerCase() === word.toLowerCase()
    );

    if (targetWord && !foundWords.has(word.toLowerCase())) {
      const newFoundWords = new Set(foundWords).add(word.toLowerCase());
      setFoundWords(newFoundWords);
      setScore(score + 10);
      setShowReward(true);

      setTimeout(() => setShowReward(false), 1000);

      if (newFoundWords.size === current.targetWords.length) {
        setChallengeComplete(true);
        const bonusPoints = Math.floor(timeLeft / 5) * 2;
        setScore(score + 10 + bonusPoints);
        
        setTimeout(() => {
          nextChallenge();
        }, 2000);
      }
    } else {
      setScore(Math.max(0, score - 2));
    }
  };

  const nextChallenge = () => {
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(currentChallenge + 1);
      setChallengeComplete(false);
    } else {
      setGameComplete(true);
    }
  };

  const restartGame = () => {
    setCurrentChallenge(0);
    setScore(0);
    setGameComplete(false);
    setGameStarted(false);
    setChallengeComplete(false);
    setSelectedWords(new Set());
    setFoundWords(new Set());
  };

  const getWordTypeColor = (type: 'sustantivo' | 'verbo' | 'adjetivo') => {
    switch (type) {
      case 'sustantivo': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'verbo': return 'bg-green-100 text-green-700 border-green-300';
      case 'adjetivo': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: {
        console.warn(`Tipo no esperado: ${type}`);
        return ''; // Fallback para evitar errores en tiempo de ejecución
      }
    }
  };

  if (gameComplete) {
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
              <div className="text-6xl mb-4">🕵️</div>
              
              <h2 className="text-3xl mb-4 text-gray-800">
                ¡Misión de Detective Completada!
              </h2>
              
              <div className="text-xl mb-6 text-gray-600">
                Puntuación final: {score} puntos
              </div>
              
              <div className="text-gray-600 mb-6">
                ¡Excelente trabajo detectando palabras! Has demostrado ser un verdadero detective del lenguaje.
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={restartGame}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3"
                >
                  Nueva misión
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
            <div className="text-6xl mb-6">🔍</div>
            <h1 className="text-3xl mb-4 text-gray-800 dyslexia-friendly">
              Detective de Palabras
            </h1>
            
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 mb-6">
              <CardContent className="p-8">
                <h2 className="text-xl mb-4 text-gray-800">Instrucciones:</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</div>
                    <p className="text-gray-700">Lee cada texto cuidadosamente</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</div>
                    <p className="text-gray-700">Encuentra las palabras del tipo solicitado (sustantivos, verbos o adjetivos)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</div>
                    <p className="text-gray-700">Haz clic en las palabras correctas antes de que se acabe el tiempo</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">4</div>
                    <p className="text-gray-700">Gana puntos por cada palabra correcta y bonificaciones por tiempo restante</p>
                  </div>
                </div>

                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                    <div className="text-blue-600 mb-1">Sustantivos</div>
                    <div className="text-sm text-blue-700">Personas, lugares, cosas</div>
                    <div className="text-xs text-blue-600">Ej: casa, perro, María</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border-2 border-green-200">
                    <div className="text-green-600 mb-1">Verbos</div>
                    <div className="text-sm text-green-700">Acciones</div>
                    <div className="text-xs text-green-600">Ej: correr, estudiar, saltar</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border-2 border-purple-200">
                    <div className="text-purple-600 mb-1">Adjetivos</div>
                    <div className="text-sm text-purple-700">Cualidades, descripciones</div>
                    <div className="text-xs text-purple-600">Ej: grande, hermoso, rápido</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={startGame}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 text-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Comenzar Investigación
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const progress = ((currentChallenge + 1) / challenges.length) * 100;

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
              🔍 Detective de Palabras
            </h1>
            <div className="bg-indigo-100 px-3 py-1 rounded-full mb-2">
              <span className="text-indigo-700 dyslexia-friendly">Nivel {level}</span>
            </div>
            <div className="flex items-center gap-4 justify-center mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">Puntos: {score}</span>
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
              Desafío {currentChallenge + 1} de {challenges.length}
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
            message="¡Sé un detective curioso! Lee el texto y encuentra las palabras del tipo que se pide. ¡Cada palabra correcta te dará puntos!"
          />
        </motion.div>

        {/* Challenge Info */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gray-800">{current.task}</h2>
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-indigo-500" />
                <span className="text-gray-600">
                  {foundWords.size} / {current.targetWords.length}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {current.targetWords.map((target, index) => (
                <Badge
                  key={index}
                  className={`${getWordTypeColor(target.type as "sustantivo" | "verbo" | "adjetivo")} ${
                    foundWords.has(target.word.toLowerCase()) 
                      ? 'opacity-50' 
                      : ''
                  }`}
                >
                  {foundWords.has(target.word.toLowerCase()) && (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  {target.type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Text Content */}
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 mb-6">
          <CardContent className="p-8">
            <div className="text-xl leading-relaxed dyslexia-friendly">
              {textWords.map(({ word, originalWord, index }) => {
                const isTarget = current.targetWords.some(tw => 
                  tw.word.toLowerCase() === word.toLowerCase()
                );
                const isFound = foundWords.has(word.toLowerCase());
                
                return (
                  <span key={index}>
                    <span
                      className={`cursor-pointer transition-all duration-200 rounded px-1 ${
                        isFound
                          ? 'bg-green-200 text-green-800'
                          : isTarget
                          ? 'hover:bg-yellow-100 hover:shadow-sm'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleWordClick(word)}
                    >
                      {originalWord}
                    </span>
                    {index < textWords.length - 1 && ' '}
                  </span>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Challenge Status */}
        {challengeComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black/20 flex items-center justify-center p-4"
          >
            <Card className="bg-white border-2 border-green-300">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">
                  {foundWords.size === current.targetWords.length ? '🎉' : '⏰'}
                </div>
                <h3 className="text-xl mb-2">
                  {foundWords.size === current.targetWords.length 
                    ? '¡Desafío completado!' 
                    : '¡Tiempo agotado!'
                  }
                </h3>
                <p className="text-gray-600">
                  Encontraste {foundWords.size} de {current.targetWords.length} palabras
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reward Animation */}
        {showReward && (
          <RewardAnimation
            type="star"
            show={showReward}
            message="¡Palabra correcta!"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </div>
  );
}