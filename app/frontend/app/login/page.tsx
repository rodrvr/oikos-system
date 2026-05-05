"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { apiPost } from "@/app/lib/api";
import { jwtDecode } from "@/app/lib/jwt";
import { celebrate, shake } from "@/app/lib/animations";
import gsap from "gsap";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(formRef.current, { opacity: 0, y: 20, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
    }, formRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (error && errorRef.current) shake(errorRef.current);
  }, [error]);

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
      setError(err instanceof Error ? err.message : "No pudimos iniciar sesion. Revisa tus datos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background via-background to-primary/5">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-zinc-800/90 rounded-2xl shadow-xl p-8 flex flex-col gap-5 border border-zinc-100 dark:border-zinc-700/50"
      >
        <div className="text-center mb-2">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Bienvenido de vuelta</h1>
          <p className="text-sm opacity-50 mt-1">Ingresa para continuar a tu iglesia</p>
        </div>

        {error && (
          <p ref={errorRef} className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-3" role="alert">
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-50">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            placeholder="tu@iglesia.cl"
            required
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-50">Contrasena</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            placeholder="••••••••"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-3 rounded-xl bg-primary text-white font-bold hover:bg-[#2d5235] active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:hover:bg-primary shadow-md hover:shadow-lg"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verificando...
            </span>
          ) : "Ingresar"}
        </button>

        <p className="text-center text-sm opacity-60">
          No tienes cuenta?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline underline-offset-2">
            Unete a Oikos
          </Link>
        </p>
      </form>
    </main>
  );
}
