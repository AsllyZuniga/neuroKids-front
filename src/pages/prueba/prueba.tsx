import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Card from "../../shared/components/Card/Card";
import Button from "../../shared/components/Button/Button";
import "./prueba.scss";

export default function Prueba({
  nivel,
  imagen,

}: {
  nivel: number;
  imagen: string;
  lecturas: number;
  games: number;
}) {
  const navigate = useNavigate();
  const variant = `nivel${nivel}` as "nivel1" | "nivel2" | "nivel3";

  const juegosNivel1 = [
    { id: 1, nombre: "Bingo de Palabras 😎" },
    { id: 2, nombre: "Caza la Sílaba 🔤" },
    { id: 3, nombre: "Escucha y Elige 👂" },
  ];

  const lecturasNivel1 = [
    { id: 1, nombre: "Cuento con Pictogramas 🌆" },
    { id: 2, nombre: "Frases Mágicas 🪄" },
    { id: 3, nombre: "Primera Palabra 🔠" },
  ];

  const juegosNivel2 = [
    { id: 1, nombre: "Construye Frases 🆎" },
    { id: 2, nombre: "Laberinto Lector 🌀" },
    { id: 3, nombre: "Ordena la historia 📍" },
  ];

  const lecturasNivel2 = [
    { id: 1, nombre: "Historias interactivas 📚" },
    { id: 2, nombre: "Mini Aventuras 🗺️" },
    { id: 3, nombre: "Revista Infantil 📒" },
  ];

  const juegosNivel3 = [
    { id: 1, nombre: "Cohete Lector 🚀" },
    { id: 2, nombre: "Detective de palabras 🔎" },
    { id: 3, nombre: "Preguntas Inferenciales 🧠" },
  ];

  const lecturasNivel3 = [
    { id: 1, nombre: "Biografias Sencillas 📖" },
    { id: 2, nombre: "Cuento Interactivo 📗" },
    { id: 3, nombre: "Noticias Sencillas 📰" },
  ];


  return (
    <div className={`prueba-page nivel${nivel}`}>
      <Header />

      {/* HEADER */}
      <div className="prueba-header">
        <img src={imagen} alt={`Nivel ${nivel}`} className="prueba-img" />
        <div className="prueba-buttons">
          <Button
            label="Edad de 7 a 8 años"
            variant={variant}
            size="large"
            onClick={() => navigate("/nivel1")}
          />
          <Button
            label="Edad de 9 a 10 años"
            variant={variant}
            size="large"
            onClick={() => navigate("/nivel2")}
          />
          <Button
            label="Edad de 11 a 12 años"
            variant={variant}
            size="large"
            onClick={() => navigate("/nivel3")}
          />
        </div>
      </div>

      {/* CONTENIDO */}
      {nivel === 1 ? (
        <>
          {/* 🎮 Juegos */}
          <section className="prueba-cards">
            <h2>Juegos disponibles</h2>
            <div className="cards-container text-black">
              {juegosNivel1.map((juego, index) => (
                <Card
                  key={juego.id}
                  title={juego.nombre}
                  variant="shadow"
                  onClick={() => navigate(`/nivel1/juego${index + 1}`)}
                >
                  <p>Haz clic para jugar</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Lecturas */}
          <section className="prueba-cards">
            <h2>Lecturas disponibles</h2>
            <div className="cards-container text-black">
              {lecturasNivel1.map((lectura, index) => (
                <Card
                  key={lectura.id}
                  title={lectura.nombre}
                  variant="shadow"
                  onClick={() => navigate(`/nivel1/lectura${index + 1}`)}
                >
                  <p>Haz clic para leer</p>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : nivel === 2 ? (
        <>
          {/* Juegos */}
          <section className="prueba-cards">
            <h2>Juegos disponibles</h2>
            <div className="cards-container text-black">
              {juegosNivel2.map((juego, index) => (
                <Card
                  key={juego.id}
                  title={juego.nombre}
                  variant="shadow"
                  onClick={() => navigate(`/nivel2/juego${index + 1}`)}
                >
                  <p>Haz clic para jugar</p>
                </Card>
              ))}
            </div>
          </section>

          {/*  Lecturas */}
          <section className="prueba-cards">
            <h2>Lecturas disponibles</h2>
            <div className="cards-container text-black">
              {lecturasNivel2.map((lectura, index) => (
                <Card
                  key={lectura.id}
                  title={lectura.nombre}
                  variant="shadow"
                  onClick={() => navigate(`/nivel2/lectura${index + 1}`)}
                >
                  <p>Haz clic para leer</p>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : nivel === 3 ? (
        <>
          {/* juegos*/}
          <section className="prueba-cards">
            <h2>Juegos disponibles</h2>
            <div className="cards-container  text-black">
              {juegosNivel3.map((juego, index) => (
                <Card
                  key={juego.id}
                  title={juego.nombre}
                  variant="shadow"
                  onClick={() => navigate(`/nivel3/juego${index + 1}`)}
                >
                  <p>Haz clic para jugar</p>
                </Card>
              ))}
            </div>
          </section>

          {/* lecturas*/}
          <section className="prueba-cards">
            <h2>Lecturas disponibles</h2>
            <div className="cards-container text-black">
              {lecturasNivel3.map((lectura, index) => (
                <Card
                  key={lectura.id}
                  title={lectura.nombre}
                  variant="shadow"
                  onClick={() => navigate(`/nivel3/lectura${index + 1}`)}
                >
                  <p>Haz clic para leer</p>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : null}

    </div>
  );
}
