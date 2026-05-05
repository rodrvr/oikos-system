"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/api";
import { useReveal } from "@/app/lib/animations";
import { Church, MapPin, BookOpen } from "lucide-react";

interface Church { id: string; nombre: string; direccion: string; historia: string }

export default function ChurchesPage() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const churchesRef = useReveal(0.08);

  useEffect(() => {
    async function load() { try { const data = await apiGet("/churches"); setChurches(Array.isArray(data) ? data : []); } catch {} finally { setLoading(false); } }
    load();
  }, []);

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 md:px-8 py-16 w-full">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Church className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Nuestras Iglesias</h1>
            <p className="text-text-secondary text-sm">Comunidades de fe que forman parte de Oikos</p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{[1,2].map(i => <div key={i} className="rounded-3xl p-8 bg-surface-alt/50 border border-primary/5 h-48" />)}</div>
      ) : churches.length === 0 ? (
        <div className="text-center py-24 opacity-30"><Church className="w-16 h-16 mx-auto mb-4" /><p className="text-xl font-medium">Pronto veras iglesias aqui</p></div>
      ) : (
        <div ref={churchesRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {churches.map((c) => (
            <article key={c.id} data-reveal data-card className="group relative bg-surface-alt/50 backdrop-blur-sm rounded-3xl p-8 border border-primary/5 hover:border-primary/10 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-secondary to-transparent rounded-l-3xl opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Church className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-extrabold text-text-primary">{c.nombre}</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                <MapPin className="w-4 h-4" /> {c.direccion}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{c.historia}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
