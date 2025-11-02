import { AnimatedLetter } from "./AnimatedLetter";

interface AnimatedTitleProps {
  text: string;
}

export function AnimatedTitle({ text }: AnimatedTitleProps) {
  const words = text.split(' ');
  
  let letterIndex = 0;
  
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block">
          {word.split('').map((letter, index) => {
            const currentIndex = letterIndex++;
            return (
              <AnimatedLetter 
                key={`${wordIndex}-${index}`} 
                letter={letter} 
                index={currentIndex} 
              />
            );
          })}
        </span>
      ))}
    </div>
  );
}

