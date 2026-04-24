import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PROMPTS: Record<string, string> = {
  SOCRATICO: `Você é a Luma, tutora socrática da Kaslee.
Seu papel não é ensinar — é fazer o aluno descobrir por conta própria.

IDENTIDADE:
- Tom: calorosa, paciente, levemente curiosa — como uma amiga mais velha inteligente
- Linguagem: adaptada para a série do aluno (evite jargões, use exemplos do cotidiano)
- Nunca seja condescendente. Nunca elogie de forma vazia.

REGRAS INEGOCIÁVEIS:
1. NUNCA dê a resposta direta. Se sentir vontade de explicar, transforme a explicação numa pergunta.
2. Termine SEMPRE com exatamente UMA pergunta socrática, em **negrito**.
3. Se o aluno errar: não corrija. Faça uma pergunta que o leve a perceber a contradição.
4. Se o aluno demonstrar frustração: acolha primeiro, depois ofereça uma pista em forma de pergunta.`,

  SCAFFOLDING: `Você é a Luma, uma tutora que usa scaffolding pedagógico.

Seu papel é apoiar o aluno em etapas progressivas:
- comece com mais apoio
- reduza a ajuda aos poucos
- ofereça pistas claras, mas sem entregar a resposta final
- adapte o nível de ajuda à dificuldade percebida

REGRAS:
1. Não dê a resposta pronta.
2. Quebre o raciocínio em passos pequenos.
3. Faça uma pergunta no final que leve o aluno ao próximo passo.
4. Se necessário, ofereça uma dica curta antes da pergunta final.`,

  PBL: `Você é a Luma, tutora que trabalha com aprendizagem baseada em problemas.

Seu papel é:
- apresentar o problema com clareza
- ajudar o aluno a analisar possibilidades
- desafiar hipóteses
- estimular solução prática e contextualizada

REGRAS:
1. Não entregue a solução pronta.
2. Traga o aluno de volta ao problema real.
3. Faça perguntas que ajudem a testar as hipóteses.
4. Termine com uma pergunta que aprofunde a investigação.`,

  REFLEXIVO: `Você é a Luma, tutora que usa diálogo reflexivo.

Seu papel é:
- acolher o aluno
- ajudá-lo a verbalizar o que já sabe
- reduzir bloqueios
- construir confiança antes de avançar

REGRAS:
1. Comece com acolhimento quando necessário.
2. Reflita a fala do aluno antes de avançar.
3. Não corrija de forma seca.
4. Termine com uma pergunta que ajude o aluno a organizar o pensamento.`,

  DEBATE: `Você é a Luma, tutora que usa debate estruturado.

Seu papel é:
- provocar argumentação
- explorar contrapontos
- testar a consistência das ideias
- estimular defesa de posição com lógica

REGRAS:
1. Não dê a resposta pronta.
2. Se o aluno disser algo, responda com um contraponto ou pergunta desafiadora.
3. Incentive justificativas e evidências.
4. Termine com uma pergunta que force o refinamento da argumentação.`,
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const alunoId = (session.user as any).id as string;
    const { sessaoId, mensagens, encerrar } = await req.json();

    if (!sessaoId || !Array.isArray(mensagens)) {
      return NextResponse.json(
        { error: "sessaoId e mensagens são obrigatórios" },
        { status: 400 }
      );
    }

    const sessao = await prisma.sessao.findUnique({
      where: { id: sessaoId },
      include: {
        turma: true,
        habilidades: {
          include: {
            habilidade: true,
          },
        },
      },
    });

    if (!sessao) {
      return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 });
    }

    if (sessao.status !== "ABERTA") {
      return NextResponse.json({ error: "Sessão não está aberta" }, { status: 403 });
    }

    const metodo = (sessao.metodo || "SOCRATICO").toUpperCase();
    const systemPromptBase = PROMPTS[metodo] || PROMPTS.SOCRATICO;

    const systemPrompt = `${systemPromptBase}

CONTEXTO DESTA SESSÃO:
- Tema: "${sessao.titulo}"
- Âncora: "${sessao.ancora}"
- Série: "${sessao.turma.serie}"

FORMATO:
- Máximo 4 linhas de texto antes da pergunta final
- A pergunta final deve ser clara e única`;

    if (encerrar) {
      const historico = mensagens
        .map((m: any) => `${m.role === "aluno" ? "Aluno" : "Luma"}: ${m.content}`)
        .join("\n");

      const interacaoExistente = await prisma.interacao.findUnique({
        where: { alunoId_sessaoId: { alunoId, sessaoId } },
      });

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente pedagógico que resume sessões de aprendizado.",
          },
          {
            role: "user",
            content: `Gere um resumo estruturado em até 200 palavras sobre os aprendizados desenvolvidos pelo aluno neste diálogo. Destaque o que ele demonstrou compreender e o que ainda precisa aprofundar. Seja direto e use linguagem clara.

Diálogo:
${historico}`,
          },
        ],
        temperature: 0.3,
      });

      const resumo = response.choices[0]?.message?.content || "";

      await prisma.interacao.upsert({
        where: { alunoId_sessaoId: { alunoId, sessaoId } },
        update: { resumo, historico: JSON.stringify(mensagens) },
        create: {
          alunoId,
          sessaoId,
          resumo,
          historico: JSON.stringify(mensagens),
        },
      });

      const primeiraConclusao = !interacaoExistente?.resumo;
      const habilidadesDaSessao = sessao.habilidades ?? [];

      if (primeiraConclusao && habilidadesDaSessao.length > 0) {
        await prisma.$transaction(
          habilidadesDaSessao.map((item) =>
            prisma.progressoHabilidade.upsert({
              where: {
                alunoId_habilidadeId: {
                  alunoId,
                  habilidadeId: item.habilidadeId,
                },
              },
              update: {
                evidencias: { increment: 1 },
                status: "EM_ANDAMENTO",
              },
              create: {
                alunoId,
                habilidadeId: item.habilidadeId,
                status: "EM_ANDAMENTO",
                evidencias: 1,
              },
            })
          )
        );
      }

      return NextResponse.json({ resumo });
    }

    const history: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    if (mensagens.length === 0) {
      history.push({
        role: "user",
        content: `Dê as boas-vindas e faça UMA pergunta inicial em **negrito** sobre "${sessao.titulo}" baseada na âncora "${sessao.ancora}".`,
      });
    } else {
      mensagens.forEach((m: any) => {
        history.push({
          role: m.role === "aluno" ? "user" : "assistant",
          content: m.content,
        });
      });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: history as any,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const resposta = chatCompletion.choices[0]?.message?.content || "";

    const todasMensagens = [...mensagens, { role: "luma", content: resposta }];

    await prisma.interacao.upsert({
      where: { alunoId_sessaoId: { alunoId, sessaoId } },
      update: { historico: JSON.stringify(todasMensagens) },
      create: {
        alunoId,
        sessaoId,
        historico: JSON.stringify(todasMensagens),
        resumo: "",
      },
    });

    return NextResponse.json({ resposta });
  } catch (error) {
    console.error("[POST /api/sessao/chat]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}