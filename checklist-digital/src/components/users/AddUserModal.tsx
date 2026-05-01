"use client";

import { useMemo, useState } from "react";
import type { UserDepartment, UserRole } from "@/lib/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const roles: Array<{ value: UserRole; label: string }> = [
  { value: "auditor_junior", label: "Auditor Júnior" },
  { value: "auditor_pleno", label: "Auditor Pleno" },
  { value: "auditor_senior", label: "Auditor Sênior" },
  { value: "supervisor", label: "Supervisor" },
  { value: "gerente", label: "Gerente" },
];

const departments: Array<{ value: UserDepartment; label: string }> = [
  { value: "financas", label: "Finanças" },
  { value: "operacoes", label: "Operações" },
  { value: "qualidade", label: "Qualidade" },
  { value: "rh", label: "RH" },
  { value: "ti", label: "TI" },
  { value: "outros", label: "Outros" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function IconUserPlusSolid(props: { className?: string }) {
  return (
    <svg className={props.className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M8 9a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M2 17a6 6 0 0112 0v1H2v-1z" />
      <path d="M16 8a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1V9a1 1 0 011-1z" />
    </svg>
  );
}

export function AddUserModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [corporateEmail, setCorporateEmail] = useState("");
  const [role, setRole] = useState<UserRole>("auditor_senior");
  const [department, setDepartment] = useState<UserDepartment>("financas");
  const [isAdmin, setIsAdmin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return name.trim().length > 2 && corporateEmail.trim().includes("@") && !submitting;
  }, [name, corporateEmail, submitting]);

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, corporateEmail, role, department, isAdmin }),
      });
      const json = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        throw new Error(json?.error || "Não foi possível adicionar o usuário");
      }

      setName("");
      setCorporateEmail("");
      setRole("auditor_senior");
      setDepartment("financas");
      setIsAdmin(false);
      onCreated?.();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Adicionar usuário"
    >
      <button
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-label="Fechar"
        type="button"
      />

      <div className="relative w-full max-w-xl mx-6 rounded-2xl border border-white/10 bg-gradient-to-b from-[#141414] to-[#0b0b0b] shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-[0.22em] text-[#eab308] font-black uppercase">
                Adicionar Usuário
              </p>
              <p className="mt-1 text-sm text-white/50">
                Processo de auditoria verificado
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors"
              type="button"
              aria-label="Fechar"
              title="Fechar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className="block text-[11px] tracking-[0.2em] text-[#eab308] font-black uppercase">
                Nome completo
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Alexandre Obsidian"
                className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 focus:border-[#eab308]/60 focus:ring-2 focus:ring-[#eab308]/20 outline-none px-4 py-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.2em] text-[#eab308] font-black uppercase">
                E-mail corporativo
              </label>
              <input
                value={corporateEmail}
                onChange={(e) => setCorporateEmail(e.target.value)}
                placeholder="alexandre@suaempresa.com"
                className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 focus:border-[#eab308]/60 focus:ring-2 focus:ring-[#eab308]/20 outline-none px-4 py-3 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] tracking-[0.2em] text-[#eab308] font-black uppercase">
                  Cargo/Função
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 focus:border-[#eab308]/60 focus:ring-2 focus:ring-[#eab308]/20 outline-none px-4 py-3 text-sm"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value} className="bg-[#0b0b0b]">
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.2em] text-[#eab308] font-black uppercase">
                  Setor/Departamento
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as UserDepartment)}
                  className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 focus:border-[#eab308]/60 focus:ring-2 focus:ring-[#eab308]/20 outline-none px-4 py-3 text-sm"
                >
                  {departments.map((d) => (
                    <option key={d.value} value={d.value} className="bg-[#0b0b0b]">
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-white/5 border border-white/10 px-4 py-4">
              <div>
                <p className="font-semibold">Acesso Administrativo</p>
                <p className="text-sm text-white/50">
                  Permite gerenciar outros usuários e logs do sistema.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdmin((v) => !v)}
                aria-pressed={isAdmin}
                className={cx(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  isAdmin ? "bg-[#eab308]" : "bg-white/15"
                )}
              >
                <span
                  className={cx(
                    "inline-block h-5 w-5 transform rounded-full bg-black transition-transform",
                    isAdmin ? "translate-x-5" : "translate-x-1"
                  )}
                />
              </button>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void submit()}
              disabled={!canSubmit}
              className={cx(
                "w-full mt-1 rounded-2xl py-4 font-black tracking-wide transition-all flex items-center justify-center gap-2",
                canSubmit
                  ? "bg-gradient-to-r from-[#facc15] to-[#ca8a04] text-black hover:brightness-110"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              )}
            >
              <IconUserPlusSolid className="w-5 h-5" />
              <span>{submitting ? "Adicionando..." : "Adicionar Usuário"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

