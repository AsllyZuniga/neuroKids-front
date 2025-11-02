import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {  ChevronLeft, ChevronRight, Calendar, Award, MapPin, Book, CheckCircle } from 'lucide-react';
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
import { StartScreenBiografiasSencillas } from '../IniciosJuegosLecturas/StartScreenBiografiasSencillas/StartScreenBiografiasSencillas';

interface BiografiasSencillasProps {
  onBack: () => void;
  level?: number;
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

const biographiesLevel1: Biography[] = [
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

const biographiesLevel2: Biography[] = [
  {
    id: 5,
    name: "Albert Einstein",
    title: "El Genio de la Física",
    birthYear: 1879,
    country: "Alemania",
    category: "Ciencia",
    emoji: "🧠",
    mainAchievement: "Desarrolló la teoría de la relatividad que cambió nuestra comprensión del universo",
    story: "Albert Einstein nació en Alemania y desde niño era muy curioso sobre cómo funcionaba el mundo. No le gustaba mucho la escuela tradicional, pero amaba aprender por su cuenta. Desarrolló ideas revolucionarias sobre el espacio, el tiempo y la energía. Su famosa ecuación E=mc² explica cómo la materia se convierte en energía. Einstein ganó el Premio Nobel y se convirtió en uno de los científicos más famosos del mundo. Tuvo que huir de su país por la guerra, pero siempre promovió la paz y el conocimiento.",
    timeline: [
      { age: 5, event: "Recibió una brújula que despertó su curiosidad por la física" },
      { age: 26, event: "Publicó la teoría de la relatividad especial" },
      { age: 36, event: "Publicó la teoría de la relatividad general" },
      { age: 42, event: "Ganó el Premio Nobel de Física" },
      { age: 54, event: "Se mudó a Estados Unidos huyendo del nazismo" }
    ],
    inspiration: "Einstein nos enseña que la imaginación es más importante que el conocimiento y que debemos cuestionar todo.",
    quiz: {
      question: "¿Cuál es la ecuación más famosa de Einstein?",
      options: [
        "a² + b² = c²",
        "E=mc²",
        "F=ma",
        "V=IR"
      ],
      correct: 1,
      explanation: "E=mc² es la ecuación que relaciona energía y masa, parte de la teoría de la relatividad."
    },
    funFacts: [
      "De niño hablaba poco y sus maestros pensaban que no era inteligente",
      "Tocaba el violín para relajarse y pensar en problemas científicos",
      "Rechazó ser presidente de Israel"
    ]
  },
  {
    id: 6,
    name: "Malala Yousafzai",
    title: "La Defensora de la Educación",
    birthYear: 1997,
    country: "Pakistán",
    category: "Derechos Humanos",
    emoji: "📚",
    mainAchievement: "Luchó por el derecho de las niñas a la educación y ganó el Premio Nobel de la Paz",
    story: "Malala nació en Pakistán, donde algunos grupos no querían que las niñas fueran a la escuela. Desde pequeña, escribió un blog sobre su vida y la importancia de estudiar. A los 15 años, fue atacada por defender la educación, pero sobrevivió y continuó su lucha. Se convirtió en la persona más joven en ganar el Premio Nobel. Hoy, viaja por el mundo promoviendo la educación para todos los niños.",
    timeline: [
      { age: 11, event: "Comenzó a escribir un blog sobre educación" },
      { age: 15, event: "Sobrevivió a un ataque por su activismo" },
      { age: 17, event: "Ganó el Premio Nobel de la Paz" },
      { age: 20, event: "Comenzó a estudiar en la Universidad de Oxford" },
      { age: 23, event: "Publicó su autobiografía" }
    ],
    inspiration: "Malala nos muestra que una voz joven puede cambiar el mundo y que la educación es un derecho para todos.",
    quiz: {
      question: "¿Por qué Malala ganó el Premio Nobel?",
      options: [
        "Por inventar algo",
        "Por su lucha por la educación de las niñas",
        "Por ser una gran deportista",
        "Por escribir novelas"
      ],
      correct: 1,
      explanation: "Malala ganó el Nobel por defender el derecho a la educación, especialmente para las niñas."
    },
    funFacts: [
      "Es la ganadora más joven del Premio Nobel",
      "Su libro 'Yo soy Malala' es un best-seller",
      "Fundó una organización para ayudar a niñas en educación"
    ]
  },
  {
    id: 7,
    name: "Steve Jobs",
    title: "El Visionario de la Tecnología",
    birthYear: 1955,
    country: "Estados Unidos",
    category: "Tecnología",
    emoji: "💻",
    mainAchievement: "Fundó Apple y revolucionó la computación personal, los teléfonos y la músicaデジタル",
    story: "Steve Jobs fue adoptado y creció en California. Abandonó la universidad pero fundó Apple en un garaje con su amigo. Crearon la primera computadora personal accesible. Aunque fue despedido de su propia compañía, regresó y creó productos innovadores como el iPhone y el iPad. Steve enfatizaba el diseño simple y hermoso en la tecnología.",
    timeline: [
      { age: 21, event: "Fundó Apple con Steve Wozniak" },
      { age: 24, event: "Lanzó la Apple II" },
      { age: 30, event: "Fue despedido de Apple" },
      { age: 42, event: "Regresó a Apple como CEO" },
      { age: 52, event: "Lanzó el iPhone" }
    ],
    inspiration: "Jobs nos enseña a pensar diferente y a combinar tecnología con arte para crear productos que cambien vidas.",
    quiz: {
      question: "¿Qué compañía fundó Steve Jobs?",
      options: [
        "Microsoft",
        "Google",
        "Apple",
        "Amazon"
      ],
      correct: 2,
      explanation: "Steve Jobs fundó Apple, que revolucionó la tecnología personal."
    },
    funFacts: [
      "Vivió en India por un tiempo buscando iluminación",
      "Su sueldo en Apple era de 1 dólar al año",
      "Amaba el diseño minimalista inspirado en el zen"
    ]
  },
  {
    id: 8,
    name: "Jane Goodall",
    title: "La Protectora de los Chimpancés",
    birthYear: 1934,
    country: "Reino Unido",
    category: "Ciencia",
    emoji: "🦍",
    mainAchievement: "Estudió a los chimpancés y promovió la conservación de la vida silvestre",
    story: "Jane Goodall soñaba con África desde niña. A los 26 años, viajó a Tanzania para estudiar chimpancés en la naturaleza. Descubrió que usan herramientas y tienen emociones similares a los humanos. Fundó institutos para proteger animales y educar sobre el medio ambiente. Aún hoy, viaja promoviendo la conservación.",
    timeline: [
      { age: 23, event: "Viajó a África por primera vez" },
      { age: 26, event: "Comenzó su estudio de chimpancés en Gombe" },
      { age: 34, event: "Publicó sus descubrimientos clave" },
      { age: 41, event: "Fundó el Instituto Jane Goodall" },
      { age: 70, event: "Recibió honores por su trabajo en conservación" }
    ],
    inspiration: "Jane nos enseña que podemos marcar la diferencia protegiendo la naturaleza y entendiendo a los animales.",
    quiz: {
      question: "¿Qué descubrió Jane Goodall sobre los chimpancés?",
      options: [
        "Que vuelan",
        "Que usan herramientas",
        "Que viven bajo el agua",
        "Que hablan humano"
      ],
      correct: 1,
      explanation: "Jane descubrió que los chimpancés usan herramientas, cambiando nuestra visión de los animales."
    },
    funFacts: [
      "Llevaba un peluche de chimpancé de niña",
      "Vivió sola en la jungla durante años",
      "Es mensajera de la paz de la ONU"
    ]
  }
];

const biographiesLevel3: Biography[] = [
 
  {
    id: 9,
    name: "Martin Luther King Jr.",
    title: "El Luchador por los Derechos Civiles",
    birthYear: 1929,
    country: "Estados Unidos",
    category: "Derechos Humanos",
    emoji: "🕊️",
    mainAchievement: "Lideró el movimiento por los derechos civiles usando la no violencia",
    story: "Martin Luther King nació en una época de segregación racial en EE.UU. Como pastor, lideró protestas pacíficas contra la discriminación. Su famoso discurso 'Tengo un sueño' inspiró a millones. Ganó el Premio Nobel de la Paz y ayudó a pasar leyes por la igualdad. Trágicamente, fue asesinado, pero su legado vive.",
    timeline: [
      { age: 26, event: "Lideró el boicot a los autobuses en Montgomery" },
      { age: 34, event: "Pronunció 'Tengo un sueño'" },
      { age: 35, event: "Ganó el Premio Nobel de la Paz" },
      { age: 36, event: "Apoyó la Ley de Derechos Civiles" },
      { age: 39, event: "Marcha de Selma a Montgomery" }
    ],
    inspiration: "King nos enseña que la no violencia y el amor pueden vencer al odio y la injusticia.",
    quiz: {
      question: "¿Cuál fue el famoso discurso de Martin Luther King?",
      options: [
        "Tengo un sueño",
        "Sí, podemos",
        "Paz en la tierra",
        "Libertad ahora"
      ],
      correct: 0,
      explanation: "'Tengo un sueño' es el discurso icónico sobre igualdad racial."
    },
    funFacts: [
      "Fue el ganador más joven del Nobel de la Paz en su momento",
      "Estudió las enseñanzas de Gandhi",
      "Hay un feriado nacional en su honor en EE.UU."
    ]
  },
  {
    id: 10,
    name: "Amelia Earhart",
    title: "La Pionera de la Aviación",
    birthYear: 1897,
    country: "Estados Unidos",
    category: "Aventura",
    emoji: "✈️",
    mainAchievement: "Fue la primera mujer en volar sola sobre el Atlántico",
    story: "Amelia Earhart amaba la aventura. Aprendió a volar y rompió récords en aviación. Cruzó el Atlántico sola, inspirando a mujeres a entrar en campos dominados por hombres. Desapareció en un vuelo alrededor del mundo, pero su espíritu valiente perdura.",
    timeline: [
      { age: 23, event: "Tomó su primera lección de vuelo" },
      { age: 30, event: "Cruzó el Atlántico como pasajera" },
      { age: 34, event: "Voló sola sobre el Atlántico" },
      { age: 37, event: "Voló sola de Hawái a California" },
      { age: 39, event: "Intentó volar alrededor del mundo" }
    ],
    inspiration: "Amelia nos muestra que las mujeres pueden lograr hazañas audaces y romper barreras.",
    quiz: {
      question: "¿Qué hazaña hizo Amelia Earhart?",
      options: [
        "Primera en el espacio",
        "Primera en volar sola sobre el Atlántico",
        "Primera en conducir un auto",
        "Primera en escalar el Everest"
      ],
      correct: 1,
      explanation: "Amelia fue la primera mujer en volar sola sobre el Atlántico."
    },
    funFacts: [
      "Llevaba un diario de vuelos",
      "Diseñó ropa para aviadoras",
      "Su avión se llamó 'Electra'"
    ]
  },
  {
    id: 11,
    name: "Stephen Hawking",
    title: "El Científico del Universo",
    birthYear: 1942,
    country: "Reino Unido",
    category: "Ciencia",
    emoji: "🌌",
    mainAchievement: "Explicó los agujeros negros y el Big Bang pese a su enfermedad",
    story: "Stephen Hawking fue diagnosticado con una enfermedad que lo dejó en silla de ruedas, pero su mente brilló. Escribió libros sobre el universo accesibles para todos. Su trabajo sobre agujeros negros cambió la física. Comunicaba con una computadora y inspiró a muchos con su determinación.",
    timeline: [
      { age: 21, event: "Diagnosticado con ELA" },
      { age: 32, event: "Propuso la radiación de Hawking" },
      { age: 46, event: "Publicó 'Una breve historia del tiempo'" },
      { age: 59, event: "Ganó premios científicos" },
      { age: 70, event: "Continuó trabajando en cosmología" }
    ],
    inspiration: "Hawking nos enseña que las limitaciones físicas no detienen una mente curiosa.",
    quiz: {
      question: "¿Qué libro famoso escribió Stephen Hawking?",
      options: [
        "El origen de las especies",
        "Una breve historia del tiempo",
        "1984",
        "El principito"
      ],
      correct: 1,
      explanation: "'Una breve historia del tiempo' explica el universo de manera simple."
    },
    funFacts: [
      "Apareció en Los Simpsons y Star Trek",
      "Su voz era generada por computadora",
      "Vivió mucho más de lo predicho por su enfermedad"
    ]
  },
  {
    id: 12,
    name: "Rosa Parks",
    title: "La Madre del Movimiento por los Derechos Civiles",
    birthYear: 1913,
    country: "Estados Unidos",
    category: "Derechos Humanos",
    emoji: "🚌",
    mainAchievement: "Se negó a ceder su asiento en un bus, iniciando el boicot de Montgomery",
    story: "Rosa Parks creció en una era de segregación. Como costurera, un día se negó a dar su asiento a un hombre blanco en un bus, lo que la arrestaron. Esto encendió el movimiento por derechos civiles. Trabajó con Martin Luther King y luchó por la igualdad toda su vida.",
    timeline: [
      { age: 19, event: "Se unió a la NAACP" },
      { age: 42, event: "Se negó a ceder su asiento en el bus" },
      { age: 43, event: "Inició el boicot a los autobuses" },
      { age: 50, event: "Trabajó en el Congreso" },
      { age: 81, event: "Recibió la Medalla Presidencial de la Libertad" }
    ],
    inspiration: "Rosa nos enseña que un acto de coraje puede iniciar grandes cambios sociales.",
    quiz: {
      question: "¿Qué acción famosa hizo Rosa Parks?",
      options: [
        "Volar un avión",
        "Negarse a ceder su asiento en un bus",
        "Escribir un libro",
        "Ganar una carrera"
      ],
      correct: 1,
      explanation: "Su negativa inició el boicot y el movimiento por derechos civiles."
    },
    funFacts: [
      "Era costurera de profesión",
      "Hay estatuas y museos en su honor",
      "Vivió hasta los 92 años"
    ]
  }
];

const allBiographies = [biographiesLevel1, biographiesLevel2, biographiesLevel3];
const MAX_LEVEL = 3;

export function BiografiasSencillas({ onBack, level: initialLevel = 1 }: BiografiasSencillasProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [currentBio, setCurrentBio] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [levelComplete, setLevelComplete] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [readBiographies, setReadBiographies] = useState<Set<number>>(new Set());

  const biographies = allBiographies[currentLevel - 1];
  const biography = biographies[currentBio];
  const progress = (currentBio  / biographies.length) * 100;


  useEffect(() => {
    setCurrentLevel(initialLevel);
    setCurrentBio(0);
    setScore(0);
    setLevelComplete(false);
    setShowMotivational(false);
    setReadBiographies(new Set());
    setShowQuiz(false);
    setSelectedAnswer(null);
    setShowReward(false);
  }, [initialLevel]);

  const finishReading = () => {
    setReadBiographies(prev => new Set([...prev, currentBio]));
    setScore(prev => prev + 30);
    setShowQuiz(true);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);

    if (answerIndex === biography.quiz.correct) {
      setScore(prev => prev + 20);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    }

    setTimeout(() => {
      if (currentBio < biographies.length - 1) {
        nextBiography();
      } else {
        setShowMotivational(true);
      }
    }, 3000);
  };

  if (!gameStarted) {
    return <StartScreenBiografiasSencillas onStart={() => setGameStarted(true)} onBack={onBack} />;
  }

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

  const restartLevel = () => {
    setCurrentBio(0);
    setScore(0);
    setLevelComplete(false);
    setShowMotivational(false);
    setReadBiographies(new Set());
    setShowQuiz(false);
    setSelectedAnswer(null);
    setShowReward(false);
  };

  const loadNextLevel = () => {
    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel(currentLevel + 1);
      setCurrentBio(0);
      setScore(0);
      setLevelComplete(false);
      setShowMotivational(false);
      setReadBiographies(new Set());
      setShowQuiz(false);
      setSelectedAnswer(null);
      setShowReward(false);
    } else {
      setLevelComplete(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Ciencia': 'bg-blue-100 text-blue-700 border-blue-300',
      'Arte e Inventos': 'bg-purple-100 text-purple-700 border-purple-300',
      'Arte': 'bg-pink-100 text-pink-700 border-pink-300',
      'Derechos Humanos': 'bg-green-100 text-green-700 border-green-300',
      'Tecnología': 'bg-orange-100 text-orange-700 border-orange-300',
      'Aventura': 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-300';
  };


  const maxPoints = biographies.length * 50;


  if (showQuiz && !showMotivational && !levelComplete) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto">
          <GameHeader
            title={`Quiz: ${biography.name} - Nivel ${currentLevel}`}
            score={score}
            onBack={onBack}
            onRestart={restartLevel}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-8"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200">
              <CardContent className="p-8">
                <h3 className="text-xl mb-6 text-black">{biography.quiz.question}</h3>

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
                            : index === biography.quiz.correct && selectedAnswer !== null
                            ? 'bg-green-100 border-green-400 text-green-800'
                            : 'bg-gray-100 border-gray-300 text-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-lg text-black flex-1">{option}</span>
                          {selectedAnswer !== null && index === biography.quiz.correct && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
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

        {/* MENSAJE MOTIVACIONAL*/}
        {showMotivational && (
          <MotivationalMessage
            score={score}
            total={maxPoints}
            customMessage="¡Has leído todas las biografías!"
            customSubtitle="Completaste todas las lecturas del nivel"
            onComplete={() => {
              setShowMotivational(false);
              setLevelComplete(true);
            }}
          />
        )}

        {/* MODAL FINAL  */}
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
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="max-w-6xl mx-auto">

        <GameHeader
          title={`Biografías Sencillas`}
          level={currentLevel}
          score={score}
          onBack={onBack}
          onRestart={restartLevel}
        />

        <ProgressBar
          current={currentBio + 1}
          total={biographies.length}
          progress={progress}
        />

        <AnimalGuide
          animal="monkey"
          message="¡Conoce personas extraordinarias que cambiaron el mundo! Sus historias nos inspiran a ser mejores."
        />

        <div className="grid lg:grid-cols-3 gap-8 mt-6">
          {/* Main Biography */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentBio}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 mb-6">
                <CardContent className="p-8">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-8xl">{biography.emoji}</div>
                    <div className="flex-1">
                      <h2 className="text-3xl text-black mb-2">{biography.name}</h2>
                      <p className="text-xl text-black mb-3">{biography.title}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className={`${getCategoryColor(biography.category)} border`}>
                          {biography.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-black">
                          <Calendar className="w-4 h-4" />
                          <span>{biography.birthYear}</span>
                        </div>
                        <div className="flex items-center gap-1 text-black">
                          <MapPin className="w-4 h-4" />
                          <span>{biography.country}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <h3 className="text-lg text-yellow-800">Principal Logro:</h3>
                    </div>
                    <p className="text-yellow-700">{biography.mainAchievement}</p>
                  </div>

                  <div className="mb-6">
                    <AudioPlayer text={`Reproduciendo biografía de ${biography.name}...`} duration={5000} />
                  </div>

                  <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-200 mb-6">
                    <p className="text-lg leading-relaxed text-black">{biography.story}</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">Lightbulb</span>
                      <h4 className="text-lg text-green-800">Inspiración:</h4>
                    </div>
                    <p className="text-green-700 italic">"{biography.inspiration}"</p>
                  </div>
                </CardContent>
              </Card>

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

    
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-black flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Cronología de Vida
                </h3>
                <div className="space-y-4">
                  {biography.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">
                        {event.age}
                      </div>
                      <p className="text-black text-sm">{event.event}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-black flex items-center gap-2">
                  <span className="text-orange-500">Thinking Face</span>
                  Datos Curiosos
                </h3>
                <div className="space-y-3">
                  {biography.funFacts.map((fact, index) => (
                    <div key={index} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <p className="text-orange-800 text-sm">{fact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

   
        <div className="flex justify-between items-center mt-8">
          <Button
            onClick={previousBiography}
            disabled={currentBio === 0}
            variant="outline"
            className="bg-white/80 backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
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
            {currentBio === biographies.length - 1 ? "Finalizar Nivel" : "Siguiente"}
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
            total={maxPoints}
            customMessage="¡Has conocido vidas inspiradoras!"
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
  );
}