import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, User, Tag } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';
import { GameHeader } from '../../../others/GameHeader';
import { ProgressBar } from '../../../others/ProgressBar';
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { StartScreenRevistaInfantil } from "../IniciosJuegosLecturas/StartScreenRevistaInfantil";import { useProgress } from "@/hooks/useProgress";
import { getActivityByDbId } from "@/config/activities";import delfin from '../../../../assets/9_10/revista_infantil/delfin1.svg';
import planta from '../../../../assets/9_10/revista_infantil/planta2.svg';
import volcan from '../../../../assets/9_10/revista_infantil/volcan3.svg';
import robots from '../../../../assets/9_10/revista_infantil/robots4.svg';
import sueños from '../../../../assets/9_10/revista_infantil/sueños5.svg';
import musica from '../../../../assets/9_10/revista_infantil/musica6.svg';
import abejas from '../../../../assets/9_10/revista_infantil/abejas7.svg';
import planetas from '../../../../assets/9_10/revista_infantil/planetas8.svg';
import ejercicio from '../../../../assets/9_10/revista_infantil/ejercicio9.svg';

interface RevistaInfantilProps {
  onBack: () => void;
  level?: number;
  onNextLevel?: () => void;
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

const articlesByLevel: Article[][] = [
  // Nivel 1
  [
    {
      id: 1,
      title: "Los Delfines: Los Genios del Mar",
      category: "Animales",
      author: "Dr. Marina Azul",
      date: "15 de Marzo, 2024",
      content: "Los delfines son algunos de los animales más inteligentes del planeta. Pueden reconocerse a sí mismos en un espejo, algo que solo pueden hacer algunos animales muy listos como los humanos y los chimpancés. Los delfines hablan entre ellos usando clicks y silbidos especiales, casi como si tuvieran su propio idioma. Cada delfín tiene un silbido único, como si fuera su nombre. Además, son muy amigables y les gusta jugar. A menudo se les ve saltando fuera del agua solo por diversión.",
      image: delfin,
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
      image: planta,
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
      title: "Las Abejas: Pequeñas Heroínas de la Naturaleza",
      category: "Animales",
      author: "Dra. Miel Dorada",
      date: "28 de Marzo, 2024",
      content: "Las abejas son insectos muy pequeños pero súper importantes para el planeta. Mientras vuelan de flor en flor buscando néctar, ayudan a que las plantas se reproduzcan llevando polen. Gracias a ellas tenemos frutas, verduras y muchas flores bonitas. En una colmena, cada abeja tiene un trabajo: algunas limpian, otras cuidan a las crías y otras salen a buscar comida. Aunque tengan un aguijón, solo pican si se sienten en peligro. Sin las abejas, muchos alimentos desaparecerían.",
      image: abejas,
      funFact: "Una abeja puede visitar hasta 5,000 flores en un solo día",
      quiz: {
        question: "¿Por qué son tan importantes las abejas?",
        options: [
          "Porque vuelan muy alto",
          "Porque ayudan a las plantas a reproducirse con el polen",
          "Porque solo hacen miel",
          "Porque viven solas"
        ],
        correct: 1,
        explanation: "Las abejas transportan polen de flor en flor, ayudando a que las plantas puedan dar frutos y semillas."
      }
    },

  ],
  // Nivel 2
  [
    {
      id: 4,
      title: "Los Volcanes: Montañas que Escupen Fuego",
      category: "Geografía",
      author: "Dra. Roca Fundida",
      date: "5 de Abril, 2024",
      content: "Los volcanes son como ventanas hacia el interior de nuestro planeta. Muy profundo bajo la tierra, hace tanto calor que las rocas se derriten y se convierten en lava. Cuando hay mucha presión, esta lava busca una salida y sube hasta la superficie a través del volcán. Cuando un volcán hace erupción, puede lanzar lava, ceniza y gases muy calientes. Aunque pueden ser peligrosos, los volcanes también crean islas nuevas y tierra muy fértil. Hawái es un ejemplo de islas creadas por volcanes que siguen activos hoy en día.",
      image: volcan,
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
      id: 5,
      title: "Los Robots del Futuro: ¿Cómo Nos Ayudarán?",
      category: "Tecnología",
      author: "Ing. Chip Electrónico",
      date: "18 de Abril, 2024",
      content: "Los robots están en todas partes y cada vez son más útiles. En los hospitales, algunos robots ayudan a los doctores en operaciones muy precisas. En las casas, tenemos robots aspiradoras que limpian solos. Los científicos están creando robots que pueden caminar, correr e incluso jugar fútbol. En el futuro, los robots podrían ayudarnos con las tareas del hogar, cuidar a las personas mayores, e incluso explorar planetas lejanos donde los humanos no pueden ir. Lo más increíble es que algunos robots están aprendiendo a pensar y tomar decisiones por sí mismos.",
      image: robots,
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
      id: 6,
      title: "Los Planetas del Sistema Solar",
      category: "Ciencia",
      author: "Prof. Estrella Viajera",
      date: "25 de Abril, 2024",
      content: "Nuestro hogar está en el sistema solar, un conjunto de planetas que giran alrededor del Sol. Hay ocho planetas y cada uno es diferente. Mercurio es el más cercano al Sol y también el más pequeño. Júpiter es el más grande y tiene una gran mancha roja que es una tormenta gigante. Saturno es famoso por sus anillos brillantes. La Tierra es especial porque tiene agua y aire para que vivamos. Estudiar los planetas nos ayuda a entender mejor el universo.",
      image: planetas,
      funFact: "Júpiter es tan grande que podrían caber más de 1,300 Tierras dentro de él",
      quiz: {
        question: "¿Qué planeta es famoso por sus anillos?",
        options: [
          "Marte",
          "Júpiter",
          "Saturno",
          "Mercurio"
        ],
        correct: 2,
        explanation: "Saturno es conocido por sus grandes y brillantes anillos."
      }
    },

  ],
  // Nivel 3
  [
    {
      id: 7,
      title: "El Fascinante Mundo de los Sueños",
      category: "Ciencia",
      author: "Dr. Sueño Profundo",
      date: "2 de Mayo, 2024",
      content: "Todas las noches, cuando dormimos, nuestro cerebro crea historias increíbles llamadas sueños. Los científicos han descubierto que soñamos principalmente durante una fase del sueño llamada REM, cuando nuestros ojos se mueven rápidamente. Durante los sueños, nuestro cerebro organiza la información del día y procesa nuestras emociones. Algunas personas recuerdan sus sueños claramente, mientras que otras los olvidan rápidamente. Los sueños pueden ser divertidos, extraños, o incluso ayudarnos a resolver problemas. Muchos inventores famosos han encontrado la solución a sus problemas en sueños.",
      image: sueños,
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
    },
    {
      id: 8,
      title: "La Magia de la Música",
      category: "Arte",
      author: "Prof. Sonido Alegre",
      date: "20 de Mayo, 2024",
      content: "La música está en todas partes y nos acompaña todos los días. La escuchamos en la radio, en películas, en videojuegos y hasta cuando alguien canta. La música se crea con sonidos organizados que tienen ritmo, melodía y armonía. Algunos instrumentos, como la guitarra o el piano, producen sonido cuando vibran sus cuerdas, mientras que otros, como los tambores, suenan al golpearlos. Escuchar música puede hacernos sentir felices, tranquilos o con mucha energía. También ayuda a mejorar la memoria y la concentración. Por eso, la música no solo es divertida, sino también muy importante para nuestro cerebro.",
      image: musica,
      funFact: "Escuchar música puede ayudar a que el cerebro aprenda más rápido y recuerde mejor",
      quiz: {
        question: "¿Qué puede provocar la música en las personas?",
        options: [
          "Solo cansancio",
          "Sentimientos como alegría, calma o energía",
          "Que no pensemos",
          "Que olvidemos todo"
        ],
        correct: 1,
        explanation: "El artículo explica que la música puede hacernos sentir felices, tranquilos o con mucha energía."
      }
    },
    {
      id: 9,
      title: "El Poder del Ejercicio",
      category: "Salud",
      author: "Prof. Movimiento Feliz",
      date: "30 de Mayo, 2024",
      content: "Mover el cuerpo todos los días es muy importante para estar sanos. Cuando corremos, saltamos o jugamos, nuestros músculos se hacen más fuertes y el corazón trabaja mejor. El ejercicio también ayuda a que el cerebro esté feliz porque libera sustancias que mejoran el ánimo. No hace falta ser atleta: caminar, bailar o jugar fútbol ya es suficiente. Hacer ejercicio nos da más energía, mejora el sueño y nos ayuda a concentrarnos mejor en la escuela.",
      image: ejercicio,
      funFact: "Solo 20 minutos de ejercicio al día ayudan a mejorar la memoria y el humor",
      quiz: {
        question: "¿Qué beneficio trae el ejercicio?",
        options: [
          "Nos cansa todo el día",
          "Hace que el cuerpo y el cerebro funcionen mejor",
          "Evita que pensemos",
          "Solo sirve para competir"
        ],
        correct: 1,
        explanation: "El ejercicio fortalece el cuerpo y también mejora el ánimo y la concentración."
      }
    },

  ]
];



const MAX_LEVEL = 3;

export function RevistaInfantil({ onBack, level: initialLevel = 1 }: RevistaInfantilProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [currentArticle, setCurrentArticle] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [readArticles, setReadArticles] = useState<Set<number>>(new Set());
  const [showMotivational, setShowMotivational] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const { saveProgress } = useProgress();

  const activityConfig = getActivityByDbId(7); // Revista Infantil

  const guardarInicioNivel = () => {
    if (activityConfig) {
      saveProgress({
        activityId: activityConfig.dbId,
        activityName: activityConfig.name,
        activityType: activityConfig.type,
        ageGroup: '9-10',
        level: currentLevel,
        score: 0,
        maxScore: 100,
        completed: false,
        timeSpent: 0
      });
    }
  };

  useEffect(() => {
    // Registrar CADA vez que se inicia la lectura, sin importar si ya leyó antes
    guardarInicioNivel();
  }, [currentLevel]); // Se ejecuta cada vez que cambia el nivel o al montar el componente

  const currentArticles = articlesByLevel[currentLevel - 1];
  const article = currentArticles[currentArticle];
  const progress = (currentArticle / currentArticles.length) * 100;

  useEffect(() => {
    setCurrentArticle(0);
    setScore(0);
    setReadArticles(new Set());
    setShowQuiz(false);
    setSelectedAnswer(null);
    setShowReward(false);
    setShowMotivational(false);
    setLevelComplete(false);
  }, [currentLevel]);

  const markAsRead = () => {
    setReadArticles(prev => new Set([...prev, currentArticle]));
    setShowQuiz(true);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);

    if (answerIndex === article.quiz.correct) {
      setScore(s => s + 30);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    }

    setTimeout(() => {
      if (currentArticle < currentArticles.length - 1) {
        nextArticle();
      } else {
        setShowMotivational(true);
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

  const restartLevel = () => {
    setCurrentArticle(0);
    setScore(0);
    setReadArticles(new Set());
    setShowQuiz(false);
    setSelectedAnswer(null);
    setShowReward(false);
    setLevelComplete(false);
    setShowMotivational(false);
  };

  const loadNextLevel = () => {
    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel(currentLevel + 1);
      setCurrentArticle(0);
      setScore(0);
      setReadArticles(new Set());
      setShowQuiz(false);
      setLevelComplete(false);
    } else {
      onBack();
    }
  };

  const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
      Animales: 'bg-green-100 text-green-700 border-green-300',
      Ciencia: 'bg-blue-100 text-blue-700 border-blue-300',
      Geografía: 'bg-orange-100 text-orange-700 border-orange-300',
      Tecnología: 'bg-purple-100 text-purple-700 border-purple-300'
    };
    return map[category] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (!gameStarted) {
    return <StartScreenRevistaInfantil onStart={() => setGameStarted(true)} onBack={onBack} />;
  }

  if (levelComplete && !showMotivational) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
        <div className="max-w-7xl mx-auto">
          {/* HEADER*/}
          <GameHeader
            title={`Revista Infantil`}
            level={currentLevel}
            score={score}
            onBack={onBack}
            onRestart={restartLevel}
          />
        </div>
        <LevelCompleteModal
          score={score}
          total={currentArticles.length * 50}
          level={currentLevel}
          isLastLevel={currentLevel >= MAX_LEVEL}
          onNextLevel={loadNextLevel}
          onRestart={restartLevel}
          onExit={onBack}
        />
      </div>
    );
  }

  if (showQuiz && !showMotivational && !levelComplete) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
        <div className="max-w-7xl mx-auto">

          <GameHeader
            title={`Revista Infantil - Quiz`}
            level={currentLevel}
            score={score}
            onBack={onBack}
            onRestart={restartLevel}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200">
              <CardContent className="p-8">
                <h3 className="text-xl mb-6 text-black">
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
                        className={`w-full justify-start text-left p-6 h-auto transition-all text-black ${selectedAnswer === null
                          ? 'bg-white/80 hover:bg-white border-gray-200 hover:border-blue-300'
                          : 'bg-white border-gray-300 opacity-70'
                          }`}

                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-lg">{option}</span>
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

        {/* MENSAJE MOTIVACIONAL */}
        {showMotivational && (
          <MotivationalMessage
            score={score}
            total={currentArticles.length * 50}
            customMessage="¡Has leído todos los artículos!"
            customSubtitle="Completaste todas las lecturas del nivel"
            onComplete={() => {
              setShowMotivational(false);
              setLevelComplete(true);
            }}
          />
        )}

        {/* MODAL FINAL */}
        {levelComplete && !showMotivational && (
          <LevelCompleteModal
            score={score}
            total={currentArticles.length * 50}
            level={currentLevel}
            isLastLevel={currentLevel >= MAX_LEVEL}
            onNextLevel={loadNextLevel}
            onRestart={restartLevel}
            onExit={onBack}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
      <div className="max-w-7xl mx-auto">

        <GameHeader
          title={`Revista Infantil`}
          level={currentLevel}
          score={score}
          onBack={onBack}
          onRestart={restartLevel}
        />

        <ProgressBar
          current={currentArticle + 1}
          total={currentArticles.length}
          progress={progress}
        />

        <AnimalGuide
          animal="bear"
          message="¡Lee con atención el articulo y marca como leído para hacer el quiz!"
        />

        <motion.div
          key={currentArticle}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200">
            <CardContent className="p-8">
              <div className="border-b-2 border-gray-200 pb-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src={article.image} alt={article.title} className="w-30 h-24 object-contain rounded-xl" />
                  <div className="flex-1">
                    <h2 className="text-2xl text-black mb-2">{article.title}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={`${getCategoryColor(article.category)} border`}>
                        <Tag className="w-3 h-3 mr-1" />
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-black">
                        <User className="w-4 h-4" />
                        {article.author}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-black">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <AudioPlayer text={article.content} />
              </div>

              <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border-2 border-blue-200">
                  <p className="text-lg leading-relaxed text-black">{article.content}</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💡</span>
                  <h4 className="text-lg text-yellow-800">Dato Curioso:</h4>
                </div>
                <p className="text-yellow-700">{article.funFact}</p>
              </div>

              {!readArticles.has(currentArticle) && (
                <div className="text-center " >
                  <Button
                    onClick={markAsRead}

                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
                  >
                    Marcar como leído y hacer quiz
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex justify-between items-center">
          <Button
            onClick={previousArticle}
            disabled={currentArticle === 0}
            variant="outline"
            className="bg-green-500 backdrop-blur-sm border-2"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Artículo Anterior
          </Button>

          <div className="flex gap-2">
            {currentArticles.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentArticle
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
            disabled={currentArticle === currentArticles.length - 1 || !readArticles.has(currentArticle)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {currentArticle === currentArticles.length - 1 ? "Finalizar Nivel" : "Siguiente Artículo"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <RewardAnimation
          type="star"
          show={showReward}
          message="¡Respuesta correcta!"
          onComplete={() => setShowReward(false)}
        />

        {/* MENSAJE MOTIVACIONAL */}
        {showMotivational && (
          <MotivationalMessage
            score={score}
            total={currentArticles.length * 50}
            customMessage="¡Has leído todos los artículos!"
            customSubtitle="Completaste todas las lecturas del nivel"
            celebrationText="¡Eres un genio!"
            onComplete={() => {
              setShowMotivational(false);
              setLevelComplete(true);
            }}
          />
        )}

        {/* MODAL FINAL -  */}
        {levelComplete && !showMotivational && (
          <LevelCompleteModal
            score={score}
            total={currentArticles.length * 50}
            level={currentLevel}
            isLastLevel={currentLevel >= MAX_LEVEL}
            onNextLevel={loadNextLevel}
            onRestart={restartLevel}
            onExit={onBack}
          />
        )}
      </div>
    </div>
  );
}

