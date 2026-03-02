/**
 * EJEMPLO DE INTEGRACIÓN DEL SISTEMA DE PROGRESO
 * 
 * Este archivo muestra cómo integrar el sistema de seguimiento de progreso
 * en cualquier actividad del sistema NeuroKids.
 * 
 * PASOS PARA INTEGRAR:
 * 1. Importar el hook useProgress
 * 2. Identificar el dbId de la actividad usando activities.ts
 * 3. Guardar progreso al iniciar, durante y al completar la actividad
 * 4. Manejar estados de carga y errores apropiadamente
 */

import React, { useState, useEffect } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { getActivityByFrontendId } from '@/config/activities';

// Ejemplo: Componente de una actividad de lectura
export const EjemploActividadLectura: React.FC = () => {
  const { saveProgress, getActivityProgress } = useProgress();
  
  // Estados de la actividad
  const [currentScore, setCurrentScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [activityCompleted, setActivityCompleted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Obtener configuración de la actividad
  const ACTIVITY_ID = 'cuento-pictogramas'; // ID definido en activities.ts
  const activityConfig = getActivityByFrontendId(ACTIVITY_ID);
  
  // Timer para tiempo transcurrido
  useEffect(() => {
    if (!startTime || activityCompleted) return;
    
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, activityCompleted]);

  /**
   * PASO 1: Iniciar la actividad - guardar estado inicial
   */
  const iniciarActividad = async () => {
    if (!activityConfig) {
      console.error('Configuración de actividad no encontrada');
      return;
    }

    const ahora = new Date();
    setStartTime(ahora);

    try {
      await saveProgress({
        activityId: activityConfig.dbId, // Usar el ID de la base de datos
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

  /**
   * PASO 2: Actualizar progreso durante la actividad
   */
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

  /**
   * PASO 3: Completar la actividad - guardar resultado final
   */
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
      
      // Aquí podrías disparar efectos adicionales como:
      // - Mostrar modal de completado
      // - Otorgar insignias
      // - Redirigir al dashboard
      
    } catch (error) {
      console.error('Error al completar actividad:', error);
    }
  };

  /**
   * PASO 4: Cargar progreso previo (opcional)
   */
  const cargarProgresoAnterior = async () => {
    if (!activityConfig) return;

    try {
      const progresoPrevio = await getActivityProgress(activityConfig.dbId);
      
      if (progresoPrevio) {
        setCurrentScore(progresoPrevio.score);
        setActivityCompleted(progresoPrevio.completed);
        
        console.log('📂 Progreso cargado:', progresoPrevio);
        
        // Si la actividad ya estaba completada, mostrar resultado
        if (progresoPrevio.completed) {
          console.log('✅ Esta actividad ya fue completada anteriormente');
        }
      }
    } catch (error) {
      console.error('Error al cargar progreso anterior:', error);
    }
  };

  // Cargar progreso al montar el componente
  useEffect(() => {
    cargarProgresoAnterior();
  }, []);

  // Simular mecánica de juego
  const responderPregunta = (esCorrecta: boolean) => {
    if (activityCompleted) return;
    
    if (esCorrecta) {
      const nuevoPuntaje = Math.min(currentScore + 10, activityConfig?.maxScore || 100);
      actualizarProgreso(nuevoPuntaje);
      
      // Si alcanza el puntaje máximo, completar automáticamente
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

/**
 * EJEMPLO DE ACTIVIDAD DE JUEGO
 * 
 * Para juegos más complejos con niveles múltiples
 */
export const EjemploActividadJuego: React.FC = () => {
  const { saveProgress } = useProgress();
  const [nivelActual, setNivelActual] = useState(1);
  const [puntajeNivel, setPuntajeNivel] = useState(0);
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  
  const ACTIVITY_ID = 'bingo-palabras';
  const activityConfig = getActivityByFrontendId(ACTIVITY_ID);

  const completarNivel = async (puntaje: number) => {
    if (!activityConfig) return;

    const nuevoTotal = puntajeTotal + puntaje;
    setPuntajeTotal(nuevoTotal);
    
    const esUltimoNivel = nivelActual >= 3; // Asumiendo 3 niveles
    
    await saveProgress({
      activityId: activityConfig.dbId,
      activityName: `${activityConfig.title} - Nivel ${nivelActual}`,
      activityType: activityConfig.type,
      ageGroup: activityConfig.ageGroup,
      level: nivelActual,
      score: nuevoTotal,
      maxScore: activityConfig.maxScore,
      completed: esUltimoNivel,
      timeSpent: 0 // Implementar timer si es necesario
    });

    if (esUltimoNivel) {
      console.log('🎮 Juego completado completamente');
    } else {
      setNivelActual(nivelActual + 1);
      setPuntajeNivel(0);
    }
  };

  // ... resto de la implementación del juego

  return (
    <div>
      <h1>{activityConfig?.title} - Nivel {nivelActual}</h1>
      {/* Implementación del juego */}
    </div>
  );
};

export default EjemploActividadLectura;