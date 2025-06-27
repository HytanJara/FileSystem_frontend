import { Folder } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FolderCardProps {
  name: string
}

export function FolderCard({ name }: FolderCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <Folder className="h-12 w-12 text-blue-500 mb-2" />
        <span className="text-sm text-gray-700 font-medium">{name}</span>
      </CardContent>
    </Card>
  )
}
