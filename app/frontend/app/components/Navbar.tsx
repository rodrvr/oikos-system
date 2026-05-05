"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import { Sun, Moon, Menu, Church } from "lucide-react";
import gsap from "gsap";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-nav-item]", { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 bg-surface-alt/80 backdrop-blur-xl border-b border-primary/5"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link data-nav-item href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <Church className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-primary tracking-tight hidden sm:block">Oikos</span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            <Link data-nav-item href="/events/global" className="px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-primary/5 transition-all duration-200">
              Eventos
            </Link>
            <Link data-nav-item href="/churches" className="px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-primary/5 transition-all duration-200">
              Iglesias
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            data-nav-item
            onClick={toggle}
            className="p-2.5 rounded-xl hover:bg-primary/5 transition-all duration-200 active:scale-95"
            aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
          >
            {dark ? <Sun className="w-4 h-4 text-text-secondary" /> : <Moon className="w-4 h-4 text-text-secondary" />}
          </button>

          {isAuthenticated ? (
            <>
              <Link data-nav-item href="/dashboard" className="hidden sm:flex px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-primary/5 transition-all duration-200">
                Dashboard
              </Link>
              <button
                data-nav-item
                onClick={logout}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-95 transition-all duration-200"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              data-nav-item
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light active:scale-95 transition-all duration-200 shadow-md shadow-primary/20"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
