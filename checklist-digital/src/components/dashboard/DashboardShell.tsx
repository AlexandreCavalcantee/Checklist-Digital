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

type WidgetTarefa = { setor: string; status: string; prioridade: string; responsavelNome: string | null };

const SETOR_LABEL: Record<string, string> = {
  operacoes: "Operações", qualidade: "Qualidade", financas: "Finanças",
  rh: "RH", ti: "TI", outros: "Outros",
};
const SETOR_CORES: Record<string, string> = {
  operacoes: "#eab308", qualidade: "#3b82f6", financas: "#22c55e",
  rh: "#a855f7", ti: "#f97316", outros: "#6b7280",
};

function WidgetsSection() {
  const [tarefas, setTarefas] = useState<WidgetTarefa[]>([]);

  useEffect(() => {
    fetch("/api/relatorios?period=trimestre")
      .then((r) => r.json())
      .then((j: { tarefas?: WidgetTarefa[] }) => setTarefas(j.tarefas ?? []))
      .catch(() => {});
  }, []);

  // Tarefas por setor
  const porSetor = Object.entries(
    tarefas.reduce<Record<string, number>>((acc, t) => {
      const s = t.setor ?? "outros";
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const totalSetor = porSetor.reduce((s, [, v]) => s + v, 0) || 1;

  // Tarefas por prioridade
  const porPrioridade = tarefas.reduce<Record<string, number>>(
    (acc, t) => { acc[t.prioridade ?? "media"] = (acc[t.prioridade ?? "media"] ?? 0) + 1; return acc; },
    { alta: 0, media: 0, baixa: 0 }
  );

  // Top responsáveis
  const porResp = Object.entries(
    tarefas.reduce<Record<string, number>>((acc, t) => {
      const n = t.responsavelNome ?? "Sem responsável";
      acc[n] = (acc[n] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const totalResp = porResp.reduce((s, [, v]) => s + v, 0) || 1;

  // Status
  const concluidas = tarefas.filter((t) => t.status === "concluido").length;
  const pendentes  = tarefas.filter((t) => t.status === "pendente").length;
  const emAndamento = tarefas.filter((t) => t.status === "em_andamento").length;
  const total = tarefas.length || 1;

  return (
    <section className="bg-black rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-sm uppercase tracking-widest text-white/50">Widgets</h3>
        <span className="text-xs text-white/20">Últimos 3 meses</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Widget 1: Tarefas por setor */}
        <div className="bg-[#111] rounded-xl border border-white/5 p-5">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Por Setor</p>
          <div className="space-y-3">
            {porSetor.length === 0 ? (
              <p className="text-xs text-white/20">Sem dados</p>
            ) : porSetor.map(([setor, count]) => (
              <div key={setor}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/70">{SETOR_LABEL[setor] ?? setor}</span>
                  <span className="text-white/40">{count}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(count / totalSetor) * 100}%`, backgroundColor: SETOR_CORES[setor] ?? "#6b7280" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Status geral */}
        <div className="bg-[#111] rounded-xl border border-white/5 p-5">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Status Geral</p>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e1e1e" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3"
                  strokeDasharray={`${(concluidas / total) * 100} 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{Math.round((concluidas / total) * 100)}%</span>
                <span className="text-[10px] text-white/30">concluído</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: "Concluídas", val: concluidas, cor: "bg-green-500" },
              { label: "Em andamento", val: emAndamento, cor: "bg-blue-500" },
              { label: "Pendentes", val: pendentes, cor: "bg-white/20" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.cor}`} />
                  <span className="text-white/60">{item.label}</span>
                </div>
                <span className="text-white/40">{item.val}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-1">
            {[
              { val: concluidas, cor: "bg-green-500" },
              { val: emAndamento, cor: "bg-blue-500" },
              { val: pendentes, cor: "bg-white/10" },
            ].map((item, i) => (
              <div key={i} className={`h-1.5 rounded-full ${item.cor}`}
                style={{ width: `${(item.val / total) * 100}%`, minWidth: item.val > 0 ? "4px" : 0 }} />
            ))}
          </div>
        </div>

        {/* Widget 3: Top responsáveis */}
        <div className="bg-[#111] rounded-xl border border-white/5 p-5">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Top Responsáveis</p>
          <div className="space-y-3">
            {porResp.length === 0 ? (
              <p className="text-xs text-white/20">Sem dados</p>
            ) : porResp.map(([nome, count], i) => {
              const iniciais = nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
              return (
                <div key={nome} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#ca8a04]/20 border border-[#eab308]/20 flex items-center justify-center text-[10px] font-bold text-[#eab308] shrink-0">
                    {iniciais}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70 truncate">{nome.split(" ")[0]}</span>
                      <span className="text-white/30">{count}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#eab308] rounded-full" style={{ width: `${(count / totalResp) * 100}%` }} />
                    </div>
                  </div>
                  {i === 0 && <span className="text-[10px] text-[#eab308]">★</span>}
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Alta", val: porPrioridade.alta ?? 0, cor: "text-red-400" },
              { label: "Média", val: porPrioridade.media ?? 0, cor: "text-yellow-400" },
              { label: "Baixa", val: porPrioridade.baixa ?? 0, cor: "text-green-400" },
            ].map((p) => (
              <div key={p.label}>
                <p className={`text-lg font-black ${p.cor}`}>{p.val}</p>
                <p className="text-[10px] text-white/30">{p.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
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

type Sugestao = { titulo: string; count: number; fonte: "banco" | "base" };
type Responsavel = { id: string; nome: string };
type SugestoesResponse = {
  setor: string;
  setorLabel: string;
  sugestoes: Sugestao[];
  responsaveis: Responsavel[];
};

const SETORES = [
  { value: "operacoes", label: "Operações" },
  { value: "qualidade", label: "Qualidade" },
  { value: "financas", label: "Finanças" },
  { value: "rh", label: "RH" },
  { value: "ti", label: "TI" },
  { value: "outros", label: "Outros" },
];

const PRIORIDADES = [
  { value: "alta", label: "Alta" },
  { value: "media", label: "Média" },
  { value: "baixa", label: "Baixa" },
];

function IconSparkles(props: { className?: string }) {
  return (
    <svg className={props.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function ChecklistIAModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [step, setStep] = useState<"setor" | "sugestoes" | "confirmar">("setor");
  const [setor, setSetor] = useState("");
  const [loadingSug, setLoadingSug] = useState(false);
  const [sug, setSug] = useState<SugestoesResponse | null>(null);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [titulo, setTitulo] = useState("");
  const [responsavelId, setResponsavelId] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [saving, setSaving] = useState(false);
  const [erroSave, setErroSave] = useState<string | null>(null);

  async function buscarSugestoes() {
    if (!setor) return;
    setLoadingSug(true);
    try {
      const res = await fetch(`/api/sugestoes?setor=${setor}`);
      const json = (await res.json()) as SugestoesResponse;
      setSug(json);
      setSelecionados(new Set());
      setTitulo(`Checklist de ${json.setorLabel} – ${new Date().toLocaleDateString("pt-BR")}`);
      setStep("sugestoes");
    } finally {
      setLoadingSug(false);
    }
  }

  function toggleItem(titulo: string) {
    setSelecionados((prev) => {
      const next = new Set(prev);
      next.has(titulo) ? next.delete(titulo) : next.add(titulo);
      return next;
    });
  }

  async function criar() {
    if (!titulo || selecionados.size === 0) return;
    setSaving(true);
    setErroSave(null);
    try {
      const res = await fetch("/api/sugestoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          setor,
          responsavel_id: responsavelId || undefined,
          prioridade,
          itens: [...selecionados],
        }),
      });
      if (!res.ok) {
        const j = await res.json() as { error?: string };
        throw new Error(j.error ?? "Erro ao criar");
      }
      onCreated();
      onClose();
    } catch (e) {
      setErroSave(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#161616] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ca8a04]/15 rounded-lg">
              <IconSparkles className="w-5 h-5 text-[#eab308]" />
            </div>
            <div>
              <h2 className="text-base font-bold">Sugestão Inteligente de Checklist</h2>
              <p className="text-xs text-white/40">Baseado nos dados reais do seu setor</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Step 1: Setor */}
          {step === "setor" && (
            <>
              <p className="text-sm text-white/60">Selecione o setor para gerar sugestões baseadas nas tarefas mais recorrentes:</p>
              <div className="grid grid-cols-2 gap-3">
                {SETORES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSetor(s.value)}
                    className={cx(
                      "py-3 px-4 rounded-xl border text-sm font-medium transition-all text-left",
                      setor === s.value
                        ? "border-[#eab308] bg-[#eab308]/10 text-[#eab308]"
                        : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Sugestões */}
          {step === "sugestoes" && sug && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">
                  <span className="text-[#eab308] font-semibold">{sug.sugestoes.filter((s) => s.fonte === "banco").length}</span> itens encontrados no histórico •{" "}
                  <span className="text-white/40">{sug.sugestoes.filter((s) => s.fonte === "base").length} sugestões adicionais</span>
                </p>
                <button onClick={() => setSelecionados(new Set())} className="text-xs text-white/30 hover:text-white/60">
                  Limpar
                </button>
              </div>

              <div className="space-y-2">
                {sug.sugestoes.map((s) => (
                  <label
                    key={s.titulo}
                    className={cx(
                      "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                      selecionados.has(s.titulo)
                        ? "border-[#eab308]/40 bg-[#eab308]/5"
                        : "border-white/5 hover:border-white/15"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-[#eab308]"
                      checked={selecionados.has(s.titulo)}
                      onChange={() => toggleItem(s.titulo)}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-white/90">{s.titulo}</span>
                      {s.fonte === "banco" && s.count > 0 && (
                        <span className="ml-2 text-[10px] bg-[#eab308]/20 text-[#eab308] px-1.5 py-0.5 rounded-full font-medium">
                          {s.count}× usado
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <p className="text-xs text-white/30 text-center">{selecionados.size} itens selecionados</p>
            </>
          )}

          {/* Step 3: Confirmar */}
          {step === "confirmar" && sug && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Título do checklist</label>
                <input
                  className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#eab308]/50"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1 block">Responsável</label>
                <select
                  className="w-full bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#eab308]/50"
                  value={responsavelId}
                  onChange={(e) => setResponsavelId(e.target.value)}
                >
                  <option value="">— Atribuir depois —</option>
                  {sug.responsaveis.map((r) => (
                    <option key={r.id} value={r.id}>{r.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1 block">Prioridade</label>
                <div className="flex gap-2">
                  {PRIORIDADES.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPrioridade(p.value)}
                      className={cx(
                        "flex-1 py-2 rounded-lg border text-sm font-medium transition-all",
                        prioridade === p.value
                          ? "border-[#eab308] bg-[#eab308]/10 text-[#eab308]"
                          : "border-white/10 text-white/50 hover:border-white/30"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#1e1e1e] rounded-xl p-3">
                <p className="text-xs text-white/40 mb-2">Itens incluídos ({selecionados.size})</p>
                <ul className="space-y-1">
                  {[...selecionados].map((item) => (
                    <li key={item} className="text-xs text-white/70 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {erroSave && (
                <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{erroSave}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between gap-3">
          {step !== "setor" && (
            <button
              onClick={() => setStep(step === "confirmar" ? "sugestoes" : "setor")}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              ← Voltar
            </button>
          )}
          <div className="flex-1" />

          {step === "setor" && (
            <button
              disabled={!setor || loadingSug}
              onClick={() => void buscarSugestoes()}
              className="bg-[#ca8a04] hover:bg-[#eab308] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              {loadingSug ? (
                <><IconSparkles className="w-4 h-4 animate-spin" /> Analisando...</>
              ) : (
                <><IconSparkles className="w-4 h-4" /> Gerar Sugestões</>
              )}
            </button>
          )}

          {step === "sugestoes" && (
            <button
              disabled={selecionados.size === 0}
              onClick={() => setStep("confirmar")}
              className="bg-[#ca8a04] hover:bg-[#eab308] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              Continuar ({selecionados.size} itens) →
            </button>
          )}

          {step === "confirmar" && (
            <button
              disabled={!titulo || selecionados.size === 0 || saving}
              onClick={() => void criar()}
              className="bg-[#ca8a04] hover:bg-[#eab308] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              {saving ? "Criando..." : "Criar Checklist"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DashboardShell() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [iaModalOpen, setIaModalOpen] = useState(false);

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
          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all"
            href="/checklists/applied"
          >
            <IconChecklist className="w-5 h-5" />
            <span>Checklists Aplicados</span>
          </Link>
          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all"
            href="/planos"
          >
            <IconClock className="w-5 h-5" />
            <span>Planos de Ação</span>
          </Link>
          <Link
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all"
            href="/relatorios"
          >
            <IconReport className="w-5 h-5" />
            <span>Relatórios</span>
          </Link>
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
              <h2 className="text-2xl font-black text-black mb-2 uppercase tracking-wide flex items-center gap-3">
                <IconSparkles className="w-6 h-6" />
                Sugestão Inteligente de Checklist
              </h2>
              <p className="text-black/80 font-medium">
                Selecione o setor e o sistema sugere automaticamente os itens mais recorrentes com base no histórico real de tarefas.
              </p>
              <p className="mt-2 text-xs text-black/60 font-medium">
                O gestor só precisa atribuir o responsável e confirmar.
              </p>
            </div>

            <button
              onClick={() => setIaModalOpen(true)}
              className="relative z-10 bg-black text-white hover:bg-[#111] px-8 py-3 rounded-lg font-bold shadow-xl transition-transform active:scale-95 uppercase text-sm tracking-widest border border-black/20 flex items-center gap-2 shrink-0"
            >
              <IconSparkles className="w-4 h-4" />
              Criar com Sugestão
            </button>

            <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none">
              <svg className="h-full w-full" fill="black" preserveAspectRatio="none" viewBox="0 0 100 100">
                <polygon points="50,0 100,0 100,100 0,100" />
              </svg>
            </div>
          </section>

          {iaModalOpen && (
            <ChecklistIAModal
              onClose={() => setIaModalOpen(false)}
              onCreated={() => void load()}
            />
          )}

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

          <WidgetsSection />
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

