import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/components/Button/Button";
import Card from "@/shared/components/Card/Card";
import "./adminLogin.scss";
import { API_CONFIG, buildApiUrl } from "@/config/api";

interface AdminLoginResponse {
  success: boolean;
  message: string;
  data?: {
    usuario?: { id: number; nombre: string; correo: string; rol_id: number; estado: boolean };
    administrador?: { id: number; nombre: string; correo: string; rol_id?: number; estado?: boolean };
    token: string;
    token_type?: string;
    expires_in?: number;
  };
  errors?: any;
}

export default function AdminLogin() {
  const [formData, setFormData] = useState({ correo: "", contrasena: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ADMIN_LOGIN), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data: AdminLoginResponse = await response.json();
      if (data.success && data.data?.token) {
        const usuario = data.data.usuario ?? data.data.administrador;
        const userToStore = usuario ?? { nombre: "Administrador", correo: formData.correo };
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(userToStore));
        localStorage.setItem("userType", "admin");
        navigate("/perfil/admin", { replace: true });
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión. Verifica que el servidor esté funcionando.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__container">
        <Card className="admin-login__card">
          <div className="admin-login__header">
            <div className="admin-login__icon">
              <img src="/avatars/admin.svg" alt="Administrador" />
            </div>
            <h1 className="admin-login__title">Acceso Administrador</h1>
            <p className="admin-login__subtitle">Ingresa tus credenciales de administrador</p>
          </div>

          <form className="admin-login__form" onSubmit={handleSubmit}>
            <div className="admin-login__field">
              <label className="admin-login__label" htmlFor="correo">Correo Electrónico</label>
              <input
                type="email" id="correo" name="correo"
                value={formData.correo} onChange={handleInputChange}
                className="admin-login__input" placeholder="admin@neurokids.click"
                required disabled={loading}
              />
            </div>
            <div className="admin-login__field">
              <label className="admin-login__label" htmlFor="contrasena">Contraseña</label>
              <input
                type="password" id="contrasena" name="contrasena"
                value={formData.contrasena} onChange={handleInputChange}
                className="admin-login__input" placeholder="Tu contraseña"
                required disabled={loading}
              />
            </div>
            {error && <div className="admin-login__error">{error}</div>}
            <Button
              type="submit"
              label={loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              variant="primary" size="large" disabled={loading}
              className="admin-login__submit"
            />
          </form>

          <div className="admin-login__footer">
            <Button
              label="← Volver a selección" variant="text" size="medium"
              onClick={() => navigate("/tipo-usuario")}
              className="admin-login__back"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}