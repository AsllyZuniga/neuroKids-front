import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Star, ChevronLeft, ChevronRight, Calendar, Award, MapPin, Book } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';

interface BiografiasSencillasProps {
  onBack: () => void;
  level: number;
}

interface Biography {
  id: number;
  name: string;
  title: string;
  birthYear: number;
  country: string;
  category: string;
  emoji: string;
  mainAchievement: string;
  story: string;
  timeline: {
    age: number;
    event: string;
  }[];
  inspiration: string;
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  funFacts: string[];
}

const biographies: Biography[] = [
  {
    id: 1,
    name: "Marie Curie",
    title: "La Primera Mujer en Ganar un Premio Nobel",
    birthYear: 1867,
    country: "Polonia",
    category: "Ciencia",
    emoji: "⚗️",
    mainAchievement: "Descubrió dos elementos químicos y fue pionera en el estudio de la radioactividad",
    story: "Marie Curie nació en Polonia cuando las mujeres no podían ir a la universidad en su país. Pero ella tenía un gran sueño: estudiar ciencia. Trabajó muy duro y ahorró dinero para ir a estudiar a París, Francia. Allí conoció a Pierre Curie y se casaron. Juntos descubrieron elementos nuevos como el polonio y el radio. Marie fue la primera mujer en ganar un Premio Nobel, ¡y después ganó otro! Su trabajo ayudó a desarrollar tratamientos médicos que salvaron muchas vidas. Aunque enfrentó muchas dificultades por ser mujer en un mundo de hombres científicos, nunca se rindió.",
    timeline: [
      { age: 10, event: "Comenzó a mostrar interés por la ciencia" },
      { age: 24, event: "Se mudó a París para estudiar en la universidad" },
      { age: 28, event: "Se casó con Pierre Curie" },
      { age: 31, event: "Descubrió el polonio y el radio" },
      { age: 36, event: "Ganó su primer Premio Nobel" },
      { age: 44, event: "Ganó su segundo Premio Nobel" }
    ],
    inspiration: "Marie Curie nos enseña que con determinación y trabajo duro podemos lograr cualquier cosa, sin importar los obstáculos.",
    quiz: {
      question: "¿Por qué Marie Curie es especialmente importante en la historia?",
      options: [
        "Fue la primera mujer en viajar al espacio",
        "Fue la primera mujer en ganar un Premio Nobel",
        "Inventó la computadora",
        "Descubrió América"
      ],
      correct: 1,
      explanation: "Marie Curie fue la primera mujer en ganar un Premio Nobel, rompiendo barreras para las mujeres en la ciencia."
    },
    funFacts: [
      "Sus cuadernos de hace más de 100 años todavía son radioactivos",
      "Su laboratorio era tan frío que a veces tenía que trabajar con abrigo",
      "El elemento 'curio' fue nombrado en su honor"
    ]
  },
  {
    id: 2,
    name: "Leonardo da Vinci",
    title: "El Genio del Renacimiento",
    birthYear: 1452,
    country: "Italia",
    category: "Arte e Inventos",
    emoji: "🎨",
    mainAchievement: "Fue artista, inventor, científico y diseñó máquinas adelantadas a su tiempo",
    story: "Leonardo da Vinci fue una de las personas más creativas de la historia. No solo pintó obras famosas como 'La Mona Lisa', sino que también diseñó inventos increíbles como helicópteros, tanques y paracaídas, ¡400 años antes de que se construyeran! Leonardo era muy curioso: estudiaba el cuerpo humano, los animales, las plantas y hasta el clima. Escribía sus notas al revés, como en un espejo. Aunque vivió hace más de 500 años, muchos de sus inventos parecen de ciencia ficción. Leonardo nos enseña que la creatividad no tiene límites cuando combinamos arte, ciencia y mucha imaginación.",
    timeline: [
      { age: 14, event: "Comenzó a estudiar arte en Florencia" },
      { age: 20, event: "Pintó su primera obra importante" },
      { age: 30, event: "Comenzó a diseñar sus famosos inventos" },
      { age: 50, event: "Pintó 'La Mona Lisa'" },
      { age: 60, event: "Se mudó a Francia como invitado del rey" }
    ],
    inspiration: "Leonardo nos muestra que podemos ser buenos en muchas cosas diferentes si mantenemos la curiosidad y seguimos aprendiendo.",
    quiz: {
      question: "¿Qué hace especial a Leonardo da Vinci?",
      options: [
        "Solo fue un pintor famoso",
        "Solo fue un inventor",
        "Fue artista, inventor y científico al mismo tiempo",
        "Solo estudió medicina"
      ],
      correct: 2,
      explanation: "Leonardo da Vinci fue especial porque combinó arte, ciencia e inventos, siendo experto en múltiples áreas."
    },
    funFacts: [
      "Escribía de derecha a izquierda, como en un espejo",
      "Diseñó un robot caballero que podía mover los brazos",
      "Era vegetariano y liberaba a los pájaros enjaulados"
    ]
  },
  {
    id: 3,
    name: "Nelson Mandela",
    title: "El Líder que Luchó por la Libertad",
    birthYear: 1918,
    country: "Sudáfrica",
    category: "Derechos Humanos",
    emoji: "✊",
    mainAchievement: "Luchó contra la discriminación racial y se convirtió en presidente de Sudáfrica",
    story: "Nelson Mandela nació en Sudáfrica cuando las leyes no permitían que las personas de piel negra tuvieran los mismos derechos que las de piel blanca. Esto se llamaba apartheid. Nelson estudió para ser abogado y decidió luchar pacíficamente por la igualdad. Por sus ideas, fue enviado a prisión durante 27 años. Pero nunca perdió la esperanza ni el amor por su país. Cuando salió de prisión, en lugar de buscar venganza, trabajó para que todas las personas pudieran vivir en paz. Se convirtió en el primer presidente negro de Sudáfrica y ganó el Premio Nobel de la Paz. Su vida nos enseña sobre el perdón, la perseverancia y la justicia.",
    timeline: [
      { age: 23, event: "Se convirtió en abogado" },
      { age: 26, event: "Comenzó a luchar contra el apartheid" },
      { age: 46, event: "Fue enviado a prisión" },
      { age: 72, event: "Salió libre de la prisión" },
      { age: 75, event: "Se convirtió en presidente de Sudáfrica" }
    ],
    inspiration: "Mandela nos enseña que el perdón y la paciencia pueden cambiar el mundo más que la violencia.",
    quiz: {
      question: "¿Cuál fue la enseñanza más importante de Nelson Mandela?",
      options: [
        "Que la venganza es necesaria",
        "Que el perdón y la paz pueden vencer al odio",
        "Que solo los abogados pueden cambiar el mundo",
        "Que la prisión es buena para las personas"
      ],
      correct: 1,
      explanation: "Mandela demostró que el perdón y trabajar por la paz pueden lograr más cambios positivos que la venganza."
    },
    funFacts: [
      "Estuvo 27 años en prisión, pero nunca perdió la esperanza",
      "Su nombre tribal era 'Rolihlahla', que significa 'el que trae problemas'",
      "Después de ser presidente, dedicó su vida a ayudar a los niños"
    ]
  },
  {
    id: 4,
    name: "Frida Kahlo",
    title: "La Artista que Pintó sus Sentimientos",
    birthYear: 1907,
    country: "México",
    category: "Arte",
    emoji: "🌺",
    mainAchievement: "Creó arte único expresando sus emociones y la cultura mexicana",
    story: "Frida Kahlo fue una artista mexicana muy especial. Cuando era joven, tuvo un accidente muy grave que la obligó a estar en cama durante mucho tiempo. Para no aburrirse, comenzó a pintar. Sus pinturas eran diferentes a las de otros artistas porque mostraba sus sentimientos, sus dolores y sus alegrías. También pintaba la hermosa cultura de México con colores brillantes. Frida no se avergonzaba de ser diferente; al contrario, celebraba lo que la hacía única. Sus autorretratos muestran una mujer fuerte que convirtió su dolor en arte hermoso. Aunque su vida fue difícil, sus pinturas están llenas de vida y color.",
    timeline: [
      { age: 6, event: "Contrajo polio, que le afectó una pierna" },
      { age: 18, event: "Tuvo un grave accidente de autobús" },
      { age: 19, event: "Comenzó a pintar mientras se recuperaba" },
      { age: 22, event: "Se casó con el famoso pintor Diego Rivera" },
      { age: 30, event: "Expuso sus obras en Nueva York" }
    ],
    inspiration: "Frida nos enseña que podemos convertir nuestras dificultades en algo hermoso y expresar quiénes somos sin miedo.",
    quiz: {
      question: "¿Qué hacía especiales las pinturas de Frida Kahlo?",
      options: [
        "Solo pintaba paisajes",
        "Expresaba sus sentimientos y la cultura mexicana",
        "Solo copiaba a otros artistas",
        "Solo pintaba animales"
      ],
      correct: 1,
      explanation: "Frida Kahlo era especial porque pintaba sus emociones y celebraba la cultura mexicana con colores vibrantes."
    },
    funFacts: [
      "Pintó más de 50 autorretratos",
      "Tenía un mono como mascota que aparece en sus pinturas",
      "Su casa en México ahora es un museo famoso"
    ]
  }
];

export function BiografiasSencillas({ onBack, level }: BiografiasSencillasProps) {
  const [currentBio, setCurrentBio] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [readBiographies, setReadBiographies] = useState<Set<number>>(new Set());

  const biography = biographies[currentBio];
  const progress = ((currentBio + 1) / biographies.length) * 100;

  const finishReading = () => {
    setReadBiographies(prev => new Set([...prev, currentBio]));
    setScore(score + 30);
    setShowQuiz(true);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === biography.quiz.correct) {
      setScore(score + 20);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    }

    setTimeout(() => {
      if (currentBio < biographies.length - 1) {
        nextBiography();
      } else {
        setReadingComplete(true);
      }
    }, 3000);
  };

  const nextBiography = () => {
    setCurrentBio(currentBio + 1);
    setShowQuiz(false);
    setSelectedAnswer(null);
  };

  const previousBiography = () => {
    if (currentBio > 0) {
      setCurrentBio(currentBio - 1);
      setShowQuiz(false);
      setSelectedAnswer(null);
    }
  };

  const restartReading = () => {
    setCurrentBio(0);
    setScore(0);
    setReadingComplete(false);
    setReadBiographies(new Set());
    setShowQuiz(false);
    setSelectedAnswer(null);
    setShowReward(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Ciencia': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Arte e Inventos': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Arte': return 'bg-pink-100 text-pink-700 border-pink-300';
      case 'Derechos Humanos': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
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
          className="max-w-2xl mx-auto text-center"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">👥</div>
              
              <h2 className="text-3xl mb-4 text-gray-800">
                ¡Biografías Completadas!
              </h2>
              
              <div className="text-xl mb-6 text-gray-600">
                Puntuación: {score} puntos de inspiración
              </div>
              
              <div className="mb-6">
                <div className="text-gray-600 mb-4">
                  Has conocido a {readBiographies.size} persona{readBiographies.size !== 1 ? 's' : ''} extraordinaria{readBiographies.size !== 1 ? 's' : ''}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="text-2xl text-indigo-600 mb-1">{readBiographies.size}</div>
                    <div className="text-sm text-indigo-700">Biografías Leídas</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl text-purple-600 mb-1">{score}</div>
                    <div className="text-sm text-purple-700">Puntos de Inspiración</div>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-600 mb-6">
                ¡Has conocido vidas extraordinarias! Estas personas nos enseñan que con determinación y trabajo duro podemos cambiar el mundo.
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={restartReading}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3"
                >
                  Conocer Más Personas
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

  if (showQuiz) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl text-gray-800 dyslexia-friendly">
              📝 Quiz sobre {biography.name}
            </h1>
            <div className="flex items-center gap-2 justify-center mt-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Puntos: {score}</span>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200">
              <CardContent className="p-8">
                <h3 className="text-xl mb-6 text-gray-800 dyslexia-friendly">
                  {biography.quiz.question}
                </h3>

                <div className="grid gap-4">
                  {biography.quiz.options.map((option, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => handleQuizAnswer(index)}
                        disabled={selectedAnswer !== null}
                        variant="outline"
                        className={`w-full justify-start text-left p-6 h-auto transition-all ${
                          selectedAnswer === null
                            ? 'bg-white/80 hover:bg-white border-gray-200 hover:border-indigo-300'
                            : selectedAnswer === index
                            ? index === biography.quiz.correct
                              ? 'bg-green-100 border-green-400 text-green-800'
                              : 'bg-red-100 border-red-400 text-red-800'
                            : index === biography.quiz.correct
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-lg dyslexia-friendly">{option}</span>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {selectedAnswer !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200"
                  >
                    <h4 className="text-lg mb-2 text-indigo-800">Explicación:</h4>
                    <p className="text-indigo-700">{biography.quiz.explanation}</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
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
              👤 Biografías Sencillas
            </h1>
            <div className="flex items-center gap-2 justify-center mt-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Puntos: {score}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Biografía {currentBio + 1} de {biographies.length}
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
            animal="monkey"
            message="¡Conoce personas extraordinarias que cambiaron el mundo! Sus historias nos inspiran a ser mejores y a seguir nuestros sueños."
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Biography */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentBio}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Biography Header */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 mb-6">
                <CardContent className="p-8">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-8xl">{biography.emoji}</div>
                    <div className="flex-1">
                      <h2 className="text-3xl text-gray-800 dyslexia-friendly mb-2">
                        {biography.name}
                      </h2>
                      <p className="text-xl text-gray-600 mb-3">{biography.title}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className={`${getCategoryColor(biography.category)} border`}>
                          {biography.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{biography.birthYear}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{biography.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievement */}
                  <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <h3 className="text-lg text-yellow-800">Principal Logro:</h3>
                    </div>
                    <p className="text-yellow-700 dyslexia-friendly">{biography.mainAchievement}</p>
                  </div>

                  {/* Audio Player */}
                  <div className="mb-6">
                    <AudioPlayer
                      text={`Reproduciendo biografía de ${biography.name}...`}
                      duration={5000}
                    />
                  </div>

                  {/* Biography Story */}
                  <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-200 mb-6">
                    <p className="text-lg leading-relaxed text-gray-800 dyslexia-friendly">
                      {biography.story}
                    </p>
                  </div>

                  {/* Inspiration */}
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💡</span>
                      <h4 className="text-lg text-green-800">Inspiración:</h4>
                    </div>
                    <p className="text-green-700 dyslexia-friendly italic">"{biography.inspiration}"</p>
                  </div>
                </CardContent>
              </Card>

              {/* Read Button */}
              {!readBiographies.has(currentBio) && (
                <div className="text-center mb-6">
                  <Button
                    onClick={finishReading}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 text-lg"
                  >
                    <Book className="w-5 h-5 mr-2" />
                    Terminar de Leer
                  </Button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Timeline */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Cronología de Vida
                </h3>
                
                <div className="space-y-4">
                  {biography.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        {event.age}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 text-sm dyslexia-friendly">{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fun Facts */}
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-gray-800 flex items-center gap-2">
                  <span className="text-orange-500">🤔</span>
                  Datos Curiosos
                </h3>
                
                <div className="space-y-3">
                  {biography.funFacts.map((fact, index) => (
                    <div key={index} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <p className="text-orange-800 text-sm dyslexia-friendly">{fact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={previousBiography}
            disabled={currentBio === 0}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Biografía Anterior
          </Button>
          
          <div className="flex gap-2">
            {biographies.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentBio
                    ? 'bg-indigo-500'
                    : readBiographies.has(index)
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button
            onClick={nextBiography}
            disabled={currentBio === biographies.length - 1 || !readBiographies.has(currentBio)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            {currentBio === biographies.length - 1 ? "Finalizar" : "Siguiente Biografía"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Reward Animation */}
        {showReward && (
          <RewardAnimation
            type="star"
            show={showReward}
            message="¡Respuesta correcta!"
            onComplete={() => setShowReward(false)}
          />
        )}
      </div>
    </div>
  );
}