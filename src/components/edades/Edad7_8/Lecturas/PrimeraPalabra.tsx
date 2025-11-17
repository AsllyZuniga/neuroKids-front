import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ButtonWithAudio } from "../../../ui/ButtonWithAudio";
import { Card, CardContent } from "../../../ui/card";
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from "../../../others/RewardAnimation";
import { GameHeader } from "../../../others/GameHeader";
import { ProgressBar } from "../../../others/ProgressBar";
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { ConfettiExplosion } from '../../../others/ConfettiExplosion';
import { StartScreenPrimeraPalabra } from "../IniciosJuegosLecturas/StartScreenPrimeraPalabra/StartScreenPrimeraPalabra";
import { LevelLock } from "../../../others/LevelLock";
import { useLevelLock } from "../../../../hooks/useLevelLock";
import { speakText } from "../../../../utils/textToSpeech";

interface PrimeraPalabraProps {
  onBack: () => void;
  level?: number;
}

const readingData: Record<number, any[]> = {
  1: [
    { word: 'SOL', image: '🌞', pronunciation: '/sol/', meaning: 'El sol es una estrella que nos da luz y calor.' },
    { word: 'MAR', image: '🌊', pronunciation: '/mar/', meaning: 'El mar es grande y tiene agua salada.' },
    { word: 'PEZ', image: '🐟', pronunciation: '/pez/', meaning: 'El pez vive en el agua y nada muy rápido.' },
    { word: 'FLOR', image: '🌸', pronunciation: '/flor/', meaning: 'La flor es bonita y huele muy bien.' }
  ],
  2: [
    {
      sentence: 'El gato corre.',
      image: '🐱',
      words: ['El', 'gato', 'corre'],
      meanings: ['artículo', 'animal doméstico', 'acción de moverse rápido']
    },
    {
      sentence: 'La niña canta.',
      image: '👧',
      words: ['La', 'niña', 'canta'],
      meanings: ['artículo', 'persona joven', 'hacer música con la voz']
    },
    {
      sentence: 'El sol brilla.',
      image: '🌞',
      words: ['El', 'sol', 'brilla'],
      meanings: ['artículo', 'estrella que da luz', 'dar luz intensa']
    },
    {
      sentence: 'El pájaro canta.',
      image: '🐦🎶',
      words: ['El', 'pájaro', 'canta'],
      meanings: ['artículo', 'animal que vuela', 'hacer sonidos musicales']
    },
    {
      sentence: 'La luna brilla.',
      image: '🌙✨',
      words: ['La', 'luna', 'brilla'],
      meanings: ['artículo', 'cuerpo celeste nocturno', 'dar luz suave']
    },
    {
      sentence: 'El árbol crece.',
      image: '🌳',
      words: ['El', 'árbol', 'crece'],
      meanings: ['artículo', 'planta grande', 'aumentar de tamaño']
    },
    {
      sentence: 'La casa bonita.',
      image: '🏠😴',
      words: ['La', 'casa', 'bonita'],
      meanings: ['artículo', 'lugar donde vives', 'estar en silencio']
    },
    {
      sentence: 'El río fluye.',
      image: '🌊🏞️',
      words: ['El', 'río', 'fluye'],
      meanings: ['artículo', 'agua que corre', 'moverse como agua']
    }
  ],
  3: [
    {
      story: 'La niña canta una canción muy bonita en el jardín.',
      image: '👧🎵',
      audio: true,
      questions: [
        { q: '¿Quién canta?', options: ['El niño', 'La niña', 'El gato'], correct: 1 },
        { q: '¿Dónde canta?', options: ['En la casa', 'En el jardín', 'En la escuela'], correct: 1 }
      ]
    },
    {
      story: 'El perro juega con una pelota roja en el parque.',
      image: '🐕⚽',
      audio: true,
      questions: [
        { q: '¿Con qué juega el perro?', options: ['Un hueso', 'Una pelota', 'Un palo'], correct: 1 },
        { q: '¿De qué color es la pelota?', options: ['Azul', 'Verde', 'Roja'], correct: 2 }
      ]
    },
    {
      story: 'El gato duerme en la cama suave.',
      image: '🐱🛏️',
      audio: true,
      questions: [
        { q: '¿Quién duerme?', options: ['El perro', 'El gato', 'El pájaro'], correct: 1 },
        { q: '¿Dónde duerme?', options: ['En la cama', 'En el árbol', 'En el río'], correct: 0 }
      ]
    },
    {
      story: 'El sol calienta la playa bonita.',
      image: '🌞🏖️',
      audio: true,
      questions: [
        { q: '¿Qué calienta el sol?', options: ['La casa', 'La playa', 'El cielo'], correct: 1 },
        { q: '¿Cómo es la playa?', options: ['Fría', 'Bonita', 'Oscura'], correct: 1 }
      ]
    },
    {
      story: 'La abeja vuela sobre la flor roja.',
      image: '🐝🌺',
      audio: true,
      questions: [
        { q: '¿Quién vuela?', options: ['La abeja', 'El pájaro', 'El pez'], correct: 0 },
        { q: '¿Sobre qué vuela?', options: ['El árbol', 'La flor', 'El río'], correct: 1 }
      ]
    },
    {
      story: 'El niño pinta un dibujo grande.',
      image: '🧒🎨',
      audio: true,
      questions: [
        { q: '¿Quién pinta?', options: ['La niña', 'El niño', 'La mamá'], correct: 1 },
        { q: '¿Qué pinta el niño?', options: ['Un dibujo', 'Una casa', 'Un árbol'], correct: 0 }
      ]
    }
  ]
};
const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '').trim();

function levenshtein(a: string, b: string) {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

export function PrimeraPalabra({ onBack, level = 1 }: PrimeraPalabraProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const MAX_LEVEL = 3;
  const [currentLevel, setCurrentLevel] = useState(Math.min(Math.max(level, 1), MAX_LEVEL));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [completedItems, setCompletedItems] = useState<boolean[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [listening, setListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [pronunciationCorrect, setPronunciationCorrect] = useState<boolean | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);

  const locked = useLevelLock(currentLevel);
  const recognitionRef = useRef<any>(null);

  const data = readingData[currentLevel] ?? readingData[1];
  const currentItem = data[currentIndex];

  const totalItems = data.length;
  const baseProgress = (currentIndex / totalItems) * 100;
  const maxItemProgress = 100 / totalItems;
  const questionIncrement = currentItem?.questions ? maxItemProgress / currentItem.questions.length : maxItemProgress;

  const updateProgress = () => {
    let newProgress = baseProgress;
    if (currentLevel === 3 && currentItem?.questions) {
      newProgress += currentQuestion * questionIncrement;
    }
    if (completedItems[currentIndex]) {
      newProgress = baseProgress + maxItemProgress;
    }
    setCurrentProgress(Math.min(newProgress, 100));
  };

  const resetLevel = (newLevel: number) => {
    const currentData = readingData[newLevel];
    if (!currentData) {
      setCurrentLevel(1);
      setCurrentIndex(0);
      setCurrentQuestion(0);
      setScore(0);
      setShowReward(false);
      setRecognizedText(null);
      setPronunciationCorrect(null);
      setListening(false);
      setLevelCompleted(false);
      setCompletedItems(Array(readingData[1].length).fill(false));
      setCurrentProgress(0);
      setShowMotivational(false);
      setShowLevelComplete(false);
      return;
    }
    setCurrentLevel(newLevel);
    setCurrentIndex(0);
    setCurrentQuestion(0);
    setScore(0);
    setShowReward(false);
    setRecognizedText(null);
    setPronunciationCorrect(null);
    setListening(false);
    setLevelCompleted(false);
    setCompletedItems(Array(currentData.length).fill(false));
    setCurrentProgress(0);
    setShowMotivational(false);
    setShowLevelComplete(false);
  };

  useEffect(() => {
    resetLevel(currentLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, completedItems, currentQuestion]);

  useEffect(() => {
    if (levelCompleted && !showMotivational) {
      setTimeout(() => setShowMotivational(true), 800);
    }
  }, [levelCompleted, showMotivational]);

  const handleNext = () => {
    if (currentIndex < data.length - 1 && completedItems[currentIndex]) {
      setCurrentIndex(ci => ci + 1);
      setCurrentQuestion(0);
      setRecognizedText(null);
      setPronunciationCorrect(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(ci => ci - 1);
      setCurrentQuestion(0);
      setRecognizedText(null);
      setPronunciationCorrect(null);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const item = currentItem as any;
    if (item.questions && item.questions[currentQuestion]) {
      const isCorrect = answerIndex === item.questions[currentQuestion].correct;
      if (isCorrect) {
        setScore(s => s + 1);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 1500);
      }
      if (currentQuestion < item.questions.length - 1) {
        setCurrentQuestion(q => q + 1);
      } else {
        markCompleted(currentIndex);
      }
    }
  };

  const markCompleted = (index: number) => {
    setCompletedItems(prev => {
      const copy = [...prev];
      if (!copy[index]) {
        copy[index] = true;
      }
      return copy;
    });

    // Verificar si el nivel está completado
    const allCompleted = data.every((_, i) => completedItems[i] || i === index);
    if (allCompleted) {
      setLevelCompleted(true);
    }
  };

  const handleNextLevel = () => {
    const nextLevel = currentLevel < MAX_LEVEL ? currentLevel + 1 : 1;
    resetLevel(nextLevel);
  };

  const handleRepeatLevel = () => {
    resetLevel(currentLevel);
  };

  // MICRÓFONO
  const startRecognition = (expectedText: string) => {
    setRecognizedText(null);
    setPronunciationCorrect(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    const rec = new SpeechRecognition();
    recognitionRef.current = rec;
    rec.lang = 'es-ES';
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 3;

    setListening(true);

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      setRecognizedText(transcript);

      const expectedNorm = normalize(expectedText);
      const gotNorm = normalize(transcript);

      let isComplete = true;
      if (currentLevel === 2) {
        const expectedWords = expectedNorm.split(' ');
        const gotWords = gotNorm.split(' ');
        isComplete = expectedWords.every(w => gotWords.includes(w)) && expectedWords.length === gotWords.length;
      }

      const dist = levenshtein(expectedNorm, gotNorm);
      const similarity = 1 - dist / Math.max(expectedNorm.length, gotNorm.length, 1);
      const threshold = currentLevel === 2 ? 0.75 : 0.60;
      const ok = isComplete && (similarity >= threshold || expectedNorm === gotNorm);

      setPronunciationCorrect(ok);

      if (ok) {
        setScore(s => s + 1);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 1500);
        markCompleted(currentIndex);
      }

      const feedback = ok ? '¡Perfecto!' : 'Intenta de nuevo.';
      speakText(feedback, { voiceType: 'child' });
    };

    rec.onerror = () => {
      setListening(false);
      setPronunciationCorrect(false);
      speakText('Error. Intenta de nuevo.', { voiceType: 'child' });
    };

    rec.onend = () => setListening(false);
    rec.start();
  };

  // RENDER LEVEL 1
  const renderLevel1 = () => {
    const item = currentItem as any;
    return (
      <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Card className="bg-white/90 backdrop-blur-sm h-full">
            <CardContent className="p-8 text-center">
              <div className="text-8xl mb-6">{item.image}</div>
              <div className="text-4xl font-bold text-black mb-4">{item.word}</div>
              <div className="text-lg text-black mb-4">{item.pronunciation}</div>
              <div className="flex justify-center gap-3">
                <ButtonWithAudio 
                  onClick={() => speakText(item.word, { voiceType: 'child' })} 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  audioText="Escuchar"
                  playOnHover={true}
                  playOnClick={false}
                >
                  <Volume2 className="w-4 h-4 mr-2" /> Escuchar
                </ButtonWithAudio>
                <ButtonWithAudio 
                  onClick={() => startRecognition(item.word)} 
                  variant="outline" 
                  className="text-black border-black hover:bg-gray-100"
                  audioText="Ahora dilo tú"
                  playOnHover={true}
                  playOnClick={false}
                >
                  Ahora dilo tú
                </ButtonWithAudio>
              </div>
              {listening && <div className="mt-4 text-sm text-black animate-pulse">Escuchando…</div>}
              {recognizedText !== null && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-sm text-black">Dijiste: <strong>{recognizedText}</strong></div>
                  <div className={`mt-1 font-bold ${pronunciationCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {pronunciationCorrect ? '¡Excelente!' : 'Intenta otra vez'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/90 backdrop-blur-sm h-full">
            <CardContent className="p-8">
              <h3 className="text-xl mb-4 text-center text-black font-semibold">Significado:</h3>
              <p className="text-lg text-black text-center leading-relaxed">{item.meaning}</p>
              <div className="mt-6 text-center">
                <ButtonWithAudio 
                  onClick={() => speakText(item.meaning, { voiceType: 'child' })} 
                  variant="outline" 
                  className="text-black border-black hover:bg-gray-100"
                  audioText="Escuchar"
                  playOnHover={true}
                  playOnClick={false}
                >
                  <Volume2 className="w-4 h-4 mr-2" /> Escuchar
                </ButtonWithAudio>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  // RENDER LEVEL 2
  const renderLevel2 = () => {
    const item = currentItem as any;
    return (
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Card className="bg-white/90 backdrop-blur-sm mb-8">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6">{item.image}</div>
              <div className="text-3xl mb-6 text-black font-bold">{item.sentence}</div>
              <div className="flex justify-center gap-3 mb-4">
                <ButtonWithAudio 
                  onClick={() => speakText(item.sentence, { voiceType: 'child' })} 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  audioText="Escuchar"
                  playOnHover={true}
                  playOnClick={false}
                >
                  <Volume2 className="w-4 h-4 mr-2" /> Escuchar
                </ButtonWithAudio>
                <ButtonWithAudio 
                  onClick={() => startRecognition(item.sentence)} 
                  variant="outline" 
                  className="text-black border-black hover:bg-gray-100"
                  audioText="Di toda la frase"
                  playOnHover={true}
                  playOnClick={false}
                >
                  Di toda la frase
                </ButtonWithAudio>
              </div>
              {listening && <div className="mt-4 text-sm text-black animate-pulse">Escuchando toda la frase…</div>}
              {recognizedText !== null && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-black">Reconocido: <strong>{recognizedText}</strong></div>
                  <div className={`mt-1 font-bold ${pronunciationCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {pronunciationCorrect ? '¡Perfecto!' : 'Di toda la frase'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  // RENDER LEVEL 3
  const renderLevel3 = () => {
    const item = currentItem as any;
    return (
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Card className="bg-white/90 backdrop-blur-sm mb-8">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6">{item.image}</div>
              <div className="text-xl mb-6 text-black leading-relaxed">{item.story}</div>
              <ButtonWithAudio 
                onClick={() => speakText(item.story, { voiceType: 'child' })} 
                className="bg-green-500 hover:bg-green-600 text-white"
                audioText="Escuchar historia"
                playOnHover={true}
                playOnClick={false}
              >
                <Volume2 className="w-4 h-4 mr-2" /> Escuchar historia
              </ButtonWithAudio>
            </CardContent>
          </Card>
        </motion.div>
        {item.questions && currentQuestion < item.questions.length && (
          <motion.div key={currentQuestion} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-xl mb-6 text-center text-black font-semibold">{item.questions[currentQuestion].q}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {item.questions[currentQuestion].options.map((option: string, index: number) => (
                    <ButtonWithAudio 
                      key={index} 
                      onClick={() => handleAnswer(index)} 
                      variant="outline" 
                      className="p-4 h-auto text-center text-black border-black hover:bg-gray-100"
                      audioText={option}
                      playOnHover={true}
                      playOnClick={false}
                    >
                      {option}
                    </ButtonWithAudio>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    );
  };

  if (!gameStarted) {
    return (
      <LevelLock level={currentLevel} isLocked={locked} onLoginRequired={onBack}>
        <StartScreenPrimeraPalabra onStart={() => setGameStarted(true)} onBack={onBack} />
      </LevelLock>
    );
  }

  if (!data || !currentItem) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl text-red-600 mb-4">Error: Nivel no encontrado</h2>
            <ButtonWithAudio 
              onClick={() => resetLevel(1)}
              audioText="Volver al Nivel 1"
              playOnHover={true}
              playOnClick={true}
            >
              Volver al Nivel 1
            </ButtonWithAudio>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <LevelLock level={currentLevel} isLocked={locked} onLoginRequired={onBack}>
      <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #E6F3FF 0%, #B3E5FC 100%)' }}>
        {/* RECOMPENSAS */}
        <RewardAnimation type="star" show={showReward} />
        <ConfettiExplosion show={showLevelComplete} />

      {/* HEADER */}
      <GameHeader
        title={`Mi Primera Palabra`}
        level={currentLevel}
        score={score}
        onBack={onBack}
        onRestart={() => resetLevel(currentLevel)}
      />

      {/* PROGRESO */}
      <ProgressBar
        current={currentIndex + 1}
        total={data.length}
        progress={currentProgress}
        className="mb-8"
      />

      {/* GUÍA */}
      <div className="max-w-6xl mx-auto mb-8">
        <AnimalGuide
          animal="owl"
          message={
            currentLevel === 1
              ? 'Escucha y repite la palabra.'
              : currentLevel === 2
                ? 'Di toda la frase completa.'
                : 'Responde las preguntas.'
          }
        />
      </div>

      {/* CONTENIDO */}
      <div className="mb-8">
        {currentLevel === 1 && renderLevel1()}
        {currentLevel === 2 && renderLevel2()}
        {currentLevel === 3 && renderLevel3()}
      </div>

      {/* NAVEGACIÓN - CORREGIDA */}
      <div className="flex justify-center gap-4">
        <ButtonWithAudio
          onClick={handlePrevious} 
          disabled={currentIndex === 0} 
          variant="outline" 
          className="bg-white/80 text-black border-black hover:bg-gray-100"
          audioText="Anterior"
          playOnHover={true}
          playOnClick={true}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
        </ButtonWithAudio>

        <ButtonWithAudio
          onClick={handleNext} 
          disabled={!completedItems[currentIndex]}
          className={`text-white transition-all ${
            completedItems[currentIndex] 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          audioText={completedItems[currentIndex] ? '¡Siguiente!' : 'Di la palabra'}
          playOnHover={true}
          playOnClick={true}
        >
          {completedItems[currentIndex] ? '¡Siguiente!' : 'Di la palabra'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </ButtonWithAudio>
      </div>

      {/* MOTIVACIONAL */}
      {showMotivational && (
        <MotivationalMessage
          score={score}
          total={currentLevel === 3 ? data.length * 2 : data.length}
          customMessage="¡Eres un lector increíble!"
          customSubtitle="¡Completaste todo el nivel!"
          celebrationText="¡Eres genial!"
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
          total={currentLevel === 3 ? data.length * 2 : data.length}
          level={currentLevel}
          isLastLevel={currentLevel >= 3}
          onNextLevel={handleNextLevel}
          onRestart={handleRepeatLevel}
          onExit={onBack}
        />
      )}
      </div>
    </LevelLock>
  );
}