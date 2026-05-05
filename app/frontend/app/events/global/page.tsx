"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/api";
import { useReveal, useHoverLift } from "@/app/lib/animations";
import { Globe, Calendar } from "lucide-react";

export default function GlobalEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useReveal(0.06);
  useHoverLift();

  useEffect(() => { apiGet("/events/global").then(d => setEvents(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
      <header className="mb-8"><h1 className="text-2xl font-extrabold text-[var(--text)]">Eventos Globales</h1><p className="text-sm text-[var(--text-muted)] mt-1">Abiertos a toda la comunidad</p></header>
      {loading ? <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-40 rounded-2xl bg-[var(--surface-alt)]/50" />)}</div> : events.length === 0 ? <div className="text-center py-20 text-[var(--text-muted)]"><Globe className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>Sin eventos globales</p></div> : (
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map(e => (
            <article key={e.id} data-card data-reveal className="rounded-2xl bg-[var(--surface-card)] border p-6 transition-shadow duration-200 hover:shadow-md">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${e.tipo === "GRATIS" ? "bg-accent/20 text-accent" : "bg-amber-100 dark:bg-amber-900/20 text-amber-700"}`}>{e.tipo}</span>
              <h2 className="font-bold mt-3 mb-1">{e.titulo}</h2>
              <p className="text-sm text-[var(--text-muted)] line-clamp-2">{e.descripcion}</p>
              <div className="flex justify-between text-xs text-[var(--text-muted)] mt-3 pt-3 border-t">
                <time>{new Date(e.fecha).toLocaleDateString("es-CL", { day: "numeric", month: "long" })}</time>
                <span>{e.cupos} cupos</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
