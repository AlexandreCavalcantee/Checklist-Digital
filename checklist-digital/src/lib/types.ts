export type ChecklistStatus =
  | "in_progress"
  | "reopened"
  | "under_analysis"
  | "rejected"
  | "completed";

export type ActionPlanStatus =
  | "delayed"
  | "awaiting_solution"
  | "solution_under_analysis"
  | "awaiting_conclusion"
  | "completed";

export type ChecklistItem = {
  id: string;
  title: string;
  description?: string;
  required: boolean;
  done: boolean;
};

export type ChecklistSection = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

export type Checklist = {
  id: string;
  title: string;
  description?: string;
  status: ChecklistStatus;
  createdAt: string;
  updatedAt: string;
  sections: ChecklistSection[];
};

export type ActionPlan = {
  id: string;
  title: string;
  status: ActionPlanStatus;
  createdAt: string;
  updatedAt: string;
};

export type UserRole =
  | "auditor_junior"
  | "auditor_pleno"
  | "auditor_senior"
  | "supervisor"
  | "gerente";

export type UserDepartment =
  | "financas"
  | "operacoes"
  | "qualidade"
  | "rh"
  | "ti"
  | "outros";

export type User = {
  id: string;
  name: string;
  corporateEmail: string;
  role: UserRole;
  department: UserDepartment;
  isAdmin: boolean;
  createdAt: string;
};

export type Upload = {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  dataBase64: string;
};

