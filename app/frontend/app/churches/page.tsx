"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/api";
import { useReveal, useHoverLift } from "@/app/lib/animations";
import { Church, MapPin } from "lucide-react";

export default function ChurchesPage() {
  const [churches, setChurches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useReveal(0.06);
  useHoverLift();

  useEffect(() => { apiGet("/churches").then(d => setChurches(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
      <header className="mb-8"><h1 className="text-2xl font-extrabold text-[var(--text)]">Iglesias</h1><p className="text-sm text-[var(--text-muted)] mt-1">Comunidades Oikos</p></header>
      {loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1,2].map(i => <div key={i} className="h-40 rounded-2xl bg-[var(--surface-alt)]/50" />)}</div> : churches.length === 0 ? <div className="text-center py-20 text-[var(--text-muted)]"><Church className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>Sin iglesias</p></div> : (
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {churches.map(c => (
            <article key={c.id} data-card data-reveal className="rounded-2xl bg-[var(--surface-card)] border p-6 transition-shadow duration-200 hover:shadow-md">
              <h2 className="text-lg font-extrabold text-brand mb-2">{c.nombre}</h2>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-3"><MapPin className="w-4 h-4" />{c.direccion}</div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{c.historia}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
