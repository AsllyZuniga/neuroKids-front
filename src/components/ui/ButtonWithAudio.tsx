import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from './button';
import { speakText, canSpeakOnHover, trackAudioHelpUseForCurrentActivity } from '../../utils/textToSpeech';

interface ButtonWithAudioProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  audioText?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  enableAudio?: boolean;
  onClickWithAudio?: () => void;
  playOnHover?: boolean;
  playOnClick?: boolean;
}


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

  const getTextToSpeak = (): string => {
    if (audioText) return audioText;
    if (typeof children === 'string') return children;
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
        if (/(escuchar|repetir|oir|oír|audio|narrar)/i.test(text)) {
          trackAudioHelpUseForCurrentActivity();
        }
      }
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableAudio && playOnClick && !props.disabled) {
      const text = getTextToSpeak();
      if (text) {
        speakText(text, { voiceType: 'child' });
      }
    }


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
