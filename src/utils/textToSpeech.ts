

interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceType?: 'child' | 'normal' | 'slow';
}
import { getActivityByRoute } from "@/config/activities";

let userInteracted = false;

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

  return { lang: requestedLang || 'es-ES' };
};


export const speakText = (text: string, options: SpeechOptions = {}): void => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-Speech no está soportado en este navegador');
    return;
  }

  if (!text || text.trim() === '') {
    return;
  }


  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text.trim());

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

    const voices = window.speechSynthesis.getVoices();
    const { voice, lang } = pickSpanishVoice(voices, options.lang);
    utterance.lang = lang;
    if (voice) {
      utterance.voice = voice;
    }
    
    try {
      window.speechSynthesis.resume();
    } catch {
    
    }
    window.speechSynthesis.speak(utterance);
  };


  if (window.speechSynthesis.getVoices().length === 0) {
    const handler = () => {
      speakNow();

      window.speechSynthesis.onvoiceschanged = null;
    };
    window.speechSynthesis.onvoiceschanged = handler;
  } else {
    speakNow();
  }
};


export const trackAudioHelpUseForCurrentActivity = (): void => {
  try {
    const rawUser = localStorage.getItem("user");
    const parsed = rawUser ? JSON.parse(rawUser) : null;
    const studentId = Number(parsed?.id);
    const route = window.location.pathname;
    const activity = getActivityByRoute(route);
    const activityId = Number(activity?.dbId);
    if (Number.isFinite(studentId) && Number.isFinite(activityId)) {
      const key = `neurokids-audio-uses-${studentId}-${activityId}`;
      const prev = Number(localStorage.getItem(key) || "0");
      localStorage.setItem(key, String((Number.isFinite(prev) ? prev : 0) + 1));
    }
  } catch {
   
  }
};


export const stopSpeech = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};


export const isSpeechSupported = (): boolean => {
  return 'speechSynthesis' in window;
};

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


export const initVoices = (): void => {
  if ('speechSynthesis' in window) {
  
    window.speechSynthesis.getVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    const markInteracted = () => { userInteracted = true; };
    window.addEventListener('click', markInteracted, { once: true, capture: true });
    window.addEventListener('keydown', markInteracted, { once: true, capture: true });
  }
};

export const canSpeakOnHover = (): boolean => userInteracted;
