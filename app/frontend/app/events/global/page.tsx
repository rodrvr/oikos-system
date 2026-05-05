"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/api";
import { useReveal } from "@/app/lib/animations";
import { Calendar, Globe } from "lucide-react";

interface GlobalEvent {
  id: string; titulo: string; descripcion: string; fecha: string; tipo: string; cupos: number;
  iglesia?: { nombre: string };
}

export default function GlobalEventsPage() {
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const eventsRef = useReveal(0.07);

  useEffect(() => {
    async function load() { try { const data = await apiGet("/events/global"); setEvents(Array.isArray(data) ? data : []); } catch {} finally { setLoading(false); } }
    load();
  }, []);

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 md:px-8 py-16 w-full">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Eventos Globales</h1>
            <p className="text-text-secondary text-sm">Actividades abiertas a toda la comunidad Oikos</p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{[1,2,3].map(i => <div key={i} className="rounded-3xl p-8 bg-surface-alt/50 border border-primary/5 h-48" />)}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-24 opacity-30"><Globe className="w-16 h-16 mx-auto mb-4" /><p className="text-xl font-medium">No hay eventos globales</p><p className="text-sm mt-2">Vuelve pronto</p></div>
      ) : (
        <div ref={eventsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((e) => (
            <article key={e.id} data-reveal data-card className="group relative bg-surface-alt/50 backdrop-blur-sm rounded-3xl p-6 border border-primary/5 hover:border-primary/10 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-transparent rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start justify-between mb-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${e.tipo === "GRATIS" ? "bg-secondary/15 text-secondary" : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"}`}>
                  {e.tipo}
                </span>
                <Calendar className="w-4 h-4 opacity-30" />
              </div>
              <h2 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{e.titulo}</h2>
              <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">{e.descripcion}</p>
              <div className="flex items-center justify-between text-xs text-text-secondary pt-3 border-t border-primary/5">
                <time>{new Date(e.fecha).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}</time>
                <span className="font-semibold">{e.cupos} cupos</span>
              </div>
              {e.iglesia && <p className="text-xs text-secondary mt-2 font-medium">{e.iglesia.nombre}</p>}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
