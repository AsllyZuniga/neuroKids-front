import "./Header.scss";
import { HEADER_TEXT } from "./header.constants";
import Button from "../../shared/components/Button/Button";

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">

        <Button
          label={HEADER_TEXT.login}
          
          size="medium"
          onClick={() => console.log("Iniciar sesión")}
          className="header__login-btn"
        />
      </div>
    </header>
  );
}
