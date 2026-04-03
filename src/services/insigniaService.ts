import { buildApiUrl, API_CONFIG } from '../config/api';

export interface Insignia {
    id: string;
    nombre: string;
    descripcion: string;
    icono: string;
    color_hex: string;
    categoria: string;
    rareza: string;
    puntos_otorgados: number;
    estado: boolean;
}

/** Respuesta de GET .../estudiante/:id/catalogo — nombres desde tabla `insignias` */
export interface InsigniaCatalogoItem {
    id: number;
    nombre: string;
    descripcion: string;
    icono: string | null;
    color_hex: string | null;
    categoria: string | null;
    rareza: string | null;
    puntos_otorgados: number | null;
    desbloqueada: boolean;
    obtenido_at: string | null;
    progreso_actual: number | null;
    progreso_requerido: number | null;
}

export interface NotificacionInsignia {
    id: string;
    estudiante_id: string;
    tipo_notificacion: string;
    titulo: string;
    mensaje: string;
    insignia_relacionada_id: string;
    leida: boolean;
    created_at: string;
    insignia: Insignia;
}

export const insigniaService = {
    // Obtener notificaciones pendientes
    async getNotificacionesPendientes(estudianteId: string): Promise<NotificacionInsignia[]> {
        try {
            const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.STUDENT_NOTIFICATIONS}/${estudianteId}`);
            console.log('🌐 Llamando API:', url);

            const response = await fetch(url);
            console.log('📡 Respuesta recibida:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📋 Datos recibidos:', data);

            return data.success ? data.data : [];
        } catch (error) {
            console.error('❌ Error en getNotificacionesPendientes:', error);
            return [];
        }
    },

    /** Marca una notificación concreta como leída (cualquier insignia). */
    async marcarNotificacionLeida(estudianteId: string, notificacionId: string | number): Promise<boolean> {
        try {
            const url = buildApiUrl(
                `${API_CONFIG.ENDPOINTS.MARK_ONE_NOTIFICATION_READ}/${estudianteId}/${notificacionId}`
            );
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('❌ Error en marcarNotificacionLeida:', error);
            return false;
        }
    },

    // Marcar notificación de bienvenida como leída
    async marcarBienvenidaLeida(estudianteId: string): Promise<boolean> {
        try {
            const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.MARK_NOTIFICATION_READ}/${estudianteId}`);
            console.log('🌐 Marcando como leída:', url);

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Insignia marcada como leída:', data);

            return data.success;
        } catch (error) {
            console.error('❌ Error en marcarBienvenidaLeida:', error);
            return false;
        }
    },

    /** Catálogo completo de insignias (BD) con estado bloqueada / desbloqueada */
    async getCatalogoInsigniasEstudiante(estudianteId: string): Promise<InsigniaCatalogoItem[]> {
        try {
            const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.STUDENT_INSIGNIAS}/${estudianteId}/catalogo`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error('❌ Error en getCatalogoInsigniasEstudiante:', error);
            return [];
        }
    },

    // Obtener insignias del estudiante
    async getInsigniasEstudiante(estudianteId: string): Promise<any[]> {
        try {
            const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.STUDENT_INSIGNIAS}/${estudianteId}`);
            console.log('🌐 Obteniendo insignias:', url);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('🏆 Insignias del estudiante:', data);

            return data.success ? data.data : [];
        } catch (error) {
            console.error('❌ Error en getInsigniasEstudiante:', error);
            return [];
        }
    }
};