import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showStars?: boolean;
  className?: string;
}

export function ProgressBar({ current, total, label, showStars = true, className = '' }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">{label}</span>
          <span className="text-blue-600">{current}/{total}</span>
        </div>
      )}
      
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full shadow-sm transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
        
        {showStars && (
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(5)].map((_, i) => {
              const starFilled = (i + 1) <= (current / total) * 5;
              return (
                <div
                  key={i}
                  className="mx-1 transition-all duration-500"
                  style={{
                    transform: starFilled ? 'scale(1) rotate(0deg)' : 'scale(0.7) rotate(-180deg)',
                    transitionDelay: `${i * 100}ms`
                  }}
                >
                  <Star 
                    className={`w-4 h-4 ${
                      starFilled 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-400'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="text-center mt-2">
        <span className="text-sm text-gray-600">
          {Math.round(percentage)}% completado
        </span>
      </div>
    </div>
  );
}