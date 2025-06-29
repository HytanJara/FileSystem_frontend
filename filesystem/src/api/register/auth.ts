import { getApiUrl, API_CONFIG } from "../config";

interface Directorio {
  id: string;
  nombre: string;
  fechaCreacion: string;
  fechaModificacion: string;
  archivos: any[]; // Puedes tipar esto más específicamente si tienes la estructura de archivos
  subdirectorios: any[]; // Puedes tipar esto más específicamente si tienes la estructura de subdirectorios
}

interface User {
  id: string;
  nombre: string;
  espacioMaximo: number;
  espacioUsado: number;
  directorioRaiz: Directorio;
  directorioCompartidos: Directorio;
}

interface RegisterData {
  nombre: string;
  espacioMaximo: number;
}

interface RegisterResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export const registerService = {
  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      const url = getApiUrl(API_CONFIG.ENDPOINTS.REGISTER);
      console.log('Intentando registrar en:', url); // Debug info
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        if (res.status === 400) {
          return {
            success: false,
            message: "Datos inválidos. Verifica que el nombre no esté vacío y el espacio máximo sea un número positivo."
          };
        } else if (res.status === 409) {
          return {
            success: false,
            message: "Ya existe un usuario con ese nombre."
          };
        } else if (res.status >= 500) {
          return {
            success: false,
            message: "Error del servidor. Intenta de nuevo más tarde."
          };
        } else {
          return {
            success: false,
            message: `Error: ${res.status} - ${res.statusText}`
          };
        }
      }

      const data = await res.json();
      
      return {
        success: true,
        user: data,
      };
    } catch (error) {
      console.error("Error de red al registrar:", error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: "No se pudo conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080 y que CORS esté configurado correctamente."
        };
      }
      
      return {
        success: false,
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  },

  saveUserData(user: User): void {
    localStorage.setItem("usuario", JSON.stringify(user));
  }
};
