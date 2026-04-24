import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { sessaoId, respostaAluno, turno, historico, material } = await req.json();

  const promptSistema = `Você é a Luma, uma IA socrática educacional.
Sua única função é fazer perguntas. Nunca dê respostas, nunca elogie, nunca corrija diretamente.
Aprofunde o raciocínio do aluno com uma única pergunta curta e provocadora.
Use linguagem simples e direta, adequada para alunos do ensino fundamental e médio.
${material ? `\nMaterial de referência da aula:\n${material}` : ""}`;

  const mensagens: Anthropic.MessageParam[] = [
    ...historico,
    { role: "user", content: respostaAluno },
  ];

  const response = await claude.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 300,
    system: promptSistema,
    messages: mensagens,
  });

  const pergunta = (response.content[0] as Anthropic.TextBlock).text;

  // Salva a interação no banco
  await prisma.interacao.create({
    data: {
      pergunta: turno === 1 ? "Resposta inicial do aluno" : historico[historico.length - 2]?.content ?? "",
      resposta: respostaAluno,
      turno,
      alunoId: session.user.id,
      sessaoId,
    },
  });

  return NextResponse.json({ pergunta });
}