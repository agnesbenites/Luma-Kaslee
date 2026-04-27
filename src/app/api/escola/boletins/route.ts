import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const escolaId = (session.user as any).id;

  const turmas = await prisma.turma.findMany({
    where: { escolaId },
    include: {
      alunos: { select: { id: true, nome: true, email: true } },
    },
  });

  const resultado = turmas.map((t) => ({
    id: t.id,
    nome: t.nome,
    serie: t.serie,
    alunos: t.alunos.map((a) => ({
      id: a.id,
      nome: a.nome,
      turma: t.nome,
      serie: t.serie,
      status: "PENDENTE",
      mediaGeral: 0,
      faltas: 0,
      conselho: null,
      compartilhadoPais: false,
    })),
  }));

  return NextResponse.json(resultado);
}
