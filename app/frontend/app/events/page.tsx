"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/app/lib/api";
import dynamic from "next/dynamic";
import { useReveal } from "@/app/lib/animations";
import { Calendar, MapPin, Users, Ticket, Globe, Sparkles } from "lucide-react";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

interface Event {
  id: string; titulo: string; descripcion: string; fecha: string; cupos: number; tipo: string; es_global: boolean;
}

export default function EventsPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const eventsRef = useReveal(0.07);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    async function load() {
      try { const data = await apiGet("/events", token!); setEvents(Array.isArray(data) ? data : []); }
      catch { setError("No se pudieron cargar los eventos."); }
      finally { setLoading(false); }
    }
    load();
  }, [isAuthenticated, token, router]);

  async function inscribir(eventoId: string) {
    setMsg("");
    try { await apiPost("/inscriptions", { evento_id: eventoId }, token!); setMsg("Te has inscrito exitosamente"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Error al inscribirse"); }
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Eventos</h1>
                <p className="text-text-secondary text-sm">Actividades y reuniones de tu iglesia</p>
              </div>
            </div>
          </header>

          {msg && (
            <div className="mb-6 p-5 rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-green-600" />
              <p className="text-green-600 dark:text-green-400 text-sm font-semibold">{msg}</p>
            </div>
          )}
          {error && <div className="mb-6 p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900"><p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p></div>}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => <div key={i} className="rounded-3xl p-8 bg-surface-alt/50 border border-primary/5 h-56" />)}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-24 opacity-30">
              <Calendar className="w-16 h-16 mx-auto mb-4" />
              <p className="text-xl font-medium">No hay eventos programados</p>
              <p className="text-sm mt-2">Los eventos de tu iglesia apareceran aqui</p>
            </div>
          ) : (
            <div ref={eventsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((e) => (
                <article key={e.id} data-reveal data-card className="group relative bg-surface-alt/50 backdrop-blur-sm rounded-3xl p-7 border border-primary/5 hover:border-primary/10 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-transparent rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${e.tipo === "GRATIS" ? "bg-secondary/15 text-secondary" : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"}`}>
                      {e.tipo}
                    </span>
                    {e.es_global && (
                      <span className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                        <Globe className="w-3 h-3" /> Global
                      </span>
                    )}
                  </div>
                  <h2 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">{e.titulo}</h2>
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4 flex-1">{e.descripcion}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Calendar className="w-3.5 h-3.5" />
                      <time>{new Date(e.fecha).toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}</time>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-semibold">{e.cupos} cupos disponibles</span>
                    </div>
                  </div>
                  <button
                    onClick={() => inscribir(e.id)}
                    className="w-full py-3 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary-light active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4" /> Inscribirse
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
