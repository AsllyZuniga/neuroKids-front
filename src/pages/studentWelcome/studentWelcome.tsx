import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {LogOut, Book, Gamepad2, Palette, Map as MapIcon, Trophy, Star, Flame, TrendingUp, Award, BookOpen, Lock, Sparkles } from "lucide-react";
import Header from "@/components/header/header";
import {insigniaService, type InsigniaCatalogoItem, type NotificacionInsignia} from "@/services/insigniaService";
import { getActivitiesByAgeGroup, type ActivityConfig } from "@/config/activities";
import { progressService, type StudentProgress, type ActivityProgress, type LevelDetail } from "@/services/progressService";
import { registerStudentPlatformVisit } from "@/services/studentAccessService";
import "./studentWelcome.scss";

/** Preferencia de panel por estudiante (sobrevive cierre de sesión y otras rutas) */
const LEGACY_PANEL_UI_KEY = "neurokids-student-panel-ui";
function panelUiKey(studentId: number) {
  return `neurokids-student-panel-ui-${studentId}`;
}

type PanelSection = "aventura" | "progreso" | "personalizacion";

function readStoredUser(): Partial<Student> | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Student>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function notifSeenKey(studentId: number, notifId: string | number): string {
  return `neurokids-notif-seen-${studentId}-${String(notifId)}`;
}

function gradientFromBackground(baseColor: string): string {
  const colorMap: Record<string, { from: string; via: string; to: string }> = {
    "#E8F4F8": { from: "#D0E8F0", via: "#E0F0F8", to: "#F0F8FC" },
    "#F0E8F4": { from: "#E0D0E8", via: "#E8E0F0", to: "#F4F0F8" },
    "#FCE8E8": { from: "#F8D0D0", via: "#FCE0E0", to: "#FFF0F0" },
    "#E8F4E8": { from: "#D0E8D0", via: "#E0F0E0", to: "#F0F8F0" },
    "#FFF4E8": { from: "#FFE8D0", via: "#FFF0E0", to: "#FFF8F0" },
    "#F4F0E8": { from: "#E8E0D0", via: "#F0E8E0", to: "#F8F4F0" },
    "#E8F0F4": { from: "#D0E0E8", via: "#E0E8F0", to: "#F0F4F8" },
    "#F4E8F0": { from: "#E8D0E0", via: "#F0E0E8", to: "#F8F0F4" },
  };
  const g = colorMap[baseColor] || colorMap["#E8F4F8"];
  return `linear-gradient(to bottom right, ${g.from}, ${g.via}, ${g.to})`;
}

function readProgressStats(studentId: number) {
  try {
    const raw = localStorage.getItem(`neurokids-progress-${studentId}`);
    if (!raw) return { puntos: 0, lecturas: 0, juegos: 0 };
    const p = JSON.parse(raw) as {
      totalPoints?: number;
      readingsCompleted?: number;
      gamesCompleted?: number;
    };
    return {
      puntos: p.totalPoints ?? 0,
      lecturas: p.readingsCompleted ?? 0,
      juegos: p.gamesCompleted ?? 0,
    };
  } catch {
    return { puntos: 0, lecturas: 0, juegos: 0 };
  }
}

interface Student {
  id: number;
  nombre: string;
  apellido: string;
  codigo_estudiante: string;
  edad?: number;
  institucion: string;
}

type MapNodeState = "completed" | "current" | "next" | "locked";

type Activity = ActivityConfig & {
  completed: boolean;
  position: { x: number; y: number };
  mapState: MapNodeState;
  levelDetail?: LevelDetail | null;
};

const LEVEL_DOT_COLORS = ["#f59e0b", "#3b82f6", "#22c55e"];

function MapLevelDots({ activity }: { activity: Activity }) {
  const ld = activity.levelDetail;
  const full = activity.completed;
  const done = (n: number) => {
    if (full) return true;
    if (!ld) return false;
    if (ld.lecturaSimple && activity.type === "lectura") return false;
    return Boolean(ld.levelsCompleted?.includes(n));
  };
  return (
    <div className="student-welcome__map-level-dots" aria-hidden>
      {[1, 2, 3].map((n) => {
        const isDone = done(n);
        return (
          <span
            key={n}
            className={`student-welcome__map-level-dot ${isDone ? "is-done" : "is-locked"}`}
            style={{
              background: isDone ? LEVEL_DOT_COLORS[n - 1] : "#e5e7eb",
              borderColor: isDone ? LEVEL_DOT_COLORS[n - 1] : "#9ca3af",
            }}
          />
        );
      })}
    </div>
  );
}

/** Estados del mapa (diseño: completado / en curso / siguiente / bloqueado) */
function computeMapStates(activities: { completed: boolean }[]): MapNodeState[] {
  const firstIncomplete = activities.findIndex((a) => !a.completed);
  if (firstIncomplete === -1) {
    return activities.map(() => "completed");
  }
  return activities.map((a, i) => {
    if (a.completed) return "completed";
    if (i === firstIncomplete) return "current";
    if (i === firstIncomplete + 1) return "next";
    return "locked";
  });
}

/** Camino en zigzag: filas alternas izquierda↔derecha + desplazamiento por fila */
function buildSnakePositions(count: number, cols: number): { x: number; y: number }[] {
  if (count === 0) return [];
  const rows = Math.ceil(count / cols);
  const vertPad = 6;
  const ySpan = 100 - 2 * vertPad;
  const out: { x: number; y: number }[] = [];
  /** Más contraste horizontal entre filas = zigzag más legible */
  const rowShiftAmp = cols <= 2 ? 7.5 : 5.5;
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols);
    let colIndex = i % cols;
    if (row % 2 === 1) colIndex = cols - 1 - colIndex;
    let x = ((colIndex + 0.5) / cols) * 100;
    const rowShift = row % 2 === 0 ? -rowShiftAmp : rowShiftAmp;
    x += rowShift;
    const wave = Math.sin((i / Math.max(count - 1, 1)) * Math.PI * 2) * 1.2;
    x = Math.min(93, Math.max(7, x + wave));
    const y = vertPad + ((row + 0.5) / rows) * ySpan;
    out.push({ x, y });
  }
  return out;
}

/** Prioriza 2 columnas cuando hay varias actividades = más filas, mapa más alto y zigzag más visible */
function snakeColsForCount(count: number): number {
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 8) return 2;
  if (count <= 12) return 3;
  return 4;
}

/** Rutas públicas: neuroKids-front/public/avatars/panelestudiante */
const AVATARES_PANEL_ESTUDIANTE = Array.from(
  { length: 9 },
  (_, i) => `/avatars/panelestudiante/avatar${i + 1}.svg`
);
const DEFAULT_AVATAR_SRC = AVATARES_PANEL_ESTUDIANTE[0];

function normalizeStoredAvatar(raw: string | undefined): string {
  if (raw && AVATARES_PANEL_ESTUDIANTE.includes(raw)) return raw;
  return DEFAULT_AVATAR_SRC;
}

const FONDOS_PASTEL: { color: string; nombre: string }[] = [
  { color: "#E8F4F8", nombre: "Azul suave" },
  { color: "#F0E8F4", nombre: "Lila claro" },
  { color: "#FCE8E8", nombre: "Rosa suave" },
  { color: "#E8F4E8", nombre: "Verde menta" },
  { color: "#FFF4E8", nombre: "Durazno" },
  { color: "#F4F0E8", nombre: "Crema" },
  { color: "#E8F0F4", nombre: "Cielo" },
  { color: "#F4E8F0", nombre: "Lavanda" },
];

export default function StudentWelcome() {
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<"7-8" | "9-10" | "11-12">("7-8");
  const [showInsigniaModal, setShowInsigniaModal] = useState(false);
  const [insigniaToShow, setInsigniaToShow] = useState<NotificacionInsignia | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [insigniasCatalogo, setInsigniasCatalogo] = useState<InsigniaCatalogoItem[]>([]);
  const [insigniasCatalogoLoading, setInsigniasCatalogoLoading] = useState(false);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  const [panelSection, setPanelSection] = useState<PanelSection>("aventura");
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR_SRC);
  const [selectedBackground, setSelectedBackground] = useState("#E8F4F8");

  const navigate = useNavigate();

  const loadPanelPrefs = useCallback((studentId: number) => {
    try {
      let raw = localStorage.getItem(panelUiKey(studentId));
      if (!raw) {
        raw = localStorage.getItem(LEGACY_PANEL_UI_KEY);
        if (raw) {
          localStorage.setItem(panelUiKey(studentId), raw);
        }
      }
      if (!raw) return;
      const p = JSON.parse(raw) as {
        avatar?: string;
        background?: string;
      };
      if (p.avatar) setSelectedAvatar(normalizeStoredAvatar(p.avatar));
      if (p.background) setSelectedBackground(p.background);
    } catch {
      /* ignore */
    }
  }, []);

  const refreshProgress = useCallback(async () => {
    setProgressLoading(true);
    try {
      const p = await progressService.getStudentProgress();
      setStudentProgress(p);
      /* mapa usa studentProgress.activities directamente */
    } catch {
      /* ignore */
    } finally {
      setProgressLoading(false);
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const u = JSON.parse(raw) as { id?: number };
          if (u?.id != null) setStreakDays(progressService.getStreakDays(u.id));
        }
      } catch {
        /* ignore */
      }
    }
  }, []);

  const loadInsigniasCatalogo = useCallback(async (estudianteId: number) => {
    setInsigniasCatalogoLoading(true);
    try {
      const list = await insigniaService.getCatalogoInsigniasEstudiante(String(estudianteId));
      setInsigniasCatalogo(Array.isArray(list) ? list : []);
    } catch {
      setInsigniasCatalogo([]);
    } finally {
      setInsigniasCatalogoLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!student?.id) return;
    localStorage.setItem(
      panelUiKey(student.id),
      JSON.stringify({
        avatar: selectedAvatar,
        background: selectedBackground,
      })
    );
  }, [student?.id, selectedAvatar, selectedBackground]);

  useEffect(() => {
    const userData = readStoredUser();
    console.log("👤 Datos de usuario cargados:", userData);

    if (!userData?.id) {
      console.log("❌ No hay datos de usuario, redirigiendo...");
      navigate("/tipo-usuario");
      return;
    }

    setStudent(userData as Student);

    void registerStudentPlatformVisit();

    loadPanelPrefs(userData.id);

    checkForNewInsignias(userData.id);
    loadInsigniasCatalogo(userData.id);
    refreshProgress();
    setStreakDays(progressService.getStreakDays(userData.id));
  }, [navigate, loadInsigniasCatalogo, loadPanelPrefs, refreshProgress]);

  const InsigniaImage = () => {
    const [imageError, setImageError] = useState(false);

    const fallbackSVG = (
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "linear-gradient(145deg, #FFD700, #FFA500)",
          border: "5px solid #FFD700",
        }}
      >
        <circle cx="50" cy="50" r="40" fill="#FFD700" stroke="#FFA500" strokeWidth="3" />
        <circle cx="50" cy="50" r="30" fill="#FFED4A" opacity="0.8" />
        <text x="50" y="60" fontFamily="OpenDyslexic" fontSize="35" textAnchor="middle" fill="#FFF">
          🏆
        </text>
      </svg>
    );

    if (imageError) {
      return fallbackSVG;
    }

    return (
      <>
        <motion.img
          src={
            insigniaToShow?.insignia?.icono ||
            "https://api.neurokids.click/imagenes/primer_paso.svg"
          }
          alt={insigniaToShow?.insignia?.nombre || insigniaToShow?.titulo || "Insignia"}
          className="insignia-icon"
          crossOrigin="anonymous"
          style={{
            borderColor: insigniaToShow?.insignia?.color_hex || "#FFD700",
            width: "100px",
            height: "100px",
            border: "5px solid #FFD700",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(240, 249, 255, 0.8) 100%)",
            padding: "10px",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            transition: {
              delay: 0.5,
              duration: 0.8,
            },
          }}
          onLoad={() => setImageError(false)}
          onError={() => setImageError(true)}
        />
        {imageError && fallbackSVG}
      </>
    );
  };

  const checkForNewInsignias = async (estudianteId: number) => {
    try {
      const notificaciones = await insigniaService.getNotificacionesPendientes(estudianteId.toString());
      const insigniasPendientes = (Array.isArray(notificaciones) ? notificaciones : [])
        .filter((notif) => notif.tipo_notificacion === "insignia")
        .filter((notif) => {
          const nid = notif?.id;
          if (nid == null || nid === "") return true;
          return localStorage.getItem(notifSeenKey(estudianteId, String(nid))) !== "1";
        });

      if (insigniasPendientes.length > 0) {
        const priorizadas = [...insigniasPendientes].sort((a, b) => {
          const aPrimerRegistro = String(a?.insignia_relacionada_id ?? "") === "14";
          const bPrimerRegistro = String(b?.insignia_relacionada_id ?? "") === "14";
          if (aPrimerRegistro !== bPrimerRegistro) return aPrimerRegistro ? 1 : -1;
          const aTime = new Date(a?.created_at || 0).getTime();
          const bTime = new Date(b?.created_at || 0).getTime();
          return bTime - aTime;
        });
        const insigniaPendiente = priorizadas[0];
        setInsigniaToShow(insigniaPendiente);
        setShowInsigniaModal(true);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
      } else {
        const isFirstTimeUser = localStorage.getItem(`first_visit_${estudianteId}`) === null;
        if (isFirstTimeUser) {
          localStorage.setItem(`first_visit_${estudianteId}`, "true");

          const mockInsignia = {
            id: "1",
            estudiante_id: estudianteId.toString(),
            tipo_notificacion: "insignia",
            titulo: "Primer Registro",
            mensaje: "Completaste tu registro",
            insignia_relacionada_id: "14",
            leida: false,
            created_at: new Date().toISOString(),
            insignia: {
              id: "14",
              nombre: "Primer Registro",
              descripcion: "Completaste tu registro exitosamente",
              icono: "https://api.neurokids.click/imagenes/primer_paso.svg",
              color_hex: "#FFD700",
              categoria: "logro",
              rareza: "comun",
              puntos_otorgados: 10,
              estado: true,
            },
          };

          setTimeout(() => {
            setInsigniaToShow(mockInsignia);
            setShowInsigniaModal(true);
            setConfetti(true);
            setTimeout(() => setConfetti(false), 3000);
          }, 2000);
        }
      }
    } catch (error) {
      console.error("🚨 Error al verificar insignias:", error);
    }
  };

  const handleCloseModal = async () => {
    if (insigniaToShow && student) {
      try {
        const nid = insigniaToShow.id;
        if (nid != null && nid !== "") {
          await insigniaService.marcarNotificacionLeida(String(student.id), String(nid));
          localStorage.setItem(notifSeenKey(student.id, String(nid)), "1");
        } else {
          await insigniaService.marcarBienvenidaLeida(student.id.toString());
        }
      } catch (error) {
        console.error("Error al marcar insignia como leída:", error);
      }
    }

    setShowInsigniaModal(false);
    setInsigniaToShow(null);
    setConfetti(false);
  };

  useEffect(() => {
    const handleFocus = () => {
      const userData = readStoredUser();
      if (!userData?.id) return;

      loadInsigniasCatalogo(userData.id);
      refreshProgress();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadInsigniasCatalogo, refreshProgress]);

  const handleLogout = () => {
    // Solo cerrar sesión: no borrar neurokids-progress-*, panel UI, racha ni caché de progreso
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    navigate("/tipo-usuario");
  };

  const allowedAgeGroups = useMemo((): ("7-8" | "9-10" | "11-12")[] => {
    if (!student?.edad) return [];
    if (student.edad >= 7 && student.edad <= 8) return ["7-8"];
    if (student.edad >= 9 && student.edad <= 10) return ["9-10"];
    if (student.edad >= 11 && student.edad <= 12) return ["11-12"];
    return [];
  }, [student?.edad]);

  useEffect(() => {
    if (allowedAgeGroups.length === 1) {
      setSelectedAgeGroup(allowedAgeGroups[0]);
    }
  }, [allowedAgeGroups]);

  const stats = useMemo(() => {
    if (!student?.id) return { puntos: 0, lecturas: 0, juegos: 0, maxLecturas: 1, maxJuegos: 1 };
    const groups = allowedAgeGroups.length ? allowedAgeGroups : (["7-8", "9-10", "11-12"] as const);
    const allowed = new Set(groups);
    let maxLecturas = 0;
    let maxJuegos = 0;
    groups.forEach((g) => {
      getActivitiesByAgeGroup(g).forEach((a) => {
        if (a.type === "lectura") maxLecturas++;
        else maxJuegos++;
      });
    });
    maxLecturas = Math.max(maxLecturas, 1);
    maxJuegos = Math.max(maxJuegos, 1);

    const local = readProgressStats(student.id);
    if (!studentProgress) {
      return {
        puntos: local.puntos,
        lecturas: local.lecturas,
        juegos: local.juegos,
        maxLecturas,
        maxJuegos,
      };
    }

    let lecturas = 0;
    let juegos = 0;
    studentProgress.activities.forEach((a) => {
      if (!a.completed || !allowed.has(a.ageGroup)) return;
      if (a.activityType === "lectura") lecturas++;
      else juegos++;
    });

    return {
      puntos: studentProgress.totalPoints,
      lecturas,
      juegos,
      maxLecturas,
      maxJuegos,
    };
  }, [student?.id, studentProgress, allowedAgeGroups]);

  const lecturasPct = Math.min(100, Math.round((stats.lecturas / stats.maxLecturas) * 100));
  const juegosPct = Math.min(100, Math.round((stats.juegos / stats.maxJuegos) * 100));

  const insigniasStats = useMemo(() => {
    const unlocked = insigniasCatalogo.filter((i) => i.desbloqueada).length;
    const total = insigniasCatalogo.length;
    return { unlocked, total };
  }, [insigniasCatalogo]);

  const insigniasStatLabel = useMemo(() => {
    if (insigniasCatalogoLoading) return "…";
    if (insigniasStats.total === 0) return "—";
    return `${insigniasStats.unlocked}/${insigniasStats.total}`;
  }, [insigniasCatalogoLoading, insigniasStats]);

  const puntosStatLabel = progressLoading ? "…" : `${stats.puntos}`;
  const lecturasStatLabel = progressLoading ? "…" : `${stats.lecturas}/${stats.maxLecturas}`;
  const juegosStatLabel = progressLoading ? "…" : `${stats.juegos}/${stats.maxJuegos}`;
  const streakStatLabel = progressLoading ? "…" : `${streakDays}`;

  const progressByDbId = useMemo(() => {
    const m = new Map<number, ActivityProgress>();
    studentProgress?.activities?.forEach((a) => {
      m.set(Number(a.activityId), a);
    });
    return m;
  }, [studentProgress]);

  const currentActivities = useMemo((): Activity[] => {
    const baseActivities = getActivitiesByAgeGroup(selectedAgeGroup);
    const cols = snakeColsForCount(baseActivities.length);
    const withFlags = baseActivities.map((activity) => {
      const pr = progressByDbId.get(activity.dbId);
      const fullyComplete = Boolean(pr?.completed);
      return {
        ...activity,
        completed: fullyComplete,
        levelDetail: pr?.levelDetail ?? null,
      };
    });
    const states = computeMapStates(withFlags);
    const positions = buildSnakePositions(baseActivities.length, cols);
    return withFlags.map((activity, index) => ({
      ...activity,
      mapState: states[index] || "locked",
      position: positions[index] || { x: 50, y: 50 },
    }));
  }, [selectedAgeGroup, progressByDbId]);

  if (!student) {
    return <div className="loading">Cargando...</div>;
  }

  const mapCols = snakeColsForCount(currentActivities.length);
  const mapRows = Math.max(1, Math.ceil(currentActivities.length / mapCols || 1));
  const mapMinHeightPx = Math.max(380, mapRows * 162 + 96);

  return (
    <div
      className="student-welcome student-welcome--figma"
      style={{ background: gradientFromBackground(selectedBackground) }}
    >
      <Header />

      <div className="student-welcome__layout">
        <aside className="student-welcome__sidebar student-welcome__sidebar--figma">
          <div className="student-welcome__sidebar-header">
            <div className="student-welcome__avatar student-welcome__avatar--panel-img">
              <img
                src={selectedAvatar}
                alt=""
                className="student-welcome__avatar-img"
                width={88}
                height={88}
                decoding="async"
              />
            </div>
            <h3 className="student-welcome__sidebar-title">
              {student.nombre} {student.apellido}
            </h3>
            <p className="student-welcome__sidebar-subtitle">{student.institucion || "Institución"}</p>
            <p className="student-welcome__sidebar-meta">Edad: {student.edad ?? "—"}</p>
          </div>

          <nav className="student-welcome__sidebar-nav">
            <button
              type="button"
              className={`student-welcome__sidebar-item student-welcome__nav-figma ${
                panelSection === "aventura" ? "is-active" : ""
              }`}
              onClick={() => setPanelSection("aventura")}
            >
              <MapIcon size={20} />
              <span>Mi aventura</span>
            </button>
            <button
              type="button"
              className={`student-welcome__sidebar-item student-welcome__nav-figma ${
                panelSection === "progreso" ? "is-active" : ""
              }`}
              onClick={() => setPanelSection("progreso")}
            >
              <Trophy size={20} />
              <span>Mi progreso</span>
            </button>
            <button
              type="button"
              className={`student-welcome__sidebar-item student-welcome__nav-figma ${
                panelSection === "personalizacion" ? "is-active" : ""
              }`}
              onClick={() => setPanelSection("personalizacion")}
            >
              <Palette size={20} strokeWidth={2.25} />
              <span>Personalización</span>
            </button>
          </nav>

          <div className="student-welcome__sidebar-footer">
            <button type="button" className="student-welcome__sidebar-item logout" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        <main className="student-welcome__main">
          {panelSection === "aventura" && (
            <>
              <div className="student-welcome__figma-stats">
                <motion.div
                  className="student-welcome__figma-stat student-welcome__figma-stat--purple"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="student-welcome__figma-stat-icon">
                    <Star size={22} />
                  </div>
                  <div>
                    <div className="student-welcome__figma-stat-value">{puntosStatLabel}</div>
                    <div className="student-welcome__figma-stat-label">Puntos</div>
                  </div>
                </motion.div>
                <motion.div
                  className="student-welcome__figma-stat student-welcome__figma-stat--blue"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <div className="student-welcome__figma-stat-icon">
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <div className="student-welcome__figma-stat-value">{lecturasStatLabel}</div>
                    <div className="student-welcome__figma-stat-label">Lecturas</div>
                  </div>
                </motion.div>
                <motion.div
                  className="student-welcome__figma-stat student-welcome__figma-stat--green"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="student-welcome__figma-stat-icon">
                    <Gamepad2 size={22} />
                  </div>
                  <div>
                    <div className="student-welcome__figma-stat-value">{juegosStatLabel}</div>
                    <div className="student-welcome__figma-stat-label">Juegos</div>
                  </div>
                </motion.div>
                <motion.div
                  className="student-welcome__figma-stat student-welcome__figma-stat--orange"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <div className="student-welcome__figma-stat-icon">
                    <Flame size={22} />
                  </div>
                  <div>
                    <div className="student-welcome__figma-stat-value">{streakStatLabel}</div>
                    <div className="student-welcome__figma-stat-label">Días racha</div>
                  </div>
                </motion.div>
                <motion.div
                  className="student-welcome__figma-stat student-welcome__figma-stat--yellow"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="student-welcome__figma-stat-icon">
                    <Trophy size={22} />
                  </div>
                  <div>
                    <div className="student-welcome__figma-stat-value">{insigniasStatLabel}</div>
                    <div className="student-welcome__figma-stat-label">Insignias</div>
                  </div>
                </motion.div>
              </div>

              <div className="student-welcome__figma-map-wrap">
                <div className="student-welcome__figma-map-head">
                  <div className="student-welcome__figma-map-head-inner">
                    <div className="student-welcome__figma-map-logo-badge" aria-hidden>
                      <MapIcon size={26} strokeWidth={2.2} />
                    </div>
                    <div className="student-welcome__figma-map-head-copy">
                      <h2 className="student-welcome__figma-map-title">Tu mapa de aventura</h2>
                      <p className="student-welcome__figma-map-sub">
                        Este es tu camino de aprendizaje ¡Mira como avanzas! 
                      </p>
                    </div>
                  </div>
                </div>

                <div className="student-welcome__age-selector">
                  {allowedAgeGroups.map((group) => (
                    <button
                      key={group}
                      type="button"
                      className={`student-welcome__age-btn ${selectedAgeGroup === group ? "active" : ""}`}
                      onClick={() => setSelectedAgeGroup(group)}
                    >
                      {group} años
                    </button>
                  ))}
                </div>

                <div
                  className="student-welcome__map-container student-welcome__map-container--snake"
                  style={{ minHeight: `${mapMinHeightPx}px` }}
                >
                  <svg
                    className="student-welcome__map-path"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    width="100%"
                    height="100%"
                  >
                    {currentActivities.map((activity, index) => {
                      if (index >= currentActivities.length - 1) return null;
                      const next = currentActivities[index + 1];
                      const ax = activity.position.x;
                      const ay = activity.position.y;
                      const bx = next.position.x;
                      const by = next.position.y;
                      const mx = (ax + bx) / 2;
                      const my = (ay + by) / 2;
                      const stroke =
                        activity.mapState === "completed"
                          ? "#22c55e"
                          : activity.mapState === "current"
                            ? "#3b82f6"
                            : activity.mapState === "next"
                              ? "#fb923c"
                              : "#cbd5e1";
                      const dashed = activity.mapState === "locked";
                      return (
                        <motion.path
                          key={`path-${activity.id}-${next.id}`}
                          d={`M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}`}
                          stroke={stroke}
                          strokeWidth={dashed ? 0.75 : 0.95}
                          vectorEffect="non-scaling-stroke"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={dashed ? "3 3" : "5 4"}
                          opacity={dashed ? 0.75 : 1}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.45, delay: index * 0.06 }}
                        />
                      );
                    })}
                  </svg>

                  {currentActivities.map((activity, index) => (
                    <motion.button
                      key={activity.id}
                      className={`student-welcome__activity student-welcome__activity--map-interactive student-welcome__map-node student-welcome__map-node--${activity.mapState} ${activity.type}`}
                      style={{
                        left: `${activity.position.x}%`,
                        top: `${activity.position.y}%`,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={() => {
                        if (activity.mapState !== "locked") {
                          navigate(activity.route);
                        }
                      }}
                      disabled={activity.mapState === "locked"}
                      type="button"
                      aria-label={`Paso ${index + 1}: ${activity.title}`}
                    >
                      <div className="student-welcome__map-node-order">{index + 1}</div>
                      <div className="student-welcome__map-node-ring">
                        <div className="student-welcome__activity-icon student-welcome__map-node-icon">
                          {activity.mapState === "locked" ? (
                            <Lock className="student-welcome__map-node-lock" size={26} strokeWidth={2.5} />
                          ) : activity.mapState === "current" ? (
                            <Star
                              className="student-welcome__map-node-star"
                              size={28}
                              fill="#facc15"
                              stroke="#ca8a04"
                              strokeWidth={2}
                            />
                          ) : activity.mapState === "next" ? (
                            <Sparkles className="student-welcome__map-node-sparkles" size={26} strokeWidth={2.2} />
                          ) : (
                            <span className="emoji">{activity.icon}</span>
                          )}
                        </div>
                        {activity.mapState === "completed" && (
                          <div className="student-welcome__map-node-check" aria-hidden>
                            ✓
                          </div>
                        )}
                      </div>
                      <div
                        className={`student-welcome__map-node-float student-welcome__map-node-float--${activity.type}`}
                        aria-hidden
                      >
                        {activity.type === "lectura" ? <Book size={12} /> : <Gamepad2 size={12} />}
                      </div>
                      <div className="student-welcome__map-node-caption">
                        <span className="student-welcome__map-node-caption-title">{activity.title}</span>
                        <div className="student-welcome__map-node-caption-level-wrap">
                          <MapLevelDots activity={activity} />
                          <span className="student-welcome__map-node-caption-level">
                            {activity.completed
                              ? "¡3/3 niveles completos!"
                              : (() => {
                                  const m = activity.levelDetail?.maxLevelReached ?? 0;
                                  const c = activity.levelDetail?.levelsCompleted?.length ?? 0;
                                  if (m === 0 && c === 0) return "Sin empezar";
                                  return `Hasta nivel ${m} · ${c}/3`;
                                })()}
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="student-welcome__figma-motivation">
                <p>¡Mira qué lejos has llegado en tu camino de aprendizaje! ¡Sigue adelante! 🚀✨</p>
              </div>
            </>
          )}

          {panelSection === "progreso" && (
            <div className="student-welcome__progreso">
              <motion.div className="student-welcome__progreso-head" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="student-welcome__progreso-title text-slate-900">Mi progreso</h1>
                <p className="student-welcome__progreso-sub text-slate-700">¡Mira todo lo que has logrado!</p>
              </motion.div>

              <div className="student-welcome__progreso-cards">
                <div className="student-welcome__pcard student-welcome__pcard--p">
                  <div className="student-welcome__pcard-inner">
                    <div className="student-welcome__pcard-ico">
                      <Star size={28} />
                    </div>
                    <div>
                      <div className="student-welcome__pcard-val">{puntosStatLabel}</div>
                      <div className="student-welcome__pcard-lbl">Puntos totales</div>
                    </div>
                  </div>
                  <p className="student-welcome__pcard-hint">Suma de puntos de lecturas y juegos</p>
                </div>
                <div className="student-welcome__pcard student-welcome__pcard--o">
                  <div className="student-welcome__pcard-inner">
                    <div className="student-welcome__pcard-ico">
                      <Flame size={28} />
                    </div>
                    <div>
                      <div className="student-welcome__pcard-val">{streakStatLabel}</div>
                      <div className="student-welcome__pcard-lbl">Días racha</div>
                    </div>
                  </div>
                  <p className="student-welcome__pcard-hint">Se suma un día al completar al menos una actividad seguida</p>
                </div>
                <div className="student-welcome__pcard student-welcome__pcard--g">
                  <div className="student-welcome__pcard-inner">
                    <div className="student-welcome__pcard-ico">
                      <TrendingUp size={28} />
                    </div>
                    <div>
                      <div className="student-welcome__pcard-val">
                        {allowedAgeGroups[0] ?? "—"}
                      </div>
                      <div className="student-welcome__pcard-lbl">Tu etapa</div>
                    </div>
                  </div>
                  <p className="student-welcome__pcard-hint">Según tu edad en el perfil</p>
                </div>
                <div className="student-welcome__pcard student-welcome__pcard--y">
                  <div className="student-welcome__pcard-inner">
                    <div className="student-welcome__pcard-ico">
                      <Trophy size={28} />
                    </div>
                    <div>
                      <div className="student-welcome__pcard-val">{insigniasStatLabel}</div>
                      <div className="student-welcome__pcard-lbl">Insignias</div>
                    </div>
                  </div>
                  <p className="student-welcome__pcard-hint">
                    {insigniasStats.total > 0
                      ? `${insigniasStats.unlocked} de ${insigniasStats.total} desbloqueadas`
                      : "Gana insignias completando actividades"}
                  </p>
                </div>
              </div>

              <motion.div
                className="student-welcome__logros-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="student-welcome__logros-title">
                  <Award size={26} /> Tus logros
                </h2>
                <div className="student-welcome__logros-grid">
                  <div>
                    <div className="student-welcome__logros-block-head">
                      <div className="student-welcome__logros-mini student-welcome__logros-mini--b">
                        <BookOpen size={22} />
                      </div>
                      <div>
                        <h3>Lecturas completadas</h3>
                        <p>
                          {stats.lecturas} actividades de lectura completadas
                        </p>
                      </div>
                    </div>
                    <div className="student-welcome__logros-bar-meta">
                      <span>Avance</span>
                      <span>
                        {stats.lecturas}/{stats.maxLecturas}
                      </span>
                    </div>
                    <div className="student-welcome__logros-bar-bg">
                      <motion.div
                        className="student-welcome__logros-bar-fill student-welcome__logros-bar-fill--blue"
                        initial={{ width: 0 }}
                        animate={{ width: `${lecturasPct}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="student-welcome__logros-block-head">
                      <div className="student-welcome__logros-mini student-welcome__logros-mini--g">
                        <Gamepad2 size={22} />
                      </div>
                      <div>
                        <h3>Juegos completados</h3>
                        <p>{stats.juegos} juegos completados</p>
                      </div>
                    </div>
                    <div className="student-welcome__logros-bar-meta">
                      <span>Avance</span>
                      <span>
                        {stats.juegos}/{stats.maxJuegos}
                      </span>
                    </div>
                    <div className="student-welcome__logros-bar-bg">
                      <motion.div
                        className="student-welcome__logros-bar-fill student-welcome__logros-bar-fill--green"
                        initial={{ width: 0 }}
                        animate={{ width: `${juegosPct}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="student-welcome__insignias-section"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <h2 className="student-welcome__insignias-title">
                  <Trophy size={24} /> Insignias
                </h2>
          
                {insigniasCatalogoLoading && (
                  <p className="student-welcome__insignias-hint">Cargando insignias…</p>
                )}
                {!insigniasCatalogoLoading && insigniasCatalogo.length === 0 && (
                  <p className="student-welcome__insignias-hint">
                    No se pudo cargar el catálogo o no hay insignias registradas en el sistema.
                  </p>
                )}
                <div className="student-welcome__insignias-grid">
                  {insigniasCatalogo.map((ins) => (
                    <div
                      key={ins.id}
                      className={`student-welcome__insignia-cell ${ins.desbloqueada ? "is-unlocked" : "is-locked"}`}
                    >
                      <div
                        className="student-welcome__insignia-cell-icon-wrap"
                        style={{ borderColor: ins.color_hex || "#cbd5e1" }}
                      >
                        {ins.icono ? (
                          <img
                            src={ins.icono}
                            alt=""
                            className={`student-welcome__insignia-cell-img ${!ins.desbloqueada ? "is-dimmed" : ""}`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <Trophy
                            className="student-welcome__insignia-cell-fallback"
                            size={28}
                            aria-hidden
                          />
                        )}
                        {!ins.desbloqueada && (
                          <span className="student-welcome__insignia-lock-overlay" aria-hidden>
                            <Lock size={20} strokeWidth={2.5} />
                          </span>
                        )}
                      </div>
                      <span className="student-welcome__insignia-cell-name">{ins.nombre}</span>
                      {ins.descripcion ? (
                        <span className="student-welcome__insignia-cell-desc">{ins.descripcion}</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="student-welcome__progreso-foot">
                <p className="text-slate-700">¡Sigue explorando para desbloquear más insignias!</p>
              </div>
            </div>
          )}

          {panelSection === "personalizacion" && (
            <div className="student-welcome__perso">
              <div className="student-welcome__perso-head">
                <h1 className="text-slate-900">Personalización</h1>
                <p className="text-slate-700">
                  Personaliza y haz de tu lugar unico y especial para ti.
                </p>
              </div>

              <div className="student-welcome__perso-card">
                <h2>Tu avatar</h2>
                <p className="student-welcome__perso-desc">Elige un personaje</p>
                <div className="student-welcome__perso-preview student-welcome__perso-preview--avatar">
                  <img
                    src={selectedAvatar}
                    alt=""
                    className="student-welcome__perso-preview-img"
                    width={112}
                    height={112}
                    decoding="async"
                  />
                </div>
                <div className="student-welcome__perso-grid-avatars">
                  {AVATARES_PANEL_ESTUDIANTE.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      className={selectedAvatar === src ? "is-on" : ""}
                      onClick={() => setSelectedAvatar(src)}
                      aria-label={`Elegir avatar ${i + 1}`}
                    >
                      <img src={src} alt="" width={40} height={40} decoding="async" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="student-welcome__perso-card">
                <h2>Color de fondo del panel</h2>
                <p className="student-welcome__perso-desc">Tonos pasteles para descansar la vista</p>
                <div
                  className="student-welcome__perso-preview-wide"
                  style={{ backgroundColor: selectedBackground }}
                >
                  Vista previa
                </div>
                <div className="student-welcome__perso-grid-colors">
                  {FONDOS_PASTEL.map((f) => (
                    <button
                      key={f.color}
                      type="button"
                      className={selectedBackground === f.color ? "is-on" : ""}
                      style={{ backgroundColor: f.color }}
                      onClick={() => setSelectedBackground(f.color)}
                    >
                      {f.nombre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {showInsigniaModal && insigniaToShow && (
          <>
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
                      opacity: 1,
                    }}
                    animate={{
                      y: window.innerHeight + 50,
                      rotate: Math.random() * 360,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 3,
                      delay: Math.random() * 1,
                      ease: "linear",
                    }}
                    style={{
                      backgroundColor: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][
                        Math.floor(Math.random() * 6)
                      ],
                    }}
                  />
                ))}
              </div>
            )}

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
                    stiffness: 300,
                  },
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
                            ease: "easeInOut",
                          },
                        },
                      }}
                    >
                      <InsigniaImage />
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      {insigniaToShow?.insignia?.nombre ||
                        insigniaToShow?.titulo ||
                        "Insignia de Bienvenida"}
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      {insigniaToShow?.insignia?.descripcion ||
                        insigniaToShow?.mensaje ||
                        "Has completado tu registro exitosamente"}
                    </motion.p>

                    {(Number(insigniaToShow?.insignia?.puntos_otorgados) || 0) > 0 && (
                      <motion.div
                        className="puntos"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, type: "spring" }}
                      >
                        +{Number(insigniaToShow?.insignia?.puntos_otorgados) || 0} puntos
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
