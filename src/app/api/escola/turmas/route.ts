import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const escolaId = (session.user as any).id;
  const turmas = await prisma.turma.findMany({
    where: { escolaId },
    include: { professor: { select: { nome: true } }, _count: { select: { alunos: true } } },
  });
  return NextResponse.json(turmas);
}
