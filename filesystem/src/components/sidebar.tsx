"use client"

import { HardDrive, Monitor, Users, Clock, Camera, Star, Trash2, Cloud } from "lucide-react"
import { NewButton } from "@/components/new-button"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { icon: HardDrive, label: "My Drive", active: true },
  { icon: Users, label: "Shared with me", active: false },
  { icon: Trash2, label: "Trash", active: false },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <NewButton />
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
      </nav>
    </aside>
  )
}