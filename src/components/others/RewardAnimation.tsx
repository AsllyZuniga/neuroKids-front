import { motion } from 'framer-motion';
import { Star, Rocket, Award, Sparkles } from 'lucide-react';

interface RewardAnimationProps {
  type: 'star' | 'rocket' | 'medal' | 'confetti' | 'magic' | 'emoji' | 'points' | 'correct';
  show: boolean;
  message?: string; // <-- agregado
  onComplete?: () => void;
}

export function RewardAnimation({ type, show, message, onComplete }: RewardAnimationProps) {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'star':
        return <Star className="w-12 h-12 text-yellow-400 fill-current" />;
      case 'rocket':
        return <Rocket className="w-12 h-12 text-blue-500 fill-current" />;
      case 'medal':
        return <Award className="w-12 h-12 text-orange-500 fill-current" />;
      case 'confetti':
        return (
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="text-pink-400">
                <Sparkles className="w-6 h-6 fill-current" />
              </div>
            ))}
          </div>
        );
    }
  };

  const getColor = () => {
    switch (type) {
      case 'star': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'rocket': return 'bg-gradient-to-r from-blue-400 to-purple-600';
      case 'medal': return 'bg-gradient-to-r from-orange-400 to-red-500';
      case 'confetti': return 'bg-gradient-to-r from-pink-400 to-purple-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
    >
      <div className={`${getColor()} p-8 rounded-full shadow-2xl flex flex-col items-center`}>
        {getIcon()}
        {message && <div className="text-white text-lg mt-2 text-center">{message}</div>}
      </div>

      {/* Simple particles effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos(i * 45) * 100,
              y: Math.sin(i * 45) * 100,
            }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="absolute w-4 h-4 bg-yellow-400 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}
