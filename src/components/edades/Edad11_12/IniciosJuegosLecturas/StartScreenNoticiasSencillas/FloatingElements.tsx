import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

interface FloatingItem {
  emoji: string;
  size: string;
  initialX: string;
  initialY: string;
  duration: number;
  delay: number;
}

interface NewsCard {
  title: string;
  emoji: string;
  initialX: string;
  initialY: string;
  duration: number;
  delay: number;
}

export function FloatingElements() {
  const floatingItems: FloatingItem[] = [
    { emoji: "📰", size: "text-6xl", initialX: "10%", initialY: "20%", duration: 10, delay: 0 },
    { emoji: "📺", size: "text-5xl", initialX: "85%", initialY: "15%", duration: 12, delay: 1 },
    { emoji: "🎤", size: "text-5xl", initialX: "15%", initialY: "70%", duration: 9, delay: 2 },
    { emoji: "📻", size: "text-5xl", initialX: "88%", initialY: "75%", duration: 11, delay: 0.5 },
    { emoji: "🎥", size: "text-6xl", initialX: "50%", initialY: "8%", duration: 13, delay: 1.5 },
    { emoji: "📸", size: "text-5xl", initialX: "25%", initialY: "40%", duration: 10, delay: 0.8 },
    { emoji: "🎬", size: "text-5xl", initialX: "70%", initialY: "50%", duration: 11, delay: 2 },
    { emoji: "📡", size: "text-4xl", initialX: "40%", initialY: "82%", duration: 14, delay: 1.2 },
    { emoji: "🗞️", size: "text-5xl", initialX: "5%", initialY: "50%", duration: 12, delay: 0 },
    { emoji: "📱", size: "text-5xl", initialX: "92%", initialY: "40%", duration: 10, delay: 1 },
    { emoji: "💻", size: "text-5xl", initialX: "60%", initialY: "85%", duration: 13, delay: 0.5 },
    { emoji: "👨‍💼", size: "text-5xl", initialX: "20%", initialY: "60%", duration: 11, delay: 1.8 },
    { emoji: "👩‍💼", size: "text-5xl", initialX: "78%", initialY: "28%", duration: 10, delay: 0.3 },
    { emoji: "🌍", size: "text-6xl", initialX: "35%", initialY: "25%", duration: 15, delay: 2.5 },
    { emoji: "🔔", size: "text-4xl", initialX: "65%", initialY: "65%", duration: 8, delay: 1.7 },
    { emoji: "✉️", size: "text-4xl", initialX: "45%", initialY: "5%", duration: 9, delay: 0 },
    { emoji: "📢", size: "text-5xl", initialX: "12%", initialY: "85%", duration: 10, delay: 2 },
    { emoji: "🎙️", size: "text-5xl", initialX: "82%", initialY: "55%", duration: 11, delay: 1.3 },
  ];

  const newsCards: NewsCard[] = [
    { title: "El gatito rescatado", emoji: "🐱", initialX: "8%", initialY: "35%", duration: 12, delay: 0.5 },
    { title: "Nueva bici en el parque", emoji: "🚲", initialX: "75%", initialY: "20%", duration: 13, delay: 1.5 },
    { title: "Día soleado hoy", emoji: "☀️", initialX: "28%", initialY: "75%", duration: 11, delay: 2.2 },
    { title: "Fiesta en la escuela", emoji: "🎉", initialX: "85%", initialY: "68%", duration: 14, delay: 0.8 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0">
      {floatingItems.map((item, index) => (
        <motion.div
          key={`emoji-${index}`}
          className={`absolute ${item.size}`}
          style={{
            left: item.initialX,
            top: item.initialY,
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 20, 0, -20, 0],
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.1, 1, 0.9, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {newsCards.map((card, index) => (
        <motion.div
          key={`news-${index}`}
          className="absolute"
          style={{
            left: card.initialX,
            top: card.initialY,
          }}
          animate={{
            y: [0, -20, 0, 20, 0],
            x: [0, 15, 0, -15, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: card.duration,
            repeat: Infinity,
            delay: card.delay,
            ease: "easeInOut",
          }}
        >
          <div className="rounded-lg bg-white/80 p-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-purple-600">Noticia</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl">{card.emoji}</span>
              <p className="text-xs text-gray-700">{card.title}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

