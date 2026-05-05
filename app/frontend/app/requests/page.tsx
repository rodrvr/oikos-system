"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiPut } from "@/app/lib/api";
import dynamic from "next/dynamic";

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
  const [error, setError] = useState("");
  const [pastorId, setPastorId] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    async function load() {
      try {
        const data = await apiGet("/requests", token!);
        setRequests(Array.isArray(data) ? data : []);
      } catch { setError("Error al cargar solicitudes"); }
    }
    load();
  }, [isAuthenticated, token, router]);

  async function crearSolicitud(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiPost("/requests", { pastor_id: pastorId, mensaje }, token!);
      setPastorId("");
      setMensaje("");
      const data = await apiGet("/requests", token!);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear");
    }
  }

  async function responder(id: string, estado: string) {
    try {
      await apiPut(`/requests/${id}`, { estado }, token!);
      const data = await apiGet("/requests", token!);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al responder");
    }
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-primary">Solicitudes</h1>
        {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}

        <form onSubmit={crearSolicitud} className="mb-6 flex flex-col sm:flex-row gap-2">
          <input
            placeholder="ID del pastor"
            value={pastorId}
            onChange={(e) => setPastorId(e.target.value)}
            className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-transparent flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            placeholder="Mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="px-3 py-2 rounded border border-zinc-300 dark:border-zinc-600 bg-transparent flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button type="submit" className="px-4 py-2 rounded bg-primary text-white hover:bg-[#2d5235] transition-colors">
            Crear
          </button>
        </form>

        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-4 flex flex-col gap-1">
              <p className="font-medium">{r.mensaje}</p>
              <p className="text-xs opacity-60">
                {new Date(r.fecha_solicitada).toLocaleDateString()} |{" "}
                {r.usuario?.nombre || "Tú"} → {r.pastor?.nombre || "Pastor"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  r.estado === "APROBADO" ? "bg-green-500 text-white" :
                  r.estado === "RECHAZADO" ? "bg-red-500 text-white" :
                  "bg-yellow-500 text-zinc-900"
                }`}>
                  {r.estado}
                </span>
                <button
                  onClick={() => responder(r.id, "APROBADO")}
                  className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => responder(r.id, "RECHAZADO")}
                  className="text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
