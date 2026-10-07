import { useRef, useEffect } from "react";

export function useActivityTimer(resetDeps: unknown[] = []) {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, resetDeps);

  const getElapsedSeconds = () => {
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  };

  return { getElapsedSeconds };
}
