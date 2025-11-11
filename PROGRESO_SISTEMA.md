# Sistema de Progreso - NeuroKids

## 📋 Descripción

El sistema de progreso permite guardar y recuperar el avance de los estudiantes en juegos y lecturas. Los datos se guardan tanto en el backend como en localStorage como respaldo.

## 🚀 Uso en Juegos y Lecturas

### 1. Importar el hook

```typescript
import { useProgress } from '../../../hooks/useProgress';
```

### 2. Inicializar el hook en el componente

```typescript
export function MiJuego({ onBack }: { onBack: () => void }) {
  const { saveProgress } = useProgress();
  
  // ... resto del código
}
```

### 3. Guardar progreso al completar un nivel

```typescript
const handleLevelComplete = async () => {
  await saveProgress({
    activityId: 'bingo-palabras',           // ID único de la actividad
    activityName: 'Bingo de Palabras',      // Nombre legible
    activityType: 'juego',                  // 'juego' o 'lectura'
    ageGroup: '7-8',                        // '7-8', '9-10', o '11-12'
    level: currentLevel,                     // Nivel actual (1, 2, 3, etc.)
    score: score,                            // Puntuación obtenida
    maxScore: 100,                           // Puntuación máxima posible
    completed: true,                         // Si completó el nivel
    timeSpent: 120                           // Tiempo en segundos (opcional)
  });
};
```

## 📊 IDs de Actividades por Grupo de Edad

### Grupo 7-8 años
- **Lecturas:**
  - `primera-palabra` - Mi Primera Palabra
  - `cuento-pictogramas` - Cuento con Pictogramas
  - `frases-magicas` - Frases Mágicas

- **Juegos:**
  - `bingo-palabras` - Bingo de Palabras
  - `caza-silaba` - Caza la Sílaba
  - `escucha-elige` - Escucha y Elige

### Grupo 9-10 años
- **Lecturas:**
  - `mini-aventuras` - Mini Aventuras
  - `historias-interactivas` - Historias Interactivas
  - `revista-infantil` - Revista Infantil

- **Juegos:**
  - `laberinto-lector` - Laberinto Lector
  - `ordena-historia` - Ordena la Historia
  - `construye-frase` - Construye la Frase

### Grupo 11-12 años
- **Lecturas:**
  - `biografias-sencillas` - Biografías Sencillas
  - `cuento-interactivo` - Cuento Interactivo
  - `noticias-sencillas` - Noticias Sencillas

- **Juegos:**
  - `cohete-lector` - Cohete Lector
  - `detective-palabras` - Detective de Palabras
  - `preguntas-inferenciales` - Preguntas Inferenciales

## 💡 Ejemplos de Implementación

### Ejemplo 1: Guardar al completar todo el juego

```typescript
const handleGameComplete = async () => {
  // Mostrar animación de recompensa
  setShowReward(true);
  
  // Guardar progreso
  await saveProgress({
    activityId: 'ordena-historia',
    activityName: 'Ordena la Historia',
    activityType: 'juego',
    ageGroup: '9-10',
    level: currentLevel,
    score: score,
    maxScore: 300, // 100 puntos por nivel
    completed: true,
    timeSpent: timeElapsed
  });
  
  // Continuar con la lógica del juego
  setShowLevelComplete(true);
};
```

### Ejemplo 2: Guardar progreso parcial (sin completar)

```typescript
const handleLevelFail = async () => {
  // Guardar intento aunque no haya completado
  await saveProgress({
    activityId: 'detective-palabras',
    activityName: 'Detective de Palabras',
    activityType: 'juego',
    ageGroup: '11-12',
    level: currentLevel,
    score: currentScore,
    maxScore: 100,
    completed: false,  // No completado
    timeSpent: timeElapsed
  });
  
  // Mostrar mensaje de ánimo
  setShowMotivational(true);
};
```

### Ejemplo 3: Verificar si ya completó la actividad

```typescript
const { isActivityCompleted, getActivityProgress } = useProgress();

useEffect(() => {
  const checkProgress = async () => {
    const isCompleted = await isActivityCompleted('cohete-lector');
    
    if (isCompleted) {
      // Mostrar insignia o mensaje especial
      setShowCompletedBadge(true);
    }
    
    // O obtener información detallada
    const progress = await getActivityProgress('cohete-lector');
    if (progress) {
      console.log(`Mejor puntuación: ${progress.score}`);
      console.log(`Intentos: ${progress.attempts}`);
    }
  };
  
  checkProgress();
}, []);
```

## 🎯 Puntuación Recomendada

- **Nivel 1 (Básico)**: 50-100 puntos
- **Nivel 2 (Intermedio)**: 75-150 puntos
- **Nivel 3 (Avanzado)**: 100-200 puntos

## 📱 Características del Sistema

✅ **Guardado automático** en localStorage como respaldo
✅ **Sincronización** con backend cuando hay conexión
✅ **Seguimiento de intentos** - cuenta cuántas veces intenta cada actividad
✅ **Marca de completado** - aparece ✓ verde en el mapa
✅ **Estadísticas globales** - total de puntos, juegos y lecturas completadas
✅ **Persistencia** - los datos se mantienen aunque cierre sesión

## 🔧 Funciones Disponibles

### `saveProgress(params)`
Guarda el progreso de una actividad.

### `getActivityProgress(activityId)`
Obtiene el progreso de una actividad específica.

### `isActivityCompleted(activityId)`
Verifica si una actividad está completada.

### `getStudentProgress()`
Obtiene todo el progreso del estudiante.

## 📝 Notas Importantes

1. **Llamar saveProgress** al finalizar cada nivel o al salir del juego
2. **Usar el activityId correcto** según la tabla de IDs
3. **El completed** debe ser `true` solo cuando realmente completó el nivel
4. **El timeSpent** es opcional pero recomendado para estadísticas
5. **Los datos persisten** incluso si hay error en el backend

## 🐛 Debugging

Para ver el progreso guardado en la consola del navegador:

```javascript
// Ver progreso completo
const progress = await progressService.getStudentProgress();
console.log(progress);

// Ver localStorage
console.log(localStorage.getItem('neurokids-progress-1')); // 1 es el ID del estudiante
```
