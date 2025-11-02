import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Target, Calendar, TrendingUp, Award, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface UserProgress {
  totalPoints: number;
  gamesCompleted: number;
  readingsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  weeklyGoal: number;
  weeklyProgress: number;
  level: number;
  experiencePoints: number;
  nextLevelXP: number;
  lastActivityDate: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ProgressTrackerProps {
  userAge: '7-8' | '9-10' | '11-12';
  onBack?: () => void;
}

export function ProgressTracker({ userAge, onBack }: ProgressTrackerProps) {
  const getInitialProgress = (): UserProgress => {
    return {
      totalPoints: 0,
      gamesCompleted: 0,
      readingsCompleted: 0,
      currentStreak: 0,
      longestStreak: 0,
      achievements: [],
      weeklyGoal: userAge === '7-8' ? 5 : userAge === '9-10' ? 7 : 10,
      weeklyProgress: 0,
      level: 1,
      experiencePoints: 0,
      nextLevelXP: 100,
      lastActivityDate: new Date().toISOString().split('T')[0]
    };
  };

  const [progress, setProgress] = useState<UserProgress>(getInitialProgress);

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`neurokids-progress-${userAge}`);
      if (saved) {
        try {
          setProgress(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading progress:', error);
          setProgress(getInitialProgress());
        }
      }
    }
  }, [userAge]);

  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'goals'>('overview');

 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`neurokids-progress-${userAge}`, JSON.stringify(progress));
    }
  }, [progress, userAge]);

  // Función para actualizar progreso (se llamará desde otros componentes)
  const updateProgress = (type: 'game' | 'reading', points: number) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      

      newProgress.totalPoints += points;
      newProgress.experiencePoints += points;
      
  
      if (type === 'game') {
        newProgress.gamesCompleted += 1;
      } else {
        newProgress.readingsCompleted += 1;
      }
      
     
      newProgress.weeklyProgress += 1;
      

      const today = new Date().toISOString().split('T')[0];
      const lastDate = new Date(newProgress.lastActivityDate);
      const todayDate = new Date(today);
      const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        newProgress.currentStreak += 1;
      } else if (daysDiff === 0) {
      // Mismo día, no cambiar racha
      } else {
        newProgress.currentStreak = 1;// Reiniciar racha
      }
      
      if (newProgress.currentStreak > newProgress.longestStreak) {
        newProgress.longestStreak = newProgress.currentStreak;
      }
      
      newProgress.lastActivityDate = today;
      
         while (newProgress.experiencePoints >= newProgress.nextLevelXP) {
        newProgress.experiencePoints -= newProgress.nextLevelXP;
        newProgress.level += 1;
        newProgress.nextLevelXP = Math.floor(newProgress.nextLevelXP * 1.5); // Incremento exponencial
        
       
        const levelAchievement: Achievement = {
          id: `level-${newProgress.level}`,
          name: `Nivel ${newProgress.level}`,
          description: `¡Has alcanzado el nivel ${newProgress.level}!`,
          icon: '⭐',
          unlockedAt: new Date().toISOString(),
          points: newProgress.level * 50,
          rarity: newProgress.level <= 3 ? 'common' : newProgress.level <= 7 ? 'rare' : newProgress.level <= 15 ? 'epic' : 'legendary'
        };
        
        newProgress.achievements.push(levelAchievement);
      }
      

      checkAchievements(newProgress);
      
      return newProgress;
    });
  };

  const checkAchievements = (currentProgress: UserProgress) => {
    const newAchievements: Achievement[] = [];
    

    if (currentProgress.gamesCompleted === 1 && !currentProgress.achievements.find(a => a.id === 'first-game')) {
      newAchievements.push({
        id: 'first-game',
        name: 'Primer Juego',
        description: 'Completaste tu primer juego',
        icon: '🎮',
        unlockedAt: new Date().toISOString(),
        points: 25,
        rarity: 'common'
      });
    }
    
    if (currentProgress.readingsCompleted === 1 && !currentProgress.achievements.find(a => a.id === 'first-reading')) {
      newAchievements.push({
        id: 'first-reading',
        name: 'Primera Lectura',
        description: 'Completaste tu primera lectura',
        icon: '📖',
        unlockedAt: new Date().toISOString(),
        points: 25,
        rarity: 'common'
      });
    }
    
    if (currentProgress.currentStreak >= 7 && !currentProgress.achievements.find(a => a.id === 'week-streak')) {
      newAchievements.push({
        id: 'week-streak',
        name: 'Racha Semanal',
        description: 'Mantuviste una racha de 7 días',
        icon: '🔥',
        unlockedAt: new Date().toISOString(),
        points: 100,
        rarity: 'rare'
      });
    }
    
   
    if (currentProgress.gamesCompleted >= 10 && !currentProgress.achievements.find(a => a.id === 'game-master')) {
      newAchievements.push({
        id: 'game-master',
        name: 'Maestro de Juegos',
        description: 'Completaste 10 juegos',
        icon: '🏆',
        unlockedAt: new Date().toISOString(),
        points: 150,
        rarity: 'epic'
      });
    }
    
    if (currentProgress.readingsCompleted >= 10 && !currentProgress.achievements.find(a => a.id === 'reading-champion')) {
      newAchievements.push({
        id: 'reading-champion',
        name: 'Campeón de Lectura',
        description: 'Completaste 10 lecturas',
        icon: '📚',
        unlockedAt: new Date().toISOString(),
        points: 150,
        rarity: 'epic'
      });
    }
    

    if (newAchievements.length > 0) {
      currentProgress.achievements.push(...newAchievements);
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const getRarityBorderColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
    }
  };

  const getProgressColor = () => {
    if (userAge === '7-8') return 'bg-purple-500';
    if (userAge === '9-10') return 'bg-green-500';
    return 'bg-blue-500';
  };


  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button 
                onClick={onBack}
                variant="outline"
                className="bg-white/80 backdrop-blur-sm border-2 hover:bg-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            )}
            <h1 className="text-3xl font-bold text-gray-800">Mi Progreso</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">{progress.totalPoints} puntos</span>
            </div>
            
            <Badge variant="outline" className="bg-purple-100">
              Nivel {progress.level}
            </Badge>
          </div>
        </div>

 
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Resumen', icon: TrendingUp },
            { id: 'achievements', label: 'Logros', icon: Award },
            { id: 'goals', label: 'Objetivos', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedTab === tab.id
                  ? 'bg-white shadow-md text-purple-700 border-2 border-purple-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

      
        {selectedTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
         
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Progreso de Nivel
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Nivel {progress.level}</span>
                      <span className="text-sm text-gray-500">
                        {progress.experiencePoints} / {progress.nextLevelXP} XP
                      </span>
                    </div>
                    
                    <Progress 
                      value={(progress.experiencePoints / progress.nextLevelXP) * 100}
                      className="h-3"
                    />
                    
                    <p className="text-sm text-gray-600">
                      Faltan {progress.nextLevelXP - progress.experiencePoints} puntos para el siguiente nivel
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {progress.gamesCompleted}
                    </div>
                    <p className="text-gray-600">Juegos Completados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {progress.readingsCompleted}
                    </div>
                    <p className="text-gray-600">Lecturas Completadas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {progress.currentStreak}
                    </div>
                    <p className="text-gray-600">Racha Actual (días)</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {progress.longestStreak}
                    </div>
                    <p className="text-gray-600">Racha Más Larga</p>
                  </CardContent>
                </Card>
              </div>
            </div>

    
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Logros Recientes
                  </h3>
                  
                  <div className="space-y-3">
                    {progress.achievements
                      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
                      .slice(0, 5)
                      .map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg border-2 ${getRarityColor(achievement.rarity)}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{achievement.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{achievement.name}</p>
                              <p className="text-xs opacity-70">{achievement.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              +{achievement.points}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    
                    {progress.achievements.length === 0 && (
                      <p className="text-gray-500 text-center py-4">
                        ¡Completa actividades para ganar tus primeros logros!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === 'achievements' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progress.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-2 ${getRarityBorderColor(achievement.rarity)}`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="font-semibold mb-2">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      <span className="text-sm font-medium">+{achievement.points} pts</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {progress.achievements.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">Sin logros aún</h3>
                <p className="text-gray-400">¡Completa juegos y lecturas para ganar logros increíbles!</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'goals' && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objetivo Semanal
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Actividades esta semana</span>
                      <span className="text-sm text-gray-500">
                        {progress.weeklyProgress} / {progress.weeklyGoal}
                      </span>
                    </div>
                    
                    <Progress 
                      value={(progress.weeklyProgress / progress.weeklyGoal) * 100}
                      className="h-4"
                    />
                    
                    {progress.weeklyProgress >= progress.weeklyGoal ? (
                      <p className="text-green-600 text-sm mt-2 flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        ¡Objetivo cumplido esta semana!
                      </p>
                    ) : (
                      <p className="text-gray-600 text-sm mt-2">
                        Faltan {progress.weeklyGoal - progress.weeklyProgress} actividades para cumplir tu objetivo
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                      <h4 className="font-semibold text-purple-700 mb-2">📈 Progreso Total</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {progress.gamesCompleted + progress.readingsCompleted}
                      </p>
                      <p className="text-sm text-purple-600">Actividades completadas</p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                      <h4 className="font-semibold text-orange-700 mb-2">🔥 Motivación</h4>
                      <p className="text-2xl font-bold text-orange-600">
                        {progress.currentStreak}
                      </p>
                      <p className="text-sm text-orange-600">Días consecutivos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}