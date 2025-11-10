import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Wrench, CheckCircle, RotateCcw, Lightbulb } from 'lucide-react';
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from "../../../others/RewardAnimation";
import { GameHeader } from "../../../others/GameHeader";
import { ProgressBar } from "../../../others/ProgressBar";
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { ConfettiExplosion } from '../../../others/ConfettiExplosion';
import { StartScreenConstruyeFrase } from "../IniciosJuegosLecturas/StartScreenConstruyeFrase/StartScreenConstruyeFrase";
import { speakText, stopSpeech, isSpeechSupported } from '../../../../utils/textToSpeech';
import { isUserAuthenticated } from '../../../../hooks/useLevelLock';

interface ConstruyeFraseProps {
  onBack: () => void;
  level: number;
}

interface SentenceChallenge {
  id: number;
  theme: string;
  correctSentence: string;
  words: string[];
  hint: string;
  image: string;
}

interface Level {
  level: number;
  challenges: SentenceChallenge[];
}

const levels: Level[] = [
  {
    level: 1,
    challenges: [
      {
        id: 1,
        theme: "Animales",
        correctSentence: "El gato negro duerme en el sofá cómodo",
        words: ["El", "gato", "negro", "duerme", "en", "el", "sofá", "cómodo"],
        hint: "¿Dónde duerme el gato negro?",
        image: "🐱",
      },
      {
        id: 2,
        theme: "Naturaleza",
        correctSentence: "Las flores coloridas crecen en el jardín hermoso",
        words: ["Las", "flores", "coloridas", "crecen", "en", "el", "jardín", "hermoso"],
        hint: "¿Dónde crecen las flores coloridas?",
        image: "🌸",
      },
    ],
  },
  {
    level: 2,
    challenges: [
      {
        id: 3,
        theme: "Familia",
        correctSentence: "Mi abuela cocina deliciosos pasteles todos los domingos",
        words: ["Mi", "abuela", "cocina", "deliciosos", "pasteles", "todos", "los", "domingos"],
        hint: "¿Qué hace mi abuela los domingos?",
        image: "👵",
      },
      {
        id: 4,
        theme: "Deportes",
        correctSentence: "Los niños juegan fútbol con mucha energía y alegría",
        words: ["Los", "niños", "juegan", "fútbol", "con", "mucha", "energía", "y", "alegría"],
        hint: "¿Cómo juegan fútbol los niños?",
        image: "⚽",
      },
    ],
  },
  {
    level: 3,
    challenges: [
      {
        id: 5,
        theme: "Aventura",
        correctSentence: "El valiente explorador descubrió tesoros antiguos en la cueva misteriosa",
        words: ["El", "valiente", "explorador", "descubrió", "tesoros", "antiguos", "en", "la", "cueva", "misteriosa"],
        hint: "¿Qué descubrió el explorador en la cueva?",
        image: "🗺️",
      },
      {
        id: 6,
        theme: "Ciencia",
        correctSentence: "Los científicos estudian planetas lejanos con telescopios muy potentes",
        words: ["Los", "científicos", "estudian", "planetas", "lejanos", "con", "telescopios", "muy", "potentes"],
        hint: "¿Cómo estudian los científicos los planetas lejanos?",
        image: "🔬",
      },
    ],
  },
];

export function ConstruyeFrase({ onBack, level: initialLevel }: ConstruyeFraseProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userSentence, setUserSentence] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  // Eliminado levelComplete no utilizado tras refactors
  const [gameComplete, setGameComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelCompleteModal, setShowLevelCompleteModal] = useState(false);
  const lastSpokenRef = useRef<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const currentLevelData = levels.find(l => l.level === currentLevel);
  const challenges = currentLevelData?.challenges || [];
  const challenge = challenges[currentChallenge] || {};
  const totalChallenges = challenges.length;
  const progress = totalChallenges > 0 ? (currentChallenge / totalChallenges) * 100 : 0;

  useEffect(() => {
    if (!currentLevelData || challenges.length === 0) {
      onBack();
      return;
    }
    // Si el juego inicia en un nivel > 1 y no está autenticado, pedir inicio de sesión
    if (currentLevel > 1 && !isUserAuthenticated()) {
      navigate('/estudiante/login');
      return;
    }
    resetChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChallenge, currentLevel, currentLevelData, challenges.length, onBack]);

  const resetChallenge = () => {
    const shuffledWords = [...challenge.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffledWords);
    setUserSentence([]);
    setShowResult(false);
    setShowHint(false);
    setAttempts(0);
    lastSpokenRef.current = null;
  };

  const addWordToSentence = (word: string, wordIndex: number) => {
    if (showResult) return;
    setUserSentence([...userSentence, word]);
    setAvailableWords(availableWords.filter((_, index) => index !== wordIndex));
  };

  const removeWordFromSentence = (wordIndex: number) => {
    if (showResult) return;
    const word = userSentence[wordIndex];
    setAvailableWords([...availableWords, word]);
    setUserSentence(userSentence.filter((_, index) => index !== wordIndex));
  };

  const handleWordHover = (word: string) => {
    if (!isSpeechSupported()) return;
    // Evita repetir la misma palabra si ya se habló muy recientemente
    if (lastSpokenRef.current === word) return;
    lastSpokenRef.current = word;
    // Cancela hover anterior programado
    if (hoverTimeoutRef.current) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // Pequeño delay para evitar disparos accidentales al mover rápido el mouse
    hoverTimeoutRef.current = window.setTimeout(() => {
      stopSpeech();
      speakText(word, { rate: 0.9, pitch: 1.05 });
    }, 120);
  };

  useEffect(() => {
    return () => {
      // Limpieza al desmontar
      if (hoverTimeoutRef.current) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
      stopSpeech();
    };
  }, []);

  const checkSentence = () => {
    setAttempts(attempts + 1);
    const userSentenceText = userSentence.join(' ');
    const isCorrect = userSentenceText === challenge.correctSentence;

    setShowResult(true);

    if (isCorrect) {
      const baseScore = currentLevel * 20;
      const attemptBonus = Math.max(10 - attempts * 2, 0);
      const hintPenalty = showHint ? -5 : 0;
      const totalScore = baseScore + attemptBonus + hintPenalty;

      setScore(prev => prev + Math.max(totalScore, 5));
      setShowReward(true);

      setTimeout(() => {
        setShowReward(false);
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
        } else {
          if (currentLevel < levels.length) {
            setShowMotivational(true);
          } else {
            setGameComplete(true);
            setShowMotivational(true);
          }
        }
      }, 3000);
    } else {
      setTimeout(() => setShowResult(false), 2000);
    }
  };

  const restartLevel = () => {
    setCurrentChallenge(0);
    setScore(0);
    setGameComplete(false);
    setShowReward(false);
    setShowMotivational(false);
    setShowLevelCompleteModal(false);
    resetChallenge();
  };

  const nextLevel = () => {
    if (currentLevel < levels.length) {
      const next = currentLevel + 1;
      if (next >= 2 && !isUserAuthenticated()) {
        // Solicitar inicio de sesión
        navigate('/estudiante/login');
        return;
      }
      setCurrentLevel(next);
      setCurrentChallenge(0);
      setScore(0);
      setShowReward(false);
      setShowMotivational(false);
      setShowLevelCompleteModal(false);
      resetChallenge();
    }
  };

  if (!gameStarted) {
    return <StartScreenConstruyeFrase onStart={() => setGameStarted(true)} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-orange-100 via-yellow-100 to-amber-100">
      <div className="max-w-7xl mx-auto">
        <ConfettiExplosion show={showReward} />
        <RewardAnimation type="confetti" show={showReward} />

        {/* HEADER */}
        <GameHeader
          title="Construye la Frase"
          level={currentLevel}
          score={score}
          onBack={onBack}
          onRestart={restartLevel}
        />

        {/* BARRA DE PROGRESO */}
        <ProgressBar
          current={currentChallenge}
          total={totalChallenges}
          progress={progress}
          className="mb-6"
        />

        {/* GUÍA DEL ANIMAL */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <AnimalGuide
            animal="turtle"
            message="¡Construye frases correctas ordenando las palabras! Lee con cuidado y piensa en el orden que tiene más sentido."
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-yellow-200 mb-4">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-3">{challenge.image}</div>
                  <Badge variant="secondary" className="mb-2">
                    {challenge.theme}
                  </Badge>
                  <h3 className="text-lg text-gray-800">Desafío {currentChallenge + 1}</h3>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Dificultad: {Array.from({ length: currentLevel }, () => '⭐').join('')}
                  </div>
                  <div className="text-sm text-gray-600">
                    Palabras: {challenge.words?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    Intentos: {attempts}
                  </div>
                </div>

                <Button
                  onClick={() => setShowHint(!showHint)}
                  variant="outline"
                  className="w-full mt-4 bg-purple-500"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  {showHint ? 'Ocultar' : 'Ver'} Pista
                </Button>

                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                  >
                    <p className="text-yellow-800 text-sm">{challenge.hint}</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={resetChallenge}
              variant="outline"
              className="w-full bg-green-500 backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-500" />
                  Tu frase construida:
                </h3>

                <div className="min-h-[80px] p-4 bg-orange-50 rounded-lg border-2 border-orange-200 border-dashed">
                  {userSentence.length === 0 ? (
                    <div className="text-gray-500 text-center py-4">
                      Arrastra las palabras aquí para construir tu frase
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {userSentence.map((word, index) => (
                        <motion.div
                          key={`sentence-${index}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-orange-200 text-orange-800 px-3 py-2 rounded-lg cursor-pointer border-2 border-orange-300 hover:bg-orange-300 transition-colors"
                          onClick={() => removeWordFromSentence(index)}
                          onMouseEnter={() => handleWordHover(word)}
                        >
                          {word}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Palabras usadas: {userSentence.length} / {challenge.words?.length || 0}
                  </div>

                  <Button
                    onClick={checkSentence}
                    disabled={userSentence.length !== (challenge.words?.length || 0) || showResult}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verificar Frase
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PALABRAS DISPONIBLES */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-amber-200">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-gray-800">Palabras disponibles:</h3>

                <div className="flex flex-wrap gap-3">
                  {availableWords.map((word, index) => (
                    <motion.div
                      key={`available-${index}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-amber-100 text-amber-800 px-4 py-3 rounded-lg cursor-pointer border-2 border-amber-200 hover:bg-amber-200 transition-colors dyslexia-friendly"
                      onClick={() => addWordToSentence(word, index)}
                      onMouseEnter={() => handleWordHover(word)}
                    >
                      {word}
                    </motion.div>
                  ))}
                </div>

                {availableWords.length === 0 && !showResult && (
                  <div className="text-center py-4 text-gray-500">
                    ¡Todas las palabras han sido usadas!
                  </div>
                )}
              </CardContent>
            </Card>

          
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className={`border-2 ${
                  userSentence.join(' ') === challenge.correctSentence
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {userSentence.join(' ') === challenge.correctSentence ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-800">¡Frase correcta!</span>
                        </>
                      ) : (
                        <span className="text-red-800">Intenta de nuevo.</span>
                      )}
                    </div>

                    <div className="text-sm text-gray-700">
                      <strong>Frase correcta:</strong> {challenge.correctSentence}
                    </div>

                    {userSentence.join(' ') !== challenge.correctSentence && (
                      <div className="text-sm text-gray-700 mt-1">
                        <strong>Tu frase:</strong> {userSentence.join(' ')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* MODALES */}
      {showMotivational && (
        <MotivationalMessage
          score={score}
          total={levels.reduce((acc, l) => acc + l.challenges.length, 0) * 30}
          customMessage={gameComplete ? "¡Eres un arquitecto de palabras!" : "¡Nivel completado!"}
          customSubtitle={gameComplete ? "Completaste todos los niveles con maestría" : "Construiste todas las frases con precisión"}
          onComplete={() => {
            setShowMotivational(false);
            setShowLevelCompleteModal(true);
          }}
        />
      )}

      {showLevelCompleteModal && (
        <LevelCompleteModal
          score={score}
          total={gameComplete ? levels.reduce((acc, l) => acc + l.challenges.length, 0) * 30 : challenges.length * 30}
          level={currentLevel}
          isLastLevel={currentLevel >= levels.length}
          onNextLevel={nextLevel}
          onRestart={restartLevel}
          onExit={onBack}
        />
      )}
    </div>
  );
}