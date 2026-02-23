import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, TrendingUp, LogOut, Book, Gamepad2, Lock } from "lucide-react";
import Header from "../../components/header/header";
import { progressService } from "../../services/progressService";
import "./studentWelcome.scss";

interface Student {
  id: number;
  nombre: string;
  apellido: string;
  codigo_estudiante: string;
  edad?: number;
  institucion: string;
}

interface Activity {
  id: string;
  type: 'lectura' | 'juego';
  title: string;
  icon: string;
  completed: boolean;
  component: string;
  ageGroup: '7-8' | '9-10' | '11-12';
  position: { x: number; y: number };
}

export default function StudentWelcome() {
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'7-8' | '9-10' | '11-12'>('7-8');
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false); // Cambiado a false
  const navigate = useNavigate();

useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("user") || "null");

  if (!userData) {
    navigate("/tipo-usuario");
    return;
  }

  setStudent(userData);

  // También cargar progreso aquí
  const progressKey = `neurokids-progress-${userData.id}`;
  const progressData = JSON.parse(localStorage.getItem(progressKey) || "{}");

  const completedIds = (progressData.activities || [])
    .filter((act: any) => act.completed)
    .map((act: any) => act.activityId);

  setCompletedActivities(new Set(completedIds));
}, [navigate]);

useEffect(() => {
    const handleFocus = () => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  if (!userData.id) return;

  const progressKey = `neurokids-progress-${userData.id}`;
  const progressData = JSON.parse(localStorage.getItem(progressKey) || "{}");

  const completedIds = (progressData.activities || [])
    .filter((act: any) => act.completed)
    .map((act: any) => act.activityId);

  setCompletedActivities(new Set(completedIds));
};  

window.addEventListener("focus", handleFocus);
  return () => window.removeEventListener("focus", handleFocus);
}, []);


  const loadCompletedActivities = async () => {
    try {
      setLoading(true);
      const progress = await progressService.getStudentProgress();
      if (progress && progress.activities) {
        const completed = new Set(
          progress.activities
            .filter(a => a.completed)
            .map(a => `${a.activityId}-${a.level}`)
        );
        setCompletedActivities(completed);
      }
    } catch (error) {
      console.error("Error loading completed activities:", error);
      // No bloquear si hay error, simplemente no mostrar completados
    } finally {
      setLoading(false);
    }
  };

  // Definir actividades por grupo de edad
  const activities: Record<'7-8' | '9-10' | '11-12', Activity[]> = {
    '7-8': [
      { id: 'primera-palabra', type: 'lectura', title: 'Mi Primera Palabra', icon: '📖', completed: false, component: 'PrimeraPalabra', ageGroup: '7-8', position: { x: 30, y: 10 } },
      { id: 'bingo-palabras', type: 'juego', title: 'Bingo de Palabras', icon: '🎮', completed: false, component: 'BingoPalabras', ageGroup: '7-8', position: { x: 50, y: 25 } },
      { id: 'cuento-pictogramas', type: 'lectura', title: 'Cuento con Pictogramas', icon: '📚', completed: false, component: 'CuentoPictogramas', ageGroup: '7-8', position: { x: 35, y: 40 } },
      { id: 'caza-silaba', type: 'juego', title: 'Caza la Sílaba', icon: '🎯', completed: false, component: 'CazaSilaba', ageGroup: '7-8', position: { x: 60, y: 55 } },
      { id: 'frases-magicas', type: 'lectura', title: 'Frases Mágicas', icon: '✨', completed: false, component: 'FrasesMagicas', ageGroup: '7-8', position: { x: 40, y: 70 } },
      { id: 'escucha-elige', type: 'juego', title: 'Escucha y Elige', icon: '🎧', completed: false, component: 'EscuchaElige', ageGroup: '7-8', position: { x: 55, y: 85 } },
    ],
    '9-10': [
      { id: 'mini-aventuras', type: 'lectura', title: 'Mini Aventuras', icon: '🗺️', completed: false, component: 'MiniAventuras', ageGroup: '9-10', position: { x: 25, y: 10 } },
      { id: 'laberinto-lector', type: 'juego', title: 'Laberinto Lector', icon: '🌀', completed: false, component: 'LaberintoLector', ageGroup: '9-10', position: { x: 55, y: 25 } },
      { id: 'historias-interactivas', type: 'lectura', title: 'Historias Interactivas', icon: '🎭', completed: false, component: 'HistoriasInteractivas', ageGroup: '9-10', position: { x: 30, y: 40 } },
      { id: 'ordena-historia', type: 'juego', title: 'Ordena la Historia', icon: '🧩', completed: false, component: 'OrdenaHistoria', ageGroup: '9-10', position: { x: 65, y: 55 } },
      { id: 'revista-infantil', type: 'lectura', title: 'Revista Infantil', icon: '📰', completed: false, component: 'RevistaInfantil', ageGroup: '9-10', position: { x: 35, y: 70 } },
      { id: 'construye-frase', type: 'juego', title: 'Construye la Frase', icon: '🔨', completed: false, component: 'ConstruyeFrase', ageGroup: '9-10', position: { x: 50, y: 85 } },
    ],
    '11-12': [
      { id: 'biografias-sencillas', type: 'lectura', title: 'Biografías Sencillas', icon: '👤', completed: false, component: 'BiografiasSencillas', ageGroup: '11-12', position: { x: 30, y: 10 } },
      { id: 'cohete-lector', type: 'juego', title: 'Cohete Lector', icon: '🚀', completed: false, component: 'CoheteLector', ageGroup: '11-12', position: { x: 60, y: 25 } },
      { id: 'cuento-interactivo', type: 'lectura', title: 'Cuento Interactivo', icon: '📕', completed: false, component: 'CuentoInteractivo', ageGroup: '11-12', position: { x: 35, y: 40 } },
      { id: 'detective-palabras', type: 'juego', title: 'Detective de Palabras', icon: '🔍', completed: false, component: 'DetectivePalabras', ageGroup: '11-12', position: { x: 55, y: 55 } },
      { id: 'noticias-sencillas', type: 'lectura', title: 'Noticias Sencillas', icon: '📰', completed: false, component: 'NoticiasSencillas', ageGroup: '11-12', position: { x: 40, y: 70 } },
      { id: 'preguntas-inferenciales', type: 'juego', title: 'Preguntas Inferenciales', icon: '💡', completed: false, component: 'PreguntasInferenciales', ageGroup: '11-12', position: { x: 50, y: 85 } },
    ]
  };

  const handleActivityClick = (activity: Activity) => {

      // Mapeo de actividades a rutas existentes
      const routeMap: Record<string, string> = {
        // Edad 7-8
        'primera-palabra': '/nivel1/lectura3',
        'bingo-palabras': '/nivel1/juego1',
        'cuento-pictogramas': '/nivel1/lectura1',
        'caza-silaba': '/nivel1/juego2',
        'frases-magicas': '/nivel1/lectura2',
        'escucha-elige': '/nivel1/juego3',
        // Edad 9-10
        'mini-aventuras': '/nivel2/lectura2',
        'laberinto-lector': '/nivel2/juego2',
        'historias-interactivas': '/nivel2/lectura1',
        'ordena-historia': '/nivel2/juego3',
        'revista-infantil': '/nivel2/lectura3',
        'construye-frase': '/nivel2/juego1',
        // Edad 11-12
        'biografias-sencillas': '/nivel3/lectura1',
        'cohete-lector': '/nivel3/juego1',
        'cuento-interactivo': '/nivel3/lectura2',
        'detective-palabras': '/nivel3/juego2',
        'noticias-sencillas': '/nivel3/lectura3',
        'preguntas-inferenciales': '/nivel3/juego3',
      };

      const route = routeMap[activity.id];
      if (route) {
        navigate(route);
      } else {
        console.error(`No route found for activity: ${activity.id}`);
      }
    
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    navigate("/tipo-usuario");
  };

  if (!student || loading) {
    return <div className="loading">Cargando...</div>;
  }
const currentActivities = activities[selectedAgeGroup].map((activity) => ({
  ...activity,
  completed: completedActivities.has(activity.id),
}));



  const allowedAgeGroups: ('7-8' | '9-10' | '11-12')[] = student?.edad
    ? student.edad >= 7 && student.edad <= 8
      ? ['7-8']
      : student.edad >= 9 && student.edad <= 10
        ? ['9-10']
        : student.edad >= 11 && student.edad <= 12
          ? ['11-12']
          : []
    : [];





  return (
    <div className="student-welcome">
      <Header />

      <div className="student-welcome__layout">
        {/* Menú Lateral Izquierdo */}
        <aside className="student-welcome__sidebar">
          <div className="student-welcome__sidebar-header">
            <div className="student-welcome__avatar">
              <img src="/avatars/estudiante1.svg"alt="Avatar" />
            </div>
            <h3 className="student-welcome__sidebar-title">{student.nombre}  {student.apellido}</h3>
            <p className="student-welcome__sidebar-subtitle">{student.institucion}</p>
          </div>

          <nav className="student-welcome__sidebar-nav">
            <button className="student-welcome__sidebar-item active">
              <Home size={20} />
              <span>Inicio</span>
            </button>
            <button className="student-welcome__sidebar-item">
              <TrendingUp size={20} />
              <span>Mi Progreso</span>
            </button>
          </nav>

          <div className="student-welcome__sidebar-footer">
            <button className="student-welcome__sidebar-item logout" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* Contenido Principal - Mapa Interactivo */}
        <main className="student-welcome__main">
          <div className="student-welcome__age-selector">
            {allowedAgeGroups.map((group) => (
              <button
                key={group}
                className={`student-welcome__age-btn ${selectedAgeGroup === group ? 'active' : ''}`}
                onClick={() => setSelectedAgeGroup(group)}
              >
                {group} años
              </button>
            ))}
          </div>


          <div className="student-welcome__map-container">
            <svg className="student-welcome__map-path" width="100%" height="100%">
              {currentActivities.map((activity, index) => {
                if (index < currentActivities.length - 1) {
                  const nextActivity = currentActivities[index + 1];
                  return (
                    <motion.path
                      key={`path-${activity.id}`}
                      d={`M ${activity.position.x}% ${activity.position.y + 5}% Q ${(activity.position.x + nextActivity.position.x) / 2}% ${(activity.position.y + nextActivity.position.y) / 2}% ${nextActivity.position.x}% ${nextActivity.position.y + 5}%`}
                      stroke={
  activity.completed
    ? "#22c55e"
    : "#cbd5e1"
}
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="8,4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  );
                }
                return null;
              })}
            </svg>

            {currentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                className={`student-welcome__activity 
  ${activity.type} 
  ${!activity.completed ? 'inactive' : ''}`
}
                style={{
                  left: `${activity.position.x}%`,
                  top: `${activity.position.y}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleActivityClick(activity)}
              >
                <div className="student-welcome__activity-icon">
                  <span className="emoji">{activity.icon}</span>
                </div>
                <div className="student-welcome__activity-type">
                  {activity.type === 'lectura' ? <Book size={14} /> : <Gamepad2 size={14} />}
                </div>
                {activity.completed && (
                  <div className="student-welcome__activity-completed">✓</div>
                )}
                <div className="student-welcome__activity-tooltip">
                  {activity.title}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="student-welcome__motivational">
            <p className="student-welcome__quote-text">
              "¡Cada paso en tu aventura de lectura te hace más fuerte! 🌟"
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
