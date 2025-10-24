import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Star, RotateCcw, Trophy, ArrowRight } from 'lucide-react';
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from "../../../others/RewardAnimation";
import { AudioPlayer } from '../../../others/AudioPlayer';
import solImg from '../../../../assets/7_8/images/sol.png';
import gatoImg from '../../../../assets/7_8/images/gato.png';
import florImg from '../../../../assets/7_8/images/flor.png';
import manzanaImg from '../../../../assets/7_8/images/manzana.png';
import perroImg from '../../../../assets/7_8/images/perro.png';
import mariposaImg from '../../../../assets/7_8/images/mariposa.png';
import televisorImg from '../../../../assets/7_8/images/televisor.png';
import casaImg from '../../../../assets/7_8/images/casa.png';
import autoImg from '../../../../assets/7_8/images/auto.png';
import girasolImg from '../../../../assets/7_8/images/girasol.png';

interface CazaSilabaProps {
  onBack: () => void;
  level: number;
  onFinishLevel: (level: number, passed: boolean) => void;
}

const gameData = {
  1: [
    { image: solImg, word: 'SOL', syllables: ['SO', 'LA', 'MI'], correct: 'SO' },
    { image: gatoImg, word: 'GATO', syllables: ['GA', 'PE', 'SO'], correct: 'GA' },
    { image: florImg, word: 'FLOR', syllables: ['FL', 'CA', 'AR'], correct: 'FL' },
    { image: manzanaImg, word: 'MANZANA', syllables: ['MAN', 'CA', 'PE'], correct: 'MAN' },
    { image: perroImg, word: 'PERRO', syllables: ['PE', 'TO', 'MI'], correct: 'PE' },
  ],
  2: [
    { image: mariposaImg, word: 'MARIPOSA', syllables: ['MA', 'LE', 'TO'], correct: 'MA' },
    { image: televisorImg, word: 'TELEVISOR', syllables: ['TE', 'RA', 'MI'], correct: 'TE' },
    { image: casaImg, word: 'CASA', syllables: ['CA', 'PE', 'LO'], correct: 'CA' },
    { image: autoImg, word: 'AUTOMÓVIL', syllables: ['AU', 'LI', 'SE'], correct: 'AU' },
    { image: girasolImg, word: 'GIRASOL', syllables: ['GI', 'MA', 'TO'], correct: 'GI' },
  ],
  3: [
    { phrase: 'El __to salta', options: ['ga', 'pe', 'so'], correct: 'ga', complete: 'gato', fullPhrase: 'El gato salta' },
    { phrase: 'La __sa es azul', options: ['ca', 'me', 'to'], correct: 'ca', complete: 'casa', fullPhrase: 'La casa es azul' },
    { phrase: 'El __l brilla', options: ['so', 'ma', 'pe'], correct: 'so', complete: 'sol', fullPhrase: 'El sol brilla' },
    { phrase: 'Mi __dre cocina', options: ['ma', 'sa', 'her'], correct: 'ma', complete: 'madre', fullPhrase: 'Mi madre cocina' },
    { phrase: 'El ___fante es grande', options: ['ele', 'ari', 'uno'], correct: 'ele', complete: 'elefante', fullPhrase: 'El elefante es grande' },
  ],
};

export function CazaSilaba({ onBack, level, onFinishLevel }: CazaSilabaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isCorrectDrop, setIsCorrectDrop] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [currentLevel, setCurrentLevel] = useState(level);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [showMotivationalScore, setShowMotivationalScore] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0); // Estado para progreso incremental

  const QUESTIONS_PER_LEVEL = 5;
  const data = gameData[currentLevel as keyof typeof gameData] || gameData[1];

  // Only render if we have valid data and index
  if (!data || currentIndex >= data.length) {
    return null;
  }

  const currentItem = data[currentIndex];
  const isPhrase = 'phrase' in currentItem;

  // Calcular progreso
  const baseProgress = (currentIndex / QUESTIONS_PER_LEVEL) * 100; // Progreso base por pregunta
  const incrementPerCorrect = 100 / QUESTIONS_PER_LEVEL; // Incremento por respuesta correcta
  const maxPageProgress = 100 / QUESTIONS_PER_LEVEL; // Máximo progreso por pregunta

  // Actualizar progreso incremental
  const updateProgress = () => {
    const newProgress = baseProgress + (completed[currentIndex] ? incrementPerCorrect : 0);
    setCurrentProgress(Math.min(newProgress, baseProgress + maxPageProgress)); // Limita al progreso máximo de la pregunta
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleDrop = (syllable: string) => {
    const isCorrect = draggedItem === currentItem.correct;
    setIsCorrectDrop(isCorrect);
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    const newCompleted = [...completed];
    newCompleted[currentIndex] = isCorrect;
    setCompleted(newCompleted);
    if (isCorrect) {
      setShowReward(true);
      updateProgress(); // Actualiza el progreso al responder correctamente
    }

    setTimeout(() => {
      setShowReward(false);
      setDraggedItem(null);
      setIsCorrectDrop(null);

      // Check if we completed 5 questions
      if (currentIndex + 1 >= QUESTIONS_PER_LEVEL) {
        setShowMotivationalScore(true);
        const passed = newScore >= 4;

        setTimeout(() => {
          setShowMotivationalScore(false);
          setShowLevelComplete(true);
          onFinishLevel(currentLevel, passed);
        }, 3000);
      } else {
        // Continue to next question
        setCurrentIndex(currentIndex + 1);
        setCurrentProgress(((currentIndex + 1) / QUESTIONS_PER_LEVEL) * 100); // Reinicia progreso a la nueva pregunta
      }
    }, isCorrect ? 2000 : 1000); // Menor retraso para incorrectas
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setCompleted([]);
    setDraggedItem(null);
    setIsCorrectDrop(null);
    setShowLevelComplete(false);
    setShowMotivationalScore(false);
    setCurrentProgress(0); // Reinicia el progreso
  };

  const handleNextLevel = () => {
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      setCurrentIndex(0);
      setScore(0);
      setCompleted([]);
      setDraggedItem(null);
      setIsCorrectDrop(null);
      setShowLevelComplete(false);
      setShowMotivationalScore(false);
      setCurrentProgress(0); // Reinicia el progreso al nuevo nivel
      onFinishLevel(currentLevel, true);
    }
  };

  const getMotivationalMessage = () => {
    const percentage = (score / QUESTIONS_PER_LEVEL) * 100;
    if (percentage === 100) return "¡Perfecto! ¡Eres increíble! 🌟";
    if (percentage >= 80) return "¡Excelente trabajo! ¡Casi perfecto! 🎉";
    if (percentage >= 60) return "¡Muy bien! ¡Sigue así! 👏";
    return "¡Buen intento! ¡Puedes hacerlo mejor! 💪";
  };

  return (
    <div 
      className="min-h-screen p-6"
      style={{
        background: 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 100%)'
      }}
    >
      <RewardAnimation type="star" show={showReward} />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-black/80 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        
        <div className="text-center">
          <h1 className="text-2xl text-white mb-2 dyslexia-friendly text-black">
            🔍 Caza la Sílaba - Nivel {currentLevel}
          </h1>
          <div className="flex items-center gap-2 text-black">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>Puntos: {score}</span>
          </div>
        </div>
        
        <Button
          onClick={handleRestart}
          variant="outline"
          className="bg-black/80 backdrop-blur-sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reiniciar
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="h-4 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentProgress > 100 ? 100 : currentProgress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-yellow-400 to-green-500 rounded-full"
          />
        </div>
        <div className="text-center text-black mt-2">
          Progreso: {currentProgress.toFixed(1)}% ({currentIndex + 1} de {QUESTIONS_PER_LEVEL})
        </div>
      </div>

      {/* Animal Guide */}
      <div className="max-w-2xl mx-auto mb-8">
        <AnimalGuide
          animal="owl"
          message={`${isPhrase ? 'Completa la frase' : 'Arrastra la sílaba correcta'} para la ${isPhrase ? 'palabra que falta' : 'imagen'}. ¡Tú puedes!`}
        />
      </div>

      {/* Game Area */}
      {!showLevelComplete && !showMotivationalScore && currentIndex < QUESTIONS_PER_LEVEL && (
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side - Image/Phrase */}
            <motion.div
              key={currentIndex}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm h-full">
                <CardContent className="p-8 text-center">
                  {isPhrase ? (
                    <div>
                      <h3 className="text-xl mb-6 text-gray-700">
                        Completa la frase:
                      </h3>
                      <div className="text-2xl mb-6 p-4 bg-blue-50 rounded-lg">
                        {(currentItem as any).phrase}
                      </div>
                      <Button 
                        variant="outline"
                        className="mb-4"
                        onClick={() => speakText((currentItem as any).fullPhrase)}
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        Escuchar frase completa
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={currentItem.image}
                        alt={currentItem.word}
                        style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                        className="mb-6 mx-auto"
                      />
                      <h3 className="text-xl text-gray-700 mb-4">
                        {(currentItem as any).word}
                      </h3>
                      <Button 
                        variant="outline"
                        onClick={() => speakText((currentItem as any).word)}
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        Escuchar palabra
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Side - Syllables/Options */}
            <motion.div
              key={`options-${currentIndex}`}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm h-full">
                <CardContent className="p-8">
                  <h3 className="text-xl text-center mb-6 text-gray-700">
                    {isPhrase ? 'Elige la sílaba correcta:' : 'Arrastra la sílaba que corresponde:'}
                  </h3>
                  
                  {/* Drop Zone */}
                  <div 
                    className={`w-full h-20 border-4 border-dashed rounded-lg mb-6 flex items-center justify-center transition-all ${
                      draggedItem
                        ? isCorrectDrop === true
                          ? 'border-green-400 bg-green-50'
                          : isCorrectDrop === false
                          ? 'border-red-400 bg-red-50'
                          : 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (draggedItem) {
                        handleDrop(draggedItem);
                      }
                    }}
                  >
                    {draggedItem ? (
                      <span
                        className={`text-2xl font-bold ${
                          isCorrectDrop === true ? 'text-green-600' : isCorrectDrop === false ? 'text-red-600' : 'text-gray-600'
                        }`}
                      >
                        {draggedItem}
                      </span>
                    ) : (
                      <span className="text-gray-400">Suelta aquí la sílaba</span>
                    )}
                  </div>

                  {/* Syllable Options */}
                  <div className="grid grid-cols-3 gap-4">
                    {(isPhrase ? (currentItem as any).options : (currentItem as any).syllables).map((syllable: string, index: number) => (
                      <motion.div
                        key={`${syllable}-${index}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          draggable
                          onDragStart={() => setDraggedItem(syllable)}
                          onDragEnd={() => {}}
                          className="cursor-grab active:cursor-grabbing p-4 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-lg text-center font-bold text-xl shadow-lg hover:shadow-xl transition-all"
                        >
                          {syllable}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )}

      {/* Motivational Score Message */}
      {showMotivationalScore && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        >
          <Card className="bg-white/95 backdrop-blur-sm max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h2 className="text-2xl mb-4 text-gray-800">¡Nivel Completado!</h2>
              <p className="text-lg mb-4 text-purple-600">
                {getMotivationalMessage()}
              </p>
              <p className="text-gray-600 mb-4">
                Respondiste {score} de {QUESTIONS_PER_LEVEL} preguntas correctamente
              </p>
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-yellow-600">+{score * 10} XP ganados</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Level Complete Message */}
      {showLevelComplete && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        >
          <Card className="bg-white/95 backdrop-blur-sm max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl mb-4 text-gray-800">
                {score >= 4 ? '¡Bien hecho!' : '¡Inténtalo de nuevo!'}
              </h2>
              <p className="text-gray-600 mb-4">
                {score >= 4
                  ? currentLevel >= 3
                    ? `¡Has completado todos los niveles con ${score} puntos!`
                    : `¡Has completado el nivel ${currentLevel}!`
                  : `Respondiste ${score} de ${QUESTIONS_PER_LEVEL}. Necesitas 4 para pasar.`}
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-yellow-600">+{score * 10} XP ganados</span>
              </div>
              <div className="flex flex-col gap-2">
                {score >= 4 && currentLevel < 3 && (
                  <Button 
                    onClick={handleNextLevel} 
                    className="bg-green-500 hover:bg-green-600 w-full"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Siguiente Nivel ({currentLevel + 1})
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleRestart} className="bg-purple-500 hover:bg-purple-600 flex-1">
                    {score >= 4 ? 'Repetir Nivel' : 'Intentar de nuevo'}
                  </Button>
                  <Button onClick={onBack} variant="outline" className="flex-1">
                    Salir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}