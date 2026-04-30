import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "PROFESSOR") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { alunoId } = await req.json();

  const aluno = await prisma.aluno.findUnique({
    where: { id: alunoId },
    include: {
      respostas: {
        orderBy: { criadoEm: "desc" },
        take: 20,
        include: { sessao: { select: { titulo: true, ancora: true } } },
      },
      interacoes: {
        orderBy: { criadoEm: "desc" },
        take: 5,
        select: { resumo: true },
      },
      perfilCognitivo: true,
    },
  });

  if (!aluno) return NextResponse.json({ error: "Aluno não encontrado." }, { status: 404 });

  const totalRespostas = aluno.respostas.length;
  const tempoMedio = totalRespostas > 0
    ? Math.round(aluno.respostas.reduce((acc, r) => acc + r.tempoEscrita, 0) / totalRespostas / 1000)
    : 0;
  const alertas = aluno.respostas.filter((r) => r.sinalEmocional === "alerta").length;
  const mediaAlinhamento = aluno.respostas.filter((r) => r.alinhamentoBNCC).length > 0
    ? aluno.respostas.reduce((acc, r) => acc + (r.alinhamentoBNCC ?? 0), 0) / aluno.respostas.filter((r) => r.alinhamentoBNCC).length
    : null;

  const resumosInteracoes = aluno.interacoes.map((i) => i.resumo).filter(Boolean).join(". ");
  const temasEstudados = [...new Set(aluno.respostas.map((r) => r.sessao.ancora))].slice(0, 5).join(", ");

  const prompt = `Você é um professor experiente escrevendo um parecer de conselho de classe.

DADOS DO ALUNO: ${aluno.nome}
- Total de respostas nas sessões: ${totalRespostas}
- Tempo médio de escrita: ${tempoMedio}s por resposta
- Alertas emocionais detectados: ${alertas}
- Alinhamento médio BNCC: ${mediaAlinhamento ? `${(mediaAlinhamento * 100).toFixed(0)}%` : "não calculado"}
- Temas estudados: ${temasEstudados || "sem dados"}
- Resumos das sessões recentes: ${resumosInteracoes || "sem resumos disponíveis"}
- Perfil cognitivo: ${aluno.perfilCognitivo?.tipoRaciocinio ?? "não identificado"}

Escreva um parecer de conselho de classe em português brasileiro para este aluno.
O parecer deve:
1. Ter 3-4 parágrafos
2. Mencionar pontos fortes observados nas sessões
3. Indicar áreas de desenvolvimento
4. Ser respeitoso, construtivo e baseado nos dados
5. NÃO inventar informações — use apenas os dados fornecidos
6. Terminar com uma recomendação clara

Após o parecer, na última linha, escreva apenas: STATUS: APROVADO, STATUS: RECUPERACAO ou STATUS: REPROVADO`;

  const resposta = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 800,
    messages: [{ role: "user", content: prompt }],
  });

  const texto = resposta.choices[0]?.message?.content ?? "";

  // Extrai status sugerido
  let statusSugerido = "APROVADO";
  if (texto.includes("STATUS: RECUPERACAO")) statusSugerido = "RECUPERACAO";
  if (texto.includes("STATUS: REPROVADO")) statusSugerido = "REPROVADO";

  // Remove a linha de status do texto do parecer
  const parecerLimpo = texto.replace(/STATUS: (APROVADO|RECUPERACAO|REPROVADO)/, "").trim();

  return NextResponse.json({ parecer: parecerLimpo, statusSugerido });
}
