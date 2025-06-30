"use client"

import { Plus, Folder, Upload, FileText, Sheet, Presentation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { uploadService } from "@/api/upload/uploadService"
import { crearCarpeta } from "@/api/carpeta/folder"
import { authService } from "@/api/login/auth";
import { CrearArchivoModal } from "@/components/CrearArchivoModal"



import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fileService } from "@/api/upload/fileServices"
import { useState } from "react"

export function NewButton({ currentPath, onArchivoCreado }: { currentPath: string; onArchivoCreado?: () => void }) {


  
  const handleCreateFolder = async () => {
    console.log("Create folder clicked")
    const user = authService.getUserData();
  if (!user) {
    alert(" Debes iniciar sesión para crear una carpeta");
    return;
  }

  const nombre = prompt("Nombre de la nueva carpeta:");
  if (!nombre) return;

  const path = "root"; // Puedes mejorar esto para usar la ruta actual si la manejas
  const res = await crearCarpeta(user.nombre, path, nombre);

  if (res.success) {
    alert(`Carpeta "${nombre}" creada con éxito`);
    window.location.reload(); // O actualizar estado si usas useState
  } else {
    alert(` Error al crear carpeta: ${res.message}`);
  }
  }

  const handleUploadFile = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = false
  
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files
      const user = authService.getUserData()
  
      if (files && user) {
        const file = files[0]
        const nombre = file.name.split(".")[0]
        const extension = file.name.split(".").pop() || "txt"
        const contenido = await file.text()
  
        try {
          const res = await fileService.subirArchivo({
            nombre,
            extension,
            contenido,
            path: currentPath,
          });
  
          if (res.success) {
            alert(` Archivo "${file.name}" subido correctamente`)
            window.location.reload() // O usa un callback para refrescar estado
          } else {
            alert(` Error al subir archivo: ${res.message}`)
          }
        } catch (error) {
          alert(` Error al subir archivo`)
          console.error(error)
        }
      }
    }
  
    input.click()
  }


  
  

  const handleUploadFolder = () => {
    console.log("Upload folder clicked")
    // Abrir selector de carpetas
    const input = document.createElement("input")
    input.type = "file"
    input.webkitdirectory = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        console.log("Folder selected:", Array.from(files))
        // Procesar carpeta subida
      }
    }
    input.click()
  }

  const handleCreateDocument = (type: string) => {
    console.log(`Create ${type} clicked`)
    // Crear nuevo documento según el tipo
    switch (type) {
      case "docs":
        window.open("https://docs.google.com/document/create", "_blank")
        break
      case "sheets":
        window.open("https://docs.google.com/spreadsheets/create", "_blank")
        break
      case "slides":
        window.open("https://docs.google.com/presentation/create", "_blank")
        break
    }
  }

  const [showCrearArchivo, setShowCrearArchivo] = useState(false)

  

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-medium">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={handleCreateFolder}>
          <Folder className="mr-2 h-4 w-4" />
          Nueva carpeta
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleUploadFile}>
          <Upload className="mr-2 h-4 w-4" />
          Subir archivo
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleUploadFolder}>
          <Upload className="mr-2 h-4 w-4" />
          Subir carpeta
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setShowCrearArchivo(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Crear archivo
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleCreateDocument("docs")}>
          <FileText className="mr-2 h-4 w-4" />
          Google Docs
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCreateDocument("sheets")}>
          <Sheet className="mr-2 h-4 w-4" />
          Google Sheets
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCreateDocument("slides")}>
          <Presentation className="mr-2 h-4 w-4" />
          Google Slides
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
      {/* Modal fuera del menú */}
      <CrearArchivoModal
        open={showCrearArchivo}
        onClose={() => setShowCrearArchivo(false)}
        currentPath={currentPath}
        onArchivoCreado={onArchivoCreado}
      />
    </>
  )
}
