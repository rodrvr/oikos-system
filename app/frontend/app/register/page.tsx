"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiPost, apiGet } from "@/app/lib/api";
import { useEntrance, celebrate } from "@/app/lib/animations";
import { UserPlus, Mail, Lock, User, Hash, MapPin, Phone, PhoneCall, Calendar, Church, ChevronDown, AlertTriangle, Check } from "lucide-react";

const FIELDS = [
  { name: "nombre", label: "Nombre", icon: User },
  { name: "email", label: "Email", icon: Mail },
  { name: "password", label: "Contrasena", icon: Lock },
  { name: "rut", label: "RUT", icon: Hash },
  { name: "direccion", label: "Direccion", icon: MapPin },
  { name: "telefono", label: "Telefono", icon: Phone },
  { name: "telefono_emergencia", label: "Emergencia", icon: PhoneCall },
  { name: "fecha_nacimiento", label: "Fecha Nac.", icon: Calendar },
];

export default function RegisterPage() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [churches, setChurches] = useState<{ id: string; nombre: string }[]>([]);
  const [loadingCh, setLoadingCh] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const formRef = useEntrance();
  const ddRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => { apiGet("/churches").then(d => setChurches(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoadingCh(false)); }, []);
  useEffect(() => { if (success && successRef.current) celebrate(successRef.current); }, [success]);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ddRef.current && !ddRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [open]);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  const sel = churches.find(c => c.id === form.iglesia_id);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!form.iglesia_id) { setError("Selecciona una iglesia"); return; }
    setLoading(true);
    try {
      await apiPost("/auth/register", { ...form, rol_id: "8ce5822a-dca8-4a10-bbed-c7fcc220c3b6", foto_url: form.foto_url || "" });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) { setError(err.message || "Error"); }
    finally { setLoading(false); }
  }

  if (success) return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div ref={successRef} className="text-center bg-[var(--surface-card)] border rounded-2xl p-10">
        <Check className="w-10 h-10 text-green-500 mx-auto mb-3" />
        <h2 className="text-xl font-extrabold text-[var(--text)]">Cuenta creada</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">Redirigiendo...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex items-start justify-center p-4 py-8 overflow-auto">
      <div ref={formRef} className="w-full max-w-lg">
        <form onSubmit={submit}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center mb-4 shadow-lg shadow-brand/20"><UserPlus className="w-6 h-6 text-white" /></div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">Unete a Oikos</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Crea tu cuenta</p>
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /><p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p></div>}

        <div className="rounded-2xl bg-[var(--surface-card)] border p-6 space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2"><Church className="w-3 h-3" /> Iglesia <span className="text-red-500">*</span></label>
            <div ref={ddRef} className="relative">
              <button type="button" onClick={e => { e.preventDefault(); setOpen(!open); }} className={`w-full px-4 py-2.5 rounded-xl text-left text-sm flex items-center justify-between border focus:outline-none focus:ring-2 focus:ring-brand transition-all duration-150 ${sel ? "bg-brand/5 border-brand/20 text-[var(--text)]" : "bg-[var(--surface)] border text-[var(--text-muted)]"}`}>
                <span>{loadingCh ? "Cargando..." : sel ? sel.nombre : "Selecciona tu iglesia"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="absolute z-[200] left-0 right-0 mt-1 max-h-52 overflow-y-auto rounded-xl bg-[var(--surface-card)] border shadow-xl">
                  {churches.map(c => (
                    <div key={c.id} onClick={() => { set("iglesia_id", c.id); setOpen(false); }} className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-brand/5 transition-colors ${c.id === form.iglesia_id ? "bg-brand/5 text-brand font-semibold" : "text-[var(--text)]"}`}>
                      {c.nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {FIELDS.map(f => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2"><f.icon className="w-3 h-3" /> {f.label}</label>
              <input name={f.name} type={f.name === "fecha_nacimiento" ? "date" : f.name === "password" ? "password" : f.name === "email" ? "email" : "text"} value={form[f.name] || ""} onChange={e => set(f.name, e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border focus:outline-none focus:ring-2 focus:ring-brand text-sm text-[var(--text)]" required={f.name !== "telefono_emergencia"} />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="w-full mt-4 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-light active:scale-[0.98] transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Crear cuenta"}
        </button>

        <p className="mt-4 text-center text-sm text-[var(--text-muted)]">Ya tienes cuenta? <Link href="/login" className="text-brand font-bold hover:underline">Iniciar Sesion</Link></p>
        </form>
      </div>
    </div>
  );
}
