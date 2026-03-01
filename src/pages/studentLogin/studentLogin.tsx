import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/components/Button/Button";
import Card from "@/shared/components/Card/Card";
import "./studentLogin.scss";

import { API_CONFIG, buildApiUrl } from "@/config/api";

interface Institucion {
  id: string;
  nombre: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    estudiante: {
      id: number;
      nombre: string;
      apellido: string;
      codigo_estudiante: string;
      institucion_id: number;
      institucion: string;
      estado: boolean;
    };
    token: string;
    token_type: string;
    expires_in: number;
  };
  errors?: Record<string, string[]>;
}

interface InstitucionesResponse {
  success: boolean;
  message?: string;
  data?: Institucion[];
}

export default function StudentLogin() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    institucion_id: ""
  });
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInstituciones, setLoadingInstituciones] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstituciones();
  }, []);

  const fetchInstituciones = async () => {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.STUDENT_INSTITUCIONES);
      console.log("Cargando instituciones desde:", url);
      
      const response = await fetch(url);
      console.log("Respuesta del servidor:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: InstitucionesResponse = await response.json();
      console.log("Datos recibidos:", data);
      
      if (data.success && data.data) {
        setInstituciones(data.data);
        console.log("Instituciones cargadas:", data.data.length);
      } else {
        console.error("Error en la respuesta:", data.message ?? "Respuesta no exitosa");
        setError(data.message ?? "Error al cargar las escuelas disponibles");
      }
    } catch (err) {
      console.error("Error al cargar instituciones:", err);
      setError("Error de conexión. Verifica que el servidor esté funcionando.");
    } finally {
      setLoadingInstituciones(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const playClick = useCallback(() => {
    try {
  const AnyWindow = window as typeof window & { webkitAudioContext?: typeof AudioContext };
  const ctx = new (window.AudioContext || AnyWindow.webkitAudioContext!)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 800; // subtle tone
      gain.gain.value = 0.05; // soft volume
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05); // very short
    } catch {
      // ignore audio errors silently
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setLoading(true);
    setError("");

    try {
      // Validar que todos los campos estén completos
      if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.institucion_id) {
        setError("Por favor completa todos los campos");
        setLoading(false);
        return;
      }

      const requestData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        institucion_id: formData.institucion_id
      };
      
      // Verificar que institucion_id esté seleccionado
      if (!requestData.institucion_id) {
        setError("Por favor selecciona una escuela válida");
        setLoading(false);
        return;
      }
      
      console.log("Datos enviados al login de estudiante:", requestData);
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.STUDENT_LOGIN), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData)
      });

      console.log("Respuesta del login:", response.status, response.statusText);

      const data: LoginResponse = await response.json();
      console.log("Datos de respuesta:", data);

      if (data.success && data.data) {
        // Guardar token en localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.estudiante));
        localStorage.setItem("userType", "estudiante");
        
        // Redirigir a la página de bienvenida para estudiantes
        navigate("/bienvenida/estudiante");
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
    playClick();
    navigate("/tipo-usuario");
  };

  const handleGoToRegister = () => {
    playClick();
    navigate("/estudiante/registro");
  };

  return (
    <div className="student-login">
      <div className="student-login__floating">
        <span className="item item--1">🚀</span>
        <span className="item item--2">🧠</span>
        <span className="item item--3">⭐</span>
        <span className="item item--4">📚</span>
        <span className="item item--5">✨</span>
      </div>
      <div className="student-login__container">
        <Card className="student-login__card">
          <div className="student-login__header">
            <div className="student-login__icon">
              <img src="/avatars/estudiante.svg" alt="Estudiante" />
            </div>
            <h1 className="student-login__title">¡Hola Estudiante!</h1>
            <p className="student-login__subtitle">
              Ingresa tu nombre, apellido y escuela
            </p>
          </div>

          <form className="student-login__form" onSubmit={handleSubmit}>
            <div className="student-login__field">
              <label className="student-login__label" htmlFor="nombre">
                Tu Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="student-login__input"
                placeholder="Escribe tu nombre"
                required
                disabled={loading}
                maxLength={50}
              />
            </div>

            <div className="student-login__field">
              <label className="student-login__label" htmlFor="apellido">
                Tu Apellido
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="student-login__input"
                placeholder="Escribe tu apellido"
                required
                disabled={loading}
                maxLength={50}
              />
            </div>

            <div className="student-login__field">
              <label className="student-login__label" htmlFor="institucion_id">
                Tu Escuela
              </label>
              <select
                id="institucion_id"
                name="institucion_id"
                value={formData.institucion_id}
                onChange={handleInputChange}
                className="student-login__select"
                required
                disabled={loading || loadingInstituciones}
              >
                <option value="">
                  {loadingInstituciones ? "Cargando escuelas..." : 
                   instituciones.length === 0 ? "No se pudieron cargar las escuelas" :
                   "Selecciona tu escuela"}
                </option>
                {instituciones.map((institucion) => (
                  <option key={institucion.id} value={institucion.id}>
                    {institucion.nombre}
                  </option>
                ))}
              </select>
              {loadingInstituciones && (
                <p className="student-login__loading-text">Cargando lista de escuelas...</p>
              )}
              {!loadingInstituciones && instituciones.length === 0 && (
                <p className="student-login__error-text">
                  No se pudieron cargar las escuelas. Verifica tu conexión a internet.
                </p>
              )}
            </div>

            {error && (
              <div className="student-login__error">
                {error}
              </div>
            )}

            <Button
              type="submit"
              label={loading ? "Ingresando..." : "¡Entrar a NeuroKids!"}
              variant="primary"
              size="large"
              disabled={loading || loadingInstituciones}
              className="student-login__submit"
            />
          </form>

          <div className="student-login__footer">
            <p className="student-login__register-text">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={handleGoToRegister}
                className="student-login__register-link"
                disabled={loading}
              >
                Regístrate aquí
              </button>
            </p>
            
            <Button
              label="← Volver a selección"
              variant="text"
              size="medium"
              onClick={handleBackToUserType}
              className="student-login__back"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
