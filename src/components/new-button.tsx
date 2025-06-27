"use client"

import { Plus, Folder, Upload, FileText, Sheet, Presentation } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NewButton() {
  const handleCreateFolder = () => {
    console.log("Create folder clicked")
    // Abrir modal para crear carpeta
  }

  const handleUploadFile = () => {
    console.log("Upload file clicked")
    // Abrir selector de archivos
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        console.log("Files selected:", Array.from(files))
        // Procesar archivos subidos
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

  return (
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
  )
}
