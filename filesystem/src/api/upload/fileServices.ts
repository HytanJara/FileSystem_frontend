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
  },


  async descargarArchivo({
    nombre,
    extension,
    path,
  }: {
    nombre: string
    extension: string
    path: string
  }) {
    const usuario = authService.getUserData();
    if (!usuario) throw new Error("Usuario no autenticado");
  
    const nombreArchivo = `${nombre}.${extension}`;
    const url = getApiUrl(
      `/usuarios/${usuario.nombre}/archivos/descargar?path=${path}&nombreArchivo=${nombreArchivo}`
    );
  
    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error || "No se pudo descargar el archivo");
    }
  
    const blob = await res.blob();
  
    const enlace = document.createElement("a");
    enlace.href = window.URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
  },

  async copiarArchivo({
    origenPath,
    destinoPath,
    nombre,
    extension,
  }: {
    origenPath: string
    destinoPath: string
    nombre: string
    extension: string
  }): Promise<{ success: boolean; message?: string }> {
    const usuario = authService.getUserData();
    if (!usuario) return { success: false, message: "Usuario no autenticado" };
  
    const url = getApiUrl(`/usuarios/${usuario.nombre}/archivos/copiar`);
  
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origenPath, destinoPath, nombre, extension }),
    });
  
    if (res.ok) return { success: true };
  
    const data = await res.json();
    return { success: false, message: data?.error || "Error al copiar archivo" };
  },

  async moverArchivo({
    origenPath,
    destinoPath,
    nombre,
    extension,
  }: {
    origenPath: string
    destinoPath: string
    nombre: string
    extension: string
  }): Promise<{ success: boolean; message?: string }> {
    const usuario = authService.getUserData();
    if (!usuario) return { success: false, message: "Usuario no autenticado" };
  
    const url = getApiUrl(`/usuarios/${usuario.nombre}/archivos/mover`);
  
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origenPath, destinoPath, nombre, extension }),
    });
  
    if (res.ok) return { success: true };
  
    const data = await res.json();
    return { success: false, message: data?.error || "Error al mover archivo" };
  },
  
  // Mover carpeta
  async moverCarpeta({
    origenPath,
    destinoPath,
  }: {
    origenPath: string
    destinoPath: string
  }): Promise<{ success: boolean; message?: string }> {
    const usuario = authService.getUserData();
    if (!usuario) return { success: false, message: "Usuario no autenticado" };
  
    const url = getApiUrl(`/carpetas/${usuario.nombre}/mover`);
  
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origenPath, destinoPath }),
    });
  
    if (res.ok) return { success: true };
  
    const data = await res.json();
    return { success: false, message: data?.error || "Error al mover carpeta" };
  },

  async compartirArchivo({
  nombre,
  extension,
  path,
  destinatario,
}: {
  nombre: string
  extension: string
  path: string
  destinatario: string
}): Promise<{ success: boolean; message?: string }> {
  const usuario = authService.getUserData();
  if (!usuario) return { success: false, message: "Usuario no autenticado" };

  const url = getApiUrl(
    `/usuarios/${usuario.nombre}/archivos/compartir`
  );

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path,
      nombreArchivo: `${nombre}.${extension}`,
      destinatario,
    }),
  });

  if (res.ok) return { success: true };

  const data = await res.json();
  return { success: false, message: data?.error || "Error al compartir archivo" };
  },


  async eliminarCarpeta({
    path,
  }: {
    path: string;
  }): Promise<{ success: boolean; message?: string }> {
    const usuario = authService.getUserData();
    if (!usuario) return { success: false, message: "Usuario no autenticado" };
  
    const url = getApiUrl(`/carpetas/${usuario.nombre}`);
  
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
  
    if (res.ok) return { success: true };
  
    const data = await res.json();
    return { success: false, message: data?.error || "Error al eliminar la carpeta" };
  },

  async modificarArchivo({
  nombre,
  extension,
  path,
  nuevoContenido,
}: {
  nombre: string;
  extension: string;
  path: string;
  nuevoContenido: string;
}): Promise<{ success: boolean; message?: string }> {
  const usuario = authService.getUserData();
  if (!usuario) return { success: false, message: "Usuario no autenticado" };

  const url = getApiUrl(`/usuarios/${usuario.nombre}/archivos/modificar`);

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path,
      nombreArchivo: `${nombre}.${extension}`,
      nuevoContenido,
    }),
  });

  if (res.ok) return { success: true };

  const data = await res.json();
  return { success: false, message: data?.error || "Error al modificar archivo" };
},

};



