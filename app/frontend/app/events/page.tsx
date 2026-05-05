"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/app/lib/api";
import dynamic from "next/dynamic";
import { useReveal, useHoverLift, celebrate } from "@/app/lib/animations";
import { Calendar, Users, Ticket, Globe, Sparkles } from "lucide-react";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

export default function EventsPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const eventsRef = useReveal(0.06);
  useHoverLift();

  useEffect(() => { if (!isAuthenticated) { router.push("/login"); return; } apiGet("/events", token!).then(d => setEvents(Array.isArray(d) ? d : [])).catch(() => setError("Error")).finally(() => setLoading(false)); }, [isAuthenticated, token, router]);

  async function inscribir(id: string) { setMsg(""); try { await apiPost("/inscriptions", { evento_id: id }, token!); setMsg("Inscripcion exitosa"); } catch (e: any) { setError(e.message); } }

  if (!isAuthenticated) return null;

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8"><h1 className="text-2xl font-extrabold text-[var(--text)]">Eventos</h1><p className="text-sm text-[var(--text-muted)] mt-1">Actividades de tu iglesia</p></header>
          {msg && <div className="mb-5 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-2"><Sparkles className="w-4 h-4" />{msg}</div>}
          {error && <div className="mb-5 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">{error}</div>}
          {loading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-48 rounded-2xl bg-[var(--surface-alt)]/50" />)}</div> : events.length === 0 ? <div className="text-center py-20 text-[var(--text-muted)]"><Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="font-medium">Sin eventos</p></div> : (
            <div ref={eventsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {events.map(e => (
                <article key={e.id} data-card data-reveal className="rounded-2xl bg-[var(--surface-card)] border shadow-sm p-6 flex flex-col gap-3 transition-shadow duration-200 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${e.tipo === "GRATIS" ? "bg-accent/20 text-accent" : "bg-amber-100 dark:bg-amber-900/20 text-amber-700"}`}>{e.tipo}</span>
                    {e.es_global && <span className="flex items-center gap-1 text-xs text-blue-600"><Globe className="w-3 h-3" />Global</span>}
                  </div>
                  <h2 className="font-bold">{e.titulo}</h2>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2 flex-1">{e.descripcion}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]"><Calendar className="w-3 h-3" /><time>{new Date(e.fecha).toLocaleDateString("es-CL", { day: "numeric", month: "long" })}</time></div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]"><Users className="w-3 h-3" /><span className="font-semibold">{e.cupos} cupos</span></div>
                  </div>
                  <button onClick={() => inscribir(e.id)} className="w-full py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-light active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"><Ticket className="w-4 h-4" />Inscribirse</button>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
