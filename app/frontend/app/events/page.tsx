"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/app/lib/api";
import dynamic from "next/dynamic";
import { SkeletonCard, EmptyState } from "@/app/components/Skeleton";

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

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    async function load() {
      try {
        const data = await apiGet("/events", token!);
        setEvents(Array.isArray(data) ? data : []);
      } catch { setError("Error al cargar eventos"); }
      finally { setLoading(false); }
    }
    load();
  }, [isAuthenticated, token, router]);

  async function inscribir(eventoId: string) {
    setMsg("");
    try {
      await apiPost("/inscriptions", { evento_id: eventoId }, token!);
      setMsg("Inscripción exitosa");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al inscribirse");
    }
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-primary">Eventos</h1>
        {msg && <p className="text-green-600 dark:text-green-400 mb-4 animate-fade-in" role="status">{msg}</p>}
        {error && <p className="text-red-500 mb-4 animate-fade-in" role="alert">{error}</p>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState message="No hay eventos disponibles." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
              <div key={e.id} className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4 flex flex-col gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-fade-up">
                <h2 className="font-bold text-lg">{e.titulo}</h2>
                <p className="text-sm opacity-70">{e.descripcion}</p>
                <p className="text-sm">{new Date(e.fecha).toLocaleDateString()}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded bg-secondary text-zinc-900 font-medium">
                    {e.tipo} | {e.cupos} cupos
                  </span>
                  {e.es_global && <span className="text-xs px-2 py-1 rounded bg-blue-500 text-white">Global</span>}
                </div>
                <button
                  onClick={() => inscribir(e.id)}
                  className="mt-2 py-2 rounded bg-primary text-white text-sm font-medium hover:bg-[#2d5235] active:scale-[0.97] transition-all duration-150"
                >
                  Inscribirse
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
