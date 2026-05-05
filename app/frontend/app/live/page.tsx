"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { apiGet } from "@/app/lib/api";
import dynamic from "next/dynamic";
import { Radio, Play, Wifi } from "lucide-react";
import gsap from "gsap";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

interface Church { id: string; nombre: string; youtube_url: string | null }

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
        try { const churches = await apiGet("/churches"); if (Array.isArray(churches) && churches.length > 0) setChurch(churches[0]); } catch {}
      } finally { setLoading(false); }
    }
    load();
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!mainRef.current || loading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".live-header", { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.5 });
      tl.fromTo(".live-player-wrap", { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.6 }, "-=0.2");
      tl.fromTo(".live-info", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.15");
    }, mainRef);
    return () => ctx.revert();
  }, [loading]);

  const youtubeUrl = church?.youtube_url || "";

  return (
    <>
      {isAuthenticated && <Sidebar />}
      <main ref={mainRef} className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="live-header mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Streaming en Vivo</h1>
                {church && <p className="text-text-secondary text-sm">{church.nombre}</p>}
              </div>
            </div>
          </div>

          <div className="live-player-wrap relative w-full rounded-3xl overflow-hidden shadow-2xl shadow-black/10 ring-1 ring-primary/5 bg-black">
            {loading ? (
              <div style={{ paddingBottom: "56.25%" }} className="relative">
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                    <p className="text-white/50 text-sm">Conectando con la transmision...</p>
                  </div>
                </div>
              </div>
            ) : youtubeUrl ? (
              <>
                <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-red-600/90 backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-xs font-bold text-white tracking-wider">EN VIVO</span>
                  </div>
                  {church && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
                      <Wifi className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-medium text-white/80">{church.nombre}</span>
                    </div>
                  )}
                </div>
                <div style={{ paddingBottom: "56.25%" }} className="relative">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={youtubeUrl}
                    title={`Streaming en vivo - ${church?.nombre || "Oikos"}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </>
            ) : (
              <div style={{ paddingBottom: "56.25%" }} className="relative">
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                  <div className="text-center space-y-3">
                    <Play className="w-12 h-12 text-white/20 mx-auto" />
                    <p className="text-white/40 text-sm">No hay transmision configurada para esta iglesia</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="live-info mt-6 p-6 rounded-3xl bg-surface-alt/50 backdrop-blur-sm border border-primary/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Radio className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-text-primary mb-1">Acerca de la transmision</h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {isAuthenticated
                    ? "Estas viendo la transmision en vivo de tu iglesia. Conectate con tu comunidad y participa del servicio."
                    : "Servicio en vivo de la comunidad Oikos. Conectate desde cualquier lugar y comparte este momento."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
