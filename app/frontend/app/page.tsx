"use client";

import { useEffect, useState, useRef } from "react";
import { apiGet } from "@/app/lib/api";
import { useStaggerEntrance, usePageEntrance } from "@/app/lib/animations";
import gsap from "gsap";

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
  iglesia?: { nombre: string };
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
  const [loading, setLoading] = useState(true);

  const pageRef = usePageEntrance();
  const verseRef = useRef<HTMLElement>(null);
  const eventsRef = useStaggerEntrance("[data-event-card]");
  const newsRef = useStaggerEntrance("[data-news-card]");

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
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  useEffect(() => {
    if (!verse || !verseRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    gsap.fromTo(verseRef.current, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out", delay: 0.3 });
  }, [verse]);

  return (
    <main ref={pageRef} className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
      <header className="text-center mb-14">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-b from-primary to-[#2d5235] bg-clip-text text-transparent">
          Oikos
        </h1>
        <p data-subtitle className="text-lg text-accent-dark/70 dark:text-accent/50 mt-3 max-w-md mx-auto leading-relaxed">
          Comunidad viva de iglesias unidas en fe, servicio y fraternidad
        </p>
      </header>

      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white/50 dark:bg-zinc-800/50 p-6 space-y-3">
              <div className="h-6 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
              <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-600 rounded-lg" />
              <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-600 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {verse && (
            <section ref={verseRef} className="relative overflow-hidden rounded-2xl mb-12 p-8 text-center bg-gradient-to-br from-secondary/25 via-secondary/15 to-transparent dark:from-secondary/10 dark:via-secondary/5 border border-secondary/20">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />
              <blockquote className="text-2xl italic font-light leading-relaxed max-w-2xl mx-auto">
                &ldquo;{verse.texto}&rdquo;
              </blockquote>
              <cite className="block mt-4 text-sm font-semibold text-secondary tracking-wider not-italic">
                {verse.referencia}
              </cite>
            </section>
          )}

          {globalEvents.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-primary mb-1">Eventos Globales</h2>
              <p className="text-sm text-accent-dark/50 dark:text-accent/40 mb-6">Abiertos a todas las iglesias de la comunidad</p>
              <div ref={eventsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {globalEvents.map((e) => (
                  <article
                    key={e.id}
                    data-event-card
                    className="group relative bg-white dark:bg-zinc-800/80 rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-primary/10"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${e.tipo === "GRATIS" ? "bg-secondary/20 text-secondary" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
                      {e.tipo}
                    </span>
                    <h3 className="font-bold text-lg mb-1 relative">{e.titulo}</h3>
                    <p className="text-sm opacity-60 line-clamp-2 mb-3">{e.descripcion}</p>
                    <footer className="flex items-center justify-between text-xs opacity-40">
                      <time>{new Date(e.fecha).toLocaleDateString("es-CL", { day: "numeric", month: "long" })}</time>
                      <span>{e.cupos} cupos</span>
                    </footer>
                    {e.iglesia && (
                      <p className="text-xs text-secondary/70 mt-2">{e.iglesia.nombre}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {news.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-primary mb-1">Noticias</h2>
              <p className="text-sm text-accent-dark/50 dark:text-accent/40 mb-6">Lo que esta pasando en la comunidad</p>
              <div ref={newsRef} className="space-y-4">
                {news.map((n) => (
                  <article
                    key={n.id}
                    data-news-card
                    className="group relative bg-white dark:bg-zinc-800/80 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-primary/10 overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <h3 className="font-bold text-lg mb-1">{n.titulo}</h3>
                    <p className="text-sm opacity-65 leading-relaxed">{n.contenido}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {globalEvents.length === 0 && news.length === 0 && (
            <div className="text-center py-20 opacity-40">
              <p className="text-4xl mb-3">&#127793;</p>
              <p className="text-lg font-medium">La comunidad esta despertando</p>
              <p className="text-sm mt-1">Pronto veras eventos y noticias de tu iglesia aqui</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
