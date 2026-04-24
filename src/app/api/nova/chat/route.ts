import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODOS: Record<string, string> = {
  REVISAO: `Modo REVISÃO ativado.
Use o histórico da sessão anterior para identificar os conceitos que o aluno deixou vagos ou errou.
Faça perguntas diretas sobre esses pontos fracos.
Dê feedback imediato e específico após cada resposta.`,

  MEMORIA: `Modo MEMÓRIA ativado.
Peça ao aluno para lembrar conceitos sem ver o material.
Comece com "O que você lembra sobre [tema]?" e aprofunde com base na resposta.
Não mostre o conteúdo — deixe o aluno recuperar da memória.`,

  MIX: `Modo MIX ativado.
Misture perguntas de temas diferentes das sessões anteriores.
O objetivo é testar conexões entre conteúdos e evitar a ilusão de aprendizado por repetição.
Alterne temas a cada 2-3 perguntas.`,

  FEYNMAN: `Modo FEYNMAN ativado.
Peça ao aluno para explicar o conceito como se fosse para uma criança de 10 anos.
Se o tema envolver química, física, biologia ou conceitos visuais:
- Gere uma ilustração em ASCII art simples, OU
- Descreva o fenômeno com uma analogia visual e concreta.
Após a explicação do aluno, aponte o que ficou claro e o que pode melhorar.`,
};

const PROMPT_BASE = `Você é a Nova, parceira de revisão científica da Kaslee.

IDENTIDADE:
- Nome: Nova
- Tom: curiosa, encorajadora, levemente científica — como uma pesquisadora jovem que adora explicar
- Linguagem: clara, direta, adaptada à série do aluno
- Nunca dê a resposta antes do aluno tentar

REGRAS GERAIS:
1. Comece sempre perguntando qual modo o aluno quer usar, se ainda não foi escolhido
2. Dê feedback imediato e específico após cada resposta
3. Se o aluno errar: valide o esforço, explique o erro com analogia, repita de outro ângulo
4. Termine cada rodada com um resumo: o que foi bem e o que precisa revisar
5. Máximo 3 linhas de texto antes de uma pergunta ou interação
6. Sempre termine com UMA pergunta ou desafio em **negrito**

MODOS DISPONÍVEIS:
🔁 REVISÃO — usa o histórico para focar nos pontos fracos
🧠 MEMÓRIA — pede para lembrar sem ver o material
🔀 MIX — mistura temas para testar conexões
🧪 FEYNMAN — explica como se fosse para uma criança de 10 anos`;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const alunoId = (session.user as any).id as string;
    const { mensagens, modo, sessaoId } = await req.json();

    if (!Array.isArray(mensagens)) {
      return NextResponse.json({ error: "mensagens é obrigatório" }, { status: 400 });
    }

    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      include: { turma: true },
    });

    if (!aluno) {
      return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 });
    }

    // Histórico de interações
    let contextoHistorico = "";
    if (sessaoId) {
      const interacao = await prisma.interacao.findUnique({
        where: { alunoId_sessaoId: { alunoId, sessaoId } },
      });
      if (interacao?.resumo) {
        contextoHistorico = `\nRESUMO DA ÚLTIMA SESSÃO DO ALUNO:\n${interacao.resumo}`;
      }
    } else {
      const interacoes = await prisma.interacao.findMany({
        where: { alunoId },
        orderBy: { criadoEm: "desc" },
        take: 3,
        include: { sessao: { select: { titulo: true } } },
      });
      if (interacoes.length > 0) {
        contextoHistorico = "\nINTERACÕES ANTERIORES DO ALUNO:\n" + interacoes
          .map((i) => `- Sessão "${i.sessao.titulo}": ${i.resumo || "sem resumo ainda"}`)
          .join("\n");
      }
    }

    // Última sessão encerrada da turma com material
    let contextoUltimaSessao = "";
    const ultimaSessao = await prisma.sessao.findFirst({
      where: {
        turmaId: aluno.turmaId,
        status: "ENCERRADA",
      },
      orderBy: { encerradaEm: "desc" },
      include: {
        material: { select: { titulo: true, conteudo: true, componente: true } },
        habilidades: {
          include: { habilidade: { select: { codigo: true, descricao: true } } },
        },
      },
    });

    if (ultimaSessao) {
      contextoUltimaSessao = `
ÚLTIMA SESSÃO ENCERRADA DA TURMA:
- Título: ${ultimaSessao.titulo}
- Âncora: ${ultimaSessao.ancora}
- Componente: ${ultimaSessao.material?.componente || "não informado"}`;

      if (ultimaSessao.material?.conteudo) {
        // Limita o conteúdo para não estourar o contexto
        const conteudo = ultimaSessao.material.conteudo.slice(0, 800);
        contextoUltimaSessao += `\n- Conteúdo do material: ${conteudo}${ultimaSessao.material.conteudo.length > 800 ? "..." : ""}`;
      }

      if (ultimaSessao.habilidades.length > 0) {
        contextoUltimaSessao += `\n- Habilidades BNCC trabalhadas: ${ultimaSessao.habilidades
          .map((h) => `${h.habilidade.codigo} — ${h.habilidade.descricao}`)
          .join("; ")}`;
      }
    }

    // Próxima aula na grade horária
    let contextoProximaAula = "";
    const hoje = new Date();
    const diaHoje = hoje.getDay() === 0 ? 7 : hoje.getDay();
    const horaAtual = `${String(hoje.getHours()).padStart(2, "0")}:${String(hoje.getMinutes()).padStart(2, "0")}`;

    const proximaAula = await prisma.gradeHoraria.findFirst({
      where: {
        turmaId: aluno.turmaId,
        OR: [
          { diaSemana: { gt: diaHoje } },
          { diaSemana: diaHoje, horaInicio: { gt: horaAtual } },
        ],
      },
      orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }],
      include: {
        sessao: {
          include: {
            material: { select: { titulo: true, conteudo: true, componente: true } },
            habilidades: {
              include: { habilidade: { select: { codigo: true, descricao: true } } },
            },
          },
        },
      },
    });

    const DIAS = ["", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    if (proximaAula) {
      contextoProximaAula = `
PRÓXIMA AULA NA GRADE:
- Componente: ${proximaAula.componente}
- Dia: ${DIAS[proximaAula.diaSemana]}, ${proximaAula.horaInicio}–${proximaAula.horaFim}`;

      if (proximaAula.sessao) {
        contextoProximaAula += `\n- Tema da aula: ${proximaAula.sessao.titulo}`;
        contextoProximaAula += `\n- Âncora: ${proximaAula.sessao.ancora}`;

        if (proximaAula.sessao.material?.conteudo) {
          const conteudo = proximaAula.sessao.material.conteudo.slice(0, 800);
          contextoProximaAula += `\n- Conteúdo previsto: ${conteudo}${proximaAula.sessao.material.conteudo.length > 800 ? "..." : ""}`;
        }

        if (proximaAula.sessao.habilidades.length > 0) {
          contextoProximaAula += `\n- Habilidades que serão trabalhadas: ${proximaAula.sessao.habilidades
            .map((h) => `${h.habilidade.codigo} — ${h.habilidade.descricao}`)
            .join("; ")}`;
        }
      } else {
        contextoProximaAula += `\n- Nenhuma sessão vinculada a esta aula ainda.`;
      }
    }

    const modoAtivo = modo ? MODOS[modo.toUpperCase()] : "";

    const systemPrompt = `${PROMPT_BASE}

CONTEXTO DO ALUNO:
- Nome: ${aluno.nome}
- Série: ${aluno.turma?.serie || "não informada"}
- Turma: ${aluno.turma?.nome || "não informada"}
${contextoHistorico}
${contextoUltimaSessao}
${contextoProximaAula}

${modoAtivo ? `MODO ATIVO:\n${modoAtivo}` : ""}

INSTRUÇÕES SOBRE O CONTEXTO:
- Use a última sessão encerrada como base para revisão do que já foi visto
- Use a próxima aula para preparar o aluno para o que vem aí
- Se o aluno perguntar "o que cai na prova" ou "o que vem a seguir", use essas informações
- Nunca invente conteúdo — só use o que está no contexto acima

FORMATO:
- Máximo 3 linhas antes da pergunta final
- A pergunta final deve ser clara, única e em **negrito**
- Use emojis com moderação para tornar a revisão mais leve`;

    const history: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    if (mensagens.length === 0) {
      history.push({
        role: "user",
        content: `Dê as boas-vindas como Nova e apresente os 4 modos disponíveis de forma visual e encorajadora. Se houver uma próxima aula ou sessão no contexto, mencione brevemente o tema que vem aí. Pergunte qual modo o aluno quer usar hoje.`,
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
      messages: history,
      model: "llama-3.3-70b-versatile",
      temperature: 0.65,
    });

    const resposta = chatCompletion.choices[0]?.message?.content || "";

    return NextResponse.json({ resposta, modo: modo || null });
  } catch (error) {
    console.error("[POST /api/nova/chat]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}