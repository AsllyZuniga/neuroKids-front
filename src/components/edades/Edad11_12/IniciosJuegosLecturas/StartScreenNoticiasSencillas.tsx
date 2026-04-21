import { FloatingItem } from "@/components/ui/FloatingItem";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { startScreenMobileComenzarButton, startScreenMobilePlayIcon } from "@/components/edades/IniciosJuegosLecturas/startScreenMobileClasses";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import { ArrowLeft, Play } from "lucide-react";
import fondo from "@/assets/11_12/noticias_niños/fondo.svg";
import fondoTelefono from "@/assets/11_12/noticias_niños/fondo_telefono.svg";

interface StartScreenNoticiasSencillasProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenNoticiasSencillas({ onStart, onBack }: StartScreenNoticiasSencillasProps) {
  const handleStartGame = () => {
    console.log("¡Iniciando juego!");
    onStart();
  };

  const getSideX = () => {
    const isLeft = Math.random() < 0.5;

    if (isLeft) {
      return `${5 + Math.random() * 20}%`;   // 5% - 25%
    } else {
      return `${75 + Math.random() * 20}%`; // 75% - 95%
    }
  };

  return (
    <div className="relative isolate min-h-screen min-h-[100dvh] overflow-x-hidden overflow-y-auto">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 block min-h-full bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${fondoTelefono})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden min-h-full bg-cover bg-center bg-no-repeat md:block"
        style={{ backgroundImage: `url(${fondo})` }}
      />
      <Button
        onClick={onBack}
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-[100] pointer-events-auto"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>

      {["📰", "📻", "📸", "🎬", "📱", "💻", "✉️"].map((item, index) => (
        <FloatingItem
          key={index}
          x={`${Math.random() * 100}%`}
          y={`${Math.random() * 80}%`}
          delay={index * 0.2}
          duration={10 + Math.random() * 4}
          size="text-3xl md:text-4xl lg:text-5xl opacity-70"
          floatY={140}
          floatX={60}
          rotate
        >
          {item}
        </FloatingItem>
      ))}

      {[
        { title: "El gatito rescatado", emoji: "🐱" },
        { title: "Nueva bici en el parque", emoji: "🚲" },
        { title: "Día soleado hoy", emoji: "☀️" },
        { title: "Fiesta en la escuela", emoji: "🎉" },
      ].map((card, index) => (
        <FloatingItem
          key={index}
          x={getSideX()}
          y={`${10 + Math.random() * 70}%`}
          delay={index * 0.4}
          duration={12 + Math.random() * 4}
          floatY={120}
          floatX={40}
        >
          <div className="rounded-lg bg-white/80 p-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-600">Noticia</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl">{card.emoji}</span>
              <p className="text-xs text-gray-700">{card.title}</p>
            </div>
          </div>
        </FloatingItem>
      ))}

      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-pink-300/60 to-purple-300/60 rounded-full" />

          <h1 className="relative max-[480px]:text-2xl text-3xl tracking-wide text-purple-900 drop-shadow-xl sm:text-5xl md:text-6xl">
            <AnimatedText text="Noticias para Niños" />
          </h1>
        </div>

        <Button
          onClick={handleStartGame}
          size="lg"
          className={cn(
            "mt-12 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 px-8 py-6 text-xl text-purple-900 shadow-lg transition-all hover:scale-110 hover:from-pink-400 hover:to-purple-400 hover:shadow-xl dyslexia-friendly",
            startScreenMobileComenzarButton
          )}
        >
          <Play className={cn("mr-3 h-8 w-8 fill-white", startScreenMobilePlayIcon)} />
          ¡Comenzar a Jugar!
        </Button>
      </div>
    </div>
  );
}
