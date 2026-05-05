"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiGet } from "@/app/lib/api";
import dynamic from "next/dynamic";
import { useReveal } from "@/app/lib/animations";
import { Calendar, ClipboardList, Newspaper, TrendingUp, Activity, Users } from "lucide-react";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

const greetings = ["Bendecido dia", "Dios te guarde", "El Senor te bendiga", "Gracia y paz a tu vida", "Cristo te fortalezca"];
const hours = ["Buenos dias", "Buenas tardes", "Buenas noches"];

function timeGreeting() {
  const h = new Date().getHours();
  return h < 12 ? hours[0] : h < 18 ? hours[1] : hours[2];
}

export default function DashboardPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<{ events: number; requests: number; news: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);
  const statsRef = useReveal(0.1);

  const loadData = useCallback(async () => {
    try {
      const [events, requests, news] = await Promise.all([
        apiGet("/events", token!).catch(() => []),
        apiGet("/requests", token!).catch(() => []),
        apiGet("/news").catch(() => []),
      ]);
      setData({ events: Array.isArray(events) ? events.length : 0, requests: Array.isArray(requests) ? requests.length : 0, news: Array.isArray(news) ? news.length : 0 });
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    loadData();
  }, [isAuthenticated, loadData, router]);

  if (!isAuthenticated) return null;

  const cards = data ? [
    { label: "Eventos Activos", value: data.events, icon: Calendar, gradient: "from-primary to-primary-light", subtitle: "actividades programadas" },
    { label: "Solicitudes", value: data.requests, icon: ClipboardList, gradient: "from-secondary to-secondary/80", subtitle: "peticiones recibidas" },
    { label: "Noticias", value: data.news, icon: Newspaper, gradient: "from-accent-dark to-accent-dark/90", subtitle: "publicadas" },
  ] : [];

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-text-secondary font-medium">{timeGreeting()}</p>
                <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">{greeting}</h1>
              </div>
            </div>
            <p className="text-text-secondary text-sm ml-16">Resumen de tu iglesia hoy</p>
          </header>

          {error && (
            <div className="mb-8 p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium text-sm">
                <Activity className="w-4 h-4" /> {error}
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-3xl p-8 bg-surface-alt/50 backdrop-blur-sm border border-primary/5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
                    <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-700 rounded-xl" />
                  </div>
                  <div className="h-10 w-16 bg-zinc-100 dark:bg-zinc-600 rounded-xl" />
                  <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-600 rounded-xl" />
                </div>
              ))}
            </div>
          ) : data ? (
            <div ref={statsRef} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {cards.map((card) => (
                  <div key={card.label} data-reveal data-card className="group relative overflow-hidden rounded-3xl p-8 bg-surface-alt/50 backdrop-blur-sm border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-500 cursor-default">
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-gradient-to-bl ${card.gradient} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500`} />
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-bold text-text-primary">{card.label}</p>
                    </div>
                    <p className="text-5xl font-black tracking-tight text-text-primary">{card.value}</p>
                    <p className="text-sm text-text-secondary mt-2">{card.subtitle}</p>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div data-reveal data-card className="rounded-3xl p-8 bg-surface-alt/50 backdrop-blur-sm border border-primary/5 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-text-primary">Actividad Reciente</h2>
                  </div>
                  <div className="space-y-4">
                    {data.events > 0 && (
                      <div className="flex items-center justify-between py-2 border-b border-primary/5">
                        <span className="text-sm text-text-secondary">Eventos programados</span>
                        <span className="text-sm font-bold text-primary">{data.events}</span>
                      </div>
                    )}
                    {data.requests > 0 && (
                      <div className="flex items-center justify-between py-2 border-b border-primary/5">
                        <span className="text-sm text-text-secondary">Solicitudes pendientes</span>
                        <span className="text-sm font-bold text-accent-dark">{data.requests}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-text-secondary">Noticias publicadas</span>
                      <span className="text-sm font-bold text-secondary">{data.news}</span>
                    </div>
                  </div>
                </div>

                <div data-reveal data-card className="rounded-3xl p-8 bg-surface-alt/50 backdrop-blur-sm border border-primary/5 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="w-5 h-5 text-secondary" />
                    <h2 className="font-bold text-lg text-text-primary">Acceso Rapido</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { href: "/events", label: "Ver todos los eventos", icon: Calendar },
                      { href: "/requests", label: "Gestionar solicitudes", icon: ClipboardList },
                      { href: "/live", label: "Streaming en vivo", icon: Activity },
                    ].map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/5 transition-colors duration-200 group/link"
                      >
                        <link.icon className="w-4 h-4 text-text-secondary group-hover/link:text-primary transition-colors" />
                        <span className="text-sm text-text-secondary group-hover/link:text-text-primary transition-colors font-medium">{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
