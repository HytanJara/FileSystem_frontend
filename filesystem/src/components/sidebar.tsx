import { HardDrive, Monitor, Users, Clock, Camera, Star, Trash2, Cloud, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: HardDrive, label: "My Drive", active: true },
  { icon: Monitor, label: "Computers", active: false },
  { icon: Users, label: "Shared with me", active: false },
  { icon: Clock, label: "Recent", active: false },
  { icon: Camera, label: "Google Photos", active: false },
  { icon: Star, label: "Starred", active: false },
  { icon: Trash2, label: "Trash", active: false },
  { icon: Cloud, label: "Backup", active: false },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 font-medium">NEW</Button>
      </div>

      <nav className="px-2">
        {sidebarItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={cn(
              "w-full justify-start px-4 py-2 mb-1 text-gray-700 hover:bg-gray-100 rounded-full",
              item.active && "bg-blue-50 text-blue-600 hover:bg-blue-50",
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        ))}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <ArrowUp className="mr-3 h-5 w-5" />
            Upgrade Storage
          </Button>
        </div>
      </nav>
    </aside>
  )
}