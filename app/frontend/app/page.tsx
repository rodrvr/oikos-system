"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/api";
import { useHeroReveal, useReveal, useHoverLift } from "@/app/lib/animations";
import { BookOpen, Calendar, Globe } from "lucide-react";

export default function HomePage() {
  const [verse, setVerse] = useState<{ texto: string; referencia: string } | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useHeroReveal();
  const eventsRef = useReveal(0.06);
  const newsRef = useReveal(0.05);
  useHoverLift();

  useEffect(() => {
    Promise.all([apiGet("/verse/daily").catch(() => null), apiGet("/events/global").catch(() => []), apiGet("/news").catch(() => [])])
      .then(([v, g, n]) => { setVerse(v); setEvents(Array.isArray(g) ? g : []); setNews(Array.isArray(n) ? n : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-16 md:py-24">
      <div ref={heroRef} className="text-center mb-20">
        <div data-hero-icon className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand mb-6 shadow-lg shadow-brand/20">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 data-hero-title className="text-5xl md:text-7xl font-black tracking-tight text-[var(--text)] mb-5">Oikos</h1>
        <p data-hero-sub className="text-lg md:text-xl text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">La casa de Dios conectando comunidades, eventos y vidas</p>
        <div data-hero-cta className="flex justify-center gap-3 mt-8">
          <a href="/login" className="px-8 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-light active:scale-[0.97] transition-all duration-150 shadow-sm">Ingresar</a>
          <a href="/churches" className="px-8 py-3 rounded-xl border font-bold text-brand hover:bg-brand/5 active:scale-[0.97] transition-all duration-150">Iglesias</a>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6 max-w-2xl mx-auto">{[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl bg-[var(--surface-alt)]/50" />)}</div>
      ) : (
        <>
          {verse && (
            <section className="max-w-3xl mx-auto mb-20 p-10 md:p-14 rounded-3xl bg-[var(--surface-card)] border text-center">
              <blockquote className="text-2xl italic font-light leading-relaxed">&ldquo;{verse.texto}&rdquo;</blockquote>
              <div className="w-8 h-0.5 bg-brand/30 mx-auto mt-5 rounded-full" />
              <cite className="block mt-3 text-sm font-semibold text-brand tracking-wider uppercase not-italic">{verse.referencia}</cite>
            </section>
          )}

          {events.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-6"><Globe className="w-5 h-5 text-brand" /><h2 className="text-xl font-extrabold">Eventos Globales</h2></div>
              <div ref={eventsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {events.map(e => (
                  <article key={e.id} data-card data-reveal className="rounded-2xl p-6 bg-[var(--surface-card)] border shadow-sm transition-shadow duration-200 hover:shadow-md">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${e.tipo === "GRATIS" ? "bg-accent/20 text-accent" : "bg-amber-100 dark:bg-amber-900/20 text-amber-700"}`}>{e.tipo}</span>
                    <h3 className="font-bold mt-3 mb-1">{e.titulo}</h3>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2">{e.descripcion}</p>
                    <div className="flex justify-between text-xs text-[var(--text-muted)] mt-3 pt-3 border-t">
                      <time>{new Date(e.fecha).toLocaleDateString("es-CL", { day: "numeric", month: "long" })}</time>
                      <span className="font-semibold">{e.cupos} cupos</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {news.length > 0 && (
            <section className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6"><Calendar className="w-5 h-5 text-brand" /><h2 className="text-xl font-extrabold">Noticias</h2></div>
              <div ref={newsRef} className="space-y-3">
                {news.map(n => (
                  <article key={n.id} data-card data-reveal className="rounded-2xl p-6 bg-[var(--surface-card)] border shadow-sm transition-shadow duration-200 hover:shadow-md flex gap-4">
                    <div className="w-1 rounded-full bg-brand/30 flex-shrink-0" />
                    <div><h3 className="font-bold">{n.titulo}</h3><p className="text-sm text-[var(--text-muted)] mt-1">{n.contenido}</p></div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
