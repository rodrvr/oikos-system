"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiGet } from "@/app/lib/api";
import dynamic from "next/dynamic";
import { usePageEntrance, useStaggerEntrance, celebrate } from "@/app/lib/animations";
import gsap from "gsap";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

const greetings = [
  "Bendecido dia",
  "Dios te guarde",
  "El Senor te bendiga",
  "Gracia y paz",
  "Cristo te fortalezca",
];

export default function DashboardPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<{ events: number; requests: number; news: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);
  const pageRef = usePageEntrance();
  const cardsRef = useStaggerEntrance("[data-stat-card]");

  const loadData = useCallback(async () => {
    try {
      const [events, requests, news] = await Promise.all([
        apiGet("/events", token!).catch(() => []),
        apiGet("/requests", token!).catch(() => []),
        apiGet("/news").catch(() => []),
      ]);
      setData({
        events: Array.isArray(events) ? events.length : 0,
        requests: Array.isArray(requests) ? requests.length : 0,
        news: Array.isArray(news) ? news.length : 0,
      });
    } catch {
      setError("No se pudo conectar con el servidor. Verifica tu conexion.");
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    loadData();
  }, [isAuthenticated, loadData, router]);

  const statLabel = useCallback((el: HTMLElement | null) => {
    if (el && data) celebrate(el);
  }, [data]);

  if (!isAuthenticated) return null;

  const cards = data
    ? [
        { label: "Eventos activos", value: data.events, icon: "📅", bg: "from-primary to-primary/90", accent: "border-primary/30" },
        { label: "Solicitudes", value: data.requests, icon: "📝", bg: "from-secondary to-secondary/80", accent: "border-secondary/30" },
        { label: "Noticias", value: data.news, icon: "📰", bg: "from-accent-dark to-accent-dark/90", accent: "border-accent-dark/30" },
      ]
    : [];

  return (
    <>
      <Sidebar />
      <main ref={pageRef} className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">{greeting}</h1>
          <p className="text-sm text-accent-dark/50 dark:text-accent/40 mt-1">Resumen de tu iglesia hoy</p>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl p-6 bg-white/50 dark:bg-zinc-800/50 space-y-3">
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
                <div className="h-10 w-16 bg-zinc-100 dark:bg-zinc-600 rounded-lg" />
              </div>
            ))}
          </div>
        ) : data ? (
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {cards.map((card) => (
              <div
                key={card.label}
                data-stat-card
                ref={statLabel}
                className={`group relative overflow-hidden rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${card.bg} border ${card.accent} cursor-default`}
              >
                <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:opacity-15 group-hover:scale-110 transition-all duration-500">
                  {card.icon}
                </div>
                <p className="text-sm opacity-75 font-medium relative z-10">{card.label}</p>
                <p className="text-4xl font-black mt-2 tracking-tight relative z-10">{card.value}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
              </div>
            ))}
          </div>
        ) : null}
      </main>
    </>
  );
}
