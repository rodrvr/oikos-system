"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { apiPost } from "@/app/lib/api";
import { jwtDecode } from "@/app/lib/jwt";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiPost("/auth/login", { email, password });
      const decoded = jwtDecode(data.token) as { user_id: string; rol_id: string; iglesia_id: string };
      login(data.token, decoded);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8 flex flex-col gap-4 animate-scale-in"
      >
        <h1 className="text-2xl font-bold text-primary text-center">Iniciar Sesión</h1>
        {error && <p className="text-red-500 text-sm text-center animate-fade-in" role="alert">{error}</p>}
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-2 rounded bg-primary text-white font-medium hover:bg-[#2d5235] active:scale-[0.97] transition-all duration-150 disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
        <p className="text-center text-sm">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-primary hover:underline transition-colors duration-150">
            Registrarse
          </Link>
        </p>
      </form>
    </main>
  );
}
