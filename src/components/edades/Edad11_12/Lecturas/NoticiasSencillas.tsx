import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Newspaper, Volume2, VolumeX, Calendar, Eye, Share2, ThumbsUp } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { GameHeader } from '../../../others/GameHeader';
import { ProgressBar } from '../../../others/ProgressBar';
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { StartScreenNoticiasSencillas } from '../IniciosJuegosLecturas/StartScreenNoticiasSencillas';
import { useProgress } from "@/hooks/useProgress";
import { useActivityTimer } from "@/hooks/useActivityTimer";
import { getActivityByDbId } from "@/config/activities";
import {
  baseFromActivityConfig,
  readingLevelFinished,
  readingStart
} from "@/utils/activityProgressPayloads";
import { AccessibilitySettingsWrapper } from "@/components/others/AccessibilitySettingsWrapper";
import panda from '../../../../assets//11_12/noticias_niños/panda1.svg';
import globos from '../../../../assets//11_12/noticias_niños/globos.svg';
import manzana from '../../../../assets//11_12/noticias_niños/manzana.svg';
import cohete from '../../../../assets//11_12/noticias_niños/cohete.svg'; 
import pulpo from '../../../../assets//11_12/noticias_niños/pulpo.svg';
import bicicleta from '../../../../assets//11_12/noticias_niños/bicicleta.svg';
import reciclar from '../../../../assets/11_12/noticias_niños/reciclar.svg'
import telescopio from '../../../../assets/11_12/noticias_niños/telescopio.svg';

interface NoticiasSencillasProps {
  onBack: () => void;
  level?: number;
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
  icon: string;
  image: string;
  questions: {
    question: string;
    options: string[];
    correct: number;
  }[];
}

const newsArticles: NewsArticle[] = [
  // === NIVEL 1 ===
  { id: 1, title: "Nace un bebé panda", image: panda, summary: "¡Un panda pequeñito llegó al mundo!", content: "Mei-Mei es una mamá panda. Ayer tuvo un bebé muy chiquito. El bebé es del tamaño de una mano. Los doctores del zoológico están felices. El bebé va a dormir con su mamá muchos días.", category: "Animales", date: "Hoy", likes: 247, difficulty: 1, icon: "🐼", questions: [{ question: "¿Cómo se llama la mamá?", options: ["Mei-Mei", "Lola", "Pipo", "Tita"], correct: 0 }, { question: "¿Cuándo nació el bebé?", options: ["Ayer", "Mañana", "La semana pasada", "En un mes"], correct: 0 }] },
  { id: 2, title: "Fiesta de globos", image: globos, summary: "¡Muchos globos de colores en el parque!", content: "El sábado hubo una fiesta. Niños y niñas trajeron globos rojos, azules y amarillos. Jugaron a reventarlos. Todos reían. Al final soltaron los globos al cielo. ¡Fue muy divertido!", category: "Diversión", date: "Sábado", likes: 189, difficulty: 1, icon: "🎈", questions: [{ question: "¿Dónde fue la fiesta?", options: ["En la escuela", "En el parque", "En la playa", "En casa"], correct: 1 }, { question: "¿Qué hicieron al final?", options: ["Los guardaron", "Los soltaron", "Los pintaron", "Los comieron"], correct: 1 }] },
  { id: 3, title: "Manzana gigante", image: manzana, summary: "¡Una manzana más grande que una pelota!", content: "Don Pepe tiene un árbol. Dio una manzana gigante. Es más grande que una pelota. Los niños vinieron a verla. Cortaron la manzana y la compartieron. ¡Estaba muy dulce!", category: "Naturaleza", date: "Ayer", likes: 312, difficulty: 1, icon: "🍎", questions: [{ question: "¿Cómo es la manzana?", options: ["Pequeña", "Gigante", "Amarga", "Verde"], correct: 1 }, { question: "¿Qué hicieron con ella?", options: ["La tiraron", "La compartieron", "La pintaron", "La guardaron"], correct: 1 }] },
  // === NIVEL 2 ===
  { id: 4, title: "Cohete de cartón",image: cohete, summary: "¡Niños hicieron un cohete que vuela!", content: "Los niños de la escuela San Martín hicieron un cohete. Usaron cartón y botellas. Lo lanzaron en el patio. ¡Voló 10 metros! Todos gritaron de alegría. Quieren hacer uno más grande.", category: "Ciencia", date: "Ayer", likes: 189, difficulty: 2, icon: "🚀", questions: [{ question: "¿Qué usaron para el cohete?", options: ["Madera", "Cartón", "Metal", "Vidrio"], correct: 1 }, { question: "¿Cuánto voló?", options: ["5 metros", "10 metros", "20 metros", "50 metros"], correct: 1 }] },
  { id: 5, title: "Dibujo ganador", image: pulpo,summary: "¡Lucas ganó con un pulpo de colores!", content: "Hubo un concurso de dibujos. El tema era el mar. Lucas dibujó un pulpo con 8 brazos de colores. Ganó el primer lugar. Su premio fue un set de lápices. Todos aplaudieron.", category: "Arte", date: "Hace 3 días", likes: 278, difficulty: 2, icon: "🎨", questions: [{ question: "¿Quién ganó?", options: ["Ana", "Lucas", "Pedro", "María"], correct: 1 }, { question: "¿Qué dibujó Lucas?", options: ["Un pez", "Un pulpo", "Un barco", "Una nube"], correct: 1 }] },
  { id: 6, title: "Bicicleteada", image: bicicleta,summary: "¡300 personas en bici por la ciudad!", content: "El domingo hubo una bicicleteada. Salieron del parque. Dieron una vuelta grande. Había niños y abuelos. Al final recibieron medallas y jugo. ¡Fue un día sano!", category: "Deporte", date: "Domingo", likes: 403, difficulty: 2, icon: "🚲", questions: [{ question: "¿Cuántas personas fueron?", options: ["100", "200", "300", "400"], correct: 2 }, { question: "¿Qué recibieron al final?", options: ["Un libro", "Una medalla", "Una pelota", "Un helado"], correct: 1 }] },
  // === NIVEL 3 ===
  { id: 7, title: "Sofía limpia el parque", image: reciclar,summary: "¡Una niña cuida el planeta!", content: "Sofía tiene 8 años. Cada sábado limpia el parque. Ya van 50 familias. También enseña a reciclar en su escuela. Su papá hace carteles. Quiere ser científica cuando crezca.", category: "Medio Ambiente", date: "Esta semana", likes: 356, difficulty: 3, icon: "🌎", questions: [{ question: "¿Cuántas familias ayudan?", options: ["20", "30", "50", "60"], correct: 2 }, { question: "¿Qué quiere ser Sofía?", options: ["Doctora", "Maestra", "Científica", "Artista"], correct: 2 }] },
  { id: 8, title: "Nueva estrella", image: telescopio,summary: "¡Encontraron una estrella que baila!", content: "Los científicos vieron una estrella nueva. Parpadea como si bailara. La llaman 'Estrella Danza'. Está muy lejos. Usaron un telescopio grande. Los niños están emocionados.", category: "Ciencia", date: "Hace 2 días", likes: 512, difficulty: 3, icon: "🔭", questions: [{ question: "¿Cómo se llama la estrella?", options: ["Estrella Luz", "Estrella Danza", "Estrella Sol", "Estrella Luna"], correct: 1 }, { question: "¿Qué usaron para verla?", options: ["Lupa", "Telescopio", "Cámara", "Ojo"], correct: 1 }] },
  { id: 9, title: "Robot recoge basura", image: panda,summary: "¡Mateo inventó un robot limpiador!", content: "Mateo tiene 10 años. Hizo un robot con ruedas. Recoge latas y papeles. Lo probó en el parque. Recogió 5 kilos en una hora. Ganó un premio. Quiere mejorar su robot.", category: "Tecnología", date: "Ayer", likes: 689, difficulty: 3, icon: "🤖", questions: [{ question: "¿Qué edad tiene Mateo?", options: ["8", "9", "10", "11"], correct: 2 }, { question: "¿Cuántos kilos recogió?", options: ["3", "4", "5", "6"], correct: 2 }] }
];

const MAX_LEVEL = 3;

export function NoticiasSencillas({ onBack, level: initialLevel = 1 }: NoticiasSencillasProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [currentNews, setCurrentNews] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [canAnswer, setCanAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [likesMap, setLikesMap] = useState<Record<number, number>>({});
  const [likedMap, setLikedMap] = useState<Record<number, boolean>>({});

  const { saveProgress } = useProgress();
  const activityConfig = getActivityByDbId(9); // Noticias Sencillas
  const { getElapsedSeconds } = useActivityTimer([currentLevel]);

  const guardarInicioNivel = () => {
    if (activityConfig) {
      saveProgress(readingStart(baseFromActivityConfig(activityConfig), currentLevel));
    }
  };

  useEffect(() => {
    guardarInicioNivel();
  }, [currentLevel]);

  useEffect(() => {
    if (levelComplete && activityConfig) {
      const correctCount = Math.max(1, Math.round(score / 15));
      saveProgress(
        readingLevelFinished(baseFromActivityConfig(activityConfig), {
          level: currentLevel,
          maxLevels: MAX_LEVEL,
          score,
          maxScore: 140,
          timeSpent: getElapsedSeconds(),
          correctAnswers: correctCount
        })
      );
    }
  }, [levelComplete, activityConfig, score, currentLevel, saveProgress, getElapsedSeconds]);

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;


  const prevInitialLevelRef = useRef(initialLevel);
  useEffect(() => {
    if (prevInitialLevelRef.current === initialLevel) return;
    prevInitialLevelRef.current = initialLevel;
    setCurrentLevel(initialLevel);
    setCurrentNews(0);
    setCurrentQuestion(0);
    setScore(0);
    setShowQuestions(false);
    setCanAnswer(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswered(false);
    setShowMotivational(false);
    setLevelComplete(false);
    if (synth) synth.cancel();
    setIsSpeaking(false);
  }, [initialLevel]);

  const filteredNews = newsArticles.filter(n => n.difficulty === currentLevel);

  if (filteredNews.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">No hay noticias disponibles para este nivel.</p>
          <Button onClick={onBack} variant="outline">Volver</Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (filteredNews.length > 0 && currentNews >= filteredNews.length) {
      setCurrentNews(0);
    }
  }, [filteredNews.length, currentNews]);

  const safeCurrentNews = currentNews >= 0 && currentNews < filteredNews.length ? currentNews : 0;
  const currentArticle = filteredNews[safeCurrentNews];
  const displayLikes = likesMap[currentArticle.id] ?? currentArticle.likes;
  const isLiked = likedMap[currentArticle.id] ?? false;


  if (!currentArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">Cargando artículo...</p>
          <Button onClick={onBack} variant="outline">Volver</Button>
        </div>
      </div>
    );
  }

  const totalQuestions = currentArticle.questions.length;
  const progress = (safeCurrentNews / filteredNews.length) * 100;


  useEffect(() => {
    if (!currentArticle || showQuestions) return;

    setCanAnswer(false);

    const words = currentArticle.content.split(' ').length;
    const readingTime = Math.max(8000, Math.ceil(words / 12) * 1000);

    const timer = setTimeout(() => {
      if (!isSpeaking) setCanAnswer(true);
    }, readingTime);

    return () => clearTimeout(timer);
  }, [currentNews, isSpeaking, showQuestions, currentArticle]);


  useEffect(() => {
    setShowQuestions(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswered(false);
    if (synth) synth.cancel();
    setIsSpeaking(false);
  }, [currentNews, synth]);


  const playSound = (type: 'correct' | 'wrong') => {
    const audio = new Audio();
    const ding = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE=';
    const buzzer = 'data:audio/wav;base64,UklGRiQCAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQJCAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE=';
    audio.src = type === 'correct' ? ding : buzzer;
    audio.volume = 0.6;
    audio.play().catch(() => { });
  };


  const speak = (text: string) => {
    if (!synth || isSpeaking) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); setCanAnswer(true); };
    utterance.onerror = () => { setIsSpeaking(false); setCanAnswer(true); };
    synth.speak(utterance);
  };

  const handleListen = () => {
    const fullText = `${currentArticle.title}. ${currentArticle.summary}. ${currentArticle.content}`;
    speak(fullText);
  };

  const handleAnswerSelect = (index: number) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    const isCorrect = index === currentArticle.questions[currentQuestion].correct;

    if (isCorrect) {
      setScore(s => s + 5);
      setShowReward(true);
      playSound('correct');
      setTimeout(() => setShowReward(false), 1500);
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      setShowResult(true);
      setTimeout(() => {
        if (currentQuestion < totalQuestions - 1) {
          setCurrentQuestion(q => q + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setAnswered(false);
        } else {
          if (currentNews < filteredNews.length - 1) {
            setCurrentNews(n => n + 1);
          } else {
            setShowMotivational(true);
          }
        }
      }, 1500);
    }, 1000);
  };

  const handleLike = (articleId: number) => {
    setLikedMap(prev => {
      if (prev[articleId]) return prev;

      setLikesMap(likes => ({
        ...likes,
        [articleId]: (likes[articleId] ?? currentArticle.likes) + 1,
      }));

      return { ...prev, [articleId]: true };
    });
  };



  const restartLevel = () => {
    setCurrentNews(0);
    setCurrentQuestion(0);
    setScore(0);
    setShowQuestions(false);
    setCanAnswer(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswered(false);
    setLevelComplete(false);
    setShowMotivational(false);
    if (synth) synth.cancel();
    setIsSpeaking(false);
  };

  const loadNextLevel = () => {
    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel(currentLevel + 1);
      setCurrentNews(0);
      setCurrentQuestion(0);
      setScore(0);
      setShowQuestions(false);
      setCanAnswer(false);
      setLevelComplete(false);
    } else {
      onBack();
    }
  };
  if (!gameStarted) {
    return <StartScreenNoticiasSencillas onStart={() => setGameStarted(true)} onBack={onBack} />;
  }

  const maxPoints = filteredNews.length * 20;

  return (
    <AccessibilitySettingsWrapper defaultBackground="linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #dcfce7 100%)">
    <div className="min-h-screen p-6">
        <GameHeader
          title={`Noticias Sencillas`}
          level={currentLevel}
          score={score}
          onBack={onBack}
          onRestart={restartLevel}
        />

        <ProgressBar
          current={currentNews + 1}
          total={filteredNews.length}
          progress={progress}
          className="mb-6"
        />

        <div className="mb-6">
          <AnimalGuide
            animal="bear"
            message="¡Lee o escucha la noticia y responde las preguntas!"
          />
        </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <Card className="h-fit">
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 mb-4 text-black">
                  <Newspaper className="w-5 h-5 text-blue-600" /> Noticias
                </h3>
                <div className="space-y-3">
                  {filteredNews.map((news, i) => (
                    <motion.div
                      key={news.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${i === currentNews ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50 hover:bg-gray-100'}`}
                      onClick={() => setCurrentNews(i)}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">{news.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm text-black line-clamp-2">{news.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs text-black">{news.category}</Badge>
                            <span className="text-xs text-gray-600">{news.date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>


          <div className="md:col-span-2">
            <Card className="h-fit">
              <CardContent className="p-6">
                {!showQuestions ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-100 text-blue-700">{currentArticle.category}</Badge>
                      <div className="flex items-center gap-2 text-sm text-black">
                        <Calendar className="w-4 h-4" /> {currentArticle.date}
                      </div>
                    </div>

                    <h1 className="text-2xl  text-black">{currentArticle.title}</h1>
                    <div className="w-full h-48 rounded-xl overflow-hidden shadow-lg bg-gray-100">
                      <img
                        src={currentArticle.image}
                        alt={currentArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex items-center gap-4 py-2">
                      <Button
                        onClick={handleListen}
                        disabled={isSpeaking}
                        className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        {isSpeaking ? "Escuchando..." : "Escuchar"}
                      </Button>
                      <div className="flex items-center gap-2 text-black">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">124 lecturas</span>
                      </div>
                    </div>

                    <div className="text-lg leading-relaxed text-black space-y-4">
                      <p className=" text-blue-700 bg-blue-50 p-3 rounded-lg">{currentArticle.summary}</p>
                      <div className="max-h-96 overflow-y-auto p-4 bg-white rounded-lg border">
                        <p className="text-base">{currentArticle.content}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => handleLike(currentArticle.id)}
                        className={`flex items-center gap-2 border-gray-300 transition-all ${isLiked ? "bg-blue-100 text-blue-700 border-blue-300" : "text-black"
                          }`}
                      >
                        <ThumbsUp
                          className={`w-4 h-4 ${isLiked ? "fill-blue-500 text-blue-500" : ""}`}
                        />
                        Me gusta ({displayLikes})
                      </Button>

                      <Button variant="outline" className="flex items-center gap-2 text-black border-gray-300">
                        <Share2 className="w-4 h-4" /> Compartir
                      </Button>
                    </div>

                    <Button
                      onClick={() => setShowQuestions(true)}
                      disabled={!canAnswer}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      {canAnswer ? "¡Responder preguntas!" : "Espera un momento..."}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-xl  text-black mb-2">Pregunta {currentQuestion + 1} de {totalQuestions}</h2>
                      <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="w-full max-w-md mx-auto" />
                    </div>

                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                      <CardContent className="p-6">
                        <h3 className="text-lg  mb-4 text-center text-black">
                          {currentArticle.questions[currentQuestion].question}
                        </h3>
                        <div className="grid gap-3">
                          {currentArticle.questions[currentQuestion].options.map((opt, i) => (
                            <motion.button
                              key={i}
                              onClick={() => handleAnswerSelect(i)}
                              disabled={answered}
                              className={`p-4 rounded-lg text-left transition-all border-2 text-black ${selectedAnswer === i
                                ? selectedAnswer === currentArticle.questions[currentQuestion].correct
                                  ? 'bg-green-100 border-green-300'
                                  : 'bg-red-100 border-red-300'
                                : showResult && i === currentArticle.questions[currentQuestion].correct
                                  ? 'bg-green-100 border-green-300'
                                  : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                              whileHover={!answered ? { scale: 1.02 } : {}}
                              whileTap={!answered ? { scale: 0.98 } : {}}
                            >
                              <span className="">{String.fromCharCode(65 + i)}. {opt}</span>
                            </motion.button>
                          ))}
                        </div>

                        {showResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 text-center text-blue-600 "
                          >
                            ¡Respuesta guardada!
                          </motion.div>
                        )}

                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <RewardAnimation
          type="star"
          show={showReward}
          message="¡Correcto!"
          onComplete={() => setShowReward(false)}
        />

        {showMotivational && (
          <MotivationalMessage
            score={score}
            total={maxPoints}
            customMessage="¡Has leído todas las noticias del nivel!"
            customSubtitle="Completaste todas las lecturas y preguntas"
            celebrationText="¡Que hábil eres!"
            onComplete={() => {
              setShowMotivational(false);
              setLevelComplete(true);
            }}
          />
        )}

        {levelComplete && !showMotivational && (
          <LevelCompleteModal
            score={score}
            total={maxPoints}
            level={currentLevel}
            isLastLevel={currentLevel >= MAX_LEVEL}
            onNextLevel={loadNextLevel}
            onRestart={restartLevel}
            onExit={onBack}
          />
        )}
      </div>
    </div>
    </AccessibilitySettingsWrapper>
  );
}