import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Star, Wrench, CheckCircle, RotateCcw, Lightbulb } from 'lucide-react';
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from "../../../others/RewardAnimation";
import { AudioPlayer } from '../../../others/AudioPlayer';

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
  difficulty: number;
}

const challenges: SentenceChallenge[] = [
  {
    id: 1,
    theme: "Animales",
    correctSentence: "El gato negro duerme en el sofá cómodo",
    words: ["El", "gato", "negro", "duerme", "en", "el", "sofá", "cómodo"],
    hint: "¿Dónde duerme el gato negro?",
    image: "🐱",
    difficulty: 1
  },
  {
    id: 2,
    theme: "Naturaleza",
    correctSentence: "Las flores coloridas crecen en el jardín hermoso",
    words: ["Las", "flores", "coloridas", "crecen", "en", "el", "jardín", "hermoso"],
    hint: "¿Dónde crecen las flores coloridas?",
    image: "🌸",
    difficulty: 1
  },
  {
    id: 3,
    theme: "Familia",
    correctSentence: "Mi abuela cocina deliciosos pasteles todos los domingos",
    words: ["Mi", "abuela", "cocina", "deliciosos", "pasteles", "todos", "los", "domingos"],
    hint: "¿Qué hace mi abuela los domingos?",
    image: "👵",
    difficulty: 2
  },
  {
    id: 4,
    theme: "Deportes",
    correctSentence: "Los niños juegan fútbol con mucha energía y alegría",
    words: ["Los", "niños", "juegan", "fútbol", "con", "mucha", "energía", "y", "alegría"],
    hint: "¿Cómo juegan fútbol los niños?",
    image: "⚽",
    difficulty: 2
  },
  {
    id: 5,
    theme: "Aventura",
    correctSentence: "El valiente explorador descubrió tesoros antiguos en la cueva misteriosa",
    words: ["El", "valiente", "explorador", "descubrió", "tesoros", "antiguos", "en", "la", "cueva", "misteriosa"],
    hint: "¿Qué descubrió el explorador en la cueva?",
    image: "🗺️",
    difficulty: 3
  },
  {
    id: 6,
    theme: "Ciencia",
    correctSentence: "Los científicos estudian planetas lejanos con telescopios muy potentes",
    words: ["Los", "científicos", "estudian", "planetas", "lejanos", "con", "telescopios", "muy", "potentes"],
    hint: "¿Cómo estudian los científicos los planetas lejanos?",
    image: "🔬",
    difficulty: 3
  }
];

export function ConstruyeFrase({ onBack, level }: ConstruyeFraseProps) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [userSentence, setUserSentence] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const challenge = challenges[currentChallenge];
  const progress = ((currentChallenge + 1) / challenges.length) * 100;

  useEffect(() => {
    resetChallenge();
  }, [currentChallenge]);

  const resetChallenge = () => {
    const shuffledWords = [...challenge.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffledWords);
    setUserSentence([]);
    setShowResult(false);
    setShowHint(false);
    setAttempts(0);
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

  const checkSentence = () => {
    setAttempts(attempts + 1);
    const userSentenceText = userSentence.join(' ');
    const isCorrect = userSentenceText === challenge.correctSentence;
    
    setShowResult(true);
    
    if (isCorrect) {
      const baseScore = challenge.difficulty * 20;
      const attemptBonus = Math.max(10 - attempts * 2, 0);
      const hintPenalty = showHint ? -5 : 0;
      const totalScore = baseScore + attemptBonus + hintPenalty;
      
      setScore(score + Math.max(totalScore, 5));
      setShowReward(true);
      
      setTimeout(() => {
        setShowReward(false);
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
        } else {
          setGameComplete(true);
        }
      }, 3000);
    } else {
      setTimeout(() => {
        setShowResult(false);
      }, 2000);
    }
  };

  const restartGame = () => {
    setCurrentChallenge(0);
    setScore(0);
    setGameComplete(false);
    setShowReward(false);
    resetChallenge();
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-orange-100 via-yellow-100 to-amber-100">
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
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🔧</div>
              
              <h2 className="text-3xl mb-4 text-gray-800">
                ¡Constructor de Frases Maestro!
              </h2>
              
              <div className="text-xl mb-6 text-gray-600">
                Puntuación final: {score} puntos
              </div>
              
              <div className="text-gray-600 mb-6">
                ¡Has construido todas las frases correctamente! Tienes un gran dominio del lenguaje.
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={restartGame}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3"
                >
                  Construir más frases
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-orange-100 via-yellow-100 to-amber-100">
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
              🔧 Construye la Frase
            </h1>
            <div className="flex items-center gap-2 justify-center mt-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Puntos: {score}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Frase {currentChallenge + 1} de {challenges.length}
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
            animal="turtle"
            message="¡Construye frases correctas ordenando las palabras! Lee con cuidado y piensa en el orden que tiene más sentido."
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Challenge Info */}
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

                <div className="mb-4">
                  <AudioPlayer
                    text="Reproduciendo pista..."
                    duration={1500}
                  />
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Dificultad: {Array.from({ length: challenge.difficulty }, (_, i) => '⭐').join('')}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Palabras: {challenge.words.length}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Intentos: {attempts}
                  </div>
                </div>

                <Button
                  onClick={() => setShowHint(!showHint)}
                  variant="outline"
                  className="w-full mt-4 bg-white/80"
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
              className="w-full bg-white/80 backdrop-blur-sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          </div>

          {/* Construction Area */}
          <div className="lg:col-span-2">
            {/* User Sentence */}
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
                        >
                          {word}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Palabras usadas: {userSentence.length} / {challenge.words.length}
                  </div>
                  
                  <Button
                    onClick={checkSentence}
                    disabled={userSentence.length !== challenge.words.length || showResult}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verificar Frase
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Available Words */}
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

            {/* Result Display */}
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
                        <>
                          <span className="text-red-800">Intenta de nuevo.</span>
                        </>
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

        {/* Reward Animation */}
        {showReward && (
          <RewardAnimation
            type="confetti"
            show={showReward}
            message="¡Frase perfecta!"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </div>
  );
}