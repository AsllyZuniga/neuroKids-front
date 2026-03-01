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

        // Endpoints para insignias y notificaciones
        STUDENT_INSIGNIAS: "/insignias-estudiante/estudiante",
        STUDENT_NOTIFICATIONS: "/notificaciones-estudiante/pendientes",
        MARK_NOTIFICATION_READ: "/notificaciones-estudiante/completar-bienvenida",

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
