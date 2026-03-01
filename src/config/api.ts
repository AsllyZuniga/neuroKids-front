export const API_CONFIG = {
    BASE_URL: "http://localhost:3000",
    ENDPOINTS: {
        // Endpoints para docentes/administradores
        ADMIN_LOGIN: "/admin/login",

        // Endpoints para estudiantes
        STUDENT_LOGIN: "/auth/estudiantes/iniciar-sesion",
        // Coincide con ruta backend: POST /api/estudiantes/registro
        STUDENT_REGISTER: "/auth/estudiantes/registro",
        STUDENT_INSTITUCIONES: "/auth/instituciones",

        // Endpoints comunes
        LOGOUT: "auth/logout",
        ME: "/me",
        REFRESH: "/refresh"
    }
};

// Helper function para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};
