"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/header"
import { Sidebar } from "../components/sidebar"
import { DynamicContent } from "../components/dynamic-content"
import { NavigationProvider } from "../contexts/navigation-context"
import { authService } from "@/api/login/auth";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está logueado
    const isLoggedIn = authService.isLoggedIn();
    
    if (!isLoggedIn) {
      // Si no está logueado, redirigir al login
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex">
          <Sidebar />
          <DynamicContent />
        </div>
      </div>
    </NavigationProvider>
  )
}