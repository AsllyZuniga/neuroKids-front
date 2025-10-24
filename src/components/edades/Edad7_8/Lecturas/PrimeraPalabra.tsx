import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, ChevronLeft, ChevronRight, Star, BookOpen } from 'lucide-react';
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from "../../../others/RewardAnimation";

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
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
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
  const MAX_LEVEL = 3;
  const MIN_SCORE_LEVEL_3 = 10; // 80% de 12 preguntas (6 historias * 2 preguntas)
  const [currentLevel, setCurrentLevel] = useState<number>(Math.min(Math.max(level, 1), MAX_LEVEL));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [completedItems, setCompletedItems] = useState<boolean[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [listening, setListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [pronunciationCorrect, setPronunciationCorrect] = useState<boolean | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);

  const recognitionRef = useRef<any>(null);

  const data = readingData[currentLevel] ?? readingData[1];
  const currentItem = data[currentIndex];

  // Calcular progreso
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

  // Función para reiniciar estados al cambiar de nivel
  const resetLevel = (newLevel: number) => {
    const currentData = readingData[newLevel];
    if (!currentData) {
      console.error(`No se encontraron datos para el nivel ${newLevel}. Volviendo al nivel 1.`);
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
      return;
    }
    console.log(`Cambiando al nivel ${newLevel}, datos:`, currentData);
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
  };

  useEffect(() => {
    resetLevel(currentLevel);
  }, []);

  useEffect(() => {
    updateProgress();
  }, [currentIndex, completedItems, currentQuestion]);

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85;
      speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (currentIndex < data.length - 1) {
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
      if (answerIndex === item.questions[currentQuestion].correct) {
        setScore(s => s + 1);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 1400);
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
      copy[index] = true;
      return copy;
    });
  };

  useEffect(() => {
    if (completedItems.length === 0) return;
    const allItemsCompleted = completedItems.every(Boolean);
    if (allItemsCompleted) {
      if (currentLevel === 3) {
        // Nivel 3: Requiere 80% de respuestas correctas (10/12)
        const totalQuestions = data.length * 2; // 6 historias * 2 preguntas = 12
        setLevelCompleted(score >= MIN_SCORE_LEVEL_3);
      } else {
        // Niveles 1 y 2: Completar todos los ítems
        setLevelCompleted(allItemsCompleted);
      }
    }
  }, [completedItems, score, currentLevel]);

  const handleNextLevel = () => {
    console.log(`Intentando avanzar al nivel ${currentLevel + 1}`);
    const nextLevel = currentLevel < MAX_LEVEL ? currentLevel + 1 : 1;
    resetLevel(nextLevel);
  };

  const handleRepeatLevel = () => {
    resetLevel(currentLevel);
  };

  const startRecognition = (expectedText: string) => {
    setRecognizedText(null);
    setPronunciationCorrect(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Tu navegador no soporta reconocimiento de voz.');
      return;
    }
    try {
      const rec = new SpeechRecognition();
      recognitionRef.current = rec;
      rec.lang = 'es-CO';
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      rec.continuous = false;
      rec.onstart = () => setListening(true);
      rec.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join(' ')
          .trim();
        setRecognizedText(transcript);
        const expectedNorm = normalize(expectedText);
        const gotNorm = normalize(transcript);

        let isComplete = true;
        if (currentLevel === 2) {
          const expectedWords = expectedNorm.split(' ');
          const gotWords = gotNorm.split(' ');
          isComplete = expectedWords.every(word => gotWords.includes(word)) && expectedWords.length === gotWords.length;
        }

        const dist = levenshtein(expectedNorm, gotNorm);
        const maxLen = Math.max(expectedNorm.length, gotNorm.length, 1);
        const similarity = 1 - dist / maxLen;
        const similarityThreshold = currentLevel === 2 ? 0.75 : 0.60;
        const ok = isComplete && (similarity >= similarityThreshold || expectedNorm === gotNorm);
        setPronunciationCorrect(ok);
        if (ok) {
          setShowReward(true);
          setTimeout(() => setShowReward(false), 1500);
          markCompleted(currentIndex);
        }
        if ('speechSynthesis' in window) {
          const feed = ok
            ? `¡Muy bien! Dijiste: ${transcript}`
            : isComplete
              ? `Intenta de nuevo. Escuché: ${transcript}`
              : `¡Falta algo! Di toda la frase: ${expectedText}`;
          handleSpeak(feed);
        }
      };
      rec.onerror = (e: any) => {
        console.error('Speech recognition error', e);
        setListening(false);
        setRecognizedText(null);
        setPronunciationCorrect(false);
        if ('speechSynthesis' in window) {
          handleSpeak('Error al reconocer la voz. Verifica tu micrófono e intenta de nuevo.');
        }
      };
      rec.onend = () => setListening(false);
      rec.start();
    } catch (err) {
      console.error('No se pudo iniciar reconocimiento', err);
      alert('Error al iniciar reconocimiento de voz. Verifica tu micrófono y permisos.');
      setListening(false);
    }
  };

  const stopRecognition = () => {
    try {
      const rec = recognitionRef.current;
      if (rec && typeof rec.stop === 'function') rec.stop();
    } catch (e) { }
    setListening(false);
  };

  const renderLevel1 = () => {
    const item = currentItem as any;
    return (
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
          <Card className="bg-white/90 backdrop-blur-sm h-full">
            <CardContent className="p-8 text-center">
              <div className="text-8xl mb-6">{item.image}</div>
              <div className="text-4xl font-bold text-blue-600 mb-4 dyslexia-friendly">{item.word}</div>
              <div className="text-lg text-gray-600 mb-4">{item.pronunciation}</div>
              <div className="flex justify-center gap-3">
                <Button onClick={() => handleSpeak(item.word)} className="bg-green-500 hover:bg-green-600">
                  <Volume2 className="w-4 h-4 mr-2" /> Escuchar
                </Button>
                <Button onClick={() => startRecognition(item.word)} variant="outline" className='text-black bg-gray-100'>
                  🎤 Ahora dilo tú
                </Button>
              </div>
              {listening && <div className="mt-4 text-sm text-gray-600">Escuchando… habla ahora</div>}
              {recognizedText !== null && (
                <div className="mt-4">
                  <div className="text-sm">Has dicho: <strong>{recognizedText}</strong></div>
                  <div className={`mt-2 font-semibold ${pronunciationCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {pronunciationCorrect ? '¡Buen trabajo!' : 'Intenta nuevamente'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.45, delay: 0.1 }}>
          <Card className="bg-white/90 backdrop-blur-sm h-full">
            <CardContent className="p-8">
              <h3 className="text-xl mb-4 text-center text-gray-700">Significado:</h3>
              <p className="text-lg text-gray-600 text-center leading-relaxed">{item.meaning}</p>
              <div className="mt-6 text-center flex justify-center gap-3">
                <Button onClick={() => handleSpeak(item.meaning)} variant="outline" className='text-black'>
                  <Volume2 className="w-4 h-4 mr-2" /> Escuchar explicación
                </Button>
                <Button onClick={() => markCompleted(currentIndex)} variant="ghost">

                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  const renderLevel2 = () => {
    const item = currentItem as any;
    return (
      <div className="max-w-8xl mx-auto">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
          <Card className="bg-white/90 backdrop-blur-sm mb-8">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6">{item.image}</div>
              <div className="text-3xl mb-6 text-blue-600 dyslexia-friendly">{item.sentence}</div>
              <div className="flex justify-center gap-3 mb-4">
                <Button onClick={() => handleSpeak(item.sentence)} className="bg-green-500 hover:bg-green-600">
                  <Volume2 className="w-4 h-4 mr-2" /> Escuchar
                </Button>
                <Button onClick={() => startRecognition(item.sentence)} variant="outline">
                  🎤 Dilo tú (toda la frase)
                </Button>
              </div>
              {listening && <div className="mt-4 text-sm text-gray-600">Escuchando… di toda la frase</div>}
              {recognizedText !== null && (
                <div className="mt-4">
                  <div>Reconocido: <strong>{recognizedText}</strong></div>
                  <div className={`mt-2 font-semibold ${pronunciationCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {pronunciationCorrect ? '¡Perfecto!' : 'Intenta decir toda la frase'}
                  </div>
                </div>
              )}
              <div className="mt-4">
                <Button onClick={() => markCompleted(currentIndex)} variant="ghost"></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  const renderLevel3 = () => {
    const item = currentItem as any;
    return (
      <div className="max-w-8xl mx-auto">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
          <Card className="bg-white/90 backdrop-blur-sm mb-8">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6">{item.image}</div>
              <div className="text-xl mb-6 text-gray-700 leading-relaxed dyslexia-friendly">{item.story}</div>
              <Button onClick={() => handleSpeak(item.story)} className="bg-green-500 hover:bg-green-600">
                <Volume2 className="w-4 h-4 mr-2" /> Escuchar historia
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        {item.questions && currentQuestion < item.questions.length && (
          <motion.div key={currentQuestion} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-xl mb-6 text-center text-gray-700">{item.questions[currentQuestion].q}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {item.questions[currentQuestion].options.map((option: string, index: number) => (
                    <Button key={index} onClick={() => handleAnswer(index)} variant="outline" className="p-4 h-auto text-center hover:bg-blue-50">
                      {option}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        <div className="mt-4 text-center">
          <Button onClick={() => markCompleted(currentIndex)} variant="ghost"></Button>
        </div>
      </div>
    );
  };

  if (!data || !currentItem) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center text-center">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl text-red-600">Error: No se encontraron datos para el nivel {currentLevel}</h2>
            <Button onClick={() => resetLevel(1)} className="mt-4">Volver al Nivel 1</Button>
            <Button onClick={onBack} variant="outline" className="mt-4 ml-2">Salir</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: 'linear-gradient(135deg, #E6F3FF 0%, #B3E5FC 100%)'
      }}
    >
      <RewardAnimation type="star" show={showReward} />


      {levelCompleted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
        >
          <Card className="bg-white rounded-2xl shadow-2xl p-8 w-11/12 max-w-md text-center">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-6xl mb-3">🎉</div>
                {currentLevel === 3 && score < MIN_SCORE_LEVEL_3 ? (
                  <>
                    <h2 className="text-2xl font-bold mb-2 text-red-600">¡No alcanzaste el puntaje!</h2>
                    <p className="text-gray-600 mb-6">
                      Puntos: {score} de {data.length * 2}. Necesitas al menos {MIN_SCORE_LEVEL_3} para pasar.
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button onClick={handleRepeatLevel} className="bg-blue-500 hover:bg-blue-600">
                        Repetir Nivel 3
                      </Button>
                      <Button onClick={onBack} variant="outline">
                        Salir
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2">¡Nivel {currentLevel} completado!</h2>
                    <p className="text-gray-600 mb-6">
                      Puntos: {score} de {currentLevel === 3 ? data.length * 2 : data.length}
                    </p>
                    <div className="flex justify-center gap-3">
                      {currentLevel < MAX_LEVEL ? (
                        <Button
                          onClick={handleNextLevel}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Siguiente nivel ({currentLevel + 1})
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNextLevel}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Volver al inicio
                        </Button>
                      )}
                      <Button onClick={handleRepeatLevel} variant="outline">
                        Repetir nivel
                      </Button>
                      <Button onClick={onBack} variant="outline">
                        Salir
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}


      <div className="flex items-center justify-between mb-6">
        <Button onClick={onBack} variant="outline" className="bg-black/80 backdrop-blur-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>
        <div className="text-center">
          <h1 className="text-2xl text-blue-800 mb-2 dyslexia-friendly">📖 Mi Primera Palabra - Nivel {currentLevel}</h1>
          <div className="flex items-center gap-2 text-blue-700 justify-center">
            <BookOpen className="w-4 h-4" />
            <span>{currentIndex + 1} de {data.length}</span>
            <Star className="w-4 h-4 text-yellow-500 fill-current ml-2" />
            <span>Puntos: {score}</span>
          </div>
        </div>
        <div className="w-24"></div>
      </div>


      <div className="max-w-md mx-auto mb-10">
        <div className="h-4 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentProgress > 100 ? 100 : currentProgress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-yellow-400 to-green-500 rounded-full"
          />
        </div>
        <div className="text-center text-gray-600 mt-2">
          Progreso: {currentProgress.toFixed(1)}%
        </div>
      </div>


      <div className="max-w-6xl mx-auto mb-8">
        <AnimalGuide
          animal="owl"
          message={
            currentLevel === 1
              ? 'Aprende esta palabra nueva. Escucha y repite.'
              : currentLevel === 2
                ? 'Di toda la frase completa de una vez.'
                : 'Escucha la historia y responde las preguntas.'
          }
        />
      </div>


      <div className="mb-8">
        {currentLevel === 1 && renderLevel1()}
        {currentLevel === 2 && renderLevel2()}
        {currentLevel === 3 && renderLevel3()}
      </div>


      <div className="flex justify-center gap-4">
        <Button onClick={handlePrevious} disabled={currentIndex === 0} variant="outline" className="bg-white/80 backdrop-blur-sm">
          <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
        </Button>
        <Button onClick={handleNext} disabled={currentIndex === data.length - 1} className="bg-blue-500 hover:bg-blue-600">
          Siguiente
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}