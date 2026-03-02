import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, TrendingUp, LogOut, Book, Gamepad2 } from "lucide-react";
import Header from "@/components/header/header";
import { insigniaService, type NotificacionInsignia } from "@/services/insigniaService";
import { useProgress } from "@/hooks/useProgress";
import { getActivitiesByAgeGroup, type ActivityConfig } from "@/config/activities";
import "./studentWelcome.scss";

interface Student {
  id: number;
  nombre: string;
  apellido: string;
  codigo_estudiante: string;
  edad?: number;
  institucion: string;
}

// Usar ActivityConfig de la configuración centralizada
type Activity = ActivityConfig & {
  completed: boolean;
  position: { x: number; y: number };
};

export default function StudentWelcome() {
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'7-8' | '9-10' | '11-12'>('7-8');
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [showInsigniaModal, setShowInsigniaModal] = useState(false);
  const [insigniaToShow, setInsigniaToShow] = useState<NotificacionInsignia | null>(null);
  const [confetti, setConfetti] = useState(false);
  const navigate = useNavigate();
  const { saveProgress } = useProgress();

useEffect(() => {
  const userData = JSON.parse(localStorage.getItem("user") || "null");
  console.log('👤 Datos de usuario cargados:', userData);

  if (!userData) {
    console.log('❌ No hay datos de usuario, redirigiendo...');
    navigate("/tipo-usuario");
    return;
  }

  setStudent(userData);

  // También cargar progreso aquí
  const progressKey = `neurokids-progress-${userData.id}`;
  const progressData = JSON.parse(localStorage.getItem(progressKey) || "{}");

  const completedIds = (progressData.activities || [])
    .filter((act: { completed: boolean }) => act.completed)
    .map((act: { activityId: string }) => act.activityId);

  setCompletedActivities(new Set(completedIds));
  
  // Verificar insignias al cargar - ejecutar inmediatamente
  checkForNewInsignias(userData.id);
}, [navigate]);

  // Componente de imagen con fallbacks mejorado
  const InsigniaImage = () => {
    const [imageError, setImageError] = useState(false);
    
    // SVG embebido como fallback
    const fallbackSVG = (
      <svg 
        width="100" 
        height="100" 
        viewBox="0 0 100 100" 
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #FFD700, #FFA500)',
          border: '5px solid #FFD700'
        }}
      >
        <circle cx="50" cy="50" r="40" fill="#FFD700" stroke="#FFA500" strokeWidth="3"/>
        <circle cx="50" cy="50" r="30" fill="#FFED4A" opacity="0.8"/>
        <text x="50" y="60" fontFamily="Arial" fontSize="35" textAnchor="middle" fill="#FFF">🏆</text>
      </svg>
    );

    if (imageError) {
      return fallbackSVG;
    }

    return (
      <>
        <motion.img 
          src="https://api.neurokids.click/imagenes/primer_paso.svg"
          alt="Primer Registro"
          className="insignia-icon"
          crossOrigin="anonymous"
          style={{ 
            borderColor: insigniaToShow?.insignia?.color_hex || '#FFD700',
            width: '100px',
            height: '100px',
            border: '5px solid #FFD700',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(240, 249, 255, 0.8) 100%)',
            padding: '10px'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            transition: {
              delay: 0.5,
              duration: 0.8
            }
          }}
          onLoad={() => {
            console.log('✅ Imagen SVG cargada correctamente');
            setImageError(false);
          }}
          onError={() => {
            console.error('❌ Error cargando SVG, usando fallback');
            setImageError(true);
          }}
        />
        {imageError && fallbackSVG}
      </>
    );
  };

  const checkForNewInsignias = async (estudianteId: number) => {
    try {
      console.log('🔍 Verificando insignias para estudiante:', estudianteId);
      const notificaciones = await insigniaService.getNotificacionesPendientes(estudianteId.toString());
      console.log('📩 Notificaciones recibidas:', notificaciones);
      
      // Buscar específicamente la insignia de bienvenida (ID 14)
      const insigniaBienvenida = notificaciones.find(
        notif => notif.tipo_notificacion === 'insignia' && 
                 notif.insignia_relacionada_id === '14'
      );

      console.log('🎖️ Insignia de bienvenida encontrada:', insigniaBienvenida);

      if (insigniaBienvenida && insigniaBienvenida.insignia) {
        console.log('✅ Mostrando modal de insignia:', insigniaBienvenida.insignia);
        setInsigniaToShow(insigniaBienvenida);
        setShowInsigniaModal(true);
        setConfetti(true);
        
        // Detener confeti después de 3 segundos
        setTimeout(() => setConfetti(false), 3000);
      } else {
        console.log('❌ No hay insignia de bienvenida pendiente');
        
        // SIMULACIÓN TEMPORAL: Si no hay insignias del backend, mostrar una de prueba
        // Esto es solo para testing - remover en producción
        const isFirstTimeUser = localStorage.getItem(`first_visit_${estudianteId}`) === null;
        if (isFirstTimeUser) {
          console.log('🧪 Simulando insignia de primer registro para testing...');
          localStorage.setItem(`first_visit_${estudianteId}`, 'true');
          
          const mockInsignia = {
            id: '1',
            estudiante_id: estudianteId.toString(),
            tipo_notificacion: 'insignia',
            titulo: 'Primer Registro',
            mensaje: 'Completaste tu registro',
            insignia_relacionada_id: '14',
            leida: false,
            created_at: new Date().toISOString(),
            insignia: {
              id: '14',
              nombre: 'Primer Registro',
              descripcion: 'Completaste tu registro exitosamente',
              icono: 'https://api.neurokids.click/imagenes/primer_paso.svg',
              color_hex: '#FFD700',
              categoria: 'logro',
              rareza: 'comun',
              puntos_otorgados: 10,
              estado: true
            }
          };
          
          setTimeout(() => {
            setInsigniaToShow(mockInsignia);
            setShowInsigniaModal(true);
            setConfetti(true);
            setTimeout(() => setConfetti(false), 3000);
          }, 2000); // Delay de 2 segundos para simular carga
        }
      }
    } catch (error) {
      console.error('🚨 Error al verificar insignias:', error);
    }
  };

  const handleCloseModal = async () => {
    if (insigniaToShow && student) {
      try {
        await insigniaService.marcarBienvenidaLeida(student.id.toString());
      } catch (error) {
        console.error('Error al marcar insignia como leída:', error);
      }
    }
    
    setShowInsigniaModal(false);
    setInsigniaToShow(null);
    setConfetti(false);
  };

useEffect(() => {
    const handleFocus = () => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  if (!userData.id) return;

  const progressKey = `neurokids-progress-${userData.id}`;
  const progressData = JSON.parse(localStorage.getItem(progressKey) || "{}");

  const completedIds = (progressData.activities || [])
    .filter((act: { completed: boolean }) => act.completed)
    .map((act: { activityId: string }) => act.activityId);

  setCompletedActivities(new Set(completedIds));
};  

window.addEventListener("focus", handleFocus);
  return () => window.removeEventListener("focus", handleFocus);
}, []);

  // Obtener actividades por grupo de edad desde la configuración
  const getActivitiesForAgeGroup = (ageGroup: '7-8' | '9-10' | '11-12'): Activity[] => {
    const baseActivities = getActivitiesByAgeGroup(ageGroup);
    
    // Posiciones predefinidas para la visualización en mapa
    const positions: Record<string, { x: number; y: number }> = {
      // Edad 7-8
      'primera-palabra': { x: 30, y: 10 },
      'bingo-palabras': { x: 50, y: 25 },
      'cuento-pictogramas': { x: 35, y: 40 },
      'caza-silaba': { x: 60, y: 55 },
      'frases-magicas': { x: 40, y: 70 },
      'escucha-elige': { x: 55, y: 85 },
      // Edad 9-10
      'mini-aventuras': { x: 25, y: 10 },
      'laberinto-lector': { x: 55, y: 25 },
      'historias-interactivas': { x: 30, y: 40 },
      'ordena-historia': { x: 65, y: 55 },
      'revista-infantil': { x: 35, y: 70 },
      'construye-frase': { x: 50, y: 85 },
      // Edad 11-12
      'biografias-sencillas': { x: 30, y: 10 },
      'cohete-lector': { x: 60, y: 25 },
      'cuento-interactivo': { x: 35, y: 40 },
      'detective-palabras': { x: 55, y: 55 },
      'noticias-sencillas': { x: 40, y: 70 },
      'preguntas-inferenciales': { x: 50, y: 85 },
    };

    return baseActivities.map(activity => ({
      ...activity,
      completed: completedActivities.has(activity.id),
      position: positions[activity.id] || { x: 50, y: 50 } // Posición por defecto
    }));
  };

  const handleActivityClick = async (activity: Activity) => {
    try {
      // Guardar actividad iniciada usando el formato correcto del hook
      if (student?.id) {
        await saveProgress({
          activityId: activity.dbId,
          activityName: activity.title,
          activityType: activity.type,
          ageGroup: activity.ageGroup,
          level: activity.level,
          score: 0, // Score inicial
          maxScore: activity.maxScore,
          completed: false, // Solo iniciando la actividad
          timeSpent: 0
        });
        
        console.log(`Iniciando actividad: ${activity.title} (DB ID: ${activity.dbId})`);
      }
    } catch (error) {
      console.error('Error al iniciar actividad:', error);
    }
    
    // Usar la ruta definida en la configuración
    navigate(activity.route);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    navigate("/tipo-usuario");
  };

  if (!student) {
    return <div className="loading">Cargando...</div>;
  }
const currentActivities = getActivitiesForAgeGroup(selectedAgeGroup);



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
              <img src="/avatars/estudiante1.svg" alt="Avatar" />
            </div>
            <h3 className="student-welcome__sidebar-title">
              {student?.nombre || 'Estudiante'} {student?.apellido || ''}
            </h3>
            <p className="student-welcome__sidebar-subtitle">
              {student?.institucion || 'Institución'}
            </p>
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
              ID: {student?.id || 'N/A'} | Edad: {student?.edad || 'N/A'}
            </div>
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

      {/* Modal de Insignia */}
      <AnimatePresence>
        {showInsigniaModal && insigniaToShow && (
          <>
            {console.log('🎯 Renderizando modal con:', insigniaToShow)}
            {/* Confeti */}
            {confetti && (
              <div className="confetti-container">
                {Array.from({ length: 100 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="confetti-piece"
                    initial={{
                      x: Math.random() * window.innerWidth,
                      y: -50,
                      rotate: 0,
                      opacity: 1
                    }}
                    animate={{
                      y: window.innerHeight + 50,
                      rotate: Math.random() * 360,
                      opacity: 0
                    }}
                    transition={{
                      duration: 3,
                      delay: Math.random() * 1,
                      ease: "linear"
                    }}
                    style={{
                      backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Modal */}
            <motion.div
              className="insignia-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            >
              <motion.div
                className="insignia-modal-content"
                initial={{ scale: 0, y: 50, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  y: 0, 
                  opacity: 1,
                  transition: {
                    type: "spring",
                    damping: 15,
                    stiffness: 300
                  }
                }}
                exit={{ scale: 0, y: 50, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="insignia-celebration">
                  <motion.h2
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    🎉 ¡Felicitaciones! 🎉
                  </motion.h2>
                  
                  <div className="insignia-display">
                    <motion.div
                      className="insignia-glow"
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: [1, 1.05, 1], 
                        transition: {
                          scale: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }
                      }}
                    >
                      <InsigniaImage />
                    </motion.div>
                    
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      {insigniaToShow?.insignia?.nombre || 'Insignia de Bienvenida'}
                    </motion.h3>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      {insigniaToShow?.insignia?.descripcion || 'Has completado tu registro exitosamente'}
                    </motion.p>
                    
                    {(insigniaToShow?.insignia?.puntos_otorgados || 0) > 0 && (
                      <motion.div 
                        className="puntos"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, type: "spring" }}
                      >
                        +{insigniaToShow?.insignia?.puntos_otorgados || 0} puntos
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.button 
                    onClick={handleCloseModal} 
                    className="btn-continuar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ¡Continuar Aventura!
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
