import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Card from "../../shared/components/Card/Card";
import Button from "../../shared/components/Button/Button";
import "./prueba.scss";

type PruebaProps = {
  nivel: number;
  imagen: string;
  lecturas: number;
};

export default function Prueba({ nivel, imagen, lecturas }: PruebaProps) {
  const navigate = useNavigate();
  const variant = `nivel${nivel}` as "nivel1" | "nivel2" | "nivel3"; // 👈 calcula el variant

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

      {/* SECCIÓN DE CARDS */}
      <section className="prueba-cards">
        <h2>Lecturas disponibles</h2>
        <div className="cards-container">
          {[...Array(lecturas)].map((_, i) => (
            <Card key={i} title={`Lectura ${i + 1}`} variant="shadow">
              <p>Comprensión lectora</p>
            </Card>
          ))}
        </div>
      </section>
      <footer></footer>
    </div>
  );
}
