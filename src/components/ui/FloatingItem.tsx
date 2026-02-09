import { motion } from "framer-motion";
import { useMemo, type ReactNode, type CSSProperties } from "react";

interface FloatingItemProps {
  /** Contenido: emoji, texto, icono, card, etc */
  children: ReactNode;

  /** Posición inicial */
  x?: number | string;
  y?: number | string;

  /** Tamaño tailwind: text-4xl, w-12, etc */
  size?: string;

  /** Color opcional */
  color?: string;

  /** Animación */
  delay?: number;
  duration?: number;

  /** Distancia de flotado */
  floatY?: number;
  floatX?: number;

  /** Rotación */
  rotate?: boolean;

  /** Interacción */
  hover?: boolean;
  pointer?: boolean;

  /** Estilos extra */
  style?: CSSProperties;
}

export function FloatingItem({
  children,

  x = "50%",
  y = "50%",

  size = "text-5xl",
  color,

  delay = 0,
  duration = 12,

  floatY = 120,
  floatX = 40,

  rotate = true,

  hover = false,
  pointer = false,

  style,
}: FloatingItemProps) {
  const randomRotate = useMemo(() => Math.random() * 360 - 180, []);
  const randomX = useMemo(() => Math.random() * floatX - floatX / 2, []);

  return (
    <motion.div
      className={`absolute select-none ${
        pointer ? "cursor-pointer" : "pointer-events-none"
      } ${size}`}
      style={{ left: x, top: y, color, ...style }}
      initial={{ opacity: 0, scale: 0, y: 80 }}
      animate={{
        opacity: [0, 1, 1, 0.85],
        scale: [0, 1.15, 1, 0.95],
        y: [80, -floatY * 0.3, -floatY * 0.6, -floatY],
        x: [0, randomX],
        rotate: rotate ? [0, randomRotate] : [0, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
        ease: "easeInOut",
      }}
      whileHover={
        hover
          ? {
              scale: 1.3,
              rotate: [0, 10, -10, 0],
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
