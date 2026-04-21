import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./header.scss";
import { HEADER_TEXT } from "./header.constants";
import logo from "@/assets/logo.png";
import Button from "@/shared/components/Button/Button";
import { useLocation } from "react-router-dom";

interface User {
  id: number;
  nombre: string;
  apellido?: string;
  correo?: string;
}

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string>("");
  const navigate = useNavigate();
   const location = useLocation();
    const isStudentProfile = location.pathname === "/perfil/estudiante";

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const userTypeData = localStorage.getItem("userType");

    // Evita errores cuando no hay usuario o el valor guardado no es JSON válido
    if (token && userData && userData !== "undefined") {
      try {
        const parsedUser: User = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setUserType(userTypeData || "");
        return;
      } catch {
        // Si falla el parseo, limpiamos cualquier dato corrupto
        localStorage.removeItem("user");
      }
    }

    setIsAuthenticated(false);
    setUser(null);
    setUserType("");
  };

  const handleLogin = () => {
    navigate("/tipo-usuario");
  };

  const handleLogout = () => {
    // No eliminar claves neurokids-progress-*, neurokids-streak-*, neurokids-student-panel-ui-* (progreso persistente)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    setIsAuthenticated(false);
    setUser(null);
    setUserType("");
    navigate("/bienvenida/estudiante");
  };

  const getUserDisplayName = () => {
    if (!user) return "";

    if (userType === "estudiante") {
      return `${user.nombre} ${user.apellido || ""}`.trim();
    } else {
      return user.nombre;
    }
  };

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <img src={logo} alt="NeuroKids" className="header__logo-img" onClick={() => navigate("/bienvenida/estudiante")} />

        </div>

        <div className="header__auth">
          {isAuthenticated && user ? (
            <div className="header__user-info">
              <span className="header__welcome">
                {HEADER_TEXT.welcome}  {getUserDisplayName()}
              </span>

              <div className="header__nav-pair">
                <Button
                  label="Inicio"
                  variant="primary"
                  size="medium"
                  onClick={() => navigate("/bienvenida/estudiante")}
                  className="header__profile-btn"
                />
                <Button
                  label="Perfil"
                  variant="primary"
                  size="medium"
                  onClick={() => {
                    if (userType === "docente") {
                      navigate("/perfil/docente");
                    } else if (userType === "admin") {
                      navigate("/perfil/admin");
                    } else {
                      navigate("/perfil/estudiante");
                    }
                  }}
                  className="header__profile-btn"
                />
              </div>



             {!isStudentProfile && (
  <Button
    label={HEADER_TEXT.logout}
    variant="secondary"
    size="medium"
    onClick={handleLogout}
    className="header__logout-btn"
  />
)}
            </div>
          ) : (
            <Button
              label={HEADER_TEXT.login}
              variant="primary"
              size="medium"
              onClick={handleLogin}
              className="header__login-btn"
            />
          )}
        </div>
      </div>
    </header>
  );
}
