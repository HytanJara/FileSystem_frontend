"use client";
import { useState } from "react";

export default function HomePage() {
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre.trim()) {
      alert("Por favor ingresa un nombre.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/usuarios/login/${nombre}`, {
        method: "GET",
      });

      if (!res.ok) {
        alert("El usuario no existe.");
        return;
      }

      const data = await res.json();
      console.log("Usuario logueado:", data);

      // Puedes guardar los datos del usuario o redirigirlo
      // localStorage.setItem("usuario", JSON.stringify(data));
      // router.push("/dashboard");
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar al servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingresa tu nombre"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Iniciar sesión
          </button>
          <p className="text-sm text-gray-500">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}