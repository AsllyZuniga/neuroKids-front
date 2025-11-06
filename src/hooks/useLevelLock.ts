/**
 * Hook y utilidades para el bloqueo de niveles
 */

/**
 * Hook para verificar si un nivel está bloqueado
 * @param level - Número del nivel a verificar
 * @returns true si el nivel está bloqueado, false si está desbloqueado
 */
export const useLevelLock = (level: number): boolean => {
  // Nivel 1 siempre desbloqueado
  if (level === 1) return false;

  // Niveles 2+ requieren autenticación
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  return !(token && userType);
};

/**
 * Verifica si el usuario está autenticado
 */
export const isUserAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  return !!(token && userType);
};

/**
 * Obtiene el nivel máximo desbloqueado para el usuario
 */
export const getMaxUnlockedLevel = (): number => {
  return isUserAuthenticated() ? 3 : 1;
};
