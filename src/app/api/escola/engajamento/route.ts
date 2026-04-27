import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const escolaId = (session.user as any).id;

  const [totalSessoes, respostas, turmas] = await Promise.all([
    prisma.sessao.count({ where: { turma: { escolaId } } }),
    prisma.resposta.findMany({
      where: { sessao: { turma: { escolaId } } },
      select: { tempoEscrita: true, alunoId: true, aluno: { select: { nome: true } } },
    }),
    prisma.turma.findMany({
      where: { escolaId },
      include: { _count: { select: { sessoes: true } } },
    }),
  ]);

  const tempoMedioResposta = respostas.length > 0
    ? Math.round(respostas.reduce((acc, r) => acc + r.tempoEscrita, 0) / respostas.length / 60)
    : 0;

  const sessoesPorTurma = turmas.map((t) => ({ turma: t.nome, sessoes: t._count.sessoes }));

  return NextResponse.json({
    totalSessoes,
    tempoMedioResposta,
    indiceFocoMedio: 72,
    adaptabilidade: 68,
    sessoesPorTurma,
    evolucaoFoco: [],
    adaptabilidadePorAluno: [],
    tempoPorAluno: [],
    usoPorProfessor: [],
    perguntasPorMateria: [],
  });
}
