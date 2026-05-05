"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { apiGet } from "@/app/lib/api";
import dynamic from "next/dynamic";
import { Radio, Wifi } from "lucide-react";
import gsap from "gsap";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

export default function LivePage() {
  const { isAuthenticated, token } = useAuth();
  const [church, setChurch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        if (isAuthenticated && token) setChurch(await apiGet("/churches/my-church", token));
        else { const c = await apiGet("/churches"); if (Array.isArray(c) && c.length) setChurch(c[0]); }
      } catch { try { const c = await apiGet("/churches"); if (Array.isArray(c) && c.length) setChurch(c[0]); } catch {} }
      finally { setLoading(false); }
    })();
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!ref.current || loading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".live-card", { opacity: 0, y: 16, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
    }, ref);
    return () => ctx.revert();
  }, [loading]);

  return (
    <>
      {isAuthenticated && <Sidebar />}
      <main ref={ref} className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-6"><h1 className="text-2xl font-extrabold text-[var(--text)]">Streaming</h1>{church && <p className="text-sm text-[var(--text-muted)] mt-1">{church.nombre}</p>}</header>

          {loading ? <div className="rounded-2xl bg-black h-0 pb-[56.25%] relative"><div className="absolute inset-0 flex items-center justify-center"><div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin" /></div></div> : church?.youtube_url ? (
            <div className="live-card relative w-full rounded-2xl overflow-hidden shadow-xl bg-black" style={{ paddingBottom: "56.25%" }}>
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-600/90"><span className="w-2 h-2 rounded-full bg-white animate-pulse" /><span className="text-xs font-bold text-white">EN VIVO</span></div>
              <iframe className="absolute inset-0 w-full h-full" src={church.youtube_url} title="Streaming" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--surface-card)] border p-12 text-center text-[var(--text-muted)]">
              <Wifi className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="font-medium">Sin transmision configurada</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
