import { useNavigate } from "react-router-dom";
import "./AgeCircle.scss";

import Btn1 from "../../assets/img/btn_7-8.webp";
import Btn2 from "../../assets/img/btn-9-10.webp"; 
import Btn3 from "../../assets/img/btn-11-12.webp"; 

export default function AgeCircle() {
  const navigate = useNavigate();

  const buttons = [
    { age: "7 - 8 años", image: Btn1, to: "/nivel1" },
    { age: "9 - 10 años", image: Btn2, to: "/nivel1" },
    { age: "11 - 12 años", image: Btn3, to: "/nivel3" },
  ];

  return (
    <div className="age-buttons">
      {buttons.map((btn, i) => (
        <div
          key={i}
          className="age-button"
          onClick={() => navigate(btn.to)}
        >
          <img src={btn.image} alt={btn.age} className="age-button__img" />
        </div>
      ))}
    </div>
  );
}
