import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "../../../ui/button";
import { Card, CardContent } from "../../../ui/card";
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from "../../../others/RewardAnimation";
import { GameHeader } from "../../../others/GameHeader";
import { ProgressBar } from "../../../others/ProgressBar";
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { ConfettiExplosion } from '../../../others/ConfettiExplosion';
import { StartScreenFrasesMagicas } from "../IniciosJuegosLecturas/StartScreenFrasesMagicas/StartScreenFrasesMagicas";

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
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(initialLevel);
  const [currentSentence, setCurrentSentence] = useState(0);
  const [showMagic, setShowMagic] = useState(false);
  const [magicActivated, setMagicActivated] = useState(false);
  const [score, setScore] = useState(0);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState("Di la palabra mágica cuando actives el micrófono.");
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

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


    console.log(`🔊 Leyendo: ${sentence.sentence}`);
  };


  const activateMagic = () => {
    if (magicActivated) return;

    setShowMagic(true);
    setMagicActivated(true);
    setScore(score + (level === 3 ? 40 : level === 2 ? 30 : 20));
    setShowReward(true);

    // ¡CONFETI AL ACTIVAR MAGIA!
    setTimeout(() => {
      setShowReward(false);
    }, 3000); // Duración del confeti
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setMessage("⚠️ Tu navegador no soporta reconocimiento de voz. Usa Chrome.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    const grammarString = `#JSGF V1.0; grammar words; public <word> = ${sentence.magicWord};`;
    const grammar = new (window as any).SpeechGrammarList();
    grammar.addFromString(grammarString, 1);
    recognition.grammars = grammar;

    setIsListening(true);
    setMessage(`🎤 Escuchando... Di "${sentence.magicWord}" con claridad.`);

    let detected = false;
    const expectedWord = sentence.magicWord.toLowerCase();

    recognition.onresult = (event: any) => {
      const results = event.results[0];

      for (let i = 0; i < results.length; i++) {
        const transcript = results[i].transcript.trim().toLowerCase();
        const confidence = results[i].confidence; // 0-1

        console.log(`📢 Detectado: "${transcript}" (confianza: ${(confidence * 100).toFixed(1)}%)`);

        if (transcript.includes(expectedWord)) {
          setMessage(`✅ ¡Magia activada! (Confianza: ${(confidence * 100).toFixed(1)}%)`);
          detected = true;
          activateMagic();
          recognition.stop();
          return;
        }

        for (let alt = 1; alt < results.length && alt <= 3; alt++) {
          const alternative = results[alt].transcript.trim().toLowerCase();
          if (alternative.includes(expectedWord)) {
            setMessage(`✅ ¡Magia activada! (Alternativa detectada)`);
            detected = true;
            activateMagic();
            recognition.stop();
            return;
          }
        }

        const similarity = calculateSimilarity(transcript, expectedWord);
        if (similarity > 0.7) {
          setMessage(`✅ ¡Magia activada! (Cerca: "${transcript}" ≈ "${expectedWord}")`);
          detected = true;
          activateMagic();
          recognition.stop();
          return;
        }
        setMessage(`❓ No detecté "${expectedWord}". Intenté: "${transcript}". Confianza: ${(confidence * 100).toFixed(1)}%. ¡Inténtalo de nuevo!`);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("❌ Error:", event.error);
      let errorMsg = "Error en el micrófono.";
      if (event.error === 'network') errorMsg = "Sin conexión. Verifica internet.";
      else if (event.error === 'not-allowed') errorMsg = "Permiso denegado. Activa el micrófono.";
      else if (event.error === 'audio-capture') errorMsg = "No se detecta audio. Verifica el micrófono.";
      setMessage(`⚠️ ${errorMsg}`);
      setIsListening(false);
    };

    recognition.onspeechend = () => {
      if (!detected) setMessage("🛑 No se detectó voz. ¡Habla más fuerte la próxima vez!");
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    let longer = str1.length > str2.length ? str1 : str2;
    let shorter = str1.length > str2.length ? str2 : str1;
    let longerLength = longer.length;
    if (longerLength === 0) return 1;
    return (longerLength - editDistance(longer, shorter)) / longerLength;
  };

  const editDistance = (s1: string, s2: string): number => {
    let dp: number[][] = Array(s1.length + 1).fill(null).map(() => Array(s2.length + 1).fill(null));
    for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
    for (let j = 0; j <= s2.length; j++) dp[0][j] = j;
    for (let i = 1; i <= s1.length; i++) {
      for (let j = 1; j <= s2.length; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[s1.length][s2.length];
  };

  const goToNextSentence = () => {
    if (currentSentence < magicSentences.length - 1) {
      setCurrentSentence(currentSentence + 1);
      setShowMagic(false);
      setMagicActivated(false);
      setMessage("Di la palabra mágica cuando actives el micrófono.");
    } else {
      setReadingComplete(true);
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
    setCurrentProgress(0);
    setShowMotivational(false);
    setShowLevelComplete(false);
    setMessage("Di la palabra mágica cuando actives el micrófono.");
  };

  const goToNextLevel = () => {
    if (level < 3) {
      setLevel(level + 1);
      restartReading();
    }
    setShowLevelComplete(false);
  };

  if (!gameStarted) {
    return <StartScreenFrasesMagicas onStart={() => setGameStarted(true)} onBack={onBack} />;
  }

  return (
    <div
      className="min-h-screen p-6 relative overflow-hidden"
      style={{ //cambiar color de fondo 
        background: 'linear-gradient(135deg, #c29ce7ff 0%, #be7ea2ff 100%)'
      }}
    >
      <ConfettiExplosion show={showMagic} />
      <ConfettiExplosion show={readingComplete} />
      <RewardAnimation type="star" show={showReward} />

      {/* HEADER */}
      <GameHeader
        title="Frases Mágicas"
        level={level}
        score={score}
        onBack={onBack}
        onRestart={restartReading}
      />

      {/* BARRA DE PROGRESO */}
      <ProgressBar
        current={currentSentence + 1}
        total={totalSentences}
        progress={currentProgress}
        className="mb-6"
      />

      {/* GUÍA DEL BÚHO */}
      <div className="max-w-2xl mx-auto mb-6">
        <AnimalGuide
          animal="owl"
          message={
            level === 1
              ? '¡Di la palabra mágica para activar la magia!'
              : level === 2
                ? 'Las frases son más poderosas... ¡pronuncia bien!'
                : 'Solo los magos expertos pueden controlar estas palabras mágicas.'
          }
        />
      </div>

      {/* JUEGO */}
      {!readingComplete && !showMotivational && !showLevelComplete && (
        <motion.div
          key={currentSentence}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="max-w-7xl mx-auto"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-500 mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl p-8 mb-6 border-4 border-purple-300 min-h-[220px] flex flex-col justify-center">
                    {!showMagic ? (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="text-7xl mb-3">{sentence.beforeImage}</div>
                        <p className="text-purple-700 font-medium">{sentence.beforeMagic}</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8 }}
                      >
                        <div className="text-7xl mb-3">{sentence.afterImage}</div>
                        <p className="text-purple-700 font-medium">{sentence.afterMagic}</p>
                        <div className="text-yellow-600 text-xl mt-2 font-bold">{sentence.sound}</div>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={playSentenceAudio}
                      disabled={isPlaying}
                      className={`w-full text-lg py-6 ${isPlaying
                        ? 'bg-green-500 text-white animate-pulse'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                      <Volume2 className={`w-5 h-5 mr-2 ${isPlaying ? 'animate-bounce' : ''}`} />
                      {isPlaying ? 'Reproduciendo...' : 'Escuchar Frase'}
                    </Button>
                    <Button
                      onClick={startListening}
                      disabled={isListening || magicActivated}
                      className={`w-full text-lg py-6 ${magicActivated
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isListening
                          ? 'bg-red-400 animate-pulse'
                          : 'bg-purple-500 hover:bg-purple-600'
                        } text-white`}
                    >
                      {isListening ? (
                        <>Escuchando...</>
                      ) : magicActivated ? (
                        <>¡Magia activada!</>
                      ) : (
                        <>Activar micrófono</>
                      )}
                    </Button>

                    <p className="text-purple-700 text-center font-medium bg-purple-50 p-3 rounded-lg">
                      {message}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="text-2xl leading-relaxed text-gray-800 bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl border-2 border-purple-200">
                    <span className="text-purple-600 text-4xl">"</span>
                    {sentence.sentence.split(sentence.magicWord).map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <span className="text-purple-700 font-bold bg-yellow-200 px-3 py-1 rounded-lg border-2 border-yellow-300 text-3xl">
                            {sentence.magicWord}
                          </span>
                        )}
                      </span>
                    ))}
                    <span className="text-purple-600 text-4xl">"</span>
                  </div>

                  <div className="bg-yellow-50 p-5 rounded-xl border-2 border-yellow-200">
                    <h4 className="text-lg font-semibold text-yellow-800 mb-2">Consejo del Búho:</h4>
                    <p className="text-yellow-700">
                      Di con voz clara la palabra mágica resaltada. ¡Recuerda pronunciarla igual que aparece!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NAVEGACIÓN */}
          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={goToPreviousSentence}
              disabled={currentSentence === 0}
              variant="outline"
              className="bg-green-500"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Anterior
            </Button>

            <Button
              onClick={goToNextSentence}
              disabled={!magicActivated}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              Siguiente
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* MENSAJE MOTIVACIONAL */}
      {showMotivational && (
        <MotivationalMessage
          score={score}
          total={totalSentences * 30}
          customMessage="¡Eres un mago de las palabras!"
          customSubtitle="Activaste toda la magia del nivel"
          onComplete={() => {
            setShowMotivational(false);
            setShowLevelComplete(true);
          }}
        />
      )}

      {/* MODAL DE NIVEL COMPLETADO */}
      {showLevelComplete && (
        <LevelCompleteModal
          score={score}
          total={totalSentences * 30}
          level={level}
          isLastLevel={level >= 3}
          onNextLevel={goToNextLevel}
          onRestart={restartReading}
          onExit={onBack}
        />
      )}
    </div>
  );
}