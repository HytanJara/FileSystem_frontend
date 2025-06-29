"use client"

import { HardDrive, Users, Trash2, LogOut } from "lucide-react"
import { NewButton } from "@/components/new-button"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/contexts/navigation-context"
import { authService } from "@/api/login/auth"
import { useRouter } from "next/navigation"

const sidebarItems = [
  { id: "my-drive" as const, icon: HardDrive, label: "My Drive" },
  { id: "shared" as const, icon: Users, label: "Shared with me" },
  { id: "trash" as const, icon: Trash2, label: "Trash" },
]

export function Sidebar() {
  const { currentView, setCurrentView } = useNavigation()
  const router = useRouter()

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que quieres cerrar sesión?')) {
      authService.logout();
      router.push('/login');
    }
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen relative">
      <div className="p-4">
        <NewButton />
      </div>

      <nav className="px-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start px-4 py-2 mb-1 text-gray-700 hover:bg-gray-100 rounded-full",
              currentView === item.id && "bg-blue-50 text-blue-600 hover:bg-blue-50",
            )}
            onClick={() => setCurrentView(item.id)}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
      
      <div className="absolute bottom-4 left-2 right-2">
        <Button
          variant="ghost"
          className="w-full justify-start px-4 py-2 text-red-600 hover:bg-red-50 rounded-full"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}