"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { apiPost } from "@/app/lib/api";
import { jwtDecode } from "@/app/lib/jwt";
import { useEntrance } from "@/app/lib/animations";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const formRef = useEntrance();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const data = await apiPost("/auth/login", { email, password });
      const decoded = jwtDecode(data.token) as any;
      login(data.token, decoded);
      router.push("/dashboard");
    } catch { setError("Credenciales invalidas."); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div ref={formRef} className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center mb-5 shadow-lg shadow-brand/20">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]">Bienvenido</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Ingresa a tu cuenta</p>
        </div>

        {error && <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm text-center font-medium">{error}</div>}

        <div className="rounded-2xl bg-[var(--surface-card)] border p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2"><Mail className="w-3 h-3" /> Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border focus:outline-none focus:ring-2 focus:ring-brand text-sm" placeholder="tu@iglesia.cl" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2"><Lock className="w-3 h-3" /> Contrasena</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border focus:outline-none focus:ring-2 focus:ring-brand text-sm" placeholder="••••••" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl bg-brand text-white font-bold hover:bg-brand-light active:scale-[0.98] transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Ingresar <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-[var(--text-muted)]">No tienes cuenta? <Link href="/register" className="text-brand font-bold hover:underline">Unete</Link></p>
        </form>
      </div>
    </div>
  );
}
