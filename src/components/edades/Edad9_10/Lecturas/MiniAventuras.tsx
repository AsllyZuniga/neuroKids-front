import { useState } from 'react';
import { motion } from "framer-motion";
import { Volume2, ChevronLeft, ChevronRight} from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { GameHeader } from '../../../others/GameHeader';
import { ProgressBar } from '../../../others/ProgressBar';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { StartScreenMiniAventuras } from '../IniciosJuegosLecturas/StartScreenMiniAventuras/StartScreenMiniAventuras';

interface MiniAventurasProps {
  onBack: () => void;
  level: number;
}

interface Adventure {
  id: number;
  title: string;
  pages: AdventurePage[];
  theme: string;
  difficulty: number;
}

interface AdventurePage {
  id: number;
  text: string;
  image: string;
  audio: string;
  interactive?: {
    type: 'choice' | 'question';
    content: string;
    options: string[];
    correct?: number;
  };
}

const adventures: Adventure[] = [
  {
    id: 1,
    title: "El Tesoro del Pirata Bobby",
    theme: "pirates",
    difficulty: 1,
    pages: [
      {
        id: 1,
        text: "El capitán Bobby era un pirata muy especial. A diferencia de otros piratas, él no robaba tesoros, sino que los escondía para que otros niños pudieran encontrarlos y divertirse.",
        image: "🏴‍☠️",
        audio: "/audio/bobby1.mp3"
      },
      {
        id: 2,
        text: "Un día, Bobby decidió esconder su tesoro más preciado en una isla misteriosa. Era un cofre lleno de libros de aventuras y mapas antiguos.",
        image: "🗺️",
        audio: "/audio/bobby2.mp3",
        interactive: {
          type: "choice",
          content: "¿Qué crees que Bobby valora más?",
          options: ["El oro y las joyas", "Los libros y el conocimiento", "Los barcos grandes"],
          correct: 1
        }
      },
      {
        id: 3,
        text: "Antes de esconder el tesoro, Bobby dibujó un mapa especial. Marcó tres pistas importantes: una palmera con forma de corazón, una roca que parecía un dragón, y una cueva con cristales brillantes.",
        image: "🌴",
        audio: "/audio/bobby3.mp3"
      },
      {
        id: 4,
        text: "Años después, una niña llamada Sara encontró el mapa de Bobby en una botella en la playa. Sus ojos brillaron de emoción al ver todas las pistas dibujadas.",
        image: "👧",
        audio: "/audio/bobby4.mp3",
        interactive: {
          type: "question",
          content: "¿Dónde encontró Sara el mapa?",
          options: ["En su casa", "En una botella en la playa", "En la escuela"],
          correct: 1
        }
      },
      {
        id: 5,
        text: "Sara siguió las pistas del mapa con mucho cuidado. Primero encontró la palmera con forma de corazón, luego la roca del dragón, y finalmente llegó a la cueva brillante.",
        image: "💎",
        audio: "/audio/bobby5.mp3"
      },
      {
        id: 6,
        text: "¡Al final de la cueva, Sara encontró el tesoro de Bobby! Cuando abrió el cofre, sus ojos se llenaron de alegría al ver todos esos libros maravillosos. Ahora tenía aventuras para leer durante todo el año.",
        image: "📚",
        audio: "/audio/bobby6.mp3"
      },
      {
        id: 7,
        text: "Sara decidió compartir los libros con sus amigos. Juntos, leyeron historias de piratas valientes y tesoros escondidos, inspirando nuevas aventuras.",
        image: "👭",
        audio: "/audio/bobby7.mp3",
        interactive: {
          type: "choice",
          content: "¿Qué hizo Sara con los libros?",
          options: ["Los guardó para ella sola", "Los compartió con amigos", "Los vendió"],
          correct: 1
        }
      },
      {
        id: 8,
        text: "Desde ese día, Sara y sus amigos crearon sus propios mapas y tesoros, continuando el legado de Bobby el pirata bondadoso.",
        image: "🧭",
        audio: "/audio/bobby8.mp3"
      }
    ]
  },
  {
    id: 2,
    title: "La Misión Espacial de Luna",
    theme: "space",
    difficulty: 2,
    pages: [
      {
        id: 1,
        text: "Luna era una astronauta muy valiente que vivía en una estación espacial. Su trabajo era explorar planetas desconocidos y buscar formas de vida extraterrestre.",
        image: "👩‍🚀",
        audio: "/audio/luna1.mp3"
      },
      {
        id: 2,
        text: "Un día, la computadora de la estación detectó señales extrañas viniendo de un planeta azul muy lejano. Las señales parecían un patrón musical repetitivo.",
        image: "🛸",
        audio: "/audio/luna2.mp3",
        interactive: {
          type: "choice",
          content: "¿Qué crees que eran las señales?",
          options: ["Música de alienígenas", "Ruido de máquinas", "Ecos del espacio"],
          correct: 0
        }
      },
      {
        id: 3,
        text: "Luna preparó su nave espacial más rápida y se dirigió hacia el planeta misterioso. Durante el viaje, practicó diferentes sonidos musicales para poder comunicarse con los habitantes del planeta.",
        image: "🚀",
        audio: "/audio/luna3.mp3"
      },
      {
        id: 4,
        text: "Al llegar al planeta, Luna descubrió que estaba habitado por criaturas luminosas que se comunicaban exclusivamente a través de música. Eran muy amigables y le enseñaron sus canciones.",
        image: "👽",
        audio: "/audio/luna4.mp3",
        interactive: {
          type: "question",
          content: "¿Cómo se comunicaban los alienígenas?",
          options: ["Con palabras", "A través de música", "Con gestos"],
          correct: 1
        }
      },
      {
        id: 5,
        text: "Los alienígenas musicales le mostraron a Luna su hermoso planeta lleno de instrumentos gigantes que crecían como árboles. Cada instrumento producía un sonido diferente con el viento.",
        image: "🎵",
        audio: "/audio/luna5.mp3"
      },
      {
        id: 6,
        text: "Luna regresó a la Tierra con una grabación de la música alienígena. Ahora, cada vez que la gente de la Tierra escucha esas melodías, recuerda que en el universo hay seres que viven en armonía a través de la música.",
        image: "🌍",
        audio: "/audio/luna6.mp3"
      },
      {
        id: 7,
        text: "De vuelta en la Tierra, Luna compartió su experiencia en una conferencia. Los científicos se emocionaron y planearon más misiones para explorar otros planetas musicales.",
        image: "🔬",
        audio: "/audio/luna7.mp3",
        interactive: {
          type: "choice",
          content: "¿Qué hizo Luna al regresar?",
          options: ["Guardó el secreto", "Compartió su experiencia", "Se retiró de las misiones"],
          correct: 1
        }
      },
      {
        id: 8,
        text: "Gracias a Luna, la humanidad aprendió que la música puede unir mundos, y comenzaron a enviar señales musicales al espacio para hacer nuevos amigos.",
        image: "🎼",
        audio: "/audio/luna8.mp3"
      }
    ]
  },
  {
    id: 3,
    title: "La Jungla Mágica de Alex",
    theme: "jungle",
    difficulty: 3,
    pages: [
      {
        id: 1,
        text: "Alex era un explorador valiente que amaba las aventuras en la naturaleza. Un día, encontró un mapa antiguo que lo llevó a una jungla mágica llena de secretos.",
        image: "🌿",
        audio: "/audio/alex1.mp3"
      },
      {
        id: 2,
        text: "En la jungla, los animales hablaban y las plantas brillaban con colores vibrantes. Alex se maravilló con todo lo que veía.",
        image: "🦜",
        audio: "/audio/alex2.mp3",
        interactive: {
          type: "choice",
          content: "¿Qué animal encontró Alex primero?",
          options: ["Un loro parlante", "Un tigre feroz", "Un mono juguetón"],
          correct: 0
        }
      },
      {
        id: 3,
        text: "El loro le contó a Alex sobre un tesoro escondido protegido por un río encantado y guardianes antiguos.",
        image: "🗿",
        audio: "/audio/alex3.mp3"
      },
      {
        id: 4,
        text: "Alex cruzó el río resolviendo acertijos difíciles y evitando trampas naturales.",
        image: "❓",
        audio: "/audio/alex4.mp3",
        interactive: {
          type: "question",
          content: "¿Qué protegía el tesoro?",
          options: ["Un volcán", "Un río encantado", "Una montaña alta"],
          correct: 1
        }
      },
      {
        id: 5,
        text: "Al resolver todos los desafíos, Alex encontró el tesoro: semillas mágicas que podían hacer crecer bosques enteros en un día.",
        image: "🌱",
        audio: "/audio/alex5.mp3"
      },
      {
        id: 6,
        text: "Alex plantó las semillas y la jungla se volvió aún más hermosa y llena de vida. Desde entonces, protegió el secreto para que otros pudieran descubrirlo.",
        image: "🌳",
        audio: "/audio/alex6.mp3"
      },
      {
        id: 7,
        text: "Alex hizo amigos con más animales en la jungla, como un elefante sabio que le enseñó sobre la importancia de la conservación.",
        image: "🐘",
        audio: "/audio/alex7.mp3",
        interactive: {
          type: "choice",
          content: "¿Qué le enseñó el elefante a Alex?",
          options: ["A cazar", "La importancia de la conservación", "A volar"],
          correct: 1
        }
      },
      {
        id: 8,
        text: "Al final de su aventura, Alex regresó a casa con un corazón lleno de respeto por la naturaleza y prometió proteger todos los bosques del mundo.",
        image: "❤️",
        audio: "/audio/alex8.mp3"
      }
    ]
  }
];

export function MiniAventuras({ onBack}: MiniAventurasProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentAdventure, setCurrentAdventure] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [interactionComplete, setInteractionComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const adventure = adventures[currentAdventure];
  const page = adventure.pages[currentPage];
  const totalPages = adventure.pages.length;
  const progress = (currentPage / totalPages) * 100;

  const playPageAudio = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const handleInteraction = (optionIndex: number) => {
    if (interactionComplete) return;
    setSelectedOption(optionIndex);
    setInteractionComplete(true);

    const isCorrect = page.interactive?.correct === optionIndex;
    if (isCorrect) {
      setScore(score + 15);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    } else if (page.interactive?.correct !== undefined) {
      setScore(Math.max(0, score - 5));
    } else {
      setScore(score + 10);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setInteractionComplete(false);
      setSelectedOption(null);
    } else {
      setShowMotivational(true);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setInteractionComplete(false);
      setSelectedOption(null);
    }
  };

  const handleRestart = () => {
    setCurrentAdventure(0);
    setCurrentPage(0);
    setScore(0);
    setInteractionComplete(false);
    setSelectedOption(null);
    setShowLevelComplete(false);
    setShowMotivational(false);
  };

  const handleNextLevel = () => {
    if (currentAdventure < adventures.length - 1) {
      setCurrentAdventure(currentAdventure + 1);
      setCurrentPage(0);
      setScore(0);
      setShowLevelComplete(false);
    } else {
      onBack(); // Todas completadas
    }
  };

  const getAnimalMessage = () => {
    if (page.interactive?.type === 'choice') return "¡Elige lo que creas correcto!";
    if (page.interactive?.type === 'question') return "¡Responde la pregunta!";
    return "¡Lee con atención y disfruta la historia!";
  };

  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'pirates': return 'from-amber-100 via-orange-100 to-red-100';
      case 'space': return 'from-indigo-100 via-purple-100 to-pink-100';
      case 'jungle': return 'from-green-100 via-lime-100 to-emerald-100';
      default: return 'from-blue-100 via-purple-100 to-pink-100';
    }
  };

  if (!gameStarted) {
    return <StartScreenMiniAventuras onStart={() => setGameStarted(true)} onBack={onBack} />;
  }

  return (
    <div className={`min-h-screen p-6 bg-gradient-to-br ${getThemeGradient(adventure.theme)}`}>
      <div className="max-w-7xl mx-auto">

        <GameHeader
          title="Mini Aventuras"
          level={currentAdventure + 1}
          score={score}
          onBack={onBack}
          onRestart={handleRestart}
        />

        <ProgressBar
          current={currentPage + 1}
          total={totalPages}
          progress={progress}
        />

        <AnimalGuide
          animal="owl"
          message={getAnimalMessage()}
          onRepeat={playPageAudio}
        />

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dyslexia-friendly">
            {adventure.title}
          </h2>
        </div>

        <motion.div
          key={`${currentAdventure}-${currentPage}`}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 text-black">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center">
                  <div className="text-9xl mb-4">{page.image}</div>
                  <Button
                    onClick={playPageAudio}
                    disabled={isPlaying}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    {isPlaying ? "Reproduciendo..." : "Escuchar"}
                  </Button>
                </div>

                <div>
                  <p className="text-lg leading-relaxed text-gray-800 dyslexia-friendly mb-6">
                    {page.text}
                  </p>

     
                  {page.interactive && (
                    <Card className="bg-yellow-50 border-2 border-yellow-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3 text-yellow-800">
                          {page.interactive.content}
                        </h4>
                        <div className="space-y-2">
                          {page.interactive.options.map((opt, i) => (
                            <Button
                              key={i}
                              onClick={() => handleInteraction(i)}
                              disabled={interactionComplete}
                              variant={
                                selectedOption === i
                                  ? (page.interactive?.correct === i ? "default" : "destructive")
                                  : "outline"
                              }
                              className={`w-full justify-start ${
                                selectedOption === i
                                  ? (page.interactive?.correct === i
                                      ? "bg-green-500 hover:bg-green-600 text-black"
                                      : "bg-red-500 hover:bg-red-600 text-black")
                                  : ""
                              }`}
                            >
                              {opt}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-between items-center">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage === 0 && currentAdventure === 0}
            variant="outline"
            className="bg-green-500 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {adventure.pages.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === currentPage ? 'bg-blue-500' : i < currentPage ? 'bg-green-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={goToNextPage}
            disabled={page.interactive && !interactionComplete}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {currentPage === totalPages - 1 ? "Finalizar" : "Siguiente"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>


        <RewardAnimation
          type="star"
          show={showReward}
          message="¡Respuesta correcta!"
          onComplete={() => setShowReward(false)}
        />

        {showMotivational && (
          <MotivationalMessage
            score={score}
            total={totalPages * 10}
            customMessage="¡Has leído toda la aventura!"
            customSubtitle="Completaste todas las páginas con éxito"
            onComplete={() => {
              setShowMotivational(false);
              setShowLevelComplete(true);
            }}
          />
        )}

        {showLevelComplete && (
          <LevelCompleteModal
            score={score}
            total={totalPages * 10}
            level={currentAdventure + 1}
            isLastLevel={currentAdventure >= adventures.length - 1}
            onNextLevel={handleNextLevel}
            onRestart={handleRestart}
            onExit={onBack}
          />
        )}

      </div>
    </div>
  );
}