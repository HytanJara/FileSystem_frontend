// components/CrearArchivoModal.tsx
"use client"

import { useState } from "react"
import { fileService } from "@/api/upload/fileServices"

interface Props {
  open: boolean
  onClose: () => void
  currentPath: string
  onArchivoCreado?: () => void
}

export function CrearArchivoModal({ open, onClose, currentPath, onArchivoCreado }: Props) {
  const [nombre, setNombre] = useState("")
  const [extension, setExtension] = useState("txt")
  const [contenido, setContenido] = useState("")

  const handleCrear = async () => {
    const res = await fileService.crearArchivo({
      path: currentPath,
      nombre,
      extension,
      contenido,
    })

    if (res.success) {
      alert("Archivo creado correctamente")
      onClose()
      onArchivoCreado?.()
    } else {
      alert(res.message || "Error al crear archivo")
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Crear nuevo archivo</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Extensión (ej. txt)"
          value={extension}
          onChange={(e) => setExtension(e.target.value)}
        />
        <textarea
          className="border p-2 w-full mb-2"
          rows={5}
          placeholder="Contenido del archivo"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="text-gray-500 px-4 py-2">Cancelar</button>
          <button
            onClick={handleCrear}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  )
}
