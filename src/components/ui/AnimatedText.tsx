import { motion } from "framer-motion";
import clsx from "clsx";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  hoverScale?: number;
  loop?: boolean;
  mode?: "letters" | "words";
  color?: string;
}

export function AnimatedText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  hoverScale = 1.2,
  loop = true,
  mode = "letters",
}: AnimatedTextProps) {
  const items =
    mode === "words" ? text.split(" ") : text.split("");

  return (
    <motion.div
      className={clsx("flex flex-wrap justify-center gap-x-2 gap-y-2", className)}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          className="inline-block cursor-pointer"
          variants={{
            hidden: { opacity: 0, y: -50, rotate: -20 },
            visible: {
              opacity: 1,
              y: 0,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 18,
              },
            },
          }}
          whileHover={{
            scale: hoverScale,
            rotate: [-5, 5, -5, 0],
          }}
          animate={
            loop
              ? {
                  scale: [1, 1.08, 1],
                }
              : undefined
          }
          transition={
            loop
              ? {
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * stagger + 1,
                  },
                }
              : undefined
          }
        >
          {item === " " ? "\u00A0" : item}
        </motion.span>
      ))}
    </motion.div>
  );
}
