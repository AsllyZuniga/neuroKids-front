import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Star, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';

interface OrdenaHistoriaProps {
  onBack: () => void;
  level: number;
}

interface StoryFragment {
  id: number;
  text: string;
  correctOrder: number;
  currentPosition?: number;
}

const stories = [
  {
    title: "El día en el parque",
    fragments: [
      { id: 1, text: "María se despertó muy temprano en la mañana.", correctOrder: 1 },
      { id: 2, text: "Desayunó cereal con leche y se vistió rápidamente.", correctOrder: 2 },
      { id: 3, text: "Salió de casa con su pelota favorita.", correctOrder: 3 },
      { id: 4, text: "En el parque encontró a sus amigos jugando.", correctOrder: 4 },
      { id: 5, text: "Jugaron fútbol toda la tarde hasta que se hizo de noche.", correctOrder: 5 },
      { id: 6, text: "Regresó a casa feliz y cansada del día.", correctOrder: 6 }
    ]
  },
  {
    title: "La aventura del gatito",
    fragments: [
      { id: 1, text: "Un pequeño gatito se perdió en el bosque.", correctOrder: 1 },
      { id: 2, text: "Caminó durante horas buscando el camino a casa.", correctOrder: 2 },
      { id: 3, text: "Se encontró con un búho sabio en un árbol.", correctOrder: 3 },
      { id: 4, text: "El búho le enseñó el camino correcto.", correctOrder: 4 },
      { id: 5, text: "El gatito siguió las indicaciones cuidadosamente.", correctOrder: 5 },
      { id: 6, text: "Finalmente llegó a casa donde lo esperaba su familia.", correctOrder: 6 }
    ]
  }
];

export function OrdenaHistoria({ onBack, level }: OrdenaHistoriaProps) {
  const [currentStory, setCurrentStory] = useState(0);
  const [fragments, setFragments] = useState<StoryFragment[]>([]);
  const [userOrder, setUserOrder] = useState<StoryFragment[]>([]);
  const [score, setScore] = useState(0);
  const [draggedFragment, setDraggedFragment] = useState<StoryFragment | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    initializeStory();
  }, [currentStory]);

  const initializeStory = () => {
    const story = stories[currentStory];
    const shuffledFragments = [...story.fragments].sort(() => Math.random() - 0.5);
    setFragments(shuffledFragments);
    setUserOrder([]);
    setShowResult(false);
    setAttempts(0);
  };

  const handleDragStart = (fragment: StoryFragment) => {
    setDraggedFragment(fragment);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, position: number) => {
    e.preventDefault();
    if (!draggedFragment) return;

    const newUserOrder = [...userOrder];
    
    // Remove fragment from its current position if it exists
    const existingIndex = newUserOrder.findIndex(f => f.id === draggedFragment.id);
    if (existingIndex !== -1) {
      newUserOrder.splice(existingIndex, 1);
    }

    // Insert fragment at new position
    newUserOrder.splice(position, 0, draggedFragment);
    setUserOrder(newUserOrder);

    // Remove from available fragments
    setFragments(fragments.filter(f => f.id !== draggedFragment.id));
    setDraggedFragment(null);
  };

  const handleFragmentClick = (fragment: StoryFragment) => {
    // Move fragment to user order
    setUserOrder([...userOrder, fragment]);
    setFragments(fragments.filter(f => f.id !== fragment.id));
  };

  const handleRemoveFromOrder = (fragmentId: number) => {
    const fragmentToRemove = userOrder.find(f => f.id === fragmentId);
    if (fragmentToRemove) {
      setUserOrder(userOrder.filter(f => f.id !== fragmentId));
      setFragments([...fragments, fragmentToRemove]);
    }
  };

  const checkOrder = () => {
    if (userOrder.length !== stories[currentStory].fragments.length) {
      alert("Debes ordenar todas las frases antes de verificar.");
      return;
    }

    setAttempts(attempts + 1);
    const isCorrect = userOrder.every((fragment, index) => 
      fragment.correctOrder === index + 1
    );

    if (isCorrect) {
      const points = Math.max(30 - (attempts * 5), 10);
      setScore(score + points);
      setShowReward(true);
      
      setTimeout(() => {
        setShowReward(false);
        if (currentStory < stories.length - 1) {
          setCurrentStory(currentStory + 1);
        } else {
          setGameComplete(true);
        }
      }, 2000);
    } else {
      setShowResult(true);
      setTimeout(() => {
        setShowResult(false);
      }, 2000);
    }
  };

  const resetStory = () => {
    initializeStory();
  };

  const restartGame = () => {
    setCurrentStory(0);
    setScore(0);
    setGameComplete(false);
    setShowReward(false);
    initializeStory();
  };

  if (gameComplete) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
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
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🏆</div>
              
              <h2 className="text-3xl mb-4 text-gray-800">
                ¡Todas las historias completadas!
              </h2>
              
              <div className="text-xl mb-6 text-gray-600">
                Puntuación final: {score} puntos
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={restartGame}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
                >
                  Jugar de nuevo
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

  const progress = ((currentStory + 1) / stories.length) * 100;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="max-w-6xl mx-auto">
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
              📋 Ordena la Historia
            </h1>
            <div className="flex items-center gap-2 justify-center mt-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Puntos: {score}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Historia {currentStory + 1} de {stories.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-3 bg-white/50" />
        </div>

        {/* Animal Guide */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <AnimalGuide
            animal="turtle"
            message="Lee cada frase con paciencia y ordénalas para formar una historia completa. ¡Puedes arrastrar las frases o hacer clic en ellas!"
          />
        </motion.div>

        {/* Story Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl text-gray-800 dyslexia-friendly">
            "{stories[currentStory].title}"
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Fragments */}
          <div>
            <h3 className="text-lg mb-4 text-gray-700">Frases disponibles:</h3>
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
                    onDragStart={() => handleDragStart(fragment)}
                    onClick={() => handleFragmentClick(fragment)}
                  >
                    <CardContent className="p-4">
                      <p className="text-gray-800 dyslexia-friendly leading-relaxed">
                        {fragment.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Story Order */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-gray-700">Tu historia ordenada:</h3>
              <Button
                onClick={resetStory}
                variant="outline"
                size="sm"
                className="bg-white/80"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
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
                  <Card className="bg-green-50 border-2 border-green-300">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                        <p className="text-gray-800 dyslexia-friendly leading-relaxed flex-1">
                          {fragment.text}
                        </p>
                        <Button
                          onClick={() => handleRemoveFromOrder(fragment.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {/* Drop zone for empty order */}
              {userOrder.length === 0 && (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 0)}
                >
                  Arrastra las frases aquí para ordenar la historia
                </div>
              )}
            </div>

            {/* Check Button */}
            <div className="mt-6 text-center">
              <Button
                onClick={checkOrder}
                disabled={userOrder.length !== stories[currentStory].fragments.length}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Verificar orden
              </Button>
            </div>
          </div>
        </div>

        {/* Result Messages */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-red-100 border-2 border-red-300 rounded-lg p-4 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">No es el orden correcto. ¡Inténtalo de nuevo!</span>
          </motion.div>
        )}

        {/* Reward Animation */}
        {showReward && (
          <RewardAnimation
            type="confetti"
            show={showReward}
            message="¡Historia ordenada correctamente!"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </div>
  );
}