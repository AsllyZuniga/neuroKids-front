import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '../ui/button';

interface AudioPlayerProps {
  text?: string;
  duration?: number;
  onPlay?: () => void;
  onEnd?: () => void;
  className?: string;
  disabled?: boolean;
  autoPlay?: boolean;
  voice?: 'child' | 'adult' | 'robot';
}

export function AudioPlayer({ 
  text = "Reproduciendo audio...", 
  duration, 
  onPlay, 
  onEnd, 
  className = "",
  disabled = false,
  voice = 'child'
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const calculateDuration = (text: string) => {
    const words = text.split(' ').length;
    const wordsPerMinute = voice === 'child' ? 100 : voice === 'adult' ? 130 : 80;
    const baseDuration = Math.max((words / wordsPerMinute) * 60000, 2000); 
    const sentences = text.split(/[.!?]/).length;
    const pauseTime = sentences * 300;
    return baseDuration + pauseTime;
  };
  
  const audioDuration = duration || calculateDuration(text);

  const handlePlay = () => {
    if (disabled) return;
    if (isPlaying) {
      setIsPlaying(false);
      setProgress(0);
    } else {
      setIsPlaying(true);
      setProgress(0);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    
    if (isPlaying) {
      if (onPlay) {
        onPlay();
      }
      
      const startTime = Date.now();
      
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min((elapsed / audioDuration) * 100, 100);
        setProgress(progressPercent);
        
        if (progressPercent >= 100) {
          setIsPlaying(false);
          setProgress(0);
          if (onEnd) {
            onEnd();
          }
        }
      }, 50);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, audioDuration]);

  const getVoiceColor = () => {
    switch (voice) {
      case 'child': return 'bg-purple-500 hover:bg-purple-600';
      case 'adult': return 'bg-blue-500 hover:bg-blue-600';
      case 'robot': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };
  
  const getVoiceLabel = () => {
    switch (voice) {
      case 'child': return '🧒 Escuchar';
      case 'adult': return '👨‍🏫 Escuchar';
      case 'robot': return '🤖 Escuchar';
      default: return '🔊 Escuchar';
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        onClick={handlePlay}
        disabled={disabled}
        className={`${getVoiceColor()} text-white flex items-center gap-2 transition-all`}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        {isPlaying ? 'Pausar' : getVoiceLabel()}
      </Button>
      
      {isPlaying && (
        <div className="flex items-center gap-2 flex-1 max-w-48">
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-75 ease-linear ${
                voice === 'child' ? 'bg-purple-500' :
                voice === 'adult' ? 'bg-blue-500' :
                'bg-green-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 min-w-fit">
            {Math.ceil((audioDuration * (100 - progress)) / 100 / 1000)}s
          </span>
        </div>
      )}
      
      {!isPlaying && text && (
        <span className="text-sm text-gray-600 max-w-48 truncate italic">
          "{text.split(' ').slice(0, 4).join(' ')}..."
        </span>
      )}
    </div>
  );
}