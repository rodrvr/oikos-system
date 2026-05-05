"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/api";

interface Verse {
  texto: string;
  referencia: string;
}

interface GlobalEvent {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: string;
  cupos: number;
}

interface Noticia {
  id: string;
  titulo: string;
  contenido: string;
}

export default function HomePage() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [globalEvents, setGlobalEvents] = useState<GlobalEvent[]>([]);
  const [news, setNews] = useState<Noticia[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [v, g, n] = await Promise.all([
          apiGet("/verse/daily").catch(() => null),
          apiGet("/events/global").catch(() => []),
          apiGet("/news").catch(() => []),
        ]);
        setVerse(v);
        setGlobalEvents(Array.isArray(g) ? g : []);
        setNews(Array.isArray(n) ? n : []);
      } catch {}
    }
    load();
  }, []);

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
      <div className="text-center mb-12 animate-fade-up">
        <h1 className="text-4xl font-bold text-primary">Oikos</h1>
        <p className="text-lg opacity-60 mt-2">Comunidad de iglesias unidas en fe</p>
      </div>

      {verse && (
        <section className="bg-secondary/20 rounded-xl p-6 mb-8 text-center animate-fade-up" style={{ animationDelay: "100ms" }}>
          <p className="italic text-lg">&ldquo;{verse.texto}&rdquo;</p>
          <p className="text-sm opacity-60 mt-2 font-medium">{verse.referencia}</p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-primary animate-fade-up">Eventos Globales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {globalEvents.map((e, i) => (
            <div
              key={e.id}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-fade-up"
              style={{ animationDelay: `${150 + i * 60}ms` }}
            >
              <h3 className="font-bold">{e.titulo}</h3>
              <p className="text-sm opacity-70">{e.descripcion}</p>
              <p className="text-xs opacity-50">{new Date(e.fecha).toLocaleDateString()} | {e.tipo} | {e.cupos} cupos</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 text-primary animate-fade-up">Noticias</h2>
        <div className="space-y-3">
          {news.map((n, i) => (
            <div
              key={n.id}
              className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-fade-up"
              style={{ animationDelay: `${150 + i * 60}ms` }}
            >
              <h3 className="font-bold">{n.titulo}</h3>
              <p className="text-sm opacity-70">{n.contenido}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
