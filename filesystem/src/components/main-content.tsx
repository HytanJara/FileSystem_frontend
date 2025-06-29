"use client"

import { useEffect, useState } from "react"
import { FolderCard } from "@/components/folder-card"
import { Button } from "@/components/ui/button"
import { List, Info, Settings, HardDrive, ArrowLeft } from "lucide-react"
import { fileService } from "@/api/upload/fileServices"
import { crearCarpeta } from "@/api/carpeta/folder"
import { authService } from "@/api/login/auth";
import { listarCarpetas } from "@/api/carpeta/folder"



interface Archivo {
  nombre: string;
  extension: string;
}


interface Carpeta {
  nombre: string
}

export function MainContent() {
  const [archivos, setArchivos] = useState<Archivo[]>([])
  const [carpetas, setCarpetas] = useState<Carpeta[]>([])
  const [currentPath, setCurrentPath] = useState<string>("root")

  useEffect(() => {
    const cargarContenido = async () => {
      try {
        const user = authService.getUserData()
        if (!user) return
  
        const archivosData = await fileService.listarArchivos(currentPath) // ← importante
        const carpetasData = await listarCarpetas(user.nombre, currentPath)
  
        setArchivos(archivosData)
        setCarpetas(carpetasData)
      } catch (error) {
        console.error("Error al cargar contenido:", error)
      }
    }
  
    cargarContenido()
  }, [currentPath])

  const handleAbrirCarpeta = (nombreCarpeta: string) => {
    setCurrentPath((prev) => `${prev}/${nombreCarpeta}`)
  }

  const handleAtras = () => {
    if (currentPath === "root") return
    const partes = currentPath.split("/")
    partes.pop()
    setCurrentPath(partes.join("/") || "root")
  }

  
  return (
    <main className="flex-1 bg-gray-50">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {currentPath !== "root" && (
            <Button variant="ghost" onClick={handleAtras}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Atrás
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-600">
            <List className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Info className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <HardDrive className="h-6 w-6 text-gray-600 mr-2" />
            <h1 className="text-2xl font-normal text-gray-800">Mi unidad</h1>
          </div>
          <p className="text-gray-600">Ruta: {currentPath}</p>
        </div>

        {carpetas.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Carpetas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {carpetas.map((carpeta, index) => (
                <FolderCard
                  key={`folder-${index}`}
                  name={carpeta.nombre}
                  onClick={() => handleAbrirCarpeta(carpeta.nombre)}
                  
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Archivos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {archivos.length > 0 ? (
              archivos.map((archivo, index) => (
                <FolderCard
                  key={`file-${index}`}
                  name={`${archivo.nombre}.${archivo.extension}`}
                  type="file"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <HardDrive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Esta carpeta está vacía
                </h3>
                <p className="text-gray-500">
                  Usa el botón "Nuevo" para crear archivos y carpetas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}