import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import Header from "@/components/header/header";
import { ImageCard } from "@/components/others/ImageCard";
import "./prueba.scss";

export default function Prueba({
  nivel,
  imagen,
  lecturas: _lecturas,
  games: _games,
}: {
  nivel: number;
  imagen: string;
  /** Reservado para el mapa de actividades (compat. rutas en App) */
  lecturas?: number;
  games?: number;
}) {
  void _lecturas;
  void _games;
  const navigate = useNavigate();

  const cardImages = {
    nivel1: {
      juegos: [
        "/niveles/assets/cards/nivel1/Bingo-de-palabras.webp",
        "/niveles/assets/cards/nivel1/Caza-la-silaba.webp",
        "/niveles/assets/cards/nivel1/Escucha-y-elige.webp",
      ],
      lecturas: [
        "/niveles/assets/cards/nivel1/Cuentos-pictogramas.webp",
        "/niveles/assets/cards/nivel1/Frases-magicas.webp",
        "/niveles/assets/cards/nivel1/Mi-primera-palabra.webp",
      ],
    },
    nivel2: {
      juegos: [
        "/niveles/assets/cards/nivel2/Construye-la-frase.webp",
        "/niveles/assets/cards/nivel2/Laberinto-lector.webp",
        "/niveles/assets/cards/nivel2/Ordena-la-historia.webp",
      ],
      lecturas: [
        "/niveles/assets/cards/nivel2/Historias-interactivas.webp",
        "/niveles/assets/cards/nivel2/Mini-aventuras.webp",
        "/niveles/assets/cards/nivel2/Revista-infantil.webp",
      ],
    },
    nivel3: {
      juegos: [
        "/niveles/assets/cards/nivel3/Cohete-lector.webp",
        "/niveles/assets/cards/nivel3/Detective-de-palabras.webp",
        "/niveles/assets/cards/nivel3/Preguntas-inferenciales.webp",
      ],
      lecturas: [
        "/niveles/assets/cards/nivel3/Biografias-sencillas.webp",
        "/niveles/assets/cards/nivel3/Cuento-interactivo.webp",
        "/niveles/assets/cards/nivel3/Noticias-para-niños.webp",
      ],
    },
  };

  const titulos = {
    nivel1: {
      juegos: ["Bingo de Palabras", "Caza la Sílaba", "Escucha y Elige"],
      lecturas: ["Cuento con Pictogramas", "Frases Mágicas", "Primera Palabra"],
    },
    nivel2: {
      juegos: ["Construye Frases", "Laberinto Lector", "Ordena la historia"],
      lecturas: ["Historias interactivas", "Mini Aventuras", "Revista Infantil"],
    },
    nivel3: {
      juegos: ["Cohete Lector", "Detective de palabras", "Preguntas Inferenciales"],
      lecturas: ["Biografías Sencillas", "Cuento Interactivo", "Noticias Sencillas"],
    },
  };

  const current = cardImages[`nivel${nivel}` as keyof typeof cardImages];
  const titles = titulos[`nivel${nivel}` as keyof typeof titulos];

  if (!current || !titles) {
    return (
      <div className={`prueba-page nivel${nivel}`}>
        <Header />
        <div className="prueba-header">
          <button
            className="home-button"
            onClick={() => navigate("/")}
            title="Volver al inicio"
          >
            <Home size={28} />
          </button>
        </div>
        <div className="prueba-content" style={{ padding: "2rem", textAlign: "center" }}>
          <p style={{ marginBottom: "1rem" }}>Este nivel no está disponible.</p>
          <button type="button" className="home-button" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`prueba-page nivel${nivel}`}>
      <Header />
      <div className="prueba-header">
        <img src={imagen} alt={`Nivel ${nivel}`} className="prueba-img" />
        <button
          className="home-button"
          onClick={() => navigate("/")}
          title="Volver al inicio"
        >
          <Home size={28} />
        </button>
      </div>

      <div className="prueba-content">
        <section className="prueba-cards">
          <h2>Juegos disponibles</h2>
          <div className="cards-container text-black">
            {current.juegos.map((img, index) => (
              <ImageCard
                key={`juego-${nivel}-${index}`}
                image={img}
                title={titles.juegos[index]}
                onClick={() => navigate(`/nivel${nivel}/juego${index + 1}`)}
              />
            ))}
          </div>
        </section>

        <section className="prueba-cards">
          <h2>Lecturas disponibles</h2>
          <div className="cards-container text-black">
            {current.lecturas.map((img, index) => (
              <ImageCard
                key={`lectura-${nivel}-${index}`}
                image={img}
                title={titles.lecturas[index]}
                onClick={() => navigate(`/nivel${nivel}/lectura${index + 1}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}