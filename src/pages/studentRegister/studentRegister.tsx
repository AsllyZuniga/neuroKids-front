import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../shared/components/Button/Button";
import Card from "../../shared/components/Card/Card";
import "./studentRegister.scss";

import { API_CONFIG, buildApiUrl } from "../../config/api";

interface Institucion {
  id: number;
  nombre: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    estudiante: {
      id: number;
      nombre: string;
      apellido: string;
      codigo_estudiante: string;
      edad: number;
      num_documento: string;
      institucion_id: number;
      institucion: string;
      estado: boolean;
    };
    token: string;
    token_type: string;
    expires_in: number;
  };
  errors?: any;
}

interface InstitucionesResponse {
  success: boolean;
  data?: {
    instituciones: Institucion[];
  };
}

export default function StudentRegister() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    num_documento: "",
    institucion_id: ""
  });
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingInstituciones, setLoadingInstituciones] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
        setInstituciones(data.data.instituciones);
        console.log("Instituciones cargadas:", data.data.instituciones.length);
      } else {
        console.error("Error en la respuesta:", data.message || "Respuesta no exitosa");
        setError(data.message || "Error al cargar las escuelas disponibles");
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
    if (success) setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validar campos obligatorios
      if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.institucion_id) {
        setError("Por favor completa todos los campos obligatorios (nombre, apellido y escuela)");
        setLoading(false);
        return;
      }

      const requestData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        institucion_id: parseInt(formData.institucion_id),
        ...(formData.edad && { edad: parseInt(formData.edad) }),
        ...(formData.num_documento && { num_documento: formData.num_documento.trim() })
      };

      // Verificar que institucion_id sea un número válido
      if (isNaN(requestData.institucion_id)) {
        setError("Por favor selecciona una escuela válida");
        setLoading(false);
        return;
      }

      console.log("Datos enviados al registro de estudiante:", requestData);

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.STUDENT_REGISTER), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData)
      });

      const data: RegisterResponse = await response.json();

      if (data.success && data.data) {
        // Guardar token en localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.estudiante));
        localStorage.setItem("userType", "estudiante");
        
        setSuccess("¡Cuenta creada exitosamente! Redirigiendo...");
        
        // Redirigir a la página de bienvenida después de 2 segundos
        setTimeout(() => {
          navigate("/bienvenida/estudiante");
        }, 2000);
      } else {
        setError(data.message || "Error al crear la cuenta");
      }
    } catch (err) {
      setError("Error de conexión. Verifica que el servidor esté funcionando.");
      console.error("Error de registro:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/estudiante/login");
  };

  return (
    <div className="student-register">
      <div className="student-register__container">
        <Card className="student-register__card">
          <div className="student-register__header">
            <div className="student-register__icon">
              <img src="/src/assets/img/cohete.svg" alt="Registro Estudiante" />
            </div>
            <h1 className="student-register__title">¡Únete a NeuroKids!</h1>
            <p className="student-register__subtitle">
              Crea tu cuenta para comenzar tu aventura de lectura
            </p>
          </div>

          <form className="student-register__form" onSubmit={handleSubmit}>
            <div className="student-register__field">
              <label className="student-register__label" htmlFor="nombre">
                Tu Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="student-register__input"
                placeholder="Escribe tu nombre"
                required
                disabled={loading}
                maxLength={50}
              />
            </div>

            <div className="student-register__field">
              <label className="student-register__label" htmlFor="apellido">
                Tu Apellido *
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="student-register__input"
                placeholder="Escribe tu apellido"
                required
                disabled={loading}
                maxLength={50}
              />
            </div>

            <div className="student-register__row">
              <div className="student-register__field">
                <label className="student-register__label" htmlFor="edad">
                  Tu Edad
                </label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  className="student-register__input"
                  placeholder="¿Cuántos años tienes?"
                  min={7}
                  max={18}
                  disabled={loading}
                />
              </div>

              <div className="student-register__field">
                <label className="student-register__label" htmlFor="num_documento">
                  Documento
                </label>
                <input
                  type="text"
                  id="num_documento"
                  name="num_documento"
                  value={formData.num_documento}
                  onChange={handleInputChange}
                  className="student-register__input"
                  placeholder="Número de documento"
                  disabled={loading}
                  maxLength={20}
                />
              </div>
            </div>

            <div className="student-register__field">
              <label className="student-register__label" htmlFor="institucion_id">
                Tu Escuela *
              </label>
              <select
                id="institucion_id"
                name="institucion_id"
                value={formData.institucion_id}
                onChange={handleInputChange}
                className="student-register__select"
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
                <p className="student-register__loading-text">Cargando lista de escuelas...</p>
              )}
              {!loadingInstituciones && instituciones.length === 0 && (
                <p className="student-register__error-text">
                  No se pudieron cargar las escuelas. Verifica tu conexión a internet.
                </p>
              )}
            </div>

            {error && (
              <div className="student-register__error">
                {error}
              </div>
            )}

            {success && (
              <div className="student-register__success">
                {success}
              </div>
            )}

            <Button
              type="submit"
              label={loading ? "Creando cuenta..." : "¡Crear mi cuenta!"}
              variant="primary"
              size="large"
              disabled={loading || loadingInstituciones}
              className="student-register__submit"
            />
          </form>

          <div className="student-register__footer">
            <p className="student-register__login-text">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={handleBackToLogin}
                className="student-register__login-link"
                disabled={loading}
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
