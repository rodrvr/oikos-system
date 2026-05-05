"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEntrance } from "@/app/lib/animations";
import { User } from "lucide-react";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const ref = useEntrance();

  useEffect(() => { if (!isAuthenticated) router.push("/login"); }, [isAuthenticated, router]);
  if (!isAuthenticated || !user) return null;

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <div ref={ref} className="max-w-md mx-auto">
          <header className="mb-6"><h1 className="text-2xl font-extrabold text-[var(--text)]">Perfil</h1></header>
          <div className="rounded-2xl bg-[var(--surface-card)] border p-6 space-y-3">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center"><User className="w-6 h-6 text-brand" /></div>
              <div><p className="font-bold">Usuario</p><p className="text-xs text-[var(--text-muted)]">ID: {user.user_id.substring(0, 8)}...</p></div>
            </div>
            {[{ l: "User ID", v: user.user_id }, { l: "Rol ID", v: user.rol_id }, { l: "Iglesia ID", v: user.iglesia_id }].map(r => (
              <div key={r.l} className="flex justify-between text-sm"><span className="text-[var(--text-muted)]">{r.l}</span><span className="font-mono text-xs">{r.v.substring(0, 12)}...</span></div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
