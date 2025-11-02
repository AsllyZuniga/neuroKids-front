import { motion } from "framer-motion";

export function AnimatedTitle() {
  const title = "Noticias Sencillas";
  const words = title.split(" ");

  return (
    <div className="flex flex-col items-center gap-4">
      {words.map((word, wordIndex) => (
        <div key={wordIndex} className="flex gap-1">
          {word.split("").map((letter, letterIndex) => {
            const totalIndex = wordIndex === 0 ? letterIndex : words[0].length + letterIndex;
            return (
              <motion.span
                key={totalIndex}
                initial={{ y: -100, opacity: 0, rotate: -180 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  rotate: 0,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  delay: totalIndex * 0.1,
                  duration: 0.5,
                  scale: {
                    repeat: Infinity,
                    repeatDelay: 3,
                    duration: 0.5,
                    delay: totalIndex * 0.1
                  }
                }}
                className="inline-block bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-6xl text-transparent md:text-8xl"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                {letter}
              </motion.span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

