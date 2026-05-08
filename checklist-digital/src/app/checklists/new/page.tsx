"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function IconArrowLeft(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M15 19l-7-7 7-7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconSearch(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconBell(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconHistory(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 8v4l3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M3 12a9 9 0 101.8-5.4L3 8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M3 3v5h5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconUserCircle(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 12a4 4 0 100-8 4 4 0 000 8z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M20 21a8 8 0 10-16 0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconCalendar(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconPerson(props: { className?: string }) {
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
    </svg>
  );
}

function IconFlag(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 5v16M5 5h11l-1 4 4 2-4 2 1 4H5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconPaperclip(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.19 9.19a2 2 0 01-2.83-2.83l8.49-8.49"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconAlarm(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 8v4l3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 22a8 8 0 100-16 8 8 0 000 16z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M5 3l4 4M19 3l-4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconLightbulb(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M9 18h6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M10 22h4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 2a7 7 0 00-4 12.7V16a2 2 0 002 2h4a2 2 0 002-2v-1.3A7 7 0 0012 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDatePtBR(d: Date) {
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function monthLabelPtBR(d: Date) {
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function buildMonthGrid(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const last = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  // semana começa no domingo para ficar igual ao exemplo
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  const end = new Date(last);
  end.setDate(last.getDate() + (6 - last.getDay()));

  const days: Date[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return { first, last, days };
}

function IconChevronLeft(props: { className?: string }) {
  return (
    <svg className={props.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function IconChevronRight(props: { className?: string }) {
  return (
    <svg className={props.className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function CalendarPopover(props: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  value: Date | null;
  onChange: (d: Date) => void;
  onClose: () => void;
}) {
  const { open, anchorRef, value, onChange, onClose } = props;
  const popRef = useRef<HTMLDivElement | null>(null);
  const [month, setMonth] = useState<Date>(() => value ?? new Date());

  useEffect(() => {
    if (open) setMonth(value ?? new Date());
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    function onMouseDown(e: MouseEvent) {
      const t = e.target as Node | null;
      if (!t) return;
      if (popRef.current?.contains(t)) return;
      if (anchorRef.current?.contains(t)) return;
      onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const grid = buildMonthGrid(month);
  const today = startOfDay(new Date());
  const selected = value ? startOfDay(value) : null;

  return (
    <div
      ref={popRef}
      className={cx(
        "absolute z-50 mt-2 w-[320px] rounded-xl border border-white/10",
        "bg-[#0b0b0b] shadow-2xl shadow-black/60"
      )}
      style={{ left: 0, top: "100%" }}
      role="dialog"
      aria-label="Selecionar data"
    >
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            aria-label="Mês anterior"
            title="Mês anterior"
          >
            <IconChevronLeft className="w-4 h-4 mx-auto" />
          </button>
          <button
            type="button"
            className="h-9 w-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            aria-label="Próximo mês"
            title="Próximo mês"
          >
            <IconChevronRight className="w-4 h-4 mx-auto" />
          </button>
        </div>
        <div className="text-sm font-bold text-white/80 capitalize">{monthLabelPtBR(month)}</div>
        <button
          type="button"
          className="text-xs font-black tracking-widest uppercase text-[#eab308] hover:brightness-110"
          onClick={() => onChange(new Date())}
          title="Hoje"
        >
          Hoje
        </button>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-7 gap-1 text-[10px] font-black tracking-widest uppercase text-white/35 mb-2">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
            <div key={i} className="text-center">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.days.map((d) => {
            const inMonth = d.getMonth() === month.getMonth();
            const isToday = sameDay(d, today);
            const isSelected = selected ? sameDay(d, selected) : false;
            return (
              <button
                key={d.toISOString()}
                type="button"
                onClick={() => onChange(d)}
                className={cx(
                  "h-9 rounded-lg text-sm font-semibold transition-colors",
                  "border",
                  inMonth ? "border-white/10" : "border-transparent",
                  inMonth ? "text-white/70" : "text-white/25",
                  "hover:bg-white/10 hover:text-white",
                  isToday && "ring-1 ring-[#eab308]/50",
                  isSelected && "bg-[#eab308] text-black border-[#eab308]"
                )}
                title={formatDatePtBR(d)}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-bold text-white/70 hover:text-white"
          >
            Fechar
          </button>
          <div className="text-xs text-white/40">
            {value ? (
              <>
                Selecionado: <span className="text-white/70 font-semibold">{formatDatePtBR(value)}</span>
              </>
            ) : (
              "Nenhuma data selecionada"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PopoverShell(props: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { open, anchorRef, onClose, children } = props;
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    function onMouseDown(e: MouseEvent) {
      const t = e.target as Node | null;
      if (!t) return;
      if (popRef.current?.contains(t)) return;
      if (anchorRef.current?.contains(t)) return;
      onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={popRef}
      className={cx(
        "absolute z-50 mt-2 w-[320px] rounded-xl border border-white/10",
        "bg-[#0b0b0b] shadow-2xl shadow-black/60"
      )}
      style={{ left: 0, top: "100%" }}
      role="dialog"
    >
      {children}
    </div>
  );
}

type UserOption = { id: string; nome: string; email: string };

function AssigneePopover(props: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  value: UserOption | null;
  onChange: (v: UserOption | null) => void;
  onClose: () => void;
}) {
  const { open, anchorRef, value, onChange, onClose } = props;
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<UserOption[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((j: { items: UserOption[] }) => setUsers(j.items || []))
      .catch(() => {});
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.trim().toLowerCase();
    return users.filter((u) => u.nome.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [query, users]);

  function initials(nome: string) {
    return nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  }

  return (
    <PopoverShell open={open} anchorRef={anchorRef} onClose={onClose}>
      <div className="p-3 border-b border-white/10">
        <div className="text-xs font-black tracking-widest uppercase text-white/40 mb-2">Responsável</div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar usuário..."
          className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-[#eab308]/60 focus:ring-2 focus:ring-[#eab308]/20 outline-none px-3 py-2 text-sm text-white/80"
        />
      </div>
      <div className="p-2 max-h-48 overflow-y-auto">
        {/* Sem responsável */}
        <button
          type="button"
          onClick={() => { onChange(null); onClose(); }}
          className={cx(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1",
            value === null ? "bg-[#eab308]/15 text-[#eab308]" : "text-white/50 hover:bg-white/5 hover:text-white"
          )}
        >
          <div className="w-7 h-7 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <span>Não delegado</span>
          {value === null && <span className="ml-auto text-[#eab308] font-black">✓</span>}
        </button>

        {filtered.length === 0 && users.length === 0 && (
          <p className="text-center text-white/30 text-xs py-4">Nenhum usuário cadastrado</p>
        )}
        {filtered.length === 0 && users.length > 0 && (
          <p className="text-center text-white/30 text-xs py-4">Nenhum resultado</p>
        )}

        {filtered.map((u) => {
          const selected = value?.id === u.id;
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => { onChange(u); onClose(); }}
              className={cx(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                selected ? "bg-[#eab308]/15 text-[#eab308]" : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <div className={cx(
                "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0",
                selected ? "bg-[#eab308] text-black" : "bg-[#ca8a04]/20 border border-[#ca8a04]/30 text-[#eab308]"
              )}>
                {initials(u.nome)}
              </div>
              <div className="text-left min-w-0">
                <p className="text-sm font-semibold truncate">{u.nome}</p>
                {u.email && <p className="text-xs text-white/40 truncate">{u.email}</p>}
              </div>
              {selected && <span className="ml-auto text-[#eab308] font-black shrink-0">✓</span>}
            </button>
          );
        })}
      </div>
    </PopoverShell>
  );
}

function PriorityPopover(props: {
  open: boolean;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  value: 1 | 2 | 3 | 4;
  onChange: (v: 1 | 2 | 3 | 4) => void;
  onClose: () => void;
}) {
  const { open, anchorRef, value, onChange, onClose } = props;
  const options: Array<{ v: 1 | 2 | 3 | 4; label: string; color: string }> = [
    { v: 1, label: "Prioridade 1", color: "bg-red-500" },
    { v: 2, label: "Prioridade 2", color: "bg-orange-500" },
    { v: 3, label: "Prioridade 3", color: "bg-blue-500" },
    { v: 4, label: "Prioridade 4", color: "bg-white/30" },
  ];

  return (
    <PopoverShell open={open} anchorRef={anchorRef} onClose={onClose}>
      <div className="p-2">
        {options.map((opt) => {
          const selected = opt.v === value;
          return (
            <button
              key={opt.v}
              type="button"
              onClick={() => {
                onChange(opt.v);
                onClose();
              }}
              className={cx(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm",
                selected ? "bg-[#eab308]/15 text-[#eab308]" : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <span className={cx("h-2.5 w-2.5 rounded-sm", opt.color)} />
                {opt.label}
              </span>
              {selected ? <span className="text-[#eab308] font-black">✓</span> : null}
            </button>
          );
        })}
      </div>
    </PopoverShell>
  );
}

export default function NewChecklistPage() {
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notify, setNotify] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<"start" | "end" | null>(null);
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [assignee, setAssignee] = useState<UserOption | null>(null);
  const assigneeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(4);
  const priorityBtnRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploads, setUploads] = useState<Array<{ id: string; name: string; size: number }>>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const startDateBtnRef = useRef<HTMLButtonElement | null>(null);
  const endDateBtnRef = useRef<HTMLButtonElement | null>(null);

  const draft = useMemo(() => {
    return title.trim().length > 0 || description.trim().length > 0;
  }, [title, description]);

  async function createChecklist() {
    setError(null);
    if (!startDate) { setError("Informe a data inicial do checklist."); return; }
    if (!endDate) { setError("Informe a data final do checklist."); return; }
    if (endDate <= startDate) { setError("A data final deve ser posterior à data inicial."); return; }
    setSaving(true);
    setSavedId(null);
    try {
      const res = await fetch("/api/checklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Novo Checklist",
          description: description.trim() || undefined,
          notifyTeam: notify,
          responsavelId: assignee?.id ?? null,
          startDate: startDate?.toISOString() ?? null,
          endDate: endDate?.toISOString() ?? null,
        }),
      });
      const json = (await res.json().catch(() => null)) as { checklist?: { id: string } } | { error?: string } | null;
      if (!res.ok) throw new Error(("error" in (json ?? {}) && (json as any).error) || "Falha ao criar checklist");
      const id = (json as any)?.checklist?.id as string | undefined;
      if (id) setSavedId(id);
      setTitle("");
      setDescription("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setSaving(false);
    }
  }

  async function onPickFile(files: FileList | null) {
    const f = files?.item(0);
    if (!f) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const json = (await res.json().catch(() => null)) as
        | { upload?: { id: string; name: string; size: number } }
        | { error?: string }
        | null;
      if (!res.ok) throw new Error((json as any)?.error || "Falha ao enviar anexo");
      const u = (json as any)?.upload as { id: string; name: string; size: number } | undefined;
      if (u) setUploads((prev) => [u, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white font-sans">
      <aside className="flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-[#121212]">
        <div className="p-6 mb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded bg-[#ca8a04] flex items-center justify-center text-black font-black">
              CD
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">Checklist</h1>
              <p className="text-xs text-white/40 font-medium">Digital</p>
            </div>
          </div>
          <Link
            href="/"
            className="w-full py-3 px-4 bg-[#ca8a04] hover:bg-[#eab308] text-black font-bold text-sm rounded flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <IconArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link className="flex items-center gap-3 px-4 py-3 text-white/50 hover:bg-white/5 hover:text-white transition-all duration-200 rounded-lg" href="/">
            <span className="text-sm font-medium tracking-tight">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 text-white/80 bg-white/5 rounded-lg" href="/checklists/new">
            <span className="text-sm font-bold tracking-tight">Criar Checklist</span>
          </Link>
        </nav>

        <div className="mt-auto px-3 pb-6 space-y-1">
          <span className="block px-4 py-3 text-white/40 text-sm">Configurações</span>
          <span className="block px-4 py-3 text-white/40 text-sm">Suporte</span>
        </div>
      </aside>

      <main className="flex-1 ml-64 flex flex-col bg-[#0a0a0a]">
        <header className="flex justify-between items-center w-full px-6 sticky top-0 z-40 h-16 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#eab308] text-white/80"
                placeholder="Pesquisar..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6 mr-6 border-r border-white/10 pr-6">
              <span className="text-white/40 text-sm font-semibold cursor-default">Visão geral</span>
              <span className="text-[#eab308] font-bold border-b-2 border-[#eab308] pb-1 cursor-default">
                Criar checklist
              </span>
              <span className="text-white/40 text-sm font-semibold cursor-default">Arquivo</span>
            </div>
            <div className="flex items-center gap-4 text-white/50">
              <button className="hover:text-[#eab308] active:opacity-70" type="button" title="Notificações">
                <IconBell className="w-5 h-5" />
              </button>
              <button className="hover:text-[#eab308] active:opacity-70" type="button" title="Histórico">
                <IconHistory className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pl-2 cursor-default group">
                <IconUserCircle className="w-8 h-8 text-white/70 group-hover:text-[#eab308]" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/40 mb-6 tracking-widest uppercase">
              <span>Checklists</span>
              <span className="text-white/30">{">"}</span>
              <span className="text-white/80">Criação de novo checklist</span>
            </div>

            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Criar novo checklist</h2>
                <p className="text-white/40 max-w-md">
                  Defina o título e a descrição para iniciar o checklist operacional.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-white/40 block mb-1">STATUS DO RASCUNHO</span>
                <span className="px-2 py-1 bg-white/10 text-[#eab308] text-[10px] font-black rounded uppercase tracking-wider">
                  {draft ? "Alterações não salvas" : "Sem alterações"}
                </span>
              </div>
            </div>

            <div className="bg-[#121212] border border-white/10 rounded-xl shadow-2xl">
              <div className="h-1 bg-gradient-to-r from-transparent via-[#eab308] to-transparent opacity-50" />
              <div className="p-8">
                <div className="mb-8">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">
                    Título do checklist
                  </label>
                  <input
                    className="w-full bg-black/40 border border-white/10 rounded px-5 py-4 text-xl font-bold text-white focus:outline-none focus:border-[#eab308] placeholder-white/20 transition-colors"
                    type="text"
                    placeholder="Ex: Auditoria Operacional - Turno A"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">
                    Descrição
                  </label>
                  <textarea
                    className="w-full bg-black/40 border border-white/10 rounded px-5 py-4 text-base text-white/80 focus:outline-none focus:border-[#eab308] placeholder-white/20 resize-none transition-colors"
                    rows={5}
                    placeholder="Explique o objetivo do checklist e o que deve ser verificado."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                  {/* Data Inicial */}
                  <div className="relative">
                    <button
                      ref={startDateBtnRef}
                      type="button"
                      onClick={() => setCalendarOpen((v) => v === "start" ? null : "start")}
                      className={cx(
                        "w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border rounded transition-colors group text-left hover:border-white/30",
                        calendarOpen === "start" ? "border-[#eab308]/60" : "border-white/10"
                      )}
                    >
                      <span className="text-white/40 group-hover:text-[#eab308]"><IconCalendar className="w-5 h-5" /></span>
                      <div className="text-left min-w-0">
                        <p className="text-[10px] font-bold text-white/40 leading-none mb-1">DATA INICIAL</p>
                        <p className="text-xs font-semibold text-white/80 truncate">{startDate ? formatDatePtBR(startDate) : "Definir início"}</p>
                      </div>
                    </button>
                    <CalendarPopover
                      open={calendarOpen === "start"}
                      anchorRef={startDateBtnRef}
                      value={startDate}
                      onChange={(d) => { setStartDate(startOfDay(d)); setCalendarOpen(null); }}
                      onClose={() => setCalendarOpen(null)}
                    />
                  </div>

                  {/* Data Final */}
                  <div className="relative">
                    <button
                      ref={endDateBtnRef}
                      type="button"
                      onClick={() => setCalendarOpen((v) => v === "end" ? null : "end")}
                      className={cx(
                        "w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border rounded transition-colors group text-left hover:border-white/30",
                        calendarOpen === "end" ? "border-[#eab308]/60" : "border-white/10"
                      )}
                    >
                      <span className="text-white/40 group-hover:text-[#eab308]"><IconCalendar className="w-5 h-5" /></span>
                      <div className="text-left min-w-0">
                        <p className="text-[10px] font-bold text-white/40 leading-none mb-1">DATA FINAL</p>
                        <p className="text-xs font-semibold text-white/80 truncate">{endDate ? formatDatePtBR(endDate) : "Definir prazo"}</p>
                      </div>
                    </button>
                    <CalendarPopover
                      open={calendarOpen === "end"}
                      anchorRef={endDateBtnRef}
                      value={endDate}
                      onChange={(d) => {
                        const selected = startOfDay(d);
                        if (startDate && selected <= startDate) {
                          setError("A data final deve ser posterior à data inicial.");
                          return;
                        }
                        setError(null);
                        setEndDate(selected);
                        setCalendarOpen(null);
                      }}
                      onClose={() => setCalendarOpen(null)}
                    />
                  </div>

                  {/* Responsável */}
                  <div className="relative">
                    <button
                      ref={assigneeBtnRef}
                      type="button"
                      onClick={() => setAssigneeOpen((v) => !v)}
                      className={cx(
                        "w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border rounded transition-colors group text-left hover:border-white/30",
                        assigneeOpen ? "border-[#eab308]/60" : "border-white/10"
                      )}
                    >
                      <span className="text-white/40 group-hover:text-[#eab308]"><IconPerson className="w-5 h-5" /></span>
                      <div className="text-left min-w-0">
                        <p className="text-[10px] font-bold text-white/40 leading-none mb-1">RESP.</p>
                        <p className="text-xs font-semibold text-white/80 truncate">{assignee ? assignee.nome : "Não delegado"}</p>
                      </div>
                    </button>
                    <AssigneePopover
                      open={assigneeOpen}
                      anchorRef={assigneeBtnRef}
                      value={assignee}
                      onChange={setAssignee}
                      onClose={() => setAssigneeOpen(false)}
                    />
                  </div>

                  {/* Prioridade */}
                  <div className="relative">
                    <button
                      ref={priorityBtnRef}
                      type="button"
                      onClick={() => setPriorityOpen((v) => !v)}
                      className={cx(
                        "w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border rounded transition-colors group text-left hover:border-white/30",
                        priorityOpen ? "border-[#eab308]/60" : "border-white/10"
                      )}
                    >
                      <span className="text-[#eab308]"><IconFlag className="w-5 h-5" /></span>
                      <div className="text-left min-w-0">
                        <p className="text-[10px] font-bold text-white/40 leading-none mb-1">PRIOR.</p>
                        <p className="text-xs font-semibold text-white/80 truncate">Prioridade {priority}</p>
                      </div>
                    </button>
                    <PriorityPopover
                      open={priorityOpen}
                      anchorRef={priorityBtnRef}
                      value={priority}
                      onChange={setPriority}
                      onClose={() => setPriorityOpen(false)}
                    />
                  </div>

                  {/* Anexo */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded transition-colors group text-left hover:border-white/30"
                    >
                      <span className="text-white/40 group-hover:text-[#eab308]"><IconPaperclip className="w-5 h-5" /></span>
                      <div className="text-left min-w-0">
                        <p className="text-[10px] font-bold text-white/40 leading-none mb-1">ANEXO</p>
                        <p className="text-xs font-semibold text-white/80 truncate">{uploading ? "Enviando..." : "Adicionar"}</p>
                      </div>
                    </button>
                  </div>

                  {/* Lembrete */}
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded transition-colors group text-left hover:border-white/30"
                    >
                      <span className="text-white/40 group-hover:text-[#eab308]"><IconAlarm className="w-5 h-5" /></span>
                      <div className="text-left min-w-0">
                        <p className="text-[10px] font-bold text-white/40 leading-none mb-1">LEMBRETE</p>
                        <p className="text-xs font-semibold text-white/80 truncate">Configurar</p>
                      </div>
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => void onPickFile(e.target.files)}
                />

                {uploads.length ? (
                  <div className="mb-10 -mt-4">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">
                      Anexos
                    </p>
                    <div className="space-y-2">
                      {uploads.map((u) => (
                        <a
                          key={u.id}
                          href={`/api/uploads/${u.id}`}
                          className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/30 hover:bg-black/50 px-4 py-3 transition-colors"
                        >
                          <span className="text-sm font-semibold text-white/80 truncate">{u.name}</span>
                          <span className="text-xs text-white/40 whitespace-nowrap">
                            {Math.max(1, Math.round(u.size / 1024))} KB
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center justify-between border-t border-white/10 pt-8">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={notify}
                        onChange={(e) => setNotify(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-black/40 text-[#eab308] focus:ring-[#eab308]/30"
                      />
                      <span className="text-sm font-medium text-white/50 group-hover:text-white/80">
                        Notificar equipe (opcional)
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link
                      href="/"
                      className="px-6 py-2.5 text-sm font-bold text-white/40 hover:text-white transition-colors"
                    >
                      Cancelar
                    </Link>
                    <button
                      className="px-8 py-3 bg-[#eab308] text-black font-black text-sm rounded shadow-lg shadow-[#eab308]/10 hover:shadow-[#eab308]/20 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      type="button"
                      onClick={() => void createChecklist()}
                      disabled={saving}
                    >
                      {saving ? "Criando..." : "Criar checklist"}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                ) : null}

                {savedId ? (
                  <div className="mt-6 rounded-xl border border-[#eab308]/30 bg-[#eab308]/10 px-4 py-3 text-sm text-[#eab308]">
                    Checklist criado com sucesso (ID: <span className="font-mono">{savedId}</span>).
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-[#121212] border border-white/10 rounded-xl p-6 relative overflow-hidden">
                <h3 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">
                  Prévia do workspace
                </h3>
                <div className="space-y-3 opacity-40 select-none">
                  <div className="flex items-center gap-3 p-3 bg-black/40 border border-white/10 rounded">
                    <div className="w-4 h-4 border border-white/20 rounded" />
                    <div className="h-2 w-48 bg-white/10 rounded" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-black/60 border border-[#eab308]/30 rounded">
                    <div className="w-4 h-4 border border-[#eab308] bg-[#eab308] rounded" />
                    <div className="h-2 w-64 bg-[#eab308]/20 rounded" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none" />
              </div>

              <div className="bg-gradient-to-br from-[#1a1505] to-[#121212] border border-white/10 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <IconLightbulb className="w-6 h-6 text-[#eab308] mb-4" />
                  <h4 className="text-white font-bold mb-2">Dica</h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Use padrões de nome como “Turno A / Turno B” para facilitar relatórios e comparações.
                  </p>
                </div>
                <span className="text-[10px] font-black text-[#eab308] uppercase tracking-widest mt-4 inline-flex items-center gap-2">
                  SAIBA MAIS <span className="text-xs">{">"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

