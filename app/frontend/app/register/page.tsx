"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiPost } from "@/app/lib/api";
import { celebrate } from "@/app/lib/animations";
import gsap from "gsap";

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "", email: "", password: "", rut: "",
    direccion: "", telefono: "", telefono_emergencia: "",
    fecha_nacimiento: "", foto_url: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

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
    if (success && successRef.current) celebrate(successRef.current);
  }, [success]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiPost("/auth/register", form);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No pudimos crear tu cuenta. Revisa los datos.");
    } finally { setLoading(false); }
  }

  if (success) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div ref={successRef} className="text-center bg-white dark:bg-zinc-800/90 rounded-2xl shadow-xl p-10 border border-secondary/20">
          <p className="text-5xl mb-4">&#127881;</p>
          <h2 className="text-2xl font-extrabold text-primary mb-2">Cuenta creada</h2>
          <p className="text-sm opacity-60">Bienvenido a Oikos. Redirigiendo al inicio de sesion...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-8 bg-gradient-to-b from-background via-background to-primary/5">
      <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-lg bg-white dark:bg-zinc-800/90 rounded-2xl shadow-xl p-8 flex flex-col gap-4 border border-zinc-100 dark:border-zinc-700/50">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">Unete a Oikos</h1>
          <p className="text-sm opacity-50 mt-1">Crea tu cuenta y conectate con tu iglesia</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 rounded-lg py-2 px-3" role="alert">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "nombre", label: "Nombre completo", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "password", label: "Contrasena", type: "password", required: true },
            { name: "rut", label: "RUT (XX.XXX.XXX-X)", type: "text", required: true },
            { name: "direccion", label: "Direccion", type: "text", required: true },
            { name: "telefono", label: "Telefono", type: "text", required: true },
            { name: "telefono_emergencia", label: "Tel. Emergencia", type: "text", required: false },
            { name: "fecha_nacimiento", label: "Fecha Nacimiento", type: "date", required: true },
          ].map((f) => (
            <label key={f.name} className="flex flex-col gap-1">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-50">{f.label}</span>
              <input
                name={f.name}
                type={f.type}
                value={(form as Record<string, string>)[f.name]}
                onChange={handleChange}
                className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                required={f.required}
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-3 rounded-xl bg-primary text-white font-bold hover:bg-[#2d5235] active:scale-[0.97] transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creando cuenta...
            </span>
          ) : "Crear cuenta"}
        </button>

        <p className="text-center text-sm opacity-60">
          Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline underline-offset-2">Iniciar Sesion</Link>
        </p>
      </form>
    </main>
  );
}
