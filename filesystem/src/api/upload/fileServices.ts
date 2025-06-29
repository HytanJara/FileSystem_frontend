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

  async subirArchivo({
    nombre,
    extension,
    contenido,
    path,
  }: {
    nombre: string;
    extension: string;
    contenido: string;
    path: string;
  }): Promise<{ success: boolean; message?: string }> {
    const usuario = authService.getUserData();
    if (!usuario) return { success: false, message: "Usuario no autenticado" };
  
    const url = getApiUrl(
      API_CONFIG.ENDPOINTS.ARCHIVOS.replace("{nombre}", usuario.nombre)
    );
  
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path,
        nombre,
        extension,
        contenido,
      }),
    });
  
    if (res.ok) return { success: true };
  
    const data = await res.json();
    return { success: false, message: data?.error || "Error al subir archivo" };
  },

  async eliminarArchivo({
    nombre,
    extension,
    path,
  }: {
    nombre: string
    extension: string
    path: string
  }): Promise<{ success: boolean; message?: string }> {
    const usuario = authService.getUserData();
    if (!usuario) return { success: false, message: "Usuario no autenticado" };
  
    const url = getApiUrl(`/usuarios/${usuario.nombre}/archivos`);
  
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, extension, path }),
    });
  
    if (res.ok) return { success: true };
  
    const data = await res.json();
    return { success: false, message: data?.error || "Error al eliminar archivo" };
  }
};



