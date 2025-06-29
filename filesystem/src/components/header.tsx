"use client";
import { Search, Grid3X3, Bell, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { authService } from "@/api/login/auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string;
  nombre: string;
  espacioMaximo: number;
  espacioUsado: number;
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = authService.getUserData();
    setUser(userData);
  }, []);

  const getUserInitials = (nombre: string) => {
    return nombre.charAt(0).toUpperCase();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleLogout = () => {
    // Confirmar logout
    if (window.confirm('¿Estás seguro que quieres cerrar sesión?')) {
      authService.logout();
      router.push('/login');
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-normal text-gray-700">File system</h1>
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search Drive"
            className="pl-10 bg-gray-100 border-0 rounded-full focus:bg-white focus:shadow-md transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{user.nombre}</span>
            <span className="text-xs">
              {formatBytes(user.espacioUsado)} / {formatBytes(user.espacioMaximo)}
            </span>
          </div>
        )}
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Grid3X3 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>{user ? getUserInitials(user.nombre) : 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            {user && (
              <>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user.nombre}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {formatBytes(user.espacioUsado)} / {formatBytes(user.espacioMaximo)}
                  </p>
                </div>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}