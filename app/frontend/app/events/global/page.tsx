"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/api";
import { useStaggerEntrance, usePageEntrance } from "@/app/lib/animations";

interface GlobalEvent {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: string;
  cupos: number;
  iglesia?: { nombre: string };
}

export default function GlobalEventsPage() {
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const pageRef = usePageEntrance();
  const eventsRef = useStaggerEntrance("[data-global-event]");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet("/events/global");
        setEvents(Array.isArray(data) ? data : []);
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <main ref={pageRef} className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Eventos Globales</h1>
        <p className="text-sm text-accent-dark/50 dark:text-accent/40 mt-1">Actividades abiertas a toda la comunidad Oikos</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <div key={i} className="rounded-2xl p-6 bg-white/50 dark:bg-zinc-800/50 h-40" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 opacity-40">
          <p className="text-4xl mb-3">🌍</p>
          <p className="text-lg font-medium">No hay eventos globales programados</p>
          <p className="text-sm mt-1">Vuelve pronto para ver las actividades de la comunidad</p>
        </div>
      ) : (
        <div ref={eventsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((e) => (
            <article
              key={e.id}
              data-global-event
              className="group relative bg-white dark:bg-zinc-800/80 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/10"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${e.tipo === "GRATIS" ? "bg-secondary/20 text-secondary" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
                {e.tipo}
              </span>
              <h2 className="font-bold text-lg mb-1 relative">{e.titulo}</h2>
              <p className="text-sm opacity-60 line-clamp-2 mb-3">{e.descripcion}</p>
              <footer className="flex items-center justify-between text-xs opacity-40">
                <time>{new Date(e.fecha).toLocaleDateString("es-CL", { day: "numeric", month: "long" })}</time>
                <span>{e.cupos} cupos</span>
              </footer>
              {e.iglesia && <p className="text-xs text-secondary/70 mt-2">{e.iglesia.nombre}</p>}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
