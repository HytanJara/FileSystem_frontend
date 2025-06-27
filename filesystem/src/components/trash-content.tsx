"use client"

import { Trash2, RotateCcw, X, FileText, Image, Video, Music, Archive, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolderCard } from "./folder-card"

const trashedFiles = [
  {
    id: "1",
    name: "Documento Antiguo.docx",
    type: "file" as const,
    deletedAt: "Hace 2 días",
    originalLocation: "Mi unidad/Documentos",
    size: "1.2 MB"
  },
  {
    id: "2",
    name: "Carpeta Proyecto Cancelado", 
    type: "folder" as const,
    deletedAt: "Hace 1 semana",
    originalLocation: "Mi unidad/Proyectos",
    size: null
  },
  {
    id: "3",
    name: "Fotos Vacaciones 2023.zip",
    type: "file" as const,
    deletedAt: "Hace 3 días", 
    originalLocation: "Mi unidad/Fotos",
    size: "125 MB"
  },
  {
    id: "4",
    name: "Presentación Borrador.pptx",
    type: "file" as const,
    deletedAt: "Hace 5 días",
    originalLocation: "Mi unidad/Presentaciones", 
    size: "8.4 MB"
  },
  {
    id: "5",
    name: "Video Tutorial.mp4",
    type: "file" as const,
    deletedAt: "Hace 1 mes",
    originalLocation: "Mi unidad/Videos",
    size: "67.8 MB"
  }
]

const getFileIcon = (fileName: string, type: string) => {
  if (type === 'folder') {
    return <Folder className="h-8 w-8 text-gray-400" />
  }

  const extension = fileName.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className="h-8 w-8 text-gray-400" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <Image className="h-8 w-8 text-gray-400" />
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return <Video className="h-8 w-8 text-gray-400" />
    case 'mp3':
    case 'wav':
    case 'flac':
      return <Music className="h-8 w-8 text-gray-400" />
    case 'zip':
    case 'rar':
    case '7z':
      return <Archive className="h-8 w-8 text-gray-400" />
    case 'pptx':
    case 'ppt':
      return <FileText className="h-8 w-8 text-gray-400" />
    default:
      return <FileText className="h-8 w-8 text-gray-400" />
  }
}

const handleRestore = (fileId: string, fileName: string) => {
  console.log(`Restaurar archivo: ${fileName} (ID: ${fileId})`)
  // Lógica para restaurar el archivo
}

const handlePermanentDelete = (fileId: string, fileName: string) => {
  console.log(`Eliminar permanentemente: ${fileName} (ID: ${fileId})`)
  // Lógica para eliminar permanentemente
}

const handleEmptyTrash = () => {
  console.log("Vaciar papelera completamente")
  // Lógica para vaciar toda la papelera
}

export function TrashContent() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Trash2 className="h-6 w-6 text-gray-600 mr-2" />
            <h1 className="text-2xl font-normal text-gray-800">Papelera</h1>
          </div>
          {trashedFiles.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleEmptyTrash}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vaciar papelera
            </Button>
          )}
        </div>
        <p className="text-gray-600">
          Los archivos eliminados se conservan durante 30 días antes de ser eliminados permanentemente
        </p>
      </div>

      <div className="mb-4 flex items-center text-sm text-gray-600">
        <Trash2 className="h-4 w-4 mr-1" />
        {trashedFiles.length} elementos en la papelera
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {trashedFiles.map((file) => (
          <div key={file.id} className="relative group">
            <FolderCard
              name={file.name}
              type={file.type}
              modifiedAt={`Eliminado ${file.deletedAt}`}
              icon={getFileIcon(file.name, file.type)}
              className="hover:shadow-md transition-shadow opacity-75 hover:opacity-100"
            />
            <div className="mt-2 text-xs text-gray-500">
              <div className="mb-1">Desde: {file.originalLocation}</div>
              {file.size && <div className="text-gray-400">{file.size}</div>}
            </div>
            
            {/* Botones de acción que aparecen al hacer hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRestore(file.id, file.name)}
                className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-green-50"
                title="Restaurar"
              >
                <RotateCcw className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePermanentDelete(file.id, file.name)}
                className="h-8 w-8 p-0 bg-white border-gray-300 hover:bg-red-50"
                title="Eliminar permanentemente"
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {trashedFiles.length === 0 && (
        <div className="text-center py-12">
          <Trash2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            La papelera está vacía
          </h3>
          <p className="text-gray-500">
            Los archivos eliminados aparecerán aquí
          </p>
        </div>
      )}
    </div>
  )
}
