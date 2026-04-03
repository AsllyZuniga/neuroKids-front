import { buildApiUrl } from "@/config/api";

/** Registra una visita al panel del estudiante (antiduplicado en servidor ~25 min). Silencioso si falla. */
export async function registerStudentPlatformVisit(): Promise<void> {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    await fetch(buildApiUrl("/auth/estudiantes/registrar-visita"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
  } catch {
    /* ignorar: red o servidor */
  }
}
