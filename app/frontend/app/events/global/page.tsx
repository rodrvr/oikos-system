"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/api";

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

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet("/events/global");
        setEvents(Array.isArray(data) ? data : []);
      } catch {}
    }
    load();
  }, []);

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
      <h1 className="text-2xl font-bold mb-6 text-primary">Eventos Globales</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((e) => (
          <div key={e.id} className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4 transition-transform hover:scale-[1.02]">
            <h2 className="font-bold">{e.titulo}</h2>
            <p className="text-sm opacity-70">{e.descripcion}</p>
            <p className="text-xs opacity-50">{new Date(e.fecha).toLocaleDateString()} | {e.tipo} | {e.cupos} cupos</p>
            {e.iglesia && <p className="text-xs text-secondary mt-1">Iglesia: {e.iglesia.nombre}</p>}
          </div>
        ))}
        {events.length === 0 && <p className="opacity-50">No hay eventos globales disponibles.</p>}
      </div>
    </main>
  );
}
