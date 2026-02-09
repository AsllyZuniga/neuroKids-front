import { useState, useEffect, useCallback } from 'react';
import { motion } from "framer-motion";
import {  RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { ButtonWithAudio } from '../../../ui/ButtonWithAudio';
import { Card, CardContent } from '../../../ui/card';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { GameHeader } from '../../../others/GameHeader';
import { ProgressBar } from '../../../others/ProgressBar';
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { ConfettiExplosion } from '../../../others/ConfettiExplosion';
import { StartScreenOrdenaHistoria } from "../IniciosJuegosLecturas/StartScreenOrdenaHistoria";
import { speakText, canSpeakOnHover } from '../../../../utils/textToSpeech';
import { useProgress } from '../../../../hooks/useProgress';

interface OrdenaHistoriaProps {
  onBack: () => void;
}

interface StoryFragment {
  id: number;
  text: string;
  correctOrder: number;
  currentPosition?: number;
}

interface Story {
  title: string;
  fragments: StoryFragment[];
}

interface Level {
  level: number;
  stories: Story[];
}

const levels: Level[] = [
  {
    level: 1,
    stories: [
      {
        title: "El día en el parque",
        fragments: [
          { id: 1, text: "María se despertó muy temprano.", correctOrder: 1 },
          { id: 2, text: "Desayunó y se vistió rápidamente.", correctOrder: 2 },
          { id: 3, text: "Salió de casa con su pelota favorita.", correctOrder: 3 },
          { id: 4, text: "En el parque encontró a sus amigos.", correctOrder: 4 },
          { id: 5, text: "Jugaron fútbol hasta que se hizo de noche.", correctOrder: 5 },
          { id: 6, text: "Regresó a casa muy feliz.", correctOrder: 6 }
        ]
      },
      {
        title: "La visita al zoológico",
        fragments: [
          { id: 1, text: "Ana y su familia planearon un viaje al zoológico.", correctOrder: 1 },
          { id: 2, text: "Llegaron temprano y compraron entradas.", correctOrder: 2 },
          { id: 3, text: "Vieron primero a los leones.", correctOrder: 3 },
          { id: 4, text: "Luego alimentaron a las jirafas.", correctOrder: 4 },
          { id: 5, text: "Regresaron a casa con fotos y recuerdos felices.", correctOrder: 5 }
          
        ]
      },
      {
        title: "El día de la bicicleta",
        fragments: [
          { id: 1, text: "Pedro decidió salir a andar en bicicleta.", correctOrder: 1 },
          { id: 2, text: "Pedaleó hasta el parque.", correctOrder: 2 },
          { id: 3, text: "Encontró a su amigo Luis practicando trucos.", correctOrder: 3 },
          { id: 4, text: "Juntos corrieron carreras y rieron mucho.", correctOrder: 4 },
          { id: 5, text: "Volvió a casa antes de que anocheciera.", correctOrder: 5 }
        ]
      },
    ]
  },
  {
    level: 2,
    stories: [
      {
        title: "La aventura del gatito",
        fragments: [
          { id: 1, text: "Un pequeño gatito se perdió en el bosque.", correctOrder: 1 },
          { id: 2, text: "Se encontró con un búho sabio en un árbol.", correctOrder: 2 },
          { id: 3, text: "El búho le enseñó el camino correcto.", correctOrder: 3 },
          { id: 4, text: "El gatito siguió las indicaciones cuidadosamente.", correctOrder: 4 },
          { id: 5, text: "Finalmente llegó a casa donde lo esperaba su familia.", correctOrder: 5 }
        ]
      },
      {
        title: "El viaje al mar",
        fragments: [
          { id: 1, text: "La familia empacó sus maletas para las vacaciones.", correctOrder: 1 },
          { id: 2, text: "Llegaron a la playa y se instalaron en el hotel.", correctOrder: 2 },
          { id: 3, text: "Nadaron en el mar y construyeron castillos de arena.", correctOrder: 3 },
          { id: 4, text: "Vieron un hermoso atardecer.", correctOrder: 4 },
          { id: 5, text: "Regresaron a casa con lindos recuerdos.", correctOrder: 5 }
        ]
      },
      {
        title: "El festival de cometas",
        fragments: [
          { id: 1, text: "Clara y sus amigos planearon ir al festival de cometas.", correctOrder: 1 },
          { id: 2, text: "Construyeron una cometa con papel de colores.", correctOrder: 2 },
          { id: 3, text: "Llegaron al campo donde había mucho viento.", correctOrder: 3 },
          { id: 4, text: "Hicieron volar su cometa más alto que las demás.", correctOrder: 4 },
          { id: 5, text: "Ganaron un premio por la cometa más creativa.", correctOrder: 5 }
        ]
      },
      {
        title: "La receta secreta",
        fragments: [
          { id: 1, text: "La abuela invitó a Lucía a cocinar galletas.", correctOrder: 1 },
          { id: 2, text: "Buscaron los ingredientes en la despensa.", correctOrder: 2 },
          { id: 3, text: "Mezclaron harina, azúcar y huevos en un tazón.", correctOrder: 3 },
          { id: 4, text: "Formaron las galletas y las pusieron en el horno.", correctOrder: 4 },
          { id: 5, text: "Todos disfrutaron las galletas calientes.", correctOrder: 5 }
        ]
      },
    ]
  },
  {
    level: 3,
    stories: [
      {
        title: "La fiesta de cumpleaños",
        fragments: [
          { id: 1, text: "Juan invitó a sus amigos a su fiesta.", correctOrder: 1 },
          { id: 2, text: "Decoraron la casa con globos y guirnaldas.", correctOrder: 2 },
          { id: 3, text: "Prepararon una deliciosa torta.", correctOrder: 3 },
          { id: 4, text: "Los invitados llegaron con regalos.", correctOrder: 4 },
          { id: 5, text: "Jugaron juegos y cantaron feliz cumpleaños.", correctOrder: 5 },
          { id: 6, text: "Juan abrió sus regalos al final de la fiesta.", correctOrder: 6 }
        ]
      },
      {
        title: "El rescate del perrito",
        fragments: [
          { id: 1, text: "Un perrito quedó atrapado en un árbol.", correctOrder: 1 },
          { id: 2, text: "Los niños del vecindario lo escucharon ladrar.", correctOrder: 2 },
          { id: 3, text: "Llamaron a los bomberos para que ayudaran.", correctOrder: 3 },
          { id: 4, text: "Los bomberos trajeron una escalera alta.", correctOrder: 4 },
          { id: 5, text: "Rescataron al perrito con cuidado.", correctOrder: 5 },
          { id: 6, text: "El perrito agradeció moviendo la cola.", correctOrder: 6 }
        ]
      },
      {
        title: "La excursión a la montaña",
        fragments: [
          { id: 1, text: "El grupo escolar planearon una excursión a la montaña.", correctOrder: 1 },
          { id: 2, text: "Empacaron mochilas con agua y bocadillos.", correctOrder: 2 },
          { id: 3, text: "Caminaron por un sendero rodeado de pinos.", correctOrder: 3 },
          { id: 4, text: "Descubrieron una cueva escondida detrás de unas rocas.", correctOrder: 4 },
          { id: 5, text: "Exploraron la cueva con linternas y cuidado.", correctOrder: 5 },
          { id: 6, text: "Regresaron al campamento contando historias.", correctOrder: 6 }
        ]
      },
      {
        title: "El huerto de la escuela",
        fragments: [
          { id: 1, text: "Los estudiantes decidieron crear un huerto escolar.", correctOrder: 1 },
          { id: 2, text: "Sembraron semillas de zanahorias y tomates.", correctOrder: 2 },
          { id: 3, text: "Regaron las plantas todos los días con cuidado.", correctOrder: 3 },
          { id: 4, text: "Vieron cómo crecían las primeras hojas verdes.", correctOrder: 4 },
          { id: 5, text: "Cosecharon los vegetales después de semanas.", correctOrder: 5 },
          { id: 6, text: "Prepararon una ensalada para compartir en clase.", correctOrder: 6 }
        ]
      }
    ]
  }
];

export function OrdenaHistoria({ onBack }: OrdenaHistoriaProps) {
  const { saveProgress } = useProgress();
  const [gameStarted, setGameStarted] = useState(false);
  const MAX_LEVEL = 3;
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [fragments, setFragments] = useState<StoryFragment[]>([]);
  const [userOrder, setUserOrder] = useState<StoryFragment[]>([]);
  const [score, setScore] = useState(0);
  const [draggedFragment, setDraggedFragment] = useState<StoryFragment | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const initializeStory = useCallback(() => {
    const currentStory = levels[currentLevel - 1].stories[currentStoryIndex];
    const shuffledFragments = [...currentStory.fragments].sort(() => Math.random() - 0.5);
    setFragments(shuffledFragments);
    setUserOrder([]);
    setShowResult(false);
    setAttempts(0);
  }, [currentLevel, currentStoryIndex]);

  useEffect(() => {
    initializeStory();
  }, [initializeStory]);

const handleDragStart = (fragment: StoryFragment) => {
  setDraggedFragment(fragment);
};



  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

const handleDrop = (e: React.DragEvent, position?: number) => {
  e.preventDefault();
  if (!draggedFragment) return;

  setUserOrder(prev => {
    const newOrder = [...prev];
    const fromIndex = newOrder.findIndex(f => f.id === draggedFragment.id);

    // 👉 VIENE DESDE FRAGMENTS → SIEMPRE AL FINAL
    if (fromIndex === -1) {
      newOrder.push(draggedFragment);
    } 
    // 👉 VIENE DESDE USERORDER → REORDENAR
    else {
      newOrder.splice(fromIndex, 1);
      const insertIndex = position === undefined ? newOrder.length : position;
      newOrder.splice(insertIndex, 0, draggedFragment);
    }

    return newOrder;
  });

  setFragments(prev => prev.filter(f => f.id !== draggedFragment.id));
  setDraggedFragment(null);
};




const handleFragmentClick = (fragment: StoryFragment) => {
  if (userOrder.some(f => f.id === fragment.id)) return;

  setUserOrder(prev => [...prev, fragment]);
  setFragments(prev => prev.filter(f => f.id !== fragment.id));
};


  const handleRemoveFromOrder = (fragmentId: number) => {
    const fragmentToRemove = userOrder.find(f => f.id === fragmentId);
    if (fragmentToRemove) {
      setUserOrder(userOrder.filter(f => f.id !== fragmentId));
      setFragments([...fragments, fragmentToRemove]);
    }
  };

  const checkOrder = () => {
    if (userOrder.length !== levels[currentLevel - 1].stories[currentStoryIndex].fragments.length) {
      alert("Debes ordenar todas las frases antes de verificar.");
      return;
    }

    setAttempts(attempts + 1);
    const isCorrect = userOrder.every((fragment, index) => 
      fragment.correctOrder === index + 1
    );

    if (isCorrect) {
      const points = Math.max(30 - (attempts * 5), 10);
      setScore(prev => prev + points);
      setShowReward(true);
      setTimeout(() => {
        setShowReward(false);
        if (currentStoryIndex < levels[currentLevel - 1].stories.length - 1) {
          setCurrentStoryIndex(prev => prev + 1);
        } else {
          setShowMotivational(true);
        }
      }, 3000);
    } else {
      setShowResult(true);
      setTimeout(() => setShowResult(false), 2000);
    }
  };

  const handleNextLevel = async () => {
    // Guardar progreso del nivel completado
    await saveProgress({
      activityId: 'ordena-historia',
      activityName: 'Ordena la Historia',
      activityType: 'juego',
      ageGroup: '9-10',
      level: currentLevel,
      score: score,
      maxScore: levels[currentLevel - 1].stories.length * 100,
      completed: true
    });

    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      setGameComplete(true);
    }
    setShowMotivational(false);
    setShowLevelComplete(false);
  };

  const handleRepeatLevel = () => {
    setCurrentStoryIndex(0);
    setScore(0);
    setShowMotivational(false);
    setShowLevelComplete(false);
    initializeStory();
  };

  const handleRestartGame = () => {
    setCurrentLevel(1);
    setCurrentStoryIndex(0);
    setScore(0);
    setGameComplete(false);
    setShowMotivational(false);
    setShowLevelComplete(false);
    initializeStory();
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
        <ConfettiExplosion show={true} />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-2xl mx-auto text-center">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">Trophy</div>
              <h2 className="text-3xl mb-4 text-black">¡Has completado todos los niveles!</h2>
              <div className="text-xl mb-6 text-black">Puntuación final: {score} puntos</div>
              <div className="flex justify-center gap-4">
                <ButtonWithAudio onClick={handleRestartGame} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3" playOnHover audioText="Jugar de nuevo">Jugar de nuevo</ButtonWithAudio>
                <ButtonWithAudio onClick={onBack} variant="outline" className="px-6 py-3" playOnHover audioText="Volver al dashboard">Volver al dashboard</ButtonWithAudio>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentStories = levels[currentLevel - 1].stories;
  const progress = ((currentStoryIndex) / currentStories.length) * 100;

  if (!gameStarted) {
    return <StartScreenOrdenaHistoria onStart={() => setGameStarted(true)} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <GameHeader
          title="Ordena la Historia"
          level={currentLevel}
          score={score}
          onBack={onBack}
          onRestart={handleRepeatLevel}
        />

        <ProgressBar
          current={currentStoryIndex + 1}
          total={currentStories.length}
          progress={progress}
          className="mb-6"
        />

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <AnimalGuide
            animal="monkey"
            message="Lee cada frase con paciencia y ordénalas para formar una historia completa. ¡Puedes arrastrar las frases o hacer clic en ellas!"
          />
        </motion.div>

        <div className="text-center mb-6">
          <h2 className="text-2xl text-black">"{currentStories[currentStoryIndex].title}"</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg mb-4 text-black">Frases disponibles:</h3>
            <div className="space-y-3">
              {fragments.map((fragment) => (
                <motion.div
                  key={fragment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                 
                >
                  <Card
                    className="cursor-move bg-white/80 hover:bg-white border-2 border-blue-200 hover:border-blue-400 transition-all"
                    draggable
                    role="button"
                    tabIndex={0}
                    aria-label={fragment.text}
                    onFocus={() => speakText(fragment.text, { voiceType: 'child' })}
                    onMouseEnter={() => {
                      if (canSpeakOnHover()) speakText(fragment.text, { voiceType: 'child' });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleFragmentClick(fragment);
                      }
                    }}
                    onDragStart={() => handleDragStart(fragment)}
                    onClick={() => handleFragmentClick(fragment)}
                    
                  >
                    <CardContent className="p-4">
                      <p className="text-black leading-relaxed">{fragment.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-black">Tu historia ordenada:</h3>
              <ButtonWithAudio onClick={initializeStory} variant="outline" size="sm" className="bg-blue-500" playOnHover audioText="Reiniciar historia">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </ButtonWithAudio>
            </div>
            <div className="space-y-3 min-h-[400px]">
              {userOrder.map((fragment, index) => (
                
                <motion.div
                  key={fragment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <Card
                    draggable
                    onDragStart={() => handleDragStart(fragment)}
                    className="bg-green-50 border-2 border-green-300"
                    tabIndex={0}
                    aria-label={fragment.text}
                    onFocus={() => speakText(fragment.text, { voiceType: 'child' })}
                    onMouseEnter={() => {
                      if (canSpeakOnHover()) speakText(fragment.text, { voiceType: 'child' });
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                        <p className="text-black leading-relaxed flex-1">{fragment.text}</p>
                        <ButtonWithAudio onClick={() => handleRemoveFromOrder(fragment.id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700" playOnHover audioText="Quitar frase">X</ButtonWithAudio>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {userOrder.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500" onDragOver={handleDragOver} onDrop={handleDrop}>
                  Arrastra las frases aquí para ordenar la historia
                </div>
              )}
            </div>

            <div className="mt-6 text-center">
              <ButtonWithAudio
                onClick={checkOrder}
                disabled={userOrder.length !== currentStories[currentStoryIndex].fragments.length}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
                playOnHover
                audioText="Verificar orden"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Verificar orden
              </ButtonWithAudio>
            </div>
          </div>
        </div>

        {showResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-4 right-4 bg-red-100 border-2 border-red-300 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">No es el orden correcto. ¡Inténtalo de nuevo!</span>
          </motion.div>
        )}

        <RewardAnimation type="confetti" show={showReward} message="¡Historia ordenada correctamente!" />

        {showMotivational && (
          <MotivationalMessage
            score={score}
            total={currentStories.length * 100}
            customMessage="¡Eres un maestro de las historias!"
            customSubtitle="¡Has ordenado todas las historias del nivel!"
            celebrationText="¡Eres increible!"
            onComplete={() => {
              setShowMotivational(false);
              setShowLevelComplete(true);
            }}
          />
        )}

        {showLevelComplete && (
          <LevelCompleteModal
            score={score}
            total={currentStories.length * 100}
            level={currentLevel}
            isLastLevel={currentLevel >= MAX_LEVEL}
            onNextLevel={handleNextLevel}
            onRestart={handleRepeatLevel}
            onExit={onBack}
          />
        )}
      </div>
    </div>
  );
}