import { Star, Award, Rocket } from 'lucide-react';
import { Badge } from '../ui/badge';

interface AvatarProps {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  badges: Array<'star' | 'rocket' | 'medal'>;
  className?: string;
}

export function Avatar({ name, level, xp, maxXp, badges, className = '' }: AvatarProps) {
  const xpPercentage = (xp / maxXp) * 100;
  
  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'star': return <Star className="w-4 h-4 text-yellow-500 fill-current" />;
      case 'rocket': return <Rocket className="w-4 h-4 text-blue-500 fill-current" />;
      case 'medal': return <Award className="w-4 h-4 text-orange-500 fill-current" />;
      default: return null;
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-lg border-2 border-blue-200 ${className}`}>
      <div className="flex items-center gap-4">
  
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl hover:scale-105 transition-transform">
            👤
          </div>
          
   
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {level}
          </div>
        </div>
        

        <div className="flex-1">
          <h3 className="text-lg text-gray-800 mb-1 font-semibold">{name}</h3>
          

          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>XP</span>
              <span>{xp}/{maxXp}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
          
   
          <div className="flex gap-1 flex-wrap">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="transition-all duration-500"
                style={{
                  transform: 'scale(1) rotate(0deg)',
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <Badge 
                  variant="secondary" 
                  className="p-1 bg-gradient-to-r from-yellow-100 to-orange-100"
                >
                  {getBadgeIcon(badge)}
                </Badge>
              </div>
            ))}
            <Badge variant="outline" className="text-xs px-2">
              +{badges.length}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}