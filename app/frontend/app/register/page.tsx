"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiPost, apiGet } from "@/app/lib/api";
import { UserPlus, Mail, Lock, User, Hash, MapPin, Phone, PhoneCall, Calendar, Church, ChevronDown, AlertTriangle, Check } from "lucide-react";
import gsap from "gsap";

interface Iglesia { id: string; nombre: string }

const FIELDS = [
  { name: "nombre", label: "Nombre completo", type: "text", icon: User },
  { name: "email", label: "Email", type: "email", icon: Mail },
  { name: "password", label: "Contrasena", type: "password", icon: Lock },
  { name: "rut", label: "RUT (XX.XXX.XXX-X)", type: "text", icon: Hash },
  { name: "direccion", label: "Direccion", type: "text", icon: MapPin },
  { name: "telefono", label: "Telefono", type: "text", icon: Phone },
  { name: "telefono_emergencia", label: "Tel. Emergencia", type: "text", icon: PhoneCall },
  { name: "fecha_nacimiento", label: "Fecha Nacimiento", type: "date", icon: Calendar },
];

export default function RegisterPage() {
  const [form, setForm] = useState<Record<string, string>>({
    nombre: "", email: "", password: "", rut: "",
    direccion: "", telefono: "", telefono_emergencia: "",
    fecha_nacimiento: "", foto_url: "",
    iglesia_id: "",
  });
  const [churches, setChurches] = useState<Iglesia[]>([]);
  const [loadingChurches, setLoadingChurches] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    apiGet("/churches")
      .then((d) => setChurches(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoadingChurches(false));
  }, []);

  useEffect(() => {
    if (!cardRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current, { opacity: 0, y: 32, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!success) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(".success-card", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
  }, [success]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [dropdownOpen]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function selectChurch(church: Iglesia) {
    setForm({ ...form, iglesia_id: church.id });
    setDropdownOpen(false);
  }

  const selectedChurch = churches.find((c) => c.id === form.iglesia_id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.iglesia_id) { setError("Selecciona una iglesia para continuar."); return; }
    setLoading(true);
    try {
      const payload = { ...form, rol_id: "8ce5822a-dca8-4a10-bbed-c7fcc220c3b6" };
      await apiPost("/auth/register", payload);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No pudimos crear tu cuenta.");
    } finally { setLoading(false); }
  }

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="success-card text-center bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-10 border border-green-200 dark:border-green-900">
          <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2">Cuenta creada</h2>
          <p className="text-sm text-zinc-500">Bienvenido a Oikos. Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-start justify-center p-4 py-8 overflow-auto">
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#386641] to-[#A7C957] flex items-center justify-center mb-4 shadow-xl shadow-[#386641]/20">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">Unete a Oikos</h1>
          <p className="text-zinc-500 text-sm mt-1">Crea tu cuenta y conectate con tu iglesia</p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}

        <div ref={cardRef} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-lg space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Church className="w-3.5 h-3.5" /> Iglesia <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                ref={btnRef}
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                className={`w-full px-4 py-3 rounded-2xl text-left text-sm flex items-center justify-between border focus:outline-none focus:ring-2 focus:ring-[#386641] transition-all duration-200 ${selectedChurch ? "bg-[#386641]/5 border-[#386641]/20 text-zinc-900 dark:text-zinc-100" : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400"}`}
              >
                <span>{loadingChurches ? "Cargando..." : selectedChurch ? selectedChurch.nombre : "Selecciona tu iglesia"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div ref={dropdownRef} className="absolute z-[200] left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-2xl">
                  {churches.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => selectChurch(c)}
                      className={`px-4 py-3 text-sm cursor-pointer hover:bg-[#386641]/10 transition-colors first:rounded-t-xl last:rounded-b-xl ${c.id === form.iglesia_id ? "bg-[#386641]/10 text-[#386641] dark:text-[#A7C957] font-semibold" : "text-zinc-700 dark:text-zinc-300"}`}
                    >
                      {c.nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {FIELDS.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <f.icon className="w-3.5 h-3.5" /> {f.label}
              </label>
              <input
                name={f.name}
                type={f.type}
                value={form[f.name] || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#386641] focus:border-transparent transition-all duration-200 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                required={f.name !== "telefono_emergencia"}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3.5 rounded-2xl bg-[#386641] text-white font-bold hover:bg-[#2d5235] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-lg shadow-[#386641]/20 flex items-center justify-center gap-2"
        >
          {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Crear cuenta"}
        </button>

        <p className="mt-4 text-center text-sm text-zinc-500">
          Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[#386641] font-bold hover:underline underline-offset-4">Iniciar Sesion</Link>
        </p>
      </form>
    </div>
  );
}
