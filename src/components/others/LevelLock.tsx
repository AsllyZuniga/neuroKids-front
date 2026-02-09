import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface LevelLockProps {
  level: number;
  isLocked: boolean;
  children: ReactNode;
  onLoginRequired?: () => void;
}

/**
 * Componente que bloquea niveles y redirige al login
 * Nivel 1 siempre disponible, niveles 2+ requieren autenticación
 */
export function LevelLock({ level, isLocked, children, onLoginRequired }: LevelLockProps) {
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    return !!(token && userType);
  };

  const handleLoginClick = () => {
    if (onLoginRequired) {
      onLoginRequired();
    }
    // Redirigir a la selección de tipo de usuario
    navigate('/tipo-usuario');
  };

  const handleRegisterClick = () => {
    // Redirigir al registro de estudiante
    navigate('/estudiante/registro');
  };

  // Si no está bloqueado o el usuario está autenticado, mostrar contenido
  if (!isLocked || isAuthenticated()) {
    return <>{children}</>;
  }

  // Si está bloqueado y no autenticado, mostrar pantalla de bloqueo
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-4 border-purple-400">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="mb-6"
            >
              <Lock className="w-24 h-24 mx-auto text-purple-600" />
            </motion.div>

            <h2 className="text-3xl mb-4 text-gray-800">
              ¡Nivel {level} Bloqueado!
            </h2>

            <p className="text-lg text-gray-600 mb-6">
              Para acceder a este nivel necesitas iniciar sesión o registrarte.
              ¡Es gratis y muy fácil!
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleLoginClick}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-6"
              >
                🔓 Iniciar Sesión
              </Button>

              <Button
                onClick={handleRegisterClick}
                variant="outline"
                className="w-full border-2 border-purple-400 text-purple-700 hover:bg-purple-50 text-lg py-6"
              >
                ✨ Crear Cuenta Nueva
              </Button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-blue-800">
                  💡 <strong>¿Por qué registrarme?</strong>
                  <br />
                  Podrás guardar tu progreso, desbloquear todos los niveles y ganar más premios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
