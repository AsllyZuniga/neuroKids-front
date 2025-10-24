import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, Star, ChevronLeft, ChevronRight, Sparkles, Wand2 } from 'lucide-react';
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from "../../../others/RewardAnimation";

interface FrasesMagicasProps {
  onBack: () => void;
  level: number;
}

interface MagicSentence {
  id: number;
  sentence: string;
  magicWord: string;
  beforeMagic: string;
  afterMagic: string;
  beforeImage: string;
  afterImage: string;
  sound: string;
}


const magicSentencesLevel1: MagicSentence[] = [
  {
    id: 1,
    sentence: "Pan, que aparezca una mariposa brillante",
    magicWord: "Pan",
    beforeMagic: "No hay nada en el jardín.",
    afterMagic: "¡Aparece una hermosa mariposa volando entre las flores!",
    beforeImage: "🌿",
    afterImage: "🦋",
    sound: "¡Poof!"
  },
  {
    id: 2,
    sentence: "Sol, que brille en el cielo azul",
    magicWord: "Sol",
    beforeMagic: "El cielo está nublado.",
    afterMagic: "☀️ ¡El sol aparece e ilumina todo el lugar!",
    beforeImage: "🌥️",
    afterImage: "☀️",
    sound: "¡Chisss!"
  },
  {
    id: 3,
    sentence: "Luz, que ilumine la habitación oscura",
    magicWord: "Luz",
    beforeMagic: "Todo está a oscuras.",
    afterMagic: "💡 ¡Una luz brillante enciende la habitación!",
    beforeImage: "🌑",
    afterImage: "💡",
    sound: "¡Boom!"
  }
];

const magicSentencesLevel2: MagicSentence[] = [
  {
    id: 1,
    sentence: "Tic, que florezcan mil rosas",
    magicWord: "Tic",
    beforeMagic: "El jardín está seco y sin color",
    afterMagic: "🌹🌷🌼 ¡El jardín se llena de flores de todos los colores!",
    beforeImage: "🌿",
    afterImage: "🌺🌹🌻",
    sound: "¡Fiuuu Boom!"
  },
  {
    id: 2,
    sentence: "Pa, que el río empiece a cantar",
    magicWord: "Pa",
    beforeMagic: "El río está quieto y silencioso",
    afterMagic: "¡El río canta alegremente mientras corre entre las piedras!",
    beforeImage: "💧",
    afterImage: "🌊🎶",
    sound: "¡Splash splash!"
  },
  {
    id: 3,
    sentence: "Pop, que caigan estrellas del cielo",
    magicWord: "Pop",
    beforeMagic: "El cielo nocturno está tranquilo",
    afterMagic: "¡Miles de estrellas fugaces cruzan el firmamento!",
    beforeImage: "🌙",
    afterImage: "🌠🌟✨",
    sound: "¡Fiuuuuuu!"
  }
];

const magicSentencesLevel3: MagicSentence[] = [
  {
    id: 1,
    sentence: "Lo, que aparezca un dragón y vuele sobre el castillo",
    magicWord: "Lo",
    beforeMagic: "El castillo está en calma y no hay nadie alrededor",
    afterMagic: "¡Un dragón majestuoso aparece y sobrevuela el castillo soltando chispas!",
    beforeImage: "🏰",
    afterImage: "🐉🔥🏰",
    sound: "¡Roooar!"
  },
  {
    id: 2,
    sentence: "Sal, que la luna se convierta en sol y vuelva a brillar",
    magicWord: "Sal",
    beforeMagic: "La noche es profunda y oscura",
    afterMagic: "¡La luna se transforma lentamente en un brillante sol!",
    beforeImage: "🌙",
    afterImage: "🌞",
    sound: "¡Woooosh!"
  },
  {
    id: 3,
    sentence: "Sí, que aparezca un arcoíris con lluvia de estrellas",
    magicWord: "Sí",
    beforeMagic: "El cielo está gris después de la tormenta",
    afterMagic: "🌈✨ ¡Un arcoíris aparece mientras caen estrellas fugaces!",
    beforeImage: "🌧️",
    afterImage: "🌈💫🌟",
    sound: "¡Tachán!"
  }
];

export function FrasesMagicas({ onBack, level: initialLevel }: FrasesMagicasProps) {
  const [level, setLevel] = useState(initialLevel);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [showMagic, setShowMagic] = useState(false);
  const [magicActivated, setMagicActivated] = useState(false);
  const [score, setScore] = useState(0);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("Di la palabra mágica cuando actives el micrófono.");
  const [currentProgress, setCurrentProgress] = useState(0);


  const magicSentences = (() => {
    switch (level) {
      case 1:
        return magicSentencesLevel1;
      case 2:
        return magicSentencesLevel2;
      case 3:
        return magicSentencesLevel3;
      default:
        console.warn(`Nivel no válido: ${level}. Usando nivel 1 por defecto.`);
        return magicSentencesLevel1;
    }
  })();

  const sentence = magicSentences[currentSentence];
  const totalSentences = magicSentences.length;
  const baseProgress = (currentSentence / totalSentences) * 100;
  const incrementPerMagic = 100 / totalSentences;
  const maxPageProgress = 100 / totalSentences;

  // Actualizar progreso
  const updateProgress = () => {
    const newProgress = baseProgress + (magicActivated ? incrementPerMagic : 0);
    setCurrentProgress(Math.min(newProgress, 100));
  };

  useEffect(() => {
    setShowMagic(false);
    setMagicActivated(false);
    setCurrentProgress((currentSentence / totalSentences) * 100);
  }, [currentSentence, totalSentences]);

  useEffect(() => {
    updateProgress();
  }, [magicActivated, currentSentence]);


  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentSentence]);


  const playSentenceAudio = () => {
    if (!('speechSynthesis' in window)) {
      console.warn('La síntesis de voz no está soportada en este navegador.');
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(sentence.sentence);
    utterance.lang = 'es-ES';
    utterance.rate = 0.8;
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);

    const words = sentence.sentence.split(' ').length;
    const duration = Math.max(words * 400, 2000);
    console.log(`🔊 Leyendo: ${sentence.sentence}`);
  };


  const activateMagic = () => {
    if (magicActivated) return;

    setShowMagic(true);
    setMagicActivated(true);
    setScore(score + (level === 3 ? 40 : level === 2 ? 30 : 20));
    setShowReward(true);

    const particleCount = level === 3 ? 30 : level === 2 ? 20 : 10;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);

    const duration = level === 3 ? 3000 : level === 2 ? 2500 : 2000;
    setTimeout(() => {
      setShowReward(false);
      setParticles([]);
    }, duration);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setMessage("⚠️ Tu navegador no soporta reconocimiento de voz.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-CO';
    recognition.interimResults = true;
    recognition.continuous = false;

    setIsListening(true);
    setMessage("🎤 Escuchando... di la palabra mágica con claridad.");

    let detected = false;
    const expectedWord = sentence.magicWord.toLowerCase();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      console.log("📢 Detectado:", transcript);
      setMessage(`👂 Te escuché decir: "${transcript}"`);

      if (transcript.includes(expectedWord) && !detected) {
        detected = true;
        setMessage("✅ ¡Perfecto! Has dicho la palabra mágica.");
        activateMagic();
        recognition.stop();
      }
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.onerror = (event: any) => {
      console.error("❌ Error de reconocimiento:", event.error);
      setMessage("⚠️ No se entendió bien, intenta otra vez.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const goToNextSentence = () => {
    if (currentSentence < magicSentences.length - 1) {
      setCurrentSentence(currentSentence + 1);
    } else {
      setReadingComplete(true);
    }
  };

  const goToPreviousSentence = () => {
    if (currentSentence > 0) {
      setCurrentSentence(currentSentence - 1);
    }
  };

  const restartReading = () => {
    setCurrentSentence(0);
    setScore(0);
    setReadingComplete(false);
    setShowReward(false);
    setShowMagic(false);
    setMagicActivated(false);
    setParticles([]);
    setCurrentProgress(0);
  };


  if (readingComplete) {
    const isLastLevel = level === 3;
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.8, 1], scale: [0.9, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 text-6xl opacity-10 select-none"
        >
          ✨🌟💫
        </motion.div>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="z-10 bg-white/80 backdrop-blur-sm border-4 border-purple-300 rounded-3xl p-10 shadow-2xl max-w-lg mx-auto"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2 text-purple-700">
            ¡Nivel {level} completado!
          </h2>
          <p className="text-gray-700 mb-4">
            Has reunido <span className="font-bold text-purple-600">{score}</span> puntos mágicos.
          </p>

          {!isLastLevel ? (
            <>
              <p className="text-gray-600 mb-6">¡Prepárate para el siguiente desafío mágico!</p>
              <Button
                onClick={() => {
                  setLevel(level + 1);
                  restartReading();
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-xl text-lg"
              >
                Siguiente Nivel
              </Button>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                ¡Has completado todos los niveles! Eres un verdadero mago de las palabras.
              </p>
              <Button
                onClick={onBack}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl text-lg"
              >
                Volver al Dashboard
              </Button>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  /* pantalla principal del juego */
  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-purple-300 via-pink-180 to-yellow-100 relative overflow-hidden">
      {/* ✨ Partículas mágicas */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1, 0], rotate: 360, y: [0, -100, 0] }}
          transition={{ duration: 2 }}
          className="absolute text-2xl"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          ✨
        </motion.div>
      ))}

      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 px-4">
          <Button onClick={onBack} variant="outline" className="bg-black/80 backdrop-blur-sm border-2 hover:bg-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>

          <div className="text-center">
            <h1 className="text-2xl text-gray-800">✨ Frases Mágicas - Nivel {level}</h1>
            <div className="flex items-center gap-2 justify-center mt-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Puntos: {score}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Frase {currentSentence + 1} de {magicSentences.length}
          </div>
        </div>

        <div className="mb-6 px-4">
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

        <AnimalGuide
          animal="owl"
          message={
            level === 1
              ? '🦉 ¡Di la palabra mágica para activar la magia!'
              : level === 2
                ? '🦉 Las frases son más poderosas... ¡pronuncia bien!'
                : '🦉 Solo los magos expertos pueden controlar estas palabras mágicas.'
          }
        />

        <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-500 mb-6 mx-4 flex-1">
          <CardContent className="p-5 h-full flex flex-col">
            <div className="grid md:grid-cols-2 gap-10 items-center flex-1">
              {/* LADO IZQUIERDO */}
              <div className="text-center flex flex-col justify-center">
                <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl p-8 mb-4 border-4 border-purple-300 flex items-center justify-center min-h-[200px]">
                  {!showMagic ? (
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <div className="text-6xl mb-2">{sentence.beforeImage}</div>
                      <p className="text-purple-700">{sentence.beforeMagic}</p>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 1 }}>
                      <div className="text-6xl mb-2">{sentence.afterImage}</div>
                      <p className="text-purple-700">{sentence.afterMagic}</p>
                      <div className="text-yellow-600 text-lg mt-2">{sentence.sound}</div>
                    </motion.div>
                  )}
                </div>


                <div className="flex flex-col items-center gap-4">
                  <Button
                    onClick={playSentenceAudio}
                    disabled={isPlaying}
                    className={`${isPlaying
                        ? 'bg-green-500 text-white animate-pulse'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } px-6 py-3 text-lg flex items-center gap-2`}
                  >
                    <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
                    {isPlaying ? '🔊 Reproduciendo...' : 'Escuchar Frase'}
                  </Button>

                  <Button
                    onClick={startListening}
                    disabled={isListening || magicActivated}
                    className={`${magicActivated
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isListening
                          ? 'bg-red-400 animate-pulse'
                          : 'bg-purple-500 hover:bg-purple-600'
                      } text-white px-6 py-3 text-lg flex items-center gap-2`}
                  >
                    {isListening ? (
                      <>
                        <Volume2 className="w-5 h-5" /> Escuchando...
                      </>
                    ) : magicActivated ? (
                      <>
                        <Wand2 className="w-5 h-5" /> ¡Magia activada!
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-5 h-5" /> Activar micrófono
                      </>
                    )}
                  </Button>

                  <p className="mt-3 text-purple-700 text-center font-medium">{message}</p>
                </div>
              </div>


              <div className="flex flex-col justify-center">
                <div className="text-2xl leading-relaxed text-gray-800 mb-6 bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg border-2 border-purple-200">
                  <span className="text-purple-600 text-3xl">"</span>
                  {sentence.sentence.split(sentence.magicWord).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="text-purple-700 font-bold bg-yellow-200 px-2 py-1 rounded-lg border-2 border-yellow-300">
                          {sentence.magicWord}
                        </span>
                      )}
                    </span>
                  ))}
                  <span className="text-purple-600 text-3xl">"</span>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-2">Consejo:</h4>
                  <p className="text-yellow-700">
                    Di con voz clara la palabra mágica resaltada. ¡Recuerda pronunciarla igual que aparece!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6 px-4">
          <Button onClick={goToPreviousSentence} disabled={currentSentence === 0} variant="outline" className="bg-white border-2 hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
          </Button>

          <Button onClick={goToNextSentence} disabled={!magicActivated} className="bg-purple-500 hover:bg-purple-600 text-white">
            Siguiente <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {showReward && (
          <RewardAnimation
            type="star"
            show={showReward}
            message="¡Muy bien!"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </div>
  );
}