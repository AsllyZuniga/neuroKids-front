import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, TrendingUp, Settings, LogOut, Book, Gamepad2, Lock } from "lucide-react";
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
  locked: boolean;
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
    // Obtener datos del estudiante desde localStorage
    const userData = localStorage.getItem("user");
    const userType = localStorage.getItem("userType");
    
    if (!userData || userType !== "estudiante") {
      // Si no hay datos de estudiante, redirigir al login
      navigate("/tipo-usuario");
      return;
    }

    try {
      const studentData = JSON.parse(userData);
      setStudent(studentData);
      
      // Establecer grupo de edad basado en la edad del estudiante
      if (studentData.edad) {
        if (studentData.edad >= 7 && studentData.edad <= 8) {
          setSelectedAgeGroup('7-8');
        } else if (studentData.edad >= 9 && studentData.edad <= 10) {
          setSelectedAgeGroup('9-10');
        } else if (studentData.edad >= 11 && studentData.edad <= 12) {
          setSelectedAgeGroup('11-12');
        }
      }

      // Cargar actividades completadas
      loadCompletedActivities();
    } catch (error) {
      console.error("Error parsing student data:", error);
      navigate("/tipo-usuario");
    }
  }, [navigate]);

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
      { id: 'primera-palabra', type: 'lectura', title: 'Mi Primera Palabra', icon: '📖', locked: false, completed: false, component: 'PrimeraPalabra', ageGroup: '7-8', position: { x: 30, y: 10 } },
      { id: 'bingo-palabras', type: 'juego', title: 'Bingo de Palabras', icon: '🎮', locked: false, completed: false, component: 'BingoPalabras', ageGroup: '7-8', position: { x: 50, y: 25 } },
      { id: 'cuento-pictogramas', type: 'lectura', title: 'Cuento con Pictogramas', icon: '📚', locked: false, completed: false, component: 'CuentoPictogramas', ageGroup: '7-8', position: { x: 35, y: 40 } },
      { id: 'caza-silaba', type: 'juego', title: 'Caza la Sílaba', icon: '🎯', locked: false, completed: false, component: 'CazaSilaba', ageGroup: '7-8', position: { x: 60, y: 55 } },
      { id: 'frases-magicas', type: 'lectura', title: 'Frases Mágicas', icon: '✨', locked: false, completed: false, component: 'FrasesMagicas', ageGroup: '7-8', position: { x: 40, y: 70 } },
      { id: 'escucha-elige', type: 'juego', title: 'Escucha y Elige', icon: '🎧', locked: false, completed: false, component: 'EscuchaElige', ageGroup: '7-8', position: { x: 55, y: 85 } },
    ],
    '9-10': [
      { id: 'mini-aventuras', type: 'lectura', title: 'Mini Aventuras', icon: '🗺️', locked: false, completed: false, component: 'MiniAventuras', ageGroup: '9-10', position: { x: 25, y: 10 } },
      { id: 'laberinto-lector', type: 'juego', title: 'Laberinto Lector', icon: '🌀', locked: false, completed: false, component: 'LaberintoLector', ageGroup: '9-10', position: { x: 55, y: 25 } },
      { id: 'historias-interactivas', type: 'lectura', title: 'Historias Interactivas', icon: '🎭', locked: false, completed: false, component: 'HistoriasInteractivas', ageGroup: '9-10', position: { x: 30, y: 40 } },
      { id: 'ordena-historia', type: 'juego', title: 'Ordena la Historia', icon: '🧩', locked: false, completed: false, component: 'OrdenaHistoria', ageGroup: '9-10', position: { x: 65, y: 55 } },
      { id: 'revista-infantil', type: 'lectura', title: 'Revista Infantil', icon: '📰', locked: false, completed: false, component: 'RevistaInfantil', ageGroup: '9-10', position: { x: 35, y: 70 } },
      { id: 'construye-frase', type: 'juego', title: 'Construye la Frase', icon: '🔨', locked: false, completed: false, component: 'ConstruyeFrase', ageGroup: '9-10', position: { x: 50, y: 85 } },
    ],
    '11-12': [
      { id: 'biografias-sencillas', type: 'lectura', title: 'Biografías Sencillas', icon: '👤', locked: false, completed: false, component: 'BiografiasSencillas', ageGroup: '11-12', position: { x: 30, y: 10 } },
      { id: 'cohete-lector', type: 'juego', title: 'Cohete Lector', icon: '🚀', locked: false, completed: false, component: 'CoheteLector', ageGroup: '11-12', position: { x: 60, y: 25 } },
      { id: 'cuento-interactivo', type: 'lectura', title: 'Cuento Interactivo', icon: '📕', locked: false, completed: false, component: 'CuentoInteractivo', ageGroup: '11-12', position: { x: 35, y: 40 } },
      { id: 'detective-palabras', type: 'juego', title: 'Detective de Palabras', icon: '🔍', locked: false, completed: false, component: 'DetectivePalabras', ageGroup: '11-12', position: { x: 55, y: 55 } },
      { id: 'noticias-sencillas', type: 'lectura', title: 'Noticias Sencillas', icon: '📰', locked: false, completed: false, component: 'NoticiasSencillas', ageGroup: '11-12', position: { x: 40, y: 70 } },
      { id: 'preguntas-inferenciales', type: 'juego', title: 'Preguntas Inferenciales', icon: '💡', locked: false, completed: false, component: 'PreguntasInferenciales', ageGroup: '11-12', position: { x: 50, y: 85 } },
    ]
  };

  const handleActivityClick = (activity: Activity) => {
    if (!activity.locked) {
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

  const currentActivities = activities[selectedAgeGroup].map(activity => ({
    ...activity,
    completed: completedActivities.has(`${activity.id}-1`) || 
               completedActivities.has(`${activity.id}-2`) || 
               completedActivities.has(`${activity.id}-3`)
  }));

  return (
    <div className="student-welcome">
      <Header />
      
      <div className="student-welcome__layout">
        {/* Menú Lateral Izquierdo */}
        <aside className="student-welcome__sidebar">
          <div className="student-welcome__sidebar-header">
            <div className="student-welcome__avatar">
              <img src="/src/assets/img/cohete.svg" alt="Avatar" />
            </div>
            <h3 className="student-welcome__sidebar-title">{student.nombre}</h3>
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
            <button className="student-welcome__sidebar-item">
              <Settings size={20} />
              <span>Configuración</span>
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
            <button 
              className={`student-welcome__age-btn ${selectedAgeGroup === '7-8' ? 'active' : ''}`}
              onClick={() => setSelectedAgeGroup('7-8')}
            >
              7-8 años
            </button>
            <button 
              className={`student-welcome__age-btn ${selectedAgeGroup === '9-10' ? 'active' : ''}`}
              onClick={() => setSelectedAgeGroup('9-10')}
            >
              9-10 años
            </button>
            <button 
              className={`student-welcome__age-btn ${selectedAgeGroup === '11-12' ? 'active' : ''}`}
              onClick={() => setSelectedAgeGroup('11-12')}
            >
              11-12 años
            </button>
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
                      stroke="#cbd5e1"
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
                className={`student-welcome__activity ${activity.type} ${activity.locked ? 'locked' : ''} ${activity.completed ? 'completed' : ''}`}
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
                  {activity.locked ? <Lock size={24} /> : <span className="emoji">{activity.icon}</span>}
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
