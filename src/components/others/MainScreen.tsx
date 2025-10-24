import { motion } from "framer-motion";
import { Button } from '../ui/button';

interface MainScreenProps {
  onAgeSelect: (age: "9-10") => void;
  onLogin: () => void;
}

export function MainScreen({ onAgeSelect, onLogin }: MainScreenProps) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #F0E68C 100%)",
      }}
    >
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🧠</span>
            </div>
            <span className="text-teal-800 text-lg font-semibold">
              Neurokids
            </span>
          </div>

          <Button
            onClick={onLogin}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full"
          >
            Iniciar sesión
          </Button>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl opacity-80">🌈</div>
        <div className="absolute top-20 right-20 text-4xl opacity-70">☁️</div>
        <div className="absolute top-40 left-1/4 text-4xl opacity-70">☁️</div>
        <div className="absolute top-60 right-1/3 text-4xl opacity-70">☁️</div>
        <div className="absolute bottom-40 left-20 text-6xl opacity-80">🚀</div>

        {/* Decorative blocks */}
        <div className="absolute bottom-0 left-20">
          <div className="flex items-end">
            <div className="w-16 h-12 bg-orange-400 rounded-t-lg"></div>
            <div className="w-16 h-20 bg-green-400 rounded-t-lg"></div>
            <div className="w-16 h-16 bg-teal-500 rounded-t-lg"></div>
            <div className="w-16 h-24 bg-purple-400 rounded-t-lg relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl">
                🐅
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl md:text-8xl mb-4 tracking-wider dyslexia-friendly font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            NEUROKIDS
          </h1>
          <div className="flex justify-center gap-4 text-3xl">
            <span>✏️</span>
            <span>📚</span>
            <span>🎮</span>
          </div>
        </motion.div>

        {/* Only 9-10 years option */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => onAgeSelect("9-10")}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-xl border-4 border-white/30 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-xl"
          >
            <div className="text-5xl">🎯</div>
            <div>9 - 10 años</div>
          </Button>
        </motion.div>

        {/* Mascota */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-20 right-20 text-6xl"
        >
          <div>👧</div>
        </motion.div>
      </div>
    </div>
  );
}
