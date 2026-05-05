"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/api";
import { useReveal, useHeroReveal } from "@/app/lib/animations";
import { Church, Calendar, BookOpen, Globe } from "lucide-react";

interface Verse { texto: string; referencia: string }
interface GlobalEvent { id: string; titulo: string; descripcion: string; fecha: string; tipo: string; cupos: number; iglesia?: { nombre: string } }
interface Noticia { id: string; titulo: string; contenido: string }

export default function HomePage() {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [globalEvents, setGlobalEvents] = useState<GlobalEvent[]>([]);
  const [news, setNews] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useHeroReveal();
  const eventsRef = useReveal(0.07);
  const newsRef = useReveal(0.06);

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

  return (
    <div className="flex-1 w-full">
      <main className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div ref={heroRef} className="text-center mb-20">
          <div data-hero-visual className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-8 shadow-xl shadow-primary/20">
            <Church className="w-10 h-10 text-white" />
          </div>
          <h1 data-hero-title className="text-5xl md:text-7xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-br from-primary via-primary to-secondary bg-clip-text text-transparent">
              Oikos
            </span>
          </h1>
          <p data-hero-sub className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-light">
            La casa de Dios conectando comunidades, eventos y vidas a traves de la fe
          </p>
          <div data-hero-cta className="flex items-center justify-center gap-4 mt-8">
            <a href="/login" className="px-8 py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary-light active:scale-[0.97] transition-all duration-200 shadow-lg shadow-primary/20">
              Ingresar
            </a>
            <a href="/churches" className="px-8 py-3.5 rounded-2xl border border-primary/20 text-primary font-bold hover:bg-primary/5 active:scale-[0.97] transition-all duration-200">
              Iglesias
            </a>
          </div>
        </div>

        {loading ? (
          <div className="space-y-8 max-w-2xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-alt/50 rounded-3xl p-8 space-y-4">
                <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
                <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-600 rounded-xl" />
                <div className="h-4 w-2/3 bg-zinc-100 dark:bg-zinc-600 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {verse && (
              <section className="relative max-w-3xl mx-auto mb-20">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent rounded-3xl -rotate-1 scale-105" />
                <div className="relative bg-surface-alt/50 rounded-3xl p-10 md:p-14 text-center border border-secondary/10 shadow-lg backdrop-blur-sm">
                  <BookOpen className="w-8 h-8 text-secondary mx-auto mb-6 opacity-60" />
                  <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed text-text-primary">
                    &ldquo;{verse.texto}&rdquo;
                  </blockquote>
                  <div className="mt-6 w-12 h-0.5 bg-secondary/30 mx-auto rounded-full" />
                  <cite className="block mt-4 text-sm font-semibold text-secondary tracking-widest uppercase not-italic">
                    {verse.referencia}
                  </cite>
                </div>
              </section>
            )}

            {globalEvents.length > 0 && (
              <section className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-text-primary">Eventos Globales</h2>
                    <p className="text-sm text-text-secondary">Abiertos a todas las iglesias de la comunidad</p>
                  </div>
                </div>
                <div ref={eventsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {globalEvents.map((e) => (
                    <article key={e.id} data-reveal data-card className="group relative bg-surface-alt/50 backdrop-blur-sm rounded-3xl p-6 border border-primary/5 hover:border-primary/10 transition-all duration-300 shadow-sm hover:shadow-xl">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-transparent rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="flex items-start justify-between mb-4">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${e.tipo === "GRATIS" ? "bg-secondary/15 text-secondary" : "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"}`}>
                          {e.tipo}
                        </span>
                        <Calendar className="w-4 h-4 opacity-30" />
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">{e.titulo}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">{e.descripcion}</p>
                      <div className="flex items-center justify-between text-xs text-text-secondary pt-3 border-t border-primary/5">
                        <time>{new Date(e.fecha).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })}</time>
                        <span className="font-semibold">{e.cupos} cupos</span>
                      </div>
                      {e.iglesia && (
                        <p className="text-xs text-secondary/60 mt-2 font-medium">{e.iglesia.nombre}</p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {news.length > 0 && (
              <section className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-accent-dark/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-accent-dark" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-text-primary">Noticias</h2>
                    <p className="text-sm text-text-secondary">Lo que esta pasando en la comunidad</p>
                  </div>
                </div>
                <div ref={newsRef} className="space-y-4">
                  {news.map((n) => (
                    <article key={n.id} data-reveal data-card className="group relative bg-surface-alt/50 backdrop-blur-sm rounded-3xl p-6 border border-primary/5 hover:border-primary/10 transition-all duration-300 shadow-sm hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="w-1 h-full min-h-[3rem] bg-gradient-to-b from-primary to-secondary rounded-full opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">{n.titulo}</h3>
                          <p className="text-sm text-text-secondary leading-relaxed">{n.contenido}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {globalEvents.length === 0 && news.length === 0 && (
              <div className="text-center py-24 opacity-30">
                <Church className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xl font-medium">La comunidad esta despertando</p>
                <p className="text-sm mt-2">Pronto veras eventos y noticias aqui</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
