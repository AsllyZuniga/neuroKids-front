import { useRef, useEffect } from "react";

/**
 * Hook para medir el tiempo dentro de una actividad (juego o lectura).
 * No se muestra al usuario - solo se usa para reportes docente/admin.
 * Reinicia automáticamente cuando cambia el nivel o la dependencia.
 */
export function useActivityTimer(resetDeps: unknown[] = []) {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, resetDeps);

  /** Devuelve segundos transcurridos desde el último reset */
  const getElapsedSeconds = () => {
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  };

  return { getElapsedSeconds };
}
