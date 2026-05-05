"use client";

import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Sidebar() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <aside className="w-56 bg-primary text-white min-h-screen p-4 flex flex-col gap-1 shadow-lg animate-slide-right" role="navigation" aria-label="Sidebar">
      <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-white/10 active:scale-[0.97] transition-all duration-150 text-sm">
        Dashboard
      </Link>
      <Link href="/events" className="px-3 py-2 rounded hover:bg-white/10 active:scale-[0.97] transition-all duration-150 text-sm">
        Eventos
      </Link>
      <Link href="/requests" className="px-3 py-2 rounded hover:bg-white/10 active:scale-[0.97] transition-all duration-150 text-sm">
        Solicitudes
      </Link>
      <Link href="/profile" className="px-3 py-2 rounded hover:bg-white/10 active:scale-[0.97] transition-all duration-150 text-sm">
        Perfil
      </Link>
      <Link href="/live" className="px-3 py-2 rounded hover:bg-white/10 active:scale-[0.97] transition-all duration-150 text-sm">
        Streaming
      </Link>
    </aside>
  );
}
