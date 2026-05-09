"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Tarefa {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  responsavelId: string | null;
  responsavelNome: string | null;
  tempoEstimadoMin: number | null;
  createdAt: string;
}

interface CollaboratorStats {
  id: string;
  name: string;
  initials: string;
  prioridade: string;
  tasks: number;
  compliance: number;
  avgDelayMin: number;
  badge: "Excelente" | "Regular" | "Crítico";
  badgeVariant: "excellent" | "regular" | "critical";
}

interface ChartPoint {
  label: string;
  value: number;
}

interface StatusBreakdown {
  key: string;
  label: string;
  count: number;
  pct: number;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconGrid({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconChecklist({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconClock({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconReport({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconSettings({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconDownload({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconSearch({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconTrendingUp({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconTrendingDown({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconStar({ c }: { c?: string }) {
  return (
    <svg className={c} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}
function IconRefresh({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DONE_STATUS = "concluido";

function isDone(status: string | null | undefined): boolean {
  return (status ?? "").toLowerCase() === DONE_STATUS;
}

function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n.charAt(0))
    .filter(Boolean);
  return parts.join("").toUpperCase() || "?";
}

function badgeClasses(variant: "excellent" | "regular" | "critical") {
  if (variant === "excellent") return "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20";
  if (variant === "regular") return "bg-white/5 text-white/50 border border-white/10";
  return "bg-red-500/10 text-red-400 border border-red-500/20";
}

function complianceBarColor(pct: number) {
  if (pct >= 80) return "bg-[#eab308]";
  if (pct >= 55) return "bg-white/40";
  return "bg-red-500";
}

function determineBadge(compliance: number): { badge: "Excelente" | "Regular" | "Crítico"; badgeVariant: "excellent" | "regular" | "critical" } {
  if (compliance >= 80) return { badge: "Excelente", badgeVariant: "excellent" };
  if (compliance >= 50) return { badge: "Regular", badgeVariant: "regular" };
  return { badge: "Crítico", badgeVariant: "critical" };
}

function getOverallPerformance(rate: number): { label: string; sla: number } {
  if (rate >= 85) return { label: "Excelente", sla: Math.round(90 + (rate - 85) * 0.67) };
  if (rate >= 65) return { label: "Bom", sla: Math.round(70 + (rate - 65) * 1) };
  if (rate >= 45) return { label: "Regular", sla: Math.round(50 + (rate - 45) * 1) };
  return { label: "Crítico", sla: Math.round(rate * 1.1) };
}

const STATUS_LABELS: Record<string, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

function statusColor(status: string): string {
  if (status === "concluido") return "bg-[#eab308]";
  if (status === "em_andamento") return "bg-blue-400";
  if (status === "cancelado") return "bg-red-500";
  return "bg-white/40";
}

// CSV uses ";" so Excel pt-BR opens it without an import wizard.
function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function csvRow(cells: unknown[]): string {
  return cells.map(csvEscape).join(";");
}

function formatDateTimeBR(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function periodLabel(p: "semana" | "mes" | "trimestre"): string {
  return p === "semana" ? "Última semana" : p === "mes" ? "Último mês" : "Último trimestre";
}

// ─── Line Chart Component ─────────────────────────────────────────────────────
function LineChart({ points }: { points: ChartPoint[] }) {
  if (points.length === 0) {
    return <div className="h-64 flex items-center justify-center text-white/20 text-sm">Sem dados para exibir</div>;
  }

  const W = 1000;
  const H = 200;
  const maxV = Math.max(...points.map((p) => p.value), 1);
  const coords = points.map((p, i) => {
    const x = points.length === 1 ? W / 2 : (i / (points.length - 1)) * W;
    const y = H - (p.value / maxV) * (H - 20) - 10;
    return { x, y };
  });
  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const areaPath = linePath + ` L${coords[coords.length - 1].x},${H} L${coords[0].x},${H} Z`;

  return (
    <div className="h-64 w-full relative pt-4">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
        {[0, 50, 100, 150, 200].map((y) => (
          <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#27272a" strokeWidth="1" />
        ))}
        <path d={areaPath} fill="rgba(234,179,8,0.08)" />
        <path d={linePath} fill="none" stroke="#eab308" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="5" fill="#eab308" />
        ))}
      </svg>
      <div className="flex justify-between mt-3 text-[10px] text-white/40 uppercase tracking-widest font-mono px-1">
        {points.map((p) => (
          <span key={p.label} className="truncate max-w-[60px] text-center">{p.label}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Gauge Component ──────────────────────────────────────────────────────────
function Gauge({ pct, label }: { pct: number; label: string }) {
  const deg = Math.round((pct / 100) * 360);
  return (
    <div
      className="relative w-24 h-24 rounded-full flex items-center justify-center shrink-0"
      style={{ background: `conic-gradient(#eab308 0deg ${deg}deg, #27272a ${deg}deg 360deg)` }}
    >
      <div className="w-20 h-20 rounded-full bg-black flex flex-col items-center justify-center">
        <span className="text-xl font-black text-[#eab308]">{pct}%</span>
        <span className="text-[8px] text-white/30 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded ${className}`} />;
}

// ─── Period filter helper ─────────────────────────────────────────────────────
type Period = "semana" | "mes" | "trimestre";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RelatoriosPage() {
  const [period, setPeriod] = useState<Period>("semana");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  // Computed metrics
  const [completionRate, setCompletionRate] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [onTime, setOnTime] = useState(0);
  const [delayed, setDelayed] = useState(0);
  const [chartPoints, setChartPoints] = useState<ChartPoint[]>([]);
  const [collaborators, setCollaborators] = useState<CollaboratorStats[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/relatorios?period=${period}`, { cache: "no-store" });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error || `Falha na requisição (${res.status})`);
      }

      const data = (await res.json()) as { tarefas: Tarefa[] };
      const t = data.tarefas ?? [];
      setTarefas(t);

      // ── KPIs ─────────────────────────────────────────────────────────────
      const total = t.length;
      const concluidas = t.filter((x) => isDone(x.status));
      const rate = total > 0 ? Math.round((concluidas.length / total) * 100) : 0;
      setTotalTasks(total);
      setCompletionRate(rate);
      setOnTime(concluidas.length);
      setDelayed(total - concluidas.length);

      // ── Status breakdown ─────────────────────────────────────────────────
      const statusCounts: Record<string, number> = {};
      for (const task of t) {
        const key = (task.status ?? "pendente").toLowerCase();
        statusCounts[key] = (statusCounts[key] ?? 0) + 1;
      }
      const breakdown: StatusBreakdown[] = Object.entries(statusCounts)
        .map(([key, count]) => ({
          key,
          label: statusLabel(key),
          count,
          pct: total > 0 ? Math.round((count / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);
      setStatusBreakdown(breakdown);

      // ── Chart ────────────────────────────────────────────────────────────
      if (period === "semana") {
        const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        const grouped: Record<string, number> = {};
        days.forEach((d) => (grouped[d] = 0));
        t.forEach((task) => {
          const d = new Date(task.createdAt);
          const dayLabel = days[d.getDay()];
          if (dayLabel) grouped[dayLabel] = (grouped[dayLabel] ?? 0) + 1;
        });
        setChartPoints(days.map((d) => ({ label: d, value: grouped[d] ?? 0 })));
      } else if (period === "mes") {
        // Group by week within current month, last 4 weeks
        const grouped: Record<string, number> = { S1: 0, S2: 0, S3: 0, S4: 0, S5: 0 };
        t.forEach((task) => {
          const d = new Date(task.createdAt);
          const weekOfMonth = Math.min(5, Math.ceil(d.getDate() / 7));
          const key = `S${weekOfMonth}`;
          grouped[key] = (grouped[key] ?? 0) + 1;
        });
        setChartPoints(["S1", "S2", "S3", "S4", "S5"].map((k) => ({ label: k, value: grouped[k] ?? 0 })));
      } else {
        // Last 3 calendar months — group by year-month to avoid cross-year collisions
        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const now = new Date();
        const buckets = Array.from({ length: 3 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1);
          return { key: `${d.getFullYear()}-${d.getMonth()}`, label: months[d.getMonth()] ?? "—", value: 0 };
        });
        const bucketMap = new Map(buckets.map((b) => [b.key, b]));
        t.forEach((task) => {
          const d = new Date(task.createdAt);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          const b = bucketMap.get(key);
          if (b) b.value += 1;
        });
        setChartPoints(buckets.map((b) => ({ label: b.label, value: b.value })));
      }

      // ── Collaborator ranking ─────────────────────────────────────────────
      const statsMap = new Map<
        string,
        { name: string; tasks: number; completed: number; totalDelay: number; delayCount: number; prioridadeCounts: Record<string, number> }
      >();

      t.forEach((task) => {
        if (!task.responsavelId) return;
        const name = task.responsavelNome ?? `Usuário ${task.responsavelId.slice(0, 6)}`;
        if (!statsMap.has(task.responsavelId)) {
          statsMap.set(task.responsavelId, {
            name,
            tasks: 0,
            completed: 0,
            totalDelay: 0,
            delayCount: 0,
            prioridadeCounts: {},
          });
        }
        const s = statsMap.get(task.responsavelId)!;
        s.tasks += 1;
        s.prioridadeCounts[task.prioridade] = (s.prioridadeCounts[task.prioridade] ?? 0) + 1;

        if (isDone(task.status)) {
          s.completed += 1;
        }
      });

      const colabs: CollaboratorStats[] = Array.from(statsMap.entries())
        .map(([id, s]) => {
          const compliance = s.tasks > 0 ? Math.round((s.completed / s.tasks) * 100) : 0;
          const avgDelayMin = s.delayCount > 0 ? Math.round(s.totalDelay / s.delayCount) : 0;
          const { badge, badgeVariant } = determineBadge(compliance);
          // Most common priority assigned to this collaborator
          const topPrioridade =
            Object.entries(s.prioridadeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

          return {
            id,
            name: s.name,
            initials: getInitials(s.name),
            prioridade: topPrioridade,
            tasks: s.tasks,
            compliance,
            avgDelayMin,
            badge,
            badgeVariant,
          };
        })
        .sort((a, b) => b.compliance - a.compliance || b.tasks - a.tasks);

      setCollaborators(colabs);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError(err instanceof Error ? err.message : "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) void fetchData();
  }, [fetchData, mounted]);

  const performance = getOverallPerformance(completionRate);

  const exportCSV = useCallback(() => {
    const lines: string[] = [];
    const generatedAt = new Date();

    lines.push(csvRow(["Relatório de Performance"]));
    lines.push(csvRow(["Período", periodLabel(period)]));
    lines.push(csvRow(["Gerado em", generatedAt.toLocaleString("pt-BR")]));
    lines.push("");

    lines.push(csvRow(["KPIs"]));
    lines.push(csvRow(["Indicador", "Valor"]));
    lines.push(csvRow(["Total de tarefas", totalTasks]));
    lines.push(csvRow(["Taxa de conclusão (%)", completionRate]));
    lines.push(csvRow(["Concluídas", onTime]));
    lines.push(csvRow(["Pendentes", delayed]));
    lines.push(csvRow(["Performance geral", performance.label]));
    lines.push(csvRow(["SLA Score", performance.sla]));
    lines.push("");

    lines.push(csvRow(["Distribuição por Status"]));
    lines.push(csvRow(["Status", "Quantidade", "Percentual (%)"]));
    statusBreakdown.forEach((s) => {
      lines.push(csvRow([s.label, s.count, s.pct]));
    });
    lines.push("");

    lines.push(csvRow(["Ranking de Colaboradores"]));
    lines.push(csvRow(["Rank", "Colaborador", "Prioridade dominante", "Tarefas", "SLA Score (%)", "Atraso médio (min)", "Badge"]));
    collaborators.forEach((c, i) => {
      lines.push(csvRow([i + 1, c.name, c.prioridade, c.tasks, c.compliance, c.avgDelayMin, c.badge]));
    });
    lines.push("");

    lines.push(csvRow(["Tarefas do Período"]));
    lines.push(csvRow(["ID", "Título", "Status", "Prioridade", "Responsável", "Tempo estimado (min)", "Criado em"]));
    tarefas.forEach((t) => {
      lines.push(
        csvRow([
          t.id,
          t.titulo,
          statusLabel(t.status),
          t.prioridade,
          t.responsavelNome ?? "—",
          t.tempoEstimadoMin ?? "",
          formatDateTimeBR(t.createdAt),
        ])
      );
    });

    // BOM so Excel pt-BR detects UTF-8 and renders accents correctly.
    const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const stamp = generatedAt.toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${period}-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [period, totalTasks, completionRate, onTime, delayed, performance, statusBreakdown, collaborators, tarefas]);

  const filteredCollaborators = collaborators.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.prioridade.toLowerCase().includes(search.toLowerCase())
  );

  const ratio = delayed > 0 ? `${Math.round(onTime / Math.max(delayed, 1))}:1` : `${onTime}:0`;
  const onTimeDeg = totalTasks > 0 ? Math.round((onTime / totalTasks) * 360) : 0;

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white font-sans">
      {/* Sidebar */}
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
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
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
          <Link href="/planos" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all">
            <IconClock c="w-5 h-5" /><span>Planos de Ação</span>
          </Link>
          <a className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-[#1e1e1e] text-[#eab308] border-l-4 border-[#eab308]">
            <IconReport c="w-5 h-5" /><span>Relatórios</span>
          </a>
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
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 bg-black shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">Relatórios de Performance</h1>
            {lastUpdated && (
              <span className="text-[10px] text-white/30 font-mono hidden sm:block">
                Atualizado às {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <IconSearch c="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Buscar colaborador..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#1e1e1e] border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#eab308]/50 w-52 transition-colors"
              />
            </div>
            <button
              onClick={() => void fetchData()}
              disabled={loading}
              title="Atualizar dados"
              className="flex items-center justify-center w-8 h-8 bg-[#1e1e1e] border border-white/10 rounded-lg text-white/50 hover:text-white hover:border-white/30 transition-all disabled:opacity-40"
            >
              <IconRefresh c={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={exportCSV}
              disabled={loading || totalTasks === 0}
              title={totalTasks === 0 ? "Sem dados para exportar" : "Baixar relatório em CSV"}
              className="flex items-center space-x-2 bg-[#ca8a04] hover:bg-[#eab308] text-black font-bold px-4 py-1.5 rounded transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <IconDownload c="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Banner de Erro */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              {error}
            </div>
          )}

          {/* Filtros */}
          <section className="flex flex-wrap items-center justify-between gap-3 p-4 bg-black rounded-xl border border-white/10">
            <div className="flex items-center gap-2">
              {(["semana", "mes", "trimestre"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                    period === p
                      ? "bg-[#eab308] text-black border-[#eab308]"
                      : "bg-black/40 text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {p === "semana" ? "Semana" : p === "mes" ? "Mês" : "Trimestre"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs text-white/30 font-mono">
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <IconRefresh c="w-3 h-3 animate-spin" /> Carregando dados reais...
                </span>
              ) : (
                <span>{totalTasks} tarefas no período</span>
              )}
            </div>
          </section>

          {/* KPI Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Taxa de conclusão */}
            <div className="bg-black rounded-xl border border-white/10 p-6 flex items-center gap-5 shadow-xl">
              {loading ? (
                <>
                  <Skeleton className="w-24 h-24 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-7 w-36" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                </>
              ) : (
                <>
                  <Gauge pct={completionRate} label="taxa" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Taxa de Conclusão</p>
                    <p className="text-2xl font-black">{totalTasks.toLocaleString("pt-BR")} Tarefas</p>
                    {completionRate >= 50 ? (
                      <p className="flex items-center gap-1 mt-1 text-xs text-[#eab308]">
                        <IconTrendingUp c="w-3 h-3" />
                        {onTime} de {totalTasks} concluídas
                      </p>
                    ) : (
                      <p className="flex items-center gap-1 mt-1 text-xs text-red-400">
                        <IconTrendingDown c="w-3 h-3" />
                        {onTime} de {totalTasks} concluídas
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Concluídas vs pendentes */}
            <div className="bg-black rounded-xl border border-white/10 p-6 flex items-center gap-5 shadow-xl">
              {loading ? (
                <>
                  <Skeleton className="w-24 h-24 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="relative w-24 h-24 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `conic-gradient(#eab308 0deg ${onTimeDeg}deg, #ef4444 ${onTimeDeg}deg 360deg)` }}
                  >
                    <div className="w-20 h-20 rounded-full bg-black flex flex-col items-center justify-center">
                      <span className="text-[9px] text-white/40 uppercase">Ratio</span>
                      <span className="text-lg font-black">{ratio}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Status</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#eab308]" />
                        <span className="text-sm">Concluídas ({onTime.toLocaleString("pt-BR")})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-sm text-white/60">Pendentes ({delayed.toLocaleString("pt-BR")})</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Performance geral */}
            <div className="bg-black rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center text-center shadow-xl">
              {loading ? (
                <div className="space-y-3 w-full flex flex-col items-center">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-14 w-44 rounded-full" />
                </div>
              ) : (
                <>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Performance Geral</p>
                  <div
                    className={`border px-6 py-3 rounded-full flex items-center gap-3 ${
                      performance.label === "Excelente"
                        ? "bg-[#eab308]/10 border-[#eab308]/20"
                        : performance.label === "Bom"
                        ? "bg-green-500/10 border-green-500/20"
                        : performance.label === "Regular"
                        ? "bg-white/5 border-white/10"
                        : "bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    <IconStar
                      c={`w-8 h-8 ${
                        performance.label === "Excelente"
                          ? "text-[#eab308]"
                          : performance.label === "Bom"
                          ? "text-green-400"
                          : performance.label === "Regular"
                          ? "text-white/50"
                          : "text-red-400"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xl font-black uppercase tracking-tight ${
                          performance.label === "Excelente"
                            ? "text-[#eab308]"
                            : performance.label === "Bom"
                            ? "text-green-400"
                            : performance.label === "Regular"
                            ? "text-white/50"
                            : "text-red-400"
                        }`}
                      >
                        {performance.label}
                      </p>
                      <p className="text-[9px] text-white/40 uppercase">SLA Score: {performance.sla}</p>
                    </div>
                  </div>
                  {totalTasks === 0 && (
                    <p className="text-xs text-white/20 mt-3">Nenhuma tarefa encontrada no período</p>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Gráfico de Histórico */}
          <section className="bg-black rounded-xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-lg">Histórico de Tarefas</h3>
                <p className="text-sm text-white/40">
                  {period === "semana"
                    ? "Tarefas criadas por dia na última semana"
                    : period === "mes"
                    ? "Tarefas criadas por semana no último mês"
                    : "Tarefas criadas nos últimos 3 meses"}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#eab308]" />
                  <span className="text-xs text-white/60">Tarefas</span>
                </div>
              </div>
            </div>
            {loading ? (
              <div className="h-64 flex flex-col gap-3 pt-4">
                <Skeleton className="h-full w-full rounded" />
              </div>
            ) : (
              <LineChart points={chartPoints} />
            )}
          </section>

          {/* Distribuição por Status */}
          {!loading && totalTasks > 0 && (
            <section className="bg-black rounded-xl border border-white/10 p-6 shadow-xl">
              <h3 className="font-bold text-lg mb-1">Distribuição por Status</h3>
              <p className="text-sm text-white/40 mb-5">Tarefas agrupadas por status no período</p>
              <div className="space-y-3">
                {statusBreakdown.map((s) => (
                  <div key={s.key}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${statusColor(s.key)}`} />
                        <span className="text-white/70">{s.label}</span>
                      </div>
                      <span className="text-white/50 font-mono text-xs">
                        {s.count} <span className="text-white/30">· {s.pct}%</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${statusColor(s.key)}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ranking de Colaboradores */}
          <section className="bg-black rounded-xl border border-white/10 overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/50">
              <div>
                <h3 className="font-bold text-lg">Ranking de Colaboradores</h3>
                <p className="text-sm text-white/40">
                  {loading ? "Carregando..." : `${collaborators.length} colaboradores com tarefas no período`}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0a0a0a] border-b border-white/10">
                  <tr>
                    {["Rank", "Colaborador", "Tarefas", "SLA Score", "Atraso Médio", "Badge"].map((h) => (
                      <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredCollaborators.length > 0 ? (
                    filteredCollaborators.map((emp, idx) => (
                      <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                        <td className={`px-6 py-4 font-black text-sm ${idx === 0 ? "text-[#eab308]" : "text-white/60"}`}>
                          #{idx + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs ${idx === 0 ? "bg-[#eab308]/20 text-[#eab308]" : "bg-white/5 text-white/60"}`}>
                              {emp.initials}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{emp.name}</p>
                              <p className="text-xs text-white/40 truncate max-w-[160px]">Prioridade dominante: {emp.prioridade}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono">{emp.tasks}</td>
                        <td className="px-6 py-4">
                          <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                            <div
                              className={`h-full rounded-full ${complianceBarColor(emp.compliance)}`}
                              style={{ width: `${emp.compliance}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-white/40 font-mono">{emp.compliance}%</span>
                        </td>
                        <td className={`px-6 py-4 text-sm font-mono ${emp.avgDelayMin < 0 ? "text-[#eab308]" : emp.avgDelayMin === 0 ? "text-white/40" : emp.compliance < 50 ? "text-red-400" : "text-white/60"}`}>
                          {emp.avgDelayMin === 0
                            ? "—"
                            : emp.avgDelayMin < 0
                            ? `${Math.abs(emp.avgDelayMin)}min adiantado`
                            : `+${emp.avgDelayMin}min`}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${badgeClasses(emp.badgeVariant)}`}>
                            {emp.badge}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-white/30 text-sm">
                        {search
                          ? `Nenhum colaborador encontrado para "${search}"`
                          : tarefas.length === 0
                          ? "Nenhuma tarefa encontrada no período"
                          : "Nenhuma tarefa atribuída a colaboradores neste período"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <footer className="px-8 py-3 border-t border-white/10 bg-black shrink-0">
          <p className="text-xs text-white/20 text-center font-mono">
            Checklist Digital · Dados sincronizados com Supabase em tempo real
          </p>
        </footer>
      </main>
    </div>
  );
}
