import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ButtonWithAudio } from "@/components/ui/ButtonWithAudio";
import { Card, CardContent } from "@/components/ui/card";
import { AnimalGuide } from '@/components/others/AnimalGuide';
import { RewardAnimation } from "@/components/others/RewardAnimation";
import { GameHeader } from "@/components/others/GameHeader";
import { ProgressBar } from "@/components/others/ProgressBar";
import { MotivationalMessage } from '@/components/others/MotivationalMessage';
import { LevelCompleteModal } from '@/components/others/LevelCompleteModal';
import { ConfettiExplosion } from '@/components/others/ConfettiExplosion';
import { LevelLock } from '@/components/others/LevelLock';
import { useLevelLock } from '@/hooks/useLevelLock';
import { speakText } from '@/utils/textToSpeech';
import { useProgress } from "@/hooks/useProgress";
import { getActivityByDbId } from "@/config/activities";
import { StartScreenFrasesMagicas } from "../IniciosJuegosLecturas/StartScreenFrasesMagicas";
import sol from "@/assets/7_8/frasesmagicas/sol1.svg"
import cielo from "@/assets/7_8/frasesmagicas/nublado1.svg"
import mesa from "@/assets/7_8/frasesmagicas/mesa.svg"
import pan from "@/assets/7_8/frasesmagicas/mesaconpan.svg"
import luz from "@/assets/7_8/frasesmagicas/Luz.svg"
import sinLuz from "@/assets/7_8/frasesmagicas/sinLuz.svg"
import flor from "@/assets/7_8/frasesmagicas/flor.svg"
import sinFlor from "@/assets/7_8/frasesmagicas/sinFlor.svg"
import Luna from "@/assets/7_8/frasesmagicas/luna.svg"
import sinLuna from "@/assets/7_8/frasesmagicas/sinLuna.svg"
import hada from "@/assets/7_8/frasesmagicas/hada.svg"
import sinHada from "@/assets/7_8/frasesmagicas/sinHada.svg"
import nieve from "@/assets/7_8/frasesmagicas/conNieve.svg"
import sinNieve from "@/assets/7_8/frasesmagicas/sinNieve.svg"
import arcoiris from "@/assets/7_8/frasesmagicas/arcoiris.svg"
import sinArcoiris from "@/assets/7_8/frasesmagicas/sinArcoiris.svg"
import mar from "@/assets/7_8/frasesmagicas/mar.svg"
import sinAnimales from "@/assets/7_8/frasesmagicas/sinAnimales.svg"

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
    sentence: "Sol",
    magicWord: "Sol",
    beforeMagic: "El cielo está gris.",
    afterMagic: "¡El sol aparece y todo brilla!",
    beforeImage: cielo,
    afterImage: sol,
    sound: "¡Tarán!"
  },
  {
    id: 2,
    sentence: "Pan",
    magicWord: "Pan",
    beforeMagic: "La mesa está vacía.",
    afterMagic: "¡Hay pan listo para comer!",
    beforeImage: mesa,
    afterImage: pan,
    sound: "¡Pum!"
  },
  {
    id: 3,
    sentence: "Luz",
    magicWord: "Luz",
    beforeMagic: "Todo está oscuro.",
    afterMagic: "¡La casa se llena de luz!",
    beforeImage: sinLuz,
    afterImage: luz,
    sound: "¡Click!"
  }
];

const magicSentencesLevel2: MagicSentence[] = [
  {
    id: 1,
    sentence: "Flor",
    magicWord: "Flor",
    beforeMagic: "El jardín está vacío.",
    afterMagic: "¡Una flor bonita creció!",
    beforeImage: sinFlor,
    afterImage: flor,
    sound: "¡Plin!"
  },
  {
    id: 2,
    sentence: "Mar",
    magicWord: "Mar",
    beforeMagic: "El mar esta vacio.",
    afterMagic: "¡Hay animales en el mar!",
    beforeImage: sinAnimales,
    afterImage: mar,
    sound: "¡Splash!"
  },
  {
    id: 3,
    sentence: "Luna",
    magicWord: "Luna",
    beforeMagic: "La noche está oscura.",
    afterMagic: "¡La luna brilla en el cielo!",
    beforeImage: sinLuna,
    afterImage: Luna,
    sound: "¡Shhh!"
  }
];

const magicSentencesLevel3: MagicSentence[] = [
  {
    id: 1,
    sentence: "Hada",
    magicWord: "Hada",
    beforeMagic: "El bosque está vacío.",
    afterMagic: "¡Un hada vuela feliz en el bosque!",
    beforeImage: sinHada,
    afterImage: hada,
    sound: "¡Fiuu!"
  },
  {
    id: 2,
    sentence: "Nieve",
    magicWord: "Nieve",
    beforeMagic: "El cielo está vacío.",
    afterMagic: "La nieve cae despacio.",
    beforeImage: sinNieve,
    afterImage: nieve,
    sound: "¡Plim!"

  },
  {
    id: 3,
    sentence: "Magia",
    magicWord: "Magia",
    beforeMagic: "El cielo está gris.",
    afterMagic: "¡Un arcoíris aparece!",
    beforeImage: sinArcoiris,
    afterImage: arcoiris,
    sound: "¡Tachán!"
  }
];

export function FrasesMagicas({ onBack, level: initialLevel }: FrasesMagicasProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(initialLevel);
  const isLevelLocked = useLevelLock(level);
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

  const { saveProgress } = useProgress();

  const activityConfig = getActivityByDbId(5); // Frases Mágicas

  const guardarInicioNivel = () => {
    if (activityConfig) {
      saveProgress({
        activityId: activityConfig.dbId,
        activityName: activityConfig.name,
        activityType: activityConfig.type,
        ageGroup: '7-8',
        level: level,
        score: 0,
        maxScore: 100,
        completed: false,
        timeSpent: 0
      });
    }
  };

  useEffect(() => {
    // Registrar CADA vez que se inicia la lectura, sin importar si ya leyó antes
    console.log('🔄 FrasesMagicas - Ejecutando useEffect, nivel:', level);
    guardarInicioNivel();
  }, [level, activityConfig, saveProgress]); // Se ejecuta cada vez que cambia el nivel

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [magicActivated, currentSentence]);


  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentSentence]);


  const playMagicTextAudio = () => {
    if (isPlaying) return;

    setIsPlaying(true);

    const textToRead = showMagic
      ? sentence.afterMagic
      : sentence.beforeMagic;

    speakText(textToRead, { voiceType: 'child' });

    const words = textToRead.split(/\s+/).filter(Boolean).length;
    const duration = Math.max(words * 350, 1500);

    setTimeout(() => setIsPlaying(false), duration);
  };



  const activateMagic = () => {
    if (magicActivated) return;

    setShowMagic(true);
    setMagicActivated(true);
    setScore(score + (level === 3 ? 40 : level === 2 ? 30 : 20));
    setShowReward(true);

    setTimeout(() => {
      setShowReward(false);
    }, 3000);
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
          setMessage(`✅ ¡Magia activada!`);
          detected = true;
          activateMagic();
          recognition.stop();
          return;
        }

        for (let alt = 1; alt < results.length && alt <= 3; alt++) {
          const alternative = results[alt].transcript.trim().toLowerCase();
          if (alternative.includes(expectedWord)) {
            setMessage(`✅ ¡Magia activada!`);
            detected = true;
            activateMagic();
            recognition.stop();
            return;
          }
        }

        const similarity = calculateSimilarity(transcript, expectedWord);
        if (similarity > 0.7) {
          setMessage(`✅ ¡Magia activada!`);
          detected = true;
          activateMagic();
          recognition.stop();
          return;
        }
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
      if (!detected) setMessage("🛑 No se detectó voz.");
      setIsListening(false);
      setTimeout(() => {
      }, 2000);

    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    const longerLength = longer.length;
    if (longerLength === 0) return 1;
    return (longerLength - editDistance(longer, shorter)) / longerLength;
  };

  const editDistance = (s1: string, s2: string): number => {
    const dp: number[][] = Array(s1.length + 1).fill(null).map(() => Array(s2.length + 1).fill(null));
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
      setMessage("");
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
    setMessage("");
  };

  const goToNextLevel = () => {
    if (level < 3) {
      setLevel(level + 1);
      restartReading();
    }
    setShowLevelComplete(false);
  };

  if (!gameStarted) {
    return (
      <LevelLock level={level} isLocked={isLevelLocked}>
        <StartScreenFrasesMagicas onStart={() => setGameStarted(true)} onBack={onBack} />
      </LevelLock>
    );
  }

  return (
    <LevelLock level={level} isLocked={isLevelLocked}>
      <div
        className="min-h-screen p-6 relative overflow-hidden"
        style={{ //cambiar color de fondo 
          background: 'linear-gradient(135deg, rgb(210, 168, 253) 0%, rgb(253, 181, 222) 100%)'
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
        <div>
          <AnimalGuide
            animal="frog"
            message={
              level === 1
                ? '¡Di la palabra mágica para activar la magia!'
                : level === 2
                  ? 'Las frases son más poderosas ahora. ¡Tú puedes!'
                  : 'Solo los magos expertos como tú pueden controlar estas palabras mágicas.'
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
                    <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl p-8 border-4 border-purple-300 min-h-[220px] flex items-center justify-center">
                      {!showMagic ? (
                        <motion.img
                          key="before"
                          src={sentence.beforeImage}
                          alt="Antes de la magia"
                          className="w-50 h-50 object-contain"
                          animate={{ scale: [1, 1.05, 1] }}
                          
                        />
                      ) : (
                        <motion.img
                          key="after"
                          src={sentence.afterImage}
                          alt="Después de la magia"
                          className="w-50 h-50 object-contain"
                         
                          
                        />
                      )}
                    </div>



                  </div>
                  <div className="space-y-6">

                    <div className="text-center bg-pink-100 p-5 rounded-xl border-2 border-purple-500">
                      <h4 className="text-lg text-black mb-2">Palabra mágica</h4>
                      <div className="text-5xl text-purple-700 ">
                        {sentence.magicWord}
                      </div>

                    </div>
                    <ButtonWithAudio
                      onClick={startListening}
                      disabled={isListening || magicActivated}
                      playOnClick
                      playOnHover={false}
                      className={`w-full text-lg py-6 ${magicActivated
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isListening
                          ? 'bg-red-400 animate-pulse'
                          : 'bg-purple-500 hover:bg-purple-600'
                        } text-black`}
                    >
                      {isListening ? (
                        <>Escuchando...</>
                      ) : magicActivated ? (
                        <>¡Magia activada!</>
                      ) : (
                        <>Activar micrófono</>
                      )}
                    </ButtonWithAudio>

                    <div className="bg-yellow-50 p-5 rounded-xl border-2 border-yellow-200">
                      <h4 className="text-lg text-yellow-800 mb-2">Consejo 💡</h4>
                      <p className="text-yellow-700">
                        Activa el microfono y di con voz clara la palabra mágica resaltada. ¡Recuerda pronunciarla igual que aparece!
                      </p>
                    </div>

                    <div className="text-center text-gray-800 bg-gradient-to-r from-blue-100 to-green-100 p-6 rounded-xl border-2 border-blue-500">
                      <p className="text-xl">
                        {!showMagic ? sentence.beforeMagic : sentence.afterMagic}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <ButtonWithAudio
                        onClick={playMagicTextAudio}
                        disabled={isPlaying}
                        playOnClick
                        playOnHover={false}
                        className={`w-full text-lg py-6 ${isPlaying
                          ? 'bg-green-500 text-black animate-pulse'
                          : 'bg-blue-500 hover:bg-blue-600 text-black'
                          }`}
                      >
                        <Volume2 className={`w-5 h-5 mr-2 ${isPlaying ? 'animate-bounce' : ''}`} />
                        {isPlaying ? 'Reproduciendo...' : 'Escuchar Frase'}
                      </ButtonWithAudio>

                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NAVEGACIÓN */}
            <div className="flex justify-between items-center mt-6">
              <ButtonWithAudio
                onClick={goToPreviousSentence}
                disabled={currentSentence === 0}
                playOnHover
                playOnClick
                variant="outline"
                className="bg-green-500"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Anterior
              </ButtonWithAudio>

              <ButtonWithAudio
                onClick={goToNextSentence}
                disabled={!magicActivated}
                playOnHover
                playOnClick
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Siguiente
                <ChevronRight className="w-5 h-5 ml-2" />
              </ButtonWithAudio>
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
            celebrationText="¡Lo lograste!"
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
    </LevelLock>
  );
}