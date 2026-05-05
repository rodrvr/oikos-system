"use client";

import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/contexts/ThemeContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { dark, toggle } = useTheme();

  return (
    <nav className="bg-primary text-white px-4 py-3 flex items-center justify-between shadow-md" role="navigation">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold tracking-tight hover:scale-[1.03] active:scale-[0.98] transition-all duration-150">
          Oikos
        </Link>
        <Link href="/events/global" className="text-sm hover:text-secondary active:scale-[0.97] transition-all duration-150">
          Eventos
        </Link>
        <Link href="/churches" className="text-sm hover:text-secondary active:scale-[0.97] transition-all duration-150">
          Iglesias
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 active:scale-[0.95] transition-all duration-150"
          aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {dark ? "☀️" : "🌙"}
        </button>
        {isAuthenticated ? (
          <>
            <Link href="/dashboard" className="text-sm hover:text-secondary active:scale-[0.97] transition-all duration-150">
              Dashboard
            </Link>
            <button onClick={logout} className="text-sm px-3 py-1 rounded bg-red-600 hover:bg-red-700 active:scale-[0.95] transition-all duration-150">
              Salir
            </button>
          </>
        ) : (
          <Link href="/login" className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 active:scale-[0.97] transition-all duration-150">
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  );
}
