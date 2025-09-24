//ok
import "./SceneImages.scss";
import arcoiris from "../../assets/img/arcoiris.svg";
import bloques1 from "../../assets/img/bloque1.svg";
import bloques2 from "../../assets/img/bloque2.svg";
import cohete from "../../assets/img/cohete.svg";
import neurokids from "../../assets/img/neuroKids.svg";
import nube from "../../assets/img/nube.svg";

export default function SceneImages() {
  return (
    <div className="main-scene">
      <img src={arcoiris} alt="Arcoiris" className="arcoiris" />
      <img src={bloques1} alt="Bloques 1" className="bloques1" />
      <img src={bloques2} alt="Bloques 2" className="bloques2" />
      <img src={cohete} alt="Cohete" className="cohete" />
      <img src={neurokids} alt="Niña" className="neurokids" />
      
     
      <img src={nube} alt="Nube" className="nube nube1" />
      <img src={nube} alt="Nube" className="nube nube2" />
      <img src={nube} alt="Nube" className="nube nube3" />
      <img src={nube} alt="Nube" className="nube nube4" />
      <img src={nube} alt="Nube" className="nube nube5" />
      <img src={nube} alt="Nube" className="nube nube6" />
      <img src={nube} alt="Nube" className="nube nube7" />
    </div>
  );
}
