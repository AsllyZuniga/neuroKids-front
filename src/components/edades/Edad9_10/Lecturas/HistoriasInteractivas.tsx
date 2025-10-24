import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, Star, BookOpen, Users, Brain } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';

interface HistoriasInteractivasProps {
  onBack: () => void;
  level: number;
}

interface StoryPart {
  id: number;
  text: string;
  image: string;
  choices: {
    text: string;
    nextPart: number;
    points: number;
    consequence: string;
  }[];
}

interface InteractiveStory {
  id: number;
  title: string;
  theme: string;
  parts: { [key: number]: StoryPart };
  startPart: number;
}

const stories: InteractiveStory[] = [
  {
    id: 1,
    title: "La Aventura en el Bosque Encantado",
    theme: "Fantasía",
    startPart: 1,
    parts: {
      1: {
        id: 1,
        text: "Alex camina por un sendero cuando encuentra un bosque misterioso. Los árboles brillan con una luz dorada y se escuchan sonidos extraños. En la entrada del bosque hay un cartel que dice: 'Solo los valientes pueden entrar'.",
        image: "🌲✨",
        choices: [
          { text: "Entrar al bosque con valentía", nextPart: 2, points: 15, consequence: "Alex demuestra ser valiente" },
          { text: "Investigar el cartel primero", nextPart: 3, points: 10, consequence: "Alex es cauteloso y sabio" },
          { text: "Dar la vuelta y regresar", nextPart: 4, points: 5, consequence: "Alex pierde la oportunidad" }
        ]
      },
      2: {
        id: 2,
        text: "Al entrar, Alex se encuentra con un unicornio herido. El unicornio le dice: 'Ayúdame, joven aventurero, y te recompensaré con un don especial.' Su cuerno está roto y necesita una hierba mágica que crece cerca del lago.",
        image: "🦄💫",
        choices: [
          { text: "Buscar la hierba mágica inmediatamente", nextPart: 5, points: 20, consequence: "El unicornio se cura completamente" },
          { text: "Preguntar más sobre la hierba", nextPart: 6, points: 15, consequence: "Alex aprende sobre la magia" },
          { text: "Ofrecer otra forma de ayuda", nextPart: 7, points: 10, consequence: "El unicornio aprecia la creatividad" }
        ]
      },
      3: {
        id: 3,
        text: "El cartel tiene palabras en un idioma antiguo. Alex logra entender que dice: 'Solo quien respete la naturaleza será bienvenido.' Al tocar el cartel, una luz suave lo envuelve y aparece un hada guardiana.",
        image: "🧚‍♀️📜",
        choices: [
          { text: "Prometer respetar la naturaleza", nextPart: 8, points: 18, consequence: "El hada se convierte en guía" },
          { text: "Hacer preguntas sobre el bosque", nextPart: 9, points: 12, consequence: "Alex aprende los secretos del lugar" },
          { text: "Pedir permiso para explorar", nextPart: 10, points: 15, consequence: "El hada otorga protección mágica" }
        ]
      },
      4: {
        id: 4,
        text: "Alex regresa a casa, pero no puede dejar de pensar en el bosque. Esa noche sueña con criaturas mágicas que necesitan ayuda. Al despertar, decide que debe regresar.",
        image: "💭🏠",
        choices: [
          { text: "Regresar al bosque al amanecer", nextPart: 1, points: 8, consequence: "Alex tiene una segunda oportunidad" },
          { text: "Prepararse mejor antes de volver", nextPart: 11, points: 12, consequence: "Alex se equipa para la aventura" },
          { text: "Buscar ayuda de otros", nextPart: 12, points: 10, consequence: "Alex forma un equipo" }
        ]
      },
      5: {
        id: 5,
        text: "Alex encuentra la hierba mágica junto al lago cristalino. Al tocarla, la hierba brilla con una luz azul. El unicornio se cura completamente y como recompensa, le otorga el don de entender a todos los animales del bosque.",
        image: "🌿💙🦄",
        choices: [
          { text: "Agradecer y explorar el bosque", nextPart: 13, points: 25, consequence: "Alex vive muchas aventuras" },
          { text: "Preguntar sobre otros seres mágicos", nextPart: 14, points: 20, consequence: "Alex conoce toda la comunidad mágica" },
          { text: "Prometer cuidar el bosque", nextPart: 15, points: 30, consequence: "Alex se convierte en guardián" }
        ]
      },
      6: {
        id: 6,
        text: "El unicornio explica que la hierba solo funciona si quien la busca tiene un corazón puro. Alex reflexiona sobre sus intenciones y se da cuenta de que realmente quiere ayudar.",
        image: "❤️✨",
        choices: [
          { text: "Buscar la hierba con determinación", nextPart: 5, points: 18, consequence: "La pureza de corazón guía a Alex" },
          { text: "Meditar junto al unicornio", nextPart: 16, points: 15, consequence: "Alex desarrolla sabiduría interior" },
          { text: "Compartir una historia personal", nextPart: 17, points: 12, consequence: "Se crea un vínculo especial" }
        ]
      },
      // Continuaría con más partes...
      13: {
        id: 13,
        text: "Con su nuevo don, Alex puede hablar con las ardillas, los pájaros y todos los animales. Descubre que hay una celebración en el corazón del bosque donde todas las criaturas mágicas se reúnen una vez al año.",
        image: "🎉🐿️🦅",
        choices: [
          { text: "Unirse a la celebración", nextPart: 18, points: 30, consequence: "¡Final Épico: Alex se convierte en leyenda!" },
          { text: "Ayudar a organizar la fiesta", nextPart: 19, points: 25, consequence: "¡Final Heroico: Alex es el organizador!" },
          { text: "Invitar a más amigos humanos", nextPart: 20, points: 20, consequence: "¡Final Unificador: Alex conecta dos mundos!" }
        ]
      },
      18: {
        id: 18,
        text: "Alex participa en la gran celebración del bosque. Las criaturas mágicas lo nombran 'Amigo Eterno del Bosque Encantado' y le regalan un collar mágico que le permitirá volver siempre que quiera. ¡Ha vivido la aventura más increíble de su vida!",
        image: "🏆🌟🎊",
        choices: []
      }
    }
  }
];

export function HistoriasInteractivas({ onBack, level }: HistoriasInteractivasProps) {
  const [currentStory, setCurrentStory] = useState(0);
  const [currentPart, setCurrentPart] = useState(1);
  const [score, setScore] = useState(0);
  const [storyPath, setStoryPath] = useState<number[]>([1]);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [consequences, setConsequences] = useState<string[]>([]);

  const story = stories[currentStory];
  const part = story.parts[currentPart];
  const progress = (storyPath.length / 8) * 100; // Estimamos 8 partes por historia

  useEffect(() => {
    // Reset when story changes
    setCurrentPart(story.startPart);
    setStoryPath([story.startPart]);
    setConsequences([]);
  }, [currentStory]);

  const makeChoice = (choiceIndex: number) => {
    const choice = part.choices[choiceIndex];
    const newScore = score + choice.points;
    setScore(newScore);
    
    // Add consequence to history
    setConsequences([...consequences, choice.consequence]);
    
    // Show reward for good choices
    if (choice.points >= 15) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    }
    
    // Check if this choice leads to an ending
    if (choice.nextPart) {
      if (story.parts[choice.nextPart]) {
        if (story.parts[choice.nextPart].choices.length === 0) {
          // This is an ending
          setCurrentPart(choice.nextPart);
          setStoryPath([...storyPath, choice.nextPart]);
          setTimeout(() => {
            setReadingComplete(true);
          }, 3000);
        } else {
          // Continue story
          setCurrentPart(choice.nextPart);
          setStoryPath([...storyPath, choice.nextPart]);
        }
      } else {
        // Part doesn't exist, create a generic ending
        console.log(`Part ${choice.nextPart} not found, ending story`);
        setTimeout(() => {
          setReadingComplete(true);
        }, 2000);
      }
    }
  };

  const restartStory = () => {
    setCurrentPart(story.startPart);
    setStoryPath([story.startPart]);
    setScore(0);
    setConsequences([]);
    setReadingComplete(false);
    setShowReward(false);
  };

  const restartReading = () => {
    setCurrentStory(0);
    restartStory();
  };

  if (readingComplete) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
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
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{part.image}</div>
                <h2 className="text-3xl mb-4 text-gray-800">¡Historia Completada!</h2>
                <div className="text-xl mb-4 text-gray-600">
                  Puntuación final: {score} puntos
                </div>
              </div>

              {/* Final story part */}
              <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-200 mb-6">
                <h3 className="text-xl mb-3 text-indigo-800">Tu Final:</h3>
                <p className="text-gray-700 leading-relaxed dyslexia-friendly">
                  {part.text}
                </p>
              </div>

              {/* Story path summary */}
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 mb-6">
                <h4 className="text-lg mb-3 text-purple-800">Tu Camino en la Historia:</h4>
                <div className="space-y-2">
                  {consequences.map((consequence, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span className="text-purple-700 text-sm">{consequence}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={restartStory}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Crear otra historia
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

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
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
              🎭 Historias Interactivas
            </h1>
            <div className="flex items-center gap-2 justify-center mt-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Puntos: {score}</span>
            </div>
          </div>
          
          <div className="text-right">
            <Badge variant="secondary" className="mb-1">
              {story.theme}
            </Badge>
            <div className="text-sm text-gray-600">
              Capítulo {storyPath.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-3 bg-white/50" />
        </div>

        {/* Story Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl text-gray-800 dyslexia-friendly">
            {story.title}
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
            message="¡Tú decides cómo continúa la historia! Lee con cuidado y elige la opción que más te guste. Cada decisión llevará la historia por un camino diferente."
          />
        </motion.div>

        {/* Story Content */}
        <motion.div
          key={currentPart}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 mb-6">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Story Image */}
                <div className="text-center">
                  <div className="bg-gradient-to-br from-indigo-200 to-purple-200 rounded-2xl p-8 mb-4 min-h-[200px] flex items-center justify-center border-4 border-indigo-300">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-8xl"
                    >
                      {part.image}
                    </motion.div>
                  </div>
                  
                  <AudioPlayer
                    text="Reproduciendo capítulo..."
                    duration={3000}
                  />
                </div>

                {/* Story Text */}
                <div className="text-center md:text-left">
                  <div className="text-lg leading-relaxed text-gray-800 dyslexia-friendly mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-2 border-indigo-200">
                    {part.text}
                  </div>

                  {/* Story Path */}
                  {storyPath.length > 1 && (
                    <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                      <h4 className="text-sm text-purple-800 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Tu aventura hasta ahora:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {storyPath.map((partId, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            {index < storyPath.length - 1 && (
                              <div className="w-4 h-0.5 bg-purple-300 mx-1"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Choices */}
          {part.choices.length > 0 && (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  ¿Qué decides hacer?
                </h3>
                
                <div className="space-y-3">
                  {part.choices.map((choice, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => makeChoice(index)}
                        variant="outline"
                        className="w-full justify-start text-left p-6 h-auto bg-white/80 hover:bg-white border-2 hover:border-purple-300 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className="flex-1">
                            <div className="text-lg dyslexia-friendly text-gray-800">
                              {choice.text}
                            </div>
                            <div className="text-sm text-purple-600 mt-1">
                              +{choice.points} puntos
                            </div>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Reward Animation */}
        {showReward && (
          <RewardAnimation
            type="star"
            show={showReward}
            message="¡Excelente elección!"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </div>
  );
}