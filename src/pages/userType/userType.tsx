import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button/Button";
import "./userType.scss";

export default function UserType() {
  const navigate = useNavigate();

  const handleStudentLogin = () => {
    navigate("/estudiante/login");
  };

  const handleTeacherLogin = () => {
    navigate("/docente/login");
  };

  return (
    <div className="user-type">
      <div className="user-type__container">
        <div className="user-type__header">
          <h1 className="user-type__title">¡Bienvenido a NeuroKids!</h1>
          <p className="user-type__subtitle">¿Eres estudiante o docente?</p>
        </div>

        <div className="user-type__options">
          <div className="user-type__option">
            <div className="user-type__card user-type__card--student">
              <div className="user-type__card-icon">
                <img src="/src/assets/img/cohete.svg" alt="Estudiante" />
              </div>
              <h3 className="user-type__card-title">Soy Estudiante</h3>
              <p className="user-type__card-description">
                Accede a tus lecturas y actividades
              </p>
              <Button
                label="Continuar como Estudiante"
                variant="primary"
                size="large"
                onClick={handleStudentLogin}
                className="user-type__button"
              />
            </div>
          </div>

          <div className="user-type__option">
            <div className="user-type__card user-type__card--teacher">
              <div className="user-type__card-icon">
                {/* CAMBIO AQUÍ: Usamos regla.svg que sí existe en tu carpeta */}
                <img src="/src/assets/img/regla.svg" alt="Docente" />
              </div>
              <h3 className="user-type__card-title">Soy Docente</h3>
              <p className="user-type__card-description">
                Gestiona tus estudiantes y revisa su progreso
              </p>
              <Button
                label="Continuar como Docente"
                variant="secondary"
                size="large"
                onClick={handleTeacherLogin}
                className="user-type__button"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}