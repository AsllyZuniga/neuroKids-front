//..ok
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/header";
import SceneImages from "@/components/sceneImages/sceneImages";
import "./dashboard.scss";
import AgeCircle from "@/components/ageCircle/AgeCircle";

import Btn1 from "@/assets/img/btn_7-8.webp";
import Btn2 from "@/assets/img/btn-9-10.webp";
import Btn3 from "@/assets/img/btn-11-12.webp";
import logo from "@/assets/logo.png";
import Koala from "@/assets/Animalguia/koala.svg";
import Buho from "@/assets/Animalguia/buho.svg";
import Rana from "@/assets/Animalguia/rana.svg";
import Nube from "@/assets/img/nube.svg";

interface User {
  id: number;
  nombre: string;
  apellido?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch {
        /* datos corruptos */
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    setIsAuthenticated(false);
    setUser(null);
  };

  const ageButtons = [
    { image: Btn1, label: "7 - 8 años", to: "/nivel1" },
    { image: Btn2, label: "9 - 10 años", to: "/nivel2" },
    { image: Btn3, label: "11 - 12 años", to: "/nivel3" },
  ];

  return (
    <>
      {/* ── Vista desktop/tablet (sin cambios) ── */}
      <div className="dashboard-container">
        <Header />
        <div className="main-scene-wrapper">
          <SceneImages />
          <AgeCircle />
        </div>
        <footer />
      </div>

      {/* ── Vista móvil ≤480px ── */}
      <div className="dashboard-mobile">
        <div className="dashboard-mobile__clouds" aria-hidden="true">
          <img src={Nube} alt="" className="dashboard-mobile__cloud dashboard-mobile__cloud--1" />
          <img src={Nube} alt="" className="dashboard-mobile__cloud dashboard-mobile__cloud--2" />
          <img src={Nube} alt="" className="dashboard-mobile__cloud dashboard-mobile__cloud--3" />
          <img src={Nube} alt="" className="dashboard-mobile__cloud dashboard-mobile__cloud--4" />
        </div>

        {/* Header */}
        <div className="dashboard-mobile__header">
          <img
            src={logo}
            alt="NeuroKids"
            className="dashboard-mobile__logo"
            onClick={() => navigate("/")}
          />
          {isAuthenticated && user ? (
            <div className="dashboard-mobile__user">
              <span>{user.nombre}</span>
              <button
                className="dashboard-mobile__user-btn"
                onClick={() => navigate("/perfil/estudiante")}
              >
                Perfil
              </button>
              <button
                className="dashboard-mobile__user-btn"
                onClick={handleLogout}
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              className="dashboard-mobile__login-btn"
              onClick={() => navigate("/tipo-usuario")}
            >
              Iniciar sesión
            </button>
          )}
        </div>

        <section className="dashboard-mobile__content">
          {/* Saludo */}
          <p className="dashboard-mobile__greeting">
            {isAuthenticated && user
              ? `¡Hola, ${user.nombre}!`
              : "¡Bienvenido a NeuroKids!"}
          </p>
          <p className="dashboard-mobile__subtitle">
            Elige tu grupo de edad para comenzar
          </p>

          {/* Botones de edad */}
          <div className="dashboard-mobile__buttons">
            {ageButtons.map((btn) => (
              <div
                key={btn.to}
                className="dashboard-mobile__age-btn"
                onClick={() => navigate(btn.to)}
                role="button"
                tabIndex={0}
                aria-label={`Ir a ${btn.label}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(btn.to);
                  }
                }}
              >
                <img src={btn.image} alt={btn.label} />
                <span className="dashboard-mobile__age-label">{btn.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="dashboard-mobile__animals" aria-hidden="true">
          <img src={Koala} alt="" className="dashboard-mobile__animal dashboard-mobile__animal--koala" />
          <img src={Buho} alt="" className="dashboard-mobile__animal dashboard-mobile__animal--buho" />
          <img src={Rana} alt="" className="dashboard-mobile__animal dashboard-mobile__animal--rana" />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
