import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import { Card, CardContent } from "@/components/ui/card";
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from "@/components/others/RewardAnimation";
import { GameHeader } from "@/components/others/GameHeader";
import { ProgressBar } from "@/components/others/ProgressBar";
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { ConfettiExplosion } from '../../../others/ConfettiExplosion';
import { StartScreenPrimeraPalabra } from "../IniciosJuegosLecturas/StartScreenPrimeraPalabra";
import { LevelLock } from "@/components/others/LevelLock";
import { useLevelLock } from "@/hooks/useLevelLock";
import { speakText } from "@/utils/textToSpeech";
import sol from "@/assets/7_8/primerapalabra/sol.svg"
import mar from "@/assets/7_8/primerapalabra/mar.svg"
import vela from "@/assets/7_8/primerapalabra/vela.svg"
import flor from "@/assets/7_8/primerapalabra/flor.svg"
import niña from "@/assets/7_8/primerapalabra/LaNiñaCanta.svg"
import perro from "@/assets/7_8/primerapalabra/ElPerroDuerme.svg"
import gato from "@/assets/7_8/primerapalabra/ElGatoCorre.svg"
import niño from "@/assets/7_8/primerapalabra/ElNiñoLee.svg"
import vaca from "@/assets/7_8/primerapalabra/LaVacaCome.svg"
import arbol from "@/assets/7_8/primerapalabra/ElArbolCrece.svg"
import tren from "@/assets/7_8/primerapalabra/ElTrenAvanza.svg"
import pirata from "@/assets/7_8/primerapalabra/pirata3.svg"
import granjero from "@/assets/7_8/primerapalabra/granjero.svg"
import astronauta from "@/assets/7_8/primerapalabra/astronauta.svg"
import maestra from "@/assets/7_8/primerapalabra/maestra.svg"


interface PrimeraPalabraProps {
  onBack: () => void;
  level?: number;
}

const readingData: Record<number, any[]> = {
  1: [
    { word: 'SOL', image: sol, pronunciation: '/sol/', meaning: 'El sol es una estrella que nos da luz y calor.' },
    { word: 'MAR', image: mar, pronunciation: '/mar/', meaning: 'El mar es grande y tiene agua salada.' },
    { word: 'VELA', image: vela, pronunciation: '/vela/', meaning: 'La vela enciende todo el lugar con su luz.' },
    { word: 'FLOR', image: flor, pronunciation: '/flor/', meaning: 'La flor es bonita y huele muy bien.' }
  ],
  2: [
    {
      sentence: 'El gato corre',
      image: gato,
      words: ['El', 'gato', 'corre'],
    },
    {
      sentence: 'El perro duerme',
      image: perro,
      words: ['El', 'perro', 'duerme'],
    },
    {
      sentence: 'El niño lee',
      image: niño,
      words: ['El', 'niño', 'lee'],
    },
    {
      sentence: 'La vaca esta feliz',
      image: vaca,
      words: ['La', 'vaca', 'esta', 'feliz'],
    },
    {
      sentence: 'El árbol crece',
      image: arbol,
      words: ['El', 'árbol', 'crece'],

    },
    {
      sentence: 'El tren avanza',
      image: tren,
      words: ['El', 'tren', 'avanza'],

    },
  ],
  3: [
    {
      story: 'La niña canta una canción muy bonita en el jardín',
      image: niña,
      audio: true,
      questions: [
        { q: '¿Quién canta?', options: ['El niño', 'La niña', 'El gato'], correct: 1 },
        { q: '¿Dónde canta?', options: ['En la casa', 'En el jardín', 'En la escuela'], correct: 1 }
      ]
    },
    {
      story: 'El pirata busca un tesoro en la arena',
      image: pirata,
      audio: true,
      questions: [
        { q: '¿Quién busca?', options: ['El pirata', 'El niño', 'El pez'], correct: 0 },
        { q: '¿Qué busca?', options: ['Una pelota', 'Un tesoro', 'Una flor'], correct: 1 }
      ]
    },
    {
      story: 'El granjero cosecha las frutas del campo',
      image: granjero,
      audio: true,
      questions: [
        { q: '¿Quién cosecha?', options: ['El granjero', 'El pirata', 'El pez'], correct: 0 },
        { q: '¿Qué cosecha?', options: ['Las frutas', 'Las nubes', 'Las casas'], correct: 0 }
      ]
    },
    {
      story: 'El astronauta llegó a la luna',
      image: astronauta,
      audio: true,
      questions: [
        { q: '¿Quién llegó?', options: ['El astronauta', 'El gato', 'El pez'], correct: 0 },
        { q: '¿Dónde llegó?', options: ['A la nave', 'A la luna', 'A la casa'], correct: 1 }
      ]
    },
    {
      story: 'La maestra escribe letras grandes en la pizarra',
      image: maestra,
      audio: true,
      questions: [
        { q: '¿Quién escribe?', options: ['La maestra', 'El perro', 'El piloto'], correct: 0 },
        { q: '¿Dónde escribe?', options: ['En la cama', 'En la pizarra', 'En el río'], correct: 1 }
      ]
    },
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
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
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
    setShowQuestions(false);
  }, [currentIndex, currentLevel]);

  useEffect(() => {
    resetLevel(currentLevel);

  }, []);

  useEffect(() => {
    updateProgress();
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

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);

    const current = currentItem.questions[currentQuestion];

    if (index === current.correct) {
      setScore(prev => prev + 20);
    }

    setTimeout(() => {
      setSelectedOption(null);

      if (currentQuestion < currentItem.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setShowQuestions(false);
        markCompleted(currentIndex);
      }
    }, 900);
  };


  const markCompleted = (index: number) => {
    setCompletedItems(prev => {
      const copy = [...prev];
      if (!copy[index]) {
        copy[index] = true;
      }
      return copy;
    });


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

  //  LEVEL 1
  const renderLevel1 = () => {
    const item = currentItem as any;
    return (
      <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <Card className="bg-white/90 backdrop-blur-sm h-full">
            <CardContent className="p-8 text-center">

              <div className="text-8xl text-black mb-6">{item.word}</div>
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
                  playOnHover={false}
                  playOnClick={false}
                >
                  🎤 Ahora dilo tú
                </ButtonWithAudio>
              </div>
              {listening && <div className="mt-4 text-sm text-black animate-pulse">Escuchando…</div>}
              {recognizedText !== null && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-sm text-black">Dijiste: <strong>{recognizedText}</strong></div>
                  <div className={`mt-1 ${pronunciationCorrect ? 'text-green-600' : 'text-red-600'}`}>
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
              <img src={item.image} alt={item.word} className="w-40 h-40 mx-auto mb-6 object-contain" />
              <h3 className="text-xl mb-4 text-center text-black ">Significado:</h3>
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

  //LEVEL 2
  const renderLevel2 = () => {
    const item = currentItem as any;

    return (
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Card className="bg-white/90 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">

                {/* IMAGEN */}
                <div className="flex justify-center">
                  <img
                    src={item.image}
                    alt={item.word}
                    className="w-50 h-50 object-contain"
                  />
                </div>

                <div className="text-center bg-gradient-to-br from-blue-100 to-green-10 border-2 border-blue-500 rounded-2xl shadow-lg p-6">
                  <div className="text-3xl mb-6 text-black">
                    {item.sentence}
                  </div>

                  <div className="flex justify-center gap-3 mb-4">
                    <ButtonWithAudio
                      onClick={() => speakText(item.sentence, { voiceType: 'child' })}
                      className="bg-green-500 hover:bg-green-600 text-black"
                      audioText="Escuchar"
                      playOnHover={true}
                      playOnClick={false}
                    >
                      <Volume2 className="w-4 h-4 mr-2" /> Escuchar
                    </ButtonWithAudio>

                    <ButtonWithAudio
                      onClick={() => startRecognition(item.sentence)}
                      variant="outline"
                      className="text-black bg-blue-500 hover:bg-blue-600"
                      audioText="Di toda la frase"
                      playOnHover={false}
                      playOnClick={false}
                    >
                      🎤 Di toda la frase
                    </ButtonWithAudio>
                  </div>

                  {listening && (
                    <div className="mt-4 text-sm text-black animate-pulse">
                      Escuchando toda la frase…
                    </div>
                  )}

                  {recognizedText !== null && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-black">
                        Reconocido: <strong>{recognizedText}</strong>
                      </div>
                      <div className={`${pronunciationCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {pronunciationCorrect ? '¡Perfecto!' : 'Di toda la frase'}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };


  //  LEVEL 3
  const renderLevel3 = () => {
    const item = currentItem as any;

    return (
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Card className="bg-white/90 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">


                <div className="flex justify-center">
                  <img
                    src={item.image}
                    alt="imagen"
                    className="w-50 h-50 object-contain"
                  />
                </div>


                <div className="bg-white/80 border-2 border-purple-300 rounded-xl shadow-md p-6 text-center">

                  {!showQuestions && (
                    <>
                      <div className="text-xl mb-6 text-black leading-relaxed">
                        {item.story}
                      </div>

                      <div className="flex justify-center gap-4">
                        <ButtonWithAudio
                          onClick={() => speakText(item.story, { voiceType: 'child' })}
                          className="bg-green-500 hover:bg-green-600 text-white"
                          audioText="Escuchar historia"
                          playOnHover={true}
                          playOnClick={false}
                        >
                          <Volume2 className="w-4 h-4 mr-2" /> Escuchar
                        </ButtonWithAudio>

                        <ButtonWithAudio
                          onClick={() => setShowQuestions(true)}
                          variant="outline"
                          className="text-black border-black hover:bg-gray-100"
                          audioText="Preguntas"
                          playOnHover={true}
                          playOnClick={false}
                        >
                          📋 Preguntas
                        </ButtonWithAudio>
                      </div>
                    </>
                  )}

                  {showQuestions &&
                    item.questions &&
                    currentQuestion < item.questions.length && (
                      <>
                        <h3 className="text-xl mb-6 text-black">
                          {item.questions[currentQuestion].q}
                        </h3>

                        <div className="flex flex-col gap-4">
                          {item.questions[currentQuestion].options.map(
                            (option: string, index: number) => (
                              <ButtonWithAudio
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={selectedOption !== null}
                                variant="outline"
                                audioText={option}
                                playOnHover={true}
                                playOnClick={false}
                                className={`p-4 h-auto text-center border-2 transition-all
                                  ${selectedOption === index
                                    ? 'bg-purple-300 border-purple-500 scale-105'
                                    : 'text-black border-black hover:bg-gray-100'}
  `}
                              >
                                {option}
                              </ButtonWithAudio>

                            )
                          )}
                        </div>
                      </>
                    )}
                </div>

              </div>
            </CardContent>
          </Card>
        </motion.div>
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
      <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg,#B3E5FC 100%)' }}>
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
        <div>
          <AnimalGuide
            animal="bear"
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
            className={`text-white transition-all ${completedItems[currentIndex]
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-gray-400 cursor-not-allowed'
              }`}
            audioText={completedItems[currentIndex] ? '¡Siguiente!' : 'Di la palabra'}
            playOnHover={false}
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