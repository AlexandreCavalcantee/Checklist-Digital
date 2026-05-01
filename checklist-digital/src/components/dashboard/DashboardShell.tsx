"use client";

import { useEffect, useMemo, useState } from "react";
import { AddUserModal } from "@/components/users/AddUserModal";
import Link from "next/link";

type DashboardResponse = {
  checklistCounts: {
    in_progress: number;
    reopened: number;
    under_analysis: number;
    rejected: number;
  };
  actionPlanCounts: {
    delayed: number;
    awaiting_solution: number;
    solution_under_analysis: number;
    awaiting_conclusion: number;
  };
  lastUpdatedAt: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function IconGrid(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconChecklist(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconClock(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconReport(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconSettings(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconRefresh(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconUsers(props: { className?: string }) {
  return (
    <svg className={props.className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
  );
}

function IconUserPlus(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M9 11a4 4 0 100-8 4 4 0 000 8z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M20 8v6m3-3h-6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconWidget(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function formatIso(iso: string) {
  try {
    const dt = new Date(iso);
    return dt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function DashboardShell() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao carregar o dashboard");
      const json = (await res.json()) as DashboardResponse;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checklistCounts = useMemo(
    () =>
      data?.checklistCounts ?? {
        in_progress: 0,
        reopened: 0,
        under_analysis: 0,
        rejected: 0,
      },
    [data]
  );

  const actionPlanCounts = useMemo(
    () =>
      data?.actionPlanCounts ?? {
        delayed: 0,
        awaiting_solution: 0,
        solution_under_analysis: 0,
        awaiting_conclusion: 0,
      },
    [data]
  );

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white font-sans">
      <aside className="w-64 bg-black border-r border-white/10 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#ca8a04] flex items-center justify-center font-bold text-black text-sm">
              VM
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Vitor Daniel Alves</p>
              <p className="text-xs text-white/40">Administrador</p>
            </div>
          </div>

          <Link
            href="/checklists/new"
            className="w-full bg-[#ca8a04] hover:bg-[#eab308] text-black font-bold py-2 px-4 rounded transition-colors flex items-center justify-center space-x-2"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4v16m8-8H4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span className="tracking-wide">INICIAR CHECKLIST</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <a
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-[#1e1e1e] text-[#eab308] group border-l-4 border-[#eab308]"
            href="#"
          >
            <IconGrid className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all"
            href="#"
          >
            <IconChecklist className="w-5 h-5" />
            <span>Checklists Aplicados</span>
          </a>
          <a
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all"
            href="#"
          >
            <IconClock className="w-5 h-5" />
            <span>Planos de Ação</span>
          </a>
          <a
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all"
            href="#"
          >
            <IconReport className="w-5 h-5" />
            <span>Relatórios</span>
          </a>
          <a
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all"
            href="#"
          >
            <IconSettings className="w-5 h-5" />
            <span>Configurações</span>
          </a>
        </nav>

        <div className="p-4 border-t border-white/10 bg-[#121212]">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Sistema v4.2.0</span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-[#eab308] rounded-full mr-1.5" />
              Online
            </span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#121212]">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-black">
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center space-x-6">
            <button
              className="flex items-center space-x-2 bg-[#1e1e1e] hover:bg-[#2a2a2a] px-3 py-1.5 rounded-full text-sm border border-[#ca8a04]/30 transition-colors"
              title="Adicionar usuário"
              type="button"
              onClick={() => setAddUserOpen(true)}
            >
              <IconUserPlus className="w-4 h-4 text-[#eab308]" />
              <span>Adicionar</span>
            </button>

            <button
              onClick={() => void load()}
              className={cx(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors",
                "bg-[#1e1e1e] hover:bg-[#2a2a2a] border-white/10"
              )}
              title="Atualizar"
            >
              <IconRefresh className={cx("w-4 h-4", loading && "animate-spin")} />
              <span>Atualizar</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#ca8a04] to-[#facc15] p-8 flex items-center justify-between">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl font-black text-black mb-2 uppercase tracking-wide">
                Importar um checklist com IA!
              </h2>
              <p className="text-black/80 font-medium">
                Envie seu documento e a IA interpreta o conteúdo para criar um checklist
                estruturado para suas auditorias.
              </p>
              {data?.lastUpdatedAt ? (
                <p className="mt-3 text-xs text-black/70">
                  Última atualização: <span className="font-semibold">{formatIso(data.lastUpdatedAt)}</span>
                </p>
              ) : null}
              {error ? (
                <p className="mt-3 text-xs text-black/80">
                  Erro: <span className="font-semibold">{error}</span>
                </p>
              ) : null}
            </div>

            <button className="relative z-10 bg-black text-white hover:bg-[#111] px-8 py-3 rounded-lg font-bold shadow-xl transition-transform active:scale-95 uppercase text-sm tracking-widest border border-black/20">
              Criar checklist com IA
            </button>

            <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none">
              <svg className="h-full w-full" fill="black" preserveAspectRatio="none" viewBox="0 0 100 100">
                <polygon points="50,0 100,0 100,100 0,100" />
              </svg>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="bg-black rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#ca8a04]/10 rounded-lg">
                    <IconChecklist className="w-5 h-5 text-[#eab308]" />
                  </div>
                  <h3 className="font-bold text-lg">Checklists</h3>
                </div>
                <button className="text-white/40 hover:text-[#eab308] transition-colors" onClick={() => void load()}>
                  <IconRefresh className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Em andamento</span>
                  <span className="text-xl font-black text-[#eab308]">{checklistCounts.in_progress}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Reaberto</span>
                  <span className="text-xl font-black text-[#eab308]">{checklistCounts.reopened}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Em análise</span>
                  <span className="text-xl font-black text-[#eab308]">{checklistCounts.under_analysis}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-white/60">Rejeitado</span>
                  <span className="text-xl font-black text-[#eab308]">{checklistCounts.rejected}</span>
                </div>
              </div>
            </section>

            <section className="bg-black rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#ca8a04]/10 rounded-lg">
                    <IconClock className="w-5 h-5 text-[#eab308]" />
                  </div>
                  <h3 className="font-bold text-lg">Planos de Ação</h3>
                </div>
                <button className="text-white/40 hover:text-[#eab308] transition-colors" onClick={() => void load()}>
                  <IconRefresh className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Atrasado</span>
                  <span className="text-xl font-black text-[#eab308]">{actionPlanCounts.delayed}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Aguardando solução</span>
                  <span className="text-xl font-black text-[#eab308]">{actionPlanCounts.awaiting_solution}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-white/60">Solução em análise</span>
                  <span className="text-xl font-black text-[#eab308]">{actionPlanCounts.solution_under_analysis}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-white/60">Aguardando conclusão</span>
                  <span className="text-xl font-black text-[#eab308]">{actionPlanCounts.awaiting_conclusion}</span>
                </div>
              </div>
            </section>
          </div>

          <section className="bg-black rounded-xl border border-white/10 p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex justify-between items-center w-full mb-12">
              <h3 className="font-bold text-lg uppercase tracking-widest text-white/50">Widgets</h3>
              <button className="text-white/40 hover:text-[#eab308]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-[#ca8a04]/20 rounded-full blur-xl group-hover:bg-[#ca8a04]/30 transition-all" />
                <div className="relative bg-[#1e1e1e] border border-[#ca8a04]/30 rounded-2xl w-full h-full flex items-center justify-center">
                  <IconWidget className="w-12 h-12 text-[#eab308] opacity-50" />
                </div>
              </div>
              <h4 className="text-xl font-bold mb-2">Nenhum widget encontrado</h4>
              <p className="text-white/40 mb-8 max-w-sm mx-auto">
                Customize seu workspace adicionando componentes de visualização no dashboard.
              </p>
              <button className="bg-[#ca8a04] hover:bg-[#eab308] text-black font-black py-3 px-8 rounded shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all hover:scale-105 uppercase tracking-widest text-xs">
                Configurar dashboard
              </button>
            </div>
          </section>
        </div>
      </main>

      <AddUserModal
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onCreated={() => void load()}
      />
    </div>
  );
}

