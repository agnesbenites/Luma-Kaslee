import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    const alunoId = session?.user?.id as string | undefined;

    if (!session || !alunoId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      include: { turma: true },
    });

    if (!aluno) {
      return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 });
    }

    const sessoes = await prisma.sessao.findMany({
      where: {
        turmaId: aluno.turmaId,
        status: "ABERTA",
      },
      orderBy: { criadoEm: "asc" },
      take: 20,
    });

    const agora = new Date();

    const eventos = sessoes.map((s: any, index: number) => {
      const base = new Date(agora);
      base.setDate(base.getDate() + index);
      base.setHours(8 + (index % 5) * 2, 0, 0, 0);

      const fim = new Date(base);
      fim.setMinutes(fim.getMinutes() + 50);

      const cores = ["#7C67F0", "#F5A623", "#4A90E2", "#10B981"];

      return {
        id: s.id,
        titulo: s.titulo,
        descricao: s.ancora,
        inicio: base.toISOString(),
        fim: fim.toISOString(),
        cor: cores[index % cores.length],
        tipo: "sessao",
        turma: aluno.turma
          ? {
              id: aluno.turma.id,
              nome: aluno.turma.nome,
              serie: aluno.turma.serie,
            }
          : null,
        sessao: {
          id: s.id,
          titulo: s.titulo,
          status: s.status,
        },
      };
    });

    return NextResponse.json({ eventos });
  } catch (error) {
    console.error("[GET /api/aluno/calendario]", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}