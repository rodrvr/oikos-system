"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPut } from "@/app/lib/api";
import dynamic from "next/dynamic";
import { useStaggerEntrance, usePageEntrance, celebrate } from "@/app/lib/animations";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

interface Request {
  id: string;
  mensaje: string;
  estado: string;
  fecha_solicitada: string;
  usuario?: { id: string; nombre: string; email: string };
  pastor?: { id: string; nombre: string; email: string };
}

export default function RequestsPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pastorId, setPastorId] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [creating, setCreating] = useState(false);

  const pageRef = usePageEntrance();
  const requestsRef = useStaggerEntrance("[data-request-card]");

  const loadRequests = useCallback(async () => {
    try {
      const data = await apiGet("/requests", token!);
      setRequests(Array.isArray(data) ? data : []);
    } catch { setError("No se pudieron cargar las solicitudes."); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    loadRequests();
  }, [isAuthenticated, loadRequests, router]);

  async function crearSolicitud(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await apiPost("/requests", { pastor_id: pastorId, mensaje }, token!);
      setPastorId("");
      setMensaje("");
      await loadRequests();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear");
    } finally { setCreating(false); }
  }

  async function responder(id: string, estado: string) {
    try {
      await apiPut(`/requests/${id}`, { estado }, token!);
      await loadRequests();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al responder");
    }
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Sidebar />
      <main ref={pageRef} className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Solicitudes</h1>
          <p className="text-sm text-accent-dark/50 dark:text-accent/40 mt-1">Gestiona tus peticiones y consultas pastorales</p>
        </header>

        {error && <p className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm" role="alert">{error}</p>}

        <form onSubmit={crearSolicitud} className="mb-8 flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-100 dark:border-zinc-700/50 shadow-sm">
          <input
            placeholder="ID del pastor"
            value={pastorId}
            onChange={(e) => setPastorId(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-primary flex-1 text-sm"
            required
          />
          <input
            placeholder="Escribe tu mensaje aqui..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-primary flex-[2] text-sm"
            required
          />
          <button type="submit" disabled={creating} className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-[#2d5235] active:scale-[0.97] transition-all duration-200 disabled:opacity-50 shadow-sm">
            {creating ? "Enviando..." : "Crear solicitud"}
          </button>
        </form>

        {loading ? (
          <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="rounded-2xl p-5 bg-white/50 dark:bg-zinc-800/50 h-24" />)}</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 opacity-40">
            <p className="text-4xl mb-3">&#128172;</p>
            <p className="text-lg font-medium">No tienes solicitudes</p>
            <p className="text-sm mt-1">Crea una nueva solicitud para tu pastor</p>
          </div>
        ) : (
          <div ref={requestsRef} className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} data-request-card className="group bg-white dark:bg-zinc-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-primary/10 flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <p className="font-semibold">{r.mensaje}</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    r.estado === "APROBADO" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                    r.estado === "RECHAZADO" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                  }`}>
                    {r.estado}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-40">
                  <span>{new Date(r.fecha_solicitada).toLocaleDateString("es-CL")}</span>
                  <span>·</span>
                  <span>{r.usuario?.nombre || "Tu"} → {r.pastor?.nombre || "Pastor"}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button onClick={() => responder(r.id, "APROBADO")} className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 active:scale-[0.97] transition-all duration-150 font-medium">
                    Aprobar
                  </button>
                  <button onClick={() => responder(r.id, "RECHAZADO")} className="text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 active:scale-[0.97] transition-all duration-150 font-medium">
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
