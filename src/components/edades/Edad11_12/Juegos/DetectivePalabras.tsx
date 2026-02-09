import { useState, useEffect, useMemo } from 'react';

import { CheckCircle, Crosshair } from 'lucide-react';

import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { GameHeader } from '../../../others/GameHeader';
import { ProgressBar } from '../../../others/ProgressBar';
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { StartScreenDetectivePalabras } from '../IniciosJuegosLecturas/StartScreenDetectivePalabras';

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

const gameChallenges: Record<number, Challenge[]> = {
  1: [
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
  2: [
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
  3: [
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
  ],
  4: [
    {
      id: 1,
      text: "La antigua ciudad perdida revela sus secretos ocultos a los arqueólogos intrépidos que exploran valientemente.",
      task: "Encuentra SUSTANTIVOS, VERBOS y ADJETIVOS",
      targetWords: [
        { word: "ciudad", type: "sustantivo" },
        { word: "secretos", type: "sustantivo" },
        { word: "arqueólogos", type: "sustantivo" },
        { word: "revela", type: "verbo" },
        { word: "exploran", type: "verbo" },
        { word: "antigua", type: "adjetivo" },
        { word: "perdida", type: "adjetivo" },
        { word: "ocultos", type: "adjetivo" },
        { word: "intrépidos", type: "adjetivo" }
      ],
      timeLimit: 100
    },
    {
      id: 2,
      text: "El talentoso músico compone melodías hermosas que inspiran a audiencias emocionadas en escenarios grandiosos.",
      task: "Encuentra SUSTANTIVOS, VERBOS y ADJETIVOS",
      targetWords: [
        { word: "músico", type: "sustantivo" },
        { word: "melodías", type: "sustantivo" },
        { word: "audiencias", type: "sustantivo" },
        { word: "escenarios", type: "sustantivo" },
        { word: "compone", type: "verbo" },
        { word: "inspiran", type: "verbo" },
        { word: "talentoso", type: "adjetivo" },
        { word: "hermosas", type: "adjetivo" },
        { word: "emocionadas", type: "adjetivo" },
        { word: "grandiosos", type: "adjetivo" }
      ],
      timeLimit: 110
    },
    {
      id: 3,
      text: "Las estrellas brillantes iluminan el cielo nocturno mientras los astrónomos observan fenómenos cósmicos fascinantes.",
      task: "Encuentra SUSTANTIVOS, VERBOS y ADJETIVOS",
      targetWords: [
        { word: "estrellas", type: "sustantivo" },
        { word: "cielo", type: "sustantivo" },
        { word: "astrónomos", type: "sustantivo" },
        { word: "fenómenos", type: "sustantivo" },
        { word: "iluminan", type: "verbo" },
        { word: "observan", type: "verbo" },
        { word: "brillantes", type: "adjetivo" },
        { word: "nocturno", type: "adjetivo" },
        { word: "cósmicos", type: "adjetivo" },
        { word: "fascinantes", type: "adjetivo" }
      ],
      timeLimit: 90
    }
  ],
  5: [
    {
      id: 1,
      text: "El intrincado rompecabezas desafía la mente aguda del solucionador determinado durante horas intensas y productivas.",
      task: "Encuentra SUSTANTIVOS, VERBOS y ADJETIVOS",
      targetWords: [
        { word: "rompecabezas", type: "sustantivo" },
        { word: "mente", type: "sustantivo" },
        { word: "solucionador", type: "sustantivo" },
        { word: "horas", type: "sustantivo" },
        { word: "desafía", type: "verbo" },
        { word: "intrincado", type: "adjetivo" },
        { word: "aguda", type: "adjetivo" },
        { word: "determinado", type: "adjetivo" },
        { word: "intensas", type: "adjetivo" },
        { word: "productivas", type: "adjetivo" }
      ],
      timeLimit: 120
    },
    {
      id: 2,
      text: "La vibrante metrópolis pulsa con energía inagotable mientras ciudadanos diversos interactúan en calles bulliciosas y animadas.",
      task: "Encuentra SUSTANTIVOS, VERBOS y ADJETIVOS",
      targetWords: [
        { word: "metrópolis", type: "sustantivo" },
        { word: "energía", type: "sustantivo" },
        { word: "ciudadanos", type: "sustantivo" },
        { word: "calles", type: "sustantivo" },
        { word: "pulsa", type: "verbo" },
        { word: "interactúan", type: "verbo" },
        { word: "vibrante", type: "adjetivo" },
        { word: "inagotable", type: "adjetivo" },
        { word: "diversos", type: "adjetivo" },
        { word: "bulliciosas", type: "adjetivo" },
        { word: "animadas", type: "adjetivo" }
      ],
      timeLimit: 130
    },
    {
      id: 3,
      text: "Innovadores inventos transforman la sociedad moderna, facilitando tareas complejas para personas ocupadas en entornos dinámicos.",
      task: "Encuentra SUSTANTIVOS, VERBOS y ADJETIVOS",
      targetWords: [
        { word: "inventos", type: "sustantivo" },
        { word: "sociedad", type: "sustantivo" },
        { word: "tareas", type: "sustantivo" },
        { word: "personas", type: "sustantivo" },
        { word: "entornos", type: "sustantivo" },
        { word: "transforman", type: "verbo" },
        { word: "facilitando", type: "verbo" },
        { word: "innovadores", type: "adjetivo" },
        { word: "moderna", type: "adjetivo" },
        { word: "complejas", type: "adjetivo" },
        { word: "ocupadas", type: "adjetivo" },
        { word: "dinámicos", type: "adjetivo" }
      ],
      timeLimit: 140
    }
  ]
};

const MAX_LEVEL = 5;

export function DetectivePalabras({ onBack, level }: DetectivePalabrasProps) {
  const [currentLevel, setCurrentLevel] = useState(level);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [foundWords, setFoundWords] = useState<Record<string, 'sustantivo' | 'verbo' | 'adjetivo'>>({});
  const [score, setScore] = useState(0);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());

  const challenges = gameChallenges[currentLevel as keyof typeof gameChallenges] || gameChallenges[1];
  const current = challenges[currentChallenge];

  const progress = (currentChallenge / challenges.length) * 100;

  // Reset al cambiar nivel
  useEffect(() => {
    setCurrentLevel(level);
    setCurrentChallenge(0);
    setScore(0);
    setShowLevelComplete(false);
    setShowMotivational(false);
  }, [level]);


  useEffect(() => {
    if (gameStarted && current) {
      setFoundWords({});
      setSelectedWords(new Set());
      setChallengeComplete(false);
    }
  }, [currentChallenge, gameStarted, current]);

  const startGame = () => {
    setGameStarted(true);
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

    const cleanWord = word.toLowerCase();

    if (selectedWords.has(cleanWord)) return;

    const newSelected = new Set(selectedWords);
    newSelected.add(cleanWord);
    setSelectedWords(newSelected);

    const targetWord = current.targetWords.find(
      tw => tw.word.toLowerCase() === cleanWord
    );

    let newScore = score;

    if (targetWord) {
      newScore += 10;

      setFoundWords(prev => ({
        ...prev,
        [cleanWord]: targetWord.type
      }));

      setShowReward(true);
      setTimeout(() => setShowReward(false), 600);
    }

    setScore(newScore);

    // cuando ya eligió N palabras
    if (newSelected.size === current.targetWords.length) {
      setChallengeComplete(true);

      setTimeout(() => {
        nextChallenge();
      }, 2500); // 👈 tiempo para analizar
    }
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
    setShowLevelComplete(false);
    setShowMotivational(false);
    setShowLevelComplete(false);
    setGameStarted(false);
  };

  const loadNextLevel = () => {
    if (currentLevel < MAX_LEVEL) {
      const nextLevel = currentLevel + 1;
      setCurrentLevel(nextLevel);
      setCurrentChallenge(0);
      setScore(0);
      setFoundWords({});
      setShowLevelComplete(false);
      setShowMotivational(false);
      setShowLevelComplete(false);
      setGameStarted(true);
    } else {
      setShowLevelComplete(false);
      setShowLevelComplete(false);
      setGameStarted(false);
    }
  };

  const getWordTypeColor = (type: 'sustantivo' | 'verbo' | 'adjetivo') => {
    switch (type) {
      case 'sustantivo': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'verbo': return 'bg-green-100 text-green-700 border-green-300';
      case 'adjetivo': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return '';
    }
  };


  const maxPoints = challenges.reduce((sum, c) => sum + c.targetWords.length * 10, 0);

  if (!gameStarted) {
    return <StartScreenDetectivePalabras onStart={startGame} onBack={onBack} />;
  }


  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="max-w-7xl mx-auto">

        <GameHeader
          title={`Detective de Palabras`}
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
          animal="koala"
          message="¡Sé un detective curioso! Encuentra las palabras del tipo que se pide."
        />

        <div className="grid lg:grid-cols-2 gap-8 mt-6">
          <div>
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl text-gray-800">{current.task}</h2>
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-600">
                      {selectedWords.size} / {current.targetWords.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {current.targetWords.map((target, index) => (
                    <Badge
                      key={index}
                      className={`${getWordTypeColor(target.type)} ${foundWords[target.word.toLowerCase()] ? 'opacity-50' : ''
                        }`}
                    >
                      {foundWords[target.word.toLowerCase()] && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {target.type}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200">
              <CardContent className="p-8">
                <div className="text-xl leading-relaxed">
                  {textWords.map(({ word, originalWord, index }) => {
                    const isTarget = current.targetWords.some(tw =>
                      tw.word.toLowerCase() === word.toLowerCase()
                    );
                    const clean = word.toLowerCase();
                    const isSelected = selectedWords.has(clean);
                    const foundType = foundWords[clean];


                    return (
                      <span key={index}>
                        <span
                          className={`cursor-pointer transition-all duration-200 rounded px-1 text-black ${foundType === 'sustantivo'
                            ? 'bg-blue-200 text-blue-800'
                            : foundType === 'verbo'
                              ? 'bg-green-200 text-green-800'
                              : foundType === 'adjetivo'
                                ? 'bg-purple-200 text-purple-800'
                                : isSelected
                                  ? 'bg-red-200 text-red-800'
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
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 h-full">
            <CardContent className="p-6">
              <h2 className="text-xl mb-4 text-gray-800">¿Qué buscar?</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                  <div className="text-blue-600 mb-1 font-semibold">Sustantivos</div>
                  <div className="text-sm text-blue-700">Palabras que nombran personas, lugares, cosas u objetos.</div>
                  <div className="text-xs text-blue-600 mt-1">Ejemplo: casa, perro, María</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border-2 border-green-200">
                  <div className="text-green-600 mb-1 font-semibold">Verbos</div>
                  <div className="text-sm text-green-700">Palabras que expresan acciones, estados o procesos.</div>
                  <div className="text-xs text-green-600 mt-1">Ejemplo: correr, estudiar, saltar</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border-2 border-purple-200">
                  <div className="text-purple-600 mb-1 font-semibold">Adjetivos</div>
                  <div className="text-sm text-purple-700">Palabras que describen o califican a un sustantivo.</div>
                  <div className="text-xs text-purple-600 mt-1">Ejemplo: grande, hermoso, rápido</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <RewardAnimation
          type="star"
          show={showReward}
          message="¡Palabra correcta!"
          onComplete={() => setShowReward(false)}
        />

        {/* MENSAJE MOTIVACIONAL */}
        {showMotivational && (
          <MotivationalMessage
            score={score}
            total={maxPoints}
            customMessage="¡Has completado el nivel!"
            customSubtitle="Encontraste todas las palabras ocultas"
            celebrationText="¡Eres un explorador"
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