"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { apiPost } from "@/app/lib/api";
import { jwtDecode } from "@/app/lib/jwt";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo("[data-form-icon]", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
      tl.fromTo("[data-form-heading]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2");
      tl.fromTo("[data-form-field]", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.08 }, "-=0.15");
      tl.fromTo("[data-form-btn]", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1");
    }, formRef);
    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiPost("/auth/login", { email, password });
      const decoded = jwtDecode(data.token) as { user_id: string; rol_id: string; iglesia_id: string };
      login(data.token, decoded);
      router.push("/dashboard");
    } catch {
      setError("Credenciales invalidas. Revisa tu email y contrasena.");
    } finally { setLoading(false); }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div data-form-icon className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#386641] to-[#A7C957] flex items-center justify-center mb-6 shadow-xl shadow-[#386641]/20">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <div data-form-heading className="text-center">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-[#F2E8CF]">Bienvenido de vuelta</h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2">Ingresa a tu cuenta para continuar</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-5">
          <div data-form-field className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#386641] focus:border-transparent transition-all duration-200 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              placeholder="tu@iglesia.cl"
              required
            />
          </div>

          <div data-form-field className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Contrasena
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#386641] focus:border-transparent transition-all duration-200 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            data-form-btn
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-[#386641] text-white font-bold hover:bg-[#2d5235] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-lg shadow-[#386641]/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Ingresar <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          No tienes cuenta?{" "}
          <Link href="/register" className="text-[#386641] font-bold hover:underline underline-offset-4">
            Unete a Oikos
          </Link>
        </p>
      </form>
    </div>
  );
}
