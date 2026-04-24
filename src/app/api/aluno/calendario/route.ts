import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const alunoId = (session?.user as any)?.id;

  if (!session || !alunoId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      select: { turmaId: true },
    });

    if (!aluno) {
      return NextResponse.json({ error: "Aluno não encontrado" }, { status: 404 });
    }

    const atividades = await prisma.atividadeAgendada.findMany({
      where: { turmaId: aluno.turmaId },
      orderBy: { data: "asc" },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        data: true,
        status: true,
        turma: {
          select: { id: true, nome: true, serie: true },
        },
        sessao: {
          select: { id: true, titulo: true, status: true },
        },
      },
    });

    const eventos = atividades.map((a) => ({
      id: a.id,
      titulo: a.titulo,
      descricao: a.descricao ?? null,
      inicio: a.data.toISOString(),
      fim: null,
      cor: null,
      tipo: a.status,
      turma: a.turma,
      sessao: a.sessao,
    }));

    return NextResponse.json({ eventos });
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}