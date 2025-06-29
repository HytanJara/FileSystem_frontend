// src/api/uploadService.ts
import { getApiUrl, API_CONFIG } from "../config";
import { authService } from "../login/auth";

interface UploadResponse {
  success: boolean;
  message: string;
}

export const uploadService = {
  async uploadFile(file: File, path = "root"): Promise<UploadResponse> {
    const user = authService.getUserData();
    if (!user) return { success: false, message: "Usuario no autenticado" };

    const fileName = file.name.split(".")[0];
    const extension = file.name.split(".").pop() || "";

    const contenido = await file.text();

    const url = getApiUrl(`${API_CONFIG.ENDPOINTS.ARCHIVOS.replace("{nombre}", user.nombre)}`);

    const body = {
      path,
      nombre: fileName,
      extension,
      contenido,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        return { success: false, message: err.error || "Error al subir archivo" };
      }

      return { success: true, message: "Archivo subido correctamente" };
    } catch (e) {
      return { success: false, message: "Error de red al subir archivo" };
    }
  },
};
