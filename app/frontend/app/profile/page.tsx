"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/app/components/Sidebar"), { ssr: false });

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-primary">Perfil</h1>
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-6 max-w-md">
          <p className="text-sm"><strong>User ID:</strong> {user.user_id}</p>
          <p className="text-sm"><strong>Rol ID:</strong> {user.rol_id}</p>
          <p className="text-sm"><strong>Iglesia ID:</strong> {user.iglesia_id}</p>
        </div>
      </main>
    </>
  );
}
