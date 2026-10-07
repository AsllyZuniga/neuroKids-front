import { buildApiUrl } from "@/config/api";


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

  }
}
