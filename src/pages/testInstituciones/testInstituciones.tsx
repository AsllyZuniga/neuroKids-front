import { useState, useEffect } from "react";
import { API_CONFIG, buildApiUrl } from "../../config/api";

interface Institucion {
  id: number;
  nombre: string;
}

interface InstitucionesResponse {
  success: boolean;
  data?: {
    instituciones: Institucion[];
  };
  message?: string;
}

export default function TestInstituciones() {
  const [instituciones, setInstituciones] = useState<Institucion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    testEndpoint();
  }, []);

  const testEndpoint = async () => {
    setLoading(true);
    setError("");
    
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.STUDENT_INSTITUCIONES);
      console.log("🔍 Probando endpoint:", url);
      
      const response = await fetch(url);
      console.log("📡 Respuesta:", response.status, response.statusText);
      
      const rawText = await response.text();
      console.log("📄 Respuesta cruda:", rawText);
      
      let data: InstitucionesResponse;
      try {
        data = JSON.parse(rawText);
        console.log("📊 Datos parseados:", data);
        setResponse(data);
      } catch (parseError) {
        console.error("❌ Error parseando JSON:", parseError);
        setError(`Error parseando respuesta: ${rawText.substring(0, 200)}...`);
        return;
      }
      
      if (!response.ok) {
        setError(`HTTP Error: ${response.status} ${response.statusText}`);
        return;
      }
      
      if (data.success && data.data) {
        setInstituciones(data.data.instituciones);
        console.log("✅ Instituciones cargadas:", data.data.instituciones);
      } else {
        setError(data.message || "Respuesta no exitosa");
      }
    } catch (err) {
      console.error("❌ Error general:", err);
      setError(`Error de conexión: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    testEndpoint();
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🧪 Test de Endpoint de Instituciones</h1>
      
      <div style={{ marginBottom: "2rem" }}>
        <p><strong>URL:</strong> {buildApiUrl(API_CONFIG.ENDPOINTS.STUDENT_INSTITUCIONES)}</p>
        <p><strong>Estado:</strong> {loading ? "Cargando..." : "Completado"}</p>
      </div>

      <button onClick={handleRetry} disabled={loading} style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}>
        🔄 Probar de nuevo
      </button>

      {error && (
        <div style={{ 
          backgroundColor: "#ffebee", 
          color: "#c62828", 
          padding: "1rem", 
          borderRadius: "8px", 
          marginBottom: "1rem",
          borderLeft: "4px solid #f44336"
        }}>
          <h3>❌ Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "1rem", 
          borderRadius: "8px", 
          marginBottom: "1rem"
        }}>
          <h3>📊 Respuesta del servidor:</h3>
          <pre style={{ overflow: "auto", fontSize: "0.8rem" }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {instituciones.length > 0 && (
        <div style={{ 
          backgroundColor: "#e8f5e8", 
          padding: "1rem", 
          borderRadius: "8px",
          borderLeft: "4px solid #4caf50"
        }}>
          <h3>✅ Instituciones cargadas ({instituciones.length}):</h3>
          <ul>
            {instituciones.map((institucion) => (
              <li key={institucion.id}>
                <strong>ID:</strong> {institucion.id} - <strong>Nombre:</strong> {institucion.nombre}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#666" }}>
        <p>💡 <strong>Instrucciones:</strong></p>
        <ul>
          <li>Abre las herramientas de desarrollador (F12)</li>
          <li>Ve a la pestaña "Console"</li>
          <li>Observa los logs detallados del proceso</li>
          <li>Si hay errores de CORS, configura el backend</li>
          <li>Si no hay datos, verifica que existan instituciones en la base de datos</li>
        </ul>
      </div>
    </div>
  );
}
