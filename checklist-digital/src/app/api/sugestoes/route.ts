import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const SETOR_LABELS: Record<string, string> = {
  financas: "Finanças",
  operacoes: "Operações",
  qualidade: "Qualidade",
  rh: "RH",
  ti: "TI",
  outros: "Outros",
};

// Sugestões fixas por setor (base de conhecimento)
const SUGESTOES_BASE: Record<string, string[]> = {
  operacoes: [
    "Vistoria da estrutura do palco e fixações",
    "Teste de sonorização e sound check",
    "Verificação do sistema de iluminação e DMX",
    "Inspeção elétrica e dimensionamento de carga",
    "Conferência de equipamentos e inventário",
    "Montagem e alinhamento do cenário",
    "Briefing da equipe técnica e roadies",
    "Checklist de rider técnico dos artistas",
    "Controle de acesso e credenciamento",
    "Logística de transporte e descarga",
    "Desmontagem e devolução de equipamentos",
    "Relatório de ocorrências pós-evento",
  ],
  qualidade: [
    "Auditoria de normas regulamentadoras (NR-18, NR-10)",
    "Verificação de EPIs e condições de segurança",
    "Controle de acesso e credenciamento por zona",
    "Checklist de rider técnico dos artistas",
    "Contratação e briefing de seguranças e brigadistas",
    "Inspeção de laudos de segurança estrutural",
    "Verificação de AVCB e documentação do venue",
    "Registro fotográfico de evidências",
    "Relatório de não conformidades",
    "Plano de evacuação e pontos de encontro",
  ],
  financas: [
    "Levantamento e cotação de fornecedores",
    "Aprovação de contratos de locação",
    "Revisão de apólice de seguro de equipamentos",
    "Fechamento financeiro pós-evento",
    "Conciliação de notas fiscais de fornecedores",
    "Controle de custos e orçamento do evento",
    "Emissão de relatório financeiro final",
    "Verificação de inadimplências e pendências",
  ],
  rh: [
    "Recrutamento de freelancers técnicos",
    "Envio e assinatura de contratos de prestação de serviço",
    "Treinamento de operação de equipamentos",
    "Briefing geral com toda a equipe",
    "Controle de ponto e jornada dos colaboradores",
    "Avaliação de desempenho pós-evento",
    "Renovação de certificações e treinamentos obrigatórios",
  ],
  ti: [
    "Inventário de equipamentos e garantias",
    "Verificação de backups e sistemas críticos",
    "Suporte a infraestrutura de rede do evento",
    "Atualização de softwares e licenças",
    "Monitoramento de servidores durante o evento",
  ],
  outros: [
    "Renovação de alvará de funcionamento",
    "Protocolo de documentação na Prefeitura",
    "Verificação de pendências administrativas",
    "Reunião de alinhamento com parceiros",
  ],
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const setor = url.searchParams.get("setor") ?? "";

  // Buscar tarefas mais recorrentes do setor no banco
  const { data: tarefas } = await supabaseAdmin
    .from("tarefas")
    .select("titulo, status")
    .eq("setor", setor)
    .order("created_at", { ascending: false })
    .limit(100);

  // Contar frequência de títulos similares (top palavras-chave)
  const frequencia: Record<string, number> = {};
  for (const t of tarefas ?? []) {
    const chave = (t.titulo as string).toLowerCase().trim();
    frequencia[chave] = (frequencia[chave] ?? 0) + 1;
  }

  // Top títulos do banco ordenados por frequência
  const topBanco = Object.entries(frequencia)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([titulo, count]) => ({ titulo, count, fonte: "banco" as const }));

  // Complementar com sugestões da base de conhecimento
  const baseSetor = SUGESTOES_BASE[setor] ?? SUGESTOES_BASE.outros;
  const bancotitulos = new Set(topBanco.map((t) => t.titulo));
  const complementares = baseSetor
    .filter((s) => !bancotitulos.has(s.toLowerCase()))
    .slice(0, 8)
    .map((titulo) => ({ titulo, count: 0, fonte: "base" as const }));

  const sugestoes = [...topBanco, ...complementares];

  // Buscar responsáveis disponíveis do setor
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, setor")
    .eq("setor", setor);

  const responsaveis = (profiles ?? []).map((p: Record<string, unknown>) => ({
    id: p.id as string,
    nome: (p.full_name as string) ?? "Usuário",
  }));

  return NextResponse.json({
    setor,
    setorLabel: SETOR_LABELS[setor] ?? setor,
    sugestoes,
    responsaveis,
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Body inválido" }, { status: 400 });

  const { titulo, descricao, setor, responsavel_id, prioridade, itens } = body as {
    titulo: string;
    descricao?: string;
    setor: string;
    responsavel_id?: string;
    prioridade?: string;
    itens: string[];
  };

  if (!titulo || !setor || !itens?.length) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  // Inserir tarefa principal
  const { data: tarefa, error } = await supabaseAdmin
    .from("tarefas")
    .insert({
      titulo,
      descricao: descricao ?? `Checklist gerado por sugestão inteligente – setor ${setor}`,
      setor,
      responsavel_id: responsavel_id ?? null,
      prioridade: prioridade ?? "media",
      status: "pendente",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, tarefa });
}
