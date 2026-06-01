"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setAuthenticated(true);
      }

      setLoading(false);
    }

    checkAuth();
  }, [router]);

  // Tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Carregando...
      </div>
    );
  }

  // Evita renderizar antes do redirect
  if (!authenticated) {
    return null;
  }

  // Dashboard
  return <DashboardShell />;
}
