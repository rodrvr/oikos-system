"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { LayoutDashboard, Calendar, ClipboardList, User, Radio, Church } from "lucide-react";
import gsap from "gsap";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/events", label: "Eventos", icon: Calendar },
  { href: "/requests", label: "Solicitudes", icon: ClipboardList },
  { href: "/live", label: "Streaming", icon: Radio },
  { href: "/profile", label: "Perfil", icon: User },
];

export default function Sidebar() {
  const { isAuthenticated } = useAuth();
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!asideRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(asideRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
      gsap.fromTo("[data-side-link]", { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: "power2.out", delay: 0.15 });
    }, asideRef);
    return () => ctx.revert();
  }, []);

  if (!isAuthenticated) return null;

  return (
    <aside
      ref={asideRef}
      className="hidden md:flex w-64 flex-col bg-surface-alt/80 backdrop-blur-sm border-r border-primary/5 p-4 gap-1"
      role="navigation"
      aria-label="Navegacion principal"
    >
      <div className="px-4 py-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20">
            <Church className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-primary tracking-tight">Oikos</span>
        </div>
      </div>

      {links.map((link) => (
        <Link
          key={link.href}
          data-side-link
          href={link.href}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-primary/5 active:scale-[0.98] transition-all duration-200 group"
        >
          <link.icon className="w-5 h-5 text-text-secondary/60 group-hover:text-primary transition-colors duration-200" />
          {link.label}
        </Link>
      ))}

      <div className="mt-auto pt-8 px-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/5">
          <p className="text-xs font-bold text-primary mb-1">Oikos v1.0</p>
          <p className="text-xs text-text-secondary/50">Construyendo comunidad</p>
        </div>
      </div>
    </aside>
  );
}
