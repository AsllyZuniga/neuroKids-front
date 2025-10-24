import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, Star, ChevronLeft, ChevronRight, BookOpen, MapPin } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';

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
      }
    ]
  }
];

export function MiniAventuras({ onBack, level }: MiniAventurasProps) {
  const [currentAdventure, setCurrentAdventure] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [score, setScore] = useState(0);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [interactionComplete, setInteractionComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const adventure = adventures[currentAdventure];
  const page = adventure.pages[currentPage];
  const progress = ((currentPage + 1) / adventure.pages.length) * 100;

  const playPageAudio = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const handleInteraction = (optionIndex: number) => {
    if (interactionComplete) return;
    
    setSelectedOption(optionIndex);
    
    if (page.interactive && page.interactive.correct !== undefined) {
      if (optionIndex === page.interactive.correct) {
        setScore(score + 15);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 1500);
      } else {
        setScore(Math.max(0, score - 5));
      }
    } else {
      setScore(score + 10);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    }
    
    setInteractionComplete(true);
  };

  const goToNextPage = () => {
    if (currentPage < adventure.pages.length - 1) {
      setCurrentPage(currentPage + 1);
      setInteractionComplete(false);
      setSelectedOption(null);
    } else {
      if (currentAdventure < adventures.length - 1) {
        setCurrentAdventure(currentAdventure + 1);
        setCurrentPage(0);
        setInteractionComplete(false);
        setSelectedOption(null);
      } else {
        setReadingComplete(true);
      }
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setInteractionComplete(false);
      setSelectedOption(null);
    } else if (currentAdventure > 0) {
      setCurrentAdventure(currentAdventure - 1);
      setCurrentPage(adventures[currentAdventure - 1].pages.length - 1);
      setInteractionComplete(false);
      setSelectedOption(null);
    }
  };

  const restartReading = () => {
    setCurrentAdventure(0);
    setCurrentPage(0);
    setScore(0);
    setReadingComplete(false);
    setShowReward(false);
    setInteractionComplete(false);
    setSelectedOption(null);
  };

  if (readingComplete) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-4 bg-white/80 backdrop-blur-sm border-2 hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al dashboard
        </Button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🗺️</div>
              
              <h2 className="text-3xl mb-4 text-gray-800">
                ¡Aventuras Completadas!
              </h2>
              
              <div className="text-xl mb-6 text-gray-600">
                Puntuación: {score} puntos
              </div>
              
              <div className="text-gray-600 mb-6">
                ¡Has completado todas las mini aventuras! Eres un verdadero explorador de historias.
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={restartReading}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3"
                >
                  Leer de nuevo
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Volver al dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const getThemeGradient = (theme: string) => {
    switch (theme) {
      case 'pirates':
        return 'from-amber-100 via-orange-100 to-red-100';
      case 'space':
        return 'from-indigo-100 via-purple-100 to-pink-100';
      default:
        return 'from-blue-100 via-purple-100 to-pink-100';
    }
  };

  return (
    <div className={`min-h-screen p-6 bg-gradient-to-br ${getThemeGradient(adventure.theme)}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-2 hover:bg-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl text-gray-800 dyslexia-friendly">
              🗺️ Mini Aventuras
            </h1>
            <div className="flex items-center gap-2 justify-center mt-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Puntos: {score}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">
              {adventure.title}
            </div>
            <div className="text-xs text-gray-500">
              Página {currentPage + 1} de {adventure.pages.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-3 bg-white/50" />
        </div>

        {/* Adventure Title */}
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            Aventura {currentAdventure + 1}
          </Badge>
          <h2 className="text-2xl text-gray-800 dyslexia-friendly">
            {adventure.title}
          </h2>
        </div>

        {/* Animal Guide */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <AnimalGuide
            animal="turtle"
            message="¡Bienvenido a las mini aventuras! Lee con calma y participa en las actividades interactivas para ganar puntos extra."
          />
        </motion.div>

        {/* Story Content */}
        <motion.div
          key={`${currentAdventure}-${currentPage}`}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 mb-6">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Story Image */}
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

                {/* Story Text */}
                <div className="text-center md:text-left">
                  <div className="text-lg leading-relaxed text-gray-800 dyslexia-friendly mb-6">
                    {page.text}
                  </div>

                  {/* Interactive Element */}
                  {page.interactive && (
                    <Card className="bg-yellow-50 border-2 border-yellow-200">
                      <CardContent className="p-4">
                        <h4 className="text-lg mb-4 text-yellow-800">
                          {page.interactive.content}
                        </h4>
                        
                        <div className="space-y-2">
                          {page.interactive.options.map((option, index) => (
                            <Button
                              key={index}
                              onClick={() => handleInteraction(index)}
                              disabled={interactionComplete}
                              variant={
                                selectedOption === index
                                  ? page.interactive?.correct === index
                                    ? "default"
                                    : "destructive"
                                  : "outline"
                              }
                              className={`w-full justify-start ${
                                selectedOption === index
                                  ? page.interactive?.correct === index
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                                  : ""
                              }`}
                            >
                              {option}
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

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={goToPreviousPage}
            disabled={currentPage === 0 && currentAdventure === 0}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <div className="flex gap-2">
            {adventure.pages.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentPage
                    ? 'bg-blue-500'
                    : index < currentPage
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button
            onClick={goToNextPage}
            disabled={page.interactive && !interactionComplete}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {currentPage === adventure.pages.length - 1 && currentAdventure === adventures.length - 1 
              ? "Finalizar" 
              : "Siguiente"
            }
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Reward Animation */}
        {showReward && (
          <RewardAnimation
            type="star"
            show={showReward}
            message="¡Excelente respuesta!"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </div>
  );
}