import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Button from "../../shared/components/Button/Button";
import Card from "../../shared/components/Card/Card";
import "./studentWelcome.scss";

interface Student {
  id: number;
  nombre: string;
  apellido: string;
  codigo_estudiante: string;
  edad?: number;
  institucion: string;
}

export default function StudentWelcome() {
  const [student, setStudent] = useState<Student | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener datos del estudiante desde localStorage
    const userData = localStorage.getItem("user");
    const userType = localStorage.getItem("userType");
    
    if (!userData || userType !== "estudiante") {
      // Si no hay datos de estudiante, redirigir al login
      navigate("/tipo-usuario");
      return;
    }

    try {
      const studentData = JSON.parse(userData);
      setStudent(studentData);
    } catch (error) {
      console.error("Error parsing student data:", error);
      navigate("/tipo-usuario");
    }
  }, [navigate]);

  const handleStartReading = () => {
    navigate("/");
  };

  const handleViewProgress = () => {
    // TODO: Implementar página de progreso del estudiante
    navigate("/progreso");
  };

  if (!student) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="student-welcome">
      <Header />
      
      <div className="student-welcome__container">
        <div className="student-welcome__hero">
          <div className="student-welcome__hero-content">
            <div className="student-welcome__avatar">
              <img src="/src/assets/img/cohete.svg" alt="Avatar Estudiante" />
            </div>
            
            <h1 className="student-welcome__title">
              ¡Hola, {student.nombre}! 🚀
            </h1>
            
            <p className="student-welcome__subtitle">
              Bienvenido de nuevo a tu aventura de lectura
            </p>

            <div className="student-welcome__info">
              <div className="student-welcome__info-item">
                <span className="student-welcome__info-label">Escuela:</span>
                <span className="student-welcome__info-value">{student.institucion}</span>
              </div>
              {student.edad && (
                <div className="student-welcome__info-item">
                  <span className="student-welcome__info-label">Edad:</span>
                  <span className="student-welcome__info-value">{student.edad} años</span>
                </div>
              )}
              <div className="student-welcome__info-item">
                <span className="student-welcome__info-label">Código:</span>
                <span className="student-welcome__info-value">{student.codigo_estudiante}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="student-welcome__actions">
          <h2 className="student-welcome__actions-title">¿Qué quieres hacer hoy?</h2>
          
          <div className="student-welcome__cards">
            <Card className="student-welcome__card student-welcome__card--primary">
              <div className="student-welcome__card-icon">
                <img src="/src/assets/img/cuaderno.svg" alt="Lecturas" />
              </div>
              <h3 className="student-welcome__card-title">Comenzar a Leer</h3>
              <p className="student-welcome__card-description">
                Explora nuevas historias y mejora tu comprensión lectora
              </p>
              <Button
                label="¡Vamos a leer!"
                variant="primary"
                size="large"
                onClick={handleStartReading}
                className="student-welcome__card-button"
              />
            </Card>

            <Card className="student-welcome__card student-welcome__card--secondary">
              <div className="student-welcome__card-icon">
                <img src="/src/assets/img/paletaColores.svg" alt="Progreso" />
              </div>
              <h3 className="student-welcome__card-title">Mi Progreso</h3>
              <p className="student-welcome__card-description">
                Ve cuánto has avanzado y las insignias que has ganado
              </p>
              <Button
                label="Ver mi progreso"
                variant="secondary"
                size="large"
                onClick={handleViewProgress}
                className="student-welcome__card-button"
              />
            </Card>
          </div>
        </div>

        <div className="student-welcome__motivational">
          <div className="student-welcome__quote">
            <img src="/src/assets/img/arcoiris.svg" alt="Motivación" className="student-welcome__quote-icon" />
            <p className="student-welcome__quote-text">
              "Cada página que lees te hace más fuerte y más inteligente. ¡Sigue así!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
