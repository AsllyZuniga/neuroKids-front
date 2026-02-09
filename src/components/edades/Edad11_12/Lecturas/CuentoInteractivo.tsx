import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { BookOpen, Users, Brain, Volume2 } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { Progress } from '../../../ui/progress';
import { Badge } from '../../../ui/badge';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';
import { GameHeader } from '../../../others/GameHeader';
import { ProgressBar } from '../../../others/ProgressBar';
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { StartScreenCuentoInteractivo } from '../IniciosJuegosLecturas/StartScreenCuentoInteractivo';

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
        emotion: "En conflicto",
        choices: [
          { text: "Devolver inmediatamente la billetera a Sam", consequence: "Alex se sintió bien consigo mismo y Sam le agradeció enormemente", emotionalImpact: "positive", nextSection: 2, points: 20 },
          { text: "Quedarse con el dinero y devolver solo la billetera vacía", consequence: "Alex se sintió culpable y Sam se puso muy triste", emotionalImpact: "negative", nextSection: 3, points: 5 },
          { text: "Buscar a un maestro para entregar la billetera", consequence: "El maestro elogió a Alex por su honestidad", emotionalImpact: "positive", nextSection: 4, points: 15 }
        ],
        reflectionQuestion: "¿Qué harías tú en el lugar de Alex? ¿Por qué?"
      },
      {
        id: 2,
        text: "Sam abrazó a Alex con lágrimas de alivio. 'Pensé que había perdido todo el dinero que ahorré', dijo Sam. 'Eres el mejor amigo que alguien puede tener.' Alex se sintió orgulloso de haber tomado la decisión correcta, aunque había sido tentador quedarse con el dinero.",
        character: "Sam",
        emotion: "Agradecido/a",
        choices: [
          { text: "Alex le cuenta a Sam sobre la tentación que sintió", consequence: "Sam aprecia aún más la honestidad de Alex", emotionalImpact: "positive", nextSection: 5, points: 25 },
          { text: "Alex no dice nada sobre la tentación", consequence: "Alex se queda con sus sentimientos para sí mismo", emotionalImpact: "neutral", nextSection: 6, points: 10 }
        ]
      },
      {
        id: 3,
        text: "Alex le devolvió la billetera a Sam, pero sin el dinero. Sam revisó la billetera y se puso muy triste. 'No entiendo', murmuró Sam. 'Estaba seguro de que había dinero aquí.' Alex evitó la mirada de su amigo, sintiendo un nudo en el estómago.",
        character: "Sam",
        emotion: "Triste",
        choices: [
          { text: "Alex confiesa lo que hizo", consequence: "Sam se sintió herido pero apreció la honestidad tardía", emotionalImpact: "neutral", nextSection: 7, points: 15 },
          { text: "Alex sigue mintiendo", consequence: "Alex se sintió cada vez más solo", emotionalImpact: "negative", nextSection: 8, points: 0 }
        ]
      },
      {
        id: 4,
        text: "La maestra Williams elogió a Alex frente a toda la clase. 'Este es un ejemplo perfecto de integridad', dijo. Sam recuperó su dinero y le agradeció tanto a Alex como a la maestra. Alex se sintió bien por haber hecho lo correcto.",
        character: "Maestra Williams",
        emotion: "Orgulloso/a",
        choices: [
          { text: "Alex se siente motivado a seguir siendo honesto", consequence: "Alex desarrolló una reputación de persona confiable", emotionalImpact: "positive", nextSection: 9, points: 20 }
        ]
      },
      {
        id: 5,
        text: "'Wow', dijo Sam. 'Debe haber sido difícil resistir la tentación, especialmente sabiendo que querías ese libro. Eso hace que tu honestidad sea aún más valiosa.' La amistad entre Alex y Sam se fortaleció más que nunca.",
        character: "Sam",
        emotion: "Admirable",
        choices: [
          { text: "Alex y Sam hacen un pacto de honestidad mutua", consequence: "Su amistad se volvió inquebrantable", emotionalImpact: "positive", nextSection: 10, points: 30 }
        ]
      },
      {
        id: 6,
        text: "Aunque Alex no mencionó la tentación, Sam seguía muy agradecido. Los dos amigos pasaron el resto del recreo jugando juntos, pero Alex guardó un pequeño secreto en su corazón.",
        character: "Alex",
        emotion: "Pensativo/a",
        choices: [
          { text: "Alex decide ser más abierto en el futuro", consequence: "Aprendió que compartir sentimientos fortalece la amistad", emotionalImpact: "positive", nextSection: 10, points: 15 }
        ]
      },
      {
        id: 7,
        text: "Sam se quedó en silencio por un momento. 'Me duele que hayas hecho eso, pero gracias por decírmelo ahora', respondió. Con el tiempo, la amistad se recuperó gracias a la honestidad.",
        character: "Sam",
        emotion: "Herido/a",
        choices: [
          { text: "Sam y Alex hablan sobre cómo reconstruir la confianza", consequence: "Aprendieron que la honestidad repara errores", emotionalImpact: "positive", nextSection: 10, points: 20 }
        ]
      },
      {
        id: 8,
        text: "Los días siguientes fueron incómodos. Sam evitaba a Alex, y Alex se sentía cada vez más solo. Finalmente, Alex entendió que una mentira pequeña puede causar un daño grande.",
        character: "Alex",
        emotion: "Arrepentido/a",
        choices: [
          { text: "Alex decide confesar la verdad más tarde", consequence: "Aunque tardío, el arrepentimiento ayudó a sanar", emotionalImpact: "neutral", nextSection: 10, points: 10 }
        ]
      },
      {
        id: 9,
        text: "Desde ese día, otros niños empezaron a confiar en Alex con sus secretos. Ser honesto una vez abrió la puerta a muchas oportunidades de amistad.",
        character: "Alex",
        emotion: "Confidente",
        choices: [
          { text: "Alex se convierte en un líder positivo en la clase", consequence: "Su ejemplo inspiró a otros", emotionalImpact: "positive", nextSection: 10, points: 25 }
        ]
      },
      {
        id: 10,
        text: "Al final del día, Alex y Sam se sentaron juntos en el autobús. Habían aprendido que la verdadera amistad sobrevive a los errores cuando hay honestidad y perdón. Alex sonrió: valía más que cualquier libro.",
        character: "Narrador",
        emotion: "Esperanzado/a",
        choices: []
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
        emotion: "Descuidado/a",
        choices: [
          { text: "Ir inmediatamente a la escuela a regar las plantas", consequence: "Las plantas estuvieron bien y Maya se sintió responsable", emotionalImpact: "positive", nextSection: 2, points: 20 },
          { text: "Decidir ir al día siguiente", consequence: "Maya pospuso la responsabilidad", emotionalImpact: "neutral", nextSection: 3, points: 10 },
          { text: "Olvidarse completamente de las plantas", consequence: "Las plantas comenzaron a marchitarse", emotionalImpact: "negative", nextSection: 4, points: 0 }
        ],
        reflectionQuestion: "¿Cómo manejas tus responsabilidades cuando hay cosas más divertidas que hacer?"
      },
      {
        id: 2,
        text: "Maya llegó a la escuela y encontró las plantas en perfecto estado. Se sintió bien al cumplir con su responsabilidad. Mientras regaba cada planta cuidadosamente, notó que algunas estaban comenzando a florecer. Se dio cuenta de que cuidar algo requiere dedicación constante.",
        character: "Maya",
        emotion: "Responsable",
        choices: [
          { text: "Maya crea un horario fijo para cuidar las plantas", consequence: "Las plantas florecieron espectacularmente", emotionalImpact: "positive", nextSection: 5, points: 25 },
          { text: "Maya sigue yendo cuando se acuerda", consequence: "Algunas plantas sufrieron un poco", emotionalImpact: "neutral", nextSection: 6, points: 10 }
        ]
      },
      {
        id: 3,
        text: "Al día siguiente, Maya se dio cuenta de que había olvidado ir. Corrió a la escuela y vio que algunas hojas estaban un poco secas. 'Mañana sin falta', se prometió a sí misma.",
        character: "Maya",
        emotion: "Preocupado/a",
        choices: [
          { text: "Maya va todos los días desde entonces", consequence: "Recuperó el control y las plantas se salvaron", emotionalImpact: "positive", nextSection: 5, points: 20 },
          { text: "Maya sigue posponiendo", consequence: "El daño fue mayor", emotionalImpact: "negative", nextSection: 7, points: 5 }
        ]
      },
      {
        id: 4,
        text: "Cuando Maya finalmente recordó, varias plantas estaban marchitas. El proyecto científico estaba en peligro. Se sintió terrible al ver el daño causado por su descuido.",
        character: "Maya",
        emotion: "Culpable",
        choices: [
          { text: "Maya intenta salvar lo que pueda", consequence: "Algunas plantas sobrevivieron gracias a su esfuerzo", emotionalImpact: "neutral", nextSection: 8, points: 15 },
          { text: "Maya se rinde y no hace nada", consequence: "El proyecto fracasó por completo", emotionalImpact: "negative", nextSection: 9, points: 0 }
        ]
      },
      {
        id: 5,
        text: "Gracias al horario de Maya, todas las plantas crecieron fuertes y saludables. En la presentación del proyecto, la clase recibió el primer lugar. Maya se sintió orgullosa de su compromiso.",
        character: "Maya",
        emotion: "Orgulloso/a",
        choices: [
          { text: "Maya ofrece ayudar en futuros proyectos", consequence: "Se convirtió en una líder responsable", emotionalImpact: "positive", nextSection: 10, points: 30 }
        ]
      },
      {
        id: 6,
        text: "Algunas plantas sufrieron por la inconsistencia de Maya, pero la mayoría sobrevivió. Aprendió que la responsabilidad requiere constancia, no solo buenas intenciones.",
        character: "Maya",
        emotion: "Pensativo/a",
        choices: [
          { text: "Maya mejora su organización", consequence: "Mejoró sus hábitos con el tiempo", emotionalImpact: "positive", nextSection: 10, points: 20 }
        ]
      },
      {
        id: 7,
        text: "El daño fue irreversible para varias plantas. Maya se disculpó con la clase y prometió no volver a fallar en una responsabilidad.",
        character: "Maya",
        emotion: "Arrepentido/a",
        choices: [
          { text: "Maya se ofrece a replantar las perdidas", consequence: "Mostró compromiso real", emotionalImpact: "positive", nextSection: 10, points: 25 }
        ]
      },
      {
        id: 8,
        text: "Maya trabajó duro regando, podando y cuidando las plantas sobrevivientes. Aunque no todas se salvaron, su esfuerzo fue reconocido por sus compañeros.",
        character: "Maya",
        emotion: "Determinado/a",
        choices: [
          { text: "La clase aprende sobre segundas oportunidades", consequence: "El proyecto tuvo un final agridulce pero valioso", emotionalImpact: "neutral", nextSection: 10, points: 15 }
        ]
      },
      {
        id: 9,
        text: "El proyecto fracasó y la clase se sintió decepcionada. Maya entendió que las consecuencias de la irresponsabilidad afectan a todo un equipo.",
        character: "Clase",
        emotion: "Decepcionado/a",
        choices: [
          { text: "Maya promete cambiar y cumple", consequence: "Redimió su error en el futuro", emotionalImpact: "positive", nextSection: 10, points: 20 }
        ]
      },
      {
        id: 10,
        text: "Al final de las vacaciones, Maya miró las plantas y reflexionó sobre su viaje. Había aprendido que la responsabilidad no es solo una tarea, sino un compromiso con los demás y consigo misma.",
        character: "Narrador",
        emotion: "Sabio/a",
        choices: []
      }
    ]
  },
  {
    id: 3,
    title: "La Aventura de Carlos",
    theme: "Coraje y Amabilidad",
    moralLesson: "Ser valiente no significa no tener miedo, sino hacer lo correcto a pesar de él",
    sections: [
      {
        id: 1,
        text: "Carlos vio a un niño nuevo siendo acosado en el recreo. Nadie más parecía notarlo. Carlos sintió miedo de intervenir, pero sabía que era lo correcto.",
        character: "Carlos",
        emotion: "Miedoso/a",
        choices: [
          { text: "Intervenir y defender al niño", consequence: "Carlos hizo un nuevo amigo y se sintió valiente", emotionalImpact: "positive", nextSection: 2, points: 20 },
          { text: "Ignorar la situación", consequence: "Carlos se sintió mal después", emotionalImpact: "negative", nextSection: 3, points: 0 },
          { text: "Buscar ayuda de un adulto primero", consequence: "Se resolvió de forma segura", emotionalImpact: "neutral", nextSection: 4, points: 15 }
        ],
        reflectionQuestion: "¿Has visto alguna vez una situación injusta? ¿Qué hiciste?"
      },
      {
        id: 2,
        text: "El niño nuevo, Tom, agradeció a Carlos. Juntos reportaron el acoso al maestro. Carlos aprendió que la amabilidad requiere coraje.",
        character: "Tom",
        emotion: "Agradecido/a",
        choices: [
          { text: "Carlos y Tom se hacen amigos inseparables", consequence: "Formaron un vínculo duradero", emotionalImpact: "positive", nextSection: 5, points: 25 },
          { text: "Se ayudan mutuamente en clase", consequence: "Mejoraron juntos académicamente", emotionalImpact: "positive", nextSection: 6, points: 20 }
        ]
      },
      {
        id: 3,
        text: "Más tarde, Carlos se arrepintió de no ayudar. Decidió que la próxima vez sería diferente. El remordimiento le pesaba en el corazón.",
        character: "Carlos",
        emotion: "Arrepentido/a",
        choices: [
          { text: "Carlos habla con Tom al día siguiente", consequence: "Reparó su error con acción", emotionalImpact: "positive", nextSection: 7, points: 20 },
          { text: "Carlos evita a Tom por vergüenza", consequence: "Perdió una oportunidad de amistad", emotionalImpact: "negative", nextSection: 8, points: 5 }
        ]
      },
      {
        id: 4,
        text: "El maestro intervino rápidamente y detuvo el acoso. Carlos se sintió aliviado de haber actuado de forma inteligente.",
        character: "Maestro",
        emotion: "Autoritario/a",
        choices: [
          { text: "Carlos recibe reconocimiento por su madurez", consequence: "Se convirtió en un ejemplo a seguir", emotionalImpact: "positive", nextSection: 9, points: 20 }
        ]
      },
      {
        id: 5,
        text: "Carlos y Tom empezaron a almorzar juntos todos los días. Compartían risas, juegos y se apoyaban en los momentos difíciles. El coraje de Carlos creó una amistad para toda la vida.",
        character: "Carlos y Tom",
        emotion: "Feliz",
        choices: [
          { text: "Organizan un club anti-acoso en la escuela", consequence: "Cambian la cultura escolar", emotionalImpact: "positive", nextSection: 10, points: 35 }
        ]
      },
      {
        id: 6,
        text: "Tom ayudó a Carlos con matemáticas y Carlos ayudó a Tom con lectura. Juntos, ambos mejoraron sus notas y su confianza.",
        character: "Carlos y Tom",
        emotion: "Apoyoso/a",
        choices: [
          { text: "Se convierten en compañeros de estudio permanentes", consequence: "El éxito académico fue mutuo", emotionalImpact: "positive", nextSection: 10, points: 25 }
        ]
      },
      {
        id: 7,
        text: "'Lo siento por no ayudarte ayer', dijo Carlos. Tom sonrió: 'Gracias por venir hoy'. Su amistad comenzó con una disculpa sincera.",
        character: "Tom",
        emotion: "Comprensión",
        choices: [
          { text: "Se ayudan a enfrentar futuros desafíos", consequence: "Su vínculo creció con el tiempo", emotionalImpact: "positive", nextSection: 10, points: 30 }
        ]
      },
      {
        id: 8,
        text: "Carlos se sentía avergonzado cada vez que veía a Tom. Perdió la oportunidad de hacer un amigo por miedo a enfrentar su error.",
        character: "Carlos",
        emotion: "Avergonzado/a",
        choices: [
          { text: "Carlos finalmente se disculpa semanas después", consequence: "Aunque tardío, fue un paso valiente", emotionalImpact: "neutral", nextSection: 10, points: 15 }
        ]
      },
      {
        id: 9,
        text: "El maestro destacó a Carlos en la asamblea escolar como ejemplo de 'coraje inteligente'. Otros niños empezaron a buscar su consejo.",
        character: "Maestro",
        emotion: "Inspirador/a",
        choices: [
          { text: "Carlos se convierte en mentor de nuevos estudiantes", consequence: "Ayudó a muchos a adaptarse", emotionalImpact: "positive", nextSection: 10, points: 30 }
        ]
      },
      {
        id: 10,
        text: "Carlos miró hacia atrás y sonrió. Un pequeño acto de coraje había cambiado no solo su vida, sino la de muchos otros. Ser valiente vale la pena.",
        character: "Narrador",
        emotion: "Inspirador/a",
        choices: []
      }
    ]
  }
];

const MAX_LEVEL = stories.length;

export function CuentoInteractivo({ onBack, level: initialLevel = 1 }: CuentoInteractivoProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [levelPaths, setLevelPaths] = useState<string[][]>(() => Array.from({ length: MAX_LEVEL }, () => []));
  const [levelScores, setLevelScores] = useState<number[]>(() => Array.from({ length: MAX_LEVEL }, () => 0));
  const [showReward, setShowReward] = useState(false);
  const [showMotivational, setShowMotivational] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState(-1);
  const [isPlayingFinal, setIsPlayingFinal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [visitedSections, setVisitedSections] = useState<StorySection[]>([]);
  const MIN_FINAL_TIME = 10000;
  const [finalStartTime, setFinalStartTime] = useState<number | null>(null);

  const story = stories[currentLevel - 1];
  const section = story.sections.find(s => s.id === currentSection)

  const lastId = Math.max(...story.sections.map(s => s.id));
  const isLastSection = currentSection === lastId;

  const totalScore = levelScores.reduce((a, b) => a + b, 0) + currentScore;

  useEffect(() => {
    if (!section) return;

    setVisitedSections(prev => {
      if (prev.find(s => s.id === section.id)) return prev;
      return [...prev, section];
    });
  }, [section]);


  useEffect(() => {
    setCurrentLevel(initialLevel);
    setCurrentSection(1);
    setCurrentPath([]);
    setCurrentScore(0);
    setShowMotivational(false);
    setLevelComplete(false);
    setIsPlayingFinal(false);
    setVisitedSections([]);

  }, [initialLevel]);

  useEffect(() => {
    if (!section) return;
    const words = section.text.split(/\s+/);
    setHighlightedWord(-1);
    if (words.length === 0) return;

    const duration = Math.max(words.length * 120, 4000);

    const intervalTime = duration / words.length;
    let i = 0;
    const interval = setInterval(() => {
      setHighlightedWord(i);
      i++;
      if (i > words.length) clearInterval(interval);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [currentSection]);

  const makeChoice = (choice: StoryChoice) => {
    const newPath = [...currentPath, choice.consequence];
    const newScore = currentScore + choice.points;

    setCurrentPath(newPath);
    setCurrentScore(newScore);

    if (choice.emotionalImpact === 'positive') {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    }

    setTimeout(() => {
      if (choice.nextSection && story.sections.find(s => s.id === choice.nextSection)) {
        setCurrentSection(choice.nextSection);
      } else {
        setIsPlayingFinal(true);
      }
    }, 2000);
  };

  const handleFinalNarrationComplete = () => {
    const now = Date.now();
    const elapsed = finalStartTime ? now - finalStartTime : MIN_FINAL_TIME;
    const remaining = Math.max(MIN_FINAL_TIME - elapsed, 0);

    setTimeout(() => {
      setIsPlayingFinal(false);

      setLevelPaths(prev => {
        const newPaths = [...prev];
        newPaths[currentLevel - 1] = [...currentPath];
        return newPaths;
      });

      setLevelScores(prev => {
        const newScores = [...prev];
        newScores[currentLevel - 1] = currentScore;
        return newScores;
      });

      setShowMotivational(true);
    }, remaining);
  };


  const startFinalNarration = () => {
    setFinalStartTime(Date.now());
    setIsPlayingFinal(true);
  };

  const restartLevel = () => {
    setCurrentSection(1);
    setCurrentPath([]);
    setCurrentScore(0);
    setLevelComplete(false);
    setShowMotivational(false);
    setIsPlayingFinal(false);
    setVisitedSections([]);

  };

  const loadNextLevel = () => {
    if (currentLevel < MAX_LEVEL) {
      setCurrentLevel(currentLevel + 1);
      setCurrentSection(1);
      setCurrentPath([]);
      setCurrentScore(0);
      setLevelComplete(false);
      setShowMotivational(false);
      setIsPlayingFinal(false);
      setVisitedSections([]);

    } else {
      setLevelComplete(false);
    }
  };

  const restartAll = () => {
    setCurrentLevel(1);
    setCurrentSection(1);
    setCurrentPath([]);
    setCurrentScore(0);
    setLevelPaths(Array.from({ length: MAX_LEVEL }, () => []));
    setLevelScores(Array.from({ length: MAX_LEVEL }, () => 0));
    setLevelComplete(false);
    setVisitedSections([]);

  };

  if (!gameStarted) {
    return <StartScreenCuentoInteractivo onStart={() => { setCurrentSection(1); setGameStarted(true); }} onBack={onBack} />;
  }

  const getEmotionColor = (emotion: string) => {
    const map: Record<string, string> = {
      Feliz: 'bg-green-100 border-green-300',
      Triste: 'bg-blue-100 border-blue-300',
      Conflicto: 'bg-yellow-100 border-yellow-300',
      Agradecido: 'bg-purple-100 border-purple-300',
      Orgulloso: 'bg-indigo-100 border-indigo-300',
      Inspiración: 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300'
    };
    return map[emotion] || 'bg-gray-100 border-gray-300';
  };

  const getEmotionEmoji = (emotion: string) => {
    const map: Record<string, string> = {
      Feliz: '☺️',
      Triste: '☹️',
      Conflicto: '🤔',
      Inspiración: '🤭'
    };
    return map[emotion] || '🙂';
  };

  const progress = (story.sections.findIndex(s => s.id === currentSection) + 1)
    / story.sections.length * 100;



  const maxPoints = story.sections.length * 50;

  if (!section) return <div>Error: Sección no encontrada</div>;


  const fullStoryText = visitedSections
    .map((s, i) => {
      const decision = currentPath[i];
      if (decision) {
        return `${s.text} Luego, ${decision}.`;
      }
      return s.text;
    })
    .join(' ');

  const displayText = isLastSection && isPlayingFinal ? fullStoryText : section.text;
  const words = displayText.split(/\s+/);


  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
      <div className="max-w-6xl mx-auto">

        <GameHeader
          title={`Cuento Interactivo`}
          level={currentLevel}
          score={totalScore}
          onBack={onBack}
          onRestart={restartLevel}
        />

        <ProgressBar
          current={currentSection}
          total={story.sections.length}
          progress={progress}
        />

        <AnimalGuide
          animal="frog"
          message="¡Tú decides el final! Cada elección enseña una lección valiosa."
        />

        <div className="grid lg:grid-cols-3 gap-8 mt-6">

          <div className="lg:col-span-2">
            <motion.div
              key={currentSection}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={`bg-white/90 backdrop-blur-sm border-2 text-black ${"Emoción:" + getEmotionColor(section.emotion)}`}>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6 text-black">
                    <div className="text-4xl text-black">{getEmotionEmoji("Emoción:" + section.emotion)}</div>
                    <div>
                      <h3 className="text-lg text-black">{section.character}</h3>
                      <Badge variant="secondary" className="text-xs">{"Emoción: " + section.emotion}</Badge>
                    </div>
                  </div>


                  {!isLastSection && !isPlayingFinal && (
                    <div className="mb-6">
                      <AudioPlayer text={section.text} onSpeakingChange={setIsSpeaking} />
                    </div>
                  )}


                  {isLastSection && isPlayingFinal && (
                    <div className="mb-6">
                      <AudioPlayer
                        text={fullStoryText}
                        onEnd={handleFinalNarrationComplete}
                        voice="child"
                        autoPlay
                      />
                    </div>
                  )}

                  <div className="bg-white/80 p-6 rounded-lg border border-gray-200 mb-6">
                    <p className="text-lg leading-relaxed text-black">
                      {words.map((word, i) => (
                        <span key={i} >
                          {word}{' '}
                        </span>
                      ))}
                    </p>
                  </div>

                  {section.reflectionQuestion && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-blue-500" />
                        <h4 className="text-lg text-blue-800">Reflexiona:</h4>
                      </div>
                      <p className="text-blue-700">{section.reflectionQuestion}</p>
                    </div>
                  )}


                  {isLastSection && !isPlayingFinal && section.choices.length === 0 && (
                    <div className="text-center mt-6">
                      <Button
                        onClick={startFinalNarration}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg font-semibold shadow-lg"
                      >
                        <Volume2 className="w-6 h-6 mr-3" />
                        Escuchar mi historia completa
                      </Button>
                    </div>
                  )}

                  {section.choices.length > 0 && (
                    <div className="space-y-4 text-left">
                      <h4 className="text-lg text-black flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-500" /> ¿Qué decides?
                      </h4>
                      {section.choices.map((choice, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            onClick={() => makeChoice(choice)}
                            variant="outline"
                            className="w-full flex items-start justify-start text-left p-4 pl-2 h-auto bg-white/80 hover:bg-white border-2 hover:border-purple-300"
                          >
                            <div className="flex items-start gap-3 w-full">
                              <div className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs mt-1">
                                {String.fromCharCode(65 + i)}
                              </div>
                              <div className="flex-1">
                                <div className="text-lg text-black mb-1">{choice.text}</div>

                              </div>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>


          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200">
              <CardContent className="p-6">
                <h3 className="text-lg mb-4 text-black flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-500" /> Sobre esta Historia
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Tema:</h4>
                    <p className="text-black">{story.theme}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-600 mb-1">Lección:</h4>
                    <p className="text-black text-sm">{story.moralLesson}</p>
                  </div>
                  <div>

                  </div>
                </div>

                {currentPath.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm text-gray-600 mb-2">Tu camino:</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {currentPath.map((p, i) => (
                        <div key={i} className="text-xs bg-gray-50 p-2 rounded border">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-4 h-4 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs">
                              {i + 1}
                            </div>
                            <span className="text-gray-600">Decisión</span>
                          </div>
                          <p className="text-black">{p}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <RewardAnimation
          type="star"
          show={showReward}
          message="¡Buena decisión!"
          onComplete={() => setShowReward(false)}
        />

        {/* MENSAJE MOTIVACIONAL */}
        {showMotivational && (
          <MotivationalMessage
            score={currentScore}
            total={maxPoints}
            customMessage="¡Tu historia ha terminado!"
            customSubtitle="Completaste todas las secciones del cuento"
            celebrationText="¡Excelente!"
            onComplete={() => {
              setShowMotivational(false);
              setLevelComplete(true);
            }}
          />
        )}

        {/* MODAL FINAL */}
        {levelComplete && !showMotivational && (
          <LevelCompleteModal
            score={currentScore}
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