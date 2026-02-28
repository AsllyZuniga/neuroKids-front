import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/components/Button/Button";
import Card from "@/shared/components/Card/Card";
import "./teacherLogin.scss";
import { API_CONFIG, buildApiUrl } from "@/config/api";

// CAMBIO IMPORTANTE: Importamos la imagen aquí arriba
import iconDocente from "@/assets/img/regla.svg"; 

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    usuario: {
      id: number;
      nombre: string;
      correo: string;
      rol_id: number;
      institucion_id: number;
      estado: boolean;
    };
    token: string;
    token_type: string;
    expires_in: number;
  };
  errors?: any;
}

export default function TeacherLogin() {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_LOGIN), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const data: LoginResponse = await response.json();

      if (data.success && data.data) {
        // Guardar token en localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.usuario));
        localStorage.setItem("userType", "docente");
        
        // Redirigir a la página de bienvenida para docentes
        navigate("/bienvenida/docente");
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión. Verifica que el servidor esté funcionando.");
      console.error("Error de login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToUserType = () => {
    navigate("/tipo-usuario");
  };

  return (
    <div className="teacher-login">
      <div className="teacher-login__container">
        <Card className="teacher-login__card">
          <div className="teacher-login__header">
            <div className="teacher-login__icon">
              {/* CAMBIO AQUÍ: Usamos la variable importada en lugar del texto fijo */}
              <img src={iconDocente} alt="Docente" />
            </div>
            <h1 className="teacher-login__title">Acceso Docente</h1>
            <p className="teacher-login__subtitle">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form className="teacher-login__form" onSubmit={handleSubmit}>
            <div className="teacher-login__field">
              <label className="teacher-login__label" htmlFor="correo">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                className="teacher-login__input"
                placeholder="ejemplo@escuela.edu"
                required
                disabled={loading}
              />
            </div>

            <div className="teacher-login__field">
              <label className="teacher-login__label" htmlFor="contrasena">
                Contraseña
              </label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleInputChange}
                className="teacher-login__input"
                placeholder="Tu contraseña"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="teacher-login__error">
                {error}
              </div>
            )}

            <Button
              type="submit"
              label={loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              variant="primary"
              size="large"
              disabled={loading}
              className="teacher-login__submit"
            />
          </form>

          <div className="teacher-login__footer">
            <Button
              label="← Volver a selección"
              variant="text"
              size="medium"
              onClick={handleBackToUserType}
              className="teacher-login__back"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}