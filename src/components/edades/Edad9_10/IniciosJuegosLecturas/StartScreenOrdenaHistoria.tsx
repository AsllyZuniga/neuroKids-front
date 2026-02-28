import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingItem } from "@/components/ui/FloatingItem";
import fondo from "@/assets/9_10/ordena_historia/fondo.svg";

interface StartScreenOrdenaHistoriaProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenOrdenaHistoria({ onStart, onBack }: StartScreenOrdenaHistoriaProps) {
  const title1 = "Ordena ";
  const title2 = "la Historia";
  const letters1 = title1.split('');
  const letters2 = title2.split('');


  return (
    <div className="min-h-screen overflow-hidden relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${fondo})` }}>

      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>


      {['📖', '📝', '✨', '⭐'].map((item, index) => (
        <FloatingItem
          key={index}
          x={`${Math.random() * 100}%`}
          y={`${Math.random() * 80}%`}
          delay={index * 0.3}
          duration={10 + Math.random() * 4}
          size="text-3xl md:text-4xl"
          floatY={140}
          floatX={60}
          rotate
        >
          {item}
        </FloatingItem>
      ))}



      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="mb-8 text-center">
          <div className="mb-10 text-center">
            <div className="flex flex-col items-center gap-2">
              {/* LINEA 1 */}
              <div className="flex justify-center gap-2">
                {letters1.map((letter, index) => (
                  <motion.span
                    key={index}
                    className="inline-block text-5xl md:text-7xl lg:text-8xl  text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dyslexia-friendly"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.15)" }}
                    initial={{ opacity: 0, y: -40, rotate: -10 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.08,
                      type: "spring",
                      bounce: 0.4,
                    }}
                    whileHover={{
                      scale: 1.2,
                      rotate: 5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* LINEA 2 */}
              <div className="flex justify-center gap-2">
                {letters2.map((letter, index) => (
                  <motion.span
                    key={index}
                    className="inline-block text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 dyslexia-friendly"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.15)" }}
                    initial={{ opacity: 0, y: -40, rotate: -10 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.08 + letters1.length * 0.08,
                      type: "spring",
                      bounce: 0.4,
                    }}
                    whileHover={{
                      scale: 1.2,
                      rotate: 5,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {letter === " " ? "\u00A0" : letter}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>


        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="px-12 py-6 text-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-2xl rounded-full border-4 border-white dyslexia-friendly"
          >
            <Play className="w-8 h-8 mr-3 fill-white" />
            ¡Comenzar a Jugar!
          </Button>
        </motion.div>

      </div>
    </div>
  );
}

