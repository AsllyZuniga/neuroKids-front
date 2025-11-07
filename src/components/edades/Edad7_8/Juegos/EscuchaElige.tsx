import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
// import { Button } from "../../../ui/button"; // Reemplazado por ButtonWithAudio
import { ButtonWithAudio } from "../../../ui/ButtonWithAudio";
import { Card, CardContent } from "../../../ui/card";
import { AnimalGuide } from '../../../others/AnimalGuide';
import { GameHeader } from "../../../others/GameHeader";
import { ProgressBar } from "../../../others/ProgressBar";
import { RewardAnimation } from "../../../others/RewardAnimation";
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { LevelLock } from "../../../others/LevelLock";
import { StartScreenEscuchaElige } from "../IniciosJuegosLecturas/StartScreenEscuchaElige";
import { speakText, canSpeakOnHover } from "../../../../utils/textToSpeech";
import { useLevelLock } from "../../../../hooks/useLevelLock";

import gatoAudio from "../../../../assets/sounds/gato_escuchaElige.mp3";
import perroAudio from "../../../../assets/sounds/perro_escuchaElige.mp3";
import vacaAudio from "../../../../assets/sounds/vaca_escuchaElige.mp3";
import aguaAudio from "../../../../assets/sounds/agua_escuchaElige.mp3";
import loboAudio from "../../../../assets/sounds/lobo_escuchaElige.mp3";
import cerdoAudio from "../../../../assets/sounds/cerdo_escuchaElige.mp3";
import galloAudio from "../../../../assets/sounds/gallo_escuchaElige.mp3";
import campanaAudio from "../../../../assets/sounds/campana_escuchaElige.mp3";
import telefonoAudio from "../../../../assets/sounds/telefono_escuchaElige.mp3";
import relojAudio from "../../../../assets/sounds/reloj_escuchaElige.mp3";
import ambulanciaAudio from "../../../../assets/sounds/ambulancia_escuchaElige.mp3";
import platoAudio from "../../../../assets/sounds/plato_escuchaElige.mp3";
import silencioAudio from "../../../../assets/sounds/silencio_escuchaElige.mp3";
import abejaAudio from "../../../../assets/sounds/abeja_escuchaElige.mp3";
import trenAudio from "../../../../assets/sounds/tren_escuchaElige.mp3";

interface EscuchaEligeProps {
  onBack: () => void;
  level: number;
  onNextLevel?: () => void;
}

interface Question {
  id: number;
  audio: string;
  options: string[];
  correct: number;
  soundLabel?: string;
}

const levelQuestions: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      audio: gatoAudio,
      options: ["🐶 Perro", "🐱 Gato", "🐮 Vaca", "🐷 Cerdo"],
      correct: 1,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 2,
      audio: perroAudio,
      options: ["🐱 Gato", "🐶 Perro", "🐺 Lobo", "🐴 Caballo"],
      correct: 1,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 3,
      audio: vacaAudio,
      options: ["🐷 Cerdo", "🐴 Caballo", "🐮 Vaca", "🐑 Oveja"],
      correct: 2,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 4, //corregir
      audio: aguaAudio,
      options: ["🚿 Ducha", "🚪 Puerta", "🧼 Jabón", "🚽 Inodoro"],
      correct: 0,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 5,
      audio: loboAudio,
      options: ["🐺 Lobo", "🦁 León", "🐻 Oso", "🦊 Zorro"],
      correct: 0,
      soundLabel: "Reproducir sonido"
    },
  ],

  2: [
    {
      id: 1,
      audio: cerdoAudio,
      options: ["🐮 Vaca", "🐑 Oveja", "🐷 Cerdo", "🐔 Gallina"],
      correct: 2,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 2,
      audio: galloAudio,
      options: ["🦆 Pato", "🦉 Búho", "🐓 Gallo", "🐦 Pájaro"],
      correct: 2,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 3,
      audio: campanaAudio,
      options: ["🔔 Campana", "📯 Corneta", "🎶 Radio", "📢 Megáfono"],
      correct: 0,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 4,
      audio: telefonoAudio,
      options: ["📺 Televisor", "📱 Celular", "🔔 Timbre", "☎️ Teléfono"],
      correct: 3,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 5,
      audio: relojAudio,
      options: ["⏰ Reloj", "🎞️ Camára", "📻 Radio", "🔔 Campanilla"],
      correct: 0,
      soundLabel: "Reproducir sonido"
    },
  ],

  3: [
    {
      id: 1,
      audio: ambulanciaAudio,
      options: ["🚓 Policía", "🚒 Ambulancia", "🚒 Bomberos", "🚚 Camión"],
      correct: 1,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 2, // corregir
      audio: platoAudio,
      options: ["🍽 Plato", "🥄 Cuchara", "🥛 Vaso", "🍴 Tenedor"],
      correct: 0,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 3,
      audio: silencioAudio,
      options: ["😄 Risa", "🤫 Silencio", "🗣 Conversación", "👏 Aplauso"],
      correct: 1,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 4,
      audio: abejaAudio,
      options: ["🐝 Abeja", "🦋 Mariposa", "🐞 Mariquita", "🦗 Grillo"],
      correct: 0,
      soundLabel: "Reproducir sonido"
    },
    {
      id: 5,
      audio: trenAudio,
      options: ["🚂 Tren", "🚗 Coche", "✈️ Avión", "🚌 Autobús"],
      correct: 0,
      soundLabel: "Reproducir sonido"
    },
  ],
};

export function EscuchaElige({ onBack, level: initialLevel, onNextLevel }: EscuchaEligeProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [localLevel, setLocalLevel] = useState(initialLevel);
  const isLevelLocked = useLevelLock(localLevel);
  const questions = levelQuestions[localLevel] || levelQuestions[1];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const currentQ = questions[currentQuestion];
  const totalQuestions = questions.length;
  const baseProgress = (currentQuestion / totalQuestions) * 100;
  const incrementPerCorrect = 100 / totalQuestions;

  // Reinicia estado del juego (estable: no depende de audio para evitar reinicios inesperados)
  const restartGame = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setGameComplete(false);
    setShowReward(false);
    setIsPlaying(false);
    setCorrectAnswers(0);
    setCurrentProgress(0);
    setShowMotivational(false);
    setShowLevelComplete(false);
  }, []);

  useEffect(() => {
    // Solo reinicia cuando cambia el nivel
    restartGame();
  }, [localLevel, restartGame]);

  useEffect(() => {
    if (currentQ.audio) {
      const audioElement = new Audio(currentQ.audio);
      audioRef.current = audioElement;
      return () => {
        audioElement.pause();
        audioElement.currentTime = 0;
        if (audioRef.current === audioElement) {
          audioRef.current = null;
        }
      };
    }
  }, [currentQ.audio]);

  const playAudio = () => {
    const audio = audioRef.current;
    if (audio && !isPlaying) {
      setIsPlaying(true);
      audio.play().then(() => {
        audio.onended = () => setIsPlaying(false);
      }).catch((error) => {
        console.error('Error al reproducir el audio:', error);
        setIsPlaying(false);
      });
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);



    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }

    const isCorrect = index === currentQ.correct;
    if (isCorrect) {
      setScore(score + 20);
      setCorrectAnswers(correctAnswers + 1);
      setShowReward(true);
      const newProgress = baseProgress + (correctAnswers + 1) * incrementPerCorrect;
      setCurrentProgress(Math.min(newProgress, baseProgress + (100 / totalQuestions)));
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowReward(false);
        setCurrentProgress(((currentQuestion + 1) / totalQuestions) * 100);
      } else {
        setGameComplete(true);
        setShowReward(true);

        setTimeout(() => {
          setShowReward(false);
          setShowMotivational(true);
        }, 1500);

        setTimeout(() => {
          setShowMotivational(false);
          setShowLevelComplete(true);
        }, 4500);
      }
    }, 2000);
  };

  // (restartGame ya definido con useCallback arriba)

  const handleNextLevel = () => {
    restartGame();
    if (localLevel < 3) {
      setLocalLevel(localLevel + 1);
    }
    if (onNextLevel) onNextLevel();
    setShowLevelComplete(false);
  };

  if (!gameStarted) {
    return (
      <LevelLock level={localLevel} isLocked={isLevelLocked}>
        <StartScreenEscuchaElige onStart={() => setGameStarted(true)} onBack={onBack} />
      </LevelLock>
    );
  }

  return (
    <LevelLock level={localLevel} isLocked={isLevelLocked}>
    <div
      className="min-h-screen p-6"
      style={{
        background: 'linear-gradient(135deg, #f79facff 0%, #87CEEB 100%)'
      }}
    >
      <RewardAnimation type="star" show={showReward} />

      {/* HEADER */}
      <GameHeader
        title="Escucha y Elige"
        level={localLevel}
        score={score}
        onBack={onBack}
        onRestart={restartGame}
      />

      {/* PROGRESS BAR */}
      <ProgressBar
        current={currentQuestion + 1}
        total={totalQuestions}
        progress={currentProgress}
        className="mb-6"
      />

      {/* ANIMAL GUIDE */}
      <div className="max-w-2xl mx-auto mb-8">
        <AnimalGuide
          animal="owl"
          message="¡Escucha atentamente el sonido y elige la respuesta correcta!"
        />
      </div>

      {/* JUEGO */}
      {!gameComplete && !showMotivational && !showLevelComplete && (
        <motion.div
          key={currentQuestion}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto"
        >
          {/* BOTÓN DE SONIDO */}
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 flex items-center justify-center">
            <CardContent className="p-6">
              <ButtonWithAudio
                onClick={playAudio}
                playOnClick
                playOnHover
                disabled={isPlaying}
                audioText={currentQ.soundLabel}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-10 py-6 w-full"
              >
                <Volume2 className="w-8 h-8 mr-3" />
                {isPlaying ? "Reproduciendo..." : currentQ.soundLabel}
              </ButtonWithAudio>
            </CardContent>
          </Card>

          {/* OPCIONES */}
          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all border-2 p-4 text-lg font-medium
                  ${selectedAnswer === null
                      ? 'bg-white hover:bg-orange-50 border-gray-200 hover:border-orange-300 text-black'
                      : selectedAnswer === index
                        ? index === currentQ.correct
                          ? 'bg-green-100 border-green-500 shadow-lg text-black'
                          : 'bg-red-100 border-red-500 text-black'
                        : index === currentQ.correct
                          ? 'bg-green-100 border-green-500 shadow-lg text-black'
                          : 'bg-gray-100 border-gray-300 text-black'
                    }`}
                  onClick={() => handleAnswerSelect(index)}
                  onMouseEnter={() => { if (canSpeakOnHover()) speakText(option.replace(/^[^\p{L}\p{N}]+/u, ''), { voiceType: 'child' }); }}
                  onFocus={() => { if (canSpeakOnHover()) speakText(option.replace(/^[^\p{L}\p{N}]+/u, ''), { voiceType: 'child' }); }}
                >
                  <CardContent className="p-0">
                    {option}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* MENSAJE MOTIVACIONAL */}
      {showMotivational && (
        <MotivationalMessage
          score={correctAnswers}
          total={totalQuestions}
          customMessage="¡Excelente oído! ¡Eres un genio del sonido!"
          customSubtitle="Escuchaste y elegiste con precisión"
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
          total={totalQuestions}
          level={localLevel}
          isLastLevel={localLevel >= 3}
          onNextLevel={handleNextLevel}
          onRestart={restartGame}
          onExit={onBack}
        />
      )}
    </div>
    </LevelLock>
  );
}
