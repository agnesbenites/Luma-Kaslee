import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const [
      totalTurmas,
      totalProfessores,
      totalAlunos,
      totalSessoesAbertas,
      totalInteracoes,
      sessoesUltimos30,
    ] = await Promise.all([
      prisma.turma.count(),
      prisma.professor.count(),
      prisma.aluno.count(),
      prisma.sessao.count({ where: { status: "ABERTA" } }),
      prisma.interacao.count(),
      prisma.sessao.findMany({
        where: { criadoEm: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        select: { criadoEm: true },
        orderBy: { criadoEm: "asc" },
      }),
    ]);

    return NextResponse.json({
      totalTurmas,
      totalProfessores,
      totalAlunos,
      totalSessoesAbertas,
      totalInteracoes,
      sessoesUltimos30: sessoesUltimos30.map((s) => ({
        criadoEm: s.criadoEm.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[GET /api/escola/metricas]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}