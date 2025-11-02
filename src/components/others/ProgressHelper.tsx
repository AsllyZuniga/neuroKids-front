// Helper function to update progress globally (simplificada)
export const updateProgress = (type: 'game' | 'reading', points: number) => {
  console.log(`📊 Progreso actualizado: ${type} +${points} puntos`);
};

export const showCompletionReward = (type: 'game' | 'reading', points: number) => {
  console.log(`🎉 ¡${type === 'game' ? 'Juego' : 'Lectura'} completado! +${points} puntos`);
  

  updateProgress(type, points);
};


export const getLevelMultiplier = (level: number) => {
  switch (level) {
    case 1: return 1;
    case 2: return 1.5;
    case 3: return 2;
    default: return 1;
  }
};


export const getContentCount = (level: number, baseCount: number = 5) => {
  switch (level) {
    case 1: return Math.max(3, Math.floor(baseCount * 0.6));
    case 2: return baseCount;
    case 3: return Math.floor(baseCount * 1.4);
    default: return baseCount;
  }
};