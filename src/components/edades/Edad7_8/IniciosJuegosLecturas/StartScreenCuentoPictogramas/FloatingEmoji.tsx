import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingEmojiProps {
  emoji: string;
  delay?: number;
}

export function FloatingEmoji({ emoji, delay = 0 }: FloatingEmojiProps) {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100
  });

  useEffect(() => {
    setPosition({
      x: Math.random() * 100,
      y: Math.random() * 100
    });
  }, []);

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        fontSize: '2rem'
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0.8],
        y: [0, -20, -40, -60],
        x: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10],
        rotate: [0, Math.random() * 360]
      }}
      transition={{
        duration: 4,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3
      }}
    >
      {emoji}
    </motion.div>
  );
}

