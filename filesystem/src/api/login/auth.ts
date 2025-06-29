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

interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export const authService = {
 

  async login(nombre: string): Promise<LoginResponse> {
    try {
      const url = getApiUrl(`${API_CONFIG.ENDPOINTS.LOGIN}/${nombre}`);
      console.log('Intentando conectar a:', url); // Debug info
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
      });

      if (!res.ok) {
        if (res.status === 404) {
          return {
            success: false,
            message: "El usuario no existe."
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
      console.error("Error de red:", error);
      
      // Diferentes tipos de errores
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: "No se pudo conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080 y que CORS esté configurado correctamente."
        };
      }
      
      if (error instanceof TypeError && error.message.includes('NetworkError')) {
        return {
          success: false,
          message: "Error de red. Verifica que el servidor backend esté disponible."
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
  },

  getUserData(): User | null {
    const userData = localStorage.getItem("usuario");
    return userData ? JSON.parse(userData) : null;
  },
 
  logout(): void {
    localStorage.removeItem("usuario");
  },

 
  getAvailableSpace(): number | null {
    const user = this.getUserData();
    return user ? user.espacioMaximo - user.espacioUsado : null;
  },


  getSpaceUsagePercentage(): number | null {
    const user = this.getUserData();
    return user ? (user.espacioUsado / user.espacioMaximo) * 100 : null;
  },

  isLoggedIn(): boolean {
    return this.getUserData() !== null;
  }
};
