"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/app/lib/api";
import dynamic from "next/dynamic";
import { useStaggerEntrance, usePageEntrance, celebrate } from "@/app/lib/animations";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

interface Event {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  cupos: number;
  tipo: string;
  es_global: boolean;
}

export default function EventsPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const msgRef = useRef<HTMLParagraphElement>(null);
  const pageRef = usePageEntrance();
  const eventsRef = useStaggerEntrance("[data-event-card]");

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    async function load() {
      try {
        const data = await apiGet("/events", token!);
        setEvents(Array.isArray(data) ? data : []);
      } catch { setError("No se pudieron cargar los eventos."); }
      finally { setLoading(false); }
    }
    load();
  }, [isAuthenticated, token, router]);

  useEffect(() => {
    if (msg && msgRef.current) celebrate(msgRef.current);
  }, [msg]);

  async function inscribir(eventoId: string) {
    setMsg("");
    try {
      await apiPost("/inscriptions", { evento_id: eventoId }, token!);
      setMsg("Te has inscrito exitosamente");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al inscribirse");
    }
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Sidebar />
      <main ref={pageRef} className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Eventos</h1>
          <p className="text-sm text-accent-dark/50 dark:text-accent/40 mt-1">Actividades y reuniones de tu iglesia</p>
        </header>

        {msg && (
          <p ref={msgRef} className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium" role="status">
            {msg}
          </p>
        )}
        {error && <p className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm" role="alert">{error}</p>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl p-6 bg-white/50 dark:bg-zinc-800/50 space-y-3">
                <div className="h-5 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
                <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-600 rounded-lg" />
                <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-600 rounded-lg" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-lg font-medium">No hay eventos programados</p>
            <p className="text-sm mt-1">Los eventos de tu iglesia apareceran aqui</p>
          </div>
        ) : (
          <div ref={eventsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((e) => (
              <article
                key={e.id}
                data-event-card
                className="group relative bg-white dark:bg-zinc-800/80 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary/10 flex flex-col gap-3"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-start justify-between">
                  <h2 className="font-bold text-lg relative">{e.titulo}</h2>
                  {e.es_global && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">Global</span>
                  )}
                </div>
                <p className="text-sm opacity-60 line-clamp-2">{e.descripcion}</p>
                <time className="text-xs opacity-40">{new Date(e.fecha).toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}</time>
                <div className="flex items-center gap-2 mt-auto">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${e.tipo === "GRATIS" ? "bg-secondary/20 text-secondary" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"}`}>
                    {e.tipo}
                  </span>
                  <span className="text-xs opacity-40">{e.cupos} cupos</span>
                </div>
                <button
                  onClick={() => inscribir(e.id)}
                  className="mt-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-[#2d5235] active:scale-[0.97] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Inscribirse
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
