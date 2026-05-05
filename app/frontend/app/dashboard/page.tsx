"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiGet } from "@/app/lib/api";
import dynamic from "next/dynamic";
import { useReveal } from "@/app/lib/animations";
import { Calendar, ClipboardList, Newspaper, TrendingUp, ArrowRight } from "lucide-react";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

const greet = ["Bendecido dia", "Dios te guarde", "El Senor te bendiga", "Gracia y paz"];

export default function DashboardPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<{ events: number; requests: number; news: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [g] = useState(() => greet[Math.floor(Math.random() * greet.length)]);
  const statsRef = useReveal(0.08);

  const load = useCallback(async () => {
    try {
      const [e, r, n] = await Promise.all([apiGet("/events", token!).catch(() => []), apiGet("/requests", token!).catch(() => []), apiGet("/news").catch(() => [])]);
      setData({ events: Array.isArray(e) ? e.length : 0, requests: Array.isArray(r) ? r.length : 0, news: Array.isArray(n) ? n.length : 0 });
    } catch { setError("Error de conexion"); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (!isAuthenticated) { router.push("/login"); return; } load(); }, [isAuthenticated, load, router]);
  if (!isAuthenticated) return null;

  const cards = data ? [
    { label: "Eventos", value: data.events, icon: Calendar, color: "text-brand", bg: "bg-brand/5" },
    { label: "Solicitudes", value: data.requests, icon: ClipboardList, color: "text-accent", bg: "bg-accent/10" },
    { label: "Noticias", value: data.news, icon: Newspaper, color: "text-earth", bg: "bg-earth/10" },
  ] : [];

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-2xl font-extrabold text-[var(--text)]">{g}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Panel de tu iglesia</p>
          </header>
          {error && <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">{error}</div>}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-[var(--surface-alt)]/50" />)}</div>
          ) : data ? (
            <div ref={statsRef} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cards.map(c => (
                  <div key={c.label} data-reveal data-card className="rounded-2xl bg-[var(--surface-card)] border shadow-sm p-6 transition-shadow duration-200 hover:shadow-md">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-4`}><c.icon className={`w-5 h-5 ${c.color}`} /></div>
                    <p className="text-4xl font-black">{c.value}</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">{c.label}</p>
                  </div>
                ))}
              </div>
              <div data-reveal data-card className="rounded-2xl bg-[var(--surface-card)] border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-brand" /><h2 className="font-bold">Acceso Rapido</h2></div>
                <div className="space-y-2">
                  {[{ h: "/events", l: "Ver eventos", i: Calendar }, { h: "/requests", l: "Gestionar solicitudes", i: ClipboardList }, { h: "/live", l: "Streaming en vivo", i: TrendingUp }].map(l => (
                    <a key={l.h} href={l.h} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--surface-alt)] transition-colors duration-150 group">
                      <div className="flex items-center gap-3"><l.i className="w-4 h-4 text-[var(--text-muted)] group-hover:text-brand transition-colors" /><span className="text-sm font-medium">{l.l}</span></div>
                      <ArrowRight className="w-4 h-4 text-[var(--text-muted)]/30 group-hover:text-brand transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
