import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Star, ChevronLeft, ChevronRight, Calendar, User, Tag } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';

interface RevistaInfantilProps {
  onBack: () => void;
  level: number;
}

interface Article {
  id: number;
  title: string;
  category: string;
  author: string;
  date: string;
  content: string;
  image: string;
  funFact: string;
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

const articles: Article[] = [
  {
    id: 1,
    title: "Los Delfines: Los Genios del Mar",
    category: "Animales",
    author: "Dr. Marina Azul",
    date: "15 de Marzo, 2024",
    content: "Los delfines son algunos de los animales más inteligentes del planeta. Pueden reconocerse a sí mismos en un espejo, algo que solo pueden hacer algunos animales muy listos como los humanos y los chimpancés. Los delfines hablan entre ellos usando clicks y silbidos especiales, casi como si tuvieran su propio idioma. Cada delfín tiene un silbido único, como si fuera su nombre. Además, son muy amigables y les gusta jugar. A menudo se les ve saltando fuera del agua solo por diversión.",
    image: "🐬",
    funFact: "Los delfines duermen con un ojo abierto para estar alerta a los peligros",
    quiz: {
      question: "¿Qué hace especiales a los delfines según el artículo?",
      options: [
        "Solo pueden nadar muy rápido",
        "Pueden reconocerse en un espejo y comunicarse",
        "Solo comen peces grandes",
        "Viven en todos los océanos"
      ],
      correct: 1,
      explanation: "El artículo destaca que los delfines pueden reconocerse en espejos y tienen su propio 'idioma' de comunicación."
    }
  },
  {
    id: 2,
    title: "El Increíble Mundo de las Plantas Carnívoras",
    category: "Ciencia",
    author: "Prof. Verde Natura",
    date: "22 de Marzo, 2024",
    content: "¿Sabías que algunas plantas comen insectos? Las plantas carnívoras son fascinantes porque pueden conseguir nutrientes de los animales pequeños que atrapan. La Venus atrapamoscas es la más famosa: tiene hojas que se cierran como una boca cuando un insecto las toca. Otras plantas carnívoras, como las plantas jarra, tienen formas de copa llena de líquido donde los insectos caen y no pueden salir. Estas plantas viven en lugares donde la tierra no tiene muchos nutrientes, por eso necesitan 'comer' insectos para obtener lo que necesitan para crecer.",
    image: "🪲",
    funFact: "La Venus atrapamoscas puede contar: necesita que la toquen dos veces antes de cerrarse",
    quiz: {
      question: "¿Por qué las plantas carnívoras comen insectos?",
      options: [
        "Porque les gusta el sabor",
        "Para obtener nutrientes que faltan en la tierra",
        "Para defenderse de los animales",
        "Porque no pueden hacer fotosíntesis"
      ],
      correct: 1,
      explanation: "Las plantas carnívoras viven en lugares donde la tierra no tiene muchos nutrientes, por eso necesitan obtenerlos de los insectos."
    }
  },
  {
    id: 3,
    title: "Los Volcanes: Montañas que Escupen Fuego",
    category: "Geografía",
    author: "Dra. Roca Fundida",
    date: "5 de Abril, 2024",
    content: "Los volcanes son como ventanas hacia el interior de nuestro planeta. Muy profundo bajo la tierra, hace tanto calor que las rocas se derriten y se convierten en lava. Cuando hay mucha presión, esta lava busca una salida y sube hasta la superficie a través del volcán. Cuando un volcán hace erupción, puede lanzar lava, ceniza y gases muy calientes. Aunque pueden ser peligrosos, los volcanes también crean islas nuevas y tierra muy fértil. Hawái es un ejemplo de islas creadas por volcanes que siguen activos hoy en día.",
    image: "🌋",
    funFact: "En el mundo hay más de 1,500 volcanes activos, y cada año erupcionan alrededor de 50",
    quiz: {
      question: "¿Qué hace que un volcán entre en erupción?",
      options: [
        "El agua de lluvia",
        "Los terremotos solamente",
        "La presión de la lava derretida que busca salir",
        "El viento muy fuerte"
      ],
      correct: 2,
      explanation: "La lava derretida bajo tierra busca una salida debido a la presión, y sale a través del volcán."
    }
  },
  {
    id: 4,
    title: "Los Robots del Futuro: ¿Cómo Nos Ayudarán?",
    category: "Tecnología",
    author: "Ing. Chip Electrónico",
    date: "18 de Abril, 2024",
    content: "Los robots están en todas partes y cada vez son más útiles. En los hospitales, algunos robots ayudan a los doctores en operaciones muy precisas. En las casas, tenemos robots aspiradoras que limpian solos. Los científicos están creando robots que pueden caminar, correr e incluso jugar fútbol. En el futuro, los robots podrían ayudarnos con las tareas del hogar, cuidar a las personas mayores, e incluso explorar planetas lejanos donde los humanos no pueden ir. Lo más increíble es que algunos robots están aprendiendo a pensar y tomar decisiones por sí mismos.",
    image: "🤖",
    funFact: "El primer robot de la historia se llamaba 'Unimate' y trabajaba en una fábrica de carros en 1961",
    quiz: {
      question: "Según el artículo, ¿qué pueden hacer los robots modernos?",
      options: [
        "Solo limpiar casas",
        "Ayudar en hospitales, limpiar y hasta jugar deportes",
        "Solo trabajar en fábricas",
        "Únicamente cocinar comida"
      ],
      correct: 1,
      explanation: "El artículo menciona que los robots ayudan en hospitales, limpian casas, pueden jugar fútbol y muchas otras actividades."
    }
  },
  {
    id: 5,
    title: "El Fascinante Mundo de los Sueños",
    category: "Ciencia",
    author: "Dr. Sueño Profundo",
    date: "2 de Mayo, 2024",
    content: "Todas las noches, cuando dormimos, nuestro cerebro crea historias increíbles llamadas sueños. Los científicos han descubierto que soñamos principalmente durante una fase del sueño llamada REM, cuando nuestros ojos se mueven rápidamente. Durante los sueños, nuestro cerebro organiza la información del día y procesa nuestras emociones. Algunas personas recuerdan sus sueños claramente, mientras que otras los olvidan rápidamente. Los sueños pueden ser divertidos, extraños, o incluso ayudarnos a resolver problemas. Muchos inventores famosos han encontrado la solución a sus problemas en sueños.",
    image: "💭",
    funFact: "En promedio, una persona tiene entre 4 y 6 sueños por noche, pero olvida el 95% de ellos",
    quiz: {
      question: "¿Cuándo soñamos principalmente según el artículo?",
      options: [
        "Cuando estamos despiertos",
        "Durante la fase REM del sueño",
        "Solo cuando tomamos siesta",
        "Únicamente los fines de semana"
      ],
      correct: 1,
      explanation: "El artículo explica que soñamos principalmente durante la fase REM, cuando nuestros ojos se mueven rápidamente."
    }
  }
];

export function RevistaInfantil({ onBack, level }: RevistaInfantilProps) {
  const [currentArticle, setCurrentArticle] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [readArticles, setReadArticles] = useState<Set<number>>(new Set());

  const article = articles[currentArticle];
  const progress = ((currentArticle + 1) / articles.length) * 100;

  const markAsRead = () => {
    setReadArticles(prev => new Set([...prev, currentArticle]));
    setScore(score + 20);
    setShowQuiz(true);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === article.quiz.correct) {
      setScore(score + 30);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    }

    setTimeout(() => {
      if (currentArticle < articles.length - 1) {
        nextArticle();
      } else {
        setReadingComplete(true);
      }
    }, 3000);
  };

  const nextArticle = () => {
    setCurrentArticle(currentArticle + 1);
    setShowQuiz(false);
    setSelectedAnswer(null);
  };

  const previousArticle = () => {
    if (currentArticle > 0) {
      setCurrentArticle(currentArticle - 1);
      setShowQuiz(false);
      setSelectedAnswer(null);
    }
  };

  const restartReading = () => {
    setCurrentArticle(0);
    setScore(0);
    setReadingComplete(false);
    setReadArticles(new Set());
    setShowQuiz(false);
    setSelectedAnswer(null);
    setShowReward(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Animales': return 'bg-green-100 text-green-700 border-green-300';
      case 'Ciencia': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Geografía': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Tecnología': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (readingComplete) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
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
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">📰</div>
              
              <h2 className="text-3xl mb-4 text-gray-800">
                ¡Revista Completada!
              </h2>
              
              <div className="text-xl mb-6 text-gray-600">
                Puntuación: {score} puntos de lectura
              </div>
              
              <div className="mb-6">
                <div className="text-gray-600 mb-4">
                  Has leído {readArticles.size} de {articles.length} artículos
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl text-blue-600 mb-1">{readArticles.size}</div>
                    <div className="text-sm text-blue-700">Artículos Leídos</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl text-green-600 mb-1">{score}</div>
                    <div className="text-sm text-green-700">Puntos Ganados</div>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-600 mb-6">
                ¡Excelente trabajo! Has aprendido mucho sobre animales, ciencia, geografía y tecnología.
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={restartReading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3"
                >
                  Leer Nueva Edición
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
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl text-gray-800 dyslexia-friendly">
              📝 Quiz del Artículo
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
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200">
              <CardContent className="p-8">
                <h3 className="text-xl mb-6 text-gray-800 dyslexia-friendly">
                  {article.quiz.question}
                </h3>

                <div className="grid gap-4">
                  {article.quiz.options.map((option, index) => (
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
                            ? 'bg-white/80 hover:bg-white border-gray-200 hover:border-blue-300'
                            : selectedAnswer === index
                            ? index === article.quiz.correct
                              ? 'bg-green-100 border-green-400 text-green-800'
                              : 'bg-red-100 border-red-400 text-red-800'
                            : index === article.quiz.correct
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
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
                    className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <h4 className="text-lg mb-2 text-blue-800">Explicación:</h4>
                    <p className="text-blue-700">{article.quiz.explanation}</p>
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
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
              📰 Revista Infantil
            </h1>
            <div className="flex items-center gap-2 justify-center mt-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">Puntos: {score}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Artículo {currentArticle + 1} de {articles.length}
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
            message="¡Bienvenido a nuestra revista! Aquí encontrarás artículos fascinantes sobre el mundo que nos rodea. Lee con atención y después responde el quiz."
          />
        </motion.div>

        {/* Article */}
        <motion.div
          key={currentArticle}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 mb-6">
            <CardContent className="p-8">
              {/* Article Header */}
              <div className="border-b-2 border-gray-200 pb-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-6xl">{article.image}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl text-gray-800 dyslexia-friendly mb-2">
                      {article.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={`${getCategoryColor(article.category)} border`}>
                        <Tag className="w-3 h-3 mr-1" />
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio Player */}
              <div className="mb-6">
                <AudioPlayer
                  text="Reproduciendo artículo..."
                  duration={5000}
                />
              </div>

              {/* Article Content */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border-2 border-blue-200">
                  <p className="text-lg leading-relaxed text-gray-800 dyslexia-friendly">
                    {article.content}
                  </p>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💡</span>
                  <h4 className="text-lg text-yellow-800">Dato Curioso:</h4>
                </div>
                <p className="text-yellow-700 dyslexia-friendly">{article.funFact}</p>
              </div>

              {/* Read Button */}
              {!readArticles.has(currentArticle) && (
                <div className="text-center">
                  <Button
                    onClick={markAsRead}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
                  >
                    ✓ Marcar como Leído
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={previousArticle}
            disabled={currentArticle === 0}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Artículo Anterior
          </Button>
          
          <div className="flex gap-2">
            {articles.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentArticle
                    ? 'bg-blue-500'
                    : readArticles.has(index)
                    ? 'bg-green-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Button
            onClick={nextArticle}
            disabled={currentArticle === articles.length - 1 || !readArticles.has(currentArticle)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {currentArticle === articles.length - 1 ? "Finalizar" : "Siguiente Artículo"}
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