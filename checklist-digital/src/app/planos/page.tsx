"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Urgencia = "atrasado" | "critico" | "urgente" | "atencao" | "normal";

type Item = {
  id: string;
  titulo: string;
  descricao: string | null;
  prioridade: string;
  status: string;
  createdAt: string;
  tempoEstimadoMin: number | null;
  deadlineIso: string | null;
  remainingMs: number | null;
  urgencia: Urgencia;
  responsavelId: string | null;
  responsavel: { id: string; nome: string } | null;
};

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconGrid({ c }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}
function IconChecklist({ c }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}
function IconClock({ c }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}
function IconReport({ c }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}
function IconSettings({ c }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}
function IconRefresh({ c }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}
function IconAlert({ c }: { c?: string }) {
  return <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>;
}

// ─── Configuração de urgência ─────────────────────────────────────────────────
const URGENCIA: Record<Urgencia, { label: string; color: string; bg: string; border: string; bar: string; dot: string }> = {
  atrasado: { label: "Atrasado",  color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/30",    bar: "bg-red-500",    dot: "bg-red-500" },
  critico:  { label: "Crítico",   color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30", bar: "bg-orange-500", dot: "bg-orange-500" },
  urgente:  { label: "Urgente",   color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30", bar: "bg-yellow-500", dot: "bg-yellow-500" },
  atencao:  { label: "Atenção",   color: "text-[#eab308]",  bg: "bg-[#eab308]/10",  border: "border-[#eab308]/30",  bar: "bg-[#eab308]",  dot: "bg-[#eab308]" },
  normal:   { label: "Normal",    color: "text-green-400",  bg: "bg-green-400/10",  border: "border-green-400/30",  bar: "bg-green-500",  dot: "bg-green-500" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtRemaining(ms: number | null): string {
  if (ms === null) return "Sem prazo";
  if (ms < 0) {
    const abs = Math.abs(ms);
    const h = Math.floor(abs / 3600000);
    const d = Math.floor(h / 24);
    return d > 0 ? `${d}d atrasado` : `${h}h atrasado`;
  }
  const h = Math.floor(ms / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d} dia${d > 1 ? "s" : ""} restante${d > 1 ? "s" : ""}`;
  if (h > 0) return `${h}h restante${h > 1 ? "s" : ""}`;
  const m = Math.floor(ms / 60000);
  return `${m}min restante${m > 1 ? "s" : ""}`;
}

function fmtDeadline(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function initials(nome: string) {
  return nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function progressPct(ms: number | null, tempoMin: number | null): number {
  if (ms === null || tempoMin === null) return 0;
  const total = tempoMin * 60 * 1000;
  const elapsed = total - ms;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

// ─── Página ───────────────────────────────────────────────────────────────────
export default function PlanosDeAcaoPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Urgencia | "todos">("todos");

  async function load() {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch("/api/action-plans", { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao carregar planos de ação");
      const j = (await res.json()) as { items: Item[] };
      setItems(j.items);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const filtrados = filtro === "todos" ? items : items.filter((i) => i.urgencia === filtro);

  const contadores = {
    total: items.length,
    atrasado: items.filter((i) => i.urgencia === "atrasado").length,
    critico: items.filter((i) => i.urgencia === "critico").length,
    urgente: items.filter((i) => i.urgencia === "urgente").length,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#ca8a04] flex items-center justify-center font-bold text-black text-sm">VM</div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Vitor Daniel Alves</p>
              <p className="text-xs text-white/40">Administrador</p>
            </div>
          </div>
          <Link href="/checklists/new" className="w-full bg-[#ca8a04] hover:bg-[#eab308] text-black font-bold py-2 px-4 rounded transition-colors flex items-center justify-center space-x-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            <span className="tracking-wide">INICIAR CHECKLIST</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all">
            <IconGrid c="w-5 h-5" /><span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/checklists/applied" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all">
            <IconChecklist c="w-5 h-5" /><span>Checklists Aplicados</span>
          </Link>
          <a className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-[#1e1e1e] text-[#eab308] border-l-4 border-[#eab308]">
            <IconClock c="w-5 h-5" /><span>Planos de Ação</span>
          </a>
          <Link href="/relatorios" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all">
            <IconReport c="w-5 h-5" /><span>Relatórios</span>
          </Link>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all">
            <IconSettings c="w-5 h-5" /><span>Configurações</span>
          </a>
        </nav>
        <div className="p-4 border-t border-white/10 bg-[#121212]">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Sistema v4.2.0</span>
            <span className="flex items-center"><span className="w-2 h-2 bg-[#eab308] rounded-full mr-1.5" />Online</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#121212]">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-black">
          <h1 className="text-xl font-bold tracking-tight">Planos de Ação</h1>
          <button onClick={() => void load()} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border bg-[#1e1e1e] hover:bg-[#2a2a2a] border-white/10 transition-colors">
            <IconRefresh c={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Atualizar</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Cards de resumo */}
          {!loading && !erro && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total pendentes", value: contadores.total, color: "text-white", sub: "checklists em aberto" },
                { label: "Atrasados", value: contadores.atrasado, color: "text-red-400", sub: "passou do prazo" },
                { label: "Críticos", value: contadores.critico, color: "text-orange-400", sub: "menos de 1h" },
                { label: "Urgentes", value: contadores.urgente, color: "text-yellow-400", sub: "menos de 24h" },
              ].map((s) => (
                <div key={s.label} className="bg-black rounded-xl border border-white/10 p-5 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{s.label}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-white/30">{s.sub}</p>
                </div>
              ))}
            </div>
          )}

          {/* Filtros por urgência */}
          <div className="flex gap-2 flex-wrap">
            {([
              { value: "todos", label: "Todos" },
              { value: "atrasado", label: "Atrasado" },
              { value: "critico", label: "Crítico" },
              { value: "urgente", label: "Urgente" },
              { value: "atencao", label: "Atenção" },
              { value: "normal", label: "Normal" },
            ] as { value: Urgencia | "todos"; label: string }[]).map((f) => {
              const cfg = f.value !== "todos" ? URGENCIA[f.value] : null;
              const active = filtro === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFiltro(f.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                    active
                      ? cfg ? `${cfg.bg} ${cfg.color} ${cfg.border}` : "bg-[#eab308] text-black border-[#eab308]"
                      : "bg-black/40 text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {f.label}
                  {f.value !== "todos" && items.filter((i) => i.urgencia === f.value).length > 0 && (
                    <span className="ml-2 opacity-70">
                      {items.filter((i) => i.urgencia === f.value).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-10 h-10 border-2 border-[#eab308]/30 border-t-[#eab308] rounded-full animate-spin" />
              <p className="text-white/40 text-sm">Carregando planos de ação...</p>
            </div>
          )}

          {/* Erro */}
          {erro && !loading && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <p className="text-red-400 font-medium">{erro}</p>
              <button onClick={() => void load()} className="mt-3 text-xs text-white/50 hover:text-white underline">Tentar novamente</button>
            </div>
          )}

          {/* Vazio */}
          {!loading && !erro && filtrados.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-20 h-20 relative">
                <div className="absolute inset-0 bg-green-400/20 rounded-full blur-xl" />
                <div className="relative bg-[#1e1e1e] border border-green-400/30 rounded-2xl w-full h-full flex items-center justify-center">
                  <IconChecklist c="w-10 h-10 text-green-400 opacity-70" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Tudo em dia!</h3>
              <p className="text-white/40 text-sm">Nenhum checklist pendente {filtro !== "todos" ? `com urgência "${URGENCIA[filtro as Urgencia]?.label}"` : ""}.</p>
            </div>
          )}

          {/* Lista */}
          {!loading && !erro && filtrados.length > 0 && (
            <div className="space-y-3">
              {filtrados.map((item) => {
                const cfg = URGENCIA[item.urgencia];
                const pct = progressPct(item.remainingMs, item.tempoEstimadoMin);

                return (
                  <div key={item.id} className={`bg-black rounded-xl border ${cfg.border} overflow-hidden shadow-xl`}>
                    {/* Barra de progresso de tempo */}
                    <div className="h-1 w-full bg-white/5">
                      <div
                        className={`h-full ${cfg.bar} transition-all`}
                        style={{ width: `${item.remainingMs !== null ? pct : 30}%` }}
                      />
                    </div>

                    <div className="p-5 flex items-start gap-5">
                      {/* Indicador de urgência lateral */}
                      <div className={`shrink-0 flex flex-col items-center gap-2 pt-0.5`}>
                        <div className={`w-3 h-3 rounded-full ${cfg.dot} shadow-lg`} style={{ boxShadow: `0 0 8px var(--tw-shadow-color)` }} />
                        <div className={`w-0.5 flex-1 min-h-[40px] ${cfg.bar} opacity-20 rounded`} />
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-bold text-base leading-snug">{item.titulo}</h3>
                          <span className={`shrink-0 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                            {cfg.label}
                          </span>
                        </div>

                        {item.descricao && (
                          <p className="text-sm text-white/40 line-clamp-1">{item.descricao}</p>
                        )}

                        <div className="flex items-center gap-6 flex-wrap">
                          {/* Tempo restante */}
                          <div className="flex items-center gap-2">
                            <IconClock c={`w-4 h-4 ${cfg.color}`} />
                            <span className={`text-sm font-bold ${cfg.color}`}>{fmtRemaining(item.remainingMs)}</span>
                          </div>

                          {/* Prazo */}
                          {item.deadlineIso && (
                            <div className="flex items-center gap-1.5 text-white/30 text-xs">
                              <span>Prazo:</span>
                              <span className="text-white/50">{fmtDeadline(item.deadlineIso)}</span>
                            </div>
                          )}

                          {/* Responsável */}
                          {item.responsavel ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#eab308]/20 border border-[#eab308]/30 flex items-center justify-center text-[9px] font-black text-[#eab308]">
                                {initials(item.responsavel.nome)}
                              </div>
                              <span className="text-xs text-white/50">{item.responsavel.nome}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-white/25 italic">Sem responsável</span>
                          )}

                          {/* Status */}
                          <span className="text-xs text-white/30 capitalize">{item.status.replace("_", " ")}</span>
                        </div>

                        {/* Barra de progresso visual (se tem tempo estimado) */}
                        {item.tempoEstimadoMin !== null && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-white/30">
                              <span>Tempo decorrido</span>
                              <span>{pct}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full ${cfg.bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Alerta se atrasado */}
                      {(item.urgencia === "atrasado" || item.urgencia === "critico") && (
                        <div className={`shrink-0 ${cfg.color} opacity-60`}>
                          <IconAlert c="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}