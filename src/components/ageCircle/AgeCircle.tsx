import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./AgeCircle.scss";
import Camara from "../../assets/img/camara.svg";
import Cuaderno from "../../assets/img/cuaderno.svg";
import PaletaColores from "../../assets/img/paletaColores.svg";

export default function AgeCircle() {
  const navigate = useNavigate();
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const circles = [
    { age: "7 - 8 años", image: Camara, to: "/nivel1" },
    { age: "9 - 10 años", image: Cuaderno, to: "/nivel2" },
    { age: "11 - 12 años", image: PaletaColores, to: "/nivel3" },
  ];

  const handleClick = (to: string, index: number) => {
    setClickedIndex(index);
    setTimeout(() => {
      navigate(to); 
    }, 250); 
  };

  return (
    <div className="age-circles">
      {circles.map((circle, i) => (
        <div
          key={i}
          className={`age-circle color-${i + 1} ${clickedIndex === i ? "clicked" : ""}`}
          onClick={() => handleClick(circle.to, i)}
        >
          <img
            src={circle.image}
            alt={circle.age}
            className="age-circle__icon"
          />
          <span className="age-circle__text">{circle.age}</span>
        </div>
      ))}
    </div>
  );
}
