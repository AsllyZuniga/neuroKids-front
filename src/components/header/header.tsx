import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./header.scss";
import { HEADER_TEXT } from "./header.constants";
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
   

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setUserType(userTypeData || "");
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setUserType("");
    }
  };

  const handleLogin = () => {
    navigate("/tipo-usuario");
  };

  const handleLogout = () => {
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
          <img src="/src/assets/logo.png" alt="NeuroKids" className="header__logo-img" onClick={() => navigate("/bienvenida/estudiante")} />

        </div>

        <div className="header__auth">
          {isAuthenticated && user ? (
            <div className="header__user-info">
              <span className="header__welcome">
                {HEADER_TEXT.welcome}  {getUserDisplayName()}
              </span>

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
                  if (userType === "docente" || userType === "admin") {
                    navigate("/perfil/docente");
                  } else {
                    navigate("/perfil/estudiante");
                  }
                }}
                className="header__profile-btn"
              />



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
