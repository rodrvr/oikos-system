"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { apiGet } from "@/app/lib/api";
import dynamic from "next/dynamic";
import gsap from "gsap";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

interface Church {
  id: string;
  nombre: string;
  youtube_url: string | null;
}

export default function LivePage() {
  const { isAuthenticated, token } = useAuth();
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function load() {
      try {
        if (isAuthenticated && token) {
          const data = await apiGet("/churches/my-church", token);
          setChurch(data);
        } else {
          const churches = await apiGet("/churches");
          if (Array.isArray(churches) && churches.length > 0) setChurch(churches[0]);
        }
      } catch {
        try {
          const churches = await apiGet("/churches");
          if (Array.isArray(churches) && churches.length > 0) setChurch(churches[0]);
        } catch {}
      } finally { setLoading(false); }
    }
    load();
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!mainRef.current || loading) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".live-heading", { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.5 });
      tl.fromTo(".live-player", { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.55 }, "-=0.2");
      tl.fromTo(".live-caption", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.15");
    }, mainRef);

    return () => ctx.revert();
  }, [loading]);

  const youtubeUrl = church?.youtube_url || "https://www.youtube.com/embed/live_stream?channel=UCExample";

  return (
    <>
      {isAuthenticated && <Sidebar />}
      <main ref={mainRef} className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="live-heading mb-6">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Streaming en Vivo</h1>
          {church && (
            <p className="text-sm text-accent-dark/50 dark:text-accent/40 mt-1">{church.nombre}</p>
          )}
        </div>

        {loading ? (
          <div className="rounded-2xl overflow-hidden shadow-xl relative" style={{ paddingBottom: "56.25%" }}>
            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm opacity-50">Conectando con la transmision...</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="live-player relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/5" style={{ paddingBottom: "56.25%" }}>
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-white drop-shadow-md">EN VIVO</span>
            </div>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={youtubeUrl}
              title={`Streaming en vivo - ${church?.nombre || "Oikos"}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <p className="live-caption text-sm opacity-40 mt-5 text-center">
          {isAuthenticated
            ? "Transmision en vivo de tu iglesia. Conectate con la comunidad."
            : "Servicio en vivo. Unete a la transmision de tu iglesia."}
        </p>
      </main>
    </>
  );
}
