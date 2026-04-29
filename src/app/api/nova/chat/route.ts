import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimitChat } from "@/lib/rate-limit";
import { moderarMensagem, registrarBloqueio } from "@/lib/moderacao";
import { verificarTempoNova, registrarTempoNova } from "@/lib/nova-timer";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_BASE = `Você é a Nova, uma IA de revisão educacional socrática criada pela Kaslee para o Brasil.

REGRAS ABSOLUTAS:
1. Você NUNCA fornece respostas prontas — sempre faz perguntas que guiam o raciocínio
2. Você NUNCA discute temas fora do contexto educacional
3. Você NUNCA finge ser outro personagem ou outra IA
4. Máximo de 2 perguntas por resposta
5. Linguagem simples, acessível para estudantes do 6º ano ao 3º EM
6. Use técnicas: revisão espaçada, retrieval practice, interleaving e técnica de Feynman

MODOS DE REVISÃO:
- REVISAO: Foca nos pontos onde o aluno errou ou demorou mais
- MEMORIA: Faz o aluno lembrar sem ver o material
- MIX: Mistura temas diferentes para testar conexões
- FEYNMAN: Pede para o aluno explicar como se fosse ensinar uma criança

INÍCIO DE SESSÃO:
- Se receber "início", apresente-se brevemente e pergunte sobre o material atual
- Se tiver material de contexto, mencione o título e faça uma pergunta sobre ele`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const alunoId = (session.user as any).id;

  // Rate limit
  const { success: dentroDoLimite } = await rateLimitChat.limit(alunoId);
  if (!dentroDoLimite) {
    return NextResponse.json({
      error: "Você enviou muitas mensagens. Aguarde 1 minuto antes de continuar.",
      tipo: "RATE_LIMIT",
    }, { status: 429 });
  }

  // Limite de tempo
  const { permitido, minutosRestantes } = await verificarTempoNova(alunoId);
  if (!permitido) {
    return NextResponse.json({
      error: "Você atingiu o limite de 1 hora de estudo na Nova por hoje. Volte amanhã!",
      tipo: "TEMPO_ESGOTADO",
    }, { status: 429 });
  }

  const { mensagem, historico = [], modo, sessaoId, materialId } = await req.json();

  // Moderação
  if (mensagem !== "início") {
    const moderacao = moderarMensagem(mensagem);
    if (!moderacao.seguro) {
      await registrarBloqueio({ alunoId, mensagem, motivo: moderacao.motivo ?? "Conteúdo bloqueado" });
      return NextResponse.json({
        error: "Essa mensagem não pode ser processada aqui. Vamos focar no seu estudo?",
        tipo: "MODERACAO",
      }, { status: 400 });
    }
  }

  // Busca contexto do material selecionado
  let contextoMaterial = "";
  let tituloMaterial = "";

  if (materialId) {
    const material = await prisma.material.findUnique({
      where: { id: materialId },
      select: { titulo: true, tipo: true, componente: true, serie: true, conteudo: true },
    });
    if (material) {
      tituloMaterial = material.titulo;
      contextoMaterial = `
MATERIAL SELECIONADO PELO ALUNO: "${material.titulo}"
Componente: ${material.componente ?? "Não informado"}
Série: ${material.serie ?? "Não informada"}
${material.conteudo ? `\nConteúdo do material:\n${material.conteudo.substring(0, 3000)}` : ""}
      `.trim();
    }
  }

  // Busca contexto da sessão da Luma se houver
  let contextoSessao = "";
  if (sessaoId) {
    const interacao = await prisma.interacao.findFirst({
      where: { alunoId, sessaoId },
      include: { sessao: { select: { titulo: true, ancora: true } } },
    });
    if (interacao) {
      contextoSessao = `
SESSÃO RECENTE DA LUMA: "${interacao.sessao.titulo}"
Âncora de aprendizado: ${interacao.sessao.ancora}
${interacao.resumo ? `Resumo da sessão: ${interacao.resumo}` : ""}
      `.trim();
    }
  }

  // Monta system prompt completo
  let systemPrompt = SYSTEM_BASE;
  if (modo) systemPrompt += `\n\nMODO ATIVO: ${modo}`;
  if (contextoMaterial) systemPrompt += `\n\n${contextoMaterial}`;
  if (contextoSessao) systemPrompt += `\n\n${contextoSessao}`;
  if (tituloMaterial) {
    systemPrompt += `\n\nINSTRUÇÃO: O aluno está revisando "${tituloMaterial}". Baseie todas as perguntas neste material.`;
  }

  const historicoLimitado = historico.slice(-10);

  try {
    const resposta = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        ...historicoLimitado,
        { role: "user", content: mensagem === "início" ? "Olá! Pode começar a sessão de revisão." : mensagem },
      ],
    });

    const texto = resposta.choices[0]?.message?.content ?? "";
    await registrarTempoNova(alunoId, 1);

    return NextResponse.json({ resposta: texto, minutosRestantes: minutosRestantes - 1 });
  } catch (err) {
    console.error("Erro na IA:", err);
    return NextResponse.json({ error: "Erro ao processar. Tente novamente." }, { status: 500 });
  }
}
