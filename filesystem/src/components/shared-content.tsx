"use client"

import { Users, Share2, FileText, Image, Video, Music, Archive } from "lucide-react"
import { FolderCard } from "./folder-card"

const sharedFiles = [
  {
    id: "1",
    name: "Proyecto Marketing Q1",
    type: "folder" as const,
    modifiedAt: "Hace 2 días",
    owner: "Ana García",
    size: null,
    sharedWith: 5
  },
  {
    id: "2", 
    name: "Presentación Ventas.pptx",
    type: "file" as const,
    modifiedAt: "Hace 1 semana",
    owner: "Carlos López",
    size: "2.3 MB",
    sharedWith: 3
  },
  {
    id: "3",
    name: "Presupuesto 2024.xlsx", 
    type: "file" as const,
    modifiedAt: "Hace 3 días",
    owner: "María Rodríguez",
    size: "890 KB",
    sharedWith: 8
  },
  {
    id: "4",
    name: "Documentos Legales",
    type: "folder" as const, 
    modifiedAt: "Hace 1 mes",
    owner: "Juan Pérez",
    size: null,
    sharedWith: 2
  },
  {
    id: "5",
    name: "Video Promocional.mp4",
    type: "file" as const,
    modifiedAt: "Hace 5 días", 
    owner: "Laura Martín",
    size: "45.2 MB",
    sharedWith: 12
  }
]

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  switch (extension) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className="h-8 w-8 text-blue-600" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <Image className="h-8 w-8 text-green-600" />
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return <Video className="h-8 w-8 text-purple-600" />
    case 'mp3':
    case 'wav':
    case 'flac':
      return <Music className="h-8 w-8 text-orange-600" />
    case 'zip':
    case 'rar':
    case '7z':
      return <Archive className="h-8 w-8 text-gray-600" />
    default:
      return <FileText className="h-8 w-8 text-gray-600" />
  }
}

export function SharedContent() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Share2 className="h-6 w-6 text-gray-600 mr-2" />
          <h1 className="text-2xl font-normal text-gray-800">Compartido conmigo</h1>
        </div>
        <p className="text-gray-600">Archivos y carpetas que otros han compartido contigo</p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          {sharedFiles.length} elementos compartidos
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sharedFiles.map((file) => (
          <FolderCard
            key={file.id}
            name={file.name}
            type={file.type}
            modifiedAt={file.modifiedAt}
            icon={file.type === 'folder' ? undefined : getFileIcon(file.name)}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="mt-2 text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>Por: {file.owner}</span>
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{file.sharedWith}</span>
                </div>
              </div>
              {file.size && (
                <div className="mt-1 text-gray-400">{file.size}</div>
              )}
            </div>
          </FolderCard>
        ))}
      </div>

      {sharedFiles.length === 0 && (
        <div className="text-center py-12">
          <Share2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No hay archivos compartidos
          </h3>
          <p className="text-gray-500">
            Los archivos que otros compartan contigo aparecerán aquí
          </p>
        </div>
      )}
    </div>
  )
}
