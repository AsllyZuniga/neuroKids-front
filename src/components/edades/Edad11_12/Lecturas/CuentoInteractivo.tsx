import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Star, BookOpen, Users, Brain, Heart } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';

interface CuentoInteractivoProps {
  onBack: () => void;
  level: number;
}

interface StoryChoice {
  text: string;
  consequence: string;
  emotionalImpact: 'positive' | 'negative' | 'neutral';
  nextSection: number;
  points: number;
}

interface StorySection {
  id: number;
  text: string;
  character: string;
  emotion: string;
  choices: StoryChoice[];
  reflectionQuestion?: string;
}

interface InteractiveStory {
  id: number;
  title: string;
  theme: string;
  moralLesson: string;
  sections: StorySection[];
}

const stories: InteractiveStory[] = [
  {
    id: 1,
    title: "El Dilema de Alex",
    theme: "Amistad y Honestidad",
    moralLesson: "La honestidad fortalece las amistades verdaderas, incluso cuando es difícil",
    sections: [
      {
        id: 1,
        text: "Alex encontró la billetera de su mejor amigo Sam en el patio de la escuela. Dentro había $20 que Sam había estado ahorrando para comprar un regalo para su hermana. Alex recordó que necesitaba exactamente esa cantidad para comprar un libro que quería. Nadie más vio cuando encontró la billetera.",
        character: "Alex",
        emotion: "conflicted",
        choices: [
          {
            text: "Devolver inmediatamente la billetera a Sam",
            consequence: "Alex se sintió bien consigo mismo y Sam le agradeció enormemente",
            emotionalImpact: "positive",
            nextSection: 2,
            points: 20
          },
          {
            text: "Quedarse con el dinero y devolver solo la billetera vacía",
            consequence: "Alex se sintió culpable y Sam se puso muy triste",
            emotionalImpact: "negative",
            nextSection: 3,
            points: 5
          },
          {
            text: "Buscar a un maestro para entregar la billetera",
            consequence: "El maestro elogió a Alex por su honestidad",
            emotionalImpact: "positive",
            nextSection: 4,
            points: 15
          }
        ],
        reflectionQuestion: "¿Qué harías tú en el lugar de Alex? ¿Por qué?"
      },
      {
        id: 2,
        text: "Sam abrazó a Alex con lágrimas de alivio. 'Pensé que había perdido todo el dinero que ahorré', dijo Sam. 'Eres el mejor amigo que alguien puede tener.' Alex se sintió orgulloso de haber tomado la decisión correcta, aunque había sido tentador quedarse con el dinero.",
        character: "Sam",
        emotion: "grateful",
        choices: [
          {
            text: "Alex le cuenta a Sam sobre la tentación que sintió",
            consequence: "Sam aprecia aún más la honestidad de Alex",
            emotionalImpact: "positive",
            nextSection: 5,
            points: 25
          },
          {
            text: "Alex no dice nada sobre la tentación",
            consequence: "Alex se queda con sus sentimientos para sí mismo",
            emotionalImpact: "neutral",
            nextSection: 6,
            points: 10
          }
        ]
      },
      {
        id: 3,
        text: "Alex le devolvió la billetera a Sam, pero sin el dinero. Sam revisó la billetera y se puso muy triste. 'No entiendo', murmuró Sam. 'Estaba seguro de que había dinero aquí.' Alex evitó la mirada de su amigo, sintiendo un nudo en el estómago.",
        character: "Sam",
        emotion: "sad",
        choices: [
          {
            text: "Alex confiesa lo que hizo",
            consequence: "Sam se sintió herido pero apreció la honestidad tardía",
            emotionalImpact: "neutral",
            nextSection: 7,
            points: 15
          },
          {
            text: "Alex sigue mintiendo",
            consequence: "Alex se sintió cada vez peor y la amistad se dañó",
            emotionalImpact: "negative",
            nextSection: 8,
            points: 0
          }
        ]
      },
      {
        id: 4,
        text: "La maestra Williams elogió a Alex frente a toda la clase. 'Este es un ejemplo perfecto de integridad', dijo. Sam recuperó su dinero y le agradeció tanto a Alex como a la maestra. Alex se sintió bien por haber hecho lo correcto.",
        character: "Maestra Williams",
        emotion: "proud",
        choices: [
          {
            text: "Alex se siente motivado a seguir siendo honesto",
            consequence: "Alex desarrolló una reputación de persona confiable",
            emotionalImpact: "positive",
            nextSection: 9,
            points: 20
          }
        ]
      },
      {
        id: 5,
        text: "'Wow', dijo Sam. 'Debe haber sido difícil resistir la tentación, especialmente sabiendo que querías ese libro. Eso hace que tu honestidad sea aún más valiosa.' La amistad entre Alex y Sam se fortaleció más que nunca.",
        character: "Sam",
        emotion: "admiring",
        choices: [
          {
            text: "Alex y Sam hacen un pacto de honestidad mutua",
            consequence: "Su amistad se volvió inquebrantable",
            emotionalImpact: "positive",
            nextSection: 10,
            points: 30
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "La Decisión de Maya",
    theme: "Responsabilidad y Consecuencias",
    moralLesson: "Nuestras acciones tienen consecuencias que afectan a otros",
    sections: [
      {
        id: 1,
        text: "Maya estaba a cargo de cuidar las plantas del aula durante las vacaciones. Era una gran responsabilidad porque las plantas eran parte de un proyecto científico importante. El primer día de vacaciones, Maya prefirió ir al parque con sus amigos en lugar de ir a la escuela a regar las plantas.",
        character: "Maya",
        emotion: "careless",
        choices: [
          {
            text: "Ir inmediatamente a la escuela a regar las plantas",
            consequence: "Las plantas estuvieron bien y Maya se sintió responsable",
            emotionalImpact: "positive",
            nextSection: 2,
            points: 20
          },
          {
            text: "Decidir ir al día siguiente",
            consequence: "Maya pospuso la responsabilidad",
            emotionalImpact: "neutral",
            nextSection: 3,
            points: 10
          },
          {
            text: "Olvidarse completamente de las plantas",
            consequence: "Las plantas comenzaron a marchitarse",
            emotionalImpact: "negative",
            nextSection: 4,
            points: 0
          }
        ],
        reflectionQuestion: "¿Cómo manejas tus responsabilidades cuando hay cosas más divertidas que hacer?"
      },
      {
        id: 2,
        text: "Maya llegó a la escuela y encontró las plantas en perfecto estado. Se sintió bien al cumplir con su responsabilidad. Mientras regaba cada planta cuidadosamente, notó que algunas estaban comenzando a florecer. Se dio cuenta de que cuidar algo requiere dedicación constante.",
        character: "Maya",
        emotion: "responsible",
        choices: [
          {
            text: "Maya crea un horario fijo para cuidar las plantas",
            consequence: "Las plantas florecieron espectacularmente",
            emotionalImpact: "positive",
            nextSection: 5,
            points: 25
          }
        ]
      }
    ]
  }
];

export function CuentoInteractivo({ onBack, level }: CuentoInteractivoProps) {
  const [currentStory, setCurrentStory] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [storyPath, setStoryPath] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [reflections, setReflections] = useState<string[]>([]);

  const story = stories[currentStory];
  const section = story.sections.find(s => s.id === currentSection);

  const makeChoice = (choice: StoryChoice) => {
    setStoryPath([...storyPath, choice.consequence]);
    setScore(score + choice.points);
    
    if (choice.emotionalImpact === 'positive') {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    }

    setTimeout(() => {
      if (choice.nextSection && story.sections.find(s => s.id === choice.nextSection)) {
        setCurrentSection(choice.nextSection);
      } else {
        if (currentStory < stories.length - 1) {
          setCurrentStory(currentStory + 1);
          setCurrentSection(1);
        } else {
          setReadingComplete(true);
        }
      }
    }, 2000);
  };

  const restartReading = () => {
    setCurrentStory(0);
    setCurrentSection(1);
    setStoryPath([]);
    setScore(0);
    setReadingComplete(false);
    setReflections([]);
    setShowReward(false);
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'bg-green-100 border-green-300';
      case 'sad': return 'bg-blue-100 border-blue-300';
      case 'angry': return 'bg-red-100 border-red-300';
      case 'conflicted': return 'bg-yellow-100 border-yellow-300';
      case 'grateful': return 'bg-purple-100 border-purple-300';
      case 'proud': return 'bg-indigo-100 border-indigo-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'conflicted': return '😕';
      case 'grateful': return '🙏';
      case 'proud': return '😌';
      case 'responsible': return '💪';
      case 'admiring': return '😍';
      case 'careless': return '😅';
      default: return '😐';
    }
  };

  if (readingComplete) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
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
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📖</div>
                <h2 className="text-3xl mb-4 text-gray-800">
                  ¡Cuentos Interactivos Completados!
                </h2>
                <div className="text-xl mb-6 text-gray-600">
                  Puntuación total: {score} puntos
                </div>
              </div>

              {/* Story Summary */}
              <div className="mb-6">
                <h3 className="text-lg mb-4 text-gray-800">Tu camino en las historias:</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {storyPath.map((path, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-blue-800 text-sm">{path}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moral Lessons */}
              <div className="mb-6">
                <h3 className="text-lg mb-4 text-gray-800">Lecciones aprendidas:</h3>
                <div className="space-y-2">
                  {stories.slice(0, currentStory + 1).map((story, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-green-600" />
                        <span className="text-green-800 font-medium">{story.theme}</span>
                      </div>
                      <p className="text-green-700 text-sm">{story.moralLesson}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={restartReading}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3"
                >
                  Leer Más Cuentos
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

  if (!section) {
    return <div>Error: Sección no encontrada</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
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
              📚 Cuento Corto Interactivo
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
              Sección {currentSection}
            </div>
          </div>
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
            animal="monkey"
            message="¡En estos cuentos tú decides qué pasa! Cada elección tiene consecuencias. Piensa bien antes de decidir y aprende sobre valores importantes."
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Story Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentSection}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`bg-white/90 backdrop-blur-sm border-2 ${getEmotionColor(section.emotion)}`}>
                <CardContent className="p-8">
                  {/* Character & Emotion */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-4xl">{getEmotionEmoji(section.emotion)}</div>
                    <div>
                      <h3 className="text-lg text-gray-800">{section.character}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {section.emotion}
                      </Badge>
                    </div>
                  </div>

                  {/* Audio Player */}
                  <div className="mb-6">
                    <AudioPlayer
                      text="Reproduciendo parte del cuento..."
                      duration={4000}
                    />
                  </div>

                  {/* Story Text */}
                  <div className="bg-white/80 p-6 rounded-lg border border-gray-200 mb-6">
                    <p className="text-lg leading-relaxed text-gray-800 dyslexia-friendly">
                      {section.text}
                    </p>
                  </div>

                  {/* Reflection Question */}
                  {section.reflectionQuestion && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-blue-500" />
                        <h4 className="text-lg text-blue-800">Reflexiona:</h4>
                      </div>
                      <p className="text-blue-700 dyslexia-friendly">
                        {section.reflectionQuestion}
                      </p>
                    </div>
                  )}

                  {/* Choices */}
                  <div className="space-y-4">
                    <h4 className="text-lg text-gray-800 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      ¿Qué decides?
                    </h4>
                    
                    {section.choices.map((choice, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={() => makeChoice(choice)}
                          variant="outline"
                          className="w-full justify-start text-left p-6 h-auto bg-white/80 hover:bg-white border-2 hover:border-purple-300 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div className="flex-1">
                              <div className="text-lg dyslexia-friendly text-gray-800 mb-1">
                                {choice.text}
                              </div>
                              <div className="text-sm text-purple-600">
                                +{choice.points} puntos • {choice.emotionalImpact === 'positive' ? '😊' : choice.emotionalImpact === 'negative' ? '😔' : '😐'}
                              </div>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Story Info Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  Sobre esta Historia
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Tema Principal:</h4>
                    <p className="text-gray-800 dyslexia-friendly">{story.theme}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Lección Moral:</h4>
                    <p className="text-gray-800 text-sm dyslexia-friendly">{story.moralLesson}</p>
                  </div>
                </div>

                {/* Story Path */}
                {storyPath.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm text-gray-600 mb-2">Tu camino en la historia:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {storyPath.map((path, index) => (
                        <div key={index} className="text-xs bg-gray-50 p-2 rounded border">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-4 h-4 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            <span className="text-gray-600">Decisión {index + 1}</span>
                          </div>
                          <p className="text-gray-700">{path}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reward Animation */}
        {showReward && (
          <RewardAnimation
            type="star"
            show ={showReward}
            message="¡Excelente decisión!"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </div>
  );
}