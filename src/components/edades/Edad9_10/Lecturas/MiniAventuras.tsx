import { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { GameHeader } from '../../../others/GameHeader';
import { ProgressBar } from '../../../others/ProgressBar';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { StartScreenMiniAventuras } from '../IniciosJuegosLecturas/StartScreenMiniAventuras';
import img1 from '../../../../assets/9_10/mini_aventuras/nivel1/1.png';
import img2 from '../../../../assets/9_10/mini_aventuras/nivel1/2.png';
import img3 from '../../../../assets/9_10/mini_aventuras/nivel1/3.png';
import img4 from '../../../../assets/9_10/mini_aventuras/nivel1/4.png';
import img5 from '../../../../assets/9_10/mini_aventuras/nivel1/5.png';
import img6 from '../../../../assets/9_10/mini_aventuras/nivel1/6.png';
import img7 from '../../../../assets/9_10/mini_aventuras/nivel1/7.png';
import img8 from '../../../../assets/9_10/mini_aventuras/nivel1/8.png';
import image1 from '../../../../assets/9_10/mini_aventuras/nivel2/1.png';
import image2 from '../../../../assets/9_10/mini_aventuras/nivel2/2.png';
import image3 from '../../../../assets/9_10/mini_aventuras/nivel2/3.png'; 
import image4 from '../../../../assets/9_10/mini_aventuras/nivel2/4.png';
import image5 from '../../../../assets/9_10/mini_aventuras/nivel2/5.png';
import image6 from '../../../../assets/9_10/mini_aventuras/nivel2/6.png';
import image7 from '../../../../assets/9_10/mini_aventuras/nivel2/7.png';
import image8 from '../../../../assets/9_10/mini_aventuras/nivel2/8.png';
import imgA1 from '../../../../assets/9_10/mini_aventuras/nivel3/1.png';
import imgA2 from '../../../../assets/9_10/mini_aventuras/nivel3/2.png';
import imgA3 from '../../../../assets/9_10/mini_aventuras/nivel3/3.png';
import imgA4 from '../../../../assets/9_10/mini_aventuras/nivel3/4.png';  
import imgA5 from '../../../../assets/9_10/mini_aventuras/nivel3/5.png';
import imgA6 from '../../../../assets/9_10/mini_aventuras/nivel3/6.png';
import imgA7 from '../../../../assets/9_10/mini_aventuras/nivel3/7.png';
import imgA8 from '../../../../assets/9_10/mini_aventuras/nivel3/8.png';


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
        image: img1
      },
      {
        id: 2,
        text: "Un día, Bobby decidió esconder su tesoro más preciado en una isla misteriosa. Era un cofre lleno de libros de aventuras y mapas antiguos.",
        image: img2,
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
        image: img3,

      },
      {
        id: 4,
        text: "Años después, una niña llamada Sara encontró el mapa de Bobby en una botella en la playa. Sus ojos brillaron de emoción al ver todas las pistas dibujadas.",
        image: img4,
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
        image: img5,
      },
      {
        id: 6,
        text: "¡Al final de la cueva, Sara encontró el tesoro de Bobby! Cuando abrió el cofre, sus ojos se llenaron de alegría al ver todos esos libros maravillosos. Ahora tenía aventuras para leer durante todo el año.",
        image: img6,

      },
      {
        id: 7,
        text: "Sara decidió compartir los libros con sus amigos. Juntos, leyeron historias de piratas valientes y tesoros escondidos, inspirando nuevas aventuras.",
        image: img7,
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
        image: img8,

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
        image: image1,

      },
      {
        id: 2,
        text: "Un día, la computadora de la estación detectó señales extrañas viniendo de un planeta azul muy lejano. Las señales parecían un patrón musical repetitivo.",
        image: image2,
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
        image: image3,

      },
      {
        id: 4,
        text: "Al llegar al planeta, Luna descubrió que estaba habitado por criaturas luminosas que se comunicaban exclusivamente a través de música. Eran muy amigables y le enseñaron sus canciones.",
        image: image4,
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
        image: image5,
      },
      {
        id: 6,
        text: "Luna regresó a la Tierra con una grabación de la música alienígena. Ahora, cada vez que la gente de la Tierra escucha esas melodías, recuerda que en el universo hay seres que viven en armonía a través de la música.",
        image: image6,
      },
      {
        id: 7,
        text: "De vuelta en la Tierra, Luna compartió su experiencia en una conferencia. Los científicos se emocionaron y planearon más misiones para explorar otros planetas musicales.",
        image: image7,
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
        image: image8,
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
        image: imgA1,

      },
      {
        id: 2,
        text: "En la jungla, los animales hablaban y las plantas brillaban con colores vibrantes. Alex se maravilló con todo lo que veía.",
        image: imgA2,
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
        image: imgA3,

      },
      {
        id: 4,
        text: "Alex cruzó el río resolviendo acertijos difíciles y evitando trampas naturales.",
        image: imgA4,

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
        image: imgA5,

      },
      {
        id: 6,
        text: "Alex plantó las semillas y la jungla se volvió aún más hermosa y llena de vida. Desde entonces, protegió el secreto para que otros pudieran descubrirlo.",
        image: imgA6,
   
      },
      {
        id: 7,
        text: "Alex hizo amigos con más animales en la jungla, como un elefante sabio que le enseñó sobre la importancia de la conservación.",
        image: imgA7,

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
        image: imgA8,

      }
    ]
  }
];

export function MiniAventuras({ onBack }: MiniAventurasProps) {
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
  const [showQuestion, setShowQuestion] = useState(false);
  const adventure = adventures[currentAdventure];
  const page = adventure.pages[currentPage];
  const totalPages = adventure.pages.length;
  const progress = (currentPage / totalPages) * 100;
 const [isSpeaking, setIsSpeaking] = useState(false);



const playPageAudio = () => {
  if (!window.speechSynthesis) return;

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(page.text);
  utterance.lang = "es-ES";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  utterance.onstart = () => setIsSpeaking(true);
  utterance.onend = () => setIsSpeaking(false);
  utterance.onerror = () => setIsSpeaking(false);

  window.speechSynthesis.speak(utterance);
};



  const handleInteraction = (optionIndex: number) => {
  if (interactionComplete) return;

  setSelectedOption(optionIndex);
  setInteractionComplete(true);

  const isCorrect = page.interactive?.correct === optionIndex;

  if (isCorrect) {
    setScore(prev => prev + 15);
    setShowReward(true);
    setTimeout(() => setShowReward(false), 1500);
  }
};


  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setInteractionComplete(false);
      setSelectedOption(null);
      setShowQuestion(false);
    } else {
      setShowMotivational(true);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setInteractionComplete(false);
      setSelectedOption(null);
      setShowQuestion(false);
    }
  };

  const handleRestart = () => {
    setCurrentAdventure(0);
    setCurrentPage(0);
    setScore(0);
    setInteractionComplete(false);
    setSelectedOption(null);
    setShowQuestion(false);
    setShowLevelComplete(false);
    setShowMotivational(false);
  };

  const handleNextLevel = () => {
    if (currentAdventure < adventures.length - 1) {
      setCurrentAdventure(currentAdventure + 1);
      setCurrentPage(0);
      setScore(0);
      setShowQuestion(false);
      setShowLevelComplete(false);
    } else {
      onBack(); // Todas completadas
    }
  };

  const getAnimalMessage = () => {
    if (page.interactive && !showQuestion) return "¡Elige lo que creas correcto!";
    if (page.interactive && showQuestion) return "¡Responde la pregunta!";
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
useEffect(() => {
  window.speechSynthesis.cancel();
  setIsSpeaking(false);
}, [currentPage, currentAdventure]);



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
          animal="frog"
          message={getAnimalMessage()}
        />

        <div className="text-center mb-4">
          <h2 className="text-2xl  text-gray-800 ">
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
            <CardContent className="p-14">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center">
                  <motion.img src={page.image} alt="ilustración" className="w-64 h-64 mx-auto object-contain mb-4" 
                  initial={{ scale: 0.8, opacity: 0}}
                  animate={{ scale: 1, opacity: 1 }}
                  />
                  <Button
                    onClick={playPageAudio}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    {isSpeaking ? "Reproduciendo..." : "Escuchar"}
                  </Button>
                </div>


                <div>
                  {/* TEXTO */}
                  {(!page.interactive || !showQuestion) && (
                    <p className="text-xl md:text-2xl lg:text-2xl leading-relaxed text-black mb-6">
                      {page.text}
                    </p>
                  )}

                  {/* BOTÓN */}
                  {page.interactive && !showQuestion && (
                    <Button
                      onClick={() => setShowQuestion(true)}
                      className="mb-4 bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      Responder pregunta
                    </Button>
                  )}

                  {/* PREGUNTA */}
                  {page.interactive && showQuestion && (
                    <Card className="bg-yellow-50 border-2 border-yellow-200">
                      <CardContent className="p-4">
                        <h4 className=" text-xl md:text-xl lg:text-xl leading-relaxed mb-3 text-yellow-800">
                          {page.interactive.content}
                        </h4>
                        <div className="space-y-2">
                          {page.interactive.options.map((opt, i) => (
                            <Button
                              key={i}
                              onClick={() => handleInteraction(i)}
                              disabled={interactionComplete}
                              className="w-full justify-start"
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

        <div className="flex justify-between">
          <Button onClick={goToPreviousPage} 
          className="bg-green-500 backdrop-blur-sm"
          >       
        <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

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
          onComplete={() => setShowReward(false)} />

        {showMotivational &&
          (<MotivationalMessage
            score={score}
            total={totalPages * 10}
            customMessage="¡Has leído toda la aventura!"
            customSubtitle="Completaste todas las páginas con éxito"
            celebrationText="¡Que habilidad!"
            onComplete={() => {
              setShowMotivational(false);
              setShowLevelComplete(true);
            }} />)}

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