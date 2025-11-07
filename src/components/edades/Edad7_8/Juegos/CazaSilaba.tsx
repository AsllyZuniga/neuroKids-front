import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { ButtonWithAudio } from "../../../ui/ButtonWithAudio";
import { Card, CardContent } from "../../../ui/card";
import { AnimalGuide } from '../../../others/AnimalGuide';
import { GameHeader } from "../../../others/GameHeader";
import { ProgressBar } from "../../../others/ProgressBar";
import { RewardAnimation } from "../../../others/RewardAnimation";
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { LevelLock } from "../../../others/LevelLock";
import { StartScreenCazaSilaba } from "../IniciosJuegosLecturas/StartScreenCazaSilaba";
import { speakText, canSpeakOnHover } from "../../../../utils/textToSpeech";
import { useLevelLock } from "../../../../hooks/useLevelLock";
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

interface ItemWord {
  image: string;
  word: string;
  syllables: string[];
  correct: string;
}

interface ItemPhrase {
  phrase: string;
  options: string[];
  correct: string;
  complete: string;
  fullPhrase: string;
}

const gameData: Record<number, Array<ItemWord | ItemPhrase>> = {
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
  const [gameStarted, setGameStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isCorrectDrop, setIsCorrectDrop] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [currentLevel, setCurrentLevel] = useState(level);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const isLevelLocked = useLevelLock(currentLevel);

  const QUESTIONS_PER_LEVEL = 5;
  const data = gameData[currentLevel as keyof typeof gameData] || gameData[1];

  if (!data || currentIndex >= data.length) {
    return null;
  }

  const currentItem = data[currentIndex] as ItemWord | ItemPhrase;
  const isPhrase = 'phrase' in currentItem;

  const baseProgress = (currentIndex / QUESTIONS_PER_LEVEL) * 100;
  const incrementPerCorrect = 100 / QUESTIONS_PER_LEVEL;
  const maxPageProgress = 100 / QUESTIONS_PER_LEVEL;

  const updateProgress = () => {
    const newProgress = baseProgress + (completed[currentIndex] ? incrementPerCorrect : 0);
    setCurrentProgress(Math.min(newProgress, baseProgress + maxPageProgress));
  };

  // Se usa la utilidad global speakText importada, con voz infantil

  const handleDrop = () => {
    const isCorrect = draggedItem === currentItem.correct;
    setIsCorrectDrop(isCorrect);
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    const newCompleted = [...completed];
    newCompleted[currentIndex] = isCorrect;
    setCompleted(newCompleted);

    if (isCorrect) {
      setShowReward(true);
      updateProgress();
    }

    setTimeout(() => {
      setShowReward(false);
      setDraggedItem(null);
      setIsCorrectDrop(null);

      if (currentIndex + 1 >= QUESTIONS_PER_LEVEL) {
        setShowMotivational(true);
        setTimeout(() => {
          setShowMotivational(false);
          setShowLevelComplete(true);
          const finalScore = score + (isCorrect ? 1 : 0);
          const passed = finalScore >= 4;

          onFinishLevel(currentLevel, passed);
        }, 3000);
      } else {
        setCurrentIndex(currentIndex + 1);
        setCurrentProgress(((currentIndex + 1) / QUESTIONS_PER_LEVEL) * 100);
      }
    }, isCorrect ? 2000 : 1000);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setCompleted([]);
    setDraggedItem(null);
    setIsCorrectDrop(null);
    setShowLevelComplete(false);
    setShowMotivational(false);
    setCurrentProgress(0);
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
      setShowMotivational(false);
      setCurrentProgress(0);
      onFinishLevel(currentLevel, true);
    }
  };

  if (!gameStarted) {
    return (
      <LevelLock level={currentLevel} isLocked={isLevelLocked}>
        <StartScreenCazaSilaba onStart={() => setGameStarted(true)} onBack={onBack} />
      </LevelLock>
    );
  }

  return (
    <LevelLock level={currentLevel} isLocked={isLevelLocked}>
    <div
      className="min-h-screen p-6"
      style={{
        background: 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 100%)'
      }}
    >
      <RewardAnimation type="star" show={showReward} />

      {/* GameHeader */}
      <GameHeader
        title="Caza la Sílaba"
        level={currentLevel}
        score={score}
        onBack={onBack}
        onRestart={handleRestart}
      />

      {/* Progress Bar */}
      <ProgressBar
        current={currentIndex + 1}
        total={QUESTIONS_PER_LEVEL}
        progress={currentProgress}  
      />

      {/* Animal Guide */}
      <div className="max-w-2xl mx-auto mb-8">
        <AnimalGuide
          animal="turtle"
          message={`${isPhrase ? 'Completa la frase' : 'Arrastra la sílaba correcta'} para la ${isPhrase ? 'palabra que falta' : 'imagen'}. ¡Tú puedes!`}
        />
      </div>

      {/* Area de juego */}
      {!showLevelComplete && !showMotivational && currentIndex < QUESTIONS_PER_LEVEL && (
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
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
                        {(currentItem as ItemPhrase).phrase}
                      </div>
                      <ButtonWithAudio
                        variant="outline"
                        className="mb-4 bg-blue-500 text-black"
                        playOnClick
                        playOnHover={false}
                        onClick={() => speakText((currentItem as ItemPhrase).fullPhrase, { voiceType: 'child' })}
                      >
                        <Volume2 className="w-4 h-4 mr-2 text-black" />
                        Escuchar frase completa
                      </ButtonWithAudio>
                    </div>
                  ) : (
                    <div>
                       <img
                        src={(currentItem as ItemWord).image}
                        alt={(currentItem as ItemWord).word}
                        style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                        className="mb-6 mx-auto"
                      />
                      <h3 className="text-xl text-gray-700 mb-4">
                        {(currentItem as ItemWord).word}
                      </h3>
                      <ButtonWithAudio
                        variant="outline"
                        className='text-black bg-blue-500'
                        playOnClick
                        playOnHover={false}
                        onClick={() => speakText((currentItem as ItemWord).word, { voiceType: 'child' })}
                      >
                        <Volume2 className="w-4 h-4 mr-2 text-black" />
                        Escuchar palabra
                      </ButtonWithAudio>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Opciones silabas */}
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
                  <div
                    className={`w-full h-20 border-4 border-dashed rounded-lg mb-6 flex items-center justify-center transition-all ${draggedItem
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
                        handleDrop();
                      }
                    }}
                  >
                    {draggedItem ? (
                      <span
                        className={`text-2xl font-bold ${isCorrectDrop === true ? 'text-green-600' : isCorrectDrop === false ? 'text-red-600' : 'text-gray-600'
                          }`}
                      >
                        {draggedItem}
                      </span>
                    ) : (
                      <span className="text-gray-400">Suelta aquí la sílaba</span>
                    )}
                  </div>

                  {/* Silabas */}
                  <div className="grid grid-cols-3 gap-4">
                    {(isPhrase ? (currentItem as ItemPhrase).options : (currentItem as ItemWord).syllables).map((syllable: string, index: number) => (
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
                          onDragStart={() => {
                            setDraggedItem(syllable);
                            speakText(syllable, { voiceType: 'child' });
                          }}
                          onDragEnd={() => { }}
                          onMouseEnter={() => { if (canSpeakOnHover()) speakText(syllable, { voiceType: 'child' }); }}
                          onClick={() => speakText(syllable, { voiceType: 'child' })}
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
      {/* Mensaje Motivacional */}
      {showMotivational && (
        <MotivationalMessage
          score={score + (isCorrectDrop ? 1 : 0)}
          total={QUESTIONS_PER_LEVEL}
          onComplete={() => {
            setShowMotivational(false);
            setShowLevelComplete(true);
          }}
        />
      )}

      {/* Modal Final de Nivel */}
      {showLevelComplete && (
        <LevelCompleteModal
          score={score + (isCorrectDrop ? 1 : 0)}
          total={QUESTIONS_PER_LEVEL}
          level={currentLevel}
          isLastLevel={currentLevel >= 3}
          onNextLevel={handleNextLevel}
          onRestart={handleRestart}
          onExit={onBack}
        />
      )}
    </div>
    </LevelLock>
  );
}