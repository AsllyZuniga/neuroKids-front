import { Gem, ArrowLeft } from "lucide-react";
import { ButtonWithAudio } from "../../../ui/ButtonWithAudio";
import { speakText } from "../../../../utils/textToSpeech";

interface StartScreenCazaSilabaProps {
  onStart: () => void;
  onBack: () => void;
}

export function StartScreenCazaSilaba({ onStart, onBack }: StartScreenCazaSilabaProps) {
  const instructions = `
    Bienvenido a Caza la Sílaba.
    Escucha o lee la palabra o la frase y elige la sílaba correcta.
    Arrastra la sílaba hasta el recuadro para completar la palabra o la frase.
    ¡Vamos a aprender jugando!
  `;
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFB6C1 0%, #87CEEB 100%)'
      }}
    >
      <ButtonWithAudio
        onClick={onBack}
        playOnClick
        playOnHover
        variant="outline"
        className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white hover:text-white border-white/20 z-20"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </ButtonWithAudio>
      <div className="relative w-full max-w-2xl mx-auto p-8">
        <div className="absolute top-0 left-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <Gem className="w-12 h-12 text-blue-300 fill-blue-200" />
        </div>
        <div className="absolute top-20 right-16 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>
          <Gem className="w-10 h-10 text-teal-300 fill-teal-200" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.8s' }}>
          <Gem className="w-8 h-8 text-green-300 fill-green-200" />
        </div>
        <div className="absolute bottom-10 right-24 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}>
          <Gem className="w-14 h-14 text-cyan-300 fill-cyan-200" />
        </div>
        <div className="absolute top-32 left-32 animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '2.7s' }}>
          <Gem className="w-6 h-6 text-blue-200 fill-blue-100" />
        </div>
        <div className="absolute top-10 right-40 animate-bounce" style={{ animationDelay: '1.2s', animationDuration: '3.1s' }}>
          <Gem className="w-10 h-10 text-emerald-300 fill-emerald-200" />
        </div>

        <div className="relative bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-12 shadow-2xl border-4 border-dashed border-teal-400 transform rotate-1">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-300 rounded-full shadow-lg"></div>
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-teal-300 rounded-full shadow-lg"></div>
          <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-green-300 rounded-full shadow-lg"></div>
          <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-cyan-300 rounded-full shadow-lg"></div>

          <div className="text-center mb-8">
            <h1 className="text-6xl mb-4 transform -rotate-2">
              <span className="inline-block bg-rose-300 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-3 mx-1">C</span>
              <span className="inline-block bg-purple-300 text-white px-4 py-2 rounded-lg shadow-lg transform -rotate-2 mx-1">a</span>
              <span className="inline-block bg-blue-300 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-1 mx-1">z</span>
              <span className="inline-block bg-teal-300 text-white px-4 py-2 rounded-lg shadow-lg transform -rotate-3 mx-1">a</span>
            </h1>
            <h1 className="text-6xl mb-4 transform rotate-1">
              <span className="inline-block bg-emerald-300 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-2 mx-1">l</span>
              <span className="inline-block bg-amber-300 text-white px-4 py-2 rounded-lg shadow-lg transform -rotate-1 mx-1">a</span>
            </h1>
            <h1 className="text-6xl mb-6">
              <span className="inline-block bg-pink-300 text-white px-4 py-2 rounded-lg shadow-lg transform -rotate-2 mx-1">S</span>
              <span className="inline-block bg-violet-300 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-3 mx-1">í</span>
              <span className="inline-block bg-sky-300 text-white px-4 py-2 rounded-lg shadow-lg transform -rotate-1 mx-1">l</span>
              <span className="inline-block bg-cyan-300 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-2 mx-1">a</span>
              <span className="inline-block bg-lime-300 text-white px-4 py-2 rounded-lg shadow-lg transform -rotate-2 mx-1">b</span>
              <span className="inline-block bg-orange-300 text-white px-4 py-2 rounded-lg shadow-lg transform rotate-1 mx-1">a</span>
            </h1>
              <p className="text-teal-700 text-2xl italic dyslexia-friendly">¡Arrastra sílabas para completar palabras y frases!</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <ButtonWithAudio
              onClick={() => speakText(instructions, { voiceType: 'child' })}
              playOnClick
              playOnHover={false}
              variant="outline"
              className="bg-blue-500/90 text-white px-8 py-4 rounded-full text-xl shadow-xl border-2 border-blue-400 hover:scale-105 transform transition-transform duration-200"
            >
              Escuchar instrucciones
            </ButtonWithAudio>

            <ButtonWithAudio
              onClick={onStart}
              playOnHover
              playOnClick
              size="lg"
              className="bg-gradient-to-br from-teal-300 to-green-400 hover:from-teal-400 hover:to-green-500 text-white px-16 py-6 rounded-full text-4xl shadow-2xl border-4 border-teal-400 hover:scale-110 transform transition-transform duration-200 hover:shadow-3xl uppercase tracking-wide dyslexia-friendly"
            >
              Jugar
            </ButtonWithAudio>
          </div>
        </div>
      </div>
    </div>
  );
}

