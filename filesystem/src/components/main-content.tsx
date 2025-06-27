import { FolderCard } from "@/components/folder-card"
import { Button } from "@/components/ui/button"
import { List, Info, Settings } from "lucide-react"

export function MainContent() {
const folders: { id: string; name: string }[] = []

  return (
    <main className="flex-1 bg-gray-50">
      <div className="flex items-center justify-end px-6 py-3 bg-white border-b border-gray-200">
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
          <h2 className="text-sm font-medium text-gray-700 mb-4">Archivos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {folders.length > 0 ? (
              folders.map((folder) => (
                <FolderCard key={folder.id} name={folder.name} />
              ))
            ) : (
              <div className="col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5">
                <p className="text-gray-500 text-sm">No hay archivos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}