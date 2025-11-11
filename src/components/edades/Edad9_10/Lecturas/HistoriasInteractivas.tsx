import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Brain, Users } from 'lucide-react';
import { ButtonWithAudio } from '../../../ui/ButtonWithAudio';
import { Card, CardContent } from '../../../ui/card';
import { AnimalGuide } from '../../../others/AnimalGuide';
import { RewardAnimation } from '../../../others/RewardAnimation';
import { AudioPlayer } from '../../../others/AudioPlayer';
import { GameHeader } from '../../../others/GameHeader';
import { ProgressBar } from '../../../others/ProgressBar';
import { MotivationalMessage } from '../../../others/MotivationalMessage';
import { LevelCompleteModal } from '../../../others/LevelCompleteModal';
import { ConfettiExplosion } from '../../../others/ConfettiExplosion';
import { StartScreenHistoriasInteractivas } from '../IniciosJuegosLecturas/StartScreenHistoriasInteractivas/StartScreenHistoriasInteractivas';

interface HistoriasInteractivasProps {
  onBack: () => void;
  onNextLevel: () => void;
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
      7: {
        id: 7,
        text: "Alex sugiere vendar la herida del unicornio con hojas del bosque. El unicornio, agradecido por la creatividad, le revela un sendero secreto hacia una cueva mágica.",
        image: "🍃🦄",
        choices: [
          { text: "Explorar la cueva mágica", nextPart: 13, points: 20, consequence: "Alex descubre maravillas ocultas" },
          { text: "Preguntar sobre la cueva", nextPart: 14, points: 15, consequence: "Alex aprende sobre sus peligros" },
          { text: "Volver al lago", nextPart: 5, points: 10, consequence: "Alex busca la hierba mágica" }
        ]
      },
      8: {
        id: 8,
        text: "El hada, complacida con la promesa de Alex, lo guía hacia un claro donde las criaturas del bosque se reúnen para compartir sus historias.",
        image: "🧚‍♀️🌳",
        choices: [
          { text: "Unirse a las criaturas", nextPart: 13, points: 25, consequence: "Alex se gana su confianza" },
          { text: "Pedir un deseo al hada", nextPart: 14, points: 20, consequence: "Alex recibe un don mágico" },
          { text: "Explorar más allá del claro", nextPart: 15, points: 15, consequence: "Alex encuentra un nuevo desafío" }
        ]
      },
      9: {
        id: 9,
        text: "El hada revela que el bosque está protegido por un antiguo hechizo que solo permite pasar a quienes demuestran bondad. Alex debe realizar una prueba para avanzar.",
        image: "🧙‍♀️✨",
        choices: [
          { text: "Aceptar la prueba", nextPart: 13, points: 20, consequence: "Alex demuestra su bondad" },
          { text: "Preguntar sobre el hechizo", nextPart: 14, points: 15, consequence: "Alex aprende magia antigua" },
          { text: "Buscar otra ruta", nextPart: 15, points: 10, consequence: "Alex evita la prueba" }
        ]
      },
      10: {
        id: 10,
        text: "El hada otorga a Alex un amuleto de protección y le indica un camino hacia el corazón del bosque, donde reside un espíritu ancestral.",
        image: "🧿🌲",
        choices: [
          { text: "Seguir el camino", nextPart: 13, points: 25, consequence: "Alex encuentra al espíritu" },
          { text: "Examinar el amuleto", nextPart: 14, points: 15, consequence: "Alex descubre su poder" },
          { text: "Volver con el hada", nextPart: 8, points: 10, consequence: "Alex refuerza su alianza" }
        ]
      },
      11: {
        id: 11,
        text: "Alex se prepara recolectando provisiones y estudiando mapas del bosque. Ahora más confiado, regresa al bosque con nuevos conocimientos.",
        image: "🗺️🎒",
        choices: [
          { text: "Entrar al bosque preparado", nextPart: 2, points: 15, consequence: "Alex está listo para la aventura" },
          { text: "Buscar al hada guardiana", nextPart: 3, points: 12, consequence: "Alex busca guía mágica" },
          { text: "Explorar los alrededores", nextPart: 12, points: 10, consequence: "Alex descubre nuevos caminos" }
        ]
      },
      12: {
        id: 12,
        text: "Alex encuentra a un grupo de viajeros que también quieren explorar el bosque. Juntos, deciden formar un equipo para enfrentar los misterios.",
        image: "👥🌲",
        choices: [
          { text: "Liderar al equipo hacia el bosque", nextPart: 2, points: 20, consequence: "Alex se convierte en líder" },
          { text: "Planificar con el equipo", nextPart: 11, points: 15, consequence: "Alex fortalece el grupo" },
          { text: "Buscar al unicornio", nextPart: 2, points: 10, consequence: "Alex sigue su instinto" }
        ]
      },
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
      14: {
        id: 14,
        text: "Alex aprende sobre las criaturas mágicas del bosque, incluyendo dragones y espíritus antiguos. Este conocimiento lo prepara para un nuevo desafío.",
        image: "🐉✨",
        choices: [
          { text: "Buscar a los dragones", nextPart: 13, points: 25, consequence: "Alex enfrenta una aventura épica" },
          { text: "Contactar al espíritu ancestral", nextPart: 15, points: 20, consequence: "Alex recibe sabiduría" },
          { text: "Regresar al claro", nextPart: 8, points: 10, consequence: "Alex reflexiona sobre su viaje" }
        ]
      },
      15: {
        id: 15,
        text: "Alex jura proteger el bosque y se encuentra con el espíritu del bosque, quien le otorga el título de Guardián del Bosque.",
        image: "🌳🛡️",
        choices: [
          { text: "Aceptar el rol de guardián", nextPart: 18, points: 30, consequence: "¡Final Épico: Alex es el guardián!" },
          { text: "Explorar más el bosque", nextPart: 13, points: 20, consequence: "Alex continúa su aventura" },
          { text: "Invitar a otros a proteger", nextPart: 20, points: 25, consequence: "¡Final Unificador: Alex forma un consejo!" }
        ]
      },
      16: {
        id: 16,
        text: "Meditando con el unicornio, Alex descubre una paz interior que le da claridad para sus próximas decisiones.",
        image: "🧘‍♂️🦄",
        choices: [
          { text: "Buscar la hierba mágica", nextPart: 5, points: 20, consequence: "Alex actúa con claridad" },
          { text: "Explorar el bosque", nextPart: 13, points: 15, consequence: "Alex sigue su intuición" },
          { text: "Quedarse con el unicornio", nextPart: 17, points: 10, consequence: "Alex fortalece su vínculo" }
        ]
      },
      17: {
        id: 17,
        text: "Al compartir una historia personal, el unicornio confía en Alex y le revela un secreto sobre el bosque que lo lleva a un nuevo destino.",
        image: "📖🦄",
        choices: [
          { text: "Seguir el secreto", nextPart: 13, points: 20, consequence: "Alex descubre un tesoro oculto" },
          { text: "Preguntar más al unicornio", nextPart: 6, points: 15, consequence: "Alex profundiza su conexión" },
          { text: "Explorar solo", nextPart: 15, points: 10, consequence: "Alex toma su propio camino" }
        ]
      },
      18: {
        id: 18,
        text: "Alex participa en la gran celebración del bosque. Las criaturas mágicas lo nombran 'Amigo Eterno del Bosque Encantado' y le regalan un collar mágico que le permitirá volver siempre que quiera. ¡Ha vivido la aventura más increíble de su vida!",
        image: "🏆🌟🎊",
        choices: []
      },
      19: {
        id: 19,
        text: "Alex organiza una celebración épica, ganándose el respeto de todas las criaturas. Se convierte en el héroe del bosque, recordado por generaciones.",
        image: "🎉🌟",
        choices: []
      },
      20: {
        id: 20,
        text: "Alex conecta el mundo humano con el bosque mágico, creando un puente de amistad. Su legado une dos mundos para siempre.",
        image: "🌍🤝",
        choices: []
      }
    }
  },
  {
    id: 2,
    title: "El Misterio del Castillo Embrujado",
    theme: "Misterio",
    startPart: 1,
    parts: {
      1: {
        id: 1,
        text: "Emma llega a un antiguo castillo embrujado. Las torres se elevan en la niebla y se oyen susurros en el viento. En la puerta principal hay una inscripción: 'Solo los astutos sobreviven'.",
        image: "🏰👻",
        choices: [
          { text: "Entrar por la puerta principal", nextPart: 2, points: 15, consequence: "Emma demuestra astucia" },
          { text: "Buscar una entrada secreta", nextPart: 3, points: 10, consequence: "Emma es cautelosa" },
          { text: "Esperar a la noche para observar", nextPart: 4, points: 5, consequence: "Emma pierde tiempo" }
        ]
      },
      2: {
        id: 2,
        text: "Dentro del castillo, Emma encuentra un fantasma amistoso que necesita ayuda para resolver un acertijo antiguo y romper una maldición.",
        image: "👻🧩",
        choices: [
          { text: "Resolver el acertijo inmediatamente", nextPart: 5, points: 20, consequence: "La maldición se rompe" },
          { text: "Preguntar sobre la historia del castillo", nextPart: 6, points: 15, consequence: "Emma aprende secretos ocultos" },
          { text: "Buscar pistas en las habitaciones", nextPart: 7, points: 10, consequence: "Emma encuentra artefactos" }
        ]
      },
      3: {
        id: 3,
        text: "Emma descubre una entrada secreta bajo una estatua. Al entrar, encuentra un libro antiguo que parece contener pistas sobre la maldición del castillo.",
        image: "📖🗝️",
        choices: [
          { text: "Leer el libro", nextPart: 8, points: 18, consequence: "Emma descubre la clave de la maldición" },
          { text: "Explorar el túnel", nextPart: 9, points: 12, consequence: "Emma encuentra una sala oculta" },
          { text: "Volver a la entrada principal", nextPart: 2, points: 10, consequence: "Emma toma el camino directo" }
        ]
      },
      4: {
        id: 4,
        text: "Emma espera hasta la noche y ve luces extrañas en las ventanas del castillo. Decide que debe entrar para investigar, pero ahora está más alerta.",
        image: "🌙🏰",
        choices: [
          { text: "Entrar sigilosamente", nextPart: 3, points: 12, consequence: "Emma actúa con precaución" },
          { text: "Llamar a la puerta", nextPart: 2, points: 8, consequence: "Emma enfrenta lo desconocido" },
          { text: "Buscar aliados", nextPart: 10, points: 10, consequence: "Emma forma un equipo" }
        ]
      },
      5: {
        id: 5,
        text: "Emma resuelve el acertijo y libera al fantasma. Como recompensa, recibe un mapa a un tesoro escondido en el castillo.",
        image: "🗺️💎",
        choices: [
          { text: "Buscar el tesoro", nextPart: 13, points: 25, consequence: "Emma encuentra riquezas" },
          { text: "Preguntar más al fantasma", nextPart: 6, points: 15, consequence: "Emma profundiza en la historia" },
          { text: "Explorar otras salas", nextPart: 7, points: 20, consequence: "Emma descubre más misterios" }
        ]
      },
      6: {
        id: 6,
        text: "El fantasma cuenta que la maldición fue lanzada por un hechicero celoso. Para romperla completamente, Emma debe encontrar el cetro del hechicero.",
        image: "🪄👻",
        choices: [
          { text: "Buscar el cetro", nextPart: 13, points: 20, consequence: "Emma enfrenta al hechicero" },
          { text: "Investigar la biblioteca", nextPart: 8, points: 15, consequence: "Emma encuentra más pistas" },
          { text: "Hablar más con el fantasma", nextPart: 11, points: 10, consequence: "Emma fortalece su alianza" }
        ]
      },
      7: {
        id: 7,
        text: "Emma encuentra un cofre antiguo con artefactos mágicos en una sala oculta. Uno de ellos brilla intensamente, sugiriendo un poder especial.",
        image: "📦✨",
        choices: [
          { text: "Usar el artefacto", nextPart: 13, points: 20, consequence: "Emma desata un poder mágico" },
          { text: "Estudiar el cofre", nextPart: 8, points: 15, consequence: "Emma descubre su historia" },
          { text: "Llevar el artefacto al fantasma", nextPart: 6, points: 10, consequence: "Emma comparte su hallazgo" }
        ]
      },
      8: {
        id: 8,
        text: "En la biblioteca, Emma encuentra un diario que detalla cómo romper la maldición. Debe realizar un ritual en la torre más alta del castillo.",
        image: "📚🕯️",
        choices: [
          { text: "Realizar el ritual", nextPart: 13, points: 25, consequence: "Emma rompe la maldición" },
          { text: "Buscar más información", nextPart: 6, points: 15, consequence: "Emma se prepara mejor" },
          { text: "Explorar la torre", nextPart: 9, points: 20, consequence: "Emma encuentra un atajo" }
        ]
      },
      9: {
        id: 9,
        text: "En una sala oculta, Emma descubre un espejo mágico que muestra visiones del pasado del castillo, revelando secretos del hechicero.",
        image: "🪞✨",
        choices: [
          { text: "Seguir las visiones", nextPart: 13, points: 20, consequence: "Emma descubre la verdad" },
          { text: "Romper el espejo", nextPart: 7, points: 15, consequence: "Emma libera energía mágica" },
          { text: "Consultar al fantasma", nextPart: 6, points: 10, consequence: "Emma busca guía" }
        ]
      },
      10: {
        id: 10,
        text: "Emma encuentra a un grupo de exploradores dispuestos a ayudarla. Juntos, planean entrar al castillo como equipo.",
        image: "👥🏰",
        choices: [
          { text: "Liderar al equipo", nextPart: 2, points: 20, consequence: "Emma se convierte en líder" },
          { text: "Explorar con el equipo", nextPart: 3, points: 15, consequence: "Emma comparte la aventura" },
          { text: "Planificar cuidadosamente", nextPart: 4, points: 10, consequence: "Emma se prepara mejor" }
        ]
      },
      11: {
        id: 11,
        text: "El fantasma revela que el cetro está escondido en una sala protegida por trampas. Emma debe ser cuidadosa para llegar a él.",
        image: "🪄🕸️",
        choices: [
          { text: "Enfrentar las trampas", nextPart: 13, points: 20, consequence: "Emma demuestra valentía" },
          { text: "Buscar un camino alternativo", nextPart: 9, points: 15, consequence: "Emma evita el peligro" },
          { text: "Prepararse con el fantasma", nextPart: 6, points: 10, consequence: "Emma planea con cuidado" }
        ]
      },
      12: {
        id: 12,
        text: "Emma encuentra un pergamino antiguo que detalla un ritual para contactar a los espíritus del castillo, lo que podría ayudarla.",
        image: "📜🕯️",
        choices: [
          { text: "Realizar el ritual", nextPart: 13, points: 20, consequence: "Emma contacta a los espíritus" },
          { text: "Buscar al fantasma", nextPart: 6, points: 15, consequence: "Emma busca más guía" },
          { text: "Explorar más", nextPart: 7, points: 10, consequence: "Emma encuentra nuevos secretos" }
        ]
      },
      13: {
        id: 13,
        text: "Emma encuentra el cetro y rompe la maldición. El castillo se ilumina y los fantasmas agradecidos la nombran protectora del castillo.",
        image: "🪄🌟",
        choices: [
          { text: "Aceptar el rol de protectora", nextPart: 18, points: 30, consequence: "¡Final Épico: Emma es heroína!" },
          { text: "Explorar más el castillo", nextPart: 19, points: 25, consequence: "¡Final Heroico: Emma descubre más!" },
          { text: "Compartir el cetro", nextPart: 20, points: 20, consequence: "¡Final Unificador: Emma une a todos!" }
        ]
      },
      14: {
        id: 14,
        text: "Emma descubre un pasadizo secreto que lleva a una cámara con artefactos mágicos, cada uno con un poder único.",
        image: "🗝️📦",
        choices: [
          { text: "Usar un artefacto", nextPart: 13, points: 20, consequence: "Emma desata magia poderosa" },
          { text: "Estudiar los artefactos", nextPart: 8, points: 15, consequence: "Emma aprende su historia" },
          { text: "Consultar al fantasma", nextPart: 6, points: 10, consequence: "Emma busca sabiduría" }
        ]
      },
      15: {
        id: 15,
        text: "Emma encuentra una sala con un altar mágico que podría romper la maldición si realiza el ritual correcto.",
        image: "🕍✨",
        choices: [
          { text: "Realizar el ritual", nextPart: 13, points: 25, consequence: "Emma rompe la maldición" },
          { text: "Buscar más pistas", nextPart: 8, points: 15, consequence: "Emma se prepara mejor" },
          { text: "Consultar al fantasma", nextPart: 6, points: 10, consequence: "Emma busca guía" }
        ]
      },
      16: {
        id: 16,
        text: "Emma medita en una sala silenciosa y siente una conexión con los espíritus del castillo, ganando claridad.",
        image: "🧘‍♀️🏰",
        choices: [
          { text: "Buscar el cetro", nextPart: 13, points: 20, consequence: "Emma actúa con claridad" },
          { text: "Explorar más", nextPart: 9, points: 15, consequence: "Emma sigue su intuición" },
          { text: "Hablar con el fantasma", nextPart: 6, points: 10, consequence: "Emma fortalece su vínculo" }
        ]
      },
      17: {
        id: 17,
        text: "Emma comparte una historia personal con el fantasma, quien le revela un secreto sobre el cetro escondido.",
        image: "📖👻",
        choices: [
          { text: "Buscar el cetro", nextPart: 13, points: 20, consequence: "Emma sigue el secreto" },
          { text: "Preguntar más al fantasma", nextPart: 6, points: 15, consequence: "Emma profundiza la conexión" },
          { text: "Explorar sola", nextPart: 9, points: 10, consequence: "Emma toma su propio camino" }
        ]
      },
      18: {
        id: 18,
        text: "Emma comparte el tesoro con el pueblo y el castillo se convierte en un lugar de paz. ¡Aventura completada!",
        image: "🌟🏆",
        choices: []
      },
      19: {
        id: 19,
        text: "Emma descubre más secretos del castillo y se convierte en su guardiana legendaria, recordada por siempre.",
        image: "🏰🌟",
        choices: []
      },
      20: {
        id: 20,
        text: "Emma une a los habitantes del pueblo con los espíritus del castillo, creando un legado de armonía.",
        image: "🤝🌍",
        choices: []
      }
    }
  },
  {
    id: 3,
    title: "La Expedición al Desierto Perdido",
    theme: "Aventura",
    startPart: 1,
    parts: {
      1: {
        id: 1,
        text: "Sam explora un desierto antiguo donde se rumorea que hay una ciudad perdida. El sol quema y el viento susurra secretos. Encuentra un oasis con una estatua que dice: 'Solo los perseverantes hallarán el camino'.",
        image: "🏜️🗿",
        choices: [
          { text: "Seguir el camino indicado por la estatua", nextPart: 2, points: 15, consequence: "Sam demuestra perseverancia" },
          { text: "Explorar el oasis primero", nextPart: 3, points: 10, consequence: "Sam encuentra recursos" },
          { text: "Descansar y planificar", nextPart: 4, points: 5, consequence: "Sam se prepara mejor" }
        ]
      },
      2: {
        id: 2,
        text: "Sam encuentra una entrada a la ciudad perdida, pero está custodiada por un guardián ancestral que plantea un enigma.",
        image: "🕌🦁",
        choices: [
          { text: "Responder el enigma", nextPart: 5, points: 20, consequence: "El guardián permite el paso" },
          { text: "Buscar otra entrada", nextPart: 6, points: 15, consequence: "Sam evita el peligro" },
          { text: "Estudiar al guardián", nextPart: 7, points: 10, consequence: "Sam gana conocimiento" }
        ]
      },
      3: {
        id: 3,
        text: "En el oasis, Sam descubre un pozo con inscripciones antiguas que parecen indicar un pasaje secreto hacia la ciudad perdida.",
        image: "💧🗿",
        choices: [
          { text: "Explorar el pasaje", nextPart: 8, points: 18, consequence: "Sam encuentra un atajo" },
          { text: "Estudiar las inscripciones", nextPart: 9, points: 12, consequence: "Sam descubre secretos antiguos" },
          { text: "Volver al camino principal", nextPart: 2, points: 10, consequence: "Sam toma la ruta directa" }
        ]
      },
      4: {
        id: 4,
        text: "Sam descansa en el oasis y encuentra un mapa antiguo en una cueva cercana. El mapa señala la ubicación de la ciudad perdida.",
        image: "🗺️🏜️",
        choices: [
          { text: "Seguir el mapa", nextPart: 2, points: 12, consequence: "Sam sigue una ruta clara" },
          { text: "Buscar provisiones", nextPart: 10, points: 10, consequence: "Sam se prepara mejor" },
          { text: "Explorar la cueva", nextPart: 11, points: 15, consequence: "Sam descubre reliquias" }
        ]
      },
      5: {
        id: 5,
        text: "Sam resuelve el enigma y el guardián le otorga una llave dorada que abre la puerta principal de la ciudad perdida.",
        image: "🗝️🕌",
        choices: [
          { text: "Entrar a la ciudad", nextPart: 13, points: 25, consequence: "Sam descubre la ciudad perdida" },
          { text: "Preguntar al guardián", nextPart: 7, points: 15, consequence: "Sam aprende más secretos" },
          { text: "Explorar los alrededores", nextPart: 6, points: 20, consequence: "Sam encuentra otro acceso" }
        ]
      },
      6: {
        id: 6,
        text: "Sam encuentra una entrada secundaria cubierta de arena. Al limpiarla, descubre un mecanismo que requiere una llave especial.",
        image: "🚪🏜️",
        choices: [
          { text: "Buscar la llave", nextPart: 13, points: 20, consequence: "Sam accede a la ciudad" },
          { text: "Forzar la entrada", nextPart: 8, points: 15, consequence: "Sam enfrenta un desafío" },
          { text: "Regresar al guardián", nextPart: 2, points: 10, consequence: "Sam busca la llave dorada" }
        ]
      },
      7: {
        id: 7,
        text: "Sam estudia al guardián y descubre que es una estatua animada por magia antigua. Encuentra un panel con símbolos que podrían desactivarlo.",
        image: "🦁🪄",
        choices: [
          { text: "Activar los símbolos", nextPart: 13, points: 20, consequence: "Sam desactiva al guardián" },
          { text: "Estudiar más los símbolos", nextPart: 9, points: 15, consequence: "Sam aprende magia antigua" },
          { text: "Buscar otra entrada", nextPart: 6, points: 10, consequence: "Sam evita el conflicto" }
        ]
      },
      8: {
        id: 8,
        text: "Sam entra por un pasaje secreto y encuentra una sala llena de artefactos antiguos que cuentan la historia de la ciudad perdida.",
        image: "🛡️📜",
        choices: [
          { text: "Estudiar los artefactos", nextPart: 13, points: 25, consequence: "Sam se convierte en experto" },
          { text: "Buscar la sala principal", nextPart: 5, points: 20, consequence: "Sam llega al corazón de la ciudad" },
          { text: "Explorar más pasajes", nextPart: 6, points: 15, consequence: "Sam descubre más secretos" }
        ]
      },
      9: {
        id: 9,
        text: "Sam descifra las inscripciones y descubre que la ciudad está protegida por un hechizo que requiere un ritual para desactivarlo.",
        image: "📜🪄",
        choices: [
          { text: "Realizar el ritual", nextPart: 13, points: 20, consequence: "Sam desactiva el hechizo" },
          { text: "Buscar más pistas", nextPart: 8, points: 15, consequence: "Sam se prepara mejor" },
          { text: "Consultar al guardián", nextPart: 2, points: 10, consequence: "Sam busca guía" }
        ]
      },
      10: {
        id: 10,
        text: "Sam recolecta provisiones en el oasis y se encuentra con un grupo de exploradores que quieren unirse a su aventura.",
        image: "👥💧",
        choices: [
          { text: "Liderar al equipo", nextPart: 2, points: 20, consequence: "Sam se convierte en líder" },
          { text: "Explorar con el equipo", nextPart: 6, points: 15, consequence: "Sam comparte la aventura" },
          { text: "Seguir solo", nextPart: 4, points: 10, consequence: "Sam confía en sí mismo" }
        ]
      },
      11: {
        id: 11,
        text: "En la cueva, Sam encuentra un altar antiguo con ofrendas que podrían ser clave para entrar a la ciudad perdida.",
        image: "🕍🗿",
        choices: [
          { text: "Usar las ofrendas", nextPart: 13, points: 20, consequence: "Sam desbloquea un pasaje" },
          { text: "Estudiar el altar", nextPart: 9, points: 15, consequence: "Sam descubre su significado" },
          { text: "Explorar más la cueva", nextPart: 6, points: 10, consequence: "Sam encuentra otro camino" }
        ]
      },
      12: {
        id: 12,
        text: "Sam encuentra un diario de un explorador anterior que describe un camino seguro hacia la ciudad perdida.",
        image: "📖🏜️",
        choices: [
          { text: "Seguir el camino del diario", nextPart: 13, points: 20, consequence: "Sam llega a la ciudad" },
          { text: "Buscar al guardián", nextPart: 2, points: 15, consequence: "Sam busca la llave" },
          { text: "Explorar más", nextPart: 6, points: 10, consequence: "Sam descubre nuevos secretos" }
        ]
      },
      13: {
        id: 13,
        text: "Sam entra a la ciudad perdida y descubre artefactos que revelan una civilización antigua. Es nombrado explorador legendario.",
        image: "🌍🔍",
        choices: [
          { text: "Compartir los descubrimientos", nextPart: 18, points: 30, consequence: "¡Final Épico: Sam es leyenda!" },
          { text: "Estudiar más artefactos", nextPart: 19, points: 25, consequence: "¡Final Heroico: Sam es experto!" },
          { text: "Proteger la ciudad", nextPart: 20, points: 20, consequence: "¡Final Unificador: Sam es guardián!" }
        ]
      },
      14: {
        id: 14,
        text: "Sam encuentra un templo oculto con jeroglíficos que narran la historia de la ciudad perdida.",
        image: "🕌📜",
        choices: [
          { text: "Estudiar los jeroglíficos", nextPart: 13, points: 20, consequence: "Sam descubre la historia" },
          { text: "Buscar tesoros", nextPart: 8, points: 15, consequence: "Sam encuentra riquezas" },
          { text: "Consultar al guardián", nextPart: 2, points: 10, consequence: "Sam busca guía" }
        ]
      },
      15: {
        id: 15,
        text: "Sam realiza un ritual que desactiva las trampas de la ciudad, ganándose el respeto de los espíritus antiguos.",
        image: "🪄🗿",
        choices: [
          { text: "Entrar a la ciudad", nextPart: 13, points: 25, consequence: "Sam llega al corazón de la ciudad" },
          { text: "Explorar más", nextPart: 8, points: 15, consequence: "Sam descubre más secretos" },
          { text: "Honrar a los espíritus", nextPart: 20, points: 20, consequence: "Sam se convierte en guardián" }
        ]
      },
      16: {
        id: 16,
        text: "Sam medita en el oasis y siente una conexión con los espíritus del desierto, ganando claridad para su misión.",
        image: "🧘‍♂️🏜️",
        choices: [
          { text: "Seguir al guardián", nextPart: 2, points: 20, consequence: "Sam actúa con claridad" },
          { text: "Explorar el oasis", nextPart: 3, points: 15, consequence: "Sam encuentra recursos" },
          { text: "Buscar artefactos", nextPart: 8, points: 10, consequence: "Sam descubre reliquias" }
        ]
      },
      17: {
        id: 17,
        text: "Sam encuentra un amuleto antiguo que parece estar conectado con la ciudad perdida, guiándolo hacia su destino.",
        image: "🧿🏜️",
        choices: [
          { text: "Seguir el amuleto", nextPart: 13, points: 20, consequence: "Sam llega a la ciudad" },
          { text: "Estudiar el amuleto", nextPart: 9, points: 15, consequence: "Sam descubre su poder" },
          { text: "Buscar al guardián", nextPart: 2, points: 10, consequence: "Sam busca guía" }
        ]
      },
      18: {
        id: 18,
        text: "Sam comparte sus descubrimientos con el mundo, inspirando a otros exploradores. ¡Aventura completada!",
        image: "🏆🌟",
        choices: []
      },
      19: {
        id: 19,
        text: "Sam se convierte en un experto en la civilización perdida, publicando libros que fascinan al mundo.",
        image: "📚🌍",
        choices: []
      },
      20: {
        id: 20,
        text: "Sam protege la ciudad perdida, asegurando que sus secretos permanezcan seguros para las generaciones futuras.",
        image: "🛡️🏜️",
        choices: []
      }
    }
  }
];

export function HistoriasInteractivas({ onBack, onNextLevel, level: initialLevel }: HistoriasInteractivasProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);
  const [currentPart, setCurrentPart] = useState(1);
  const [score, setScore] = useState(0);
  const [storyPath, setStoryPath] = useState<number[]>([1]);
  const [readingComplete, setReadingComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [consequences, setConsequences] = useState<string[]>([]);
  const [showMotivational, setShowMotivational] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const story = stories[currentLevel - 1];
  const part = story.parts[currentPart];
  const progress = (storyPath.length / 8) * 100;

  // Función para mejorar la pronunciación de números con signos
  const formatPointsForSpeech = (points: number): string => {
    return points >= 0 ? `más ${Math.abs(points)} puntos` : `menos ${Math.abs(points)} puntos`;
  };

  // Función para limpiar emojis del texto antes de hablar
  const removeEmojis = (text: string): string => {
    return text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
  };

  useEffect(() => {
    setCurrentLevel(initialLevel);
  }, [initialLevel]);

  useEffect(() => {
    setCurrentPart(story.startPart);
    setStoryPath([story.startPart]);
    setConsequences([]);
    setScore(0);
    setReadingComplete(false);
    setShowReward(false);
    setShowMotivational(false);
    setShowLevelComplete(false);
  }, [currentLevel, story.startPart]);

  const makeChoice = (choiceIndex: number) => {
    const choice = part.choices[choiceIndex];
    const newScore = score + choice.points;
    setScore(newScore);
    
    setConsequences([...consequences, choice.consequence]);
    
    if (choice.points >= 15) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);
    }
    
    if (choice.nextPart) {
        if (story.parts[choice.nextPart]) {
          if (story.parts[choice.nextPart].choices.length === 0) {
            setCurrentPart(choice.nextPart);
            setStoryPath([...storyPath, choice.nextPart]);
            setTimeout(() => {
              setReadingComplete(true);
              setShowMotivational(true);
            }, 3000);
          } else {
            setCurrentPart(choice.nextPart);
            setStoryPath([...storyPath, choice.nextPart]);
          }
        } else {
          setTimeout(() => {
            setReadingComplete(true);
            setShowMotivational(true);
          }, 3000);
        }
    }
  };


  if (!gameStarted) {
    return <StartScreenHistoriasInteractivas onStart={() => setGameStarted(true)} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="max-w-7xl mx-auto">
        <GameHeader
          title="Historias Interactivas"
          level={currentLevel}
          score={score}
          onBack={onBack}
          onRestart={() => {
            setCurrentPart(story.startPart);
            setStoryPath([story.startPart]);
            setScore(0);
            setConsequences([]);
            setReadingComplete(false);
            setShowMotivational(false);
            setShowLevelComplete(false);
          }}
        />

        <ProgressBar
          current={storyPath.length}
          total={8}
          progress={progress}
          className="mb-6"
        />

        <div className="text-center mb-6">
          <h2 className="text-2xl text-black">{story.title}</h2>
        </div>

        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6">
          <AnimalGuide
            animal="turtle"
            message="¡Tú decides cómo continúa la historia! Lee con cuidado y elige la opción que más te guste. Cada decisión llevará la historia por un camino diferente."
          />
        </motion.div>

        <motion.div key={currentPart} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="max-w-3xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-indigo-200 mb-6">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-indigo-200 to-purple-200 rounded-2xl p-8 mb-4 min-h-[200px] flex items-center justify-center border-4 border-indigo-300">
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-8xl">
                      {part.image}
                    </motion.div>
                  </div>
                  <AudioPlayer 
                    text={removeEmojis(part.text)} 
                    duration={removeEmojis(part.text).length * 50}
                    voice="child"
                  />
                </div>

                <div className="text-center md:text-left">
                  <div className="text-lg leading-relaxed text-black mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border-2 border-indigo-200">
                    {part.text}
                  </div>

                  {storyPath.length > 1 && (
                    <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                      <h4 className="text-sm text-purple-800 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Tu aventura hasta ahora:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {storyPath.map(( index) => (
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

          {part.choices.length > 0 && (
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 max-w-7xl">
              <CardContent className="p-6 ">
                <h3 className="text-lg mb-4 text-black flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  ¿Qué decides hacer?
                </h3>
                <div className="space-y-3">
                  {part.choices.map((choice, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <ButtonWithAudio
                        onClick={() => makeChoice(index)}
                        variant="outline"
                        className="w-full justify-start text-left p-6 h-auto bg-white/80 hover:bg-white border-2 hover:border-purple-300 transition-all text-black"
                        playOnHover
                        audioText={`${removeEmojis(choice.text)}. ${formatPointsForSpeech(choice.points)}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <div className="flex-1">
                            <div className="text-lg">{choice.text}</div>
                            <div className="text-sm text-purple-600 mt-1">+{choice.points} puntos</div>
                          </div>
                        </div>
                      </ButtonWithAudio>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        <RewardAnimation type="star" show={showReward} message="¡Excelente elección!" />

        {/* MENSAJE MOTIVACIONAL */}
        {showMotivational && (
          <MotivationalMessage
            score={score}
            total={1000}
            customMessage="¡Eres un narrador increíble!"
            customSubtitle="¡Completaste tu aventura interactiva!"
            onComplete={() => {
              setShowMotivational(false);
              setShowLevelComplete(true);
            }}
          />
        )}

        {/* MODAL FINAL */}
        {showLevelComplete && (
          <LevelCompleteModal
            score={score}
            total={1000}
            level={currentLevel}
            isLastLevel={currentLevel >= 3}
            onNextLevel={() => {
              if (currentLevel < 3) {
                setCurrentLevel(currentLevel + 1);
                setShowLevelComplete(false);
                setShowMotivational(false);
              } else {
                onNextLevel();
              }
            }}
            onRestart={() => {
              setCurrentPart(story.startPart);
              setStoryPath([story.startPart]);
              setScore(0);
              setConsequences([]);
              setReadingComplete(false);
              setShowMotivational(false);
              setShowLevelComplete(false);
            }}
            onExit={onBack}
          />
        )}
      </div>
    </div>
  );
}