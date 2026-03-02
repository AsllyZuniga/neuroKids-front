# Sistema de Seguimiento de Progreso - NeuroKids

## 📋 Resumen

Este sistema proporciona un seguimiento completo del progreso de los estudiantes a través de todas las actividades de NeuroKids, integrándose directamente con la base de datos para persistir y recuperar datos de progreso en tiempo real.

## 🏗️ Arquitectura

### Componentes Principales

1. **`activities.ts`** - Configuración centralizada de actividades
2. **`progressService.ts`** - Servicio de API para comunicación con backend
3. **`useProgress.ts`** - Hook React para manejo de progreso
4. **`studentWelcome.tsx`** - Dashboard principal con tracking automático
5. **`ProgressIntegrationExample.tsx`** - Ejemplos de implementación

### Flujo de Datos

```
[Actividad Individual] → [useProgress Hook] → [progressService] → [Backend API] → [Base de Datos]
```

## 🎮 Mapeo de Actividades

### Base de Datos IDs (1-18)

| ID  | Actividad               | Tipo    | Grupo | Componente             |
| --- | ----------------------- | ------- | ----- | ---------------------- |
| 1   | Cuento con Pictogramas  | Lectura | 7-8   | CuentoPictogramas      |
| 2   | Frases Mágicas          | Lectura | 7-8   | FrasesMagicas          |
| 3   | Mi Primera Palabra      | Lectura | 7-8   | PrimeraPalabra         |
| 4   | Historias Interactivas  | Lectura | 9-10  | HistoriasInteractivas  |
| 5   | Mini Aventuras          | Lectura | 9-10  | MiniAventuras          |
| 6   | Revista Infantil        | Lectura | 9-10  | RevistaInfantil        |
| 7   | Biografías Sencillas    | Lectura | 11-12 | BiografiasSencillas    |
| 8   | Cuento Interactivo      | Lectura | 11-12 | CuentoInteractivo      |
| 9   | Noticias Sencillas      | Lectura | 11-12 | NoticiasSencillas      |
| 10  | Bingo de Palabras       | Juego   | 7-8   | BingoPalabras          |
| 11  | Caza la Sílaba          | Juego   | 7-8   | CazaSilaba             |
| 12  | Escucha y Elige         | Juego   | 7-8   | EscuchaElige           |
| 13  | Construye la Frase      | Juego   | 9-10  | ConstruyeFrase         |
| 14  | Laberinto Lector        | Juego   | 9-10  | LaberintoLector        |
| 15  | Ordena la Historia      | Juego   | 9-10  | OrdenaHistoria         |
| 16  | Cohete Lector           | Juego   | 11-12 | CoheteLector           |
| 17  | Detective de Palabras   | Juego   | 11-12 | DetectivePalabras      |
| 18  | Preguntas Inferenciales | Juego   | 11-12 | PreguntasInferenciales |

## 🚀 Implementación

### 1. Configuración Básica

```typescript
import { useProgress } from "@/hooks/useProgress";
import { getActivityByFrontendId } from "@/config/activities";

const { saveProgress, getActivityProgress } = useProgress();
const activityConfig = getActivityByFrontendId("cuento-pictogramas");
```

### 2. Iniciar Actividad

```typescript
const iniciarActividad = async () => {
  await saveProgress({
    activityId: activityConfig.dbId, // ID de base de datos
    activityName: activityConfig.title,
    activityType: activityConfig.type,
    ageGroup: activityConfig.ageGroup,
    level: activityConfig.level,
    score: 0,
    maxScore: activityConfig.maxScore,
    completed: false,
    timeSpent: 0,
  });
};
```

### 3. Actualizar Progreso

```typescript
const actualizarProgreso = async (nuevoPuntaje: number) => {
  await saveProgress({
    activityId: activityConfig.dbId,
    activityName: activityConfig.title,
    activityType: activityConfig.type,
    ageGroup: activityConfig.ageGroup,
    level: activityConfig.level,
    score: nuevoPuntaje,
    maxScore: activityConfig.maxScore,
    completed: false,
    timeSpent: tiempoTranscurrido,
  });
};
```

### 4. Completar Actividad

```typescript
const completarActividad = async (puntajeFinal: number) => {
  await saveProgress({
    activityId: activityConfig.dbId,
    activityName: activityConfig.title,
    activityType: activityConfig.type,
    ageGroup: activityConfig.ageGroup,
    level: activityConfig.level,
    score: puntajeFinal,
    maxScore: activityConfig.maxScore,
    completed: true, // ✅ Marcar como completada
    timeSpent: tiempoTotal,
  });
};
```

### 5. Cargar Progreso Anterior

```typescript
const cargarProgreso = async () => {
  const progreso = await getActivityProgress(activityConfig.dbId);
  if (progreso) {
    console.log("Progreso anterior:", progreso);
    // Restaurar estado de la actividad
  }
};
```

## 🔧 API Endpoints

### Backend Integration

```typescript
// Configuración en api.ts
const API_CONFIG = {
  PROGRESS_SAVE: "/progreso-actividades",
  PROGRESS_STUDENT: "/progreso-actividades/estudiante",
  PROGRESS_ACTIVITY: "/progreso-actividades/actividad",
};
```

### Estructura de Datos

```typescript
interface ActivityProgress {
  id?: number;
  activityId: number; // ID de la base de datos (1-18)
  activityName: string;
  activityType: "lectura" | "juego";
  ageGroup: "7-8" | "9-10" | "11-12";
  level: number;
  score: number;
  maxScore: number;
  completed: boolean;
  timeSpent?: number;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## 📊 Características del Sistema

### ✅ Funcionalidades Implementadas

- **Tracking Automático**: Seguimiento automático desde el dashboard principal
- **Persistencia Real**: Datos guardados en base de datos PostgreSQL
- **Estados de Actividad**: Iniciada, en progreso, completada
- **Métricas Detalladas**: Puntaje, tiempo, nivel, grupo de edad
- **Recuperación de Estado**: Cargar progreso anterior automáticamente
- **Configuración Centralizada**: Todas las actividades en un solo archivo
- **TypeScript Completo**: Tipado fuerte en toda la aplicación
- **Fallback Local**: soporte para localStorage como respaldo
- **Error Handling**: Manejo robusto de errores de red

### 🔄 Flujo de Usuario

1. **Estudiante entra al dashboard** → Sistema carga progreso previo
2. **Estudiante hace clic en actividad** → Sistema registra inicio automáticamente
3. **Durante la actividad** → Progreso se actualiza incrementalmente
4. **Al completar** → Sistema marca como completada y guarda resultado final
5. **Próxima visita** → Dashboard muestra actividades completadas

## 🛣️ Rutas de Navegación

Cada actividad tiene una ruta específica definida en la configuración:

```typescript
const routeMap = {
  "cuento-pictogramas": "/nivel1/lectura1",
  "bingo-palabras": "/nivel1/juego1",
  "cohete-lector": "/nivel3/juego1",
  // ... etc
};
```

## 🎯 Beneficios

### Para Desarrolladores

- **Integración Simple**: Un solo hook para todo el progreso
- **Configuración Clara**: Archivo centralizado fácil de mantener
- **Ejemplos Completos**: Documentación con código funcional
- **TypeScript**: Autocompletado y validación de tipos

### Para Educadores

- **Visibilidad Completa**: Seguimiento detallado de cada estudiante
- **Métricas Útiles**: Tiempo gastado, puntajes, actividades completadas
- **Progreso Persistente**: Datos nunca se pierden
- **Agrupación por Edad**: Actividades organizadas por grupos etarios

### Para Estudiantes

- **Experiencia Continua**: Progreso se mantiene entre sesiones
- **Feedback Visual**: Dashboard muestra claramente qué está completado
- **Sin Duplicación**: Sistema evita repetir actividades completadas
- **Motivación**: Ver progreso acumulado aumenta engagement

## 🔮 Próximos Pasos

- [ ] Implementar sistema de insignias basado en progreso
- [ ] Añadir análisis de rendimiento por estudiante
- [ ] Crear reportes para educadores
- [ ] Implementar modo offline con sincronización
- [ ] Añadir sistema de recompensas gamificado
- [ ] Integrar con sistema de notificaciones push

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de red**: Sistema usa localStorage como fallback
2. **Actividad no encontrada**: Verificar configuración en `activities.ts`
3. **Progreso no se guarda**: Revisar API endpoints en `api.ts`
4. **TypeScript errors**: Verificar interfaces en `progressService.ts`

### Debugging

```typescript
// Habilitar logs detallados
localStorage.setItem("neurokids_debug", "true");

// Ver estado actual del progreso
console.log(await getStudentProgress());

// Verificar configuración de actividad
console.log(getActivityByFrontendId("actividad-id"));
```

---

**Desarrollado para NeuroKids**
_Sistema educativo de lectoescritura para niños de 7-12 años_
