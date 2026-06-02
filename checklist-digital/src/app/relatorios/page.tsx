"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import AIReportModal from "@/components/relatorios/AIReportModal";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Tarefa {
  id: string;
  titulo: string;
  status: string;
  prioridade: string;
  responsavelId: string | null;
  responsavelNome: string | null;
  setor: string | null;
  tempoEstimadoMin: number | null;
  concluidaEm: string | null;
  createdAt: string;
}

interface CollaboratorStats {
  id: string;
  name: string;
  initials: string;
  setor: string | null;
  prioridade: string;
  tasks: number;
  completed: number;
  compliance: number;
  avgDelayMin: number;
  badge: "Excelente" | "Regular" | "Crítico";
  badgeVariant: "excellent" | "regular" | "critical";
}

interface SetorStats {
  setor: string | null;
  label: string;
  tasks: number;
  completed: number;
  completionRate: number;
  employees: number;
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

interface Profile {
  id: string;
  nome: string;
  email: string | null;
  setor: string | null;
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
function IconBuilding({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-16 0H3m4-4h.01M7 13h.01M7 9h.01M11 17h.01M11 13h.01M11 9h.01M15 17h.01M15 13h.01M15 9h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
function IconClose({ c }: { c?: string }) {
  return (
    <svg className={c} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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

// ─── Setores ──────────────────────────────────────────────────────────────────
const SETOR_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "financas", label: "Finanças" },
  { value: "operacoes", label: "Operações" },
  { value: "qualidade", label: "Qualidade" },
  { value: "rh", label: "RH" },
  { value: "ti", label: "TI" },
  { value: "outros", label: "Outros" },
];

const SETOR_LABELS: Record<string, string> = Object.fromEntries(
  SETOR_OPTIONS.map((s) => [s.value, s.label])
);

const NO_SETOR = "__none__";

function setorLabel(setor: string | null): string {
  if (!setor) return "Não definido";
  return SETOR_LABELS[setor] ?? setor;
}

const PRIORIDADE_LABELS: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  critica: "Crítica",
};

function prioridadeLabel(p: string): string {
  return PRIORIDADE_LABELS[p] ?? p;
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

function periodLabel(p: Period): string {
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

// ─── Metric computation ───────────────────────────────────────────────────────
interface Metrics {
  totalTasks: number;
  completionRate: number;
  onTime: number;
  delayed: number;
  chartPoints: ChartPoint[];
  collaborators: CollaboratorStats[];
  statusBreakdown: StatusBreakdown[];
  setorBreakdown: SetorStats[];
}

function buildChartPoints(tasks: Tarefa[], period: Period): ChartPoint[] {
  if (period === "semana") {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const grouped: Record<string, number> = {};
    days.forEach((d) => (grouped[d] = 0));
    tasks.forEach((task) => {
      const d = new Date(task.createdAt);
      const dayLabel = days[d.getDay()];
      if (dayLabel) grouped[dayLabel] = (grouped[dayLabel] ?? 0) + 1;
    });
    return days.map((d) => ({ label: d, value: grouped[d] ?? 0 }));
  }
  if (period === "mes") {
    const grouped: Record<string, number> = { S1: 0, S2: 0, S3: 0, S4: 0, S5: 0 };
    tasks.forEach((task) => {
      const d = new Date(task.createdAt);
      const weekOfMonth = Math.min(5, Math.ceil(d.getDate() / 7));
      grouped[`S${weekOfMonth}`] = (grouped[`S${weekOfMonth}`] ?? 0) + 1;
    });
    return ["S1", "S2", "S3", "S4", "S5"].map((k) => ({ label: k, value: grouped[k] ?? 0 }));
  }
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const now = new Date();
  const buckets = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: months[d.getMonth()] ?? "—", value: 0 };
  });
  const bucketMap = new Map(buckets.map((b) => [b.key, b]));
  tasks.forEach((task) => {
    const d = new Date(task.createdAt);
    const b = bucketMap.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (b) b.value += 1;
  });
  return buckets.map((b) => ({ label: b.label, value: b.value }));
}

function computeMetrics(allTasks: Tarefa[], period: Period, setorFilter: string, userFilter: string): Metrics {
  // Filtro por usuário específico (afeta todas as seções, inclusive setores).
  const scoped = userFilter === "todos" ? allTasks : allTasks.filter((t) => t.responsavelId === userFilter);

  // Filtro por setor aplicado a KPIs, gráfico, status e ranking.
  const tasks =
    setorFilter === "todos"
      ? scoped
      : setorFilter === NO_SETOR
      ? scoped.filter((t) => !t.setor)
      : scoped.filter((t) => t.setor === setorFilter);

  const total = tasks.length;
  const concluidas = tasks.filter((x) => isDone(x.status));
  const completionRate = total > 0 ? Math.round((concluidas.length / total) * 100) : 0;

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  for (const task of tasks) {
    const key = (task.status ?? "pendente").toLowerCase();
    statusCounts[key] = (statusCounts[key] ?? 0) + 1;
  }
  const statusBreakdown: StatusBreakdown[] = Object.entries(statusCounts)
    .map(([key, count]) => ({
      key,
      label: statusLabel(key),
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Collaborator ranking
  const statsMap = new Map<
    string,
    { name: string; setor: string | null; tasks: number; completed: number; totalDelay: number; delayCount: number; prioridadeCounts: Record<string, number> }
  >();
  tasks.forEach((task) => {
    if (!task.responsavelId) return;
    const name = task.responsavelNome ?? `Usuário ${task.responsavelId.slice(0, 6)}`;
    if (!statsMap.has(task.responsavelId)) {
      statsMap.set(task.responsavelId, {
        name,
        setor: task.setor,
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
    if (isDone(task.status)) s.completed += 1;
  });

  const collaborators: CollaboratorStats[] = Array.from(statsMap.entries())
    .map(([id, s]) => {
      const compliance = s.tasks > 0 ? Math.round((s.completed / s.tasks) * 100) : 0;
      const avgDelayMin = s.delayCount > 0 ? Math.round(s.totalDelay / s.delayCount) : 0;
      const { badge, badgeVariant } = determineBadge(compliance);
      const topPrioridade = Object.entries(s.prioridadeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
      return {
        id,
        name: s.name,
        initials: getInitials(s.name),
        setor: s.setor,
        prioridade: topPrioridade,
        tasks: s.tasks,
        completed: s.completed,
        compliance,
        avgDelayMin,
        badge,
        badgeVariant,
      };
    })
    .sort((a, b) => b.compliance - a.compliance || b.tasks - a.tasks);

  // Setor breakdown — sobre o conjunto filtrado por usuário (mas ignora o filtro
  // de setor), para que o painel por setor mostre o panorama do escopo atual.
  const setorMap = new Map<string, { tasks: number; completed: number; employees: Set<string> }>();
  scoped.forEach((task) => {
    const key = task.setor ?? NO_SETOR;
    if (!setorMap.has(key)) setorMap.set(key, { tasks: 0, completed: 0, employees: new Set() });
    const s = setorMap.get(key)!;
    s.tasks += 1;
    if (isDone(task.status)) s.completed += 1;
    if (task.responsavelId) s.employees.add(task.responsavelId);
  });
  const setorBreakdown: SetorStats[] = Array.from(setorMap.entries())
    .map(([key, s]) => ({
      setor: key === NO_SETOR ? null : key,
      label: key === NO_SETOR ? "Não definido" : setorLabel(key),
      tasks: s.tasks,
      completed: s.completed,
      completionRate: s.tasks > 0 ? Math.round((s.completed / s.tasks) * 100) : 0,
      employees: s.employees.size,
    }))
    .sort((a, b) => b.tasks - a.tasks);

  return {
    totalTasks: total,
    completionRate,
    onTime: concluidas.length,
    delayed: total - concluidas.length,
    chartPoints: buildChartPoints(tasks, period),
    collaborators,
    statusBreakdown,
    setorBreakdown,
  };
}

// ─── Individual performance detail ────────────────────────────────────────────
interface CollaboratorDetail {
  id: string;
  name: string;
  setor: string | null;
  tasks: Tarefa[];
  total: number;
  completed: number;
  completionRate: number;
  statusCounts: Array<{ key: string; label: string; count: number }>;
  prioridadeCounts: Array<{ key: string; label: string; count: number }>;
}

function computeDetail(allTasks: Tarefa[], id: string): CollaboratorDetail | null {
  const tasks = allTasks.filter((t) => t.responsavelId === id);
  if (tasks.length === 0) return null;
  const name = tasks[0].responsavelNome ?? `Usuário ${id.slice(0, 6)}`;
  const setor = tasks.find((t) => t.setor)?.setor ?? null;
  const completed = tasks.filter((t) => isDone(t.status)).length;

  const statusMap: Record<string, number> = {};
  const prioMap: Record<string, number> = {};
  tasks.forEach((t) => {
    statusMap[t.status] = (statusMap[t.status] ?? 0) + 1;
    prioMap[t.prioridade] = (prioMap[t.prioridade] ?? 0) + 1;
  });

  return {
    id,
    name,
    setor,
    tasks: [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    total: tasks.length,
    completed,
    completionRate: Math.round((completed / tasks.length) * 100),
    statusCounts: Object.entries(statusMap)
      .map(([key, count]) => ({ key, label: statusLabel(key), count }))
      .sort((a, b) => b.count - a.count),
    prioridadeCounts: Object.entries(prioMap)
      .map(([key, count]) => ({ key, label: prioridadeLabel(key), count }))
      .sort((a, b) => b.count - a.count),
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RelatoriosPage() {
  const [period, setPeriod] = useState<Period>("semana");
  const [setorFilter, setSetorFilter] = useState<string>("todos");
  const [userFilter, setUserFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [relRes, profRes] = await Promise.all([
        fetch(`/api/relatorios?period=${period}`, { cache: "no-store" }),
        fetch(`/api/profiles`, { cache: "no-store" }),
      ]);

      if (!relRes.ok) {
        const j = (await relRes.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error || `Falha na requisição (${relRes.status})`);
      }

      const data = (await relRes.json()) as { tarefas: Tarefa[] };
      setTarefas(data.tarefas ?? []);

      if (profRes.ok) {
        const pdata = (await profRes.json()) as { items: Profile[] };
        setProfiles(pdata.items ?? []);
      }

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

  const metrics = useMemo(() => computeMetrics(tarefas, period, setorFilter, userFilter), [tarefas, period, setorFilter, userFilter]);
  const { totalTasks, completionRate, onTime, delayed, chartPoints, collaborators, statusBreakdown, setorBreakdown } = metrics;

  const performance = getOverallPerformance(completionRate);

  const detail = useMemo(
    () => (selectedId ? computeDetail(tarefas, selectedId) : null),
    [selectedId, tarefas]
  );

  const exportCSV = useCallback(() => {
    const lines: string[] = [];
    const generatedAt = new Date();

    const userName = userFilter === "todos" ? "Todos" : profiles.find((p) => p.id === userFilter)?.nome ?? userFilter;

    lines.push(csvRow(["Relatório de Performance"]));
    lines.push(csvRow(["Período", periodLabel(period)]));
    lines.push(csvRow(["Setor", setorFilter === "todos" ? "Todos" : setorFilter === NO_SETOR ? "Não definido" : setorLabel(setorFilter)]));
    lines.push(csvRow(["Usuário", userName]));
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

    lines.push(csvRow(["Performance por Setor"]));
    lines.push(csvRow(["Setor", "Tarefas", "Concluídas", "Taxa (%)", "Funcionários"]));
    setorBreakdown.forEach((s) => {
      lines.push(csvRow([s.label, s.tasks, s.completed, s.completionRate, s.employees]));
    });
    lines.push("");

    lines.push(csvRow(["Distribuição por Status"]));
    lines.push(csvRow(["Status", "Quantidade", "Percentual (%)"]));
    statusBreakdown.forEach((s) => {
      lines.push(csvRow([s.label, s.count, s.pct]));
    });
    lines.push("");

    lines.push(csvRow(["Ranking de Colaboradores"]));
    lines.push(csvRow(["Rank", "Colaborador", "Setor", "Prioridade dominante", "Tarefas", "Concluídas", "SLA Score (%)", "Badge"]));
    collaborators.forEach((c, i) => {
      lines.push(csvRow([i + 1, c.name, setorLabel(c.setor), prioridadeLabel(c.prioridade), c.tasks, c.completed, c.compliance, c.badge]));
    });
    lines.push("");

    lines.push(csvRow(["Tarefas do Período"]));
    lines.push(csvRow(["ID", "Título", "Status", "Prioridade", "Responsável", "Setor", "Tempo estimado (min)", "Criado em"]));
    const scoped = userFilter === "todos" ? tarefas : tarefas.filter((t) => t.responsavelId === userFilter);
    const exported =
      setorFilter === "todos"
        ? scoped
        : setorFilter === NO_SETOR
        ? scoped.filter((t) => !t.setor)
        : scoped.filter((t) => t.setor === setorFilter);
    exported.forEach((t) => {
      lines.push(
        csvRow([
          t.id,
          t.titulo,
          statusLabel(t.status),
          prioridadeLabel(t.prioridade),
          t.responsavelNome ?? "—",
          setorLabel(t.setor),
          t.tempoEstimadoMin ?? "",
          formatDateTimeBR(t.createdAt),
        ])
      );
    });

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
  }, [period, setorFilter, userFilter, profiles, totalTasks, completionRate, onTime, delayed, performance, statusBreakdown, setorBreakdown, collaborators, tarefas]);

  const filteredCollaborators = collaborators.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      setorLabel(c.setor).toLowerCase().includes(search.toLowerCase())
  );

  const ratio = delayed > 0 ? `${Math.round(onTime / Math.max(delayed, 1))}:1` : `${onTime}:0`;
  const onTimeDeg = totalTasks > 0 ? Math.round((onTime / totalTasks) * 360) : 0;

  const maxSetorTasks = Math.max(...setorBreakdown.map((s) => s.tasks), 1);

  async function updateSetor(profileId: string, value: string) {
    const setor = value === NO_SETOR ? null : value;
    try {
      const res = await fetch("/api/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profileId, setor }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error || "Falha ao atualizar setor");
      }
      // Atualização otimista local + recarrega métricas.
      setProfiles((prev) => prev.map((p) => (p.id === profileId ? { ...p, setor } : p)));
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o setor.");
    }
  }

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
          <button
            onClick={() => setManageOpen(true)}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white/50 hover:bg-[#1e1e1e] hover:text-white transition-all"
          >
            <IconSettings c="w-5 h-5" /><span>Configurações</span>
          </button>
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
              onClick={() => setAiOpen(true)}
              disabled={loading}
              title="Gerar análise inteligente com IA"
              className="group relative flex items-center space-x-2 rounded px-4 py-1.5 text-sm font-bold text-[#eab308] border border-[#eab308]/30 bg-[#eab308]/[0.06] hover:bg-[#eab308]/[0.12] hover:border-[#eab308]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span className="hidden sm:inline">Análise IA</span>
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
            <div className="flex flex-wrap items-center gap-4">
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
              <div className="flex items-center gap-2">
                <IconBuilding c="w-4 h-4 text-white/30" />
                <select
                  value={setorFilter}
                  onChange={(e) => setSetorFilter(e.target.value)}
                  className="bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/70 focus:outline-none focus:border-[#eab308]/50 transition-colors"
                >
                  <option value="todos" className="bg-[#0b0b0b] normal-case tracking-normal">Todos os setores</option>
                  {SETOR_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value} className="bg-[#0b0b0b] normal-case tracking-normal">
                      {s.label}
                    </option>
                  ))}
                  <option value={NO_SETOR} className="bg-[#0b0b0b] normal-case tracking-normal">Não definido</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white/70 focus:outline-none focus:border-[#eab308]/50 transition-colors max-w-[200px] truncate"
                >
                  <option value="todos" className="bg-[#0b0b0b] normal-case tracking-normal">Todos os usuários</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#0b0b0b] normal-case tracking-normal">
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>
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

          {/* Performance por Setor */}
          <section className="bg-black rounded-xl border border-white/10 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-lg">Performance por Setor</h3>
                <p className="text-sm text-white/40">Tarefas e taxa de conclusão agrupadas por setor no período</p>
              </div>
              <IconBuilding c="w-5 h-5 text-white/20" />
            </div>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : setorBreakdown.length === 0 ? (
              <p className="text-sm text-white/30 py-6 text-center">Nenhuma tarefa no período</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
                {setorBreakdown.map((s) => {
                  const active = setorFilter === (s.setor ?? NO_SETOR);
                  return (
                    <button
                      key={s.setor ?? NO_SETOR}
                      onClick={() => setSetorFilter(active ? "todos" : s.setor ?? NO_SETOR)}
                      className={`text-left rounded-lg p-3 border transition-all ${
                        active ? "border-[#eab308]/40 bg-[#eab308]/5" : "border-transparent hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-semibold flex items-center gap-2">
                          {s.label}
                          {!s.setor && <span className="text-[9px] text-white/30 uppercase">(s/ setor)</span>}
                        </span>
                        <span className="text-white/50 font-mono text-xs">
                          {s.tasks} tarefas · {s.employees} func.
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#eab308]/70 rounded-full transition-all"
                            style={{ width: `${Math.round((s.tasks / maxSetorTasks) * 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-mono w-28 text-right ${s.completionRate >= 50 ? "text-[#eab308]" : "text-white/50"}`}>
                          {s.completionRate}% concluído
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
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
                  {setorFilter !== "todos" && ` · ${setorFilter === NO_SETOR ? "Não definido" : setorLabel(setorFilter)}`}
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
                <h3 className="font-bold text-lg">Performance Individual</h3>
                <p className="text-sm text-white/40">
                  {loading ? "Carregando..." : `${collaborators.length} colaboradores com tarefas no período · clique para ver detalhes`}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0a0a0a] border-b border-white/10">
                  <tr>
                    {["Rank", "Colaborador", "Setor", "Tarefas", "SLA Score", "Atraso Médio", "Badge"].map((h) => (
                      <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-6 py-4">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredCollaborators.length > 0 ? (
                    filteredCollaborators.map((emp, idx) => (
                      <tr
                        key={emp.id}
                        onClick={() => setSelectedId(emp.id)}
                        className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
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
                              <p className="text-xs text-white/40 truncate max-w-[160px]">Prioridade dominante: {prioridadeLabel(emp.prioridade)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${emp.setor ? "bg-white/5 text-white/70 border border-white/10" : "bg-white/[0.02] text-white/30 border border-white/5"}`}>
                            {setorLabel(emp.setor)}
                          </span>
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
                      <td colSpan={7} className="px-6 py-12 text-center text-white/30 text-sm">
                        {search
                          ? `Nenhum colaborador encontrado para "${search}"`
                          : tarefas.length === 0
                          ? "Nenhuma tarefa encontrada no período"
                          : setorFilter !== "todos"
                          ? "Nenhum colaborador neste setor no período"
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

      {/* Modal: Performance Individual detalhada */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <button className="absolute inset-0 bg-black/70" onClick={() => setSelectedId(null)} aria-label="Fechar" type="button" />
          <div className="relative w-full max-w-2xl mx-6 max-h-[88vh] flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#141414] to-[#0b0b0b] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#eab308]/20 text-[#eab308] flex items-center justify-center font-black">
                  {getInitials(detail.name)}
                </div>
                <div>
                  <p className="text-lg font-bold">{detail.name}</p>
                  <p className="text-xs text-white/40 flex items-center gap-2">
                    <IconBuilding c="w-3.5 h-3.5" /> {setorLabel(detail.setor)}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-white/50 hover:text-white transition-colors" type="button" aria-label="Fechar">
                <IconClose c="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* KPIs do colaborador */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black">{detail.total}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Tarefas</p>
                </div>
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 text-center">
                  <p className="text-2xl font-black text-[#eab308]">{detail.completed}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Concluídas</p>
                </div>
                <div className="bg-black/50 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center">
                  <Gauge pct={detail.completionRate} label="taxa" />
                </div>
              </div>

              {/* Por status */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Por Status</p>
                <div className="space-y-2">
                  {detail.statusCounts.map((s) => (
                    <div key={s.key}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2 text-white/70">
                          <span className={`w-2 h-2 rounded-full ${statusColor(s.key)}`} />
                          {s.label}
                        </span>
                        <span className="text-white/50 font-mono text-xs">{s.count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${statusColor(s.key)}`}
                          style={{ width: `${Math.round((s.count / detail.total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Por prioridade */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Por Prioridade</p>
                <div className="flex flex-wrap gap-2">
                  {detail.prioridadeCounts.map((p) => (
                    <span key={p.key} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                      {p.label}: <span className="font-mono font-bold text-white">{p.count}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tarefas recentes */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Tarefas no Período</p>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {detail.tasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-3 bg-black/40 border border-white/5 rounded-lg px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm truncate">{t.titulo}</p>
                        <p className="text-[10px] text-white/30 font-mono">{formatDateTimeBR(t.createdAt)}</p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full uppercase ${isDone(t.status) ? "bg-[#eab308]/10 text-[#eab308]" : "bg-white/5 text-white/50"}`}>
                        {statusLabel(t.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Análise com IA */}
      <AIReportModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        metrics={{ totalTasks, completionRate, onTime, delayed, collaborators, setorBreakdown, statusBreakdown, chartPoints }}
        periodLabel={periodLabel(period)}
        scopeLabel={`${
          setorFilter === "todos" ? "Todos os setores" : setorFilter === NO_SETOR ? "Sem setor" : setorLabel(setorFilter)
        } · ${userFilter === "todos" ? "Todos os usuários" : profiles.find((p) => p.id === userFilter)?.nome ?? "Usuário"}`}
      />

      {/* Modal: Gerenciar setores */}
      {manageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <button className="absolute inset-0 bg-black/70" onClick={() => setManageOpen(false)} aria-label="Fechar" type="button" />
          <div className="relative w-full max-w-lg mx-6 max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-[#141414] to-[#0b0b0b] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.22em] text-[#eab308] font-black uppercase">Configurações · Setores</p>
                <p className="mt-1 text-sm text-white/50">Atribua cada funcionário ao seu setor</p>
              </div>
              <button onClick={() => setManageOpen(false)} className="text-white/50 hover:text-white transition-colors" type="button" aria-label="Fechar">
                <IconClose c="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-3">
              {profiles.length === 0 ? (
                <p className="text-sm text-white/30 text-center py-6">Nenhum funcionário encontrado</p>
              ) : (
                profiles.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-white/5 text-white/60 flex items-center justify-center font-black text-xs shrink-0">
                        {getInitials(p.nome)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{p.nome}</p>
                        {p.email && <p className="text-[10px] text-white/30 truncate">{p.email}</p>}
                      </div>
                    </div>
                    <select
                      value={p.setor ?? NO_SETOR}
                      onChange={(e) => void updateSetor(p.id, e.target.value)}
                      className="bg-[#1e1e1e] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-[#eab308]/50 shrink-0"
                    >
                      <option value={NO_SETOR} className="bg-[#0b0b0b]">Não definido</option>
                      {SETOR_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value} className="bg-[#0b0b0b]">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-white/10 bg-black/40">
              <p className="text-[10px] text-white/30 text-center font-mono">
                As alterações são salvas automaticamente e refletem nos relatórios.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
