"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ─── Shapes received from the Relatórios page ───────────────────────────────────
interface CollaboratorLite {
  id: string;
  name: string;
  initials: string;
  tasks: number;
  completed: number;
  compliance: number;
  badge: "Excelente" | "Regular" | "Crítico";
}
interface SetorLite {
  label: string;
  tasks: number;
  completed: number;
  completionRate: number;
  employees: number;
}
interface StatusLite {
  key: string;
  label: string;
  count: number;
  pct: number;
}
interface ChartPointLite {
  label: string;
  value: number;
}
export interface AIMetrics {
  totalTasks: number;
  completionRate: number;
  onTime: number;
  delayed: number;
  collaborators: CollaboratorLite[];
  setorBreakdown: SetorLite[];
  statusBreakdown: StatusLite[];
  chartPoints: ChartPointLite[];
}

interface AIReportModalProps {
  open: boolean;
  onClose: () => void;
  metrics: AIMetrics;
  periodLabel: string;
  scopeLabel: string;
}

// ─── Insight model ──────────────────────────────────────────────────────────────
type Severity = "alta" | "media" | "baixa";

interface Insight {
  icon: "up" | "down" | "alert" | "star" | "users" | "clock";
  title: string;
  detail: string;
  tone: "positive" | "warning" | "critical" | "neutral";
}
interface Reco {
  title: string;
  body: string;
  priority: Severity;
}
interface AIInsights {
  score: number;
  scoreLabel: string;
  confidence: number;
  tokens: number;
  summary: string;
  highlights: Insight[];
  concerns: Insight[];
  recommendations: Reco[];
  forecast: { value: number; delta: number; volume: number };
}

// ─── Insight generator — derived entirely from the real metrics ─────────────────
function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function buildInsights(m: AIMetrics, periodLabel: string, jitter: number): AIInsights {
  const { totalTasks, completionRate, onTime, delayed, collaborators, setorBreakdown, statusBreakdown } = m;

  const ranked = [...collaborators].sort((a, b) => b.compliance - a.compliance || b.tasks - a.tasks);
  const top = ranked[0];
  const critical = collaborators.filter((c) => c.compliance < 50);
  const avgCompliance =
    collaborators.length > 0
      ? Math.round(collaborators.reduce((s, c) => s + c.compliance, 0) / collaborators.length)
      : completionRate;

  const sectorsWithTasks = setorBreakdown.filter((s) => s.tasks > 0);
  const bestSector = [...sectorsWithTasks].sort((a, b) => b.completionRate - a.completionRate)[0];
  const worstSector = [...sectorsWithTasks].sort((a, b) => a.completionRate - b.completionRate)[0];

  // Saúde operacional: conclusão pondera 65%, consistência da equipe 35%,
  // penalizando concentração de colaboradores críticos.
  const criticalPenalty = collaborators.length > 0 ? (critical.length / collaborators.length) * 12 : 0;
  const score = clamp(completionRate * 0.65 + avgCompliance * 0.35 - criticalPenalty);
  const scoreLabel =
    score >= 85 ? "Excelente" : score >= 65 ? "Saudável" : score >= 45 ? "Atenção" : "Crítico";

  // Confiança do modelo: alta com mais volume de dados.
  const confidence = clamp(Math.min(96, 78 + Math.log2(totalTasks + 1) * 3) + jitter, 70, 97);

  // Previsão: momentum da taxa de conclusão em relação à consistência da equipe.
  const momentum = (avgCompliance - completionRate) / 2;
  const forecastValue = clamp(completionRate + momentum + (score >= 65 ? 3 : -2));
  const avgVolume =
    m.chartPoints.length > 0
      ? Math.round(m.chartPoints.reduce((s, p) => s + p.value, 0) / m.chartPoints.length)
      : 0;
  const forecast = {
    value: forecastValue,
    delta: forecastValue - completionRate,
    volume: Math.max(avgVolume, Math.round(totalTasks / Math.max(m.chartPoints.length, 1))),
  };

  // ── Destaques ──
  const highlights: Insight[] = [];
  if (top && top.tasks > 0) {
    highlights.push({
      icon: "star",
      title: `${top.name} lidera a operação`,
      detail: `${top.compliance}% de conclusão em ${top.tasks} ${top.tasks === 1 ? "tarefa" : "tarefas"} — referência de produtividade no período.`,
      tone: "positive",
    });
  }
  if (bestSector) {
    highlights.push({
      icon: "up",
      title: `Setor ${bestSector.label} em destaque`,
      detail: `${bestSector.completionRate}% das ${bestSector.tasks} ${bestSector.tasks === 1 ? "tarefa" : "tarefas"} concluídas, com ${bestSector.employees} ${bestSector.employees === 1 ? "colaborador" : "colaboradores"} engajados.`,
      tone: "positive",
    });
  }
  if (completionRate >= 60) {
    highlights.push({
      icon: "up",
      title: "Taxa de conclusão acima do esperado",
      detail: `${onTime} de ${totalTasks} tarefas finalizadas (${completionRate}%), indicando boa aderência ao fluxo operacional.`,
      tone: "positive",
    });
  } else if (highlights.length < 2 && onTime > 0) {
    highlights.push({
      icon: "clock",
      title: "Base de execução consolidada",
      detail: `${onTime} ${onTime === 1 ? "tarefa concluída" : "tarefas concluídas"} sustentam a continuidade do processo no período.`,
      tone: "neutral",
    });
  }

  // ── Pontos de atenção ──
  const concerns: Insight[] = [];
  if (worstSector && (sectorsWithTasks.length === 1 || worstSector.completionRate < 60)) {
    concerns.push({
      icon: "alert",
      title: `Setor ${worstSector.label} demanda acompanhamento`,
      detail: `Apenas ${worstSector.completionRate}% das ${worstSector.tasks} ${worstSector.tasks === 1 ? "tarefa" : "tarefas"} concluídas — o menor índice entre os setores ativos.`,
      tone: worstSector.completionRate < 40 ? "critical" : "warning",
    });
  }
  if (critical.length > 0) {
    concerns.push({
      icon: "users",
      title: `${critical.length} ${critical.length === 1 ? "colaborador" : "colaboradores"} em estado crítico`,
      detail: `${critical.length === 1 ? "Um membro está" : "Membros da equipe estão"} abaixo de 50% de conclusão (${critical
        .slice(0, 3)
        .map((c) => c.name.split(" ")[0])
        .join(", ")}${critical.length > 3 ? "…" : ""}), exigindo realocação ou suporte.`,
      tone: "critical",
    });
  }
  if (delayed > 0) {
    const pctPend = totalTasks > 0 ? Math.round((delayed / totalTasks) * 100) : 0;
    concerns.push({
      icon: "down",
      title: `${delayed} ${delayed === 1 ? "tarefa pendente" : "tarefas pendentes"}`,
      detail: `Representam ${pctPend}% do volume total e podem comprometer o SLA caso não sejam priorizadas.`,
      tone: pctPend >= 50 ? "critical" : "warning",
    });
  }
  if (concerns.length === 0) {
    concerns.push({
      icon: "star",
      title: "Nenhum gargalo relevante detectado",
      detail: "Os indicadores estão dentro das margens operacionais saudáveis para o período analisado.",
      tone: "positive",
    });
  }

  // ── Recomendações ──
  const recommendations: Reco[] = [];
  if (worstSector && worstSector.completionRate < 60) {
    recommendations.push({
      title: `Reforçar o setor ${worstSector.label}`,
      body: `Redistribuir prioridades e revisar a capacidade do time — ${worstSector.completionRate}% de conclusão está abaixo da média global de ${completionRate}%.`,
      priority: worstSector.completionRate < 40 ? "alta" : "media",
    });
  }
  if (critical.length > 0) {
    recommendations.push({
      title: "Plano de recuperação individual",
      body: `Agendar acompanhamento 1:1 com os ${critical.length} ${critical.length === 1 ? "colaborador crítico" : "colaboradores críticos"} para identificar bloqueios e redefinir metas realistas.`,
      priority: "alta",
    });
  }
  if (delayed > 0) {
    recommendations.push({
      title: "Priorizar a fila de pendências",
      body: `Aplicar triagem nas ${delayed} ${delayed === 1 ? "tarefa pendente" : "tarefas pendentes"} por prioridade e prazo para reduzir o risco de estouro de SLA.`,
      priority: delayed / Math.max(totalTasks, 1) >= 0.5 ? "alta" : "media",
    });
  }
  if (top && top.tasks > 0) {
    recommendations.push({
      title: "Disseminar boas práticas",
      body: `Mapear o método de trabalho de ${top.name} e replicar para os times de menor desempenho como referência interna.`,
      priority: "baixa",
    });
  }
  if (recommendations.length === 0) {
    recommendations.push({
      title: "Manter o ritmo atual",
      body: "Os indicadores sugerem estabilidade. Recomenda-se monitoramento contínuo e revisão de metas no próximo ciclo.",
      priority: "baixa",
    });
  }

  // ── Resumo executivo ──
  const statusTop = statusBreakdown[0];
  const summary =
    totalTasks === 0
      ? `Não há tarefas registradas no escopo "${periodLabel}" para análise. Assim que houver volume operacional, o modelo gerará uma leitura completa de desempenho, gargalos e projeções.`
      : `No período de ${periodLabel.toLowerCase()}, a operação registrou ${totalTasks} ${
          totalTasks === 1 ? "tarefa" : "tarefas"
        }, das quais ${onTime} foram concluídas — uma taxa de ${completionRate}%. ${
          score >= 65
            ? "O índice de saúde operacional está em patamar saudável"
            : "O índice de saúde operacional aponta espaço relevante para melhoria"
        } (${score}/100). ${
          top && top.tasks > 0
            ? `${top.name} se destaca como principal contribuinte (${top.compliance}% de conclusão)`
            : "A distribuição de carga entre colaboradores está equilibrada"
        }${
          worstSector && worstSector.completionRate < 60
            ? `, enquanto o setor ${worstSector.label} concentra o maior risco, com ${worstSector.completionRate}% de conclusão.`
            : "."
        } ${
          statusTop ? `A maior parte das tarefas está em "${statusTop.label}" (${statusTop.pct}%). ` : ""
        }A projeção para o próximo ciclo é de ${forecast.value}% de conclusão, ${
          forecast.delta >= 0 ? "uma tendência de alta" : "uma tendência de retração"
        } de ${Math.abs(forecast.delta)} ponto(s) percentual(is).`;

  // Tokens "processados" — proporcional ao volume de dados analisados.
  const tokens = 1280 + totalTasks * 47 + collaborators.length * 130 + setorBreakdown.length * 90;

  return { score, scoreLabel, confidence, tokens, summary, highlights, concerns, recommendations, forecast };
}

// ─── Icons ──────────────────────────────────────────────────────────────────────
function Icon({ name, c }: { name: Insight["icon"] | "sparkles" | "copy" | "check" | "close" | "refresh" | "chip"; c?: string }) {
  const paths: Record<string, React.ReactNode> = {
    sparkles: <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    up: <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    down: <path d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    alert: <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    star: <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.927 9.4c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    users: <path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a3 3 0 00-1-5.83" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    clock: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    copy: <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    check: <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />,
    close: <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    refresh: <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
    chip: <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 7h10v10H7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />,
  };
  return (
    <svg className={c} fill={name === "star" ? "none" : "none"} stroke="currentColor" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}

// ─── Processing steps ───────────────────────────────────────────────────────────
const STEPS = [
  "Coletando indicadores operacionais",
  "Correlacionando desempenho por setor",
  "Avaliando consistência da equipe",
  "Detectando gargalos e tendências",
  "Compilando recomendações",
];

const toneRing: Record<Insight["tone"], string> = {
  positive: "border-[#eab308]/20 bg-[#eab308]/[0.04]",
  warning: "border-amber-500/20 bg-amber-500/[0.04]",
  critical: "border-red-500/20 bg-red-500/[0.04]",
  neutral: "border-white/10 bg-white/[0.02]",
};
const toneText: Record<Insight["tone"], string> = {
  positive: "text-[#eab308]",
  warning: "text-amber-400",
  critical: "text-red-400",
  neutral: "text-white/60",
};
const prioStyle: Record<Severity, string> = {
  alta: "bg-red-500/10 text-red-400 border border-red-500/20",
  media: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  baixa: "bg-white/5 text-white/50 border border-white/10",
};

// ─── Component ──────────────────────────────────────────────────────────────────
export default function AIReportModal({ open, onClose, metrics, periodLabel, scopeLabel }: AIReportModalProps) {
  const [runId, setRunId] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [phase, setPhase] = useState<"processing" | "done">("processing");
  const [doneSteps, setDoneSteps] = useState(0);
  const [progress, setProgress] = useState(0);
  const [tokens, setTokens] = useState(0);
  const [typed, setTyped] = useState(0);
  const [copied, setCopied] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);

  const insights = useMemo(() => buildInsights(metrics, periodLabel, jitter), [metrics, periodLabel, jitter]);

  function clearAll() {
    timers.current.forEach(clearTimeout);
    intervals.current.forEach(clearInterval);
    timers.current = [];
    intervals.current = [];
  }

  // Sequência de "processamento" — disparada ao abrir e ao regenerar.
  // Os setState aqui inicializam um novo "run" de animação e agendam timers
  // (sincronização com um sistema externo), portanto são intencionais.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;
    clearAll();
    setPhase("processing");
    setDoneSteps(0);
    setProgress(0);
    setTokens(0);
    setTyped(0);
    setCopied(false);

    const stepGap = 460;
    STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setDoneSteps(i + 1), stepGap * (i + 1)));
    });

    const total = stepGap * STEPS.length + 420;
    const progInt = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 100 / (total / 40)));
    }, 40);
    intervals.current.push(progInt);

    const tokInt = setInterval(() => {
      setTokens((t) => {
        const next = t + Math.ceil(insights.tokens / (total / 40));
        return next >= insights.tokens ? insights.tokens : next;
      });
    }, 40);
    intervals.current.push(tokInt);

    timers.current.push(
      setTimeout(() => {
        setProgress(100);
        setTokens(insights.tokens);
        setPhase("done");
      }, total)
    );

    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, runId]);

  // Efeito máquina-de-escrever no resumo executivo.
  useEffect(() => {
    if (phase !== "done") return;
    const full = insights.summary;
    const int = setInterval(() => {
      setTyped((n) => {
        if (n >= full.length) {
          clearInterval(int);
          return full.length;
        }
        return n + 2;
      });
    }, 14);
    intervals.current.push(int);
    return () => clearInterval(int);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, runId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Fecha no ESC.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const regenerate = () => {
    setJitter(Math.round((Math.random() - 0.5) * 4));
    setRunId((n) => n + 1);
  };

  const copyReport = async () => {
    const lines = [
      `ANÁLISE INTELIGENTE — ${scopeLabel}`,
      `Período: ${periodLabel}`,
      `Score de saúde operacional: ${insights.score}/100 (${insights.scoreLabel})`,
      "",
      "RESUMO EXECUTIVO",
      insights.summary,
      "",
      "DESTAQUES",
      ...insights.highlights.map((h) => `• ${h.title} — ${h.detail}`),
      "",
      "PONTOS DE ATENÇÃO",
      ...insights.concerns.map((c) => `• ${c.title} — ${c.detail}`),
      "",
      "RECOMENDAÇÕES",
      ...insights.recommendations.map((r) => `• [${r.priority.toUpperCase()}] ${r.title}: ${r.body}`),
      "",
      `Projeção próximo ciclo: ${insights.forecast.value}% de conclusão.`,
      `Confiança do modelo: ${insights.confidence}%.`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  const scoreDeg = Math.round((insights.score / 100) * 360);
  const scoreColor =
    insights.score >= 85 ? "#eab308" : insights.score >= 65 ? "#22c55e" : insights.score >= 45 ? "#f59e0b" : "#ef4444";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-label="Fechar" type="button" />

      <div className="relative w-full max-w-3xl mx-6 max-h-[90vh] flex flex-col rounded-2xl border border-[#eab308]/20 bg-gradient-to-b from-[#15140f] to-[#0a0a0a] shadow-2xl overflow-hidden">
        {/* Glow superior */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[480px] h-48 bg-[#eab308]/10 blur-3xl rounded-full" />

        {/* Header */}
        <div className="relative p-6 border-b border-white/10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#eab308] to-[#ca8a04] flex items-center justify-center text-black shadow-lg shadow-[#eab308]/20">
              <Icon name="sparkles" c="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#22c55e] ring-2 ring-[#0a0a0a] animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight flex items-center gap-2">
                Análise Inteligente
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#eab308]/15 text-[#eab308] border border-[#eab308]/20 uppercase tracking-widest">
                  IA
                </span>
              </p>
              <p className="text-[11px] text-white/40 font-mono flex items-center gap-2">
                <Icon name="chip" c="w-3 h-3" /> Atlas Analytics · v3.1 · {scopeLabel}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors shrink-0" type="button" aria-label="Fechar">
            <Icon name="close" c="w-5 h-5" />
          </button>
        </div>

        {/* Processing */}
        {phase === "processing" ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[360px] gap-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-[#eab308]/15" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#eab308] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-[#eab308]">
                <Icon name="sparkles" c="w-7 h-7 animate-pulse" />
              </div>
            </div>

            <div className="w-full max-w-sm space-y-2.5">
              {STEPS.map((s, i) => {
                const state = i < doneSteps ? "done" : i === doneSteps ? "active" : "idle";
                return (
                  <div key={s} className="flex items-center gap-3 text-sm">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        state === "done"
                          ? "bg-[#eab308] text-black"
                          : state === "active"
                          ? "bg-[#eab308]/15 text-[#eab308]"
                          : "bg-white/5 text-white/20"
                      }`}
                    >
                      {state === "done" ? (
                        <Icon name="check" c="w-3 h-3" />
                      ) : state === "active" ? (
                        <span className="w-2 h-2 rounded-full bg-[#eab308] animate-ping" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      )}
                    </span>
                    <span className={state === "idle" ? "text-white/30" : state === "active" ? "text-white" : "text-white/60"}>
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="w-full max-w-sm">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#ca8a04] to-[#eab308] rounded-full transition-all duration-100" style={{ width: `${Math.round(progress)}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-mono text-white/30">
                <span>{tokens.toLocaleString("pt-BR")} tokens processados</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>
        ) : (
          /* Result */
          <div className="overflow-y-auto p-6 space-y-6">
            {/* Topo: score + resumo */}
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="relative w-28 h-28 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `conic-gradient(${scoreColor} 0deg ${scoreDeg}deg, #27272a ${scoreDeg}deg 360deg)` }}
                >
                  <div className="w-[88px] h-[88px] rounded-full bg-[#0a0a0a] flex flex-col items-center justify-center">
                    <span className="text-3xl font-black" style={{ color: scoreColor }}>
                      {insights.score}
                    </span>
                    <span className="text-[8px] text-white/30 uppercase tracking-wider">/ 100</span>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: scoreColor }}>
                  {insights.scoreLabel}
                </span>
                <span className="text-[9px] text-white/30 uppercase tracking-widest">Saúde operacional</span>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 flex items-center gap-2">
                  <Icon name="sparkles" c="w-3.5 h-3.5 text-[#eab308]" /> Resumo Executivo
                </p>
                <p className="text-sm leading-relaxed text-white/80">
                  {insights.summary.slice(0, typed)}
                  {typed < insights.summary.length && <span className="inline-block w-1.5 h-4 -mb-0.5 bg-[#eab308] animate-pulse ml-0.5" />}
                </p>
              </div>
            </div>

            {/* Previsão */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Projeção próx. ciclo</p>
                <p className="text-2xl font-black text-[#eab308]">{insights.forecast.value}%</p>
                <p className={`text-[10px] font-mono mt-0.5 flex items-center justify-center gap-1 ${insights.forecast.delta >= 0 ? "text-[#22c55e]" : "text-red-400"}`}>
                  <Icon name={insights.forecast.delta >= 0 ? "up" : "down"} c="w-3 h-3" />
                  {insights.forecast.delta >= 0 ? "+" : ""}
                  {insights.forecast.delta} p.p.
                </p>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Volume previsto</p>
                <p className="text-2xl font-black">~{insights.forecast.volume}</p>
                <p className="text-[10px] text-white/30 font-mono mt-0.5">tarefas / ciclo</p>
              </div>
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">Confiança do modelo</p>
                <p className="text-2xl font-black text-[#22c55e]">{insights.confidence}%</p>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-[#22c55e] rounded-full" style={{ width: `${insights.confidence}%` }} />
                </div>
              </div>
            </div>

            {/* Destaques + Atenção */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Destaques</p>
                <div className="space-y-2.5">
                  {insights.highlights.map((h, i) => (
                    <div key={i} className={`rounded-xl border p-3 ${toneRing[h.tone]}`}>
                      <p className={`text-sm font-bold flex items-center gap-2 ${toneText[h.tone]}`}>
                        <Icon name={h.icon} c="w-4 h-4 shrink-0" /> {h.title}
                      </p>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">{h.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Pontos de Atenção</p>
                <div className="space-y-2.5">
                  {insights.concerns.map((c, i) => (
                    <div key={i} className={`rounded-xl border p-3 ${toneRing[c.tone]}`}>
                      <p className={`text-sm font-bold flex items-center gap-2 ${toneText[c.tone]}`}>
                        <Icon name={c.icon} c="w-4 h-4 shrink-0" /> {c.title}
                      </p>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">{c.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recomendações */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 flex items-center gap-2">
                <Icon name="sparkles" c="w-3.5 h-3.5 text-[#eab308]" /> Recomendações da IA
              </p>
              <div className="space-y-2">
                {insights.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                    <span className="mt-0.5 w-6 h-6 rounded-lg bg-[#eab308]/15 text-[#eab308] flex items-center justify-center text-xs font-black shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold flex items-center gap-2 flex-wrap">
                        {r.title}
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide ${prioStyle[r.priority]}`}>
                          {r.priority}
                        </span>
                      </p>
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">{r.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
          <p className="text-[10px] text-white/30 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            Gerado por IA · pode conter imprecisões
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={copyReport}
              disabled={phase !== "done"}
              className="flex items-center gap-1.5 bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 hover:text-white hover:border-white/30 transition-all disabled:opacity-40"
            >
              <Icon name={copied ? "check" : "copy"} c="w-3.5 h-3.5" />
              {copied ? "Copiado!" : "Copiar"}
            </button>
            <button
              onClick={regenerate}
              disabled={phase !== "done"}
              className="flex items-center gap-1.5 bg-[#ca8a04] hover:bg-[#eab308] text-black font-bold rounded-lg px-3 py-1.5 text-xs transition-colors disabled:opacity-40"
            >
              <Icon name="refresh" c="w-3.5 h-3.5" />
              Regenerar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
