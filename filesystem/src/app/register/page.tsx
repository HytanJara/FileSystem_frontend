"use client";
import { useState, useEffect } from "react";
import { registerService } from "@/api/register/auth";
import { authService } from "@/api/login/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [espacioMaximo, setEspacioMaximo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Si ya está logueado, redirigir al main page
    if (authService.isLoggedIn()) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!nombre.trim()) {
      setError("Por favor ingresa un nombre.");
      return;
    }

    if (!espacioMaximo.trim()) {
      setError("Por favor ingresa la cantidad de bytes máxima.");
      return;
    }

    const espacioMaximoNum = parseInt(espacioMaximo);
    if (isNaN(espacioMaximoNum) || espacioMaximoNum <= 0) {
      setError("La cantidad de bytes debe ser un número positivo.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerService.register({
        nombre: nombre.trim(),
        espacioMaximo: espacioMaximoNum,
      });

      if (result.success && result.user) {
        console.log("Usuario registrado:", result.user);
        
        // Guardar datos del usuario automáticamente después del registro
        registerService.saveUserData(result.user);
        
        // Mostrar mensaje de éxito y redirigir al main page
        alert(`¡Usuario ${result.user.nombre} registrado exitosamente!`);
        router.push("/"); // Navegar al main page
      } else {
        setError(result.message || "Error al registrar usuario");
      }
    } catch (error) {
      setError("Error inesperado. Intenta de nuevo.");
      console.error("Error en registro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Crear usuario</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingresa tu nombre"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de bytes máxima</label>
            <input
              type="number"
              value={espacioMaximo}
              onChange={(e) => setEspacioMaximo(e.target.value)}
              placeholder="Ingresa la cantidad de bytes máxima"
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
          <p className="text-sm text-gray-500">
            ¿Ya estás registrado?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}