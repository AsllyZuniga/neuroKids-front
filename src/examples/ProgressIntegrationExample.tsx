
import React, { useState, useEffect } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { getActivityByFrontendId } from '@/config/activities';


export const EjemploActividadLectura: React.FC = () => {
  const { saveProgress, getActivityProgress } = useProgress();


  const [currentScore, setCurrentScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);


  const ACTIVITY_ID = 'cuento-pictogramas';
  const activityConfig = getActivityByFrontendId(ACTIVITY_ID);


  useEffect(() => {
    if (!startTime || activityCompleted) return;

    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, activityCompleted]);

  const iniciarActividad = async () => {
    if (!activityConfig) {
      console.error('Configuración de actividad no encontrada');
      return;
    }

    const ahora = new Date();
    setStartTime(ahora);

    try {
      await saveProgress({
        activityId: activityConfig.dbId,
        activityName: activityConfig.title,
        activityType: activityConfig.type,
        ageGroup: activityConfig.ageGroup,
        level: activityConfig.level,
        score: 0,
        maxScore: activityConfig.maxScore,
        completed: false,
        timeSpent: 0
      });

      console.log(`✅ Actividad iniciada: ${activityConfig.title}`);
    } catch (error) {
      console.error('Error al iniciar actividad:', error);
    }
  };


  const actualizarProgreso = async (nuevoPuntaje: number) => {
    if (!activityConfig || !startTime) return;

    setCurrentScore(nuevoPuntaje);

    try {
      await saveProgress({
        activityId: activityConfig.dbId,
        activityName: activityConfig.title,
        activityType: activityConfig.type,
        ageGroup: activityConfig.ageGroup,
        level: activityConfig.level,
        score: nuevoPuntaje,
        maxScore: activityConfig.maxScore,
        completed: false,
        timeSpent: timeSpent
      });

      console.log(`📊 Progreso actualizado: ${nuevoPuntaje}/${activityConfig.maxScore}`);
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
    }
  };


  const completarActividad = async (puntajeFinal: number) => {
    if (!activityConfig || !startTime) return;

    setActivityCompleted(true);
    setCurrentScore(puntajeFinal);

    try {
      await saveProgress({
        activityId: activityConfig.dbId,
        activityName: activityConfig.title,
        activityType: activityConfig.type,
        ageGroup: activityConfig.ageGroup,
        level: activityConfig.level,
        score: puntajeFinal,
        maxScore: activityConfig.maxScore,
        completed: true,
        timeSpent: timeSpent
      });

      console.log(`🎉 Actividad completada: ${puntajeFinal}/${activityConfig.maxScore} puntos en ${timeSpent}s`);



    } catch (error) {
      console.error('Error al completar actividad:', error);
    }
  };


  const cargarProgresoAnterior = async () => {
    if (!activityConfig) return;

    try {
      const progresoPrevio = await getActivityProgress(activityConfig.dbId);

      if (progresoPrevio) {
        setCurrentScore(progresoPrevio.score);
        setActivityCompleted(progresoPrevio.completed);

        console.log('📂 Progreso cargado:', progresoPrevio);


        if (progresoPrevio.completed) {
          console.log('✅ Esta actividad ya fue completada anteriormente');
        }
      }
    } catch (error) {
      console.error('Error al cargar progreso anterior:', error);
    }
  };


  useEffect(() => {
    cargarProgresoAnterior();
  }, []);


  const responderPregunta = (esCorrecta: boolean) => {
    if (activityCompleted) return;

    if (esCorrecta) {
      const nuevoPuntaje = Math.min(currentScore + 10, activityConfig?.maxScore || 100);
      actualizarProgreso(nuevoPuntaje);


      if (nuevoPuntaje >= (activityConfig?.maxScore || 100)) {
        completarActividad(nuevoPuntaje);
      }
    }
  };

  if (!activityConfig) {
    return <div>Error: Configuración de actividad no encontrada</div>;
  }

  return (
    <div className="ejemplo-actividad">
      <h1>{activityConfig.title}</h1>
      <div className="stats">
        <p>Puntaje: {currentScore}/{activityConfig.maxScore}</p>
        <p>Tiempo: {timeSpent}s</p>
        <p>Estado: {activityCompleted ? 'Completada' : 'En progreso'}</p>
      </div>

      {!startTime && (
        <button onClick={iniciarActividad}>
          Iniciar Actividad
        </button>
      )}

      {startTime && !activityCompleted && (
        <div className="juego">
          <h2>Pregunta de ejemplo: ¿2 + 2 = 4?</h2>
          <button onClick={() => responderPregunta(true)}>
            Sí ✓
          </button>
          <button onClick={() => responderPregunta(false)}>
            No ✗
          </button>
          <button onClick={() => completarActividad(currentScore)}>
            Terminar Actividad
          </button>
        </div>
      )}

      {activityCompleted && (
        <div className="completado">
          <h2>🎉 ¡Actividad Completada!</h2>
          <p>Puntaje final: {currentScore}/{activityConfig.maxScore}</p>
          <p>Tiempo total: {timeSpent} segundos</p>
        </div>
      )}
    </div>
  );
};


export const EjemploActividadJuego: React.FC = () => {
  const { saveProgress } = useProgress();
  const [nivelActual, setNivelActual] = useState(1);
  const [puntajeTotal, setPuntajeTotal] = useState(0);

  const ACTIVITY_ID = 'bingo-palabras';
  const activityConfig = getActivityByFrontendId(ACTIVITY_ID);

  const completarNivel = async (puntaje: number) => {
    if (!activityConfig) return;

    const nuevoTotal = puntajeTotal + puntaje;
    setPuntajeTotal(nuevoTotal);

    const esUltimoNivel = nivelActual >= 3;

    await saveProgress({
      activityId: activityConfig.dbId,
      activityName: `${activityConfig.title} - Nivel ${nivelActual}`,
      activityType: activityConfig.type,
      ageGroup: activityConfig.ageGroup,
      level: nivelActual,
      score: nuevoTotal,
      maxScore: activityConfig.maxScore,
      completed: esUltimoNivel,
      nivelCompletado: true,
      timeSpent: 0
    });

    if (esUltimoNivel) {
      console.log('🎮 Juego completado completamente');
    } else {
      setNivelActual((n) => n + 1);
    }
  };

  return (
    <div className="p-4">
      <h1>{activityConfig?.title} — Nivel {nivelActual}</h1>
      <p className="text-sm text-muted-foreground">Ejemplo de integración (solo desarrollo).</p>
      <button
        type="button"
        className="mt-2 rounded bg-violet-600 px-3 py-1 text-white"
        onClick={() => void completarNivel(10)}
      >
        Simular puntos +10 (demo)
      </button>
    </div>
  );
};

export default EjemploActividadLectura;