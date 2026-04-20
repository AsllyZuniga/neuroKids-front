import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_CONFIG, buildApiUrl } from "@/config/api";
import "./evaluacionInicial.scss";

/* ── Tipos ── */
interface Tema {
  nombre: string;
  emoji: string;
  descripcion: string;
}

interface Opcion {
  id: number;
  texto_opcion: string;
  orden_opcion: number;
}

interface Pregunta {
  id: number;
  pregunta: string;
  orden_pregunta: number;
  opciones: Opcion[];
}

interface Lectura {
  titulo: string;
  contenido: string;
  resumen: string;
  tiempo_lectura_estimado: number;
}

interface SetupResponse {
  evaluacion_inicial_id: number;
  resultado_evaluacion_id: number;
  lectura: Lectura;
  preguntas: Pregunta[];
}

type Fase = "temas" | "cargando" | "lectura" | "preguntas" | "enviando";

/* Mapeo visual de temas */
const TEMA_META: Record<string, { emoji: string; descripcion: string }> = {
  animales:        { emoji: "🐾", descripcion: "Leemos sobre el mundo animal" },
  naturaleza:      { emoji: "🌿", descripcion: "Exploramos el mundo natural" },
  familia:         { emoji: "👨‍👩‍👧", descripcion: "Historias de familia y hogar" },
  aventura:        { emoji: "🗺️", descripcion: "Emocionantes aventuras" },
  deportes:        { emoji: "⚽", descripcion: "Juegos y deportes divertidos" },
  ciencia:         { emoji: "🔬", descripcion: "Descubrimientos científicos" },
  arte:            { emoji: "🎨", descripcion: "Creatividad y expresión" },
  música:          { emoji: "🎵", descripcion: "El mundo de los sonidos" },
  historia:        { emoji: "📜", descripcion: "Personajes y eventos históricos" },
  tecnología:      { emoji: "💻", descripcion: "El mundo tecnológico" },
  "medio ambiente":{ emoji: "🌍", descripcion: "Cuidamos nuestro planeta" },
};

export default function EvaluacionInicial() {
  const navigate = useNavigate();

  const [fase, setFase] = useState<Fase>("temas");
  const [temas, setTemas] = useState<Tema[]>([]);
  const [temaSeleccionado, setTemaSeleccionado] = useState<string>("");
  const [setupData, setSetupData] = useState<SetupResponse | null>(null);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [error, setError] = useState("");
  const [tiempoInicioPregunta, setTiempoInicioPregunta] = useState<number>(Date.now());

  /* ── Datos del estudiante desde localStorage ── */
  const getUserData = () => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getToken = () => localStorage.getItem("token") ?? "";

  /* ── 1. Cargar temas al montar ── */
  useEffect(() => {
    const fetchTemas = async () => {
      const user = getUserData();
      if (!user) { navigate("/estudiante/login"); return; }

      /* grupo_edad_id según edad */
      const edad = Number(user.edad ?? 7);
      const grupoId = edad <= 8 ? 1 : edad <= 10 ? 2 : 3;

      try {
        const res = await fetch(
          buildApiUrl(`${API_CONFIG.ENDPOINTS.EVAL_TEMAS}/${grupoId}`),
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        const json = await res.json();
        /* El backend devuelve { temas: string[] } o { data: { temas: string[] } } */
        const lista: string[] =
          json?.data?.temas ?? json?.temas ?? [];

        setTemas(
          lista.map((nombre: string) => ({
            nombre,
            emoji: TEMA_META[nombre]?.emoji ?? "📖",
            descripcion: TEMA_META[nombre]?.descripcion ?? "",
          }))
        );
      } catch {
        setError("No se pudieron cargar los temas. Intenta de nuevo.");
      }
    };

    fetchTemas();
  }, [navigate]);

  /* ── 2. Llamar setup al seleccionar tema ── */
  const handleSeleccionarTema = async (tema: string) => {
    setTemaSeleccionado(tema);
    setFase("cargando");
    setError("");

    const user = getUserData();
    const edad = Number(user?.edad ?? 7);

    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.EVAL_SETUP), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          estudiante_id: user?.id,
          edad,
          tema,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        /* Si ya tiene evaluación para este grupo → ir directo a plataforma */
        if (res.status === 409) {
          navigate("/bienvenida/estudiante");
          return;
        }
        throw new Error(json?.message ?? "Error al preparar la evaluación");
      }

      setSetupData(json);
      setFase("lectura");
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Ocurrió un error. Por favor intenta de nuevo."
      );
      setFase("temas");
    }
  };

  /* ── 3. Pasar de lectura a preguntas ── */
  const handleTerminarLectura = () => {
    setPreguntaActual(0);
    setTiempoInicioPregunta(Date.now());
    setFase("preguntas");
  };

  /* ── 4. Registrar respuesta y avanzar ── */
  const handleResponder = (opcionId: number) => {
    if (!setupData) return;
    const pregunta = setupData.preguntas[preguntaActual];
    setRespuestas((prev) => ({ ...prev, [pregunta.id]: opcionId }));

    if (preguntaActual < setupData.preguntas.length - 1) {
      setPreguntaActual((p) => p + 1);
      setTiempoInicioPregunta(Date.now());
    } else {
      handleEnviarRespuestas({ ...respuestas, [pregunta.id]: opcionId });
    }
  };

  /* ── 5. Enviar respuestas finales ── */
  const handleEnviarRespuestas = async (respuestasFinales: Record<number, number>) => {
    if (!setupData) return;
    setFase("enviando");

    const payload = {
      resultado_evaluacion_id: setupData.resultado_evaluacion_id,
      respuestas: setupData.preguntas.map((p) => ({
        pregunta_id: p.id,
        opcion_seleccionada_id: respuestasFinales[p.id],
        tiempo_respuesta: Math.round((Date.now() - tiempoInicioPregunta) / 1000),
      })),
    };

    try {
      await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.EVAL_RESPONDER), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      /* silencioso: si falla el envío igual redirigimos */
    }

    navigate("/bienvenida/estudiante");
  };

  /* ─────────── RENDER ─────────── */

  /* Fase: selección de tema */
  if (fase === "temas") {
    return (
      <div className="eval-container">
        <motion.div
          className="eval-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="eval-card__icon">📝</div>
          <h1 className="eval-card__title">¡Una pequeña actividad de lectura!</h1>
          <p className="eval-card__subtitle">
            Elige el tema que más te guste y lee un texto cortito.
          </p>

          {error && <div className="eval-error">{error}</div>}

          {temas.length === 0 && !error && (
            <div className="eval-loading">
              <div className="eval-loading__spinner" />
              <span>Cargando temas…</span>
            </div>
          )}

          <div className="eval-temas">
            {temas.map((t) => (
              <motion.button
                key={t.nombre}
                className="eval-tema-btn"
                onClick={() => handleSeleccionarTema(t.nombre)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="eval-tema-btn__emoji">{t.emoji}</span>
                <span className="eval-tema-btn__nombre">
                  {t.nombre.charAt(0).toUpperCase() + t.nombre.slice(1)}
                </span>
                {t.descripcion && (
                  <span className="eval-tema-btn__desc">{t.descripcion}</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  /* Fase: cargando IA */
  if (fase === "cargando") {
    return (
      <div className="eval-container">
        <motion.div
          className="eval-card eval-card--center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="eval-loading eval-loading--big">
            <div className="eval-loading__spinner eval-loading__spinner--big" />
          </div>
          <h2 className="eval-card__title">
            Preparando tu lectura sobre{" "}
            <strong>
              {temaSeleccionado.charAt(0).toUpperCase() + temaSeleccionado.slice(1)}
            </strong>
            …
          </h2>
          <p className="eval-card__subtitle">
            Nuestra IA está creando una lectura especial para ti.<br />
            Esto puede tardar hasta 45 segundos ✨
          </p>
          <div className="eval-dots">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="eval-dot"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, delay: i * 0.4, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  /* Fase: lectura */
  if (fase === "lectura" && setupData) {
    return (
      <div className="eval-container">
        <motion.div
          className="eval-card eval-card--lectura"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="eval-lectura-badge">📖 Lectura</div>
          <h2 className="eval-card__title">{setupData.lectura.titulo}</h2>
          {setupData.lectura.tiempo_lectura_estimado > 0 && (
            <p className="eval-lectura-tiempo">
              ⏱ {setupData.lectura.tiempo_lectura_estimado} min de lectura
            </p>
          )}
          <div className="eval-lectura-contenido">
            {setupData.lectura.contenido
              .split("\n")
              .filter(Boolean)
              .map((parr, i) => (
                <p key={i}>{parr}</p>
              ))}
          </div>
          <motion.button
            className="eval-btn-primary"
            onClick={handleTerminarLectura}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ¡Ya la leí! Ir a las preguntas →
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* Fase: preguntas */
  if (fase === "preguntas" && setupData) {
    const pregunta = setupData.preguntas[preguntaActual];
    const total = setupData.preguntas.length;
    const progreso = ((preguntaActual) / total) * 100;

    return (
      <div className="eval-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={preguntaActual}
            className="eval-card"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            {/* Barra de progreso */}
            <div className="eval-progress-wrap">
              <div
                className="eval-progress-bar"
                style={{ width: `${progreso}%` }}
              />
            </div>
            <p className="eval-pregunta-contador">
              Pregunta {preguntaActual + 1} de {total}
            </p>

            <h2 className="eval-card__title eval-card__title--pregunta">
              {pregunta.pregunta}
            </h2>

            <div className="eval-opciones">
              {pregunta.opciones
                .sort((a, b) => a.orden_opcion - b.orden_opcion)
                .map((op) => (
                  <motion.button
                    key={op.id}
                    className="eval-opcion-btn"
                    onClick={() => handleResponder(op.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {op.texto_opcion}
                  </motion.button>
                ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  /* Fase: enviando */
  return (
    <div className="eval-container">
      <motion.div
        className="eval-card eval-card--center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="eval-loading eval-loading--big">
          <div className="eval-loading__spinner eval-loading__spinner--big" />
        </div>
        <h2 className="eval-card__title">¡Guardando tus respuestas!</h2>
        <p className="eval-card__subtitle">Ya casi entramos a la plataforma… 🚀</p>
      </motion.div>
    </div>
  );
}
