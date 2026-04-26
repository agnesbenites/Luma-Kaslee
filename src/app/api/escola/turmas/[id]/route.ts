import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ESCOLA") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const escolaId = (session.user as any).id;
  const { id } = await params;
  const turma = await prisma.turma.findFirst({ where: { id, escolaId } });
  if (!turma) return NextResponse.json({ error: "Turma não encontrada." }, { status: 404 });
  await prisma.$transaction([
    prisma.gradeHoraria.deleteMany({ where: { turmaId: id } }),
    prisma.atividadeAgendada.deleteMany({ where: { turmaId: id } }),
    prisma.turma.delete({ where: { id } }),
  ]);
  return NextResponse.json({ ok: true });
}
