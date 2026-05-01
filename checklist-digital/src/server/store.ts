import { randomUUID } from "crypto";
import type { ActionPlan, Checklist, ChecklistItem, Upload, User, UserDepartment, UserRole } from "@/lib/types";

type Store = {
  checklists: Checklist[];
  actionPlans: ActionPlan[];
  users: User[];
  uploads: Upload[];
};

declare global {
  // eslint-disable-next-line no-var
  var __checklistStore: Store | undefined;
}

function nowIso() {
  return new Date().toISOString();
}

function seed(): Store {
  const createdAt = nowIso();
  const updatedAt = createdAt;

  const makeItem = (title: string, required = true): ChecklistItem => ({
    id: randomUUID(),
    title,
    required,
    done: false,
  });

  const checklist: Checklist = {
    id: randomUUID(),
    title: "Checklist de Auditoria Operacional (Exemplo)",
    description:
      "Checklist exemplo gerado em memória para validação do fluxo cliente-servidor.",
    status: "in_progress",
    createdAt,
    updatedAt,
    sections: [
      {
        id: randomUUID(),
        title: "1) Preparação",
        items: [
          makeItem("Confirmar escopo e objetivo da auditoria"),
          makeItem("Validar responsáveis e contatos do turno"),
          makeItem("Checar EPI obrigatório e condições de segurança"),
          makeItem("Revisar histórico de não conformidades recentes", false),
        ],
      },
      {
        id: randomUUID(),
        title: "2) Execução",
        items: [
          makeItem("Inspecionar área (limpeza, sinalização e riscos)"),
          makeItem("Verificar registros obrigatórios do dia"),
          makeItem("Confirmar calibração/estado dos equipamentos críticos"),
          makeItem("Fotografar evidências quando aplicável", false),
        ],
      },
      {
        id: randomUUID(),
        title: "3) Encerramento",
        items: [
          makeItem("Registrar achados e evidências"),
          makeItem("Definir ações corretivas e prazos"),
          makeItem("Comunicar resultados ao responsável"),
        ],
      },
    ],
  };

  const actionPlans: ActionPlan[] = [
    {
      id: randomUUID(),
      title: "Aguardando solução",
      status: "awaiting_solution",
      createdAt,
      updatedAt,
    },
  ];

  const users: User[] = [];

  const uploads: Upload[] = [];

  return { checklists: [checklist], actionPlans, users, uploads };
}

export function getStore(): Store {
  if (!globalThis.__checklistStore) {
    globalThis.__checklistStore = seed();
  }
  // Migração simples em memória (hot reload) para novas chaves do Store
  if (!("users" in globalThis.__checklistStore) || !Array.isArray(globalThis.__checklistStore.users)) {
    globalThis.__checklistStore.users = [];
  }
  if (!("uploads" in globalThis.__checklistStore) || !Array.isArray(globalThis.__checklistStore.uploads)) {
    globalThis.__checklistStore.uploads = [];
  }
  // Migração simples: checklists antigos sem `description`
  for (const c of globalThis.__checklistStore.checklists) {
    if (!("description" in c)) {
      (c as Checklist).description = undefined;
    }
  }
  return globalThis.__checklistStore;
}

export function createUpload(input: Omit<Upload, "id" | "createdAt">) {
  const store = getStore();
  const upload: Upload = {
    id: randomUUID(),
    createdAt: nowIso(),
    ...input,
  };
  store.uploads.unshift(upload);
  return upload;
}

export function getUploadById(id: string) {
  return getStore().uploads.find((u) => u.id === id) ?? null;
}

export function getChecklistById(id: string) {
  return getStore().checklists.find((c) => c.id === id) ?? null;
}

export function toggleChecklistItem(checklistId: string, itemId: string) {
  const store = getStore();
  const checklist = store.checklists.find((c) => c.id === checklistId);
  if (!checklist) return null;

  for (const section of checklist.sections) {
    const item = section.items.find((i) => i.id === itemId);
    if (item) {
      item.done = !item.done;
      checklist.updatedAt = nowIso();
      return { checklist, item };
    }
  }

  return null;
}

export function createChecklistFromTemplate(title: string, description?: string) {
  const store = getStore();
  const createdAt = nowIso();

  const checklist: Checklist = {
    id: randomUUID(),
    title,
    description: description?.trim() ? description.trim() : "Checklist criado a partir do modelo padrão.",
    status: "in_progress",
    createdAt,
    updatedAt: createdAt,
    sections: [
      {
        id: randomUUID(),
        title: "1) Itens Gerais",
        items: [
          { id: randomUUID(), title: "Conferir abertura do posto", required: true, done: false },
          { id: randomUUID(), title: "Checar equipamentos essenciais", required: true, done: false },
          { id: randomUUID(), title: "Registrar observações", required: false, done: false },
        ],
      },
    ],
  };

  store.checklists.unshift(checklist);
  return checklist;
}

export function createUser(input: {
  name: string;
  corporateEmail: string;
  role: UserRole;
  department: UserDepartment;
  isAdmin: boolean;
}) {
  const store = getStore();
  const user: User = {
    id: randomUUID(),
    name: input.name,
    corporateEmail: input.corporateEmail,
    role: input.role,
    department: input.department,
    isAdmin: input.isAdmin,
    createdAt: nowIso(),
  };
  store.users.unshift(user);
  return user;
}

