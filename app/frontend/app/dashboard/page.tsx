"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiGet } from "@/app/lib/api";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

export default function DashboardPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<{ events: number; requests: number; news: number } | null>(null);
  const [error, setError] = useState("");

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
      setError("Error al cargar datos");
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    loadData();
  }, [isAuthenticated, loadData, router]);

  if (!isAuthenticated) return null;

  const cards = data
    ? [
        { label: "Eventos", value: data.events, bg: "bg-primary text-white", delay: "0ms" },
        { label: "Solicitudes", value: data.requests, bg: "bg-secondary text-zinc-900", delay: "80ms" },
        { label: "Noticias", value: data.news, bg: "bg-accent-dark text-white", delay: "160ms" },
      ]
    : [];

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-primary animate-fade-up">Dashboard</h1>
        {error && <p className="text-red-500 mb-4 animate-fade-in" role="alert">{error}</p>}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className={`${card.bg} rounded-xl p-6 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-fade-up`}
                style={{ animationDelay: card.delay }}
              >
                <p className="text-sm opacity-80">{card.label}</p>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
