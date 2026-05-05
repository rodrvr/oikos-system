"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/api";
import { useStaggerEntrance, usePageEntrance } from "@/app/lib/animations";

interface Church {
  id: string;
  nombre: string;
  direccion: string;
  historia: string;
}

export default function ChurchesPage() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const pageRef = usePageEntrance();
  const churchesRef = useStaggerEntrance("[data-church-card]");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet("/churches");
        setChurches(Array.isArray(data) ? data : []);
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <main ref={pageRef} className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Nuestras Iglesias</h1>
        <p className="text-sm text-accent-dark/50 dark:text-accent/40 mt-1">Comunidades de fe que forman parte de Oikos</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2].map((i) => <div key={i} className="rounded-2xl p-6 bg-white/50 dark:bg-zinc-800/50 h-40" />)}
        </div>
      ) : churches.length === 0 ? (
        <div className="text-center py-20 opacity-40">
          <p className="text-4xl mb-3">⛪</p>
          <p className="text-lg font-medium">Pronto veras iglesias aqui</p>
        </div>
      ) : (
        <div ref={churchesRef} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {churches.map((c) => (
            <article
              key={c.id}
              data-church-card
              className="group relative bg-white dark:bg-zinc-800/80 rounded-2xl p-7 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/10"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <h2 className="text-xl font-extrabold text-primary mb-2">{c.nombre}</h2>
              <p className="text-sm opacity-50 mb-3">📍 {c.direccion}</p>
              <p className="text-sm leading-relaxed opacity-65">{c.historia}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
