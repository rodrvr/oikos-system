"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiPost } from "@/app/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "", email: "", password: "", rut: "",
    direccion: "", telefono: "", telefono_emergencia: "",
    fecha_nacimiento: "", foto_url: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiPost("/auth/register", form);
      router.push("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8 flex flex-col gap-3"
      >
        <h1 className="text-2xl font-bold text-primary text-center">Registrarse</h1>
        {error && <p className="text-red-500 text-sm text-center" role="alert">{error}</p>}
        {["nombre", "email", "password", "rut", "direccion", "telefono", "telefono_emergencia", "fecha_nacimiento", "foto_url"].map((field) => (
          <label key={field} className="flex flex-col gap-1 text-sm">
            {field === "fecha_nacimiento" ? "Fecha de Nacimiento" : field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
            <input
              name={field}
              type={field === "password" ? "password" : field === "fecha_nacimiento" ? "date" : field === "email" ? "email" : "text"}
              value={(form as Record<string, string>)[field]}
              onChange={handleChange}
              className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              required={field !== "foto_url" && field !== "telefono_emergencia"}
            />
          </label>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-2 rounded bg-primary text-white font-medium hover:bg-[#2d5235] transition-colors disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Registrarse"}
        </button>
        <p className="text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </form>
    </main>
  );
}
