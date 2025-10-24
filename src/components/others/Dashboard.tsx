import { motion } from 'framer-motion';
import { ArrowLeft, GamepadIcon, Filter, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar } from './Avatar';
import { ProgressBar } from './ProgressBar';
import { AnimalGuide } from './AnimalGuide';

interface DashboardProps {
  age: '7-8';
  onBack: () => void;
  onActivitySelect: (type: 'game', activity: string) => void;
  onProgressView: () => void;
  filter: 'all' | 'games';
  onFilterChange: (filter: 'all' | 'games') => void;
}

const ageData = {
  '7-8': {
    color: 'purple',
    games: [
      { id: 'caza-silaba', name: 'Caza la Sílaba', icon: '🔍', description: 'Arrastra la imagen a la sílaba correcta' },
      { id: 'escucha-elige', name: 'Escucha y Elige', icon: '👂', description: 'Escucha el sonido y elige la opción'},
      { id: 'bingo-palabras', name: 'Bingo de Palabras', icon: '🎯', description: 'Encuentra las palabras que escuchas'},
      { id: 'primera-palabra', name: 'Mi Primera Palabra', icon: '📖', description: 'Aprende palabras básicas'},
      { id: 'cuento-pictogramas', name: 'Cuento con Pictogramas', icon: '🖼️', description: 'Lee con imágenes'},
      { id: 'frases-magicas', name: 'Frases Mágicas', icon: '✨', description: 'Frases que cobran vida' },
    ],
  },
};

export function Dashboard({ age, onBack, onActivitySelect, onProgressView, filter, onFilterChange }: DashboardProps) {
  const data = ageData[age];
  const colorClass = data.color === 'purple' ? 'purple' : 'blue';

  const getFilteredActivities = () => {
    return data.games.map(g => ({ ...g, type: 'game' as const }));
  };

  const guide = { animal: 'owl' as const, message: '¡Hola pequeño explorador! Aquí tienes juegos perfectos para ti. ¡Vamos a aprender jugando!' };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: `linear-gradient(135deg, ${
          colorClass === 'purple' ? '#E0BBE4 0%, #957DAD 100%' : '#A2D2FF 0%, #5A8DEF 100%'
        })`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-white/80 backdrop-blur-sm border-2 hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>


        <div className="text-center">
          <h1 className="text-3xl text-white mb-2 dyslexia-friendly">
            Juegos disponibles
          </h1>
          <div className="text-white/80">
            Edad: {age} años
          </div>
        </div>

        <div className="w-32"></div>
      </div>

      {/* Animal Guide */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-6"
      >
        <AnimalGuide
          animal={guide.animal}
          message={guide.message}
        />
      </motion.div>



      {/* Activities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredActivities().map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="cursor-pointer bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg border-2 border-white/50"
              onClick={() => onActivitySelect(activity.type, activity.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{activity.icon}</div>
                </div>

                <h3 className="text-lg mb-2 text-gray-800 dyslexia-friendly">
                  {activity.name}
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {activity.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <GamepadIcon className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-gray-500 capitalize">
                      Juego
                    </span>
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}