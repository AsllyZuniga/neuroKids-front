import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/header";
import Button from "@/shared/components/Button/Button";
import Card from "@/shared/components/Card/Card";
import "./teacherWelcome.scss";
import { API_CONFIG, buildApiUrl } from "@/config/api";

interface Teacher {
  id: number;
  nombre: string;
  correo: string;
  rol_id: number;
  institucion_id: number;
}

export default function TeacherWelcome() {

  const avatars = [
    "/avatars/mujer.svg",
    "/avatars/hombre.svg"
  ];
  const [totalStudents, setTotalStudents] = useState<number>(0);

  const [avatarIndex, setAvatarIndex] = useState(0);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setAvatarIndex((prev) => (prev === 0 ? 1 : 0));
    }, 15000);

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const resp = await fetch(buildApiUrl("/usuarios"), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || "Error al obtener usuarios");
        }

        const data = await resp.json();
        const usuarios = data?.data?.usuarios || [];

        const onlyStudents = usuarios.filter(
          (u: any) => u.rol_id === 3
        );

        setTotalStudents(onlyStudents.length);

      } catch (error) {
        console.error("Error obteniendo estudiantes:", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    // Obtener datos del docente desde localStorage
    const userData = localStorage.getItem("user");
    const userType = localStorage.getItem("userType");

    if (!userData || userType !== "docente") {
      // Si no hay datos de docente, redirigir al login
      navigate("/tipo-usuario");
      return;
    }

    try {
      const teacherData = JSON.parse(userData);
      setTeacher(teacherData);
    } catch (error) {
      console.error("Error parsing teacher data:", error);
      navigate("/tipo-usuario");
    }

    // Actualizar la hora
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => clearInterval(timeInterval);
  }, [navigate]);

  const updateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
    setCurrentTime(timeString);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const handleViewStudents = () => {
    // TODO: Implementar página de gestión de estudiantes
    navigate("/estudiantes");
  };

  const handleViewReports = () => {
    // TODO: Implementar página de reportes
    navigate("/reportes");
  };


  const handleManageReadings = () => {
    // TODO: Implementar página de gestión de lecturas
    navigate("/lecturas");
  };

  if (!teacher) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="teacher-welcome">
      <Header />

      <div className="teacher-welcome__container">
        <div className="teacher-welcome__hero">
          <div className="teacher-welcome__hero-content">
            <div className="teacher-welcome__avatar">
              <img
                src={avatars[avatarIndex]}
                alt="Avatar Docente"
                className="teacher-welcome__avatar-img"
              />
            </div>

            <h1 className="teacher-welcome__title">
              {getGreeting()} <br />
              Profesor/a {teacher.nombre}
            </h1>

            <p className="teacher-welcome__subtitle">
              Panel de control docente - {currentTime}
            </p>

            <div className="teacher-welcome__info">
              <div className="teacher-welcome__info-item">
                <span className="teacher-welcome__info-label">Correo:</span>
                <span className="teacher-welcome__info-value">{teacher.correo}</span>
              </div>
              <div className="teacher-welcome__info-item">
                <span className="teacher-welcome__info-label">Rol:</span>
                <span className="teacher-welcome__info-value">
                  {teacher.rol_id === 1 ? "Administrador" : "Docente"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="teacher-welcome__actions">
          <h2 className="teacher-welcome__actions-title">Herramientas de Gestión</h2>

          <div className="teacher-welcome__cards">
            <Card className="teacher-welcome__card teacher-welcome__card--primary">
              <div className="teacher-welcome__card-icon">
                <img src="/avatars/estudiantes.svg" alt="Estudiantes" />
              </div>
              <h3 className="teacher-welcome__card-title">Mis Estudiantes</h3>
              <p className="teacher-welcome__card-description">
                Gestiona y revisa el listado de tus estudiantes
              </p>
              <Button
                label="Ver Estudiantes"
                variant="primary"
                size="large"
                onClick={handleViewStudents}
                className="teacher-welcome__card-button"
              />
            </Card>

            <Card className="teacher-welcome__card teacher-welcome__card--secondary">
              <div className="teacher-welcome__card-icon">
                <img src="/avatars/reportes.svg" alt="Reportes" />
              </div>
              <h3 className="teacher-welcome__card-title">Reportes</h3>
              <p className="teacher-welcome__card-description">
                Analiza el rendimiento y progreso de tus estudiantes
              </p>
              <Button
                label="Ver Reportes"
                variant="secondary"
                size="large"
                onClick={handleViewReports}
                className="teacher-welcome__card-button"
              />
            </Card>



            <Card className="teacher-welcome__card teacher-welcome__card--quaternary">
              <div className="teacher-welcome__card-icon">
                <img src="/avatars/lecturas.svg" alt="Lecturas" />
              </div>
              <h3 className="teacher-welcome__card-title">Lecturas</h3>
              <p className="teacher-welcome__card-description">
                Administra el contenido de lectura disponible
              </p>
              <Button
                label="Gestionar Lecturas"
                variant="secondary"
                size="large"
                onClick={handleManageReadings}
                className="teacher-welcome__card-button"
              />
            </Card>
          </div>
        </div>

        <div className="teacher-welcome__stats">
          <div className="teacher-welcome__stats-card">
            <h3 className="teacher-welcome__stats-title">Resumen Rápido</h3>
            <div className="teacher-welcome__stats-grid">
              <div className="teacher-welcome__stat-item">
                <div className="teacher-welcome__stat-number">
                  {totalStudents}
                </div>
                <div className="teacher-welcome__stat-label">Estudiantes Activos</div>
              </div>
              <div className="teacher-welcome__stat-item">
                <div className="teacher-welcome__stat-number">--</div>
                <div className="teacher-welcome__stat-label">Lecturas Completadas</div>
              </div>
              <div className="teacher-welcome__stat-item">
                <div className="teacher-welcome__stat-number">--</div>
                <div className="teacher-welcome__stat-label">Promedio General</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
