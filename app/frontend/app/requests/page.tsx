"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPut } from "@/app/lib/api";
import dynamic from "next/dynamic";
import { useReveal } from "@/app/lib/animations";
import { MessageSquare, Send, Check, X } from "lucide-react";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

export default function RequestsPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pastorId, setPastorId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useReveal(0.04);

  const load = useCallback(async () => {
    try { const d = await apiGet("/requests", token!); setRequests(Array.isArray(d) ? d : []); }
    catch { setError("Error al cargar"); } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (!isAuthenticated) { router.push("/login"); return; } load(); }, [isAuthenticated, load, router]);

  async function crear(e: React.FormEvent) { e.preventDefault(); setSending(true); try { await apiPost("/requests", { pastor_id: pastorId, mensaje }, token!); setPastorId(""); setMensaje(""); await load(); } catch (err: any) { setError(err.message); } finally { setSending(false); } }

  async function responder(id: string, estado: string) { try { await apiPut(`/requests/${id}`, { estado }, token!); await load(); } catch (err: any) { setError(err.message); } }

  if (!isAuthenticated) return null;

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8"><h1 className="text-2xl font-extrabold text-[var(--text)]">Solicitudes</h1><p className="text-sm text-[var(--text-muted)] mt-1">Gestiona tus peticiones</p></header>
          {error && <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">{error}</div>}

          <form onSubmit={crear} className="mb-8 flex flex-col sm:flex-row gap-2 p-4 rounded-2xl bg-[var(--surface-card)] border">
            <input placeholder="ID del pastor" value={pastorId} onChange={e => setPastorId(e.target.value)} className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface)] border text-sm focus:outline-none focus:ring-2 focus:ring-brand" required />
            <input placeholder="Tu mensaje" value={mensaje} onChange={e => setMensaje(e.target.value)} className="flex-[2] px-4 py-2.5 rounded-xl bg-[var(--surface)] border text-sm focus:outline-none focus:ring-2 focus:ring-brand" required />
            <button type="submit" disabled={sending} className="px-5 py-2.5 rounded-xl bg-brand text-white font-bold hover:bg-brand-light active:scale-[0.98] transition-all duration-150 disabled:opacity-50 flex items-center gap-2"><Send className="w-4 h-4" />{sending ? "..." : "Enviar"}</button>
          </form>

          {loading ? <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-20 rounded-2xl bg-[var(--surface-alt)]/50" />)}</div> : requests.length === 0 ? <div className="text-center py-16 text-[var(--text-muted)]"><MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="font-medium">Sin solicitudes</p></div> : (
            <div ref={listRef} className="space-y-3">
              {requests.map(r => (
                <div key={r.id} data-reveal className="rounded-2xl bg-[var(--surface-card)] border p-5 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold">{r.mensaje}</p>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${r.estado === "APROBADO" ? "bg-green-100 dark:bg-green-900/20 text-green-700" : r.estado === "RECHAZADO" ? "bg-red-100 dark:bg-red-900/20 text-red-700" : "bg-amber-100 dark:bg-amber-900/20 text-amber-700"}`}>{r.estado}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span>{new Date(r.fecha_solicitada).toLocaleDateString("es-CL")}</span><span>·</span><span>{r.usuario?.nombre || "Tu"} → {r.pastor?.nombre || "Pastor"}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => responder(r.id, "APROBADO")} className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 active:scale-[0.97] transition-all duration-150 flex items-center gap-1"><Check className="w-3 h-3" />Aprobar</button>
                    <button onClick={() => responder(r.id, "RECHAZADO")} className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 active:scale-[0.97] transition-all duration-150 flex items-center gap-1"><X className="w-3 h-3" />Rechazar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
