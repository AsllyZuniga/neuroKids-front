
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Star, Trophy, ArrowRight } from 'lucide-react';
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { Progress } from '../../../ui/progress';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from "../../../others/RewardAnimation";

import gatoAudio from "../../../../assets/7_8/sounds/gato_escuchaElige.mp3";
import perroAudio from "../../../../assets/7_8/sounds/perro_escuchaElige.mp3";
import vacaAudio from "../../../../assets/7_8/sounds/vaca_escuchaElige.mp3";
import aguaAudio from "../../../../assets/7_8/sounds/agua_escuchaElige.mp3";
import loboAudio from "../../../../assets/7_8/sounds/lobo_escuchaElige.mp3";
import cerdoAudio from "../../../../assets/7_8/sounds/cerdo_escuchaElige.mp3";
import galloAudio from "../../../../assets/7_8/sounds/gallo_escuchaElige.mp3";
import campanaAudio from "../../../../assets/7_8/sounds/campana_escuchaElige.mp3";
import telefonoAudio from "../../../../assets/7_8/sounds/telefono_escuchaElige.mp3";
import relojAudio from "../../../../assets/7_8/sounds/reloj_escuchaElige.mp3";
import ambulanciaAudio from "../../../../assets/7_8/sounds/ambulancia_escuchaElige.mp3";
import platoAudio from "../../../../assets/7_8/sounds/plato_escuchaElige.mp3";
import silencioAudio from "../../../../assets/7_8/sounds/silencio_escuchaElige.mp3";
import abejaAudio from "../../../../assets/7_8/sounds/abeja_escuchaElige.mp3";
import trenAudio from "../../../../assets/7_8/sounds/tren_escuchaElige.mp3";



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
      id: 4,
      audio: aguaAudio,
      options: ["🚿 Ducha", "💧 Agua", "🧼 Jabón", "🚽 Inodoro"],
      correct: 1,
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
      options: ["⏰ Reloj", "⏲ Temporizador", "📻 Radio", "🔔 Campanilla"],
      correct: 1,
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
      id: 2,
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
  const [localLevel, setLocalLevel] = useState(initialLevel);
  const questions = levelQuestions[localLevel] || levelQuestions[1];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);

  const currentQ = questions[currentQuestion];
  const totalQuestions = questions.length;
  const baseProgress = (currentQuestion / totalQuestions) * 100;
  const incrementPerCorrect = 100 / totalQuestions;

  useEffect(() => {
    restartGame();
  }, [localLevel]);

  useEffect(() => {
    if (currentQ.audio) {
      const audioElement = new Audio(currentQ.audio);
      setAudio(audioElement);
      return () => {
        audioElement.pause();
        audioElement.currentTime = 0;
      };
    }
  }, [currentQuestion]);

  const playAudio = () => {
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
    setShowResult(true);


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
      // Actualizar progreso incremental
      const newProgress = baseProgress + (correctAnswers + 1) * incrementPerCorrect;
      setCurrentProgress(Math.min(newProgress, baseProgress + (100 / totalQuestions)));
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setShowReward(false);
        setCurrentProgress((currentQuestion + 1) / totalQuestions * 100);
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
    setShowReward(false);
    setIsPlaying(false);
    setCorrectAnswers(0);
    setCurrentProgress(0);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const handleNextLevel = () => {
    restartGame();
    if (localLevel < 3) {
      setLocalLevel(localLevel + 1);
    }
    if (onNextLevel) {
      onNextLevel();
    }
  };

  if (gameComplete) {
    const passed = correctAnswers >= 4;
    const isLastLevel = localLevel === 3;

    return (
      <div
        className="min-h-screen p-6"
        style={{
          background: 'linear-gradient(135deg, #f79facff 0%, #87CEEB 100%)'
        }}
      >
        <RewardAnimation type="star" show={showReward} />

        {/* Level Complete Message */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        >
          <Card className="bg-white/95 backdrop-blur-sm max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">{passed ? '🎉' : '😕'}</div>
              <h2 className="text-2xl mb-4 text-gray-800">
                {passed ? '¡Bien hecho!' : '¡Inténtalo de nuevo!'}
              </h2>
              <p className="text-gray-600 mb-4">
                {passed
                  ? isLastLevel
                    ? `¡Has completado todos los niveles con ${score} puntos!`
                    : `¡Has completado el nivel ${localLevel}!`
                  : 'Vuelve a intentar y pon atención a los sonidos. Necesitas al menos 4 respuestas correctas.'}
              </p>
              <div className="flex items-center justify-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-yellow-600">+{score} XP ganados</span>
              </div>
              <div className="flex flex-col gap-2">
                {passed && !isLastLevel && (
                  <Button
                    onClick={handleNextLevel}
                    className="bg-green-500 hover:bg-green-600 w-full"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Siguiente Nivel ({localLevel + 1})
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button onClick={restartGame} className="bg-purple-500 hover:bg-purple-600 flex-1">
                    Repetir Nivel
                  </Button>
                  <Button onClick={onBack} variant="outline" className="flex-1">
                    Salir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-yellow-200 via-orange-100 to-red-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" className="bg-black/80 backdrop-blur-sm border-2 hover:bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="text-center">
            <h1 className="text-3xl text-black">👂 Escucha y Elige — Nivel {localLevel}</h1>
            <div className="flex items-center gap-2 justify-center mt-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-black">Puntos: {score}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Pregunta {currentQuestion + 1} de {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-4 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress > 100 ? 100 : currentProgress}%` }}
              transition={{ duration: 0.3 }} // Animación suave
              className="h-full bg-gradient-to-r from-yellow-400 to-green-500 rounded-full"
            />
          </div>
          <div className="text-center text-gray-600 mt-2">
            Progreso: {currentProgress.toFixed(1)}%
          </div>
        </div>

        <div className="mb-8">
          <AnimalGuide animal="owl" message="¡Escucha atentamente y elige la respuesta correcta!" />
        </div>

        <motion.div key={currentQuestion} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 flex items-center justify-center">
            <CardContent className="p-6 flex items-center justify-center">
              <Button
                onClick={playAudio}
                disabled={isPlaying}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-10 py-6"
              >
                <Volume2 className="w-8 h-8 mr-3" />
                {isPlaying ? "Reproduciendo..." : currentQ.soundLabel}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <motion.div key={index} whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}>
                <Card
                  className={`cursor-pointer transition-all border-2 ${selectedAnswer === null
                      ? 'bg-white hover:bg-white border-gray-200 hover:border-orange-300 text-black'
                      : selectedAnswer === index
                        ? index === currentQ.correct
                          ? 'bg-green-100 border-green-400'
                          : 'bg-red-100 border-red-400'
                        : index === currentQ.correct
                          ? 'bg-green-100 border-green-400'
                          : 'bg-gray-100 border-gray-300'
                    }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <CardContent className="p-4 text-lg">{option}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {showReward && (
          <RewardAnimation
            type="star"
            show={showReward}
            message="¡Correcto!"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </div>
  );
}
