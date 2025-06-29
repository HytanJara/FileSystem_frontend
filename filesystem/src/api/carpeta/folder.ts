// src/api/folder.ts
import { getApiUrl } from "../config"

// Crear una nueva carpeta
export async function crearCarpeta(
  nombreUsuario: string,
  path: string,
  nombre: string
): Promise<{ success: boolean; message: string }> {
  const url = getApiUrl(`/carpetas/${nombreUsuario}/crear`)
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, nombre }),
    })

    if (res.ok) {
      return { success: true, message: "Carpeta creada correctamente" }
    } else {
      const data = await res.json()
      return { success: false, message: data?.error || "Error desconocido" }
    }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

// ✅ Listar subcarpetas de una ruta (nuevo)
export async function listarCarpetas(
  nombreUsuario: string,
  ruta: string
): Promise<any[]> {
  const url = getApiUrl(`/carpetas/${nombreUsuario}/listar`)
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ruta }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || "Error al cargar carpetas")

  return data.subdirectorios // Esto es lo que espera `MainContent`
}
