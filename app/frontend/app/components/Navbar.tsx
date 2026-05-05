"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import gsap from "gsap";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-nav-item]", { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.04, ease: "power2.out", delay: 0.1 });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="sticky top-0 z-50 h-16 bg-[var(--surface)]/95 backdrop-blur-sm border-b" role="navigation">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link data-nav-item href="/" className="text-lg font-extrabold text-brand hover:text-brand-light transition-colors duration-150">
            Oikos
          </Link>
          <Link data-nav-item href="/events/global" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-150">
            Eventos
          </Link>
          <Link data-nav-item href="/churches" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-150">
            Iglesias
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button data-nav-item onClick={toggle} className="p-2 rounded-lg hover:bg-[var(--surface-alt)] transition-colors duration-150" aria-label="Cambiar tema">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {isAuthenticated ? (
            <>
              <Link data-nav-item href="/dashboard" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-150 px-2">Dashboard</Link>
              <button data-nav-item onClick={logout} className="text-sm font-medium px-4 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-95 transition-all duration-150">
                Salir
              </button>
            </>
          ) : (
            <Link data-nav-item href="/login" className="text-sm font-bold px-5 py-2 rounded-lg bg-brand text-white hover:bg-brand-light active:scale-95 transition-all duration-150 shadow-sm">
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
