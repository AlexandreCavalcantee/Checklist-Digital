"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Profile = { id: string; nome: string; email: string | null };
type Tarefa = {
  id: string;
  titulo: string;
  descricao: string | null;
  prioridade: string;
  status: string;
  createdAt: string;
  responsavelId: string | null;
  responsavel: { id: string; nome: string } | null;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconGrid({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconChecklist({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconReport({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconSettings({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconRefresh({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PRIO: Record<string, { label: string; color: string; bg: string }> = {
  alta:  { label: "Alta",  color: "text-red-400",   bg: "bg-red-400/10 border-red-400/20" },
  media: { label: "Média", color: "text-[#eab308]", bg: "bg-[#eab308]/10 border-[#eab308]/20" },
  baixa: { label: "Baixa", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
};

const STATUS: Record<string, { label: string; color: string; dot: string }> = {
  pendente:     { label: "Pendente",     color: "text-white/50", dot: "bg-white/30" },
  em_andamento: { label: "Em andamento", color: "text-blue-400", dot: "bg-blue-400" },
  concluido:    { label: "Concluído",    color: "text-green-400",dot: "bg-green-400" },
  cancelado:    { label: "Cancelado",    color: "text-red-400",  dot: "bg-red-400" },
};

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return iso; }
}

function initials(nome: string) {
  return nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

// ─── Modal de atribuição ───────────────────────────────────────────────────────

function AssignModal({
  tarefa,
  profiles,
  onClose,
  onSaved,
}: {
  tarefa: Tarefa;
  profiles: Profile[];
  onClose: () => void;
  onSaved: (tarefaId: string, perfil: Profile | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtrados = profiles.filter((p) =>
    p.nome.toLowerCase().includes(query.toLowerCase()) ||
    (p.email ?? "").toLowerCase().includes(query.toLowerCase())
  );

  async function assign(perfil: Profile | null) {
    setSaving(true);
    setErro(null);
    try {
      const res = await fetch(`/api/checklists/${tarefa.id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responsavelId: perfil?.id ?? null }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error((j as { error?: string })?.error || "Erro ao atribuir");
      }
      onSaved(tarefa.id, perfil);
      onClose();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-gradient-to-b from-[#141414] to-[#0b0b0b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Atribuir responsável</p>
            <h2 className="text-base font-bold text-white leading-snug line-clamp-2">{tarefa.titulo}</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors ml-4 mt-0.5">
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar usuário..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#eab308]/50"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="max-h-64 overflow-y-auto p-2">
          {/* Remover atribuição */}
          {tarefa.responsavelId && (
            <button
              onClick={() => void assign(null)}
              disabled={saving}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors text-sm font-medium mb-1 disabled:opacity-50"
            >
              <IconX className="w-4 h-4" />
              Remover responsável atual
            </button>
          )}

          {filtrados.length === 0 && (
            <p className="text-center text-white/30 text-sm py-6">Nenhum usuário encontrado</p>
          )}

          {filtrados.map((p) => {
            const isAtual = p.id === tarefa.responsavelId;
            return (
              <button
                key={p.id}
                onClick={() => void assign(p)}
                disabled={saving || isAtual}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left disabled:cursor-default ${
                  isAtual
                    ? "bg-[#eab308]/10 border border-[#eab308]/20"
                    : "hover:bg-white/5"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  isAtual ? "bg-[#eab308] text-black" : "bg-[#ca8a04]/20 border border-[#ca8a04]/30 text-[#eab308]"
                }`}>
                  {initials(p.nome)}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isAtual ? "text-[#eab308]" : "text-white/80"}`}>{p.nome}</p>
                  {p.email && <p className="text-xs text-white/30 truncate">{p.email}</p>}
                </div>
                {isAtual && (
                  <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-[#eab308]">Atual</span>
                )}
              </button>
            );
          })}
        </div>

        {erro && (
          <div className="mx-4 mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {erro}
          </div>
        )}

        {saving && (
          <div className="flex items-center justify-center gap-2 py-3 text-white/40 text-sm border-t border-white/10">
            <div className="w-4 h-4 border-2 border-white/20 border-t-[#eab308] rounded-full animate-spin" />
            Salvando...
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function ChecklistsAplicadosPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [modalTarefa, setModalTarefa] = useState<Tarefa | null>(null);

  async function load() {
    setLoading(true);
    setErro(null);
    try {
      const [rTarefas, rProfiles] = await Promise.all([
        fetch("/api/checklists/assigned", { cache: "no-store" }),
        fetch("/api/profiles", { cache: "no-store" }),
      ]);
      if (!rTarefas.ok) throw new Error("Falha ao carregar checklists");
      const jTarefas = (await rTarefas.json()) as { items: Tarefa[] };
      const jProfiles = rProfiles.ok ? ((await rProfiles.json()) as { items: Profile[] }) : { items: [] };
      setTarefas(jTarefas.items);
      setProfiles(jProfiles.items);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  function handleSaved(tarefaId: string, perfil: Profile | null) {
    setTarefas((prev) =>
      prev.map((t) =>
        t.id === tarefaId
          ? { ...t, responsavelId: perfil?.id ?? null, responsavel: perfil ? { id: perfil.id, nome: perfil.nome } : null }
          : t
      )
    );
  }

  const filtradas = tarefas.filter((t) => {
    const matchSearch =
      t.titulo.toLowerCase().includes(search.toLowerCase()) ||
      (t.responsavel?.nome ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filtroStatus === "todos" || t.status === filtroStatus;
    return matchSearch && matchStatus;
  });

  const atribuidos = filtradas.filter((t) => t.responsavelId).length;
  const semResponsavel = filtradas.filter((t) => !t.responsavelId).length;

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
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <span className="tracking-wide">INICIAR CHECKLIST</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all">
            <IconGrid className="w-5 h-5" /><span className="font-medium">Dashboard</span>
          </Link>
          <a className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-[#1e1e1e] text-[#eab308] border-l-4 border-[#eab308]">
            <IconChecklist className="w-5 h-5" /><span>Checklists Aplicados</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all">
            <IconClock className="w-5 h-5" /><span>Planos de Ação</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all">
            <IconReport className="w-5 h-5" /><span>Relatórios</span>
          </a>
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all">
            <IconSettings className="w-5 h-5" /><span>Configurações</span>
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
          <h1 className="text-xl font-bold tracking-tight">Checklists Aplicados</h1>
          <button
            onClick={() => void load()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border bg-[#1e1e1e] hover:bg-[#2a2a2a] border-white/10 transition-colors"
          >
            <IconRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Atualizar</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Resumo */}
          {!loading && !erro && tarefas.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total", value: tarefas.length, color: "text-white" },
                { label: "Atribuídos", value: atribuidos, color: "text-[#eab308]" },
                { label: "Sem responsável", value: semResponsavel, color: "text-white/40" },
              ].map((s) => (
                <div key={s.label} className="bg-black rounded-xl border border-white/10 p-4 flex items-center justify-between">
                  <span className="text-white/50 text-sm">{s.label}</span>
                  <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Filtros */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[240px] relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Buscar por título ou responsável..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#eab308]/50"
              />
            </div>
            <div className="flex gap-2">
              {[
                { value: "todos", label: "Todos" },
                { value: "pendente", label: "Pendente" },
                { value: "em_andamento", label: "Em andamento" },
                { value: "concluido", label: "Concluído" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFiltroStatus(f.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                    filtroStatus === f.value
                      ? "bg-[#eab308] text-black border-[#eab308]"
                      : "bg-black/40 text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Estado: loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-10 h-10 border-2 border-[#eab308]/30 border-t-[#eab308] rounded-full animate-spin" />
              <p className="text-white/40 text-sm">Carregando checklists...</p>
            </div>
          )}

          {/* Estado: erro */}
          {erro && !loading && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <p className="text-red-400 font-medium">{erro}</p>
              <button onClick={() => void load()} className="mt-3 text-xs text-white/50 hover:text-white underline">Tentar novamente</button>
            </div>
          )}

          {/* Estado: vazio */}
          {!loading && !erro && filtradas.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-20 h-20 relative">
                <div className="absolute inset-0 bg-[#ca8a04]/20 rounded-full blur-xl" />
                <div className="relative bg-[#1e1e1e] border border-[#ca8a04]/30 rounded-2xl w-full h-full flex items-center justify-center">
                  <IconChecklist className="w-10 h-10 text-[#eab308] opacity-50" />
                </div>
              </div>
              <h3 className="text-lg font-bold">Nenhum checklist encontrado</h3>
              <p className="text-white/40 text-sm text-center max-w-sm">
                {search || filtroStatus !== "todos" ? "Nenhum resultado para os filtros aplicados." : "Nenhum checklist foi criado ainda."}
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && !erro && filtradas.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtradas.map((tarefa) => {
                const prio = PRIO[tarefa.prioridade] ?? PRIO.media;
                const stat = STATUS[tarefa.status] ?? STATUS.pendente;
                const temResponsavel = !!tarefa.responsavelId;

                return (
                  <div
                    key={tarefa.id}
                    className="bg-black rounded-xl border border-white/10 hover:border-[#eab308]/30 transition-all overflow-hidden group shadow-xl flex flex-col"
                  >
                    <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#eab308]/40 to-transparent" />

                    <div className="p-5 flex flex-col gap-4 flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-sm leading-snug group-hover:text-[#eab308] transition-colors line-clamp-2 flex-1">
                          {tarefa.titulo}
                        </h3>
                        <span className={`shrink-0 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${prio.bg} ${prio.color}`}>
                          {prio.label}
                        </span>
                      </div>

                      {/* Descrição */}
                      {tarefa.descricao && (
                        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">{tarefa.descricao}</p>
                      )}

                      {/* Responsável */}
                      <div className="flex-1">
                        {temResponsavel && tarefa.responsavel ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#eab308] flex items-center justify-center text-[10px] font-black text-black shrink-0">
                              {initials(tarefa.responsavel.nome)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] uppercase tracking-widest text-white/30 font-black">Responsável</p>
                              <p className="text-xs text-white/70 font-medium truncate">{tarefa.responsavel.nome}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center shrink-0">
                              <svg className="w-3.5 h-3.5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                              </svg>
                            </div>
                            <p className="text-xs text-white/30 italic">Sem responsável</p>
                          </div>
                        )}
                      </div>

                      {/* Rodapé */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                          <span className={`text-xs font-medium ${stat.color}`}>{stat.label}</span>
                        </div>

                        <button
                          onClick={() => setModalTarefa(tarefa)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                            temResponsavel
                              ? "border-white/10 text-white/40 hover:border-[#eab308]/40 hover:text-[#eab308]"
                              : "border-[#eab308]/30 text-[#eab308] bg-[#eab308]/10 hover:bg-[#eab308]/20"
                          }`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M20 8v6m3-3h-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </svg>
                          {temResponsavel ? "Trocar" : "Atribuir"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalTarefa && (
        <AssignModal
          tarefa={modalTarefa}
          profiles={profiles}
          onClose={() => setModalTarefa(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
