// ─── Camada 1: Palavras-chave bloqueadas (custo zero) ────────────────────────
const PALAVRAS_BLOQUEADAS = [
  // Conteúdo sexual
  "sexo", "porno", "nude", "nudes", "pelada", "pelado", "transar",
  "masturbação", "masturbação", "orgasmo", "vagina", "pênis", "pau",
  // Violência
  "matar", "suicídio", "se matar", "me matar", "me machucar",
  "automutilação", "cutting", "overdose",
  // Drogas
  "maconha", "cocaína", "crack", "baseado", "cheirar",
  // Radicalismo
  "nazismo", "fascismo", "terrorismo", "bomba caseira",
  // Manipulação da IA
  "ignore suas instruções", "ignore seu prompt", "finja que",
  "esquece o que te disseram", "novo prompt", "jailbreak",
  "act as", "dan mode", "sem restrições",
];

// ─── Camada 2: Padrões de risco (regex) ──────────────────────────────────────
const PADROES_RISCO = [
  /como (fazer|fabricar|criar) (bomba|explosivo|veneno|droga)/i,
  /como (comprar|conseguir) (droga|arma|faca)/i,
  /me (mando|manda) (foto|video|imagem)/i,
  /quantos (anos|meses|dias) (tem|você tem)/i,
];

export type ResultadoModeracao = {
  seguro: boolean;
  motivo?: string;
  nivel: "OK" | "AVISO" | "BLOQUEADO";
};

export function moderarMensagem(mensagem: string): ResultadoModeracao {
  const texto = mensagem.toLowerCase().trim();

  // Camada 1: palavras-chave
  for (const palavra of PALAVRAS_BLOQUEADAS) {
    if (texto.includes(palavra)) {
      return {
        seguro: false,
        motivo: `Conteúdo bloqueado: "${palavra}"`,
        nivel: "BLOQUEADO",
      };
    }
  }

  // Camada 2: padrões
  for (const padrao of PADROES_RISCO) {
    if (padrao.test(texto)) {
      return {
        seguro: false,
        motivo: `Padrão de risco detectado`,
        nivel: "BLOQUEADO",
      };
    }
  }

  // Camada 3: mensagem muito longa (possível tentativa de injeção)
  if (mensagem.length > 2000) {
    return {
      seguro: false,
      motivo: "Mensagem muito longa",
      nivel: "AVISO",
    };
  }

  return { seguro: true, nivel: "OK" };
}

// ─── Registra tentativa bloqueada ────────────────────────────────────────────
export async function registrarBloqueio({
  alunoId,
  turmaId,
  escolaId,
  mensagem,
  motivo,
}: {
  alunoId: string;
  turmaId?: string;
  escolaId?: string;
  mensagem: string;
  motivo: string;
}) {
  // Importa dinamicamente para não quebrar edge runtime
  const { prisma } = await import("@/lib/prisma");

  try {
    // Anonimiza a mensagem — guarda só os primeiros 50 chars
    const mensagemAnonima = mensagem.substring(0, 50) + (mensagem.length > 50 ? "..." : "");

    await (prisma as any).logSeguranca.create({
      data: {
        alunoId,
        turmaId: turmaId || null,
        escolaId: escolaId || null,
        tipo: "CONTEUDO_BLOQUEADO",
        descricao: motivo,
        mensagemAnonima,
      },
    });
  } catch (err) {
    console.error("Erro ao registrar bloqueio:", err);
  }
}
