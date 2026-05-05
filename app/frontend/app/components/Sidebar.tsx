"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { LayoutDashboard, Calendar, ClipboardList, Radio, User } from "lucide-react";
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
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { x: -32, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
      gsap.fromTo("[data-side-link]", { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.04, ease: "power2.out", delay: 0.15 });
    }, ref);
    return () => ctx.revert();
  }, []);

  if (!isAuthenticated) return null;

  return (
    <aside ref={ref} className="hidden md:flex w-60 flex-col bg-[var(--surface-alt)]/60 border-r p-3 gap-0.5" role="navigation">
      <div className="px-3 py-4 mb-2">
        <span className="text-sm font-extrabold text-brand tracking-tight">Oikos</span>
      </div>
      {links.map((l) => (
        <Link key={l.href} data-side-link href={l.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-brand/5 active:scale-[0.98] transition-all duration-150">
          <l.icon className="w-4.5 h-4.5" /> {l.label}
        </Link>
      ))}
      <div className="mt-auto pt-6 px-3">
        <p className="text-xs text-[var(--text-muted)]/50">Oikos v1</p>
      </div>
    </aside>
  );
}
