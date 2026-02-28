import { useNavigate } from "react-router-dom";
import Button from "@/shared/components/Button/Button";
import "./userType.scss";
import { useEffect, useState } from "react";

export default function UserType() {
  const avatars = [
  "/avatars/mujer.svg",
  "/avatars/hombre.svg"
];

const [avatarIndex, setAvatarIndex] = useState(0);

  const navigate = useNavigate();

  const handleStudentLogin = () => {
    navigate("/estudiante/login");
  };

  const handleTeacherLogin = () => {
    navigate("/docente/login");
  };

  useEffect(() => {
  const interval = setInterval(() => {
    setAvatarIndex((prev) => (prev === 0 ? 1 : 0));
  }, 15000);

  return () => clearInterval(interval);
}, []);

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
                <img src="avatars/estudiantes.svg" alt="Estudiante" />
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
                <img 
                  src={avatars[avatarIndex]} 
                  alt="Docente"
                  className="user-type__avatar"
                />
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