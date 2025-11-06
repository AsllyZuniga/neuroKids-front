import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from './button';
import { speakText, canSpeakOnHover } from '../../utils/textToSpeech';

interface ButtonWithAudioProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  audioText?: string; // Texto a reproducir, si es diferente del contenido del botón
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  enableAudio?: boolean; // Permite desactivar el audio si es necesario
  onClickWithAudio?: () => void; // Callback adicional después del click
  playOnHover?: boolean; // Reproducir audio al hacer hover (por defecto true)
  playOnClick?: boolean; // Reproducir audio al hacer click (por defecto false)
}

/**
 * Botón que reproduce audio al hacer hover o click
 * Extiende el componente Button estándar con funcionalidad de audio
 */
export function ButtonWithAudio({
  children,
  audioText,
  variant,
  size,
  enableAudio = true,
  playOnHover = true,
  playOnClick = false,
  onClickWithAudio,
  onClick,
  ...props
}: ButtonWithAudioProps) {
  // Extraer texto del botón si no se proporciona audioText
  const getTextToSpeak = (): string => {
    if (audioText) return audioText;
    if (typeof children === 'string') return children;
    // Si children contiene elementos, intentar extraer el texto
    if (Array.isArray(children)) {
      const textParts = children.filter(child => typeof child === 'string');
      if (textParts.length > 0) return textParts.join(' ');
    }
    return '';
  };

  const handleMouseEnter = () => {
    if (enableAudio && playOnHover && !props.disabled && canSpeakOnHover()) {
      const text = getTextToSpeak();
      if (text) {
        speakText(text, { voiceType: 'child' });
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Reproducir audio si está configurado
    if (enableAudio && playOnClick && !props.disabled) {
      const text = getTextToSpeak();
      if (text) {
        speakText(text, { voiceType: 'child' });
      }
    }
    
    // Llamar callbacks
    if (onClick) {
      onClick(e);
    }
    if (onClickWithAudio) {
      onClickWithAudio();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}
