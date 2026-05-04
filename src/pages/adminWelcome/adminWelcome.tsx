import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header/header";
import Button from "@/shared/components/Button/Button";
import Card from "@/shared/components/Card/Card";
import "./adminWelcome.scss";
import { buildApiUrl } from "@/config/api";

interface AdminUser {
  id?: number;
  nombre: string;
  correo?: string;
  rol_id?: number;
}

export default function AdminWelcome() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalReadingsCompleted, setTotalReadingsCompleted] = useState<number>(0);
  const [totalGamesCompleted, setTotalGamesCompleted] = useState<number>(0);
  const [generalAverage, setGeneralAverage] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    if (!token || userType !== "admin") {
      navigate("/tipo-usuario");
      return;
    }
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      try {
        setAdmin(JSON.parse(userData));
      } catch {
        navigate("/tipo-usuario");
      }
    }
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, [navigate]);

  useEffect(() => {
    const fetchQuickStats = async () => {
      const token = localStorage.getItem("token");
      if (!token || localStorage.getItem("userType") !== "admin") return;
      try {
        setStatsLoading(true);
        const resp = await fetch(buildApiUrl("/reportes/estudiantes"), {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!resp.ok) return;
        const data = await resp.json();
        const estudiantes = Array.isArray(data?.data?.estudiantes) ? data.data.estudiantes : [];
        setTotalStudents(estudiantes.length);

        const totalLecturas = estudiantes.reduce(
          (acc: number, row: any) =>
            acc + Number(row?.resumen?.lecturas_usadas ?? row?.resumen?.lecturas_completadas ?? 0),
          0
        );
        setTotalReadingsCompleted(totalLecturas);

        const totalJuegos = estudiantes.reduce(
          (acc: number, row: any) =>
            acc + Number(row?.resumen?.juegos_usados ?? row?.resumen?.juegos_completados ?? 0),
          0
        );
        setTotalGamesCompleted(totalJuegos);

        const avg =
          estudiantes.length > 0
            ? Math.round(
                estudiantes.reduce(
                  (acc: number, row: any) => acc + Number(row?.resumen?.puntos_totales ?? 0),
                  0
                ) / estudiantes.length
              )
            : 0;
        setGeneralAverage(avg);
      } catch (e) {
        console.error("Error obteniendo resumen rápido:", e);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchQuickStats();
    const refreshId = setInterval(fetchQuickStats, 30000);
    return () => clearInterval(refreshId);
  }, []);

  const updateTime = () => {
    setCurrentTime(
      new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const handleViewStudents = () => navigate("/estudiantes");

  const handleViewTeachers = () => navigate("/docentes");

  const handleViewInstitutions = () => navigate("/instituciones");
  const handleViewReports = () => navigate("/reportes");

  // const handleManageReadings = () => navigate("/lecturas");

  if (!admin) {
    return <div className="admin-welcome-loading">Cargando...</div>;
  }

  return (
    <div className="admin-welcome">
      <Header />
      <div className="admin-welcome__container">
        <div className="admin-welcome__hero">
          <div className="admin-welcome__hero-content">
            <div className="admin-welcome__avatar">
              <img src="/avatars/admin.svg" alt="Administrador" className="admin-welcome__avatar-img" />
            </div>
            <h1 className="admin-welcome__title">
              {getGreeting()} <br />
              {admin.nombre}
            </h1>
            <p className="admin-welcome__subtitle">
              Panel de administración - {currentTime}
            </p>
            <div className="admin-welcome__info">
              {admin.correo && (
                <div className="admin-welcome__info-item">
                  <span className="admin-welcome__info-label">Correo:</span>
                  <span className="admin-welcome__info-value">{admin.correo}</span>
                </div>
              )}
              <div className="admin-welcome__info-item">
                <span className="admin-welcome__info-label">Rol:</span>
                <span className="admin-welcome__info-value">Administrador</span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-welcome__actions">
          <h2 className="admin-welcome__actions-title">Herramientas de Gestión</h2>
          <div className="admin-welcome__cards">
            <Card className="admin-welcome__card admin-welcome__card--primary">
              <div className="admin-welcome__card-icon">
                <img src="/avatars/estudiantes.svg" alt="Estudiantes" />
              </div>
              <h3 className="admin-welcome__card-title">Estudiantes</h3>
              <p className="admin-welcome__card-description">
                Gestiona y revisa el listado de estudiantes
              </p>
              <Button
                label="Ver Estudiantes"
                variant="primary"
                size="large"
                onClick={handleViewStudents}
                className="admin-welcome__card-button"
              />
            </Card>
            <Card className="admin-welcome__card admin-welcome__card--secondary">
              <div className="admin-welcome__card-icon">
                <img src="/avatars/hombre.svg" alt="Docentes" />
              </div>
              <h3 className="admin-welcome__card-title">Docentes</h3>
              <p className="admin-welcome__card-description">
                Gestiona y registra docentes por institución
              </p>
              <Button
                label="Ver Docentes"
                variant="secondary"
                size="large"
                onClick={handleViewTeachers}
                className="admin-welcome__card-button"
              />
            </Card>
            <Card className="admin-welcome__card admin-welcome__card--secondary">
              <div className="admin-welcome__card-icon">
                <img src="/avatars/estudiante1.svg" alt="Instituciones" />
              </div>
              <h3 className="admin-welcome__card-title">Instituciones</h3>
              <p className="admin-welcome__card-description">
                Gestiona y registra las instituciones educativas
              </p>
              <Button
                label="Ver Instituciones"
                variant="secondary"
                size="large"
                onClick={handleViewInstitutions}
                className="admin-welcome__card-button"
              />
            </Card>
            <Card className="admin-welcome__card admin-welcome__card--quaternary">
              <div className="admin-welcome__card-icon">
                <img src="/avatars/reportes.svg" alt="Reportes" />
              </div>
              <h3 className="admin-welcome__card-title">Reportes</h3>
              <p className="admin-welcome__card-description">
                Analiza el rendimiento y progreso
              </p>
              <Button
                label="Ver Reportes"
                variant="secondary"
                size="large"
                onClick={handleViewReports}
                className="admin-welcome__card-button"
              />
            </Card>
            {/* <Card className="admin-welcome__card admin-welcome__card--secondary">
              <div className="admin-welcome__card-icon">
                <img src="/avatars/lecturas.svg" alt="Lecturas" />
              </div>
              <h3 className="admin-welcome__card-title">Lecturas</h3>
              <p className="admin-welcome__card-description">
                Administra el contenido de lectura disponible
              </p>
              <Button
                label="Gestionar Lecturas"
                variant="secondary"
                size="large"
                onClick={handleManageReadings}
                className="admin-welcome__card-button"
              />
            </Card> */}
          </div>
        </div>

        <div className="admin-welcome__stats">
          <div className="admin-welcome__stats-card">
            <h3 className="admin-welcome__stats-title">Resumen Rápido</h3>
            <div className="admin-welcome__stats-grid">
              <div className="admin-welcome__stat-item">
                <div className="admin-welcome__stat-number">{totalStudents}</div>
                <div className="admin-welcome__stat-label">Estudiantes Activos</div>
              </div>
              <div className="admin-welcome__stat-item">
                <div className="admin-welcome__stat-number">
                  {statsLoading ? "..." : totalReadingsCompleted}
                </div>
                <div className="admin-welcome__stat-label">Lecturas Usadas</div>
              </div>
              <div className="admin-welcome__stat-item">
                <div className="admin-welcome__stat-number">
                  {statsLoading ? "..." : totalGamesCompleted}
                </div>
                <div className="admin-welcome__stat-label">Juegos Usados</div>
              </div>
              <div className="admin-welcome__stat-item">
                <div className="admin-welcome__stat-number">
                  {statsLoading ? "..." : generalAverage}
                </div>
                <div className="admin-welcome__stat-label">Promedio General de Puntos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
