export const API_CONFIG = {
    BASE_URL: "http://localhost:8000/api",
    ENDPOINTS: {
        // Endpoints para docentes/administradores
        ADMIN_LOGIN: "/admin/login",

        // Endpoints para estudiantes
        STUDENT_LOGIN: "/estudiantes/iniciar-sesion",
        STUDENT_REGISTER: "/students/register",
        STUDENT_INSTITUCIONES: "/estudiantes/instituciones",

        // Endpoints comunes
        LOGOUT: "/logout",
        ME: "/me",
        REFRESH: "/refresh"
    }
};

// Helper function para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};
