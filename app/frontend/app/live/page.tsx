"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { apiGet } from "@/app/lib/api";
import dynamic from "next/dynamic";

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

  useEffect(() => {
    async function load() {
      try {
        if (isAuthenticated && token) {
          const data = await apiGet("/churches/my-church", token);
          setChurch(data);
        } else {
          const churches = await apiGet("/churches");
          if (Array.isArray(churches) && churches.length > 0) {
            setChurch(churches[0]);
          }
        }
      } catch {
        try {
          const churches = await apiGet("/churches");
          if (Array.isArray(churches) && churches.length > 0) {
            setChurch(churches[0]);
          }
        } catch {}
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAuthenticated, token]);

  const youtubeUrl = church?.youtube_url || "https://www.youtube.com/embed/live_stream?channel=UCExample";

  return (
    <>
      {isAuthenticated && <Sidebar />}
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold mb-2 text-primary">
            Streaming en Vivo
          </h1>
          {church && (
            <p className="text-sm opacity-60 mb-6">
              {church.nombre}
            </p>
          )}
        </div>

        {loading ? (
          <div className="animate-fade-in">
            <div className="relative w-full rounded-xl bg-zinc-200 dark:bg-zinc-700 overflow-hidden" style={{ paddingBottom: "56.25%" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-scale-in relative w-full rounded-xl shadow-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={youtubeUrl}
              title={`Streaming en vivo - ${church?.nombre || "Oikos"}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <p className="text-sm opacity-50 mt-4 text-center animate-fade-in">
          {isAuthenticated
            ? "Transmisión en vivo de tu iglesia. Conéctate con la comunidad."
            : "Transmisión en vivo del servicio. Conéctate con nosotros."}
        </p>
      </main>
    </>
  );
}
