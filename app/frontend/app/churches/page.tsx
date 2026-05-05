"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/app/lib/api";

interface Church {
  id: string;
  nombre: string;
  direccion: string;
  historia: string;
}

export default function ChurchesPage() {
  const [churches, setChurches] = useState<Church[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGet("/churches");
        setChurches(Array.isArray(data) ? data : []);
      } catch {}
    }
    load();
  }, []);

  return (
    <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
      <h1 className="text-2xl font-bold mb-6 text-primary">Iglesias</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {churches.map((c) => (
          <div key={c.id} className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 transition-transform hover:scale-[1.02]">
            <h2 className="text-xl font-bold text-primary">{c.nombre}</h2>
            <p className="text-sm opacity-70 mt-1">{c.direccion}</p>
            <p className="text-sm mt-2">{c.historia}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
