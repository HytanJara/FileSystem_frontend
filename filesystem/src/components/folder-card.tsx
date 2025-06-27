import { Folder } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ReactNode } from "react"

interface FolderCardProps {
  name: string
  type?: "file" | "folder"
  modifiedAt?: string
  icon?: ReactNode
  className?: string
  children?: ReactNode
}

export function FolderCard({ 
  name, 
  type = "folder", 
  modifiedAt, 
  icon, 
  className = "",
  children 
}: FolderCardProps) {
  const defaultIcon = type === "folder" ? (
    <Folder className="h-12 w-12 text-blue-500 mb-2" />
  ) : (
    <Folder className="h-12 w-12 text-gray-500 mb-2" />
  )

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200 ${className}`}>
      <CardContent className="p-4 flex flex-col items-center text-center">
        {icon || defaultIcon}
        <span className="text-sm text-gray-700 font-medium mb-1 line-clamp-2">{name}</span>
        {modifiedAt && (
          <span className="text-xs text-gray-500">{modifiedAt}</span>
        )}
        {children}
      </CardContent>
    </Card>
  )
}
