// src/api/fileService.ts
import { getApiUrl, API_CONFIG } from "../config";
import { authService } from "../login/auth";

interface Archivo {
  nombre: string;
  extension: string;
  contenido: string;
  tamano: number;
  fechaCreacion: string;
  fechaModificacion: string;
}

export const fileService = {
  async listarArchivos(path = "root"): Promise<Archivo[]> {
    const usuario = authService.getUserData();
    if (!usuario) throw new Error("Usuario no autenticado");

    const url = getApiUrl(
      `${API_CONFIG.ENDPOINTS.ARCHIVOS.replace("{nombre}", usuario.nombre)}?path=${path}`
    );

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("No se pudieron obtener los archivos");
    }

    return res.json();
  },
};
