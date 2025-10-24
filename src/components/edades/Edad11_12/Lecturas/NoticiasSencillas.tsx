import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ArrowLeft, Star, Newspaper, Volume2, Calendar, Eye, Share2, ThumbsUp } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';

interface NoticiasSencillasProps {
  onBack: () => void;
  level: number;
}

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  likes: number;
  difficulty: number;
  image: string;
  questions: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

export function NoticiasSencillas({ onBack, level }: NoticiasSencillasProps) {
  const [currentNews, setCurrentNews] = useState(0);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [newsRead, setNewsRead] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);


  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: "🐼 Nace un bebé panda en el zoológico",
      summary: "Una mamá panda tuvo un bebé muy pequeñito en el zoológico de la ciudad.",
      content: "Ayer por la mañana, la mamá panda Mei-Mei tuvo un bebé panda. El bebé es muy pequeño, como del tamaño de tu mano. Los veterinarios están muy contentos porque los bebés pandas son muy especiales. El bebé va a estar con su mamá por muchos meses antes de que la gente pueda visitarlo. Los pandas son animales muy tiernos que vienen de China.",
      category: "Animales",
      date: "Hoy",
      likes: 247,
      difficulty: 1,
      image: "🐼",
      questions: [
        {
          question: "¿Cómo se llama la mamá panda?",
          options: ["Mei-Mei", "Lin-Lin", "Bao-Bao", "Chi-Chi"],
          correct: 0
        },
        {
          question: "¿Cuándo nació el bebé panda?",
          options: ["Hace una semana", "Hoy", "Ayer por la mañana", "Anteayer"],
          correct: 2
        }
      ]
    },
    {
      id: 2,
      title: "🚀 Niños construyen cohete de cartón que vuela",
      summary: "Estudiantes de una escuela hicieron un cohete con materiales reciclados.",
      content: "Los niños de la escuela San Martín trabajaron todo el mes para construir un cohete especial. Usaron cajas de cartón, botellas plásticas y globos. Su maestra de ciencias, la señora Carmen, los ayudó con las instrucciones. Ayer probaron el cohete en el patio de la escuela. ¡El cohete voló 10 metros de alto! Todos los niños gritaron de alegría. Ahora quieren hacer uno más grande para la feria de ciencias.",
      category: "Ciencia",
      date: "Ayer",
      likes: 189,
      difficulty: 2,
      image: "🚀",
      questions: [
        {
          question: "¿Cómo se llama la escuela?",
          options: ["San José", "San Martín", "Santa María", "San Pedro"],
          correct: 1
        },
        {
          question: "¿Qué tan alto voló el cohete?",
          options: ["5 metros", "15 metros", "10 metros", "20 metros"],
          correct: 2
        }
      ]
    },
    {
      id: 3,
      title: "🌍 Niña de 8 años ayuda a limpiar el planeta",
      summary: "Una niña organiza campañas para cuidar el medio ambiente en su ciudad.",
      content: "Sofía tiene 8 años y vive en México. Hace seis meses decidió ayudar a cuidar nuestro planeta. Cada sábado organiza jornadas de limpieza en el parque cerca de su casa. Ya ha conseguido que 50 familias participen. También creó un club en su escuela para enseñar a otros niños sobre el reciclaje. Su papá la ayuda a hacer carteles y su mamá prepara limonada para todos los voluntarios. Sofía dice que quiere ser científica para seguir cuidando la Tierra.",
      category: "Medio Ambiente",
      date: "Esta semana",
      likes: 356,
      difficulty: 3,
      image: "🌍",
      questions: [
        {
          question: "¿Cuántas familias participan ya en las jornadas?",
          options: ["30", "40", "50", "60"],
          correct: 2
        },
        {
          question: "¿Qué quiere ser Sofía cuando sea grande?",
          options: ["Maestra", "Doctora", "Científica", "Artista"],
          correct: 2
        }
      ]
    }
  ];

  const filteredNews = newsArticles.filter(news => news.difficulty <= level);
  const currentArticle = filteredNews[currentNews];



  const handleReadComplete = () => {
    setNewsRead(true);
    setShowQuestions(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);
    
    const isCorrect = answerIndex === currentArticle.questions[currentQuestion].correct;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    }
    
    setTimeout(() => {
      setShowResult(true);
      setTimeout(() => {
        if (currentQuestion < currentArticle.questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setAnswered(false);
        } else {
          // Fin del artículo
          setTimeout(() => {
            if (currentNews < filteredNews.length - 1) {
              setCurrentNews(prev => prev + 1);
              setCurrentQuestion(0);
              setSelectedAnswer(null);
              setShowResult(false);
              setAnswered(false);
              setNewsRead(false);
              setShowQuestions(false);
            }
          }, 2000);
        }
      }, 1500);
    }, 1000);
  };

  const handleLike = () => {
    setScore(prev => prev + 5);
  };

  const isLastNews = currentNews === filteredNews.length - 1;
  const isLastQuestion = currentQuestion === currentArticle.questions.length - 1;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-green-50">
      {showReward && (
          <RewardAnimation
            type="star"
            show={showReward}
            message="¡Correcto!"
            onComplete={() => setShowReward(false)}
          />
        )}
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={onBack}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">{score} puntos</span>
            </div>
            
            <Badge variant="outline" className="bg-blue-100">
              Noticia {currentNews + 1}/{filteredNews.length}
            </Badge>
          </div>
        </div>

        <div className="mb-6">
          <AnimalGuide 
            animal="monkey"
            message="¡Hola reportero curioso! Lee las noticias importantes y responde las preguntas. ¡Mantente informado!"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Lista de noticias */}
          <div className="md:col-span-1">
            <Card className="h-fit">
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 mb-4">
                  <Newspaper className="w-5 h-5 text-blue-600" />
                  Noticias del Día
                </h3>
                
                <div className="space-y-3">
                  {filteredNews.map((news, index) => (
                    <motion.div
                      key={news.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        index === currentNews 
                          ? 'bg-blue-100 border-2 border-blue-300' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setCurrentNews(index);
                        setCurrentQuestion(0);
                        setSelectedAnswer(null);
                        setShowResult(false);
                        setAnswered(false);
                        setNewsRead(false);
                        setShowQuestions(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">{news.image}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-2">
                            {news.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {news.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{news.date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Artículo principal */}
          <div className="md:col-span-2">
            <Card className="h-fit">
              <CardContent className="p-6">
                {!showQuestions ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-100 text-blue-700">
                        {currentArticle.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {currentArticle.date}
                      </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800">
                      {currentArticle.title}
                    </h1>

                    <div className="flex items-center gap-4 py-2">
                      <AudioPlayer 
                        text={currentArticle.content}
                        autoPlay={false}
                      />
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">124 lecturas</span>
                      </div>
                    </div>

                    <div className="text-lg leading-relaxed text-gray-700 space-y-4">
                      <p className="font-medium text-blue-700 bg-blue-50 p-3 rounded-lg">
                        {currentArticle.summary}
                      </p>
                      <p className="dyslexia-friendly">
                        {currentArticle.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t">
                      <Button
                        onClick={handleLike}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Me gusta ({currentArticle.likes})
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        Compartir
                      </Button>
                    </div>

                    <div className="pt-4">
                      <Button 
                        onClick={handleReadComplete}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                        disabled={!newsRead && false}
                      >
                        ¡Terminé de leer! Responder preguntas
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <h2 className="text-xl font-bold text-blue-700 mb-2">
                        Pregunta {currentQuestion + 1} de {currentArticle.questions.length}
                      </h2>
                      <Progress 
                        value={((currentQuestion + 1) / currentArticle.questions.length) * 100} 
                        className="w-full max-w-md mx-auto"
                      />
                    </div>

                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4 text-center">
                          {currentArticle.questions[currentQuestion].question}
                        </h3>
                        
                        <div className="grid gap-3">
                          {currentArticle.questions[currentQuestion].options.map((option, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleAnswerSelect(index)}
                              disabled={answered}
                              className={`p-4 rounded-lg text-left transition-all border-2 ${
                                selectedAnswer === index
                                  ? selectedAnswer === currentArticle.questions[currentQuestion].correct
                                    ? 'bg-green-100 border-green-300 text-green-800'
                                    : 'bg-red-100 border-red-300 text-red-800'
                                  : showResult && index === currentArticle.questions[currentQuestion].correct
                                    ? 'bg-green-100 border-green-300 text-green-800'
                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                              }`}
                              whileHover={!answered ? { scale: 1.02 } : {}}
                              whileTap={!answered ? { scale: 0.98 } : {}}
                            >
                              <span className="font-medium">
                                {String.fromCharCode(65 + index)}. {option}
                              </span>
                            </motion.button>
                          ))}
                        </div>

                        {showResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-center"
                          >
                            {selectedAnswer === currentArticle.questions[currentQuestion].correct ? (
                              <div className="text-green-600">
                                <div className="text-4xl mb-2">🎉</div>
                                <p className="font-semibold">¡Correcto! +10 puntos</p>
                              </div>
                            ) : (
                              <div className="text-orange-600">
                                <div className="text-4xl mb-2">📚</div>
                                <p className="font-semibold">¡Inténtalo de nuevo!</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>

                    {showResult && isLastQuestion && isLastNews && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg border-2 border-green-300"
                      >
                        <div className="text-6xl mb-4">📰</div>
                        <h3 className="text-xl font-bold text-green-700 mb-2">
                          ¡Excelente trabajo, reportero!
                        </h3>
                        <p className="text-green-600 mb-4">
                          Has leído todas las noticias y respondido las preguntas.
                          Puntuación final: {score} puntos
                        </p>
                        <Button 
                          onClick={onBack}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          ¡Continuar aprendiendo!
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}