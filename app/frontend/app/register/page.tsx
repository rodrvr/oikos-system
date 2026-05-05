"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiPost, apiGet } from "@/app/lib/api";
import { celebrate } from "@/app/lib/animations";
import { UserPlus, Mail, Lock, User, Hash, MapPin, Phone, AlertTriangle, Church, ChevronDown } from "lucide-react";
import gsap from "gsap";

interface Iglesia { id: string; nombre: string }

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "", email: "", password: "", rut: "",
    direccion: "", telefono: "", telefono_emergencia: "",
    fecha_nacimiento: "", foto_url: "",
    iglesia_id: "", rol_id: "8ce5822a-dca8-4a10-bbed-c7fcc220c3b6",
  });
  const [churches, setChurches] = useState<Iglesia[]>([]);
  const [loadingChurches, setLoadingChurches] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showChurchSelect, setShowChurchSelect] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet("/churches");
        setChurches(Array.isArray(data) ? data : []);
      } catch {} finally { setLoadingChurches(false); }
    }
    load();
  }, []);

  useEffect(() => {
    if (!formRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(formRef.current!.querySelectorAll("[data-reg-field]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power3.out", delay: 0.2 });
    }, formRef);
    return () => ctx.revert();
  }, [churches]);

  useEffect(() => {
    if (success && successRef.current) celebrate(successRef.current);
  }, [success]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowChurchSelect(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function selectChurch(church: Iglesia) {
    setForm({ ...form, iglesia_id: church.id });
    setShowChurchSelect(false);
  }

  const selectedChurch = churches.find(c => c.id === form.iglesia_id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.iglesia_id) {
      setError("Selecciona una iglesia para continuar.");
      return;
    }
    setLoading(true);
    try {
      await apiPost("/auth/register", form);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No pudimos crear tu cuenta. Revisa los datos.");
    } finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#F2E8CF] dark:bg-[#121212]">
        <div ref={successRef} className="text-center bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-10 border border-[#A7C957]/20">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#386641] to-[#A7C957] flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-[#F2E8CF] mb-2">Cuenta creada</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Bienvenido a Oikos. Redirigiendo al inicio de sesion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8 bg-[#F2E8CF] dark:bg-[#121212]">
      <form ref={formRef} onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#386641] to-[#A7C957] flex items-center justify-center mb-4 shadow-xl shadow-[#386641]/20">
          <UserPlus className="w-7 h-7 text-white" />
        </div>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-[#F2E8CF]">Unete a Oikos</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Crea tu cuenta y conectate con tu iglesia</p>
        </div>

        {error && (
          <div data-reg-field className="w-full mb-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-3.5">
          <div ref={dropdownRef} data-reg-field className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Church className="w-3.5 h-3.5" /> Iglesia <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowChurchSelect(!showChurchSelect)}
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-left text-sm text-zinc-900 dark:text-zinc-100 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#386641] transition-all duration-200"
            >
              <span className={selectedChurch ? "" : "text-zinc-400"}>
                {selectedChurch ? selectedChurch.nombre : "Selecciona tu iglesia..."}
              </span>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${showChurchSelect ? "rotate-180" : ""}`} />
            </button>
            {showChurchSelect && (
              <div className="absolute z-50 mt-1 w-[calc(100%-3rem)] max-h-48 overflow-auto rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xl">
                {loadingChurches ? (
                  <div className="p-3 text-sm text-zinc-400 text-center">Cargando iglesias...</div>
                ) : (
                  churches.map((church) => (
                    <button
                      key={church.id}
                      type="button"
                      onClick={() => selectChurch(church)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#386641]/5 transition-colors duration-100 first:rounded-t-xl last:rounded-b-xl text-zinc-700 dark:text-zinc-300 ${form.iglesia_id === church.id ? "bg-[#386641]/10 font-semibold text-[#386641]" : ""}`}
                    >
                      {church.nombre}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {[
            { name: "nombre", label: "Nombre completo", type: "text", icon: User },
            { name: "email", label: "Email", type: "email", icon: Mail },
            { name: "password", label: "Contrasena", type: "password", icon: Lock },
            { name: "rut", label: "RUT (XX.XXX.XXX-X)", type: "text", icon: Hash },
          ].map((f) => (
            <div key={f.name} data-reg-field className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <f.icon className="w-3.5 h-3.5" /> {f.label}
              </label>
              <input
                name={f.name}
                type={f.type}
                value={(form as Record<string, string>)[f.name]}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#386641] focus:border-transparent transition-all duration-200 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                required
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full max-w-lg mt-4 py-3.5 rounded-2xl bg-[#386641] text-white font-bold hover:bg-[#2d5235] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-lg shadow-[#386641]/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Crear cuenta</>
          )}
        </button>

        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[#386641] font-bold hover:underline underline-offset-4">Iniciar Sesion</Link>
        </p>
      </form>
    </div>
  );
}
