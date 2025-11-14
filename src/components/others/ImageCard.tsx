// src/components/cards/ImageCard.tsx
interface ImageCardProps {
  image: string;
  title: string; // opcional: para accesibilidad
  onClick?: () => void;
}

export function ImageCard({ image, title, onClick }: ImageCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative block w-full focus:outline-none"
      aria-label={title}
    >
      <div className="relative overflow-hidden rounded-3xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Brillo al hover */}
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </button>
  );
}