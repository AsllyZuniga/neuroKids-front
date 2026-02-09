import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;      
  total: number;       
  progress?: number;      
  showText?: boolean;     
  className?: string;    
}

export function ProgressBar({
  current,
  total,
  progress,
  showText = true,
  className = ""
}: ProgressBarProps) {

  const autoProgress = (current / total) * 100;
  const displayProgress = progress !== undefined ? progress : autoProgress;

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="h-4 bg-white/30 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${displayProgress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-green-500 rounded-full shadow-lg"
        />
      </div>

      {showText && (
        <div className="text-center text-black mt-2">
          Progreso: {displayProgress.toFixed(0)}% 
          <span className="text-gray-600 ml-1">
            ({current} de {total})
          </span>
        </div>
      )}
    </div>
  );
}