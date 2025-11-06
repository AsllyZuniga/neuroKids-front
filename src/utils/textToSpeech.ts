/**
 * Utilidad para convertir texto a voz usando la API Web Speech
 * Proporciona funciones para reproducir texto en español con voz amigable para niños
 */

interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceType?: 'child' | 'normal' | 'slow';
}

// Estado global para cumplir políticas de interacción del usuario
let userInteracted = false;

// Selecciona la mejor voz de español disponible priorizando es-CO
const pickSpanishVoice = (
  voices: SpeechSynthesisVoice[],
  requestedLang?: string
): { voice?: SpeechSynthesisVoice; lang: string } => {
  const prefs = [
    ...(requestedLang ? [requestedLang] : []),
    'es-CO',
    'es-MX',
    'es-US',
    'es-ES',
    'es'
  ].map((l) => l.toLowerCase());

  for (const pref of prefs) {
    const v = voices.find((vv) => vv.lang.toLowerCase().startsWith(pref));
    if (v) return { voice: v, lang: v.lang };
  }
  // Fallback por si no hay voces, mantener un español genérico
  return { lang: requestedLang || 'es-ES' };
};

/**
 * Reproduce un texto usando la síntesis de voz del navegador con voz amigable
 * @param text - Texto a reproducir
 * @param options - Opciones de configuración de la voz
 */
export const speakText = (text: string, options: SpeechOptions = {}): void => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-Speech no está soportado en este navegador');
    return;
  }

  if (!text || text.trim() === '') {
    return;
  }

  // Cancelar cualquier reproducción anterior
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text.trim());
  
  // Configurar velocidad y tono
  if (options.voiceType === 'child') {
    utterance.rate = 0.85;
    utterance.pitch = 1.2;
  } else if (options.voiceType === 'slow') {
    utterance.rate = 0.7;
    utterance.pitch = 1.0;
  } else {
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1.1;
  }
  
  utterance.volume = options.volume || 1;

  const speakNow = () => {
    // Obtener voces disponibles (puede estar vacío inicialmente)
    const voices = window.speechSynthesis.getVoices();
    const { voice, lang } = pickSpanishVoice(voices, options.lang);
    utterance.lang = lang;
    if (voice) {
      utterance.voice = voice;
    }
    // Algunos navegadores requieren resume() antes de speak()
    try {
      window.speechSynthesis.resume();
    } catch {
      // ignore
    }
    window.speechSynthesis.speak(utterance);
  };

  // Si aún no hay voces cargadas, esperar el evento y luego hablar
  if (window.speechSynthesis.getVoices().length === 0) {
    const handler = () => {
      speakNow();
      // limpiar handler para no duplicar
      window.speechSynthesis.onvoiceschanged = null;
    };
    window.speechSynthesis.onvoiceschanged = handler;
  } else {
    speakNow();
  }
};

/**
 * Detiene cualquier reproducción de voz en curso
 */
export const stopSpeech = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Verifica si el navegador soporta Text-to-Speech
 */
export const isSpeechSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

/**
 * Hook personalizado para usar en componentes React
 */
export const useSpeech = () => {
  const speak = (text: string, options?: SpeechOptions) => {
    speakText(text, { voiceType: 'child', ...options });
  };

  const stop = () => {
    stopSpeech();
  };

  const isSupported = isSpeechSupported();

  return { speak, stop, isSupported };
};

/**
 * Inicializa las voces (llamar al cargar la aplicación)
 * Necesario en algunos navegadores para cargar las voces disponibles
 */
export const initVoices = (): void => {
  if ('speechSynthesis' in window) {
    // Cargar voces
    window.speechSynthesis.getVoices();
    
    // En algunos navegadores las voces se cargan de forma asíncrona
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    // Marcar interacción del usuario para habilitar audio en hover
    const markInteracted = () => { userInteracted = true; };
    window.addEventListener('click', markInteracted, { once: true, capture: true });
    window.addEventListener('keydown', markInteracted, { once: true, capture: true });
  }
};

/**
 * Indica si podemos reproducir audio en eventos de hover (requiere gesto del usuario)
 */
export const canSpeakOnHover = (): boolean => userInteracted;
