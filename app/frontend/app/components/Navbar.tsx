"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import gsap from "gsap";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const links = navRef.current.querySelectorAll("[data-nav-link]");
    const ctx = gsap.context(() => {
      gsap.fromTo(links, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out", delay: 0.1 });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm text-white px-5 py-3 flex items-center justify-between shadow-lg border-b border-white/10" role="navigation">
      <div className="flex items-center gap-6">
        <Link data-nav-link href="/" className="text-xl font-extrabold tracking-tight hover:brightness-110 active:scale-[0.97] transition-all duration-200">
          Oikos
        </Link>
        <Link data-nav-link href="/events/global" className="text-sm font-medium opacity-75 hover:opacity-100 hover:text-secondary active:scale-[0.97] transition-all duration-200">
          Eventos
        </Link>
        <Link data-nav-link href="/churches" className="text-sm font-medium opacity-75 hover:opacity-100 hover:text-secondary active:scale-[0.97] transition-all duration-200">
          Iglesias
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <button
          data-nav-link
          onClick={toggle}
          className="text-sm px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-[0.95] transition-all duration-200"
          aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {dark ? "☀️" : "🌙"}
        </button>
        {isAuthenticated ? (
          <>
            <Link data-nav-link href="/dashboard" className="text-sm font-medium opacity-75 hover:opacity-100 hover:text-secondary active:scale-[0.97] transition-all duration-200">
              Dashboard
            </Link>
            <Link data-nav-link href="/live" className="text-sm font-medium opacity-75 hover:opacity-100 hover:text-secondary active:scale-[0.97] transition-all duration-200">
              Streaming
            </Link>
            <button data-nav-link onClick={logout} className="text-sm px-4 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-700 active:scale-[0.95] transition-all duration-200 font-medium">
              Salir
            </button>
          </>
        ) : (
          <Link data-nav-link href="/login" className="text-sm px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-[0.97] transition-all duration-200 font-medium">
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  );
}
